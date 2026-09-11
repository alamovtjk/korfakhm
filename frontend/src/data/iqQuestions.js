export const IQ_DURATION = 20 * 60 // 20 minutes

export const IQ_CATEGORIES = {
  sequence: { ru: 'Последовательность', tj: 'Силсила', color: 'bg-blue-500' },
  analogy:  { ru: 'Аналогия',           tj: 'Аналогия', color: 'bg-violet-500' },
  odd:      { ru: 'Лишнее',             tj: 'Ягона',    color: 'bg-emerald-500' },
  logic:    { ru: 'Логика',             tj: 'Мантиқ',   color: 'bg-amber-500' },
  matrix:   { ru: 'Паттерн',            tj: 'Намуна',   color: 'bg-rose-500' },
}

// difficulty: 1=easy(1pt) 2=medium(2pt) 3=hard(3pt)
// type: 'choice' | 'matrix'
// answer: correct option index (0-based)
// matrix: 3×3 array, null = missing cell (always last)

export const IQ_QUESTIONS = [
  // ── СИЛСИЛА / SEQUENCES ─────────────────────────────────────────────────────
  {
    id: 1, category: 'sequence', difficulty: 1,
    text: {
      tj: 'Рақами навбатиро ёбед:   2,  4,  6,  8,  ?',
      ru: 'Найдите следующее число: 2, 4, 6, 8, ?',
    },
    options: [
      { tj: '9',  ru: '9'  },
      { tj: '10', ru: '10' },
      { tj: '11', ru: '11' },
      { tj: '12', ru: '12' },
    ],
    answer: 1,
  },
  {
    id: 2, category: 'sequence', difficulty: 1,
    text: {
      tj: 'Рақами навбатиро ёбед:   10,  20,  30,  40,  ?',
      ru: 'Найдите следующее число: 10, 20, 30, 40, ?',
    },
    options: [
      { tj: '45', ru: '45' },
      { tj: '50', ru: '50' },
      { tj: '55', ru: '55' },
      { tj: '60', ru: '60' },
    ],
    answer: 1,
  },
  {
    id: 3, category: 'sequence', difficulty: 2,
    text: {
      tj: 'Рақами навбатиро ёбед:   1,  4,  9,  16,  ?',
      ru: 'Найдите следующее число: 1, 4, 9, 16, ?',
    },
    options: [
      { tj: '20', ru: '20' },
      { tj: '24', ru: '24' },
      { tj: '25', ru: '25' },
      { tj: '32', ru: '32' },
    ],
    answer: 2,
  },
  {
    id: 4, category: 'sequence', difficulty: 2,
    text: {
      tj: 'Рақами навбатиро ёбед:   3,  6,  12,  24,  ?',
      ru: 'Найдите следующее число: 3, 6, 12, 24, ?',
    },
    options: [
      { tj: '36', ru: '36' },
      { tj: '42', ru: '42' },
      { tj: '48', ru: '48' },
      { tj: '56', ru: '56' },
    ],
    answer: 2,
  },
  {
    id: 5, category: 'sequence', difficulty: 3,
    text: {
      tj: 'Рақами навбатиро ёбед:   1,  1,  2,  3,  5,  8,  ?',
      ru: 'Найдите следующее число: 1, 1, 2, 3, 5, 8, ?',
    },
    options: [
      { tj: '11', ru: '11' },
      { tj: '12', ru: '12' },
      { tj: '13', ru: '13' },
      { tj: '14', ru: '14' },
    ],
    answer: 2,
  },

  // ── АНАЛОГИЯ / ANALOGIES ─────────────────────────────────────────────────────
  {
    id: 6, category: 'analogy', difficulty: 1,
    text: {
      tj: 'Устод : Мактаб  ::  Духтур : ?',
      ru: 'Учитель : Школа  ::  Врач : ?',
    },
    options: [
      { tj: 'Беморхона', ru: 'Больница' },
      { tj: 'Бозор',     ru: 'Рынок'    },
      { tj: 'Мактаб',    ru: 'Школа'    },
      { tj: 'Боғ',       ru: 'Сад'      },
    ],
    answer: 0,
  },
  {
    id: 7, category: 'analogy', difficulty: 1,
    text: {
      tj: 'Парранда : Осмон  ::  Моҳӣ : ?',
      ru: 'Птица : Небо  ::  Рыба : ?',
    },
    options: [
      { tj: 'Замин',   ru: 'Земля'  },
      { tj: 'Об',      ru: 'Вода'   },
      { tj: 'Кӯҳ',    ru: 'Гора'   },
      { tj: 'Биёбон', ru: 'Пустыня' },
    ],
    answer: 1,
  },
  {
    id: 8, category: 'analogy', difficulty: 1,
    text: {
      tj: 'Оташ : Гарм  ::  Ях : ?',
      ru: 'Огонь : Горячий  ::  Лёд : ?',
    },
    options: [
      { tj: 'Тар',   ru: 'Мокрый'  },
      { tj: 'Сард',  ru: 'Холодный' },
      { tj: 'Сабук', ru: 'Лёгкий'  },
      { tj: 'Хушк',  ru: 'Сухой'   },
    ],
    answer: 1,
  },
  {
    id: 9, category: 'analogy', difficulty: 2,
    text: {
      tj: 'Моҳ : Сол  ::  Соат : ?',
      ru: 'Месяц : Год  ::  Час : ?',
    },
    options: [
      { tj: 'Дақиқа', ru: 'Минута' },
      { tj: 'Рӯз',    ru: 'День'   },
      { tj: 'Ҳафта',  ru: 'Неделя' },
      { tj: 'Сония',  ru: 'Секунда' },
    ],
    answer: 1,
  },
  {
    id: 10, category: 'analogy', difficulty: 2,
    text: {
      tj: 'Гӯш : Шунидан  ::  Чашм : ?',
      ru: 'Ухо : Слышать  ::  Глаз : ?',
    },
    options: [
      { tj: 'Хондан',     ru: 'Читать'    },
      { tj: 'Дидан',      ru: 'Видеть'    },
      { tj: 'Бӯидан',     ru: 'Нюхать'   },
      { tj: 'Ламс кардан', ru: 'Трогать'  },
    ],
    answer: 1,
  },
  {
    id: 11, category: 'analogy', difficulty: 2,
    text: {
      tj: 'Қалам : Нависандагӣ  ::  Бел : ?',
      ru: 'Ручка : Письмо  ::  Лопата : ?',
    },
    options: [
      { tj: 'Сохтан',    ru: 'Строить' },
      { tj: 'Буридан',   ru: 'Резать'  },
      { tj: 'Кофтан',    ru: 'Копать'  },
      { tj: 'Партофтан', ru: 'Бросать' },
    ],
    answer: 2,
  },
  {
    id: 12, category: 'analogy', difficulty: 3,
    text: {
      tj: 'Наққош : Тасвир  ::  Мусиқинавоз : ?',
      ru: 'Художник : Картина  ::  Музыкант : ?',
    },
    options: [
      { tj: 'Шеър',   ru: 'Стихи'  },
      { tj: 'Оҳанг',  ru: 'Мелодия' },
      { tj: 'Рақс',   ru: 'Танец'  },
      { tj: 'Ҳайкал', ru: 'Скульптура' },
    ],
    answer: 1,
  },

  // ── ЯГОНА / ODD ONE OUT ──────────────────────────────────────────────────────
  {
    id: 13, category: 'odd', difficulty: 1,
    text: {
      tj: 'Кадоме ба дигарон монанд нест?',
      ru: 'Что лишнее?',
    },
    options: [
      { tj: 'Саг',      ru: 'Собака'  },
      { tj: 'Гурба',    ru: 'Кошка'   },
      { tj: 'Асп',      ru: 'Лошадь'  },
      { tj: 'Кабӯтар',  ru: 'Голубь'  },
    ],
    answer: 3,
    hint: { tj: '(ягона паранда)', ru: '(единственная птица)' },
  },
  {
    id: 14, category: 'odd', difficulty: 2,
    text: {
      tj: 'Кадоме ба дигарон монанд нест?',
      ru: 'Что лишнее?',
    },
    options: [
      { tj: 'Себ',       ru: 'Яблоко'   },
      { tj: 'Анор',      ru: 'Гранат'   },
      { tj: 'Лимӯ',      ru: 'Лимон'    },
      { tj: 'Картошка',  ru: 'Картошка' },
    ],
    answer: 3,
    hint: { tj: '(сабзавот, на мева)', ru: '(овощ, не фрукт)' },
  },
  {
    id: 15, category: 'odd', difficulty: 2,
    text: {
      tj: 'Кадоме ба дигарон монанд нест?',
      ru: 'Что лишнее?',
    },
    options: [
      { tj: 'Нил',      ru: 'Нил'      },
      { tj: 'Амазонка', ru: 'Амазонка' },
      { tj: 'Атлас',    ru: 'Атлас'    },
      { tj: 'Волга',    ru: 'Волга'    },
    ],
    answer: 2,
    hint: { tj: '(кӯҳ, на дарё)', ru: '(горный хребет, не река)' },
  },
  {
    id: 16, category: 'odd', difficulty: 3,
    text: {
      tj: 'Кадоме ба дигарон монанд нест?',
      ru: 'Что лишнее?',
    },
    options: [
      { tj: '16', ru: '16' },
      { tj: '25', ru: '25' },
      { tj: '36', ru: '36' },
      { tj: '50', ru: '50' },
    ],
    answer: 3,
    hint: { tj: '(на мураббаи комил)', ru: '(не точный квадрат)' },
  },

  // ── МАНТИҚ / LOGIC ───────────────────────────────────────────────────────────
  {
    id: 17, category: 'logic', difficulty: 1,
    text: {
      tj: 'Ҳамаи паррандаҳо тухм мегузоранд. Уқоб парранда аст. Пас уқоб...',
      ru: 'Все птицы откладывают яйца. Орёл — птица. Значит орёл...',
    },
    options: [
      { tj: 'тухм мегузорад',              ru: 'откладывает яйца'   },
      { tj: 'дар об зиндагӣ мекунад',      ru: 'живёт в воде'       },
      { tj: 'парвоз карда наметавонад',     ru: 'не умеет летать'    },
      { tj: 'ширхор аст',                   ru: 'является млекопитающим' },
    ],
    answer: 0,
  },
  {
    id: 18, category: 'logic', difficulty: 2,
    text: {
      tj: 'Алӣ аз Баҳром калонтар аст. Баҳром аз Камол калонтар аст. Кӣ аз ҳама хурдтар?',
      ru: 'Али старше Бахрома. Бахром старше Камола. Кто самый младший?',
    },
    options: [
      { tj: 'Алӣ',        ru: 'Али'        },
      { tj: 'Баҳром',     ru: 'Бахром'     },
      { tj: 'Камол',      ru: 'Камол'      },
      { tj: 'Маълум нест', ru: 'Неизвестно' },
    ],
    answer: 2,
  },
  {
    id: 19, category: 'logic', difficulty: 1,
    text: {
      tj: 'Дар сабад 5 себ буд. Шумо 2-тоашро гирифтед. Чанд себ монд?',
      ru: 'В корзине было 5 яблок. Вы взяли 2. Сколько осталось?',
    },
    options: [
      { tj: '2', ru: '2' },
      { tj: '3', ru: '3' },
      { tj: '4', ru: '4' },
      { tj: '5', ru: '5' },
    ],
    answer: 1,
  },
  {
    id: 20, category: 'logic', difficulty: 2,
    text: {
      tj: 'Дар як ҳафта 7 рӯз аст. 14 рӯз чанд ҳафта мешавад?',
      ru: 'В неделе 7 дней. Сколько недель в 14 днях?',
    },
    options: [
      { tj: '1', ru: '1' },
      { tj: '2', ru: '2' },
      { tj: '3', ru: '3' },
      { tj: '4', ru: '4' },
    ],
    answer: 1,
  },
  {
    id: 21, category: 'logic', difficulty: 3,
    text: {
      tj: 'Аз соати 10-и субҳ то соати 2-и баъдизӯҳр чанд соат мегузарад?',
      ru: 'Сколько часов проходит с 10:00 до 14:00?',
    },
    options: [
      { tj: '3 соат', ru: '3 часа' },
      { tj: '4 соат', ru: '4 часа' },
      { tj: '5 соат', ru: '5 часов' },
      { tj: '6 соат', ru: '6 часов' },
    ],
    answer: 1,
  },

  // ── НАМУНА / MATRIX ──────────────────────────────────────────────────────────
  {
    id: 22, category: 'matrix', difficulty: 1,
    text: {
      tj: 'Рақами гумшударо дар ҷадвал ёбед:',
      ru: 'Найдите пропущенное число в таблице:',
    },
    matrix: [[1, 2, 3], [4, 5, 6], [7, 8, null]],
    options: [
      { tj: '8',  ru: '8'  },
      { tj: '9',  ru: '9'  },
      { tj: '10', ru: '10' },
      { tj: '11', ru: '11' },
    ],
    answer: 1,
  },
  {
    id: 23, category: 'matrix', difficulty: 2,
    text: {
      tj: 'Рақами гумшударо дар ҷадвал ёбед:',
      ru: 'Найдите пропущенное число в таблице:',
    },
    matrix: [[2, 4, 8], [3, 6, 12], [4, 8, null]],
    options: [
      { tj: '14', ru: '14' },
      { tj: '16', ru: '16' },
      { tj: '18', ru: '18' },
      { tj: '20', ru: '20' },
    ],
    answer: 1,
  },
  {
    id: 24, category: 'matrix', difficulty: 2,
    text: {
      tj: 'Рақами гумшударо дар ҷадвал ёбед:',
      ru: 'Найдите пропущенное число в таблице:',
    },
    matrix: [[1, 2, 3], [2, 4, 6], [3, 6, null]],
    options: [
      { tj: '7',  ru: '7'  },
      { tj: '8',  ru: '8'  },
      { tj: '9',  ru: '9'  },
      { tj: '12', ru: '12' },
    ],
    answer: 2,
  },
  {
    id: 25, category: 'matrix', difficulty: 3,
    text: {
      tj: 'Рақами гумшударо дар ҷадвал ёбед:',
      ru: 'Найдите пропущенное число в таблице:',
    },
    matrix: [[5, 10, 15], [4, 8, 12], [3, 6, null]],
    options: [
      { tj: '7',  ru: '7'  },
      { tj: '8',  ru: '8'  },
      { tj: '9',  ru: '9'  },
      { tj: '10', ru: '10' },
    ],
    answer: 2,
  },

  // ── TRICK question — always shown last ──────────────────────────────────────
  {
    id: 26, category: 'logic', difficulty: 2, trick: true,
    text: {
      tj: '🤔 Дар як сол чанд моҳ 28 рӯз дорад?',
      ru: '🤔 Сколько месяцев в году имеют 28 дней?',
    },
    options: [
      { tj: '1 (танҳо феврал)',  ru: '1 (только февраль)' },
      { tj: '4',                 ru: '4'                  },
      { tj: '6',                 ru: '6'                  },
      { tj: 'Ҳама 12 моҳ',       ru: 'Все 12 месяцев'     },
    ],
    answer: 3,
  },
]

