import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer mx-auto mt-auto w-full px-6 py-8 text-center text-sm text-slate-600">
      © 2025 CarActif —{" "}
      <Link to="/mentions-legales" className="link-accent">
        Mentions Légales
      </Link>
      {" — "}
      <Link to="/politique-confidentialite" className="link-accent">
        Politique de confidentialité
      </Link>
    </footer>
  );
}
