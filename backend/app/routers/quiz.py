"""
RIASEC-based career matching with optional DeepSeek AI analysis.
R=Realistic  I=Investigative  A=Artistic  S=Social  E=Enterprising  C=Conventional
"""
import os
import json
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Any
from openai import OpenAI

router = APIRouter()

# ─── Profession profiles (RIASEC weights 0-100) ───────────────────────────────

PROFESSIONS = [
    # IT
    {"name": "Frontend-разработчик",   "emoji": "💻", "category": "IT",         "R":20, "I":80, "A":50, "S":20, "E":30, "C":55},
    {"name": "Backend-разработчик",    "emoji": "⚙️", "category": "IT",         "R":25, "I":90, "A":15, "S":15, "E":25, "C":70},
    {"name": "Мобильный разработчик",  "emoji": "📱", "category": "IT",         "R":20, "I":80, "A":45, "S":20, "E":30, "C":60},
    {"name": "DevOps / SRE",           "emoji": "🔧", "category": "IT",         "R":60, "I":80, "A":10, "S":20, "E":25, "C":80},
    {"name": "Data Scientist",         "emoji": "📊", "category": "IT",         "R":15, "I":95, "A":20, "S":15, "E":30, "C":75},
    {"name": "QA Engineer",            "emoji": "🔍", "category": "IT",         "R":30, "I":70, "A":15, "S":25, "E":20, "C":85},
    # Design
    {"name": "UX/UI дизайнер",         "emoji": "🎨", "category": "Дизайн",     "R":20, "I":55, "A":85, "S":50, "E":30, "C":35},
    {"name": "Графический дизайнер",   "emoji": "🖌️", "category": "Дизайн",    "R":35, "I":30, "A":90, "S":20, "E":25, "C":30},
    {"name": "Видеограф / монтажёр",   "emoji": "🎬", "category": "Дизайн",     "R":50, "I":30, "A":85, "S":25, "E":20, "C":30},
    # Business
    {"name": "Предприниматель",        "emoji": "🚀", "category": "Бизнес",     "R":25, "I":65, "A":45, "S":60, "E":95, "C":40},
    {"name": "Продакт-менеджер",       "emoji": "📋", "category": "Управление", "R":15, "I":70, "A":40, "S":65, "E":80, "C":50},
    {"name": "Менеджер проектов",      "emoji": "📌", "category": "Управление", "R":20, "I":50, "A":25, "S":65, "E":75, "C":80},
    {"name": "HR-менеджер",            "emoji": "👥", "category": "Управление", "R":10, "I":40, "A":30, "S":85, "E":60, "C":55},
    # Marketing
    {"name": "Маркетолог",             "emoji": "📈", "category": "Маркетинг",  "R":10, "I":65, "A":60, "S":60, "E":75, "C":45},
    {"name": "SMM-специалист",         "emoji": "📲", "category": "Маркетинг",  "R":10, "I":40, "A":75, "S":70, "E":65, "C":35},
    {"name": "Копирайтер / контент",   "emoji": "✍️", "category": "Маркетинг", "R":10, "I":50, "A":85, "S":40, "E":40, "C":35},
    # Finance
    {"name": "Финансовый аналитик",    "emoji": "💰", "category": "Финансы",    "R":10, "I":85, "A":10, "S":25, "E":55, "C":90},
    {"name": "Бухгалтер",              "emoji": "📒", "category": "Финансы",    "R":10, "I":55, "A":5,  "S":20, "E":20, "C":95},
    # Social
    {"name": "Врач / медработник",     "emoji": "🩺", "category": "Медицина",   "R":55, "I":80, "A":20, "S":85, "E":35, "C":60},
    {"name": "Психолог",               "emoji": "🧠", "category": "Медицина",   "R":10, "I":70, "A":40, "S":90, "E":30, "C":40},
    {"name": "Учитель / преподаватель","emoji": "🎓", "category": "Образование","R":20, "I":65, "A":55, "S":90, "E":50, "C":45},
    # Analytics
    {"name": "Бизнес-аналитик",        "emoji": "🔬", "category": "Аналитика",  "R":10, "I":85, "A":20, "S":40, "E":55, "C":80},
    {"name": "Юрист",                  "emoji": "⚖️", "category": "Аналитика", "R":10, "I":75, "A":15, "S":55, "E":65, "C":70},
]

# ─── Score computation ─────────────────────────────────────────────────────────

