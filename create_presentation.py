"""
Генератор презентации TajCareer AI на таджикском языке
Запуск: python create_presentation.py
"""
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt
import copy

# ─── Цвета (флаг Таджикистана + современный UI) ───────────────────────────────
RED    = RGBColor(0xCC, 0x00, 0x00)   # красный флага
GREEN  = RGBColor(0x00, 0x7A, 0x33)   # зелёный флага
GOLD   = RGBColor(0xF5, 0xC5, 0x18)   # золотой (звезда флага)
NAVY   = RGBColor(0x0D, 0x1B, 0x4B)   # тёмно-синий фон
WHITE  = RGBColor(0xFF, 0xFF, 0xFF)
LIGHT  = RGBColor(0xF0, 0xF4, 0xFF)   # светло-голубой
GRAY   = RGBColor(0x44, 0x44, 0x55)

W = Inches(13.33)   # ширина слайда (widescreen 16:9)
H = Inches(7.5)     # высота слайда

prs = Presentation()
prs.slide_width  = W
prs.slide_height = H

blank = prs.slide_layouts[6]   # пустой макет


def add_rect(slide, x, y, w, h, fill_color, alpha=None):
    shape = slide.shapes.add_shape(1, x, y, w, h)
    shape.line.fill.background()
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill_color
    return shape


def add_text(slide, text, x, y, w, h, size, bold=False, color=WHITE,
             align=PP_ALIGN.LEFT, italic=False, wrap=True):
    txb = slide.shapes.add_textbox(x, y, w, h)
    txb.word_wrap = wrap
    tf = txb.text_frame
    tf.word_wrap = wrap
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = color
    run.font.name = "Arial"
    return txb


def add_bullet(slide, items, x, y, w, h, size=18, color=WHITE, icon="◆"):
    txb = slide.shapes.add_textbox(x, y, w, h)
    txb.word_wrap = True
    tf = txb.text_frame
    tf.word_wrap = True
    for i, item in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = PP_ALIGN.LEFT
        run = p.add_run()
        run.text = f"{icon}  {item}"
        run.font.size = Pt(size)
        run.font.color.rgb = color
        run.font.name = "Arial"
        p.space_after = Pt(6)
    return txb


def slide_bg(slide, top_color=NAVY, bottom_color=None):
    add_rect(slide, 0, 0, W, H, top_color)


def top_stripe(slide, color=GREEN, h=Inches(0.12)):
    add_rect(slide, 0, 0, W, h, color)


def bottom_stripe(slide, color=RED, h=Inches(0.12)):
    add_rect(slide, 0, H - h, W, h, color)


def accent_bar(slide, x, y, h, color=GOLD, w=Inches(0.07)):
    add_rect(slide, x, y, w, h, color)


# ═══════════════════════════════════════════════════════════════════════════════
# СЛАЙД 1 — ЗАГЛОВОК (Title)
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(blank)
slide_bg(s, NAVY)
top_stripe(s, GREEN, Inches(0.18))
bottom_stripe(s, RED, Inches(0.18))

# Декоративный круг
circ = s.shapes.add_shape(9, Inches(9.5), Inches(0.8), Inches(5.5), Inches(5.5))
circ.line.fill.background()
circ.fill.solid()
circ.fill.fore_color.rgb = RGBColor(0x18, 0x2A, 0x6A)

# Логотип текстовый
add_text(s, "КОРФАҲМ", Inches(0.6), Inches(1.0), Inches(10), Inches(1.4),
         size=72, bold=True, color=WHITE)

# Подзаголовок
add_text(s, "Платформаи ҳушманди сунъии касбёбӣ", Inches(0.6), Inches(2.4),
         Inches(8), Inches(0.7), size=26, color=LIGHT)
add_text(s, "барои ҷавонони Тоҷикистон", Inches(0.6), Inches(3.05),
         Inches(8), Inches(0.7), size=26, color=LIGHT)

# Конкурс
add_rect(s, Inches(0.6), Inches(4.1), Inches(6.5), Inches(0.7), GREEN)
add_text(s, "🏆  «Илм Фуруғи Маърифат» — 2026", Inches(0.7), Inches(4.15),
         Inches(6.3), Inches(0.6), size=20, bold=True, color=WHITE)

