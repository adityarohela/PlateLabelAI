import { useState } from "react";
import "./App.css";
import TopBar from "./components/TopBar";
import Landing from "./components/Landing";
import UploadScreen from "./components/UploadScreen";
import ProcessingScreen from "./components/ProcessingScreen";
import ResultsScreen from "./components/ResultsScreen";
import HistoryScreen from "./components/HistoryScreen";

export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | upload | processing | results | history
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  function goTo(next) {
    setScreen(next);
  }

  function handleFileChosen(chosenFile) {
    setFile(chosenFile);
    setScreen("upload");
  }

  function handleContinue() {
    setPreview(URL.createObjectURL(file));
    setScreen("processing");
  }

  function handleAnalysisDone(data) {
    setAnalysis(data);
    setScreen("results");
  }

  function handleAnalyzeAnother() {
    setFile(null);
    setPreview(null);
    setAnalysis(null);
    setScreen("landing");
  }

  return (
    <div className="app-root">
      <TopBar screen={screen} goTo={goTo} />
      <div className="app">
        {screen === "landing" && <Landing onFileChosen={handleFileChosen} goTo={goTo} />}

        {screen === "upload" && file && (
          <UploadScreen
            file={file}
            onReplace={setFile}
            onContinue={handleContinue}
            onCancel={handleAnalyzeAnother}
          />
        )}

        {screen === "processing" && file && (
          <ProcessingScreen
            file={file}
            preview={preview}
            onDone={handleAnalysisDone}
            onRetry={handleContinue}
            onCancel={() => setScreen("upload")}
          />
        )}

        {screen === "results" && analysis && (
          <ResultsScreen
            preview={preview}
            analysis={analysis}
            onAnalyzeAnother={handleAnalyzeAnother}
            goTo={goTo}
          />
        )}

        {screen === "history" && <HistoryScreen />}
      </div>
      <footer>Plate Label — food photo nutrition analyser powered by Gemini Vision. Estimates only, not medical advice.</footer>
    </div>
  );
}
