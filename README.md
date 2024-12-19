# Picture Outline Generator

An AI-powered tool that automatically adds clean outlines to objects in your images. Perfect for creating stand-out visuals, product highlights, and eye-catching content.

## Features
- Automatic object detection and outline generation
- Customizable outline effects (color and thickness)
- Support for PNG/JPG input formats
- Fast, AI-powered processing
- Simple REST API for integration

## Use Cases
- Create eye-catching product images
- Make objects stand out in photos
- Generate sticker-like effects
- Enhance visual content
- Create professional outlines for designs

## Tech Stack
- FastAPI: Web framework for building APIs
- Rembg/U2Net: ML-based person segmentation
- Pillow: Image processing
- Python 3.10+
- uvicorn: ASGI server

## Project Structure
```
portrait_photo/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI application
│   │   └── services/
│   │       └── extractor.py  # Image processing service
│   └── requirements.txt      # Python dependencies
├── frontend/                 # Frontend application (TBD)
└── README.md                # Documentation
```

## API Endpoints
- GET `/`: Health check endpoint
- POST `/process`: Process an image
  - Parameters:
    - `image`: Image file (PNG/JPG)
    - `border_color`: RGB color (default: white)
    - `border_size`: Border thickness in pixels (default: 20)
  - Returns: Processed PNG image with transparent background

## Setup and Installation

### Prerequisites
- Python 3.10 or higher

### Installation Steps
1. Clone the repository
2. Create and activate a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://localhost:8000`

## Development
- Format code:
  ```bash
  pip install black isort
  black .
  isort .
  ```
- Run tests:
  ```bash
  pip install pytest
  pytest
  ```

- curl -X POST "http://localhost:8000/process" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@path/to/file" \
  -F "border_color=#675cba" \
  -F "border_size=2" \
  --output bear.png

## Implementation Details
- Efficient image processing with O(n) time complexity
- Async/await for optimal I/O operations
- Memory-efficient streaming of image data
- Proper error handling and input validation
- CORS enabled for frontend integration

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). This means:

- You can freely use, modify, and distribute this software
- If you modify and use this software in a network service (like a website), you must:
  - Make your source code available to users
  - Include the original copyright notice
  - License your modifications under AGPL-3.0
  - Provide a link to the source code

### Attribution Requirements
When using this code, please include the following attribution:

```
Based on Picture Outline Generator by Kshetez Vinayak
[Link to your repository]
Licensed under AGPL-3.0
```

## Acknowledgments

The landing page code is adapted from [Text Behind Image](https://github.com/RexanWONG/text-behind-image), which is also licensed under AGPL-3.0.