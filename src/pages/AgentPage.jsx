import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../supabase";
import "./AgentPage.css";

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
      <div className="agent-hero-card">
        <img
          src={
            agent.photo_url ||
            "https://via.placeholder.com/160x160.png?text=No+Photo"
          }
          alt={agent.nom}
          className="agent-avatar"
        />
        <h2 className="agent-title">
          {agent.prenom} <span className="agent-nom">{agent.nom}</span>
        </h2>
        <div className="agent-secteur">{agent.secteur && <>Secteur : <b>{agent.secteur}</b></>}</div>
        <div className="agent-contact">
          <div>
            <b>📞</b> <a href={`tel:${agent.telephone}`} className="tel-link">{agent.telephone}</a>
          </div>
          {agent.email && (
            <div>
              <b>✉️</b> <a href={`mailto:${agent.email}`} className="mail-link">{agent.email}</a>
            </div>
          )}
        </div>
      </div>

      <h3 className="agent-vehicles-title">
        Véhicules en mandat ({vehicules.length})
      </h3>
      <div className="agent-vehicles-grid">
        {vehicules.length === 0 && (
          <div className="no-vehicles">Aucun véhicule pour cet agent.</div>
        )}
        {vehicules.map((v) => (
          <Link
            to={`/vehicle/${v.id}`}
            className="agent-vehicle-card"
            key={v.id}
          >
            <img
              src={
                v.photo_url?.[0] ||
                "https://via.placeholder.com/400x220?text=Photo"
              }
              alt={v.marque + " " + v.modele}
              className="vehicle-img"
            />
            <div className="agent-vehicle-info">
              <h4>
                <span className="veh-make">{v.marque}</span>{" "}
                <span className="veh-model">{v.modele}</span>
              </h4>
              <div className="veh-details">
                <span>{v.annee?.split("-")[0] || "Année inconnue"}</span>
                <span>• {v.kilometrage?.toLocaleString()} km</span>
              </div>
              <div className="veh-prix">
                {v.prix_affiche
                  ? v.prix_affiche.toLocaleString() + " €"
                  : "Prix —"}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="cta-container">
        <Link to="/equipe" className="btn-filled">
          ← Retour à l’équipe
        </Link>
      </div>
    </div>
  );
}

