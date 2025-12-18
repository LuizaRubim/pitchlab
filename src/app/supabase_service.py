"""Supabase helper that wraps table and storage operations."""

from __future__ import annotations

import secrets
from typing import Any, Dict, Optional

from supabase import Client, create_client

from .config import Settings


class SupabaseService:
    """Provides thin wrappers around Supabase table and storage clients."""

    def __init__(self, settings: Settings):
        self._settings = settings
        self._client: Client = create_client(settings.supabase_url, settings.supabase_key)

    @property
    def client(self) -> Client:
        return self._client

    def generate_code(self) -> str:
        """Generate a unique-looking alphanumeric code."""
        alphabet = "123456789"
        return "".join(secrets.choice(alphabet) for _ in range(self._settings.code_length))

    def upload_pdf(self, *, code: str, filename: str, data: bytes) -> str:
        """Upload a PDF to Supabase storage and return its public URL."""
        storage_path = f"{code}/{filename}"
        storage = self._client.storage.from_(self._settings.supabase_bucket)
        storage.upload(
            storage_path,
            data,
            {"content-type": "application/pdf", "upsert": "true"},
        )
        return storage.get_public_url(storage_path)

    def save_pitch(self, *, code: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Persist a pitch record in Supabase."""
        response = (
            self._client.table(self._settings.supabase_table)
            .insert({"code_key": code, "data_json": payload})
            .execute()
        )
        return response.data[0]

    def get_pitch(self, code: str) -> Optional[Dict[str, Any]]:
        """Return the pitch that matches the provided code."""
        response = (
            self._client.table(self._settings.supabase_table)
            .select("code_key,data_json")
            .eq("code_key", code)
            .limit(1)
            .execute()
        )
        data = response.data or []
        if not data:
            return None
        entry = data[0]
        payload = entry.get("data_json") or {}
        payload["code"] = entry.get("code_key")
        return payload