// ── Scoring ──────────────────────────────────────────────────────────────────

function normalCDF(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const d = 0.3989423 * Math.exp(-z * z / 2)
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.7814779 + t * (-1.8212560 + t * 1.3302744))))
  return z > 0 ? 1 - p : p
}

export function calcIQ(answers, questionSet = IQ_QUESTIONS) {
  let score = 0
  let maxScore = 0
  const catScore = {}
  const catMax = {}
  const catTotal = {}

  for (const q of questionSet) {
    const pts = q.difficulty || 1
    maxScore += pts
    catMax[q.category]  = (catMax[q.category]  || 0) + pts
    catTotal[q.category] = (catTotal[q.category] || 0) + 1
    if (catScore[q.category] === undefined) catScore[q.category] = 0

    // Explicit Number() conversion prevents string/number type mismatch
    const userAnswer    = Number(answers[String(q.id)])
    const correctAnswer = Number(q.answer)
    const wasAnswered   = answers[String(q.id)] !== undefined && answers[String(q.id)] !== null

    if (wasAnswered && userAnswer === correctAnswer) {
      score += pts
      catScore[q.category] += pts
    }
  }

  if (maxScore === 0) {
    return { iq: 85, score: 0, maxScore: 1, percentile: 16, catScore, catMax, catTotal, ratio: 0 }
  }

  const ratio = Math.min(1, Math.max(0, score / maxScore))

  // Non-linear mapping: gives wider spread across realistic score ranges (20–80%)
  // 0%→70  20%→82  35%→92  50%→100  65%→112  80%→124  95%→138  100%→145
  let iq
  if      (ratio >= 0.92) iq = Math.round(138 + (ratio - 0.92) / 0.08 * 7)
  else if (ratio >= 0.76) iq = Math.round(124 + (ratio - 0.76) / 0.16 * 14)
  else if (ratio >= 0.58) iq = Math.round(112 + (ratio - 0.58) / 0.18 * 12)
  else if (ratio >= 0.42) iq = Math.round(100 + (ratio - 0.42) / 0.16 * 12)
  else if (ratio >= 0.28) iq = Math.round(92  + (ratio - 0.28) / 0.14 * 8)
  else if (ratio >= 0.15) iq = Math.round(82  + (ratio - 0.15) / 0.13 * 10)
  else                    iq = Math.round(70  + (ratio       ) / 0.15 * 12)
  iq = Math.min(145, Math.max(70, iq))

  const z = (iq - 100) / 15
  const percentile = Math.min(99, Math.max(1, Math.round(normalCDF(z) * 100)))

  return { iq, score, maxScore, percentile, catScore, catMax, catTotal, ratio }
}

