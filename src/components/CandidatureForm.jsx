import { useState } from "react";
import { Link } from "react-router-dom";
import { uploadCandidatureCv, validateCvFile } from "../lib/uploadCandidatureCv";
import "./CandidatureForm.css";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhoneFR(phone) {
  return /^(0[1-9]\d{8}|\+33[1-9]\d{8})$/.test((phone || "").replace(/[\s.\-]/g, ""));
}

const initialForm = {
  nom: "",
  telephone: "",
  email: "",
  message: "",
  consentementRgpd: false,
  societeSite: "",
};

export default function CandidatureForm({ posteId = null }) {
  const [form, setForm] = useState(initialForm);
  const [cvFile, setCvFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [sent, setSent] = useState(false);

  const handleChange = (field) => (e) => {
    const value = field === "consentementRgpd" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    const error = validateCvFile(file);
    setErrors((err) => ({ ...err, cv: error || undefined }));
    setCvFile(error ? null : file);
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.nom.trim()) nextErrors.nom = "Le nom est requis.";
    if (!isValidPhoneFR(form.telephone)) nextErrors.telephone = "Numéro de téléphone invalide.";
    if (form.email.trim() && !isValidEmail(form.email)) nextErrors.email = "Adresse email invalide.";
    if (!form.consentementRgpd) {
      nextErrors.consentementRgpd = "L'accord est requis pour envoyer votre candidature.";
    }
    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors((err) => ({ ...err, ...nextErrors, cv: err.cv }));
    if (Object.keys(nextErrors).length > 0 || errors.cv) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      let cvPath = null;
      if (cvFile) {
        cvPath = await uploadCandidatureCv(cvFile);
      }

      const response = await fetch("/api/candidatures/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: form.nom,
          telephone: form.telephone,
          email: form.email,
          message: form.message,
          posteId,
          cvPath,
          societeSite: form.societeSite,
        }),
      });
      const result = await response.json();
      if (!result.success) {
        setSubmitError(result.error || "Une erreur est survenue. Merci de réessayer.");
        setSubmitting(false);
        return;
      }
      setSent(true);
      setSubmitting(false);
    } catch (err) {
      console.error(err);
      setSubmitError("Une erreur est survenue. Merci de réessayer.");
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="candidature-form-confirmation">
        <p>✅ Votre candidature a bien été envoyée. Merci, nous revenons vers vous rapidement.</p>
      </div>
    );
  }

  return (
    <form className="candidature-form" onSubmit={handleSubmit} noValidate>
      <div className="candidature-form-honeypot" aria-hidden="true">
        <label htmlFor={`societeSite-${posteId || "spontanee"}`}>Votre société</label>
        <input
          id={`societeSite-${posteId || "spontanee"}`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.societeSite}
          onChange={handleChange("societeSite")}
        />
      </div>

      <div className="candidature-form-row">
        <div className="candidature-form-field">
          <label htmlFor={`nom-${posteId || "spontanee"}`}>Nom *</label>
          <input
            id={`nom-${posteId || "spontanee"}`}
            type="text"
            value={form.nom}
            onChange={handleChange("nom")}
            disabled={submitting}
          />
          {errors.nom && <span className="candidature-form-error">{errors.nom}</span>}
        </div>
        <div className="candidature-form-field">
          <label htmlFor={`telephone-${posteId || "spontanee"}`}>Téléphone *</label>
          <input
            id={`telephone-${posteId || "spontanee"}`}
            type="tel"
            placeholder="06 12 34 56 78"
            value={form.telephone}
            onChange={handleChange("telephone")}
            disabled={submitting}
          />
          {errors.telephone && <span className="candidature-form-error">{errors.telephone}</span>}
        </div>
      </div>

      <div className="candidature-form-field">
        <label htmlFor={`email-${posteId || "spontanee"}`}>Email (facultatif)</label>
        <input
          id={`email-${posteId || "spontanee"}`}
          type="email"
          value={form.email}
          onChange={handleChange("email")}
          disabled={submitting}
        />
        {errors.email && <span className="candidature-form-error">{errors.email}</span>}
      </div>

      <div className="candidature-form-field">
        <label htmlFor={`message-${posteId || "spontanee"}`}>Message (facultatif)</label>
        <textarea
          id={`message-${posteId || "spontanee"}`}
          rows={3}
          value={form.message}
          onChange={handleChange("message")}
          disabled={submitting}
        />
      </div>

      <div className="candidature-form-field">
        <label htmlFor={`cv-${posteId || "spontanee"}`}>CV (facultatif — PDF, DOC ou DOCX, 5 Mo max)</label>
        <input
          id={`cv-${posteId || "spontanee"}`}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          disabled={submitting}
        />
        {errors.cv && <span className="candidature-form-error">{errors.cv}</span>}
        {cvFile && !errors.cv && <span className="candidature-form-file-ok">📎 {cvFile.name}</span>}
      </div>

      <div className="candidature-form-consent">
        <label>
          <input
            type="checkbox"
            checked={form.consentementRgpd}
            onChange={handleChange("consentementRgpd")}
            disabled={submitting}
          />
          J'accepte que mes données soient utilisées par CarActif pour traiter ma candidature,
          conformément à la{" "}
          <Link to="/politique-confidentialite">politique de confidentialité</Link>. *
        </label>
        {errors.consentementRgpd && <span className="candidature-form-error">{errors.consentementRgpd}</span>}
      </div>

      {submitError && <p className="candidature-form-submit-error">{submitError}</p>}

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? "Envoi en cours…" : "Envoyer ma candidature"}
      </button>
    </form>
  );
}
