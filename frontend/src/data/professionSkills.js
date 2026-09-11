// Skills required per profession, each with level: 'critical' | 'important' | 'nice'
// level maps to how essential the skill is for entry-level

export const PROFESSION_SKILLS = {
  'Frontend-разработчик': {
    skills: [
      { name: { ru: 'HTML / CSS', tj: 'HTML / CSS' }, level: 'critical' },
      { name: { ru: 'JavaScript', tj: 'JavaScript' }, level: 'critical' },
      { name: { ru: 'React / Vue', tj: 'React / Vue' }, level: 'important' },
      { name: { ru: 'Git', tj: 'Git' }, level: 'important' },
      { name: { ru: 'Английский язык', tj: 'Забони англисӣ' }, level: 'important' },
      { name: { ru: 'Figma (чтение макетов)', tj: 'Figma (хондани макетҳо)' }, level: 'nice' },
    ],
    riasecKey: ['I', 'A', 'C'],
    salaryTJ: '800–2500 $',
  },
  'Backend-разработчик': {
    skills: [
      { name: { ru: 'Python / Node.js / Java', tj: 'Python / Node.js / Java' }, level: 'critical' },
      { name: { ru: 'SQL / базы данных', tj: 'SQL / пойгоҳи маълумот' }, level: 'critical' },
      { name: { ru: 'REST API', tj: 'REST API' }, level: 'critical' },
      { name: { ru: 'Git', tj: 'Git' }, level: 'important' },
      { name: { ru: 'Английский язык', tj: 'Забони англисӣ' }, level: 'important' },
      { name: { ru: 'Docker', tj: 'Docker' }, level: 'nice' },
    ],
    riasecKey: ['I', 'C'],
    salaryTJ: '1000–3000 $',
  },
  'Мобильный разработчик': {
    skills: [
      { name: { ru: 'Swift / Kotlin / Flutter', tj: 'Swift / Kotlin / Flutter' }, level: 'critical' },
      { name: { ru: 'UI/UX основы', tj: 'Асосҳои UI/UX' }, level: 'important' },
      { name: { ru: 'REST API', tj: 'REST API' }, level: 'important' },
      { name: { ru: 'Git', tj: 'Git' }, level: 'important' },
      { name: { ru: 'Английский язык', tj: 'Забони англисӣ' }, level: 'important' },
      { name: { ru: 'App Store / Play Market', tj: 'App Store / Play Market' }, level: 'nice' },
    ],
    riasecKey: ['I', 'A', 'C'],
    salaryTJ: '900–2800 $',
  },
  'DevOps / SRE': {
    skills: [
      { name: { ru: 'Linux', tj: 'Linux' }, level: 'critical' },
      { name: { ru: 'Docker / Kubernetes', tj: 'Docker / Kubernetes' }, level: 'critical' },
      { name: { ru: 'CI/CD (GitHub Actions)', tj: 'CI/CD (GitHub Actions)' }, level: 'important' },
      { name: { ru: 'Bash / Python скрипты', tj: 'Bash / Python скриптҳо' }, level: 'important' },
      { name: { ru: 'Английский язык', tj: 'Забони англисӣ' }, level: 'important' },
      { name: { ru: 'AWS / GCP / Azure', tj: 'AWS / GCP / Azure' }, level: 'nice' },
    ],
    riasecKey: ['R', 'I', 'C'],
    salaryTJ: '1200–4000 $',
  },
  'Data Scientist': {
    skills: [
      { name: { ru: 'Python', tj: 'Python' }, level: 'critical' },
      { name: { ru: 'Математика / статистика', tj: 'Математика / статистика' }, level: 'critical' },
      { name: { ru: 'Pandas / NumPy', tj: 'Pandas / NumPy' }, level: 'critical' },
      { name: { ru: 'ML (машинное обучение)', tj: 'ML (омӯзиши мошинӣ)' }, level: 'important' },
      { name: { ru: 'Английский язык', tj: 'Забони англисӣ' }, level: 'important' },
      { name: { ru: 'SQL', tj: 'SQL' }, level: 'important' },
    ],
    riasecKey: ['I', 'C'],
    salaryTJ: '1500–5000 $',
  },
  'QA Engineer': {
    skills: [
      { name: { ru: 'Тест-кейсы и чек-листы', tj: 'Тест-кейсҳо ва чек-листҳо' }, level: 'critical' },
      { name: { ru: 'Postman (API-тесты)', tj: 'Postman (API-тестҳо)' }, level: 'important' },
      { name: { ru: 'Selenium / Cypress', tj: 'Selenium / Cypress' }, level: 'important' },
      { name: { ru: 'SQL', tj: 'SQL' }, level: 'nice' },
      { name: { ru: 'Английский язык', tj: 'Забони англисӣ' }, level: 'important' },
    ],
    riasecKey: ['I', 'C'],
    salaryTJ: '600–1800 $',
  },
  'UX/UI дизайнер': {
    skills: [
      { name: { ru: 'Figma', tj: 'Figma' }, level: 'critical' },
      { name: { ru: 'Основы UX-исследований', tj: 'Асосҳои UX-тадқиқотҳо' }, level: 'critical' },
      { name: { ru: 'Прототипирование', tj: 'Прототипсозӣ' }, level: 'important' },
      { name: { ru: 'Основы HTML/CSS', tj: 'Асосҳои HTML/CSS' }, level: 'nice' },
      { name: { ru: 'Английский язык', tj: 'Забони англисӣ' }, level: 'important' },
    ],
    riasecKey: ['A', 'I', 'S'],
    salaryTJ: '700–2200 $',
  },
  'Графический дизайнер': {
    skills: [
      { name: { ru: 'Adobe Photoshop / Illustrator', tj: 'Adobe Photoshop / Illustrator' }, level: 'critical' },
      { name: { ru: 'Теория цвета и типографика', tj: 'Назарияи ранг ва типография' }, level: 'critical' },
      { name: { ru: 'Figma', tj: 'Figma' }, level: 'important' },
      { name: { ru: 'Портфолио', tj: 'Портфолио' }, level: 'important' },
      { name: { ru: 'Брендинг', tj: 'Брендинг' }, level: 'nice' },
    ],
    riasecKey: ['A', 'R'],
    salaryTJ: '400–1500 $',
  },
  'Видеограф / монтажёр': {
    skills: [
      { name: { ru: 'Premiere Pro / DaVinci', tj: 'Premiere Pro / DaVinci' }, level: 'critical' },
      { name: { ru: 'Основы операторской работы', tj: 'Асосҳои оператории' }, level: 'critical' },
      { name: { ru: 'After Effects (моушн)', tj: 'After Effects (моушн)' }, level: 'important' },
      { name: { ru: 'Цветокоррекция', tj: 'Таслими ранг' }, level: 'important' },
      { name: { ru: 'Сторителлинг', tj: 'Сторителлинг' }, level: 'nice' },
    ],
    riasecKey: ['A', 'R'],
    salaryTJ: '300–1200 $',
  },
  'Предприниматель': {
    skills: [
      { name: { ru: 'Бизнес-планирование', tj: 'Банақшагирии тиҷорат' }, level: 'critical' },
      { name: { ru: 'Финансовая грамотность', tj: 'Саводнокии молиявӣ' }, level: 'critical' },
      { name: { ru: 'Переговоры и продажи', tj: 'Гуфтушунид ва фурӯш' }, level: 'critical' },
      { name: { ru: 'Маркетинг', tj: 'Маркетинг' }, level: 'important' },
      { name: { ru: 'Управление командой', tj: 'Идоракунии гурӯҳ' }, level: 'important' },
    ],
    riasecKey: ['E', 'S', 'I'],
    salaryTJ: 'нет предела',
  },
  'Продакт-менеджер': {
    skills: [
      { name: { ru: 'Понимание разработки', tj: 'Фаҳмиши таҳия' }, level: 'critical' },
      { name: { ru: 'Работа с данными / аналитика', tj: 'Кор бо маълумот / аналитика' }, level: 'critical' },
      { name: { ru: 'Коммуникация с командой', tj: 'Муошират бо гурӯҳ' }, level: 'critical' },
      { name: { ru: 'Figma (чтение)', tj: 'Figma (хондан)' }, level: 'important' },
      { name: { ru: 'Английский язык', tj: 'Забони англисӣ' }, level: 'important' },
    ],
    riasecKey: ['E', 'I', 'S'],
    salaryTJ: '1000–3500 $',
  },
  'Менеджер проектов': {
    skills: [
      { name: { ru: 'Jira / Trello / Notion', tj: 'Jira / Trello / Notion' }, level: 'critical' },
      { name: { ru: 'Agile / Scrum', tj: 'Agile / Scrum' }, level: 'important' },
      { name: { ru: 'Управление рисками', tj: 'Идоракунии хавф' }, level: 'important' },
      { name: { ru: 'Коммуникация', tj: 'Муошират' }, level: 'critical' },
      { name: { ru: 'Планирование и дедлайны', tj: 'Банақшагирӣ ва муҳлатҳо' }, level: 'critical' },
    ],
    riasecKey: ['E', 'C', 'S'],
    salaryTJ: '700–2500 $',
  },
  'HR-менеджер': {
    skills: [
      { name: { ru: 'Рекрутинг и интервью', tj: 'Рекрутинг ва мусоҳибаҳо' }, level: 'critical' },
      { name: { ru: 'Трудовое право', tj: 'Ҳуқуқи меҳнат' }, level: 'important' },
      { name: { ru: 'Психология общения', tj: 'Психологияи муошират' }, level: 'important' },
      { name: { ru: 'Excel / Google Таблицы', tj: 'Excel / Google Ҷадвалҳо' }, level: 'nice' },
    ],
    riasecKey: ['S', 'E', 'C'],
    salaryTJ: '400–1200 $',
  },
  'Маркетолог': {
    skills: [
      { name: { ru: 'Анализ аудитории', tj: 'Таҳлили аудитория' }, level: 'critical' },
      { name: { ru: 'Google Analytics / Яндекс.Метрика', tj: 'Google Analytics / Яндекс.Метрика' }, level: 'important' },
      { name: { ru: 'Контент-стратегия', tj: 'Стратегияи контент' }, level: 'critical' },
      { name: { ru: 'Таргетированная реклама', tj: 'Таргетинги реклама' }, level: 'important' },
      { name: { ru: 'Copywriting', tj: 'Copywriting' }, level: 'nice' },
    ],
    riasecKey: ['E', 'A', 'I'],
    salaryTJ: '500–1800 $',
  },
  'SMM-специалист': {
    skills: [
      { name: { ru: 'Instagram / TikTok / Telegram', tj: 'Instagram / TikTok / Telegram' }, level: 'critical' },
      { name: { ru: 'Создание контента (фото/видео)', tj: 'Сохтани контент (акс/видео)' }, level: 'critical' },
      { name: { ru: 'Копирайтинг', tj: 'Копирайтинг' }, level: 'important' },
      { name: { ru: 'Таргетированная реклама', tj: 'Таргетинги реклама' }, level: 'important' },
      { name: { ru: 'Аналитика охватов', tj: 'Таҳлили фарогирӣ' }, level: 'nice' },
    ],
    riasecKey: ['A', 'S', 'E'],
    salaryTJ: '300–1000 $',
  },
  'Копирайтер / контент': {
    skills: [
      { name: { ru: 'Грамотность (рус/тадж)', tj: 'Саводнокӣ (рус/тоҷ)' }, level: 'critical' },
      { name: { ru: 'SEO-основы', tj: 'Асосҳои SEO' }, level: 'important' },
      { name: { ru: 'Сторителлинг', tj: 'Сторителлинг' }, level: 'critical' },
      { name: { ru: 'Работа с редакторами (Notion, Word)', tj: 'Кор бо муҳаррирон' }, level: 'nice' },
    ],
    riasecKey: ['A', 'I'],
    salaryTJ: '250–900 $',
  },
  'Финансовый аналитик': {
    skills: [
      { name: { ru: 'Excel / Google Таблицы', tj: 'Excel / Google Ҷадвалҳо' }, level: 'critical' },
      { name: { ru: 'Финансовая отчётность', tj: 'Ҳисоботи молиявӣ' }, level: 'critical' },
      { name: { ru: 'SQL', tj: 'SQL' }, level: 'important' },
      { name: { ru: 'Статистика', tj: 'Статистика' }, level: 'important' },
      { name: { ru: 'Power BI / Tableau', tj: 'Power BI / Tableau' }, level: 'nice' },
    ],
    riasecKey: ['I', 'C'],
    salaryTJ: '700–2500 $',
  },
  'Бухгалтер': {
    skills: [
      { name: { ru: '1С Бухгалтерия', tj: '1С Бухгалтерия' }, level: 'critical' },
      { name: { ru: 'Налоговое законодательство РТ', tj: 'Қонунгузории андозии ҶТ' }, level: 'critical' },
      { name: { ru: 'Excel', tj: 'Excel' }, level: 'critical' },
      { name: { ru: 'Первичная документация', tj: 'Ҳуҷҷатгузории ибтидоӣ' }, level: 'important' },
    ],
    riasecKey: ['C', 'I'],
    salaryTJ: '300–900 $',
  },
  'Врач / медработник': {
    skills: [
      { name: { ru: 'Медицинское образование', tj: 'Маълумоти тиббӣ' }, level: 'critical' },
      { name: { ru: 'Клиническое мышление', tj: 'Тафаккури клиникӣ' }, level: 'critical' },
      { name: { ru: 'Эмпатия и коммуникация', tj: 'Эмпатия ва муошират' }, level: 'critical' },
      { name: { ru: 'Первая помощь', tj: 'Ёрдами аввалин' }, level: 'important' },
    ],
    riasecKey: ['I', 'S', 'R'],
    salaryTJ: '300–1500 $',
  },
  'Психолог': {
    skills: [
      { name: { ru: 'Теории психологии', tj: 'Назарияҳои психология' }, level: 'critical' },
      { name: { ru: 'Активное слушание', tj: 'Гӯш кардани фаъол' }, level: 'critical' },
      { name: { ru: 'Диагностические методики', tj: 'Методикаҳои ташхисӣ' }, level: 'important' },
      { name: { ru: 'Эмпатия', tj: 'Эмпатия' }, level: 'critical' },
      { name: { ru: 'CBT / другие методы', tj: 'CBT / усулҳои дигар' }, level: 'nice' },
    ],
    riasecKey: ['S', 'I'],
    salaryTJ: '300–1200 $',
  },
  'Учитель / преподаватель': {
    skills: [
      { name: { ru: 'Знание предмета', tj: 'Донистани фан' }, level: 'critical' },
      { name: { ru: 'Педагогика', tj: 'Педагогика' }, level: 'critical' },
      { name: { ru: 'Коммуникация с аудиторией', tj: 'Муошират бо аудитория' }, level: 'critical' },
      { name: { ru: 'Планирование уроков', tj: 'Банақшагирии дарсҳо' }, level: 'important' },
      { name: { ru: 'Digital-инструменты', tj: 'Абзорҳои Digital' }, level: 'nice' },
    ],
    riasecKey: ['S', 'A', 'I'],
    salaryTJ: '200–700 $',
  },
  'Бизнес-аналитик': {
    skills: [
      { name: { ru: 'SQL', tj: 'SQL' }, level: 'critical' },
      { name: { ru: 'Excel / Power BI', tj: 'Excel / Power BI' }, level: 'critical' },
      { name: { ru: 'Сбор и анализ требований', tj: 'Ҷамъоварӣ ва таҳлили талабот' }, level: 'critical' },
      { name: { ru: 'BPMN / UML', tj: 'BPMN / UML' }, level: 'important' },
      { name: { ru: 'Коммуникация с IT', tj: 'Муошират бо IT' }, level: 'important' },
    ],
    riasecKey: ['I', 'C', 'E'],
    salaryTJ: '800–2800 $',
  },
  'Юрист': {
    skills: [
      { name: { ru: 'Законодательство РТ', tj: 'Қонунгузории ҶТ' }, level: 'critical' },
      { name: { ru: 'Составление документов', tj: 'Тартиб додани ҳуҷҷатҳо' }, level: 'critical' },
      { name: { ru: 'Аналитическое мышление', tj: 'Тафаккури таҳлилӣ' }, level: 'critical' },
      { name: { ru: 'Навыки переговоров', tj: 'Малакаҳои гуфтушунид' }, level: 'important' },
      { name: { ru: 'Английский язык', tj: 'Забони англисӣ' }, level: 'nice' },
    ],
    riasecKey: ['I', 'E', 'C'],
    salaryTJ: '400–2000 $',
  },
}