def compute_riasec(answers: dict) -> dict[str, float]:
    totals = {"R": 0, "I": 0, "A": 0, "S": 0, "E": 0, "C": 0}
    max_possible = {"R": 0, "I": 0, "A": 0, "S": 0, "E": 0, "C": 0}

    for qid_str, answer in answers.items():
        qid = int(qid_str) if isinstance(qid_str, str) else qid_str
        q_scores = _get_question_scores(qid, answer)
        for dim, val in q_scores.items():
            totals[dim] = totals.get(dim, 0) + val
            max_possible[dim] = max_possible.get(dim, 0) + abs(val)

    normalized = {}
    for dim in totals:
        mx = max_possible.get(dim, 1) or 1
        raw = totals[dim]
        normalized[dim] = round(min(100, max(0, (raw / mx) * 100)))

    return normalized


def _get_question_scores(qid: int, answer) -> dict[str, float]:
    SCENARIO4_SCORES = {
        1: [{},{},
            {"R":4,"I":2}, {"I":4,"A":1}, {"A":4,"I":1}, {"S":3,"E":2}],
        2: [{"I":4,"C":1}, {"S":3,"C":2}, {"R":3,"E":2}, {"C":4,"I":1}],
        3: [{"I":4,"C":1}, {"S":3,"E":1}, {"A":3,"I":2}, {"E":4,"R":1}],
        4: [{"S":2,"C":3}, {"S":4,"I":1}, {"I":3,"C":3}, {"E":3,"R":1}],
        5: [{"I":3,"S":2}, {"S":3,"E":3}, {"I":2,"A":2,"C":1}, {"E":4,"S":2}],
        6: [{"I":3,"R":2,"C":1}, {"A":4,"I":1}, {"E":4,"S":1}, {"I":4,"C":1}],
        7: [{"I":4,"R":1}, {"S":4,"E":1}, {"A":4,"C":1}, {"C":4,"E":1}],
        8: [{"E":4,"C":1}, {"A":3,"I":2}, {"S":4,"C":1}, {"R":2,"C":2,"I":1}],
        19: [{"I":3,"E":2}, {"E":3,"A":2,"R":1}, {"E":2,"C":2}, {"S":4}],
        20: [{"I":3,"C":2}, {"E":3,"A":1}, {"S":3,"C":1}, {"I":2,"A":2}],
        21: [{"I":3,"A":1}, {"C":3,"R":1}, {"S":4}, {"E":4}],
    }

    SCALE_SCORE_MAP = {
        9:  {1:{"C":1}, 2:{"C":1}, 3:{}, 4:{"E":2,"S":1}, 5:{"E":3,"S":2}},
        10: {1:{"I":2,"C":1}, 2:{"I":1}, 3:{}, 4:{"A":2}, 5:{"A":4}},
        11: {1:{"C":2}, 2:{"C":1}, 3:{}, 4:{"I":2,"A":1}, 5:{"I":4}},
        12: {1:{"A":1,"I":1}, 2:{}, 3:{}, 4:{"R":2}, 5:{"R":4}},
        13: {1:{"I":1}, 2:{}, 3:{"S":1}, 4:{"S":2}, 5:{"S":4}},
        14: {1:{"C":3}, 2:{"C":1}, 3:{}, 4:{"E":2,"A":1}, 5:{"E":3,"A":2}},
        15: {1:{}, 2:{}, 3:{"E":1}, 4:{"E":2,"I":1}, 5:{"E":4,"I":1}},
        16: {1:{}, 2:{}, 3:{"I":1}, 4:{"I":2,"C":1}, 5:{"I":3,"C":2}},
        17: {1:{}, 2:{}, 3:{"S":1}, 4:{"S":3}, 5:{"S":4,"A":1}},
        18: {1:{"A":1,"E":1}, 2:{}, 3:{}, 4:{"C":3}, 5:{"C":4}},
        22: {1:{"I":1,"A":1}, 2:{}, 3:{}, 4:{"E":2,"C":1}, 5:{"E":3}},
        23: {1:{"C":2}, 2:{}, 3:{}, 4:{"I":1,"A":1,"E":1}, 5:{"I":2,"A":2,"E":2}},
    }

    CHOICE_SCORE_MAP = {
        26: {0:{}, 1:{}, 2:{"I":1,"E":1}, 3:{"I":2,"E":2,"A":1}},
        27: {0:{"S":1,"C":1}, 1:{"I":1,"R":1}, 2:{}, 3:{"E":2}},
        28: {0:{"C":1}, 1:{}, 2:{"I":1,"E":1}, 3:{"E":3}},
    }

    if qid in SCENARIO4_SCORES:
        opts = SCENARIO4_SCORES[qid]
        idx = answer if isinstance(answer, int) else 0
        return opts[idx] if 0 <= idx < len(opts) else {}

    if qid in SCALE_SCORE_MAP:
        val = answer if isinstance(answer, int) else 3
        return SCALE_SCORE_MAP[qid].get(val, {})

    if qid in CHOICE_SCORE_MAP:
        idx = answer if isinstance(answer, int) else 0
        return CHOICE_SCORE_MAP[qid].get(idx, {})

    return {}


