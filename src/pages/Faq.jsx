import { Link } from "react-router-dom";
import usePageMeta from "../lib/usePageMeta";
import "./CommentCaMarche.css";
import "./Faq.css";

const QUESTIONS = [
  {
    q: "Combien coûte CarActif ?",
    r: "La commission est fixe, à partir de 1 490 € TTC selon le prix du véhicule. Elle est indiquée avant la signature du mandat, ajoutée au prix affiché au public et supportée par l'acheteur. Le vendeur reçoit l'intégralité du prix net convenu.",
  },
  {
    q: "Dois-je payer quelque chose au départ ?",
    r: "Non. Vous ne payez rien pour l'estimation, la prise de photos, l'annonce ou les visites.",
  },
  {
    q: "Qui encaisse l'argent de la vente ?",
    r: "Ni le vendeur ni CarActif au moment de la vente : le paiement de l'acheteur est bloqué sur un compte séquestre tiers (CashSentinel) et libéré une fois les vérifications faites et le véhicule remis. CarActif ne détient jamais les fonds.",
  },
  {
    q: "Est-ce que je garde ma voiture pendant la vente ?",
    r: "Oui. Vous restez propriétaire et vous continuez à rouler. Le véhicule n'est jamais stocké chez nous. CarActif n'est pas un dépôt-vente.",
  },
  {
    q: "Combien de temps faut-il pour vendre ?",
    r: "Cela dépend du modèle, du prix et de la demande locale. Nous ne promettons pas de délai : votre agent vous fait un point régulier et ajuste la stratégie avec vous.",
  },
  {
    q: "Quels documents dois-je préparer ?",
    r: "La carte grise à votre nom, une pièce d'identité, un contrôle technique de moins de 6 mois (obligatoire pour vendre), le carnet d'entretien, les factures et les doubles des clés.",
  },
  {
    q: "La garantie est-elle vraiment incluse ?",
    r: "Oui, une garantie mécanique de 3 mois est incluse pour l'acheteur, pour les véhicules éligibles (jusqu'à 20 ans et 200 000 km). Une extension peut être proposée par l'agent. Voir la page Garantie.",
    lien: { to: "/garantie", label: "Détail de la garantie" },
  },
  {
    q: "L'estimation en ligne est-elle un engagement ?",
    r: "Non, elle est indicative. Elle est affinée lors de l'estimation sur place, gratuite et sans engagement, par un agent CarActif.",
    lien: { to: "/estimation", label: "Estimer mon véhicule" },
  },
  {
    q: "Dans quelles régions intervenez-vous ?",
    r: "Nous démarrons dans les Hauts-de-France (Nord et Pas-de-Calais), autour de Dunkerque, Calais, Saint-Omer et Lille.",
  },
  {
    q: "Que deviennent mes données personnelles ?",
    r: "Elles servent uniquement à répondre à votre demande, et ne sont ni revendues ni transmises à des fins commerciales.",
    lien: { to: "/politique-confidentialite", label: "Politique de confidentialité" },
  },
];

export default function Faq() {
  usePageMeta("Questions fréquentes", "Réponses aux questions fréquentes sur la vente de votre voiture avec CarActif : coût, paiement sécurisé, garantie, documents, délais.");
  return (
    <div className="ccm-page">
      <section className="ccm-hero">
        <h1>Questions fréquentes</h1>
        <p className="ccm-intro">Les réponses aux questions que l'on nous pose le plus souvent.</p>
      </section>
      <section className="faq-list">
        {QUESTIONS.map((item) => (
          <details key={item.q} className="faq-item glass-card">
            <summary>{item.q}</summary>
            <p>{item.r}</p>
            {item.lien && <Link to={item.lien.to} className="link-accent">{item.lien.label}</Link>}
          </details>
        ))}
      </section>
      <section className="ccm-cta">
        <h2>Une autre question ?</h2>
        <p>Nos équipes vous répondent, sans engagement de votre part.</p>
        <Link to="/contact" className="btn-primary">Nous contacter</Link>
      </section>
    </div>
  );
}
