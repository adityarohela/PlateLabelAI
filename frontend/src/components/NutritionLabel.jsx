const DV = { calories: 2000, protein_g: 50, carbs_g: 275, fat_g: 78, fiber_g: 28 };

function dvPercent(value, key) {
  if (!DV[key]) return null;
  return Math.round((value / DV[key]) * 100);
}

export default function NutritionLabel({ totals, itemCount, mealName }) {
  return (
    <div className="nutri-label">
      <div className="title">Nutrition Facts</div>
      <div className="serving">
        <span>
          {itemCount} item{itemCount !== 1 ? "s" : ""} detected
        </span>
        <span>{mealName || "This meal"}</span>
      </div>
      <div className="amt-per">Amount per meal</div>
      <div className="cal-row">
        <span className="lbl">Calories</span>
        <span className="val">{Math.round(totals.calories)}</span>
      </div>
      <div className="dv-head">% Daily Value*</div>

      <Row label="Total Fat" value={`${totals.fat_g.toFixed(1)} g`} dv={dvPercent(totals.fat_g, "fat_g")} />
      <Row
        label="Total Carbohydrate"
        value={`${totals.carbs_g.toFixed(1)} g`}
        dv={dvPercent(totals.carbs_g, "carbs_g")}
      />
      <Row indent label="Dietary Fiber" value={`${totals.fiber_g.toFixed(1)} g`} dv={dvPercent(totals.fiber_g, "fiber_g")} />
      <Row label="Protein" value={`${totals.protein_g.toFixed(1)} g`} dv={dvPercent(totals.protein_g, "protein_g")} />

      <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 10 }}>
        *Percent Daily Values based on a 2,000 calorie diet.
      </div>
    </div>
  );
}

function Row({ label, value, dv, indent }) {
  return (
    <div className={`nutri-row ${indent ? "indent" : ""}`}>
      {indent ? <span>{label}</span> : <b>{label}</b>}
      <span>{value}</span>
      <span className="dv">{dv !== null ? `${dv}%` : ""}</span>
    </div>
  );
}