# Правая сторона — эмодзи
add_text(s, "🎯", Inches(10.0), Inches(1.5), Inches(2), Inches(2), size=90, color=WHITE, align=PP_ALIGN.CENTER)
add_text(s, "Интихоби касб\nбо ёрии ИҲ", Inches(9.5), Inches(3.5), Inches(3), Inches(1.5),
         size=18, color=GOLD, align=PP_ALIGN.CENTER)


# ═══════════════════════════════════════════════════════════════════════════════
# СЛАЙД 2 — МУШКИЛОТ (Проблема)
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(blank)
slide_bg(s, NAVY)
top_stripe(s, GREEN)
bottom_stripe(s, RED)

add_text(s, "МУШКИЛОТ", Inches(0.5), Inches(0.25), Inches(5), Inches(0.55),
         size=14, bold=True, color=GOLD)
add_text(s, "Ҷавонони мо дар бораи касб чӣ медонанд?",
         Inches(0.5), Inches(0.75), Inches(12), Inches(1.0),
         size=34, bold=True, color=WHITE)

# 3 карточки с проблемами
cards = [
    ("😕", "65%", "аз ҷавонон\nкасби дурустро\nнамедонанд"),
    ("📉", "40%", "баъди мактаб\nбе нақша\nмемонанд"),
    ("🔍", "Камбуд", "дар платформаҳои\nкасбёбии тоҷикӣ\nба забони тоҷикӣ"),
]

for i, (emoji, stat, desc) in enumerate(cards):
    cx = Inches(0.5 + i * 4.2)
    add_rect(s, cx, Inches(2.0), Inches(3.9), Inches(4.5), RGBColor(0x18, 0x2A, 0x6A))
    add_rect(s, cx, Inches(2.0), Inches(3.9), Inches(0.08), GREEN)
    add_text(s, emoji, cx + Inches(0.2), Inches(2.15), Inches(1), Inches(1), size=40, color=WHITE)
    add_text(s, stat, cx + Inches(0.2), Inches(3.1), Inches(3.5), Inches(0.8),
             size=40, bold=True, color=GOLD)
    add_text(s, desc, cx + Inches(0.2), Inches(3.9), Inches(3.5), Inches(1.5),
             size=17, color=LIGHT)


# ═══════════════════════════════════════════════════════════════════════════════
# СЛАЙД 3 — ҲАЛЛИ МО (Наше решение)
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(blank)
slide_bg(s, NAVY)
top_stripe(s, GREEN)
bottom_stripe(s, RED)

add_text(s, "ҲАЛЛИ МО", Inches(0.5), Inches(0.25), Inches(5), Inches(0.55),
         size=14, bold=True, color=GOLD)
add_text(s, "КОРФАҲМ — ҳама чиз дар як ҷо",
         Inches(0.5), Inches(0.75), Inches(12), Inches(1.0),
         size=34, bold=True, color=WHITE)

features = [
    ("🧠", "Санҷиши RIASEC", "35 савол — кашфи типи шахсият\nва 5 касби мувофиқ бо ёрии ИҲ"),
    ("💡", "Санҷиши IQ", "25 савол — муайян кардани\nдараҷаи зеҳнӣ бо перцентил"),
    ("🤖", "ZAKA — Дастёри ИҲ", "Чатботи DeepSeek AI ба\nзабони русӣ ва тоҷикӣ"),
    ("💼", "Вакансияҳо", "Ҷойҳои корӣ аз компанияҳои\nаслии Тоҷикистон"),
    ("📋", "Нақшаи рушд", "ИҲ нақшаи инфиродии касбӣ\nтартиб медиҳад"),
    ("📊", "Омор", "Дидани натиҷаи умумии\nкорбарони платформа"),
]

for i, (emoji, title, desc) in enumerate(features):
    row = i // 3
    col = i % 3
    cx = Inches(0.4 + col * 4.3)
    cy = Inches(1.9 + row * 2.5)
    add_rect(s, cx, cy, Inches(4.0), Inches(2.2), RGBColor(0x18, 0x2A, 0x6A))
    add_rect(s, cx, cy, Inches(4.0), Inches(0.07), GREEN if i % 2 == 0 else GOLD)
    add_text(s, emoji, cx + Inches(0.15), cy + Inches(0.15), Inches(0.8), Inches(0.8), size=28)
    add_text(s, title, cx + Inches(1.0), cy + Inches(0.2), Inches(2.8), Inches(0.55),
             size=17, bold=True, color=WHITE)
    add_text(s, desc, cx + Inches(0.15), cy + Inches(0.85), Inches(3.7), Inches(1.2),
             size=14, color=LIGHT)


