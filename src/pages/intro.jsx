import "../styles/intro.css";
import { useNavigate } from "react-router-dom";
import audioFile from "../assets/intro.mp3";

function Intro() {
  const navigate = useNavigate();

  return (
    <div className="intro-container">
      <div className="intro-content">

        {/* <p className="intro-label">Chapter I</p> */}
        <h1 className="intro-title">Prologue</h1>

        <div className="intro-divider" />

        <p className="intro-subtitle">
          Before you enter the forest, listen closely.
        </p>

        <div className="audio-wrapper">
          <audio controls className="audio-player">
            <source src={audioFile} type="audio/mpeg" />
      
          </audio>
        </div>

        <button
          className="intro-next-btn"
          onClick={() => navigate("/game")}
        >
          Enter the Forest →
        </button>

      </div>
    </div>
  );
}

export default Intro;
