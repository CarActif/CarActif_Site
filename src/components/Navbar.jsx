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
        <Link to="/" onClick={() => setIsOpen(false)}>🏠 Accueil</Link>
        <Link to="/vendre" onClick={() => setIsOpen(false)}>🚗 Vendez votre voiture</Link>
        <Link to="/vehicules" onClick={() => setIsOpen(false)}>🚙 Nos véhicules</Link>
        <Link to="/equipe" onClick={() => setIsOpen(false)}>🧑‍🤝‍🧑 Notre équipe</Link>
        <Link to="/contact" onClick={() => setIsOpen(false)}>📞 Contactez-nous</Link>
      </div>

      <div className="burger" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </nav>
  );
}
