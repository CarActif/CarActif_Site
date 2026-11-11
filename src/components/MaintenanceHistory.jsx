import "./MaintenanceHistory.css";

function formatKm(km) {
  const n = Number(String(km ?? "").replace(/\s/g, ""));
  return Number.isFinite(n) && n > 0 ? `${n.toLocaleString("fr-FR")} km` : "NC";
}
function formatDate(date) {
  const d = date ? new Date(date) : null;
  return d && !Number.isNaN(d.getTime())
    ? d.toLocaleDateString("fr-FR", { month: "short", year: "numeric" })
    : "NC";
}
const PRESTATAIRES = {
  concessionnaire: "Concessionnaire",
  garage: "Garage",
  constructeur: "Constructeur",
  particulier: "Particulier",
};
function libellePrestataire(item) {
  const v = String(item.prestataire || item.origine || "").trim().toLowerCase();
  return PRESTATAIRES[v] || (v ? v.charAt(0).toUpperCase() + v.slice(1) : "");
}

/** Historique d'entretien : tableau simple, du plus récent au plus ancien. */
export default function MaintenanceHistory({ entretien }) {
  const lignes = (Array.isArray(entretien) ? entretien : [])
    .filter((e) => e && (e.date || e.km || e.description))
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  if (lignes.length === 0) {
    return <p className="entretien-vide">Aucun entretien renseigné pour ce véhicule.</p>;
  }

  return (
    <div className="entretien">
      <p className="entretien__resume">
        {lignes.length} entretien{lignes.length > 1 ? "s" : ""} enregistré{lignes.length > 1 ? "s" : ""}, dernier en {formatDate(lignes[0].date)} à {formatKm(lignes[0].km)}.
      </p>
      <table className="entretien__table">
        <thead>
          <tr><th>Date</th><th>Kilométrage</th><th>Intervention</th><th>Réalisé par</th></tr>
        </thead>
        <tbody>
          {lignes.map((it, i) => (
            <tr key={i}>
              <td data-label="Date">{formatDate(it.date)}</td>
              <td data-label="Kilométrage">{formatKm(it.km)}</td>
              <td data-label="Intervention">{it.description || "NC"}</td>
              <td data-label="Réalisé par">{libellePrestataire(it) || "NC"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
