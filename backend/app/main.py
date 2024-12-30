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

from fastapi import FastAPI, UploadFile, Form, Header, Request
from fastapi.responses import Response, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .services.extractor import ImageProcessor
from .services.rate_limiter import check_rate_limit, consume_rate_limit
from .utils.auth import verify_token
from .utils.error_handler import (
    file_error,
    processing_error,
    validation_error,
    rate_limit_error,
    unauthorized_error,
    AppError,
)
from typing import Optional
import os
from .core.settings import settings

app = FastAPI(title="Picture Outline API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Object Border Effect API is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/rate-limit")
async def get_rate_limit(authorization: Optional[str] = Header(None)):
    """Get rate limit information for a user"""
    try:
        # Verify JWT token
        try:
            user_id, plan = verify_token(authorization)
        except ValueError as e:
            raise unauthorized_error(str(e))

        return JSONResponse(check_rate_limit(user_id, plan))
    except Exception as e:
        if isinstance(e, AppError):
            raise e
        raise rate_limit_error(message="Failed to get rate limit info", details=str(e))


@app.post("/process")
async def process_image(
    request: Request,
    image: UploadFile,
    border_color: str = Form(default="white"),
    border_size: int = Form(default=20),
    outline_style: str = Form(default="hollow"),
    authorization: Optional[str] = Header(None),
):
    """
    Process an image to add a border effect around the main object
    - image: Input image file (PNG/JPG, max 10MB)
    - border_color: Color of the border (default: white)
    - border_size: Thickness of the border in pixels (default: 20)
    - outline_style: Style of the outline (hollow/filled, default: hollow)
    """
    try:
        # Verify JWT token first
        try:
            user_id, plan = verify_token(authorization)
        except ValueError as e:
            raise unauthorized_error(str(e))

        # Check file size
        file_size = 0
        chunk_size = 1024
        while chunk := await image.read(chunk_size):
            file_size += len(chunk)
            if file_size > settings.MAX_FILE_SIZE:
                raise file_error(
                    message="File too large",
                    details=f"Maximum file size is {settings.MAX_FILE_SIZE // (1024 * 1024)}MB",
                )

        await image.seek(0)

        # Check rate limit
        rate_limit_info = check_rate_limit(user_id, plan)
        if rate_limit_info["remaining"] <= 0:
            raise rate_limit_error(
                message=f"Rate limit exceeded. Resets in {rate_limit_info['reset']} seconds",
                details=rate_limit_info,
            )

        # Validate image
        if not image.content_type.startswith("image/"):
            raise file_error(
                message="Invalid file type", details="File must be an image (PNG/JPG)"
            )

        # Read image data
        image_data = await image.read()

        # Process the image
        try:
            result = await ImageProcessor.process_image(
                image_data, border_color, border_size, outline_style
            )
        except ValueError as e:
            raise validation_error(
                message=str(e), details="Invalid processing parameters"
            )
        except Exception as e:
            raise processing_error(message="Failed to process image", details=str(e))

        # Consume rate limit for free users
        if plan != "pro" and result:
            print("Consuming rate limit")
            response = consume_rate_limit(user_id, plan)
            print("Rate limit consumed: ", response)
            if not response.allowed:
                raise rate_limit_error(
                    message="Rate limit exceeded during processing",
                    details=response,
                )

        # Return processed image
        filename = os.path.splitext(image.filename)[0]

        # Set content disposition header for the response
        headers = {
            "Content-Disposition": f'attachment; filename="{filename}_bordered.png"'
        }

        # Return the processed image with the custom filename
        return Response(content=result, media_type="image/png", headers=headers)

    except Exception as e:
        if isinstance(e, AppError):
            raise e
        raise processing_error(message="An unexpected error occurred", details=str(e))
