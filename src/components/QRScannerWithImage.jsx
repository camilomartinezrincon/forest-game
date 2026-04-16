import { useState } from "react";
import CamaraScanner from "./Camara";

function QRScannerWithImage() {
  const [scannedData, setScannedData] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showScanner, setShowScanner] = useState(true);

  const handleScan = async (qrValue) => {
    setScannedData(qrValue);

    try {
      const imageModule = await import(`../assets/img/${qrValue}.jpg`);
      setImageSrc(imageModule.default);
    } catch (error) {
      console.error("Image not found:", qrValue, error);
      try {
        const imageModule = await import(`../assets/img/${qrValue}.png`);
        setImageSrc(imageModule.default);
      } catch {
        console.error("Image not found in jpg or png:", qrValue);
        setImageSrc(null);
      }
    }
  };

  const handleNext = () => {
    setScannedData(null);
    setImageSrc(null);
    setShowScanner(true);
  };

  if (!showScanner) {
    return null;
  }

  return (
    <div className="qr-scanner-container">
      <CamaraScanner onScan={handleScan} onNext={handleNext} />

      {scannedData && imageSrc && (
        <div className="image-result">
          <h2>Scanned content: {scannedData}</h2>
          <img src={imageSrc} alt={scannedData} className="scanned-image" />
        </div>
      )}
    </div>
  );
}

export default QRScannerWithImage;
