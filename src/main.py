"""FastAPI entrypoint defining routes for creating and fetching pitches."""

from __future__ import annotations

import json
from typing import Any, Dict, Optional

from fastapi import Body, Depends, FastAPI, File, Form, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from app.config import Settings, get_settings
from app.schemas import PitchCreateResponse, PitchRecord
from app.supabase_service import SupabaseService


app = FastAPI(title="PitchLab Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_supabase_service(settings: Settings = Depends(get_settings)) -> SupabaseService:
    """Dependency that instantiates the Supabase service."""
    return SupabaseService(settings)


async def _parse_payload(raw_payload: str | bytes) -> Dict[str, Any]:
    """Deserialize the string payload into a PitchPayload instance."""
    if isinstance(raw_payload, bytes):
        raw_payload = raw_payload.decode("utf-8")
    try:
        payload_dict = json.loads(raw_payload)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid JSON payload: {exc.msg}",
        ) from exc
    return payload_dict


async def _resolve_payload(
    payload_str: Optional[str], payload_json: Optional[Dict[str, Any]]
) -> Dict[str, Any]:
    """Return the payload parsed from either form-data or JSON body."""
    if payload_json is not None:
        return payload_json
    if payload_str is not None:
        return await _parse_payload(payload_str)
    return {}


def _ensure_unique_code(service: SupabaseService, *, max_attempts: int = 5) -> str:
    """Generate a random code that does not yet exist in Supabase."""
    for _ in range(max_attempts):
        code = service.generate_code()
        if not service.get_pitch(code):
            return code
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Unable to generate a unique pitch code",
    )


@app.post("/pitches", response_model=PitchCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_pitch(
    payload: Optional[str] = Form(
        None, description="JSON string field when using multipart/form-data"
    ),
    payload_json: Optional[Dict[str, Any]] = Body(default=None),
    pdf: Optional[UploadFile] = File(
        None, description="Optional PDF file associated with the pitch"
    ),
    service: SupabaseService = Depends(get_supabase_service),
):
    """Create a pitch, upload its PDF (if provided) and store the data in Supabase."""
    payload_dict = await _resolve_payload(payload, payload_json)

    code = _ensure_unique_code(service)

    ppt_file_url: Optional[str] = None
    if pdf is not None:
        if pdf.content_type not in (None, "application/pdf"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only PDF uploads are supported.",
            )

        pdf_bytes = await pdf.read()
        if not pdf_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded PDF file is empty.",
            )

        safe_name = pdf.filename or "pitch.pdf"
        ppt_file_url = service.upload_pdf(code=code, filename=safe_name, data=pdf_bytes)

    record = dict(payload_dict)
    record["code"] = code
    record["pptFile"] = ppt_file_url

    try:
        service.save_pitch(code=code, payload=record)
    except Exception as exc:  # pragma: no cover - bubble Supabase errors
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to persist pitch data: {exc}",
        ) from exc

    return PitchCreateResponse(code=code)


@app.get("/pitches/{code}", response_model=PitchRecord)
def get_pitch(
    code: str,
    service: SupabaseService = Depends(get_supabase_service),
):
    """Fetch a pitch by its random code."""
    record = service.get_pitch(code)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pitch not found"
        )
    return record


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
    )
