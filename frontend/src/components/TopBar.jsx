export default function TopBar({ screen, goTo }) {
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="brand" onClick={() => goTo("landing")}>
          <svg className="mark" viewBox="0 0 26 26" fill="none">
            <rect x="2" y="2" width="22" height="22" rx="4" stroke="currentColor" strokeWidth="2" />
            <line x1="6" y1="9" x2="20" y2="9" stroke="currentColor" strokeWidth="2" />
            <line x1="6" y1="13.5" x2="20" y2="13.5" stroke="currentColor" strokeWidth="1.4" />
            <line x1="6" y1="18" x2="14" y2="18" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          Plate Label
        </div>
        <div className="navlinks">
          <button
            className={`navlink ${screen === "landing" ? "active" : ""}`}
            onClick={() => goTo("landing")}
          >
            Home
          </button>
          <button
            className={`navlink ${screen === "history" ? "active" : ""}`}
            onClick={() => goTo("history")}
          >
            History
          </button>
        </div>
      </div>
    </div>
  );
}
