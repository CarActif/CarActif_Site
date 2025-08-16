import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./Home.css";
import { Link } from "react-router-dom";

const supabase = createClient(
  "https://rhbnlcmsyqjbzykexttt.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoYm5sY21zeXFqYnp5a2V4dHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NDA5OTcsImV4cCI6MjA2NjAxNjk5N30.o24Li47McJpMVaa2sEjwR8oOa1mobsUqhdUUD2VwpT8"
);

export default function Home() {
  const [vehicules, setVehicules] = useState([]);
  const [heroUrl, setHeroUrl] = useState(""); // <- Ajouté pour l’URL dynamique

  useEffect(() => {
    // Fetch les véhicules récents
    const fetchVehicules = async () => {
      const { data } = await supabase.from("mandats").select("*").limit(10);
      setVehicules(data || []);
    };
    fetchVehicules();

    // Récupérer l’URL de la photo hero dans Supabase Storage
    // Correction : PAS DE DOUBLE SLASH ! 
    // Bucket = photo-profil, filename = photo-hero.jpg
    const path = "photo-hero.jpg";
    const { data } = supabase.storage.from("photo-profil").getPublicUrl(path);
    if (data?.publicUrl) setHeroUrl(data.publicUrl);
  }, []);

  return (
    <div className="home-wrapper">
      <div className="home">
        {/* Hero section avec background dynamique */}
        <div
          className="hero-section"
          style={
            heroUrl
              ? {
                  background: `
                    linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),
                    url('${heroUrl}') center/cover no-repeat
                  `
                }
              : {}
          }
        >
          <div className="hero-content">
            <h1>🚗 Bienvenue chez CarActif</h1>
            <p>
              Boostez la vente de votre voiture sans effort.
              Visibilité maximale, prix optimisé, vente sécurisée.
            </p>
          </div>
        </div>

        <section className="recent-vehicles-section">
          <h2 className="section-title">🆕 Nos arrivages récents</h2>
          <p className="section-subtitle">
            Découvrez les véhicules confiés à nos agents CarActif
          </p>

          <div className="vehicule-cards-container">
            {vehicules.slice(0, 3).map((v) => (
              <div key={v.id} className="vehicule-card-home">
                <img
                  src={v.photo_url?.[0] || "https://via.placeholder.com/300x200"}
                  alt={`${v.marque} ${v.modele}`}
                />
                <h4>
                  {v.marque} {v.modele}
                </h4>
                <p>
                  {v.annee} • {v.kilometrage?.toLocaleString()} km
                </p>
                <p className="prix">{v.prix_affiche?.toLocaleString()} €</p>
              </div>
            ))}
          </div>

          <div className="cta-container">
            <Link to="/vehicules" className="btn-filled">
              Voir tous nos véhicules
            </Link>
          </div>
        </section>

        <section className="features">
          <h2 className="section-title">💡 Pourquoi choisir CarActif ?</h2>
          <div className="feature">
            <span className="emoji">📢</span>
            <h3>Visibilité & Réseau</h3>
            <p>
              Annonce diffusée sur plus de 20 plateformes majeures —  
              Touchez 99% des acheteurs potentiels.
            </p>
          </div>

          <div className="feature">
            <span className="emoji">🔎</span>
            <h3>Valorisation professionnelle</h3>
            <p>
              Estimation et conseils par un expert local pour vendre au meilleur prix.
            </p>
          </div>

          <div className="feature">
            <span className="emoji">🤝</span>
            <h3>Accompagnement personnalisé</h3>
            <p>
              Votre agent dédié gère la vente de A à Z.  
              Vous n'avez rien à gérer, juste à encaisser.
            </p>
          </div>

          <div className="feature">
            <span className="emoji">🔒</span>
            <h3>Transaction sécurisée</h3>
            <p>
              Un paiement garanti avec des procédures professionnelles & certifiées.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