# ═══════════════════════════════════════════════════════════════════════════════
# СЛАЙД 4 — САНҶИШИ RIASEC
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(blank)
slide_bg(s, NAVY)
top_stripe(s, GREEN)
bottom_stripe(s, RED)

add_text(s, "САНҶИШИ RIASEC", Inches(0.5), Inches(0.25), Inches(6), Inches(0.55),
         size=14, bold=True, color=GOLD)
add_text(s, "Кашфи типи шахсият ва касби орзу",
         Inches(0.5), Inches(0.75), Inches(12), Inches(1.0),
         size=34, bold=True, color=WHITE)

# Левая сторона — описание
add_bullet(s, [
    "35 савол дар 3 шакл (сенарий, миқёс, интихоб)",
    "Таҳлили RIASEC: R·I·A·S·E·C (6 типи шахсият)",
    "DeepSeek AI натиҷаро таҳлил мекунад",
    "5 касби мувофиқ бо фоизи мутобиқат",
    "Тавсифи психологии инфиродӣ",
    "Истеъдоди пинҳони ошкор мешавад",
], Inches(0.5), Inches(2.0), Inches(6.0), Inches(4.5),
   size=17, color=LIGHT, icon="✅")

# Правая сторона — типы RIASEC
types = [
    ("R", "Амалӣ", GREEN),
    ("I", "Таҳлилӣ", RGBColor(0x00, 0x88, 0xCC)),
    ("A", "Эҷодӣ", RGBColor(0xCC, 0x44, 0xAA)),
    ("S", "Иҷтимоӣ", GOLD),
    ("E", "Соҳибкорӣ", RED),
    ("C", "Сохторӣ", RGBColor(0x44, 0xAA, 0x88)),
]
for i, (letter, name, color) in enumerate(types):
    row = i // 3
    col = i % 3
    cx = Inches(7.0 + col * 2.1)
    cy = Inches(2.0 + row * 2.4)
    add_rect(s, cx, cy, Inches(1.9), Inches(2.1), RGBColor(0x18, 0x2A, 0x6A))
    add_rect(s, cx, cy, Inches(1.9), Inches(0.08), color)
    add_text(s, letter, cx + Inches(0.1), cy + Inches(0.15), Inches(1.7), Inches(0.9),
             size=40, bold=True, color=color, align=PP_ALIGN.CENTER)
    add_text(s, name, cx + Inches(0.1), cy + Inches(1.0), Inches(1.7), Inches(0.8),
             size=15, color=WHITE, align=PP_ALIGN.CENTER)


# ═══════════════════════════════════════════════════════════════════════════════
# СЛАЙД 5 — САНҶИШИ IQ
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(blank)
slide_bg(s, NAVY)
top_stripe(s, GREEN)
bottom_stripe(s, RED)

add_text(s, "САНҶИШИ IQ", Inches(0.5), Inches(0.25), Inches(6), Inches(0.55),
         size=14, bold=True, color=GOLD)
add_text(s, "Аввалин санҷиши IQ ба забони тоҷикӣ",
         Inches(0.5), Inches(0.75), Inches(12), Inches(1.0),
         size=34, bold=True, color=WHITE)

add_bullet(s, [
    "25 савол дар 5 категория",
    "Мантиқ ва алгоритмҳо",
    "Муносибатҳои фазоӣ",
    "Тафаккури рақамӣ ва серияҳо",
    "Ҳарфӣ ва аналогияҳо",
    "Натиҷа бо перцентил — муқоиса бо дигарон",
    "Графики визуалӣ",
], Inches(0.5), Inches(2.0), Inches(6.0), Inches(5.0),
   size=17, color=LIGHT, icon="🔹")

# Правая сторона — уровни IQ
levels = [
    ("130+", "Олӣ", RGBColor(0xF5, 0xC5, 0x18)),
    ("115–129", "Баланд", RGBColor(0x00, 0xAA, 0x44)),
    ("100–114", "Аз миёна боло", RGBColor(0x00, 0x88, 0xCC)),
    ("85–99", "Миёна", RGBColor(0x66, 0x66, 0xCC)),
    ("70–84", "Аз миёна поён", RGBColor(0xAA, 0x44, 0x44)),
]
add_text(s, "Дараҷаҳои IQ:", Inches(7.2), Inches(1.9), Inches(5.5), Inches(0.5),
         size=18, bold=True, color=WHITE)
