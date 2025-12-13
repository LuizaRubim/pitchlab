"""Pydantic models describing request and response payloads."""

from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, validator


class PitchPayload(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    bulletPoints: List[str] = Field(default_factory=list, description="Talking points")
    difficulty: str = Field(..., description="Difficulty level selected by the user")
    pptFile: Optional[str] = Field(
        default=None, description="Client hint containing the PPT file identifier"
    )
    scenario: str = Field(..., description="Pitch scenario label")
    timer: int = Field(..., description="Desired timer duration in seconds")

    @validator("scenario")
    def scenario_not_empty(cls, value: str) -> str:
        if not value:
            raise ValueError("scenario cannot be empty")
        return value


class PitchRecord(PitchPayload):
    model_config = ConfigDict(populate_by_name=True)
    code: str = Field(..., description="Random identifier used to retrieve the pitch")


class PitchCreateResponse(BaseModel):
    code: str = Field(..., description="Random code assigned to the stored pitch")


class PitchLookupResponse(BaseModel):
    pitch: PitchRecord
