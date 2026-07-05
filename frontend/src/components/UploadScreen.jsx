import { useEffect, useRef, useState } from "react";

const MAX_MB = 10;
const MIN_PX = 100;

export default function UploadScreen({ file, onReplace, onContinue, onCancel }) {
  const [preview, setPreview] = useState(null);
  const [dims, setDims] = useState(null);
  const fileInputRef = useRef(null);

  const typeOk = /^image\/(jpeg|png|webp|gif)$/.test(file.type);
  const sizeOk = file.size <= MAX_MB * 1024 * 1024;
  const resOk = dims ? dims.width >= MIN_PX && dims.height >= MIN_PX : null;
  const allOk = typeOk && sizeOk && resOk === true;

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    const img = new Image();
    img.onload = () => setDims({ width: img.naturalWidth, height: img.naturalHeight });
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <section className="screen">
      <div className="step-head">
        <span className="step-num">1</span>
        <h2>Confirm your photo</h2>
      </div>
      <div className="upload-grid">
        <div>
          <div className="preview-box">
            {preview && <img src={preview} alt="Selected food" />}
          </div>
          <div className="dz-actions" style={{ marginTop: 16, justifyContent: "flex-start" }}>
            <button className="btn btn-ghost" onClick={() => fileInputRef.current?.click()}>
              Choose different image
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              hidden
              onChange={(e) => e.target.files[0] && onReplace(e.target.files[0])}
            />
          </div>
        </div>
        <div>
          <h3 style={{ fontSize: 16, marginBottom: 14 }}>Validation</h3>
          <ul className="checklist">
            <Check ok={typeOk} label="File type is an image (JPG, PNG, WEBP)" />
            <Check ok={sizeOk} label="File size is under 10MB" />
            <Check ok={resOk} label="Resolution is at least 100 × 100px" />
          </ul>
          <div className="meta-row">
            <span>{(file.size / 1024).toFixed(0)} KB</span>
            {dims && <span>{dims.width}×{dims.height}px</span>}
            <span>{file.type}</span>
          </div>
          <div style={{ marginTop: 26, display: "flex", gap: 10 }}>
            <button className="btn btn-primary" disabled={!allOk} onClick={onContinue}>
              Analyze this photo →
            </button>
            <button className="btn btn-ghost" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Check({ ok, label }) {
  const cls = ok === null ? "" : ok ? "ok" : "bad";
  return (
    <li className={cls}>
      <span className="status">
        {ok && (
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </li>
  );
}
