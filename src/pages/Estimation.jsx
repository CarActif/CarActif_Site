import usePageMeta from "../lib/usePageMeta";
import DemandeEstimation from "../components/estimation/DemandeEstimation";
import "./Estimation.css";

export default function Estimation() {
  usePageMeta("Estimation gratuite", "Demandez une estimation gratuite de votre voiture : un conseiller CarActif vous recontacte très bientôt.");
  return (
    <div className="estimation-page bp-page">
      <div className="bp-orb bp-orb--blue" />
      <div className="bp-orb bp-orb--purple" />
      <DemandeEstimation />
    </div>
  );
}
