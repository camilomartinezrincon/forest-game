import "../styles/home.css";

import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">

  
      <div className="home-hero">
        <h1 className="game-title">FOREST RULES</h1>
        <p className="game-description">
          In a northern Canadian fly in camp, a group of foresters slowly discovers that someone in their midst is planning to use the isolation of the forest to their sinister advantage.
  
        </p>
        <button className="play-button" onClick={() => navigate("/intro")}>
          PLAY NOW
        </button>
      </div>

 <div className="section-divider" />

      
      <div className="how-to-play">
        <h2>HOW TO PLAY</h2>
        <div className="steps-container">
          {[
            { n: "STEP 1", t: "Scan the card using the camera" },
            { n: "STEP 2", t: "Drag the image to your concluded slot" },
            { n: "STEP 3", t: "Check if your conclusion is correct" },
            { n: "STEP 4", t: "Modify your choice after the review until you get the correct order" },
            { n: "STEP 5", t: "You've completed a chapter!" },
          ].map((s, i) => (
            <div className="step" key={i}>
              <div className="step-number">{s.n}</div>
              <p>{s.t}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Home;
