import { useEffect, useRef, useState } from "react";
import "../styles/Camara.css";

function CamaraScanner({ onScan, onNext }) {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [scanned, setScanned] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null);
  const jsqrLoadedRef = useRef(false);

  useEffect(() => {
    let stream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", true);
          await videoRef.current.play();
          console.log("Cámara iniciada");
        }
      } catch (error) {
        console.error("Error accediendo a la cámara:", error);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!window.jsQR && !jsqrLoadedRef.current) {
      jsqrLoadedRef.current = true;
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js";
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    let scanning = true;
    let animationId;

    const scanQRCode = () => {
      if (!scanning || !video.videoWidth || !video.videoHeight) {
        animationId = requestAnimationFrame(scanQRCode);
        return;
      }

      if (!window.jsQR) {
        animationId = requestAnimationFrame(scanQRCode);
        return;
      }

      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const code = window.jsQR(imageData.data, canvas.width, canvas.height, {
          inversionAttempts: "dontInvert",
        });

        if (code && !scanned) {
          const qrValue = code.data.toLowerCase();
          console.log("QR detectado:", qrValue);

          import(`../assets/${qrValue}.mp3`)
            .then((module) => {
              setAudioSrc(module.default);
              console.log("Audio encontrado:", qrValue);
              setScanned(true);

              setTimeout(() => {
                if (audioRef.current) {
                  audioRef.current.play().catch((err) => {
                    console.error("Error reproduciendo audio:", err);
                  });
                }
              }, 100);

              if (onScan) {
                onScan(qrValue);
              }
            })
            .catch((error) => {
              console.error("Audio no encontrado:", qrValue, error);
            });
        }
      } catch (err) {
        console.error("Error escaneando:", err);
      }

      animationId = requestAnimationFrame(scanQRCode);
    };

    animationId = requestAnimationFrame(scanQRCode);

    return () => {
      scanning = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [scanned, onScan]);

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="qr-page">
      <div className="qr-card">
        <div className="qr-video-wrapper">
          <video ref={videoRef} className="qr-video" muted playsInline />
        </div>

        {scanned && (
          <>
            <div className="audio-wrapper">
              <audio ref={audioRef} src={audioSrc} controls autoPlay />
            </div>
            <button className="next-button" onClick={handleNext}>
              NEXT
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CamaraScanner;
