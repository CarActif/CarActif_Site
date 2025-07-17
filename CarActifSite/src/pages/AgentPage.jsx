import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./AgentPage.css";

const supabase = createClient(
  "https://rhbnlcmsyqjbzykexttt.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoYm5sY21zeXFqYnp5a2V4dHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NDA5OTcsImV4cCI6MjA2NjAxNjk5N30.o24Li47McJpMVaa2sEjwR8oOa1mobsUqhdUUD2VwpT8"
);

export default function AgentPage() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [mandats, setMandats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: agentData } = await supabase
        .from("agents")
        .select("*")
        .eq("id", id)
        .single();
      setAgent(agentData);

      const { data: mandatsData } = await supabase
        .from("mandats")
        .select("*")
        .eq("user_id", id);

      setMandats(mandatsData);
    };

    fetchData();
  }, [id]);

  if (!agent) return <p style={{ textAlign: "center" }}>Chargement...</p>;

  return (
    <div className="page-wrapper">
      <div className="agent-info-card">
        <img src={agent.photo_url} alt={agent.nom} className="agent-photo" />
        <h2>{agent.prenom} <strong>{agent.nom.toUpperCase()}</strong></h2>
        <p>📍 <strong>{agent.secteur}</strong></p>
        <p>📞 {agent.telephone}</p>
        <p>📧 {agent.email}</p>
      </div>

      <h2 className="agent-vehicles-title">Mon parc automobile :</h2>

      <div className="agent-vehicles-grid">
        {mandats.map((m) => (
          <Link to={`/vehicle/${m.id}`} key={m.id} className="vehicle-card">
            <img src={m.photo_url?.[0] || "https://via.placeholder.com/300x200"} alt={m.modele} />
            <div className="vehicle-card-content">
              <h4>{m.marque} {m.modele}</h4>
              <p>Année : {m.annee ? new Date(m.annee).getFullYear() : "NC"}</p>
              <p>Kilométrage : {m.kilometrage?.toLocaleString()} km</p>
              <p>Carburant : {m.energie}</p>
              <p>Boîte : {m.boite}</p>
              <p className="prix">{m.prix_affiche?.toLocaleString()} €</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

