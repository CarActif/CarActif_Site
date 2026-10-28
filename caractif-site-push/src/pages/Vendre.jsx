import { useNavigate } from "react-router-dom";
import "./Vendre.css";

export default function Vendre() {
  const navigate = useNavigate();

  return (
    <div className="vendre-page glass-card">
      <h1>🚗 Vendez votre voiture en toute simplicité avec CarActif</h1>
      <p className="intro-text">
        Vous souhaitez vendre votre véhicule ? Avec <strong>CarActif</strong>, c’est simple, rapide et sans frais !
        Un agent se déplace pour une estimation gratuite de votre voiture. Nous nous occupons de tout, de A à Z, vous n’avez plus qu’à encaisser.
      </p>

      <div className="advantages-grid">
        <div className="advantage-card glass-card">
          <span className="emoji">📍</span>
          <h3>Un agent proche de chez vous</h3>
          <p>Un professionnel se déplace pour estimer et valoriser votre voiture gratuitement, sans engagement.</p>
        </div>
        <div className="advantage-card glass-card">
          <span className="emoji">💸</span>
          <h3>Vendez au meilleur prix</h3>
          <p>Vous vendez au prix du marché, sans commission de reprise. Gagnez jusqu’à 20 % de plus qu’en passant par une concession.</p>
        </div>
        <div className="advantage-card glass-card">
          <span className="emoji">🎯</span>
          <h3>Multipliez vos acheteurs potentiels</h3>
          <p>Vous touchez les acheteurs qui cherchent chez les pros et ceux qui regardent chez les particuliers. 100 % du marché couvert.</p>
        </div>
        <div className="advantage-card glass-card">
          <span className="emoji">🔒</span>
          <h3>Transaction sécurisée</h3>
          <p>CarActif sécurise la transaction et le paiement, vous garantissant un processus sans risque ni litige.</p>
        </div>
        <div className="advantage-card glass-card">
          <span className="emoji">🤝</span>
          <h3>Gestion complète par nos soins</h3>
          <p>Nous gérons pour vous les annonces, les appels, les acheteurs, les rendez-vous et la paperasse. Vous n’avez rien à gérer !</p>
        </div>
      </div>

      <div className="info-section">
        <p>
          🔹 <strong>Avec CarActif, vous gardez les avantages d’une vente entre particuliers</strong>, mais avec la sécurité et l’accompagnement d’un professionnel.
        </p>
        <p>
          🔹 <strong>100 % gratuit pour vous</strong> — Notre rémunération est prise en charge par l’acheteur.
        </p>
        <p>
          🔹 <strong>Vente rapide et efficace</strong> — Jusqu’à 2 fois plus rapide qu’une vente classique entre particuliers.
        </p>
      </div>

      <button type="button" className="btn-primary contact-button" onClick={() => navigate("/equipe")}>📞 Contacter un agent près de chez moi</button>
    </div>
  );
}

