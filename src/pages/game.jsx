import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import QRScannerWithImage from "../components/QRScannerWithImage";
import "../styles/Game.css";

function Game() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [chapter, setChapter] = useState(null);
  const [scannedCards, setScannedCards] = useState([]);
  const [orderedCards, setOrderedCards] = useState([]);
  const [scannedImages, setScannedImages] = useState([]);
  const [resultMessage, setResultMessage] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [chapterCompleted, setChapterCompleted] = useState(false);
  const [completionAudioSrc, setCompletionAudioSrc] = useState(null);
  const completionAudioRef = useRef(null);

  const chapterConfig = {
    chapter1: {
      correctOrder: ["helicopterView", "handheldRadio", "campingGear", "axe"],
      nextChapter: "chapter2",
      completionAudio: "chUnoDone.mp3",
    },
    chapter2: {
      correctOrder: ["cliffEdgeStruggle", "deadMoose", "campFire"],
      nextChapter: "chapter3",
      completionAudio: "chDosDone.mp3",
    },
    chapter3: {
      correctOrder: ["letterHead", "loneCliffMan", "gravestone", "moonlitAxe"],
      nextChapter: "chapter4",
      completionAudio: "chTresDone.mp3",
    },
  };

  const currentChapterConfig = chapter ? chapterConfig[chapter] : null;
  const totalCards = currentChapterConfig
    ? currentChapterConfig.correctOrder.length
    : 0;

  useEffect(() => {
    const completedChapter = localStorage.getItem(
      `chapter_${chapter}_completed`,
    );
    if (completedChapter === "true") {
      setChapterCompleted(true);
      setStep(4);
    }
  }, [chapter]);

  useEffect(() => {
    if (completionAudioSrc && completionAudioRef.current) {
      completionAudioRef.current.play().catch((err) => {
        console.error("Error playing completion audio:", err);
      });
    }
  }, [completionAudioSrc]);

  const handleScan = (qrValue, imageSrc) => {
    console.log("Scanned:", qrValue);

    if (step === 1 && qrValue.startsWith("chapter")) {
      setChapter(qrValue);
      setStep(2);
    } else if (
      step === 2 &&
      !scannedCards.includes(qrValue) &&
      qrValue !== chapter
    ) {
      const newScannedCards = [...scannedCards, qrValue];
      const newScannedImages = [...scannedImages, { qrValue, imageSrc }];
      setScannedCards(newScannedCards);
      setScannedImages(newScannedImages);

      if (newScannedCards.length === totalCards) {
        setStep(3);
        setOrderedCards(newScannedCards);
      }
    }
  };

  const handleNext = () => {
    navigate("/game");
  };

  const handleCheckResult = async () => {
    let correct = true;
    const correctOrder = currentChapterConfig.correctOrder;

    for (let i = 0; i < orderedCards.length; i++) {
      if (orderedCards[i] !== correctOrder[i]) {
        correct = false;
        break;
      }
    }

    if (correct) {
      setIsCorrect(true);
      setResultMessage("Correct! Well done!");

      try {
        const audioModule = await import(
          `../assets/${currentChapterConfig.completionAudio}`
        );
        setCompletionAudioSrc(audioModule.default);
      } catch (error) {
        console.error(
          "Completion audio not found:",
          currentChapterConfig.completionAudio,
          error,
        );
      }

      localStorage.setItem(`chapter_${chapter}_completed`, "true");
      setChapterCompleted(true);
      setStep(4);
    } else {
      setIsCorrect(false);
      setResultMessage("Incorrect order. Try again!");
    }
  };

  const handleNextChapter = () => {
    window.location.reload();
  };

  const moveCard = (fromIndex, toIndex) => {
    const newOrdered = [...orderedCards];
    const [moved] = newOrdered.splice(fromIndex, 1);
    newOrdered.splice(toIndex, 0, moved);
    setOrderedCards(newOrdered);
  };

  const getImageForCard = (qrValue) => {
    const found = scannedImages.find((item) => item.qrValue === qrValue);
    return found ? found.imageSrc : null;
  };

  if (step === 1) {
    return (
      <div className="game-container">
        <QRScannerWithImage
          onScan={handleScan}
          onNext={handleNext}
          scannedImages={scannedImages}
        />
        <div className="game-instruction">
          <p>Point your camera at the card to scan</p>
          <p>Scan the CHAPTER card first</p>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="game-container">
        <div className="game-header">
          <div className="chapter-display">Chapter: {chapter}</div>
        </div>
        <QRScannerWithImage
          onScan={handleScan}
          onNext={handleNext}
          scannedImages={scannedImages}
        />
        <div className="game-instruction">
          <p>Point your camera at the card to scan</p>
          <p>
            Scanned cards: {scannedCards.length}/{totalCards}
          </p>
        </div>
        <div className="scanned-list">
          {scannedImages.map((item, idx) => (
            <div key={idx} className="scanned-card-item">
              <div className="scanned-card">
                Card {idx + 1}: {item.qrValue}
              </div>
              {item.imageSrc && (
                <img
                  src={item.imageSrc}
                  alt={item.qrValue}
                  className="scanned-thumbnail"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="game-container">
        <div className="game-header">
          <div className="chapter-display">Chapter: {chapter}</div>
        </div>
        <div className="drag-drop-area">
          <h3>Order the cards correctly:</h3>
          {resultMessage && !isCorrect && (
            <div className="result-message incorrect">
              {resultMessage}
              <button
                className="try-again-button"
                onClick={() => setResultMessage("")}
              >
                Continue ordering
              </button>
            </div>
          )}
          <div className="cards-container">
            {orderedCards.map((card, index) => {
              const imageUrl = getImageForCard(card);
              return (
                <div
                  key={index}
                  className="draggable-card"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", index);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const fromIndex = parseInt(
                      e.dataTransfer.getData("text/plain"),
                    );
                    moveCard(fromIndex, index);
                  }}
                >
                  {imageUrl && (
                    <img src={imageUrl} alt={card} className="card-image" />
                  )}
                  <div className="card-name">{card}</div>
                </div>
              );
            })}
          </div>
          <button className="check-button" onClick={handleCheckResult}>
            CHECK RESULT
          </button>
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="game-container">
        <audio ref={completionAudioRef} src={completionAudioSrc} />
        <div className="game-header">
          <div className="chapter-display">Chapter: {chapter}</div>
        </div>
        <div className="result-area">
          <h3 className="success-title">🎉 SUCCESS! 🎉</h3>
          <p className="success-message">You ordered the cards correctly!</p>
          <div className="cards-container">
            {orderedCards.map((card, idx) => {
              const imageUrl = getImageForCard(card);
              return (
                <div key={idx} className="result-card">
                  <div className="result-number">{idx + 1}</div>
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={card}
                      className="result-card-image"
                    />
                  )}
                  <div className="result-card-name">{card}</div>
                </div>
              );
            })}
          </div>
          <button
            className="next-chapter-button"
            onClick={handleNextChapter}
            disabled={!chapterCompleted}
            style={{
              opacity: chapterCompleted ? 1 : 0.5,
              cursor: chapterCompleted ? "pointer" : "not-allowed",
            }}
          >
            NEXT CHAPTER
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default Game;
