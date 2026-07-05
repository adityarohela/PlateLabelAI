const HISTORY_KEY = "platelabel.history";
const FAVORITES_KEY = "platelabel.favorites";
const PROFILE_KEY = "platelabel.profile";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Could not write to localStorage", err);
  }
}

export function getHistory() {
  return readJSON(HISTORY_KEY, []);
}

export function addToHistory(analysis) {
  const history = getHistory();
  const entry = {
    id: Date.now(),
    ts: new Date().toISOString(),
    meal_name: analysis.meal_name,
    health_score: analysis.health_score,
    diet_type: analysis.diet_type,
    totals: analysis.totals,
    food_names: analysis.foods.map((f) => f.name),
  };
  history.unshift(entry);
  writeJSON(HISTORY_KEY, history.slice(0, 100)); // keep it bounded
  return entry;
}

export function clearHistory() {
  writeJSON(HISTORY_KEY, []);
}

export function getFavorites() {
  return readJSON(FAVORITES_KEY, []);
}

export function toggleFavorite(foodName) {
  const favorites = getFavorites();
  const next = favorites.includes(foodName)
    ? favorites.filter((f) => f !== foodName)
    : [...favorites, foodName];
  writeJSON(FAVORITES_KEY, next);
  return next;
}

export function getProfile() {
  return readJSON(PROFILE_KEY, {
    age: "",
    sex: "female",
    heightCm: "",
    weightKg: "",
    activityLevel: 1.55,
  });
}

export function saveProfile(profile) {
  writeJSON(PROFILE_KEY, profile);
}

export function computeBmi(profile) {
  const h = Number(profile.heightCm);
  const w = Number(profile.weightKg);
  if (!h || !w) return null;
  const meters = h / 100;
  return +(w / (meters * meters)).toFixed(1);
}

export function computeDailyCalorieTarget(profile) {
  const h = Number(profile.heightCm);
  const w = Number(profile.weightKg);
  const age = Number(profile.age);
  if (!h || !w || !age) return null;
  const bmr = 10 * w + 6.25 * h - 5 * age + (profile.sex === "male" ? 5 : -161);
  return Math.round(bmr * (Number(profile.activityLevel) || 1.55));
}
