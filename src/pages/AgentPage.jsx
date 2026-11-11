import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../supabase";
import "./AgentPage.css";
import AgentHeaderCompact from "../components/AgentHeaderCompact";
import { MANDAT_CARD_SELECT } from "../utils/mandats";
import ArtworkCard from "../components/ArtworkCard";

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
        .select(MANDAT_CARD_SELECT)
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
      <h3 className="agent-vehicles-title section-title agent-vehicles-heading">
        Véhicules en mandat ({vehicules.length})
      </h3>

      {/* Grille véhicule identique à Home */}
      <div className="artwork-card-grid">
        {vehicules.length === 0 && (
          <div className="no-vehicles">Aucun véhicule pour cet agent.</div>
        )}
        {vehicules
          .filter((v) => v.statut !== "Mandat signé" && v.statut !== "Archivé")
          .map((v, index) => (
            <ArtworkCard
              key={v.id}
              vehicle={v}
              index={index}
              to={v.statut === "Vendu" ? undefined : `/vehicules/${v.id}`}
              disabled={v.statut === "Vendu"}
            />
          ))}
      </div>
      <div className="cta-container">
        <Link to="/equipe" className="btn-primary">
          ← Retour à l’équipe
        </Link>
      </div>
    </div>
  );
}

