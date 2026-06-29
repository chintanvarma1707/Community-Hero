from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.gemini import analyze_image

router = APIRouter()


class ImageAnalysisRequest(BaseModel):
    image_data: str  # base64 encoded image
    user_text: str = ""


class ImageAnalysisResponse(BaseModel):
    category: str
    severity: str
    confidence: float
    description: str
    recommended_action: str


@router.post("/image", response_model=ImageAnalysisResponse)
async def analyze_issue_image(request: ImageAnalysisRequest):
    """
    Analyze an uploaded image using Gemini Vision API.
    Returns category, severity, confidence, description.
    """
    if not request.image_data:
        raise HTTPException(status_code=400, detail="No image data provided")

    result = await analyze_image(request.image_data, request.user_text)

    return ImageAnalysisResponse(
        category=result.get("category", "Other"),
        severity=result.get("severity", "Low"),
        confidence=result.get("confidence", 0.5),
        description=result.get("description", ""),
        recommended_action=result.get("recommended_action", "")
    )
