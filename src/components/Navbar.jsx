import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const links = [
  { to: "/", label: "Accueil", end: true },
  { to: "/vendre", label: "Vendez votre voiture" },
  { to: "/estimation", label: "Estimation" },
  { to: "/comment-ca-marche", label: "Comment ça marche" },
  { to: "/vehicules", label: "Nos véhicules" },
  { to: "/equipe", label: "Notre équipe" },
  { to: "/recrutement", label: "Recrutement" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        <NavLink to="/" className="logo" onClick={closeMenu}>
          <img src="/caractif-logo.png" alt="CarActif" />
        </NavLink>

        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "nav-link nav-link--active" : "nav-link"
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          className={`burger ${isOpen ? "burger--open" : ""}`}
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isOpen}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      </div>
    </nav>
  );
}
