import CamaraScanner from "../components/Camara";
import { useNavigate } from "react-router-dom";

function Intro() {
  const navigate = useNavigate();

  const handleScan = (qrValue) => {
    console.log("Escaneado:", qrValue);
  };

  const handleNext = () => {
    navigate("/game");
  };

  return <CamaraScanner onScan={handleScan} onNext={handleNext} />;
}

export default Intro;
