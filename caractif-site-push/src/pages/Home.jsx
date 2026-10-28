import "../components/AgentHeaderCompact.css";
import "../components/Footer.css";
import "../styles/chipSection.css";
import { useEffect, useState } from "react";
import supabase from "../supabase";
import "./Home.css";
import { Link } from "react-router-dom";
import ComparatifCamembert from "../components/ComparatifCamembert";
import Dashboard from "../components/Dashboard";
import { MANDAT_CARD_SELECT } from "../utils/mandats";

export default function Home() {
  const [vehicules, setVehicules] = useState([]);
  const [heroUrl, setHeroUrl] = useState(""); // <- Ajouté pour l’URL dynamique

  useEffect(() => {
    // Fetch les véhicules récents
    const fetchVehicules = async () => {
      const { data } = await supabase.from("mandats").select(MANDAT_CARD_SELECT).limit(10);
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

        <section className="recent-vehicles-section px-5 py-12 md:px-8">
          <h2 className="section-title text-center text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Nos arrivages récents
          </h2>
          <p className="section-subtitle mx-auto mt-3 max-w-xl text-center text-base font-normal text-slate-500">
            Découvrez les véhicules confiés à nos agents CarActif
          </p>
          <div className="mx-auto mt-10 max-w-7xl">
            <Dashboard vehicules={vehicules} limit={4} />
          </div>
          <div className="cta-container mt-10 text-center">
            <Link
              to="/vehicules"
              className="btn-primary px-8 py-3 text-sm no-underline"
            >
              Voir tous nos véhicules
            </Link>
          </div>
        </section>
        {/* Bloc 1 — Pourquoi CarActif ? */}
        <section className="home-section">
          <div className="home-section-header">
            <div className="chip-header" role="heading" aria-level="2">
              <span className="chip-title">Pourquoi <span className="chip-bold">CarActif</span></span>
            </div>
            <div className="section-subtitle">On vient à vous, vous gardez votre voiture.</div>
          </div>
          <div className="info-cards-grid">
            <div className="info-card glass-card">
              <div className="info-card-icon">🔎🚗</div>
              <div className="info-card-title"><strong>Estimation sur place, par un pro</strong></div>
              <div className="info-card-text">Un expert CarActif se déplace chez vous et estime votre véhicule en conditions réelles, au plus juste.</div>
            </div>
            {/* Carte 2 */}
            <div className="info-card glass-card">
              <div className="info-card-icon">✅</div>
              <div className="info-card-title"><strong>Sans engagement</strong></div>
              <div className="info-card-text">Avancez à votre rythme : vous décidez si et quand vous poursuivez, sans pression.</div>
            </div>
            {/* Carte 3 */}
            <div className="info-card glass-card">
              <div className="info-card-icon">🧰</div>
              <div className="info-card-title"><strong>Clés en main</strong></div>
              <div className="info-card-text">Photos, annonce, appels, visites, démarches : on s’occupe de tout pendant que vous continuez à rouler.</div>
            </div>
            {/* Carte 4 */}
            <div className="info-card glass-card">
              <div className="info-card-icon">🧾</div>
              <div className="info-card-title"><strong>Transparence totale</strong></div>
              <div className="info-card-text">Aucun frais caché : vous savez dès le départ combien vous toucherez.</div>
            </div>
            {/* Carte 5 */}
            <div className="info-card glass-card">
              <div className="info-card-icon">🤝</div>
              <div className="info-card-title"><strong>Partenaire de confiance</strong></div>
              <div className="info-card-text">Conseils honnêtes, suivi régulier et points d’étape jusqu’au virement final.</div>
            </div>
          </div>
          {/* Encart différenciant */}
          <div className="callout glass-card">
            <strong>💡 Pas un dépôt-vente</strong><br />
            CarActif n’est pas un dépôt-vente : nous venons chez vous et vous gardez votre véhicule tant qu’il est en vente.
          </div>
        </section>

        {/* Bloc 2 — Nos engagements */}
        <section className="home-section">
          <div className="home-section-header">
            <div className="chip-header" role="heading" aria-level="2">
              <span className="chip-title"><span className="chip-bold">Nos engagements</span></span>
            </div>
            <div className="section-subtitle">Qualité, sécurité et équité à chaque étape.</div>
          </div>
          <div className="info-cards-grid">
            {/* Carte 1 */}
            <div className="info-card glass-card">
              <div className="info-card-icon">🔧</div>
              <div className="info-card-title"><strong>Voitures contrôlées</strong></div>
              <div className="info-card-text">Contrôle rigoureux et dossier clair : des annonces fiables et des acheteurs rassurés.</div>
            </div>
            {/* Carte 2 */}
            <div className="info-card glass-card">
              <div className="info-card-icon">🏦</div>
              <div className="info-card-title"><strong>Sécurisation façon notaire</strong></div>
              <div className="info-card-text">Fonds bloqués sur compte séquestre ; une fois sécurisés, on finalise la vente et la remise du véhicule.</div>
              <div className="mini-frise">
                <div className="frise-paiement">
                  <span className="frise-step">
                    <span className="frise-emoji">💶</span>
                    <span>Séquestre</span>
                  </span>
                  <span className="frise-arrow">→</span>
                  <span className="frise-step">
                    <span className="frise-emoji">✅</span>
                    <span>Confirmation</span>
                  </span>
                  <span className="frise-arrow">→</span>
                  <span className="frise-step">
                    <span className="frise-emoji">🚗</span>
                    <span>Remise du véhicule</span>
                  </span>
                </div>
              </div>
            </div>
            {/* Carte 3 */}
            <div className="info-card glass-card">
              <div className="info-card-icon">⚖️</div>
              <div className="info-card-title"><strong>Prix juste pour tous</strong></div>
              <div className="info-card-text">Un accord gagnant : vendeur, acheteur et CarActif. Honoraires maîtrisés ~ 4 % du prix de vente.</div>
            </div>
            {/* Carte 4 */}
            <div className="info-card glass-card">
              <div className="info-card-icon">🚘</div>
              <div className="info-card-title"><strong>Toutes marques</strong></div>
              <div className="info-card-text">Citadine, familiale, sportive ou utilitaire : nous adaptons l’accompagnement à votre modèle.</div>
            </div>
          </div>
        </section>

        {/* Bloc 3 — Résultats & chiffres */}
        <section className="home-section">
          <div className="home-section-header">
            <div className="chip-header" role="heading" aria-level="2">
              <span className="chip-title">Résultats <span className="chip-bold">& chiffres</span></span>
            </div>
            <div className="section-subtitle">Des ventes rapides, un prix juste, une sécurité totale.</div>
          </div>
          <div className="info-cards-grid info-cards-grid--narrow">
            {/* Carte 1 */}
            <div className="info-card glass-card">
              <div className="info-card-icon">⏱️</div>
              <div className="info-card-title"><strong>Délai moyen de vente</strong></div>
              <div className="info-card-text">Ventes conclues en moyenne sous 15 jours*, selon le modèle et la demande locale.</div>
            </div>
            {/* Carte 2 */}
            <div className="info-card glass-card">
              <div className="info-card-icon">⚖️</div>
              <div className="info-card-title"><strong>Prix juste pour tous</strong></div>
              <div className="info-card-text">Objectif d’équilibre : le vendeur, l’acheteur et CarActif sortent gagnants.</div>
            </div>
          </div>
          {/* Encart comparatif */}
          <div className="callout glass-card">
            <strong>📊 Vendre avec CarActif vs Reprise immédiate</strong><br />
            Reprise immédiate en garage : décote forte (souvent –20 à –30 % vs prix de marché), paiement instantané mais marge pro élevée.<br />
            CarActif (intermédiaire) : vente au prix de marché, accompagnement complet, honoraires ~ 4 %.
            <br />
            <ComparatifCamembert />
          </div>
          <div className="home-footnotes">
            <small>* Moyenne interne calculée sur les 6/12 derniers mois. Variable selon le véhicule et la saisonnalité.</small><br />
            <small>* Références : études/FAQ de réseaux et marketplaces auto indiquant la décote moyenne des reprises (≈ –20 à –30 %) et les commissions d’intermédiaires.</small>
          </div>
        </section>
      </div>
    </div>
  );
}

