import { useEffect, useState } from "react";
import supabase from "../supabase";
import "./Home.css";
import { Link } from "react-router-dom";
import usePageMeta from "../lib/usePageMeta";
import "./HomeExtra.css";
import Dashboard from "../components/Dashboard";
import { MANDAT_CARD_SELECT } from "../utils/mandats";

export default function Home() {
  usePageMeta(
    "Vendez votre voiture sans effort",
    "CarActif vend votre voiture entre particuliers : estimation à domicile, annonce, visites, paiement sécurisé par séquestre et garantie 3 mois incluse. Estimation gratuite et sans engagement."
  );
  const [vehicules, setVehicules] = useState([]);
  const [heroUrl, setHeroUrl] = useState(""); // <- Ajouté pour l’URL dynamique

  useEffect(() => {
    // Fetch les véhicules récents
    const fetchVehicules = async () => {
      const { data } = await supabase.from("mandats").select(MANDAT_CARD_SELECT).eq("statut", "Publié").order("date_ajout", { ascending: false }).limit(10);
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
        <div
          className="hero-section"
          style={
            heroUrl
              ? { background: `linear-gradient(rgba(11,37,69,0.62), rgba(11,37,69,0.62)), url('${heroUrl}') center/cover no-repeat` }
              : {}
          }
        >
          <div className="hero-content">
            <h1>Vendez votre voiture sans effort</h1>
            <p>Nous venons chez vous, nous nous occupons de tout, vous gardez votre voiture jusqu'à la vente.</p>
            <div className="hero-actions">
              <Link to="/estimation" className="hero-btn hero-btn--main">Estimer ma voiture</Link>
              <Link to="/comment-ca-marche" className="hero-btn hero-btn--ghost">Comment ça marche</Link>
            </div>
          </div>
        </div>

        <ul className="trust-bar">
          <li>Estimation gratuite, sans engagement</li>
          <li>Paiement sécurisé par séquestre</li>
          <li>Garantie 3 mois incluse</li>
        </ul>

        <section className="simple-section">
          <h2 className="simple-title">Nos véhicules en vente</h2>
          <div className="mx-auto mt-8 max-w-7xl">
            <Dashboard vehicules={vehicules} limit={4} />
          </div>
          <div className="mt-8 text-center">
            <Link to="/vehicules" className="btn-primary px-8 py-3 text-sm no-underline">Voir tous nos véhicules</Link>
          </div>
        </section>

        <section className="simple-section simple-section--tint">
          <h2 className="simple-title">Comment ça marche</h2>
          <ol className="steps-row">
            <li><span className="step-num">1</span><strong>Estimation chez vous</strong><span>Un expert estime votre voiture, sans engagement.</span></li>
            <li><span className="step-num">2</span><strong>Annonce et visites</strong><span>Nous gérons photos, appels et visites.</span></li>
            <li><span className="step-num">3</span><strong>Vente sécurisée</strong><span>Le paiement est bloqué sur séquestre avant la remise des clés.</span></li>
          </ol>
        </section>

        <section className="simple-section">
          <h2 className="simple-title">Nos partenaires</h2>
          <ul className="partners-row">
            <li><strong>CashSentinel</strong><span>Paiement sécurisé par séquestre</span></li>
            <li><strong>Opteven</strong><span>Garantie mécanique 3 mois</span></li>
            <li><strong>Dropbox Sign</strong><span>Signature électronique du mandat</span></li>
          </ul>
        </section>

        <section className="final-cta">
          <h2>Prêt à vendre ?</h2>
          <p>Estimation gratuite et sans engagement.</p>
          <Link to="/estimation" className="hero-btn hero-btn--main">Estimer ma voiture</Link>
          <p className="final-links"><Link to="/faq">Questions fréquentes</Link> · <Link to="/garantie">Garantie incluse</Link></p>
        </section>
      </div>
    </div>
  );
}
