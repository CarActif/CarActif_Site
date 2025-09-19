import React from "react";

function formatKm(km) {
  return km ? km.toLocaleString("fr-FR").replace(/\s/g, '\u00A0') + " km" : "NC";
}
function formatDate(date) {
  return date ? new Date(date).toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "numeric" }) : "NC";
}

export default function MaintenanceHistory({ entretien }) {
  if (!entretien || entretien.length === 0)
    return <p className="timeline-empty">Aucun historique d’entretien disponible.</p>;

  // Tri descendant par date, filtre les enregistrements incomplets
  const steps = entretien
    .filter(e => e.date && e.km && e.description)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <ol className="timeline-entretien" aria-label="Historique d'entretien du véhicule">
      {steps.map((item, idx) => {
        // Alternance gauche/droite desktop, pile mobile
        const alt = idx % 2 === 0 ? "left" : "right";
        // Badge origine (si présent)
        let badge = null;
        if (item.origine === "constructeur") badge = <span className="badge-constructeur">Constructeur</span>;
        if (item.origine === "garage") badge = <span className="badge-garage">Garage</span>;
        // Icône fine selon type (optionnel)
        let icon = null;
        if (/vidange|huile/i.test(item.description)) icon = <span className="timeline-icon" aria-label="Vidange">🛢️</span>;
        if (/frein/i.test(item.description)) icon = <span className="timeline-icon" aria-label="Freins">🛑</span>;
        if (/révision|revision/i.test(item.description)) icon = <span className="timeline-icon" aria-label="Révision">🔧</span>;
        return (
          <li key={idx} className={`timeline-step timeline-${alt}`}>
            <div className="timeline-dot"></div>
            <svg className="timeline-connector" viewBox="0 0 32 64" width="32" height="64" aria-hidden="true"><path d="M16 0 Q16 32 16 64" stroke="#05A820" strokeWidth="2" fill="none"/></svg>
            <div className="timeline-content" tabIndex={0} aria-label={`Intervention du ${formatDate(item.date)} à ${formatKm(item.km)}`}>
              <div className="timeline-header">
                <span className="timeline-date" title={formatDate(item.date)}>{formatDate(item.date)}</span>
                <span className="timeline-km" title={formatKm(item.km)}>{formatKm(item.km)}</span>
              </div>
              <div className="timeline-type">
                {icon}
                <span className="timeline-desc" title={item.description.length > 40 ? item.description : undefined}>
                  {item.description.length > 40 ? item.description.slice(0, 40) + "…" : item.description}
                </span>
              </div>
              {badge && <span className="timeline-badge" aria-label={`Origine: ${item.origine}`}>{badge}</span>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