for i, (score, label, color) in enumerate(levels):
    cy = Inches(2.5 + i * 0.85)
    add_rect(s, Inches(7.2), cy, Inches(5.5), Inches(0.72), RGBColor(0x18, 0x2A, 0x6A))
    add_rect(s, Inches(7.2), cy, Inches(0.08), Inches(0.72), color)
    add_text(s, score, Inches(7.4), cy + Inches(0.1), Inches(1.6), Inches(0.5),
             size=20, bold=True, color=color)
    add_text(s, label, Inches(9.2), cy + Inches(0.15), Inches(3.3), Inches(0.5),
             size=17, color=LIGHT)


# ═══════════════════════════════════════════════════════════════════════════════
# СЛАЙД 6 — ZAKA AI ЧАТБОТ
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(blank)
slide_bg(s, NAVY)
top_stripe(s, GREEN)
bottom_stripe(s, RED)

add_text(s, "ZAKA — ДАСТЁРИ ИҲ", Inches(0.5), Inches(0.25), Inches(7), Inches(0.55),
         size=14, bold=True, color=GOLD)
add_text(s, "Чатботи касбӣ бо DeepSeek AI",
         Inches(0.5), Inches(0.75), Inches(12), Inches(1.0),
         size=34, bold=True, color=WHITE)

add_text(s, "🤖", Inches(0.5), Inches(1.9), Inches(1.2), Inches(1.2), size=60)
add_text(s, "ZAKA чист?", Inches(1.7), Inches(2.0), Inches(5), Inches(0.6),
         size=22, bold=True, color=GOLD)
add_text(s, "ZAKA — дастёри ИҲ дар платформаи КОРФАҲМ.\nБа савол дар бораи касб, маош, ширкатҳо ва\nрушди касбӣ ба русӣ ва тоҷикӣ ҷавоб медиҳад.",
         Inches(0.5), Inches(2.7), Inches(6.0), Inches(1.5), size=16, color=LIGHT)

# Примеры сообщений
msgs = [
    ("Корбар:", "Чӣ тавр барномасоз шавам?", RGBColor(0x18, 0x2A, 0x6A), WHITE, "→"),
    ("ZAKA:", "Барои барномасозӣ Python ё JavaScript-ро оғоз кун.\nАлиф Academy дар Душанбе курсҳои хуб дорад.\nМаоши аввала: 3000–5000 сомонӣ.", GREEN, WHITE, "🤖"),
    ("Корбар:", "Маоши дизайнер чанд аст?", RGBColor(0x18, 0x2A, 0x6A), WHITE, "→"),
    ("ZAKA:", "Дизайнери UX/UI дар Душанбе 3000–6000 сом мегирад.\nМетавонӣ барои лоиҳаҳои байналмилалӣ дур кор кунӣ!", GREEN, WHITE, "🤖"),
]
for i, (who, text, bg, tc, icon) in enumerate(msgs):
    cy = Inches(1.9 + i * 1.25)
    lx = Inches(6.8) if who == "ZAKA:" else Inches(6.8)
    add_rect(s, Inches(6.8), cy, Inches(6.1), Inches(1.1), bg)
    add_text(s, f"{icon} {who}", Inches(6.95), cy + Inches(0.05), Inches(1.5), Inches(0.35),
             size=12, bold=True, color=GOLD if who == "ZAKA:" else LIGHT)
    add_text(s, text, Inches(6.95), cy + Inches(0.35), Inches(5.8), Inches(0.75),
             size=13, color=tc)

add_bullet(s, ["Русӣ ва тоҷикӣ", "Бе интернет — fallback ҷавобҳо", "Маълумот дар бораи бозори кор"],
           Inches(0.5), Inches(4.5), Inches(6.0), Inches(2.5), size=16, color=LIGHT, icon="✓")


# ═══════════════════════════════════════════════════════════════════════════════
# СЛАЙД 7 — ТЕХНОЛОГИЯҲО
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(blank)
slide_bg(s, NAVY)
top_stripe(s, GREEN)
bottom_stripe(s, RED)

