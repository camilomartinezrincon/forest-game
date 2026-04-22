import { useRef } from "react";
import CamaraScanner from "./Camara";

function QRScannerWithImage({
  onScan,
  scannedImages = [],
  userOrder = {},
  onOrderChange,
}) {
  const processingRef = useRef(false);

  const handleScan = async (qrValue) => {
    if (processingRef.current) return;

    const alreadyScanned = scannedImages.some(
      (item) => item.qrValue === qrValue,
    );

    if (alreadyScanned) {
      console.log("Already scanned:", qrValue);
      return;
    }

    processingRef.current = true;

    let imageUrl = null;

    try {
      const imageModule = await import(`../assets/img/${qrValue}.jpg`);
      imageUrl = imageModule.default;
    } catch {
      try {
        const imageModule = await import(`../assets/img/${qrValue}.png`);
        imageUrl = imageModule.default;
      } catch {
        imageUrl = null;
      }
    }

    if (onScan) {
      onScan(qrValue, imageUrl);
    }

    setTimeout(() => {
      processingRef.current = false;
    }, 500);
  };

  const handleRadioChange = (qrValue, value) => {
    if (onOrderChange) {
      onOrderChange(qrValue, value);
    }
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      <CamaraScanner onScan={handleScan} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "60px",
          marginTop: "40px",
          padding: "20px",
        }}
      >
        {scannedImages.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {item.imageSrc && (
              <img
                src={item.imageSrc}
                alt={item.qrValue}
                style={{
                  width: "300px",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}
              />
            )}
            <div
              style={{
                display: "flex",
                gap: "20px",
                marginTop: "15px",
              }}
            >
              {[1, 2, 3, 4].map((num) => (
                <label
                  key={num}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name={`order-${item.qrValue}`}
                    value={num}
                    checked={userOrder[item.qrValue] === num}
                    onChange={() => handleRadioChange(item.qrValue, num)}
                    style={{
                      width: "20px",
                      height: "20px",
                      cursor: "pointer",
                    }}
                  />
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {num}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QRScannerWithImage;