// RIASEC quiz answers → skill level mapping
// Uses the quiz answers stored in localStorage to estimate current skill levels
export function estimateUserSkills(professionName, quizAnswers) {
  const prof = PROFESSION_SKILLS[professionName]
  if (!prof || !quizAnswers) return null

  // Map RIASEC dims to rough skill presence score based on quiz answers
  // This is a heuristic — we check if the user answered high on relevant dims
  const riasecAnswers = {}

  // Scale questions: q9-q18, q22-q23 → sum up relevant scores
  const scaleQMap = {
    9: 'E', 10: 'A', 11: 'I', 12: 'R', 13: 'S', 14: 'E',
    15: 'E', 16: 'I', 17: 'S', 18: 'C', 22: 'E', 23: 'I',
  }
  for (const [qid, dim] of Object.entries(scaleQMap)) {
    const ans = quizAnswers[qid]
    if (ans !== undefined) {
      riasecAnswers[dim] = (riasecAnswers[dim] || 0) + ans
    }
  }

  return prof.skills.map(skill => {
    // Estimate likelihood user has this skill based on RIASEC alignment
    // 'critical' skills: user needs high score in relevant dims
    // We output: 'strong' | 'partial' | 'missing'
    const relevantDim = prof.riasecKey[0]
    const score = riasecAnswers[relevantDim] || 0
    const maxScore = 25 // 5 questions × max 5

    const ratio = score / maxScore

    if (skill.level === 'critical') {
      return { ...skill, status: ratio > 0.65 ? 'partial' : 'missing' }
    }
    if (skill.level === 'important') {
      return { ...skill, status: ratio > 0.5 ? 'partial' : 'missing' }
    }
    return { ...skill, status: ratio > 0.4 ? 'partial' : 'missing' }
  })
}
