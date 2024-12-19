from PIL import Image, ImageDraw
from rembg import remove, new_session
import io
import numpy as np
import cv2


class ImageProcessor:
    def __init__(self):
        # Initialize rembg session with u2net model (good for general objects)
        self.session = new_session("u2net")

    @staticmethod
    async def extract_object(image_data: bytes) -> tuple[Image.Image, Image.Image]:
        """
        Extract any object from image using rembg (U2Net)
        Returns both original image and the mask
        Time Complexity: O(n) where n is the number of pixels
        """
        # Load image into memory
        input_image = Image.open(io.BytesIO(image_data))

        # Get alpha mask from rembg with parameters optimized for general objects
        mask = remove(
            input_image,
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=10,
            alpha_matting_erode_size=10,
            only_mask=True,
        )

        return input_image, mask

    @staticmethod
    def add_border(
        original: Image.Image, mask: Image.Image, border_color: str, border_size: int
    ) -> Image.Image:
        """
        Add simple border around the extracted object
        Time Complexity: O(n) where n is the number of pixels
        """
        # Convert PIL mask to cv2 format
        mask_array = np.array(mask)

        # Clean up the mask - remove noise with more aggressive threshold
        mask_array = cv2.threshold(
            mask_array, 127, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU
        )[1]

        # Create the border
        kernel = cv2.getStructuringElement(
            cv2.MORPH_ELLIPSE, (border_size * 2 + 1, border_size * 2 + 1)
        )
        dilated = cv2.dilate(mask_array, kernel, iterations=1)
        border = cv2.subtract(dilated, mask_array)

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
        image_data: bytes, border_color: str, border_size: int
    ) -> bytes:
        """
        Main processing pipeline
        """
        # Extract object mask
        original, mask = await ImageProcessor.extract_object(image_data)

        # Add border effect
        final_image = ImageProcessor.add_border(
            original, mask, border_color, border_size
        )

        # Convert back to bytes
        output_buffer = io.BytesIO()
        final_image.save(output_buffer, format="PNG")
        return output_buffer.getvalue()
