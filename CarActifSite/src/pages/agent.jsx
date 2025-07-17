// src/pages/Agent.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../supabase";

export default function Agent() {
  const { id } = useParams(); // agent_id dans l'URL
  const [agent, setAgent] = useState(null);
  const [vehicules, setVehicules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: agentData } = await supabase
        .from("agents")
        .select("*")
        .eq("id", id)
        .single();

      const { data: vehiculesData } = await supabase
        .from("mandats")
        .select("*")
        .eq("agent_id", id);

      setAgent(agentData);
      setVehicules(vehiculesData);
    };

    fetchData();
  }, [id]);

  if (!agent) return <p>Chargement...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{agent.prenom} {agent.nom}</h2>
      <p><strong>Téléphone :</strong> {agent.telephone}</p>
      <p><strong>Secteur :</strong> {agent.secteur}</p>
      <img src={agent.photo_url} alt={agent.nom} width="200" />

      <h3 style={{ marginTop: "2rem" }}>Véhicules en mandat :</h3>
      <ul>
        {vehicules.map((v) => (
          <li key={v.id}>
            {v.marque} {v.modele} {v.finition} ({v.annee?.split("-")[0]})
          </li>
        ))}
      </ul>
    </div>
  );
}

