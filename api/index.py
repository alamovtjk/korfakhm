"""
Vercel serverless entrypoint.
Exposes the FastAPI app from ./backend as an ASGI function.
All /api/* requests are rewritten here (see vercel.json).
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'backend'))

# Vercel's filesystem is read-only except /tmp — SQLite must live there
# unless a real Postgres is configured. Keep this candidate list in sync
# with backend/app/database.py's _PG_ENV_CANDIDATES: whichever provider
# connects the database (Neon, Vercel Postgres, ...) names its env var
# differently, and DATABASE_URL alone isn't enough to detect that.
_PG_ENV_CANDIDATES = ('DATABASE_URL', 'POSTGRES_URL', 'POSTGRES_PRISMA_URL', 'POSTGRES_URL_NON_POOLING')
if os.getenv('VERCEL') and not any(os.getenv(k) for k in _PG_ENV_CANDIDATES):
    os.environ['DATABASE_URL'] = 'sqlite+aiosqlite:////tmp/tajcareer.db'

from app.main import app  # noqa: E402

__all__ = ['app']
