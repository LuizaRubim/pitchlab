# pitchlab

## FastAPI backend

The `src/main.py` module exposes two endpoints:

- `POST /pitches` accepts a `multipart/form-data` request containing a `payload`
  field (JSON matching the schema shown below) and an optional `pdf` file. When
  the `scenario` is `auditorium` the `bulletPoints` list must be empty and a PDF
  upload is required. When the `scenario` is `elevator`, the `pptFile` value is
  forced to `null` and file uploads are rejected. The route stores the payload,
  uploads the PDF to Supabase Storage, and returns a random retrieval code.
- `GET /pitches/{code}` fetches the previously stored pitch payload by its code.

### Environment variables

Create a `.env` file or export the following variables before running the API:

| Variable | Description |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase service-role key |
| `SUPABASE_TABLE` | Table name that stores pitch data (default `pitches`) |
| `SUPABASE_BUCKET` | Storage bucket for PDF uploads (default `presentations`) |
| `PITCH_CODE_LENGTH` | Optional override for the random code length |

### Installing dependencies

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Running locally

```bash
uvicorn src.main:app --reload
```

### Example request

```bash
curl -X POST http://localhost:8000/pitches \
  -F 'payload={
        "bulletPoints": [],
        "difficulty": "easy",
        "pptFile": null,
        "scenario": "auditorium",
        "timer": 300
      }' \
  -F pdf=@slides.pdf
```

The response includes a random code:

```json
{"code": "AB12XY"}
```

Use that code to fetch the stored record:

```bash
curl http://localhost:8000/pitches/AB12XY
```
