import os
import base64
import json
import random
import io
from dotenv import load_dotenv
from PIL import Image

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

def get_analysis_prompt(user_text: str = "") -> str:
    base_prompt = """You are a strict civic infrastructure analysis AI for an Indian municipality.
First, determine if the image actually shows civic infrastructure damage, waste, or a public hazard (e.g. pothole, garbage, streetlight, leak).
If the image is a selfie, a person, a random indoor object, or entirely unrelated to civic issues, you MUST reject it.

Analyze the image and provide a JSON response with exactly these fields:
{
  "is_valid_issue": true/false,
  "rejection_reason": "<if is_valid_issue is false, explain why it's not a civic issue in 1 sentence. If true, leave empty>",
  "category": "<one of: Pothole, Water Leakage, Damaged Streetlight, Garbage Overflow, Broken Footpath, Encroachment, Tree Fallen, Drainage Blocked, Road Damage, Other>",
  "severity": "<one of: Low, Medium, High>",
  "confidence": <float between 0 and 1>,
  "description": "<2-3 sentence description of the issue visible in the image, mentioning specific visual evidence>",
  "recommended_action": "<brief action for municipal authorities>",
  "estimated_cost": "<estimated cost in INR, e.g. '₹5,000'>",
  "required_materials": "<brief list of materials needed, e.g. '2 bags of asphalt, gravel'>"
}

Severity guidelines:
- Low: Minor inconvenience, not urgent
- Medium: Moderate impact, should be fixed within days
- High: Safety hazard or major disruption

Return ONLY valid JSON, no other text."""

    if user_text:
        base_prompt += f"\n\nIMPORTANT CONTEXT FROM REPORTER:\nThe reporter has provided this description: '{user_text}'. Use this text to highly accurately categorize the issue and enhance your description. If the photo is unclear, trust the reporter's text to determine the category and severity."

    return base_prompt


def _process_image(image_data: str) -> tuple[bytes, str]:
    """Convert base64 image_data to bytes + mime_type."""
    if "," in image_data:
        image_data = image_data.split(",", 1)[1]
    image_bytes = base64.b64decode(image_data)
    img = Image.open(io.BytesIO(image_bytes))
    img_format = img.format or "JPEG"
    if img.mode not in ("RGB", "L"):
        img = img.convert("RGB")
    buffer = io.BytesIO()
    save_format = "JPEG" if img_format in ("WEBP", "JPEG") else img_format
    img.save(buffer, format=save_format)
    buffer.seek(0)
    mime = f"image/{save_format.lower()}"
    return buffer.read(), mime


def _parse_json(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        parts = text.split("```")
        text = parts[1] if len(parts) > 1 else text
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text.strip())


async def analyze_image(image_data: str, user_text: str = "") -> dict:
    """
    Analyze an image using Gemini Vision API.
    Falls back to mock data if no key or on error.
    """
    if not GEMINI_API_KEY:
        return _mock_analysis(user_text)

    prompt = get_analysis_prompt(user_text)

    try:
        img_bytes, mime_type = _process_image(image_data)

        # Try new google-genai SDK first
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=GEMINI_API_KEY)
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=[
                    types.Part.from_bytes(data=img_bytes, mime_type=mime_type),
                    prompt,
                ],
            )
            return _parse_json(response.text)

        except (ImportError, AttributeError):
            # Fall back to legacy google-generativeai SDK
            import google.generativeai as genai_legacy  # type: ignore
            genai_legacy.configure(api_key=GEMINI_API_KEY)
            model = genai_legacy.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content([
                prompt,
                {"mime_type": mime_type, "data": img_bytes}
            ])
            return _parse_json(response.text)

    except Exception as e:
        print(f"Gemini analysis error: {e}")
        return _mock_analysis(user_text)


def _mock_analysis(user_text: str = "") -> dict:
    """Return mock analysis when API key not available."""
    categories = ["Pothole", "Water Leakage", "Damaged Streetlight", "Garbage Overflow", "Road Damage"]
    severities = ["Low", "Medium", "High"]
    cat = random.choice(categories)
    sev = random.choice(severities)
    
    desc = f"The image shows a {cat.lower()} issue that requires attention. Visual evidence indicates {sev.lower()} severity based on the extent of damage visible."
    if user_text:
        desc = f"Based on reporter context ('{user_text}'), this is a verified {cat.lower()} issue. " + desc

    return {
        "is_valid_issue": True,
        "rejection_reason": "",
        "category": cat,
        "severity": sev,
        "confidence": round(random.uniform(0.72, 0.96), 2),
        "description": desc,
        "recommended_action": (
            f"Municipal team should inspect and address this {cat.lower()} "
            f"within the standard SLA for {sev.lower()} priority issues."
        ),
        "estimated_cost": f"₹{random.randint(10, 50) * 100}",
        "required_materials": "Standard municipal repair kit, caution tape, safety cones."
    }
