import { useEffect, useState } from "react";
import supabase from "../supabase";
import CandidatureForm from "../components/CandidatureForm";
import "./Recrutement.css";
import usePageMeta from "../lib/usePageMeta";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function PosteCard({ poste, index, onPostuler }) {
  return (
    <article className="poste-card glass-card" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="poste-card-header">
        <div>
          <h2>{poste.titre}</h2>
          <div className="poste-card-chips">
            {poste.type_contrat && <span className="poste-chip poste-chip-strong">{poste.type_contrat}</span>}
            {poste.lieu && <span className="poste-chip">{poste.lieu}</span>}
            <span className="poste-chip poste-chip-soft">Publié le {formatDate(poste.created_at)}</span>
          </div>
        </div>
      </div>
      <p className="poste-card-description">{poste.description}</p>
      <button type="button" className="btn-primary poste-card-cta" onClick={() => onPostuler(poste)}>
        Postuler à cette offre <span aria-hidden="true">→</span>
      </button>
    </article>
  );
}

function PostulerModal({ poste, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="postuler-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="postuler-modal" role="dialog" aria-modal="true" aria-label="Postuler">
        <button type="button" className="postuler-close" onClick={onClose} aria-label="Fermer">×</button>
        <p className="postuler-eyebrow">{poste ? "Votre candidature pour" : "Candidature spontanée"}</p>
        <h2 className="postuler-title">{poste ? poste.titre : "Parlez-nous de vous"}</h2>
        {poste && (
          <p className="postuler-sub">{[poste.type_contrat, poste.lieu].filter(Boolean).join(" · ")}</p>
        )}
        <CandidatureForm posteId={poste ? poste.id : null} />
      </div>
    </div>
  );
}

export default function Recrutement() {
  usePageMeta("Recrutement", "Rejoignez CarActif : postes de commerciaux indépendants dans les Hauts-de-France et candidature spontanée.");
  const [postes, setPostes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { poste } ou null

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
            Aucun poste ouvert pour le moment. N'hésitez pas à nous envoyer une candidature spontanée
            ci-dessous.
          </p>
        )}
        {postes.map((poste, i) => (
          <PosteCard key={poste.id} poste={poste} index={i} onPostuler={(p) => setModal({ poste: p })} />
        ))}
      </section>

      <section className="recrutement-spontanee glass-card">
        <h2>Candidature spontanée</h2>
        <p>Pas de poste qui correspond à ce que vous cherchez ? Parlez-nous de vous.</p>
        <button type="button" className="btn-secondary" onClick={() => setModal({ poste: null })}>
          Envoyer une candidature spontanée
        </button>
      </section>

      {modal && <PostulerModal poste={modal.poste} onClose={() => setModal(null)} />}
    </div>
  );
}
