export default function HealthMeter({ score }) {
  const clamped = Math.max(0, Math.min(100, Math.round(score || 0)));
  let note = "This meal is calorie-dense relative to its protein and fiber.";
  if (clamped >= 75) note = "A well-balanced meal — good protein and fiber for the calories.";
  else if (clamped >= 50) note = "Reasonably balanced, with room to add fiber or trim fat.";

  return (
    <div className="card">
      <h3 style={{ fontSize: 15 }}>Health score</h3>
      <div className="health-meter">
        <div className="meter-track">
          <div className="marker" style={{ left: `${clamped}%` }}></div>
        </div>
        <div className="meter-score">{clamped} / 100</div>
        <p className="health-notes">{note}</p>
      </div>
    </div>
  );
}
