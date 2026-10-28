import "./EstimationResult.css";

const formatPrix = (value) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
    value
  );

export default function EstimationResult({ vehicle, estimation, onContact }) {
  const { marque, modele, motorisation, annee } = vehicle;
  const { min, moy, max, estimationApproximative } = estimation;

  return (
    <div className="bp-result">
      <div className="bp-badge">Résultat de l'estimation</div>

      <div className="bp-vehicle-summary">
        <h2>
          {marque} {modele}
        </h2>
        <p className="bp-vehicle-details">{[motorisation, annee].filter(Boolean).join(" · ")}</p>
      </div>

      {estimationApproximative && (
        <div className="bp-callout bp-callout--orange">
          <div className="bp-callout-t">Estimation approximative</div>
          <div className="bp-callout-b">
            Basée sur la catégorie du véhicule — contactez-nous pour un chiffrage précis.
          </div>
        </div>
      )}

      <div className="bp-price-range">
        <div className="bp-price-box">
          <span className="bp-price-label">Minimum</span>
          <span className="bp-price-value">{formatPrix(min)}</span>
        </div>
        <div className="bp-price-box bp-price-box--main">
          <span className="bp-price-label">Estimation moyenne</span>
          <span className="bp-price-value bp-price-value--main">{formatPrix(moy)}</span>
        </div>
        <div className="bp-price-box">
          <span className="bp-price-label">Maximum</span>
          <span className="bp-price-value">{formatPrix(max)}</span>
        </div>
      </div>

      <button type="button" className="bp-btn" onClick={onContact}>
        Être recontacté par un conseiller
      </button>

      <p className="bp-legal">
        Cette estimation est indicative et ne constitue pas un engagement de rachat ou de prix de
        vente final.
      </p>
    </div>
  );
}
