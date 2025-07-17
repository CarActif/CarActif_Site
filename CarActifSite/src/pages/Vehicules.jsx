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

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicules = async () => {
      const { data } = await supabase.from("mandats").select("*");
      setVehicules(data);
      const uniqueMarques = [...new Set(data.map((v) => v.marque))];
      setMarques(uniqueMarques);
    };
    fetchVehicules();
  }, []);

  const handleFiltreChange = (e) => {
    const { name, value } = e.target;
    setFiltre((prev) => ({ ...prev, [name]: value }));
  };

  const filteredVehicules = vehicules.filter((v) => {
    return (
      (filtre.marque === "" || v.marque === filtre.marque) &&
      (filtre.annee === "" || new Date(v.annee).getFullYear() >= parseInt(filtre.annee)) &&
      (filtre.prixMax === "" || v.prix_affiche <= parseInt(filtre.prixMax)) &&
      (filtre.boite === "" || v.boite_vitesse === filtre.boite) &&
      (filtre.carburant === "" || v.energie === filtre.carburant)
    );
  });

  return (
    <div className="vehicules-wrapper">
      <div className="catalogue-container">
        <div className="filter-panel">
          <h3>Filtres</h3>
          <select name="marque" onChange={handleFiltreChange}>
            <option value="">Toutes les marques</option>
            {marques.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input type="number" name="annee" placeholder="Année min" onChange={handleFiltreChange} />
          <input type="number" name="prixMax" placeholder="Prix Max (€)" onChange={handleFiltreChange} />
          <select name="boite" onChange={handleFiltreChange}>
            <option value="">Toutes les boîtes</option>
            <option value="Automatique">Automatique</option>
            <option value="Manuelle">Manuelle</option>
          </select>
          <select name="carburant" onChange={handleFiltreChange}>
            <option value="">Tous les carburants</option>
            <option value="Diesel">Diesel</option>
            <option value="Essence">Essence</option>
            <option value="Hybride">Hybride</option>
            <option value="Electrique">Electrique</option>
          </select>
        </div>

        <div className="vehicules-list">
          {filteredVehicules.map((v) => (
            <div key={v.id} className="vehicule-card" onClick={() => navigate(`/vehicle/${v.id}`)}>
              <img src={v.photo_url?.[0] || "https://via.placeholder.com/300x200"} alt={v.modele} />
              <h4>{v.marque} {v.modele}</h4>
              <p>Année : {v.annee ? new Date(v.annee).getFullYear() : "NC"}</p>
              <p>Kilométrage : {v.kilometrage || "NC"} km</p>
              <p>Carburant : {v.energie || "NC"}</p>
              <p>Boîte : {v.boite || "NC"}</p>
              <p className="prix">{v.prix_affiche?.toLocaleString('fr-FR')} €</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