def match_professions(riasec: dict[str, float]) -> list[dict]:
    scored = []
    for prof in PROFESSIONS:
        dims = ["R", "I", "A", "S", "E", "C"]
        total_weight = 0
        weighted_diff = 0
        for d in dims:
            user_val = riasec.get(d, 50)
            prof_val = prof.get(d, 50)
            weight = (user_val / 100) * 0.7 + 0.3
            diff = abs(user_val - prof_val)
            weighted_diff += weight * diff
            total_weight += weight * 100

        similarity = max(0, 100 - (weighted_diff / total_weight * 100))
        score = int(55 + similarity * 0.43)
        scored.append({
            "name": prof["name"],
            "emoji": prof["emoji"],
            "category": prof["category"],
            "score": min(98, score),
            "riasec": {d: prof[d] for d in dims},
        })

    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:5]


# ─── DeepSeek AI analysis ──────────────────────────────────────────────────────

SYSTEM_PROMPT = """Ты — опытный карьерный психолог и консультант для молодёжи Таджикистана.
Твоя задача — по результатам RIASEC-теста составить честный, тонкий и полезный анализ личности.
Пиши на русском языке. Будь конкретным, избегай клише и шаблонных фраз."""

def build_analysis_prompt(riasec: dict, top_professions: list) -> str:
    dims = {"R": "Практический", "I": "Аналитический", "A": "Творческий",
            "S": "Социальный", "E": "Предпринимательский", "C": "Структурированный"}

    profile_lines = "\n".join(
        f"- {dims[d]} ({d}): {riasec[d]}/100" for d in ["R","I","A","S","E","C"]
    )
    top5_lines = "\n".join(
        f"{i+1}. {p['name']} ({p['score']}% совпадение)" for i, p in enumerate(top_professions)
    )

    return f"""Пользователь прошёл RIASEC-тест. Вот его профиль:

{profile_lines}

Топ-5 подходящих профессий по алгоритму:
{top5_lines}

Составь психологический анализ в формате JSON:
{{
  "personality_type": "2-3 слова описывающих тип личности (например: Аналитик-Творец)",
  "summary": "3-4 предложения честного и точного описания этого человека. Не шаблонно — конкретно.",
  "strengths": ["сила 1", "сила 2", "сила 3"],
  "hidden_talent": "Неочевидная сильная сторона которую человек сам может не осознавать",
  "career_insight": "2-3 предложения о том почему именно эти профессии подходят, с учётом профиля",
  "watch_out": "Честное предупреждение — в чём этому типу личности бывает трудно в карьере",
  "top_profession_why": "Почему первая профессия подходит лучше всего — 2 предложения конкретно"
}}

Отвечай ТОЛЬКО валидным JSON без дополнительного текста."""


async def get_ai_analysis(riasec: dict, top_professions: list) -> dict | None:
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        return None
    try:
        client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")
        response = client.chat.completions.create(
            model="deepseek-chat",
            max_tokens=1024,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": build_analysis_prompt(riasec, top_professions)},
            ],
        )
        return json.loads(response.choices[0].message.content)
    except Exception:
        return None


# ─── AI-driven quiz system prompt ─────────────────────────────────────────────