export function getIQLevel(iq) {
  if (iq >= 130) return {
    label: { tj: 'Нобиға', ru: 'Гений' },
    color: 'from-violet-500 to-purple-600',
    textColor: 'text-violet-500',
    desc: { tj: 'Шумо дар байни 2% беҳтарини одамон ҳастед', ru: 'Вы в топ 2% по интеллекту' },
    emoji: '🏆',
  }
  if (iq >= 120) return {
    label: { tj: 'Бисёр баланд', ru: 'Очень высокий' },
    color: 'from-blue-500 to-violet-500',
    textColor: 'text-blue-500',
    desc: { tj: 'Зеҳни шумо хеле баланд аст', ru: 'Интеллект значительно выше среднего' },
    emoji: '🌟',
  }
  if (iq >= 110) return {
    label: { tj: 'Болотар аз миёна', ru: 'Выше среднего' },
    color: 'from-cyan-500 to-blue-500',
    textColor: 'text-cyan-500',
    desc: { tj: 'Шумо аз аксари одамон зирактар ҳастед', ru: 'Вы умнее большинства людей' },
    emoji: '⭐',
  }
  if (iq >= 90) return {
    label: { tj: 'Миёна', ru: 'Средний' },
    color: 'from-emerald-500 to-cyan-500',
    textColor: 'text-emerald-500',
    desc: { tj: 'Зеҳни шумо дар сатҳи миёна аст', ru: 'Интеллект на среднем уровне' },
    emoji: '✅',
  }
  if (iq >= 80) return {
    label: { tj: 'Паст аз миёна', ru: 'Ниже среднего' },
    color: 'from-amber-500 to-orange-500',
    textColor: 'text-amber-500',
    desc: { tj: 'Бо машқ натиҷаро беҳтар кардан мумкин аст', ru: 'Результат можно улучшить с тренировкой' },
    emoji: '📈',
  }
  return {
    label: { tj: 'Паст', ru: 'Низкий' },
    color: 'from-orange-500 to-red-500',
    textColor: 'text-orange-500',
    desc: { tj: 'Кӯшиш кунед ва такрор гузаред', ru: 'Попробуйте пройти ещё раз' },
    emoji: '💪',
  }
}
