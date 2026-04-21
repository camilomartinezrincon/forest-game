import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        <Link to="/" className="navbar-logo">
          Forest Rules
        </Link>


        <ul className="navbar-menu">
          <li>
            <Link to="/about">About Us</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
