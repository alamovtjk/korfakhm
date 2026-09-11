# TajCareer AI 🚀

Карьерная платформа для Таджикистана с ИИ-анализом и персональными планами развития.

## Стек
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Python + FastAPI
- **AI:** Anthropic Claude API
- **БД:** PostgreSQL (опционально)

## Быстрый старт

### Фронтенд
```bash
cd frontend
npm install
npm run dev
# Открой http://localhost:5173
```

### Бэкенд
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Добавь ANTHROPIC_API_KEY в .env
python run.py
# API на http://localhost:8000
```

## Структура
```
├── frontend/          # React + Vite
│   └── src/
│       ├── pages/     # Landing, Quiz, Results, CareerPlan, Dashboard
│       └── App.jsx
└── backend/           # FastAPI
    └── app/
        ├── main.py
        └── routers/   # quiz, plan, vacancies
```

## Без ключа API
Платформа работает в демо-режиме без ANTHROPIC_API_KEY — показывает заготовленные планы.