AI_QUIZ_SYSTEM_PROMPT = """Ты — AIDA, умный карьерный помощник платформы КОРФАҲМ для молодёжи Таджикистана.
Твоя задача: провести глубокое карьерное интервью — задать ровно 25 вопросов, чтобы максимально точно понять интересы, таланты, ценности и склонности человека, затем выдать результат.

ПРАВИЛА:
- На каждый ответ пользователя задавай ОДИН новый вопрос (не два и не три).
- Вопросы должны охватывать все сферы: хобби и увлечения, любимые и нелюбимые предметы в школе, мечты и цели, как проводит свободное время, предпочтения в работе (руками/умом, с людьми/в одиночку, создавать/анализировать/помогать/управлять), что даётся легко и что трудно, отношение к риску и стабильности, к деньгам и миссии, к командной работе и самостоятельности, опыт лидерства, творческие наклонности, технические интересы.
- Вопросы должны адаптироваться к ответам пользователя — если он упомянул что-то интересное, копай глубже.
- После 25-го ответа пользователя — возвращай финальный результат.
- ВСЕГДА отвечай ТОЛЬКО валидным JSON без лишнего текста.

ФОРМАТ для вопросов 1–25:
{"type":"question","question_num":<1-25>,"text":"<текст вопроса>","options":["<вариант1>","<вариант2>","<вариант3>","<вариант4>"]}

ФОРМАТ финального результата (строго после 25-го ответа):
{"type":"result","personality_type":"<2-3 слова, например Творец-Аналитик>","summary":"<4-5 предложений честного анализа на основе всех 25 ответов>","professions":[{"name":"<профессия>","emoji":"<эмодзи>","score":<число 72-97>,"category":"<IT/Дизайн/Бизнес/Аналитика/Медицина/Образование/Финансы/Маркетинг/Управление>","reason":"<1-2 предложения почему подходит>"},{"name":"...","emoji":"...","score":...,"category":"...","reason":"..."},{"name":"...","emoji":"...","score":...,"category":"...","reason":"..."},{"name":"...","emoji":"...","score":...,"category":"...","reason":"..."},{"name":"...","emoji":"...","score":...,"category":"...","reason":"..."}],"strengths":["<сила1>","<сила2>","<сила3>","<сила4>"],"advice":"<2-3 предложения конкретного совета с учётом всех ответов>"}"""


# ─── API endpoint ──────────────────────────────────────────────────────────────

class QuizAnswers(BaseModel):
    answers: dict[str, Any]


class AIChatMessage(BaseModel):
    role: str
    content: str


class AIChatBody(BaseModel):
    history: list[AIChatMessage] = []
    lang: str = "ru"


@router.post("/ai-question")
async def ai_quiz_question(body: AIChatBody):
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        return {"type": "error", "message": "AI not configured"}
    try:
        client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")
        lang_note = "Веди интервью на таджикском языке (таджикский + кириллица)." if body.lang == "tj" else "Веди интервью на русском языке."
        system = AI_QUIZ_SYSTEM_PROMPT + f"\n\n{lang_note}"

        # Count how many user answers have been given so far
        n_answered = sum(1 for m in body.history if m.role == "user")
        next_q_num = n_answered + 1

        # Inject question counter into system so model always knows where it is
        if n_answered < 25:
            status_note = (
                f"\n\nТЕКУЩИЙ СТАТУС: пользователь уже ответил на {n_answered} вопрос(ов). "
                f"Следующий вопрос — НОМЕР {next_q_num} из 25. "
                f"Задай НОВЫЙ вопрос на другую тему (не повторяй предыдущие темы). "
                f"Верни JSON с question_num={next_q_num}."
            )
        else:
            status_note = (
                "\n\nТЕКУЩИЙ СТАТУС: все 25 вопросов заданы и получены ответы. "
                "Немедленно верни финальный JSON с type='result'."
            )

        messages = [{"role": "system", "content": system + status_note}]
        messages += [{"role": m.role, "content": m.content} for m in body.history]

        response = client.chat.completions.create(
            model="deepseek-chat",
            max_tokens=800,
            temperature=0.8,
            messages=messages,
        )
        text = response.choices[0].message.content.strip()

        # Strip markdown code fences if present
        if "```" in text:
            parts = text.split("```")
            # find the json block
            for part in parts:
                part = part.strip()
                if part.startswith("json"):
                    part = part[4:].strip()
                if part.startswith("{"):
                    text = part
                    break

        # Find JSON object in case there's extra text
        start = text.find("{")
        end   = text.rfind("}") + 1
        if start != -1 and end > start:
            text = text[start:end]

        return json.loads(text)
    except Exception as e:
        return {"type": "error", "message": str(e)}


@router.post("/analyze")
async def analyze_quiz(body: QuizAnswers):
    riasec = compute_riasec(body.answers)
    top5 = match_professions(riasec)

    ai_analysis = await get_ai_analysis(riasec, top5)

    return {
        "professions": top5,
        "riasec": riasec,
        "ai_analysis": ai_analysis,
    }
