import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QRScannerWithImage from "../components/QRScannerWithImage";
import "../styles/Game.css";
import helicopterviewAudio from "../assets/helicopterview.mp3";
import cliffedgestruggleAudio from "../assets/cliffedgestruggle.mp3";
import letterheadAudio from "../assets/letterhead.mp3";

function Game() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [chapter, setChapter] = useState(null);
  const [scannedCards, setScannedCards] = useState([]);
  const [scannedImages, setScannedImages] = useState([]);
  const [resultMessage, setResultMessage] = useState("");
  const [userOrder, setUserOrder] = useState({});

  const chapterAudioMap = {
    helicopterview: helicopterviewAudio,
    cliffedgestruggle: cliffedgestruggleAudio,
    letterhead: letterheadAudio,
  };

  const chapterConfig = {
    helicopterview: {
      correctOrder: ["handheldradio", "campinggear", "axe"],
      totalCards: 3,
    },
    cliffedgestruggle: {
      correctOrder: ["deadmoose", "campfire", "whiskey"],
      totalCards: 3,
    },
    letterhead: {
      correctOrder: ["lonecliffman", "gravestone", "moonlitaxe"],
      totalCards: 3,
    },
  };

  const currentChapterConfig = chapter ? chapterConfig[chapter] : null;
  const totalCardsNeeded = currentChapterConfig
    ? currentChapterConfig.totalCards
    : 0;

  const handleScan = (qrValue, imageSrc) => {
    const normalizedValue = qrValue.toLowerCase();

    if (step === 1) {
      if (
        normalizedValue === "helicopterview" ||
        normalizedValue === "cliffedgestruggle" ||
        normalizedValue === "letterhead"
      ) {
        setChapter(normalizedValue);
        setScannedCards([normalizedValue]);
        setScannedImages([
          { qrValue: normalizedValue, imageSrc, id: Date.now() },
        ]);
        setStep(2);
      }
    } else if (step === 2 && chapter) {
      if (
        !scannedCards.includes(normalizedValue) &&
        normalizedValue !== chapter
      ) {
        const newScannedCards = [...scannedCards, normalizedValue];
        const newScannedImages = [
          ...scannedImages,
          { qrValue: normalizedValue, imageSrc, id: Date.now() },
        ];
        setScannedCards(newScannedCards);
        setScannedImages(newScannedImages);

        if (newScannedCards.length === totalCardsNeeded + 1) {
          setStep(3);
        }
      }
    }
  };

  const handleOrderChange = (qrValue, orderNumber) => {
    setUserOrder((prev) => ({ ...prev, [qrValue]: orderNumber }));
  };

  const handleCheckResult = () => {
    const cardsToOrder = scannedImages.filter(
      (item) => item.qrValue !== chapter,
    );

    const orderedItems = [...cardsToOrder].sort((a, b) => {
      const orderA = userOrder[a.qrValue] || 999;
      const orderB = userOrder[b.qrValue] || 999;
      return orderA - orderB;
    });

    const orderedCardValues = orderedItems.map((item) => item.qrValue);
    const correctOrder = currentChapterConfig.correctOrder;

    let correct = true;
    for (let i = 0; i < orderedCardValues.length; i++) {
      if (orderedCardValues[i] !== correctOrder[i]) {
        correct = false;
        break;
      }
    }

    if (correct) {
      const isLastChapter = chapter === "letterhead";

      navigate("/chapter-complete", {
        state: {
          chapter: chapter,
          chapterAudio: chapterAudioMap[chapter],
          isLastChapter: isLastChapter,
        },
      });
    } else {
      setResultMessage("Incorrect order. Try again!");
    }
  };

  const cardsToOrder = scannedImages.filter((item) => item.qrValue !== chapter);
  const allRadiosSelected =
    cardsToOrder.length === totalCardsNeeded &&
    cardsToOrder.length > 0 &&
    cardsToOrder.every((item) => userOrder[item.qrValue] !== undefined);

  if (step === 1) {
    return (
      <div className="game-container">
        <QRScannerWithImage
          onScan={handleScan}
          scannedImages={scannedImages}
          onOrderChange={handleOrderChange}
          userOrder={userOrder}
        />
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="game-container">
        <div className="game-header"></div>

        <QRScannerWithImage
          onScan={handleScan}
          onOrderChange={handleOrderChange}
          scannedImages={scannedImages}
          userOrder={userOrder}
        />
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="game-container">
        <QRScannerWithImage
          onScan={handleScan}
          onOrderChange={handleOrderChange}
          scannedImages={scannedImages}
          userOrder={userOrder}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
            marginBottom: "30px",
          }}
        >
          <button
            className="check-button"
            onClick={handleCheckResult}
            disabled={!allRadiosSelected}
            style={{
              padding: "12px 32px",
              fontSize: "18px",
              backgroundColor: allRadiosSelected ? "#4CAF50" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: allRadiosSelected ? "pointer" : "not-allowed",
            }}
          >
            CHECK RESULT
          </button>
        </div>

        {resultMessage && (
          <div
            className="result-message"
            style={{
              textAlign: "center",
              marginTop: "20px",
              color: "red",
              fontSize: "18px",
            }}
          >
            {resultMessage}
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default Game;
