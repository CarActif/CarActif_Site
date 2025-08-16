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

  const filteredVehicules = vehicules.filter((v) => {
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

          {filteredVehicules.map((v) => (
            <div
              key={v.id}
              className="vehicule-card"
              onClick={() => navigate(`/vehicle/${v.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate(`/vehicle/${v.id}`);
              }}
            >
              <img
                src={
                  (Array.isArray(v.photo_url) && v.photo_url[0]) ||
                  "https://via.placeholder.com/300x200"
                }
                alt={`${v.marque || ""} ${v.modele || ""}`.trim() || "Véhicule"}
                loading="lazy"
              />
              <h4 className="vehicule-title">
                {v.marque} {v.modele}
              </h4>
              <p className="vehicule-annee">
                Année <b>{v.annee ? new Date(v.annee).getFullYear() : "NC"}</b>
              </p>
              <p className="vehicule-km">
                Kilométrage{" "}
                <b>
                  {v.kilometrage ? Number(v.kilometrage).toLocaleString("fr-FR") : "NC"} km
                </b>
              </p>
              <p className="vehicule-energy">
                Carburant <b>{v.energie || "NC"}</b>
              </p>
              <p className="vehicule-boite">
                Boîte <b>{v.boite_vitesse || "NC"}</b>
              </p>
              <p className="vehicule-prix">
                {(v.prix_affiche ?? 0).toLocaleString("fr-FR")}{" "}
                <span className="vehicule-euro">€</span>
              </p>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}