add_text(s, "ТЕХНОЛОГИЯҲО", Inches(0.5), Inches(0.25), Inches(6), Inches(0.55),
         size=14, bold=True, color=GOLD)
add_text(s, "Стеки технологии муосир",
         Inches(0.5), Inches(0.75), Inches(12), Inches(1.0),
         size=34, bold=True, color=WHITE)

techs = [
    ("⚛️",  "React + Vite",       "Интерфейси корбар",         RGBColor(0x00, 0x88, 0xCC)),
    ("🎨",  "TailwindCSS v4",     "Тарроҳии муосир",           RGBColor(0x06, 0xB6, 0xD4)),
    ("🚀",  "FastAPI",            "API бэкенд (Python)",       RGBColor(0x00, 0x96, 0x88)),
    ("🗄️", "SQLite + SQLAlchemy","Пойгоҳи додаҳо",            RGBColor(0x88, 0x44, 0xCC)),
    ("🔐",  "JWT + bcrypt",       "Аутентификатсия",           RED),
    ("🧠",  "DeepSeek AI",        "Таҳлили ИҲ",               GOLD),
]

for i, (emoji, name, desc, color) in enumerate(techs):
    row = i // 3
    col = i % 3
    cx = Inches(0.4 + col * 4.3)
    cy = Inches(1.9 + row * 2.6)
    add_rect(s, cx, cy, Inches(4.0), Inches(2.3), RGBColor(0x18, 0x2A, 0x6A))
    add_rect(s, cx, cy, Inches(0.07), Inches(2.3), color)
    add_text(s, emoji, cx + Inches(0.2), cy + Inches(0.2), Inches(0.9), Inches(0.9), size=32)
    add_text(s, name,  cx + Inches(1.2), cy + Inches(0.2), Inches(2.6), Inches(0.65),
             size=20, bold=True, color=color)
    add_text(s, desc,  cx + Inches(1.2), cy + Inches(0.9), Inches(2.6), Inches(0.7),
             size=15, color=LIGHT)


# ═══════════════════════════════════════════════════════════════════════════════
# СЛАЙД 8 — НАТИҶАҲО ВА ОМОР
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(blank)
slide_bg(s, NAVY)
top_stripe(s, GREEN)
bottom_stripe(s, RED)

add_text(s, "НАТИҶАҲО", Inches(0.5), Inches(0.25), Inches(6), Inches(0.55),
         size=14, bold=True, color=GOLD)
add_text(s, "Чӣ медиҳем ба ҷавонони Тоҷикистон",
         Inches(0.5), Inches(0.75), Inches(12), Inches(1.0),
         size=34, bold=True, color=WHITE)

stats = [
    ("35", "Савол дар санҷиши RIASEC", GREEN),
    ("25", "Савол дар санҷиши IQ", RGBColor(0x00, 0x88, 0xCC)),
    ("5",  "Касби мувофиқ барои ҳар кас", GOLD),
    ("2",  "Забон: Русӣ ва Тоҷикӣ", RED),
    ("6",  "Қадам дар нақшаи рушд", RGBColor(0x88, 0x44, 0xCC)),
    ("∞",  "Имкониятҳои карьера", RGBColor(0x00, 0xAA, 0x44)),
]

for i, (num, label, color) in enumerate(stats):
    row = i // 3
    col = i % 3
    cx = Inches(0.4 + col * 4.3)
    cy = Inches(1.9 + row * 2.5)
    add_rect(s, cx, cy, Inches(4.0), Inches(2.2), RGBColor(0x18, 0x2A, 0x6A))
    add_rect(s, cx, cy, Inches(4.0), Inches(0.09), color)
    add_text(s, num, cx + Inches(0.15), cy + Inches(0.2), Inches(3.7), Inches(1.0),
             size=52, bold=True, color=color, align=PP_ALIGN.CENTER)
    add_text(s, label, cx + Inches(0.15), cy + Inches(1.2), Inches(3.7), Inches(0.8),
             size=15, color=LIGHT, align=PP_ALIGN.CENTER)


# ═══════════════════════════════════════════════════════════════════════════════
# СЛАЙД 9 — НАҚШАИ ОЯНДА (Будущие планы)
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(blank)
slide_bg(s, NAVY)
top_stripe(s, GREEN)
bottom_stripe(s, RED)

add_text(s, "НАҚШАИ ОЯНДА", Inches(0.5), Inches(0.25), Inches(6), Inches(0.55),
         size=14, bold=True, color=GOLD)
