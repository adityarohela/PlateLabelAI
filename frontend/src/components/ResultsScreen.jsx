import { useState } from "react";
import NutritionLabel from "./NutritionLabel";
import MacroDonut from "./MacroDonut";
import HealthMeter from "./HealthMeter";
import { addToHistory, computeBmi, computeDailyCalorieTarget, getFavorites, getProfile, toggleFavorite } from "../storage";

function normalizeConfidence(c) {
  if (c == null) return 0;
  return c <= 1 ? Math.round(c * 100) : Math.round(c);
}

export default function ResultsScreen({ preview, analysis, onAnalyzeAnother, goTo }) {
  const [saved, setSaved] = useState(false);
  const [favorites, setFavorites] = useState(getFavorites());
  const profile = getProfile();
  const bmi = computeBmi(profile);
  const dailyTarget = computeDailyCalorieTarget(profile);

  function handleSave() {
    addToHistory(analysis);
    setSaved(true);
  }

  function handleFavorite(name) {
    setFavorites(toggleFavorite(name));
  }

  const targets = { calories: dailyTarget || 2000, protein_g: 50, carbs_g: 275, fat_g: 78, fiber_g: 28 };

  return (
    <section className="screen">
      <div className="step-head">
        <span className="step-num">3</span>
        <h2>{analysis.meal_name || "Analysis results"}</h2>
      </div>

      <div className="results-top">
        <div>{preview && <img className="orig-img" src={preview} alt="Analyzed meal" />}</div>
        <div>
          <h3 style={{ fontSize: 15, marginBottom: 10, color: "var(--ink-soft)" }}>
            Detected foods &middot; {analysis.diet_type}
          </h3>
          <div className="detected-list">
            {analysis.foods.map((food, i) => (
              <div className="detected-item" key={i}>
                <div className="name">{food.name}</div>
                <div className="portion">{food.quantity}</div>
                <div className="conf-bar">
                  <div style={{ width: `${normalizeConfidence(food.confidence)}%` }}></div>
                </div>
                <div className="conf-pct">{normalizeConfidence(food.confidence)}%</div>
                <button
                  className="star"
                  title="Favorite this food"
                  onClick={() => handleFavorite(food.name)}
                >
                  <span className={favorites.includes(food.name) ? "star-icon active" : "star-icon"}>★</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-title">
        <div className="eyebrow">The label</div>
        <h2>Nutrition facts</h2>
      </div>
      <div className="dashboard-grid">
        <NutritionLabel totals={analysis.totals} itemCount={analysis.foods.length} mealName={analysis.meal_name} />
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <MacroDonut totals={analysis.totals} />
          <HealthMeter score={analysis.health_score} />
          <div className="card">
            <h3 style={{ fontSize: 15 }}>BMI &amp; daily target</h3>
            {bmi ? (
              <>
                <div className="bmi-num">{bmi}</div>
                <p className="health-notes">
                  This meal is about {Math.round((analysis.totals.calories / targets.calories) * 100)}% of your
                  estimated daily need (~{targets.calories} kcal).
                </p>
              </>
            ) : (
              <p className="health-notes">
                Add your height and weight in{" "}
                <a style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => goTo("history")}>
                  your profile
                </a>{" "}
                to see this personalized.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="section-title">
        <h2 style={{ fontSize: 18 }}>Allergens</h2>
      </div>
      <div className="chip-row">
        {analysis.allergens.length ? (
          analysis.allergens.map((a) => (
            <span className="chip chip-warn" key={a}>
              {a}
            </span>
          ))
        ) : (
          <span className="chip">None flagged</span>
        )}
      </div>

      <div className="section-title">
        <h2 style={{ fontSize: 18 }}>AI recommendation</h2>
      </div>
      <p className="health-notes" style={{ fontSize: 14.5 }}>
        {analysis.recommendation}
      </p>

      <div className="results-actions">
        <button className="btn btn-primary" onClick={handleSave} disabled={saved}>
          {saved ? "Saved ✓" : "Save to history"}
        </button>
        <button className="btn btn-ghost" onClick={() => window.print()}>
          Download / print PDF
        </button>
        <button className="btn btn-ghost" onClick={onAnalyzeAnother}>
          Analyze another image
        </button>
        <button className="btn btn-ghost" onClick={() => goTo("history")}>
          View history →
        </button>
      </div>
    </section>
  );
}
