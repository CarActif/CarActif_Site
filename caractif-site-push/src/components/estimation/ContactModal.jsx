import { useState } from "react";
import { createPortal } from "react-dom";
import "./ContactModal.css";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhoneFR(phone) {
  const cleaned = phone.replace(/[\s.\-]/g, "");
  return /^(0[1-9]\d{8}|\+33[1-9]\d{8})$/.test(cleaned);
}

export default function ContactModal({ open, onClose, onSubmit, submitting, submitError }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [errors, setErrors] = useState({});

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!nom.trim()) nextErrors.nom = "Le nom est requis.";
    if (!isValidEmail(email)) nextErrors.email = "Adresse email invalide.";
    if (!isValidPhoneFR(telephone)) nextErrors.telephone = "Numéro de téléphone invalide.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({ nom: nom.trim(), email: email.trim(), telephone: telephone.trim() });
  };

  return createPortal(
    <div className="bp-modal-overlay" onClick={onClose}>
      <div className="bp-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="bp-modal-close" onClick={onClose} aria-label="Fermer">
          ×
        </button>
        <div className="bp-badge">Être recontacté</div>
        <h2 className="bp-modal-title">Parlez à un conseiller</h2>
        <p className="bp-intro">Laissez-nous vos coordonnées, un conseiller CarActif vous recontacte sous 24h.</p>

        <form onSubmit={handleSubmit}>
          <div className="bp-field">
            <label htmlFor="nom">Nom</label>
            <input
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              disabled={submitting}
            />
            {errors.nom && <span className="bp-field-error">{errors.nom}</span>}
          </div>

          <div className="bp-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />
            {errors.email && <span className="bp-field-error">{errors.email}</span>}
          </div>

          <div className="bp-field">
            <label htmlFor="telephone">Téléphone</label>
            <input
              id="telephone"
              type="tel"
              placeholder="06 12 34 56 78"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              disabled={submitting}
            />
            {errors.telephone && <span className="bp-field-error">{errors.telephone}</span>}
          </div>

          {submitError && <p className="bp-error">{submitError}</p>}

          <button type="submit" className="bp-btn" disabled={submitting}>
            {submitting ? "Envoi en cours..." : "Envoyer ma demande"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
