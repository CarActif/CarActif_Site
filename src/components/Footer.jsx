import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer mx-auto mt-auto w-full px-6 py-8 text-center text-sm text-slate-600">
      <nav aria-label="Liens utiles" className="site-footer-links">
        <Link to="/comment-ca-marche" className="link-accent">Comment ça marche</Link>
        <Link to="/garantie" className="link-accent">Garantie</Link>
        <Link to="/faq" className="link-accent">Questions fréquentes</Link>
        <Link to="/recrutement" className="link-accent">Recrutement</Link>
        <Link to="/contact" className="link-accent">Contact</Link>
      </nav>
      <div>
        © {new Date().getFullYear()} CarActif ·{" "}
        <Link to="/mentions-legales" className="link-accent">Mentions légales</Link>
        {" · "}
        <Link to="/politique-confidentialite" className="link-accent">Politique de confidentialité</Link>
      </div>
    </footer>
  );
}
