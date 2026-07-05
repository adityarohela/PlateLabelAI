import { useRef, useState } from "react";

export default function Landing({ onFileChosen, goTo }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  function handleFiles(fileList) {
    const file = fileList?.[0];
    if (file) onFileChosen(file);
  }

  return (
    <section className="screen">
      <div className="hero">
        <div>
          <div className="eyebrow">AI Food Recognition &amp; Nutrition Analysis</div>
          <h1>
            Know exactly
            <br />
            what's <em>on your plate.</em>
          </h1>
          <p className="lede">
            Upload a photo of any meal. Plate Label identifies every item and estimates
            calories, protein, carbs, fat, fiber, allergens, and an overall health score.
          </p>

          <div
            className={`dropzone ${dragActive ? "drag" : ""}`}
            onDragEnter={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleFiles(e.dataTransfer.files);
            }}
          >
            <svg className="dz-icon" width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 16V4M12 4L7 9M12 4l5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <h3>Drag &amp; drop a food photo</h3>
            <p>or choose a file below &middot; JPG, PNG, WEBP up to 10MB</p>
            <div className="dz-actions">
              <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}>
                Upload image
              </button>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              hidden
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        </div>

        <div className="hero-label">
          <div className="lbl-title">Nutrition Facts</div>
          <div className="lbl-row">
            <span>Serving size</span>
            <b>1 photo</b>
          </div>
          <div className="lbl-cal">
            <span className="lbl">Calories</span>
            <span className="num">?</span>
          </div>
          <div className="lbl-row">
            <span>Protein</span>
            <b>? g</b>
          </div>
          <div className="lbl-row">
            <span>Carbohydrates</span>
            <b>? g</b>
          </div>
          <div className="lbl-row" style={{ borderBottom: "none", color: "var(--muted)", fontStyle: "italic" }}>
            Upload a photo to fill in the blanks →
          </div>
        </div>
      </div>

      <div className="features">
        <h2>What happens when you upload</h2>
        <p className="sub">One photo goes straight to Gemini Vision for a full nutrition read.</p>
        <div className="feature-grid">
          <FeatureCard title="AI Food Recognition" text="Identifies every distinct food on the plate." />
          <FeatureCard title="Nutrition Analysis" text="Calories, protein, carbs, fat, and fiber per item." />
          <FeatureCard title="Diet &amp; Allergens" text="Flags diet type and common allergens automatically." />
          <FeatureCard title="Health Score" text="A single 0–100 score you can track meal to meal." />
          <FeatureCard title="AI Recommendation" text="A short, practical suggestion for balancing the meal." />
        </div>
      </div>

      <div className="cta-band">
        <div>
          <h3>Ready to see what's really in your meal?</h3>
          <p>Upload a photo above, or check your saved history.</p>
        </div>
        <button className="btn btn-citrus" onClick={() => goTo("history")}>
          View history
        </button>
      </div>
    </section>
  );
}

function FeatureCard({ title, text }) {
  return (
    <div className="feature-card">
      <h4>{title}</h4>
      <p>{text}</p>
    </div>
  );
}