add_text(s, "Рушди минбаъдаи платформа",
         Inches(0.5), Inches(0.75), Inches(12), Inches(1.0),
         size=34, bold=True, color=WHITE)

phases = [
    ("🔷 Марҳалаи 1", "Ҳоло", [
        "Санҷишҳои RIASEC ва IQ",
        "ZAKA чатбот (DeepSeek AI)",
        "Вакансияҳо аз ширкатҳои ТЖ",
        "Нақшаи рушди касбӣ",
    ], GREEN),
    ("🔶 Марҳалаи 2", "2026 Q3–Q4", [
        "Барномаи мобилӣ (iOS/Android)",
        "Тавсияҳои ML (scikit-learn)",
        "Генератори CV (PDF)",
        "API барои мактабҳо",
    ], GOLD),
    ("🔴 Марҳалаи 3", "2027", [
        "Дастраси тамоми Осиёи Миёна",
        "Ҳамкорӣ бо вазоратҳо",
        "100 000+ корбар",
        "Санҷишҳои бештар",
    ], RED),
]

for i, (phase, when, items, color) in enumerate(phases):
    cx = Inches(0.4 + i * 4.3)
    add_rect(s, cx, Inches(1.9), Inches(4.0), Inches(5.3), RGBColor(0x18, 0x2A, 0x6A))
    add_rect(s, cx, Inches(1.9), Inches(4.0), Inches(0.09), color)
    add_text(s, phase, cx + Inches(0.15), Inches(2.05), Inches(3.7), Inches(0.6),
             size=18, bold=True, color=color)
    add_text(s, when, cx + Inches(0.15), Inches(2.65), Inches(3.7), Inches(0.45),
             size=14, color=GOLD, italic=True)
    add_bullet(s, items, cx + Inches(0.1), Inches(3.2), Inches(3.8), Inches(2.8),
               size=14, color=LIGHT, icon="→")


# ═══════════════════════════════════════════════════════════════════════════════
# СЛАЙД 10 — ХУЛОСА (Заключение)
# ═══════════════════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(blank)
slide_bg(s, NAVY)
top_stripe(s, GREEN, Inches(0.18))
bottom_stripe(s, RED, Inches(0.18))

# Декоративный круг (как на титуле)
circ = s.shapes.add_shape(9, Inches(9.0), Inches(0.5), Inches(6), Inches(6))
circ.line.fill.background()
circ.fill.solid()
circ.fill.fore_color.rgb = RGBColor(0x18, 0x2A, 0x6A)

add_text(s, "КОРФАҲМ", Inches(0.5), Inches(1.0), Inches(8), Inches(1.8),
         size=60, bold=True, color=WHITE)

add_text(s, "Ояндаи ҷавонони Тоҷикистон —", Inches(0.5), Inches(3.0),
         Inches(8), Inches(0.65), size=24, color=LIGHT)
add_text(s, "бо ёрии ҳушманди сунъӣ!", Inches(0.5), Inches(3.65),
         Inches(8), Inches(0.65), size=24, bold=True, color=GREEN)

add_rect(s, Inches(0.5), Inches(4.5), Inches(7.0), Inches(0.07), GOLD)

add_bullet(s, [
    "RIASEC + IQ санҷишҳо бо таҳлили ИҲ",
    "Вакансияҳо ва нақшаи рушди касбӣ",
    "Ба забони русӣ ва тоҷикӣ — барои ҳама",
], Inches(0.5), Inches(4.7), Inches(7.5), Inches(2.0), size=17, color=LIGHT, icon=">")

# Правая сторона
add_text(s, "🏆", Inches(10.0), Inches(1.5), Inches(2.5), Inches(2.5), size=100,
         align=PP_ALIGN.CENTER)
add_text(s, "«Илм Фуруғи\nМаърифат» 2026",
         Inches(9.5), Inches(3.8), Inches(3.5), Inches(1.5),
         size=18, bold=True, color=GOLD, align=PP_ALIGN.CENTER)

# ─── Сохранить ────────────────────────────────────────────────────────────────
out = r"c:\Users\mardo\Desktop\Новая папка\KORFAKHM_Presentation.pptx"
prs.save(out)
print(f"OK Prezentatsiya saqlandi: {out}")
print(f"   Slaydov: {len(prs.slides)}")
