import os
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
import json
from pathlib import Path

router = APIRouter()
security = HTTPBearer(auto_error=False)

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
DATA_FILE = Path(__file__).parent.parent / "data" / "vacancies.json"
REQUESTS_FILE = Path(__file__).parent.parent / "data" / "requests.json"

SEED = [
    {"id": 1, "company": "Alif Tech", "position": "Junior Frontend Developer", "category": "IT", "salary": "3 000–5 000", "city": "Душанбе", "type": "Офис", "description": "Разработка веб-приложений на React.js", "contact": "hr@alif.tj", "status": "published"},
    {"id": 2, "company": "IdeaSoft", "position": "React Developer", "category": "IT", "salary": "4 000–7 000", "city": "Душанбе", "type": "Гибрид", "description": "Фронтенд-разработка", "contact": "jobs@ideasoft.tj", "status": "published"},
    {"id": 3, "company": "Прогресс Банк", "position": "Web Developer", "category": "IT", "salary": "3 500–6 000", "city": "Душанбе", "type": "Офис", "description": "Поддержка веб-сервисов", "contact": "hr@progress.tj", "status": "published"},
]


def _load(path: Path, default) -> list:
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(default, ensure_ascii=False), encoding="utf-8")
    return default


def _save(path: Path, data: list):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def _next_id(items):
    return max((i["id"] for i in items), default=0) + 1


def require_admin(creds: HTTPAuthorizationCredentials = Depends(security)):
    if not creds or creds.credentials != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True


# ── Auth ──────────────────────────────────────────────────────────────────────
class LoginBody(BaseModel):
    password: str

@router.post("/login")
async def login(body: LoginBody):
    if body.password == ADMIN_PASSWORD:
        return {"ok": True, "token": ADMIN_PASSWORD}
    raise HTTPException(status_code=401, detail="Wrong password")


# ── Vacancies CRUD ────────────────────────────────────────────────────────────
class VacancyBody(BaseModel):
    company: str
    position: str
    category: str = "IT"
    salary: str = ""
    city: str = "Душанбе"
    type: str = "Офис"
    description: str = ""
    contact: str = ""
    status: str = "published"


@router.get("/vacancies")
async def get_vacancies(_=Depends(require_admin)):
    return _load(DATA_FILE, SEED)


@router.post("/vacancies")
async def add_vacancy(body: VacancyBody, _=Depends(require_admin)):
    items = _load(DATA_FILE, SEED)
    item = body.model_dump()
    item["id"] = _next_id(items)
    items.append(item)
    _save(DATA_FILE, items)
    return item


@router.put("/vacancies/{vid}")
async def update_vacancy(vid: int, body: VacancyBody, _=Depends(require_admin)):
    items = _load(DATA_FILE, SEED)
    for i, v in enumerate(items):
        if v["id"] == vid:
            items[i] = {**body.model_dump(), "id": vid}
            _save(DATA_FILE, items)
            return items[i]
    raise HTTPException(status_code=404, detail="Not found")


@router.delete("/vacancies/{vid}")
async def delete_vacancy(vid: int, _=Depends(require_admin)):
    items = [v for v in _load(DATA_FILE, SEED) if v["id"] != vid]
    _save(DATA_FILE, items)
    return {"ok": True}


# ── Requests ──────────────────────────────────────────────────────────────────
@router.get("/requests")
async def get_requests(_=Depends(require_admin)):
    return _load(REQUESTS_FILE, [])


@router.put("/requests/{rid}/approve")
async def approve_request(rid: int, _=Depends(require_admin)):
    reqs = _load(REQUESTS_FILE, [])
    vacs = _load(DATA_FILE, SEED)
    for r in reqs:
        if r["id"] == rid:
            r["status"] = "approved"
            vac = {k: r.get(k, "") for k in ["company", "position", "category", "salary", "city", "type", "description", "contact"]}
            vac["id"] = _next_id(vacs)
            vac["status"] = "published"
            vacs.append(vac)
            _save(DATA_FILE, vacs)
            break
    _save(REQUESTS_FILE, reqs)
    return {"ok": True}


@router.put("/requests/{rid}/reject")
async def reject_request(rid: int, _=Depends(require_admin)):
    reqs = _load(REQUESTS_FILE, [])
    for r in reqs:
        if r["id"] == rid:
            r["status"] = "rejected"
            break
    _save(REQUESTS_FILE, reqs)
    return {"ok": True}
