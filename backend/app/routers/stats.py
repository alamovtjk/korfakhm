from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database import get_db
from app.models import User, QuizResult, IQResult

router = APIRouter()


@router.get('/')
async def get_stats(db: AsyncSession = Depends(get_db)):
    # Total users
    users_count = await db.scalar(select(func.count(User.id)))

    # Total quiz completions
    quiz_count = await db.scalar(select(func.count(QuizResult.id)))

    # Total IQ completions
    iq_count = await db.scalar(select(func.count(IQResult.id)))

    # Average IQ score
    avg_iq = await db.scalar(select(func.avg(IQResult.iq_score)))

    # Top professions from quiz results (aggregate from JSON)
    quiz_rows = await db.execute(select(QuizResult.professions))
    profession_counter: dict[str, int] = {}
    for (profs,) in quiz_rows:
        if profs:
            for p in profs[:3]:  # count top-3 per user
                name = p.get('name', '')
                if name:
                    profession_counter[name] = profession_counter.get(name, 0) + 1

    top_professions = sorted(
        [{'name': k, 'count': v} for k, v in profession_counter.items()],
        key=lambda x: x['count'],
        reverse=True,
    )[:5]

    # IQ distribution
    iq_rows = await db.execute(select(IQResult.iq_score))
    iq_dist = {'70-89': 0, '90-109': 0, '110-124': 0, '125+': 0}
    for (score,) in iq_rows:
        if score < 90:
            iq_dist['70-89'] += 1
        elif score < 110:
            iq_dist['90-109'] += 1
        elif score < 125:
            iq_dist['110-124'] += 1
        else:
            iq_dist['125+'] += 1

    return {
        'users': users_count or 0,
        'quizzes_completed': quiz_count or 0,
        'iq_tests_completed': iq_count or 0,
        'avg_iq': round(avg_iq) if avg_iq else None,
        'top_professions': top_professions,
        'iq_distribution': iq_dist,
    }
