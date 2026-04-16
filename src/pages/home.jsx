import "../styles/home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handlePlayNow = () => {
    navigate("/intro");
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="game-title">GAME TITLE</h1>
        <p className="game-description">
          Short description about the game
          <br />
          Once upon a time there's a mockup text right here
        </p>
        <button className="play-button" onClick={handlePlayNow}>
          PLAY NOW
        </button>
      </div>

      <div className="how-to-play">
        <h2>HOW TO PLAY</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">STEP1</div>
            <p>Scan the card using the camera</p>
          </div>
          <div className="step">
            <div className="step-number">STEP2</div>
            <p>Drag the image to your concluded slot</p>
          </div>
          <div className="step">
            <div className="step-number">STEP3</div>
            <p>Check if your conclusion is correct</p>
          </div>
          <div className="step">
            <div className="step-number">STEP4</div>
            <p>
              Modifying your choice after the review until you finish the
              correct order
            </p>
          </div>
          <div className="step">
            <div className="step-number">STEP5</div>
            <p>You've completed a chapter!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
