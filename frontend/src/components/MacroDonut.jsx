export default function MacroDonut({ totals }) {
  const kcalProtein = totals.protein_g * 4;
  const kcalCarbs = totals.carbs_g * 4;
  const kcalFat = totals.fat_g * 9;
  const total = kcalProtein + kcalCarbs + kcalFat || 1;

  const pPct = (kcalProtein / total) * 100;
  const cPct = (kcalCarbs / total) * 100;
  const fPct = (kcalFat / total) * 100;

  const gradient = `conic-gradient(
    #3F7D5C 0% ${pPct}%,
    #F2B705 ${pPct}% ${pPct + cPct}%,
    #C1443C ${pPct + cPct}% 100%
  )`;

  return (
    <div className="card chart-card">
      <h3 style={{ fontSize: 15, marginBottom: 14 }}>Macronutrient split</h3>
      <div className="donut-wrap">
        <div className="donut" style={{ background: gradient }}>
          <div className="donut-hole">
            <span className="donut-total">{Math.round(total)}</span>
            <span className="donut-label">kcal</span>
          </div>
        </div>
      </div>
      <div className="macro-legend">
        <span>
          <i className="dot" style={{ background: "#3F7D5C" }}></i>
          Protein {Math.round(pPct)}%
        </span>
        <span>
          <i className="dot" style={{ background: "#F2B705" }}></i>
          Carbs {Math.round(cPct)}%
        </span>
        <span>
          <i className="dot" style={{ background: "#C1443C" }}></i>
          Fat {Math.round(fPct)}%
        </span>
      </div>
    </div>
  );
}
