import ArtworkCard from "./ArtworkCard";

export default function Dashboard({ vehicules = [], limit = 4 }) {
  const visible = vehicules
    .filter((v) => v.statut !== "Mandat signé" && v.statut !== "Archivé")
    .slice(0, limit);

  if (visible.length === 0) {
    return (
      <p className="py-8 text-center text-sm font-normal" style={{ color: "var(--text3)" }}>
        Aucun véhicule disponible pour le moment.
      </p>
    );
  }

  return (
    <div className="artwork-card-grid">
      {visible.map((vehicle, index) => (
        <ArtworkCard
          key={vehicle.id}
          vehicle={vehicle}
          index={index}
          to={vehicle.statut === "Vendu" ? undefined : `/vehicules/${vehicle.id}`}
          disabled={vehicle.statut === "Vendu"}
        />
      ))}
    </div>
  );
}
