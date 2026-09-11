from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.routers import quiz, plan, vacancies, admin, chat
from app.routers import auth, stats
from app.database import init_db

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title='TajCareer AI API',
    version='2.0.0',
    description='Платформа профориентации для Таджикистана | Илм Фуруги Маърифат 2026',
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173').split(','),
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(auth.router,      prefix='/api/auth',      tags=['auth'])
app.include_router(stats.router,     prefix='/api/stats',     tags=['stats'])
app.include_router(quiz.router,      prefix='/api/quiz',      tags=['quiz'])
app.include_router(plan.router,      prefix='/api/plan',      tags=['plan'])
app.include_router(vacancies.router, prefix='/api/vacancies', tags=['vacancies'])
app.include_router(admin.router,     prefix='/api/admin',     tags=['admin'])
app.include_router(chat.router,      prefix='/api/chat',      tags=['chat'])


@app.get('/api/health')
async def health():
    return {'status': 'ok', 'service': 'TajCareer AI', 'version': '2.0.0'}
