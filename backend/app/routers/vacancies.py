"""
Публичные вакансии. Раньше это читало/писало JSON-файл на диске —
на Vercel файловая система только для чтения (кроме /tmp, который не
переживает следующий вызов функции), так что "опубликованные" вакансии
пропадали при каждом холодном старте. Теперь всё в общей базе — та же
таблица `vacancies`, что и у /api/admin.
"""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Vacancy
from app.routers.auth import optional_user, require_user

router = APIRouter()


def _serialize(v: Vacancy) -> dict:
    return {
        'id': v.id, 'company': v.company, 'position': v.position, 'category': v.category,
        'salary': v.salary, 'city': v.city, 'type': v.type, 'description': v.description,
        'contact': v.contact, 'ownerEmail': v.owner_email, 'status': v.status,
        'createdAt': v.created_at.isoformat() if v.created_at else None,
    }


@router.get('/')
async def get_vacancies(
    category: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    limit: int = Query(50, le=200),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Vacancy).where(Vacancy.status == 'published').order_by(Vacancy.created_at.desc())
    if category:
        stmt = stmt.where(Vacancy.category == category)
    if city:
        stmt = stmt.where(Vacancy.city == city)
    items = [_serialize(v) for v in (await db.execute(stmt)).scalars().all()]
    return {'vacancies': items[:limit], 'total': len(items)}


@router.get('/mine')
async def get_my_vacancies(user: dict = Depends(require_user), db: AsyncSession = Depends(get_db)):
    stmt = select(Vacancy).where(Vacancy.owner_email == user['email']).order_by(Vacancy.created_at.desc())
    return {'vacancies': [_serialize(v) for v in (await db.execute(stmt)).scalars().all()]}


class VacancyIn(BaseModel):
    company: str
    position: str
    category: str = 'IT'
    salary: str = ''
    city: str = ''
    type: str = 'Офис'
    description: str = ''
    contact: str = ''


@router.post('/submit')
async def submit_vacancy(
    body: VacancyIn,
    user: Optional[dict] = Depends(optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Любая заявка (от гостя или от зарегистрированного) уходит на
    модерацию — раньше залогиненный пользователь публиковался в обход
    очереди прямо с фронтенда, теперь решает только админ."""
    v = Vacancy(**body.model_dump(), owner_email=(user['email'] if user else None), status='pending')
    db.add(v)
    await db.flush()
    return {'ok': True, 'id': v.id}


async def _get_owned(vid: int, user: dict, db: AsyncSession) -> Vacancy:
    v = (await db.execute(select(Vacancy).where(Vacancy.id == vid))).scalar_one_or_none()
    if not v:
        raise HTTPException(status_code=404, detail='not_found')
    if (v.owner_email or '').lower() != user['email'].lower():
        raise HTTPException(status_code=403, detail='forbidden')
    return v


@router.put('/mine/{vid}')
async def update_my_vacancy(vid: int, body: VacancyIn, user: dict = Depends(require_user), db: AsyncSession = Depends(get_db)):
    v = await _get_owned(vid, user, db)
    for k, val in body.model_dump().items():
        setattr(v, k, val)
    await db.flush()
    return _serialize(v)


@router.delete('/mine/{vid}')
async def delete_my_vacancy(vid: int, user: dict = Depends(require_user), db: AsyncSession = Depends(get_db)):
    v = await _get_owned(vid, user, db)
    await db.delete(v)
    return {'ok': True}
