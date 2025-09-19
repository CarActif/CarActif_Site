import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import "./Vehicules.css";

const supabase = createClient(
  "https://rhbnlcmsyqjbzykexttt.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoYm5sY21zeXFqYnp5a2V4dHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NDA5OTcsImV4cCI6MjA2NjAxNjk5N30.o24Li47McJpMVaa2sEjwR8oOa1mobsUqhdUUD2VwpT8"
);

export default function Vehicules() {
  const [vehicules, setVehicules] = useState([]);
  const [marques, setMarques] = useState([]);
  const [filtre, setFiltre] = useState({
    marque: "",
    annee: "",
    prixMax: "",
    boite: "",
    carburant: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicules = async () => {
      const { data, error } = await supabase.from("mandats").select("*");
      if (error) {
        console.error(error);
        return;
      }
      setVehicules(data || []);
      const uniqueMarques = [...new Set((data || []).map((v) => v.marque).filter(Boolean))];
      setMarques(uniqueMarques);
    };
    fetchVehicules();
  }, []);

  const handleFiltreChange = (e) => {
    const { name, value } = e.target;
    setFiltre((prev) => ({ ...prev, [name]: value }));
  };

  const filteredVehicules = vehicules
    .filter(v => v.statut !== "Mandat signé" && v.statut !== "Archivé")
    .filter((v) => {
      const yearOk =
        filtre.annee === "" ||
        (v.annee && new Date(v.annee).getFullYear() >= parseInt(filtre.annee, 10));

      const prixOk =
        filtre.prixMax === "" ||
        (typeof v.prix_affiche === "number" && v.prix_affiche <= parseInt(filtre.prixMax, 10));

      return (
        (filtre.marque === "" || v.marque === filtre.marque) &&
        yearOk &&
        prixOk &&
        (filtre.boite === "" || v.boite_vitesse === filtre.boite) &&
        (filtre.carburant === "" || v.energie === filtre.carburant)
      );
    });

  return (
    <div className="vehicules-wrapper">
      {/* Titre AU-DESSUS de tout */}
      <h2 className="vehicules-intro">
        Découvrez nos véhicules d’occasion actuellement disponibles à la vente
      </h2>

      {/* Bouton burger (mobile) */}
      <button
        className="filters-burger"
        onClick={() => setIsFilterOpen(true)}
        aria-label="Ouvrir les filtres"
        type="button"
      >
        ☰ Filtres
      </button>

      {/* Overlay mobile */}
      {isFilterOpen && (
        <div
          className="filters-backdrop"
          onClick={() => setIsFilterOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="catalogue-container">
        {/* Sidebar filtres (fixe desktop, off-canvas mobile) */}
        <aside className={`filter-panel ${isFilterOpen ? "open" : ""}`}>
          <div className="filters-header">
            <h3>Filtres</h3>
            <button
              className="filters-close"
              onClick={() => setIsFilterOpen(false)}
              aria-label="Fermer les filtres"
              type="button"
            >
              ✕
            </button>
          </div>

          <select name="marque" value={filtre.marque} onChange={handleFiltreChange}>
            <option value="">Toutes les marques</option>
            {marques.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="annee"
            placeholder="Année min"
            value={filtre.annee}
            onChange={handleFiltreChange}
          />

          <input
            type="number"
            name="prixMax"
            placeholder="Prix Max (€)"
            value={filtre.prixMax}
            onChange={handleFiltreChange}
          />

          <select name="boite" value={filtre.boite} onChange={handleFiltreChange}>
            <option value="">Toutes les boîtes</option>
            <option value="Automatique">Automatique</option>
            <option value="Manuelle">Manuelle</option>
            <option value="Séquentielle">Séquentielle</option>
          </select>

          <select name="carburant" value={filtre.carburant} onChange={handleFiltreChange}>
            <option value="">Tous les carburants</option>
            <option value="Diesel">Diesel</option>
            <option value="Essence">Essence</option>
            <option value="Hybride">Hybride</option>
            <option value="Electrique">Electrique</option>
            <option value="GPL">GPL</option>
            <option value="E85 (Ethanol)">E85 (Ethanol)</option>
          </select>
        </aside>

        {/* Liste (grille) */}
        <main className="vehicules-list">
          {filteredVehicules.length === 0 && (
            <div className="no-vehicules">Aucun véhicule ne correspond à votre recherche.</div>
          )}

          {filteredVehicules.map((v) => {
            let badge = null;
            let imgClass = "";
            let isVendu = v.statut === "Vendu";
            if (v.statut === "Sous offre") {
              badge = <span className="statut-badge statut-offre">Sous offre</span>;
              imgClass = "img-filter";
            } else if (isVendu) {
              badge = <span className="statut-badge statut-vendu">Vendu</span>;
              imgClass = "img-filter";
            }
            if (isVendu) {
              return (
                <div
                  key={v.id}
                  className="vehicule-card-home vehicule-card-vendu"
                  style={{ cursor: "not-allowed", textDecoration: "none", color: "inherit", pointerEvents: "none", opacity: 0.85 }}
                  aria-disabled="true"
                >
                  <div className="vehicule-card-home-img-wrapper">
                    <img
                      src={v.photo_url?.[0] || "https://via.placeholder.com/300x200"}
                      alt={`${v.marque} ${v.modele}`}
                      className={imgClass}
                    />
                    <span className="prix-badge">{v.prix_affiche?.toLocaleString()} €</span>
                    {badge}
                  </div>
                  <h4>{v.marque} {v.modele}</h4>
                  <p>{v.finition || v.motorisation || ""}</p>
                  <div className="vehicule-details">
                    <span className="vehicule-detail"><span className="vehicule-detail-emoji">📅</span>{String(v.annee).slice(0,4)}</span>
                    <span className="vehicule-detail"><span className="vehicule-detail-emoji">⛽️</span>{v.energie || v.carburant || ""}</span>
                    <span className="vehicule-detail"><span className="vehicule-detail-emoji">🛣️</span>{v.kilometrage?.toLocaleString()} km</span>
                    <span className="vehicule-detail"><span className="vehicule-detail-emoji">⚙️</span>{v.boite || v.boite_vitesse || ""}</span>
                  </div>
                </div>
              );
            }
            return (
              <div
                key={v.id}
                className="vehicule-card-home"
                style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}
                onClick={() => navigate(`/vehicules/${v.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigate(`/vehicules/${v.id}`);
                }}
              >
                <div className="vehicule-card-home-img-wrapper">
                  <img
                    src={v.photo_url?.[0] || "https://via.placeholder.com/300x200"}
                    alt={`${v.marque} ${v.modele}`}
                    className={imgClass}
                  />
                  <span className="prix-badge">{v.prix_affiche?.toLocaleString()} €</span>
                  {badge}
                </div>
                <h4>{v.marque} {v.modele}</h4>
                <p>{v.finition || v.motorisation || ""}</p>
                <div className="vehicule-details">
                  <span className="vehicule-detail"><span className="vehicule-detail-emoji">📅</span>{String(v.annee).slice(0,4)}</span>
                  <span className="vehicule-detail"><span className="vehicule-detail-emoji">⛽️</span>{v.energie || v.carburant || ""}</span>
                  <span className="vehicule-detail"><span className="vehicule-detail-emoji">🛣️</span>{v.kilometrage?.toLocaleString()} km</span>
                  <span className="vehicule-detail"><span className="vehicule-detail-emoji">⚙️</span>{v.boite || v.boite_vitesse || ""}</span>
                </div>
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}


