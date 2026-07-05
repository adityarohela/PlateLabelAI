import { useEffect, useRef, useState } from "react";
import { analyzeFood } from "../api";

const STEPS = [
  "Uploading image to backend",
  "Validating &amp; preprocessing image",
  "Running Gemini Vision food detection",
  "Estimating portions &amp; nutrition",
  "Generating health score",
];

export default function ProcessingScreen({ file, preview, onDone, onRetry, onCancel }) {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    setError(null);
    setActiveStep(0);

    const timer = setInterval(() => {
      setActiveStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 700);

    analyzeFood(file)
      .then((data) => {
        if (cancelledRef.current) return;
        clearInterval(timer);
        setActiveStep(STEPS.length - 1);
        setTimeout(() => onDone(data), 300);
      })
      .catch((err) => {
        if (cancelledRef.current) return;
        clearInterval(timer);
        setError(err.message);
      });

    return () => {
      cancelledRef.current = true;
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  return (
    <section className="screen">
      <div className="processing-wrap">
        {preview && <img className="thumb" src={preview} alt="" />}
        <div className="eyebrow">Step 2 of 3</div>
        <h2 style={{ margin: "8px 0 26px", fontSize: 24 }}>Analyzing your meal…</h2>
        <ul className="proc-steps">
          {STEPS.map((label, i) => (
            <li key={label} className={i < activeStep ? "done" : i === activeStep && !error ? "active" : ""}>
              <span className="idx">{String(i + 1).padStart(2, "0")}</span>
              <span className="spin"></span>
              <span dangerouslySetInnerHTML={{ __html: label }} />
            </li>
          ))}
        </ul>

        {error && (
          <div className="proc-error">
            {error}
            <div style={{ marginTop: 12, display: "flex", gap: 10, justifyContent: "center" }}>
              <button className="btn btn-primary" onClick={onRetry}>
                Retry
              </button>
              <button className="btn btn-ghost" onClick={onCancel}>
                Back to upload
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
