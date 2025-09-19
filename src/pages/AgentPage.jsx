import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../supabase";
import "./AgentPage.css";
import AgentHeaderCompact from "../components/AgentHeaderCompact";

export default function AgentPage() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [vehicules, setVehicules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: agentData } = await supabase
        .from("agents")
        .select("*")
        .eq("id", id)
        .single();

      const { data: vehiculesData } = await supabase
        .from("mandats")
        .select("*")
        .eq("agent_id", id)
        .order("date_ajout", { ascending: false });

      setAgent(agentData);
      setVehicules(vehiculesData);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="agentpage-loading">Chargement…</div>;
  }

  if (!agent) {
    return <div className="agentpage-loading">Agent introuvable.</div>;
  }

  return (
    <div className="agentpage-wrapper">
      {/* Header compact centré - marge réduite */}
      <div style={{ margin: "0.7rem auto 0.7rem auto", maxWidth: "700px" }}>
        <AgentHeaderCompact
          avatarSrc={agent.photo_url}
          fullName={`${agent.prenom} ${agent.nom}`}
          secteur={agent.secteur}
          phone={agent.telephone}
          email={agent.email}
        />
      </div>

      {/* Titre centré, style cohérent */}
      <h3 className="agent-vehicles-title section-title" style={{ textAlign: "center", margin: "2.5rem 0 2rem 0" }}>
        Véhicules en mandat ({vehicules.length})
      </h3>

      {/* Grille véhicule identique à Home */}
      <div className="vehicule-cards-container">
        {vehicules.length === 0 && (
          <div className="no-vehicles">Aucun véhicule pour cet agent.</div>
        )}
        {vehicules
          .filter(v => v.statut !== "Mandat signé" && v.statut !== "Archivé")
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
                  <div className="vehicule-type-line">
                    <span>
                      {[v.motorisation, v.version, v.finition, v.puissance].filter(Boolean).join(' ')}
                    </span>
                  </div>
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
                <div className="vehicule-type-line">
                  <span>
                    {[v.motorisation, v.version, v.finition, v.puissance].filter(Boolean).join(' ')}
                  </span>
                </div>
                <div className="vehicule-details">
                  <span className="vehicule-detail"><span className="vehicule-detail-emoji">📅</span>{String(v.annee).slice(0,4)}</span>
                  <span className="vehicule-detail"><span className="vehicule-detail-emoji">⛽️</span>{v.energie || v.carburant || ""}</span>
                  <span className="vehicule-detail"><span className="vehicule-detail-emoji">🛣️</span>{v.kilometrage?.toLocaleString()} km</span>
                  <span className="vehicule-detail"><span className="vehicule-detail-emoji">⚙️</span>{v.boite || v.boite_vitesse || ""}</span>
                </div>
              </Link>
            );
          })}
      </div>
      <div className="cta-container">
        <Link to="/equipe" className="btn-filled">
          ← Retour à l’équipe
        </Link>
      </div>
    </div>
  );
}

