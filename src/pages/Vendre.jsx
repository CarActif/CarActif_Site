import { useNavigate } from "react-router-dom";
import "./Vendre.css";
import usePageMeta from "../lib/usePageMeta";

export default function Vendre() {
  const navigate = useNavigate();
  usePageMeta("Vendez votre voiture", "Vendez votre voiture au prix du marché avec CarActif : estimation gratuite à domicile, annonce, visites, paiement sécurisé par séquestre et garantie 3 mois incluse.");

  return (
    <div className="vendre-page glass-card">
      <h1>Vendez votre voiture en toute simplicité avec CarActif</h1>
      <p className="intro-text">
        Vous souhaitez vendre votre véhicule ? Avec <strong>CarActif</strong>, c’est simple et sans avance de frais : vous ne payez rien tant que le véhicule n’est pas vendu.
        Un agent se déplace pour une estimation gratuite de votre voiture. Nous nous occupons de tout, de l’annonce à la remise du véhicule.
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
          <p>Le paiement de l’acheteur est bloqué sur un compte séquestre tiers, et libéré seulement à la remise du véhicule. Vous êtes protégé contre les faux virements et les chèques sans provision.</p>
        </div>
        <div className="advantage-card glass-card">
          <span className="emoji">🤝</span>
          <h3>Gestion complète par nos soins</h3>
          <p>Nous gérons pour vous les annonces, les appels, les acheteurs, les rendez-vous et les démarches administratives du mandat.</p>
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
          🔹 <strong>Une vente suivie</strong> : un point d’étape régulier avec votre agent jusqu’au versement final.
        </p>
      </div>

      <button type="button" className="btn-primary contact-button" onClick={() => navigate("/equipe")}>📞 Contacter un agent près de chez moi</button>
    </div>
  );
}

