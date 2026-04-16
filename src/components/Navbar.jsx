import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <ul className="navbar-menu">
            <li>
              <Link to="/home">Forest Game</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
