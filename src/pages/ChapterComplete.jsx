import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/ChapterComplete.css";

// Import completion audio files
import chUnoDone from "../assets/chUnoDone.mp3";
import chDosDone from "../assets/chDosDone.mp3";
import chTresDone from "../assets/chTresDone.mp3";

function ChapterComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const { chapter, isLastChapter } = location.state || {};
  const audioRef = useRef(null);

  const getChapterNumber = () => {
    switch (chapter) {
      case "helicopterview":
        return "Chapter 1";
      case "cliffedgestruggle":
        return "Chapter 2";
      case "letterhead":
        return "Chapter 3";
      default:
        return chapter;
    }
  };

  const getCompletionAudio = () => {
    switch (chapter) {
      case "helicopterview":
        return chUnoDone;
      case "cliffedgestruggle":
        return chDosDone;
      case "letterhead":
        return chTresDone;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error("Error playing completion audio:", err);
      });
    }
  }, []);

  const handleNext = () => {
    if (isLastChapter) {
      navigate("/game-complete");
    } else {
      navigate("/game");
    }
  };

  return (
    <div className="chapter-complete-container">
      <div className="chapter-complete-card">
        <h1 className="complete-title">CHAPTER COMPLETE!</h1>
        <p className="complete-subtitle">
          You have successfully completed: {getChapterNumber()}
        </p>

        <div className="chapter-audio-section">
          <h3>Listen to the completion audio:</h3>
          <audio
            ref={audioRef}
            src={getCompletionAudio()}
            controls
            autoPlay
            className="chapter-audio"
          />
        </div>

        <button className="next-chapter-button" onClick={handleNext}>
          {isLastChapter ? "LISTEN FULL AUDIO" : "NEXT CHAPTER"}
        </button>
      </div>
    </div>
  );
}

export default ChapterComplete;
