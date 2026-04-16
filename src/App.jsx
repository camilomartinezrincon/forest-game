import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import "../src/styles/Navbar.css";
import Home from "./pages/home";
import About from "./pages/about";
import CamaraScanner from "./components/Camara";
import Intro from "./pages/intro";
import Game from "./pages/game";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/camera" element={<CamaraScanner />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
