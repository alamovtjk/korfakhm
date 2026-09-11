// Светлая тема — вместо космоса просто два мягких цветных пятна за
// герой-секцией (фиолетовое и бирюзовое), как в референсах: едва
// заметный градиентный акцент, а не отдельная визуальная система.
export default function SpaceBg() {
  return (
    <div className="bg-stage" aria-hidden="true">
      <div className="blob v" />
      <div className="blob t" />
    </div>
  )
}
