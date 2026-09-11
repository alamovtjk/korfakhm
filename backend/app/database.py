import os
from urllib.parse import urlsplit, urlunsplit

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# Разные интеграции Postgres на Vercel называют свою переменную по-разному
# (Neon из Marketplace обычно даёт DATABASE_URL, "родной" Vercel Postgres —
# POSTGRES_URL) — проверяем все известные варианты, чтобы не завязываться
# на конкретный продукт.
_PG_ENV_CANDIDATES = ('DATABASE_URL', 'POSTGRES_URL', 'POSTGRES_PRISMA_URL', 'POSTGRES_URL_NON_POOLING')
_raw_url = next((os.getenv(k) for k in _PG_ENV_CANDIDATES if os.getenv(k)), None)

# SQLAlchemy передаёт КАЖДЫЙ query-параметр URL как именованный аргумент
# в asyncpg.connect() — а у asyncpg свой набор параметров (ssl=...), не
# libpq-шный (sslmode=..., channel_binding=...). Neon добавляет в строку
# подключения оба, поэтому просто выбрасываем весь query целиком и
# требуем TLS через connect_args ниже — Neon всё равно принимает только
# TLS-соединения.
_IS_POSTGRES = False


def _normalize_pg_url(raw: str) -> str:
    # Postgres-провайдеры отдают "postgres://" или "postgresql://" —
    # SQLAlchemy async нужен драйвер явно, через "+asyncpg".
    raw = raw.replace('postgres://', 'postgresql+asyncpg://', 1).replace('postgresql://', 'postgresql+asyncpg://', 1)
    parts = urlsplit(raw)
    return urlunsplit((parts.scheme, parts.netloc, parts.path, '', parts.fragment))


if _raw_url:
    DATABASE_URL = _normalize_pg_url(_raw_url)
    _IS_POSTGRES = True
else:
    DATABASE_URL = 'sqlite+aiosqlite:///./tajcareer.db'

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True,
    connect_args={'ssl': 'require'} if _IS_POSTGRES else {},
)

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
