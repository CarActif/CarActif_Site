import { Link } from "react-router-dom";
import usePageMeta from "../lib/usePageMeta";
import { AVANTAGES_GARANTIE, GARANTIE_INCLUSE_DEFAUT } from "../lib/garantieInclusse";
import "./CommentCaMarche.css";

export default function Garantie() {
  usePageMeta(
    "Garantie mécanique 3 mois incluse",
    "Chaque véhicule vendu avec CarActif bénéficie d'une garantie mécanique de 3 mois incluse : ce qu'elle couvre, ses conditions et les extensions possibles."
  );
  const g = GARANTIE_INCLUSE_DEFAUT;
  return (
    <div className="ccm-page">
      <section className="ccm-hero">
        <h1>Garantie mécanique 3 mois incluse</h1>
        <p className="ccm-intro">
          Chaque véhicule éligible vendu avec CarActif est garanti 3 mois, sans supplément pour l'acheteur.
        </p>
      </section>

      <section className="ccm-section">
        <div className="chip-header" role="heading" aria-level="2">
          <span className="chip-title"><span className="chip-bold">Ce qui est inclus</span></span>
        </div>
        <div className="ccm-step glass-card">
          <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8 }}>
            {AVANTAGES_GARANTIE.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ccm-section">
        <div className="chip-header" role="heading" aria-level="2">
          <span className="chip-title"><span className="chip-bold">Pour quels véhicules ?</span></span>
        </div>
        <p>
          La garantie incluse s'applique aux véhicules de moins de {g.age_max} ans et de moins de{" "}
          {g.km_max.toLocaleString("fr-FR")} km. L'âge est calculé à partir de l'année de mise en circulation.
          Si votre véhicule dépasse ces limites, votre agent vous indique ce qui est possible.
        </p>
      </section>

      <section className="ccm-section">
        <div className="chip-header" role="heading" aria-level="2">
          <span className="chip-title"><span className="chip-bold">Étendre la garantie</span></span>
        </div>
        <p>
          Pour une durée plus longue ou un niveau de couverture supérieur (plafond de prise en charge plus élevé,
          sans vétusté, véhicule de remplacement), l'acheteur peut demander une extension à l'agent CarActif.
          Les niveaux disponibles dépendent de l'âge et du kilométrage du véhicule. L'agent présente l'offre et son prix
          au moment de la vente.
        </p>
      </section>

      <section className="ccm-section">
        <div className="chip-header" role="heading" aria-level="2">
          <span className="chip-title"><span className="chip-bold">Bon à savoir</span></span>
        </div>
        <ul style={{ paddingLeft: 20, display: "grid", gap: 8 }}>
          <li>La prise en charge se fait avec vétusté : le montant remboursé tient compte de l'usure de la pièce.</li>
          <li>Seules les pannes couvertes sont prises en charge. La liste complète figure dans les conditions générales et particulières, remises à l'acheteur.</li>
          <li>L'usure normale (pneus, plaquettes, entretien courant) n'est pas une panne.</li>
        </ul>
      </section>

      <section className="ccm-cta">
        <h2>Une question sur la garantie ?</h2>
        <p>Votre agent CarActif vous répond avant l'achat.</p>
        <Link to="/faq" className="link-accent">Questions fréquentes</Link>{" "}
        <Link to="/vehicules" className="btn-primary">Voir les véhicules</Link>
      </section>
    </div>
  );
}
