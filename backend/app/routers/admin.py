"""
Админ-панель: модерация вакансий. Раньше "токеном" был сам пароль
(отправлялся на каждый запрос как Bearer), а вакансии хранились в JSON-файле
рядом с кодом — на Vercel он не переживает следующий вызов функции.
Теперь логин выдаёт короткоживущий JWT, а данные — в общей таблице БД.
"""
import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Vacancy

router = APIRouter()
security = HTTPBearer(auto_error=False)

ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'admin123')
SECRET_KEY = os.getenv('SECRET_KEY', 'tajcareer-super-secret-2025-ilm-furugi')
ALGORITHM = 'HS256'
ADMIN_TOKEN_HOURS = 12


def make_admin_token() -> str:
    payload = {'role': 'admin', 'exp': datetime.now(timezone.utc) + timedelta(hours=ADMIN_TOKEN_HOURS)}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def require_admin(creds: HTTPAuthorizationCredentials = Depends(security)) -> bool:
    if not creds:
        raise HTTPException(status_code=401, detail='Unauthorized')
    try:
        payload = jwt.decode(creds.credentials, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail='Unauthorized')
    if payload.get('role') != 'admin':
        raise HTTPException(status_code=401, detail='Unauthorized')
    return True


def _serialize(v: Vacancy) -> dict:
    return {
        'id': v.id, 'company': v.company, 'position': v.position, 'category': v.category,
        'salary': v.salary, 'city': v.city, 'type': v.type, 'description': v.description,
        'contact': v.contact, 'ownerEmail': v.owner_email, 'status': v.status,
        'createdAt': v.created_at.isoformat() if v.created_at else None,
    }


# ── Auth ──────────────────────────────────────────────────────────────────────
class LoginBody(BaseModel):
    password: str


@router.post('/login')
async def login(body: LoginBody):
    if body.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail='Wrong password')
    return {'ok': True, 'token': make_admin_token()}


# ── Vacancies CRUD ────────────────────────────────────────────────────────────
class VacancyBody(BaseModel):
    company: str
    position: str
    category: str = 'IT'
    salary: str = ''
    city: str = 'Душанбе'
    type: str = 'Офис'
    description: str = ''
    contact: str = ''
    status: str = 'published'


async def _get_or_404(vid: int, db: AsyncSession) -> Vacancy:
    v = (await db.execute(select(Vacancy).where(Vacancy.id == vid))).scalar_one_or_none()
    if not v:
        raise HTTPException(status_code=404, detail='Not found')
    return v


@router.get('/vacancies')
async def get_vacancies(status: Optional[str] = Query(None), _=Depends(require_admin), db: AsyncSession = Depends(get_db)):
    stmt = select(Vacancy).order_by(Vacancy.created_at.desc())
    if status:
        stmt = stmt.where(Vacancy.status == status)
    return [_serialize(v) for v in (await db.execute(stmt)).scalars().all()]


@router.post('/vacancies')
async def add_vacancy(body: VacancyBody, _=Depends(require_admin), db: AsyncSession = Depends(get_db)):
    v = Vacancy(**body.model_dump())
    db.add(v)
    await db.flush()
    return _serialize(v)


@router.put('/vacancies/{vid}')
async def update_vacancy(vid: int, body: VacancyBody, _=Depends(require_admin), db: AsyncSession = Depends(get_db)):
    v = await _get_or_404(vid, db)
    for k, val in body.model_dump().items():
        setattr(v, k, val)
    await db.flush()
    return _serialize(v)


@router.delete('/vacancies/{vid}')
async def delete_vacancy(vid: int, _=Depends(require_admin), db: AsyncSession = Depends(get_db)):
    v = await _get_or_404(vid, db)
    await db.delete(v)
    return {'ok': True}


@router.put('/vacancies/{vid}/approve')
async def approve_vacancy(vid: int, _=Depends(require_admin), db: AsyncSession = Depends(get_db)):
    v = await _get_or_404(vid, db)
    v.status = 'published'
    await db.flush()
    return _serialize(v)


@router.put('/vacancies/{vid}/reject')
async def reject_vacancy(vid: int, _=Depends(require_admin), db: AsyncSession = Depends(get_db)):
    v = await _get_or_404(vid, db)
    v.status = 'rejected'
    await db.flush()
    return _serialize(v)
