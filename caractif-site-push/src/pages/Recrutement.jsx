import { useEffect, useState } from "react";
import supabase from "../supabase";
import CandidatureForm from "../components/CandidatureForm";
import "./Recrutement.css";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function PosteCard({ poste }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="poste-card glass-card">
      <div className="poste-card-header">
        <div>
          <h2>{poste.titre}</h2>
          <p className="poste-card-meta">
            {poste.type_contrat} · {poste.lieu} · Publié le {formatDate(poste.created_at)}
          </p>
        </div>
        <button type="button" className="btn-primary" onClick={() => setOpen((o) => !o)}>
          {open ? "Fermer" : "Postuler"}
        </button>
      </div>
      <p className="poste-card-description">{poste.description}</p>
      {open && (
        <div className="poste-card-form">
          <CandidatureForm posteId={poste.id} />
        </div>
      )}
    </div>
  );
}

export default function Recrutement() {
  const [postes, setPostes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spontaneeOpen, setSpontaneeOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("postes")
        .select("id, titre, description, type_contrat, lieu, created_at")
        .eq("statut", "ouvert")
        .order("created_at", { ascending: false });
      setPostes(data || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="recrutement-page">
      <section className="recrutement-hero">
        <h1>Rejoindre CarActif</h1>
        <p className="recrutement-intro">
          Découvrez nos postes à pourvoir, ou envoyez-nous une candidature spontanée.
        </p>
      </section>

      <section className="recrutement-postes">
        {!loading && postes.length === 0 && (
          <p className="recrutement-empty glass-card">
            Aucun poste ouvert pour le moment — n'hésitez pas à nous envoyer une candidature spontanée
            ci-dessous.
          </p>
        )}
        {postes.map((poste) => (
          <PosteCard key={poste.id} poste={poste} />
        ))}
      </section>

      <section className="recrutement-spontanee glass-card">
        <h2>✍️ Candidature spontanée</h2>
        <p>Pas de poste qui correspond à ce que vous cherchez ? Parlez-nous de vous.</p>
        {!spontaneeOpen ? (
          <button type="button" className="btn-primary" onClick={() => setSpontaneeOpen(true)}>
            Envoyer une candidature spontanée
          </button>
        ) : (
          <CandidatureForm posteId={null} />
        )}
      </section>
    </div>
  );
}
