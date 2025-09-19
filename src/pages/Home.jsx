import "../components/AgentHeaderCompact.css";
import "../components/Footer.css";
import "../styles/chipSection.css";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./Home.css";
import { Link } from "react-router-dom";
import ComparatifCamembert from "../components/ComparatifCamembert";

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
            {vehicules
              .filter(v => v.statut !== "Mandat signé" && v.statut !== "Archivé")
              .slice(0, 4)
              .map((v) => {
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
                  <Link
                    key={v.id}
                    to={`/vehicules/${v.id}`}
                    className="vehicule-card-home"
                    style={{ textDecoration: "none", color: "inherit" }}
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
                      <span className="vehicule-detail"><span className="vehicule-detail-emoji">⚙️</span>{v.boite || ""}</span>
                    </div>
                  </Link>
                );
              })}
          </div>
          <div className="cta-container">
            <Link to="/vehicules" className="btn-filled">
              Voir tous nos véhicules
            </Link>
          </div>
        </section>
        {/* Bloc 1 — Pourquoi CarActif ? */}
        <section style={{textAlign:'center',margin:'2.5rem auto 0 auto',maxWidth:'1200px',padding:'0'}}>
          <div style={{maxWidth:'500px',margin:'0 auto',padding:'0'}}>
            <div className="chip-header" role="heading" aria-level="2">
              <span className="chip-title">Pourquoi <span className="chip-bold">CarActif</span></span>
              <span className="chip-badge">Fiabilité</span>
            </div>
            <div className="section-subtitle">On vient à vous, vous gardez votre voiture.</div>
          </div>
          <div className="info-cards-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'28px',maxWidth:'1200px',margin:'32px auto 0 auto',justifyItems:'center',alignItems:'stretch'}}>
            {/* Carte 1 */}
            <div className="info-card">
              <div className="info-card-icon">🔎🚗</div>
              <div className="info-card-title"><strong>Estimation sur place, par un pro</strong></div>
              <div className="info-card-text">Un expert CarActif se déplace chez vous et estime votre véhicule en conditions réelles, au plus juste.</div>
            </div>
            {/* Carte 2 */}
            <div className="info-card">
              <div className="info-card-icon">✅</div>
              <div className="info-card-title"><strong>Sans engagement</strong></div>
              <div className="info-card-text">Avancez à votre rythme : vous décidez si et quand vous poursuivez, sans pression.</div>
            </div>
            {/* Carte 3 */}
            <div className="info-card">
              <div className="info-card-icon">🧰</div>
              <div className="info-card-title"><strong>Clés en main</strong></div>
              <div className="info-card-text">Photos, annonce, appels, visites, démarches : on s’occupe de tout pendant que vous continuez à rouler.</div>
            </div>
            {/* Carte 4 */}
            <div className="info-card">
              <div className="info-card-icon">🧾</div>
              <div className="info-card-title"><strong>Transparence totale</strong></div>
              <div className="info-card-text">Aucun frais caché : vous savez dès le départ combien vous toucherez.</div>
            </div>
            {/* Carte 5 */}
            <div className="info-card">
              <div className="info-card-icon">🤝</div>
              <div className="info-card-title"><strong>Partenaire de confiance</strong></div>
              <div className="info-card-text">Conseils honnêtes, suivi régulier et points d’étape jusqu’au virement final.</div>
            </div>
          </div>
          {/* Encart différenciant */}
          <div className="callout" style={{width:'100%',background:'#f7f7fa',padding:'1.5em 1em',margin:'2em auto 0 auto',borderRadius:'12px',fontSize:'1.05em',maxWidth:'900px'}}>
            <strong>💡 Pas un dépôt-vente</strong><br />
            CarActif n’est pas un dépôt-vente : nous venons chez vous et vous gardez votre véhicule tant qu’il est en vente.
          </div>
        </section>

        {/* Bloc 2 — Nos engagements */}
        <section style={{textAlign:'center',margin:'2.5rem auto 0 auto',maxWidth:'1200px',padding:'0'}}>
          <div style={{maxWidth:'500px',margin:'0 auto',padding:'0'}}>
            <div className="chip-header" role="heading" aria-level="2">
              <span className="chip-title"><span className="chip-bold">Nos engagements</span></span>
            </div>
            <div className="section-subtitle">Qualité, sécurité et équité à chaque étape.</div>
          </div>
          <div className="info-cards-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'28px',maxWidth:'1200px',margin:'32px auto 0 auto',justifyItems:'center',alignItems:'stretch'}}>
            {/* Carte 1 */}
            <div className="info-card">
              <div className="info-card-icon">🔧</div>
              <div className="info-card-title"><strong>Voitures contrôlées</strong></div>
              <div className="info-card-text">Contrôle rigoureux et dossier clair : des annonces fiables et des acheteurs rassurés.</div>
            </div>
            {/* Carte 2 */}
            <div className="info-card">
              <div className="info-card-icon">🏦</div>
              <div className="info-card-title"><strong>Sécurisation façon notaire</strong></div>
              <div className="info-card-text">Fonds bloqués sur compte séquestre ; une fois sécurisés, on finalise la vente et la remise du véhicule.</div>
              <div className="mini-frise" style={{fontSize:'0.95em',marginTop:'0.5em',opacity:0.8}}>
                <div className="frise-paiement" style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'1.5em',fontWeight:'500',fontSize:'1em'}}>
                  <span style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                    <span style={{fontSize:'1.2em'}}>💶</span>
                    <span>Séquestre</span>
                  </span>
                  <span style={{fontSize:'1.3em',color:'#00c800'}}>→</span>
                  <span style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                    <span style={{fontSize:'1.2em'}}>✅</span>
                    <span>Confirmation</span>
                  </span>
                  <span style={{fontSize:'1.3em',color:'#00c800'}}>→</span>
                  <span style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                    <span style={{fontSize:'1.2em'}}>🚗</span>
                    <span>Remise du véhicule</span>
                  </span>
                </div>
              </div>
            </div>
            {/* Carte 3 */}
            <div className="info-card">
              <div className="info-card-icon">⚖️</div>
              <div className="info-card-title"><strong>Prix juste pour tous</strong></div>
              <div className="info-card-text">Un accord gagnant : vendeur, acheteur et CarActif. Honoraires maîtrisés ~ 4 % du prix de vente.</div>
            </div>
            {/* Carte 4 */}
            <div className="info-card">
              <div className="info-card-icon">🚘</div>
              <div className="info-card-title"><strong>Toutes marques</strong></div>
              <div className="info-card-text">Citadine, familiale, sportive ou utilitaire : nous adaptons l’accompagnement à votre modèle.</div>
            </div>
          </div>
        </section>

        {/* Bloc 3 — Résultats & chiffres */}
        <section style={{textAlign:'center',margin:'2.5rem auto 0 auto',maxWidth:'1200px',padding:'0'}}>
          <div style={{maxWidth:'500px',margin:'0 auto',padding:'0'}}>
            <div className="chip-header" role="heading" aria-level="2">
              <span className="chip-title">Résultats <span className="chip-bold">& chiffres</span></span>
              <span className="chip-badge">Chiffres</span>
            </div>
            <div className="section-subtitle">Des ventes rapides, un prix juste, une sécurité totale.</div>
          </div>
          <div className="info-cards-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'28px',maxWidth:'900px',margin:'32px auto 0 auto',justifyItems:'center',alignItems:'stretch'}}>
            {/* Carte 1 */}
            <div className="info-card">
              <div className="info-card-icon">⏱️</div>
              <div className="info-card-title"><strong>Délai moyen de vente</strong></div>
              <div className="info-card-text">Ventes conclues en moyenne sous 15 jours*, selon le modèle et la demande locale.</div>
            </div>
            {/* Carte 2 */}
            <div className="info-card">
              <div className="info-card-icon">⚖️</div>
              <div className="info-card-title"><strong>Prix juste pour tous</strong></div>
              <div className="info-card-text">Objectif d’équilibre : le vendeur, l’acheteur et CarActif sortent gagnants.</div>
            </div>
          </div>
          {/* Encart comparatif */}
          <div className="callout" style={{width:'100%',background:'#f7f7fa',padding:'1.5em 1em',margin:'2em auto 0 auto',borderRadius:'12px',fontSize:'1.05em',maxWidth:'900px'}}>
            <strong>📊 Vendre avec CarActif vs Reprise immédiate</strong><br />
            Reprise immédiate en garage : décote forte (souvent –20 à –30 % vs prix de marché), paiement instantané mais marge pro élevée.<br />
            CarActif (intermédiaire) : vente au prix de marché, accompagnement complet, honoraires ~ 4 %.
            <br />
            <ComparatifCamembert />
          </div>
          {/* Notes en pied */}
          <div style={{textAlign:'left',maxWidth:'900px',margin:'1.5em auto 0 auto',fontSize:'0.95em',opacity:0.8}}>
            <small>* Moyenne interne calculée sur les 6/12 derniers mois. Variable selon le véhicule et la saisonnalité.</small><br />
            <small>* Références : études/FAQ de réseaux et marketplaces auto indiquant la décote moyenne des reprises (≈ –20 à –30 %) et les commissions d’intermédiaires.</small>
          </div>
        </section>
      </div>
    </div>
  );
}

