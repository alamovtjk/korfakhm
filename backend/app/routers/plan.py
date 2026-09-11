import os
import json
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Any
from openai import OpenAI

router = APIRouter()

SYSTEM_PROMPT = """Ты — лучший карьерный консультант Таджикистана.
Ты помогаешь молодым людям найти свой путь в профессии.
Ты отлично знаешь рынок труда Таджикистана, доступные ресурсы для обучения на русском языке,
средние зарплаты в разных городах, IT-компании Душанбе и других городов.
Пиши понятным, поддерживающим и мотивирующим языком на русском языке.
Будь максимально конкретным — давай реальные ссылки, ресурсы, названия компаний."""

PLAN_PROMPT_TEMPLATE = """Пользователь прошёл карьерный тест и выбрал профессию: {profession}.

Составь детальный персональный план развития в формате JSON со следующей структурой:
{{
  "profession": "{profession}",
  "overview": {{
    "description": "краткое описание профессии",
    "why_fits": "почему эта профессия подходит пользователю (2-3 предложения)",
    "salaries": {{
      "junior": "диапазон зарплаты",
      "middle": "диапазон зарплаты",
      "senior": "диапазон зарплаты"
    }},
    "currency": "сомони/мес"
  }},
  "steps": [
    {{
      "number": 1,
      "title": "название шага (включи примерный срок)",
      "description": "подробное описание шага (3-4 предложения)",
      "resources": ["конкретный ресурс 1", "конкретный ресурс 2", "конкретный ресурс 3"],
      "tasks": ["задача 1", "задача 2", "задача 3"]
    }}
  ],
  "vacancies": [
    {{
      "company": "название компании в Таджикистане",
      "position": "название вакансии",
      "salary": "диапазон",
      "city": "город",
      "type": "Офис/Удалённо/Гибрид"
    }}
  ]
}}

Требования:
- Минимум 6 шагов в плане
- Вакансии должны быть реальными компаниями из Таджикистана (Alif Tech, IdeaSoft, Прогресс Банк и т.д.)
- Ресурсы — реальные YouTube-каналы, сайты, книги на русском языке
- Зарплаты — реальные для рынка Таджикистана в сомони
- Отвечай ТОЛЬКО валидным JSON без дополнительного текста"""


class PlanRequest(BaseModel):
    answers: dict[str, Any] = {}


@router.post("/{profession}")
async def generate_plan(profession: str, body: PlanRequest):
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        return _demo_plan(profession)

    client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")
    prompt = PLAN_PROMPT_TEMPLATE.format(profession=profession)

    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            max_tokens=4096,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
        )
        raw = response.choices[0].message.content
        return json.loads(raw)
    except Exception:
        return _demo_plan(profession)


def _demo_plan(profession: str) -> dict:
    return {
        "profession": profession,
        "overview": {
            "description": f"{profession} — востребованная профессия с хорошими перспективами роста в Таджикистане.",
            "why_fits": "По результатам теста у тебя есть необходимые склонности и интересы для этой профессии. Твои аналитические способности и желание работать с технологиями — отличная база.",
            "salaries": {"junior": "2 500–4 000", "middle": "5 000–10 000", "senior": "12 000–25 000"},
            "currency": "сомони/мес",
        },
        "steps": [
            {
                "number": 1, "title": "Изучи основы (1–2 месяца)",
                "description": "Начни с фундаментальных знаний. Это займёт 1–2 месяца активного обучения.",
                "resources": ["YouTube: поиск по теме на русском языке", "Coursera (есть субтитры на русском)", "Бесплатные статьи на Habr.com"],
                "tasks": ["Пройди вводный курс", "Сделай первый небольшой проект", "Присоединись к профессиональному сообществу"],
            },
            {
                "number": 2, "title": "Практика и проекты (2–3 месяца)",
                "description": "Теория без практики не работает. Создавай реальные проекты.",
                "resources": ["GitHub — публикуй проекты", "Kaggle (для аналитиков)", "Dribbble (для дизайнеров)"],
                "tasks": ["Создай 3 учебных проекта", "Получи обратную связь", "Улучши проекты по фидбэку"],
            },
            {
                "number": 3, "title": "Поиск работы (1–2 месяца)",
                "description": "Таджикистан активно развивается в IT и бизнесе. Знай, где искать.",
                "resources": ["HeadHunter.tj", "Telegram-каналы: IT Tajikistan", "LinkedIn"],
                "tasks": ["Составь резюме", "Создай профиль на LinkedIn", "Подай заявки в 10 компаний"],
            },
        ],
        "vacancies": [
            {"company": "Alif Tech", "position": profession, "salary": "3 000–6 000", "city": "Душанбе", "type": "Офис"},
            {"company": "IdeaSoft", "position": profession, "salary": "4 000–8 000", "city": "Душанбе", "type": "Гибрид"},
            {"company": "Freelance/Upwork", "position": profession, "salary": "$200–800", "city": "Удалённо", "type": "Remote"},
        ],
    }
