from PIL import Image, ImageDraw, ImageEnhance
from rembg import remove, new_session
import io
import numpy as np
import cv2
from enum import Enum


class OutlineStyle(Enum):
    HOLLOW = "hollow"  # Double line with transparent middle
    FILLED = "filled"  # Single solid outline


class ImageProcessor:
    def __init__(self):
        # Initialize rembg session with u2net model (good for general objects)
        self.session = new_session("u2net")

    @staticmethod
    def preprocess_image(image: Image.Image) -> Image.Image:
        """
        Preprocess image to improve contrast and normalize lighting
        Time Complexity: O(n) where n is the number of pixels
        """
        # Convert to LAB color space for better contrast handling
        img_array = np.array(image)
        lab = cv2.cvtColor(img_array, cv2.COLOR_RGB2LAB)

        # Normalize L channel
        l_channel = lab[:, :, 0]
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        cl = clahe.apply(l_channel)

        # Update L channel
        lab[:, :, 0] = cl

        # Convert back to RGB
        enhanced_img_array = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
        return Image.fromarray(enhanced_img_array)

    @staticmethod
    async def extract_object(image_data: bytes) -> tuple[Image.Image, Image.Image]:
        """
        Extract any object from image using rembg (U2Net)
        Returns both original image and the mask
        Time Complexity: O(n) where n is the number of pixels
        """
        # Load image into memory
        input_image = Image.open(io.BytesIO(image_data))

        # Preprocess image for better mask detection
        preprocessed_image = ImageProcessor.preprocess_image(input_image)

        # Get alpha mask from rembg with parameters optimized for general objects
        mask = remove(
            preprocessed_image,
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=10,
            alpha_matting_erode_size=10,
            only_mask=True,
        )

        # Ensure mask is same size as original image
        mask = Image.fromarray(np.array(mask)).resize(
            input_image.size, Image.Resampling.LANCZOS
        )

        return input_image, mask

    @staticmethod
    def add_border(
        original: Image.Image,
        mask: Image.Image,
        border_color: str,
        border_size: int,
        style: OutlineStyle = OutlineStyle.HOLLOW,
    ) -> Image.Image:
        """
        Add border around the extracted object with specified style
        Time Complexity: O(n) where n is the number of pixels
        """
        # Convert PIL mask to cv2 format
        mask_array = np.array(mask)

        # Ensure proper binary mask
        _, mask_array = cv2.threshold(mask_array, 127, 255, cv2.THRESH_BINARY)

        # Find contours for smoother border
        contours, _ = cv2.findContours(
            mask_array, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
        )

        # Create empty mask for border
        border = np.zeros_like(mask_array)

        if style == OutlineStyle.HOLLOW:
            # Draw hollow border (double line effect)
            for contour in contours:
                # Draw outer edge
                cv2.drawContours(border, [contour], -1, 255, border_size * 2)
                # Create hollow effect by subtracting inner area
                cv2.drawContours(border, [contour], -1, 0, border_size)
        else:  # FILLED style (single solid outline)
            # Draw single solid outline
            for contour in contours:
                cv2.drawContours(border, [contour], -1, 255, border_size)

        # Convert border back to PIL Image
        border_mask = Image.fromarray(border)

        # Create border layer
        border_layer = Image.new("RGBA", original.size, border_color)
        border_layer.putalpha(border_mask)

        # Composite the images
        result = Image.alpha_composite(original.convert("RGBA"), border_layer)

        return result

    @staticmethod
    async def process_image(
        image_data: bytes,
        border_color: str,
        border_size: int,
        outline_style: str = "hollow",
    ) -> bytes:
        """
        Main processing pipeline
        """
        # Convert string style to enum
        style = OutlineStyle(outline_style)

        # Extract object mask
        original, mask = await ImageProcessor.extract_object(image_data)

        # Add border effect with specified style
        final_image = ImageProcessor.add_border(
            original, mask, border_color, border_size, style
        )

        # Convert back to bytes
        output_buffer = io.BytesIO()
        final_image.save(output_buffer, format="PNG")
        return output_buffer.getvalue()
