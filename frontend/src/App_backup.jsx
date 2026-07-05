import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  }

  async function analyzeFood() {
    if (!image) {
      alert("Please choose an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/analyze",
        formData
      );

      setResult(response.data);

    }catch (error) {
  console.error(error);

  if (error.response) {
    console.log(error.response.data);
    alert(JSON.stringify(error.response.data));
  } else {
    alert(error.message);
  }
}
  }

  return (
    <div className="app">
      <div className="container">

        <h1>🍽 PlateLabel AI</h1>

        <p>Upload a food image and let AI analyze its nutrition.</p>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {preview && (
          <img
            src={preview}
            alt="Food"
            className="preview"
          />
        )}

        <button onClick={analyzeFood}>
          Analyze Food
        </button>

        {result && (
          <div className="result-card">

            <h2>{result.meal_name}</h2>

            <p>
              <strong>Health Score:</strong> {result.health_score}/100
            </p>

            <p>
              <strong>Diet Type:</strong> {result.diet_type}
            </p>

            <p>
              <strong>Total Calories:</strong> {result.totals.calories} kcal
              </p>

            <p>
              <strong>Total Protein:</strong> {result.totals.protein_g} g
            </p>

            <p>
              <strong>Total Carbs:</strong> {result.totals.carbs_g} g
            </p>

            <p>
              <strong>Total Fat:</strong> {result.totals.fat_g} g
            </p>

            <p>
              <strong>Total Fiber:</strong> {result.totals.fiber_g} g
            </p>
            <h3>Allergens</h3>

            <p>
              {result.allergens.length
                ? result.allergens.join(", ")
                : "None"}
            </p>

            <h3>AI Recommendation</h3>

            <p>{result.recommendation}</p>

            <h3>Foods Detected</h3>

            {result.foods.map((food, index) => (
              <div key={index} className="food-card">

                <h4>{food.name}</h4>

                <p>Quantity: {food.quantity}</p>

                <p>Calories: {food.calories}</p>

                <p>Protein: {food.protein_g} g</p>

                <p>Carbs: {food.carbs_g} g</p>

                <p>Fat: {food.fat_g} g</p>

                <p>Fiber: {food.fiber_g} g</p>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default App;