import json
import time
from pathlib import Path
from fastapi import APIRouter, Query
from pydantic import BaseModel

router = APIRouter()

DATA_FILE = Path(__file__).parent.parent / "data" / "vacancies.json"
REQUESTS_FILE = Path(__file__).parent.parent / "data" / "requests.json"

SEED = [
    {"id": 1, "company": "Alif Tech", "position": "Junior Frontend Developer", "category": "IT", "salary": "3 000–5 000", "city": "Душанбе", "type": "Офис", "description": "Разработка веб-приложений на React.js", "contact": "hr@alif.tj", "status": "published"},
    {"id": 2, "company": "IdeaSoft", "position": "React Developer", "category": "IT", "salary": "4 000–7 000", "city": "Душанбе", "type": "Гибрид", "description": "Фронтенд-разработка", "contact": "jobs@ideasoft.tj", "status": "published"},
    {"id": 3, "company": "Прогресс Банк", "position": "Web Developer", "category": "IT", "salary": "3 500–6 000", "city": "Душанбе", "type": "Офис", "description": "Поддержка веб-сервисов", "contact": "hr@progress.tj", "status": "published"},
    {"id": 4, "company": "IMON International", "position": "Data Analyst", "category": "Аналитика", "salary": "4 000–7 000", "city": "Душанбе", "type": "Офис", "description": "Анализ финансовых данных", "contact": "hr@imon.tj", "status": "published"},
    {"id": 5, "company": "МегаФон Таджикистан", "position": "Digital Marketing Specialist", "category": "Маркетинг", "salary": "3 500–6 000", "city": "Душанбе", "type": "Офис", "description": "Ведение digital-кампаний и SMM", "contact": "careers@megafon.tj", "status": "published"},
    {"id": 6, "company": "Somon IT", "position": "Python Developer", "category": "IT", "salary": "5 000–9 000", "city": "Душанбе", "type": "Гибрид", "description": "Backend на Python/Django", "contact": "hr@somon.tj", "status": "published"},
    {"id": 7, "company": "Remote Startup", "position": "Frontend Engineer", "category": "IT", "salary": "$300–600", "city": "Удалённо", "type": "Remote", "description": "React для международного рынка", "contact": "hello@startup.com", "status": "published"},
    {"id": 8, "company": "Агентство Дизайн", "position": "UX/UI Designer", "category": "Дизайн", "salary": "3 000–5 500", "city": "Душанбе", "type": "Гибрид", "description": "Интерфейсы мобильных приложений", "contact": "design@agency.tj", "status": "published"},
]


def _load_vac():
    if DATA_FILE.exists():
        return json.loads(DATA_FILE.read_text(encoding="utf-8"))
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    DATA_FILE.write_text(json.dumps(SEED, ensure_ascii=False), encoding="utf-8")
    return SEED


def _load_req():
    if REQUESTS_FILE.exists():
        return json.loads(REQUESTS_FILE.read_text(encoding="utf-8"))
    return []


def _save_req(data):
    REQUESTS_FILE.parent.mkdir(parents=True, exist_ok=True)
    REQUESTS_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


@router.get("/")
async def get_vacancies(category: str = Query(None), city: str = Query(None), limit: int = Query(50)):
    items = [v for v in _load_vac() if v.get("status") == "published"]
    if category:
        items = [v for v in items if v.get("category", "").lower() == category.lower()]
    if city:
        items = [v for v in items if v.get("city", "").lower() == city.lower()]
    return {"vacancies": items[:limit], "total": len(items)}


class SubmitBody(BaseModel):
    company: str
    position: str
    category: str = "IT"
    salary: str = ""
    city: str = ""
    type: str = "Офис"
    description: str = ""
    contact: str = ""


@router.post("/submit")
async def submit_vacancy(body: SubmitBody):
    reqs = _load_req()
    item = body.model_dump()
    item["id"] = int(time.time() * 1000)
    item["status"] = "pending"
    item["createdAt"] = int(time.time())
    reqs.insert(0, item)
    _save_req(reqs)
    return {"ok": True, "id": item["id"]}
