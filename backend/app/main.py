"""
Portrait Photo Extractor API
Copyright (C) 2024 Kshetez Vinayak

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
"""

from fastapi import FastAPI, UploadFile, HTTPException, Form
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from .services.extractor import ImageProcessor
import os

app = FastAPI(title="Object Border Effect API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Object Border Effect API is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/process")
async def process_image(
    image: UploadFile,
    border_color: str = Form(default="white"),
    border_size: int = Form(default=20),
):
    """
    Process an image to add a border effect around the main object
    - image: Input image file (PNG/JPG)
    - border_color: Color of the border (default: white)
    - border_size: Thickness of the border in pixels (default: 20)
    """
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        print("border_color", border_color, "border_size", border_size)
        # Read image data
        image_data = await image.read()

        # Process the image
        result = await ImageProcessor.process_image(
            image_data, border_color, border_size
        )

        # Get original filename without extension
        filename = os.path.splitext(image.filename)[0]

        # Set content disposition header for the response
        headers = {
            "Content-Disposition": f'attachment; filename="{filename}_bordered.png"'
        }

        # Return the processed image with the custom filename
        return Response(content=result, media_type="image/png", headers=headers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
