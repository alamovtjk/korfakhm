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
# unless a real DATABASE_URL (e.g. Postgres) is configured.
if os.getenv('VERCEL') and not os.getenv('DATABASE_URL'):
    os.environ['DATABASE_URL'] = 'sqlite+aiosqlite:////tmp/tajcareer.db'

from app.main import app  # noqa: E402

__all__ = ['app']
