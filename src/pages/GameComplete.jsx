import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ChapterComplete.css";
import forestRulesAudio from "../assets/forestrules.mp3";

function GameComplete() {
  const navigate = useNavigate();
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error("Error playing final audio:", err);
      });
    }
  }, []);

  const handleGoHome = () => {
    navigate("/home");
  };

  return (
    <div className="chapter-complete-container">
      <div className="chapter-complete-card">
        <h1 className="complete-title">GAME COMPLETE!</h1>
        <p className="complete-subtitle">
          Congratulations! You have completed all chapters!
        </p>

        <div className="chapter-audio-section">
          <h3>Listen to the final game audio:</h3>
          <audio
            ref={audioRef}
            src={forestRulesAudio}
            controls
            autoPlay
            className="chapter-audio"
          />
        </div>

        <button className="home-button" onClick={handleGoHome}>
          GO TO HOME
        </button>
      </div>
    </div>
  );
}

export default GameComplete;
