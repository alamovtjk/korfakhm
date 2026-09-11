import os
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import User, QuizResult, IQResult

router = APIRouter()

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

SECRET_KEY = os.getenv('SECRET_KEY', 'tajcareer-super-secret-2025-ilm-furugi')
ALGORITHM = 'HS256'
TOKEN_DAYS = 30


# ── helpers ───────────────────────────────────────────────────────────────────

def make_token(user_id: int, name: str, email: str) -> str:
    payload = {
        'sub': str(user_id),
        'name': name,
        'email': email,
        'exp': datetime.now(timezone.utc) + timedelta(days=TOKEN_DAYS),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def parse_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail='invalid_token')


async def current_user_id(authorization: str = Header(default=None)) -> int:
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail='not_authenticated')
    payload = parse_token(authorization[7:])
    return int(payload['sub'])


async def optional_user(authorization: str = Header(default=None)) -> dict | None:
    """Decodes the bearer token if present and valid, otherwise returns None
    instead of raising — for endpoints usable both signed-in and anonymous
    (e.g. submitting a vacancy)."""
    if not authorization or not authorization.startswith('Bearer '):
        return None
    try:
        payload = parse_token(authorization[7:])
    except HTTPException:
        return None
    return {'id': int(payload['sub']), 'name': payload.get('name'), 'email': payload.get('email')}


async def require_user(authorization: str = Header(default=None)) -> dict:
    """Like current_user_id, but returns the full {id, name, email} straight
    from the token — no DB round-trip needed for ownership checks."""
    user = await optional_user(authorization)
    if not user:
        raise HTTPException(status_code=401, detail='not_authenticated')
    return user


# ── schemas ───────────────────────────────────────────────────────────────────

class RegisterIn(BaseModel):
    name: str
    email: str
    password: str


class LoginIn(BaseModel):
    email: str
    password: str


class SaveQuizIn(BaseModel):
    riasec: dict
    professions: list


class SaveIQIn(BaseModel):
    iq: int
    level: str
    percentile: int


# ── routes ────────────────────────────────────────────────────────────────────

@router.post('/register')
async def register(data: RegisterIn, db: AsyncSession = Depends(get_db)):
    email = data.email.lower().strip()
    result = await db.execute(select(User).where(User.email == email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail='email_taken')

    user = User(
        name=data.name.strip(),
        email=email,
        password_hash=pwd_context.hash(data.password),
    )
    db.add(user)
    await db.flush()  # get user.id before commit

    token = make_token(user.id, user.name, user.email)
    return {
        'ok': True,
        'token': token,
        'user': {'id': user.id, 'name': user.name, 'email': user.email},
    }


@router.post('/login')
async def login(data: LoginIn, db: AsyncSession = Depends(get_db)):
    email = data.email.lower().strip()
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user or not pwd_context.verify(data.password, user.password_hash):
        raise HTTPException(status_code=400, detail='wrong_credentials')

    token = make_token(user.id, user.name, user.email)
    return {
        'ok': True,
        'token': token,
        'user': {'id': user.id, 'name': user.name, 'email': user.email},
    }


@router.get('/me')
async def me(
    uid: int = Depends(current_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == uid))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail='user_not_found')

    quiz_r = await db.execute(
        select(QuizResult).where(QuizResult.user_id == uid).order_by(QuizResult.created_at.desc()).limit(1)
    )
    iq_r = await db.execute(
        select(IQResult).where(IQResult.user_id == uid).order_by(IQResult.created_at.desc()).limit(1)
    )
    quiz = quiz_r.scalar_one_or_none()
    iq = iq_r.scalar_one_or_none()

    return {
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'results': {
            'quiz': {'riasec': quiz.riasec, 'professions': quiz.professions, 'savedAt': str(quiz.created_at)} if quiz else None,
            'iq':   {'iq': iq.iq_score, 'level': iq.level, 'percentile': iq.percentile, 'savedAt': str(iq.created_at)} if iq else None,
        },
    }


@router.post('/save-quiz')
async def save_quiz(
    data: SaveQuizIn,
    uid: int = Depends(current_user_id),
    db: AsyncSession = Depends(get_db),
):
    row = QuizResult(user_id=uid, riasec=data.riasec, professions=data.professions)
    db.add(row)
    return {'ok': True}


@router.post('/save-iq')
async def save_iq(
    data: SaveIQIn,
    uid: int = Depends(current_user_id),
    db: AsyncSession = Depends(get_db),
):
    row = IQResult(user_id=uid, iq_score=data.iq, level=data.level, percentile=data.percentile)
    db.add(row)
    return {'ok': True}
