import { useEffect, useState } from "react";
import { Link } from "react-router-dom";  // ✅ React Router Link
import "./Equipe.css";

export default function Equipe() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetch("https://rhbnlcmsyqjbzykexttt.supabase.co/rest/v1/agents", {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoYm5sY21zeXFqYnp5a2V4dHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NDA5OTcsImV4cCI6MjA2NjAxNjk5N30.o24Li47McJpMVaa2sEjwR8oOa1mobsUqhdUUD2VwpT8",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoYm5sY21zeXFqYnp5a2V4dHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NDA5OTcsImV4cCI6MjA2NjAxNjk5N30.o24Li47McJpMVaa2sEjwR8oOa1mobsUqhdUUD2VwpT8",
      },
    })
      .then((res) => res.json())
      .then((data) => setAgents(data));
  }, []);

  return (
    <div className="page-wrapper">
      <div className="equipe-container">
        <h2>Notre équipe administrative</h2>

        <div className="equipe-top">
          <div className="equipe-member">
            <img src="/siege/Charles.jpg" alt="Charles" className="founder-photo" />
            <h3>Charles</h3>
            <p>Fondateur & CEO</p>
          </div>
          <div className="equipe-member">
            <img src="/siege/Willy.jpg" alt="Willy" className="founder-photo" />
            <h3>Willy</h3>
            <p>Responsable Développement Marketing</p>
          </div>
          <div className="equipe-member">
            <img src="/siege/Marie-Lou.jpg" alt="Marie-Lou" className="founder-photo" />
            <h3>Marie-Lou</h3>
            <p>Responsable de Gestion</p>
          </div>
        </div>

        <h2>Nos agents</h2>

        <div className="agents-grid">
          {agents.map((agent) => (
            <div key={agent.id} className="agent-card">
              <img src={agent.photo_url} alt={`${agent.prenom} ${agent.nom}`} className="agent-photo" />
              <h3>{agent.prenom} {agent.nom.toUpperCase()}</h3>
              <p>{agent.secteur}</p>
              <a href={`tel:${agent.telephone}`} className="btn-outline">📞 {agent.telephone}</a>
              <Link to={`/agent/${agent.id}`} className="btn-filled">Voir la page de l'agent</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
