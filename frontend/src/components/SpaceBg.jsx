// Фон сайта: три мягких цветных пятна (фиолет/бирюза/фуксия) с очень
// медленным дрейфом — на белом/тёмном фоне, без космоса и без дорогих
// эффектов (только transform, никакого backdrop-filter). Работает в
// обеих темах через CSS-переменные, отдельных тёмных версий разметки
// не нужно.
export default function SpaceBg() {
  return (
    <div className="bg-stage" aria-hidden="true">
      <div className="blob v" />
      <div className="blob t" />
      <div className="blob f" />
    </div>
  )
}
