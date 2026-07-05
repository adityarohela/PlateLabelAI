import { useState } from "react";
import { clearHistory, getFavorites, getHistory, getProfile, saveProfile, toggleFavorite } from "../storage";

export default function HistoryScreen() {
  const [tab, setTab] = useState("history");
  const [history, setHistory] = useState(getHistory());
  const [favorites, setFavorites] = useState(getFavorites());
  const [profile, setProfile] = useState(getProfile());
  const [savedMsg, setSavedMsg] = useState(false);

  function handleClear() {
    clearHistory();
    setHistory([]);
  }

  function handleRemoveFavorite(name) {
    setFavorites(toggleFavorite(name));
  }

  function handleProfileChange(field, value) {
    setProfile((p) => ({ ...p, [field]: value }));
  }

  function handleProfileSave() {
    saveProfile(profile);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  }

  return (
    <section className="screen">
      <div className="step-head">
        <h2>My history</h2>
      </div>
      <div className="tab-row">
        <button className={`tab-btn ${tab === "history" ? "active" : ""}`} onClick={() => setTab("history")}>
          History
        </button>
        <button className={`tab-btn ${tab === "favorites" ? "active" : ""}`} onClick={() => setTab("favorites")}>
          Favorite foods
        </button>
        <button className={`tab-btn ${tab === "profile" ? "active" : ""}`} onClick={() => setTab("profile")}>
          Profile settings
        </button>
      </div>

      {tab === "history" &&
        (history.length ? (
          <div>
            {history.map((entry) => (
              <div className="hist-row" key={entry.id}>
                <div className="info">
                  <div className="fname">{entry.meal_name || entry.food_names.join(", ")}</div>
                  <div className="fdate">
                    {new Date(entry.ts).toLocaleString()} &middot; Health score {Math.round(entry.health_score || 0)}
                  </div>
                </div>
                <div className="kcal">{Math.round(entry.totals.calories)} kcal</div>
              </div>
            ))}
            <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={handleClear}>
              Clear history
            </button>
          </div>
        ) : (
          <div className="empty-state">No analyses saved yet — analyze a photo and hit "Save to history".</div>
        ))}

      {tab === "favorites" &&
        (favorites.length ? (
          <div>
            {favorites.map((f) => (
              <div className="hist-row" key={f}>
                <div className="info">
                  <div className="fname">{f}</div>
                </div>
                <button className="btn btn-ghost" onClick={() => handleRemoveFavorite(f)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">No favorite foods yet. Star a food on the results page to save it here.</div>
        ))}

      {tab === "profile" && (
        <div className="card" style={{ maxWidth: 560 }}>
          <h3 style={{ fontSize: 16, marginBottom: 16 }}>Your profile</h3>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>
            Stored only in this browser (localStorage) — used to personalize your BMI and daily calorie target.
          </p>
          <div className="settings-form">
            <div>
              <label>Sex</label>
              <select value={profile.sex} onChange={(e) => handleProfileChange("sex", e.target.value)}>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>
            <div>
              <label>Age</label>
              <input
                type="number"
                min="10"
                max="100"
                value={profile.age}
                onChange={(e) => handleProfileChange("age", e.target.value)}
              />
            </div>
            <div>
              <label>Height (cm)</label>
              <input
                type="number"
                min="100"
                max="230"
                value={profile.heightCm}
                onChange={(e) => handleProfileChange("heightCm", e.target.value)}
              />
            </div>
            <div>
              <label>Weight (kg)</label>
              <input
                type="number"
                min="30"
                max="250"
                value={profile.weightKg}
                onChange={(e) => handleProfileChange("weightKg", e.target.value)}
              />
            </div>
            <div>
              <label>Activity level</label>
              <select
                value={profile.activityLevel}
                onChange={(e) => handleProfileChange("activityLevel", Number(e.target.value))}
              >
                <option value={1.2}>Sedentary</option>
                <option value={1.375}>Light exercise</option>
                <option value={1.55}>Moderate exercise</option>
                <option value={1.725}>Very active</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={handleProfileSave}>
            {savedMsg ? "Saved ✓" : "Save profile"}
          </button>
        </div>
      )}
    </section>
  );
}
