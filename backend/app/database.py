import os
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# Разные интеграции Postgres на Vercel называют свою переменную по-разному
# (Neon из Marketplace обычно даёт DATABASE_URL, "родной" Vercel Postgres —
# POSTGRES_URL) — проверяем все известные варианты, чтобы не завязываться
# на конкретный продукт.
_PG_ENV_CANDIDATES = ('DATABASE_URL', 'POSTGRES_URL', 'POSTGRES_PRISMA_URL', 'POSTGRES_URL_NON_POOLING')
_raw_url = next((os.getenv(k) for k in _PG_ENV_CANDIDATES if os.getenv(k)), None)

# asyncpg получает каждый query-параметр URL как именованный аргумент
# connect() и падает на незнакомых — Neon добавляет в строку подключения
# "channel_binding", которого asyncpg не знает (это специфика psycopg).
# "sslmode" asyncpg понимает сам, его не трогаем.
_ASYNCPG_UNSUPPORTED_PARAMS = {'channel_binding'}


def _normalize_pg_url(raw: str) -> str:
    # Postgres-провайдеры отдают "postgres://" или "postgresql://" —
    # SQLAlchemy async нужен драйвер явно, через "+asyncpg".
    raw = raw.replace('postgres://', 'postgresql+asyncpg://', 1).replace('postgresql://', 'postgresql+asyncpg://', 1)
    parts = urlsplit(raw)
    query = [(k, v) for k, v in parse_qsl(parts.query) if k not in _ASYNCPG_UNSUPPORTED_PARAMS]
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment))


DATABASE_URL = _normalize_pg_url(_raw_url) if _raw_url else 'sqlite+aiosqlite:///./tajcareer.db'

engine = create_async_engine(DATABASE_URL, echo=False, future=True)

AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def init_db():
    from app.models import User, QuizResult, IQResult, Vacancy  # noqa: F401
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await _seed_vacancies()


# Стартовый набор вакансий — только если таблица пустая (первый запуск на
# свежей БД). Раньше это был отдельный SEED-список в JSON-роутере и ещё один
# в JS на фронтенде — три копии одних и тех же восьми вакансий.
_SEED_VACANCIES = [
    {'company': 'Alif Tech', 'position': 'Junior Frontend Developer', 'category': 'IT', 'salary': '3 000–5 000', 'city': 'Душанбе', 'type': 'Офис', 'description': 'Разработка веб-приложений на React.js', 'contact': 'hr@alif.tj'},
    {'company': 'IdeaSoft', 'position': 'React Developer', 'category': 'IT', 'salary': '4 000–7 000', 'city': 'Душанбе', 'type': 'Гибрид', 'description': 'Фронтенд-разработка корпоративных приложений', 'contact': 'jobs@ideasoft.tj'},
    {'company': 'Прогресс Банк', 'position': 'Web Developer', 'category': 'IT', 'salary': '3 500–6 000', 'city': 'Душанбе', 'type': 'Офис', 'description': 'Поддержка банковских веб-сервисов', 'contact': 'hr@progress.tj'},
    {'company': 'IMON International', 'position': 'Data Analyst', 'category': 'Аналитика', 'salary': '4 000–7 000', 'city': 'Душанбе', 'type': 'Офис', 'description': 'Анализ финансовых данных и построение отчётов', 'contact': 'hr@imon.tj'},
    {'company': 'МегаФон Таджикистан', 'position': 'Digital Marketing Specialist', 'category': 'Маркетинг', 'salary': '3 500–6 000', 'city': 'Душанбе', 'type': 'Офис', 'description': 'Ведение digital-кампаний и SMM', 'contact': 'careers@megafon.tj'},
    {'company': 'Somon IT', 'position': 'Python Developer', 'category': 'IT', 'salary': '5 000–9 000', 'city': 'Душанбе', 'type': 'Гибрид', 'description': 'Backend-разработка на Python/Django', 'contact': 'hr@somon.tj'},
    {'company': 'Remote Startup', 'position': 'Frontend Engineer', 'category': 'IT', 'salary': '$300–600', 'city': 'Удалённо', 'type': 'Remote', 'description': 'Разработка на React для международного рынка', 'contact': 'hello@startup.com'},
    {'company': 'Агентство Дизайн', 'position': 'UX/UI Designer', 'category': 'Дизайн', 'salary': '3 000–5 500', 'city': 'Душанбе', 'type': 'Гибрид', 'description': 'Разработка интерфейсов мобильных приложений', 'contact': 'design@agency.tj'},
]


async def _seed_vacancies():
    from sqlalchemy import select, func
    from app.models import Vacancy
    async with AsyncSessionLocal() as session:
        count = await session.scalar(select(func.count(Vacancy.id)))
        if count:
            return
        session.add_all(Vacancy(**row, status='published') for row in _SEED_VACANCIES)
        await session.commit()
