import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/caractif-logo.png" alt="CarActif" />
      </div>

      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <Link to="/">🏠 Accueil</Link>
        <Link to="/vendre">🚗 Vendez votre voiture</Link>
        <Link to="/vehicules">🚙 Nos véhicules</Link>
        <Link to="/equipe">🧑‍🤝‍🧑 Notre équipe</Link>
        <Link to="/contact">📞 Contactez-nous</Link>
      </div>

      <div className="menu-icon" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </nav>
  );
}
