

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase";
import "./Equipe.css";
import debounce from "lodash.debounce";
import AdminRow from "../components/AdminRow";



function normalize(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function Equipe() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAgents, setFilteredAgents] = useState([]);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchAgents = async () => {
      const { data, error } = await supabase.from("agents").select();
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setAgents(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    fetchAgents();
  }, []);

  // Filtrage performant, insensible à la casse/accents
  const filterAgents = debounce((query, agentsList) => {
    const normQuery = normalize(query.trim());
    if (!normQuery) {
      setFilteredAgents(agentsList);
      return;
    }
    setFilteredAgents(
      agentsList.filter((agent) => {
        const nomComplet = `${agent.prenom || ""} ${agent.nom || ""}`;
        const secteur = agent.secteur || "";
        return (
          normalize(nomComplet).includes(normQuery) ||
          normalize(secteur).includes(normQuery)
        );
      })
    );
  }, 250);

  useEffect(() => {
    filterAgents(searchQuery, agents);
    // Annule le debounce si le composant démonte
    return () => filterAgents.cancel();
  }, [searchQuery, agents]);

  return (
    <div className="equipe-page-wrapper">

      <h2 className="equipe-title equipe-title-centered">L’équipe administrative</h2>
      <div className="admin-rows-container">
        <AdminRow avatarSrc="/siege/Charles.jpg" nom="Charles" role="Fondateur & CEO" />
        <AdminRow avatarSrc="/siege/Willy.jpg" nom="Willy" role="Responsable Développement Marketing" />
        <AdminRow avatarSrc="/siege/Marie-Lou.jpg" nom="Marie-Lou" role="Responsable de Gestion" />
      </div>

      <h2 className="equipe-title equipe-title-centered">Nos agents</h2>
      <div className="equipe-search-wrapper">
        <label htmlFor="agent-search" className="visually-hidden">
          Rechercher un agent par nom ou secteur
        </label>
        <input
          id="agent-search"
          ref={searchInputRef}
          type="text"
          className="equipe-search-input"
          placeholder="Rechercher par nom ou par secteur…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Rechercher par nom ou secteur"
          aria-describedby="agent-search-desc"
        />
        <span id="agent-search-desc" className="visually-hidden">
          Filtre en temps réel sur le nom, prénom ou secteur d’un agent.
        </span>
      </div>
      {loading && <div className="agents-loading">Chargement des agents...</div>}
      {error && <div className="agents-error">{error}</div>}
      {!loading && !error && (
        <div className="equipe-cards-container">
          {Array.isArray(filteredAgents) && filteredAgents.length > 0 ? (
            filteredAgents.map((agent) => (
              <div
                key={agent.id}
                className="equipe-card"
                tabIndex={0}
                role="button"
                aria-label={`Voir le profil de ${agent.prenom || ''} ${agent.nom || ''}`}
                onClick={() => navigate(`/agent/${agent.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigate(`/agent/${agent.id}`);
                }}
              >
                <img
                  src={agent.photo_url && agent.photo_url !== '' ? agent.photo_url : "https://via.placeholder.com/85x85?text=Photo"}
                  alt={`${agent.prenom || ''} ${agent.nom || ''}`}
                  className="equipe-avatar"
                />
                <h3 className="equipe-name">{agent.prenom || ''} {agent.nom ? agent.nom.toUpperCase() : ''}</h3>
                <div className="equipe-role">{agent.secteur || 'Secteur inconnu'}</div>
                <div className="equipe-contact">
                  <span className="equipe-phone">📞 {agent.telephone || 'Non renseigné'}</span>
                  <span className="equipe-email">✉️ {agent.email || 'Non renseigné'}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="equipe-empty">Aucun résultat</div>
          )}
        </div>
      )}
    </div>
  );
}


