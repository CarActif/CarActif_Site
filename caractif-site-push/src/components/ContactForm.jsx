import { useState } from "react";
import { Link } from "react-router-dom";
import "./ContactForm.css";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhoneFR(phone) {
  return /^(0[1-9]\d{8}|\+33[1-9]\d{8})$/.test((phone || "").replace(/[\s.\-]/g, ""));
}

function isValidCodePostal(cp) {
  return /^\d{5}$/.test((cp || "").trim());
}

function isValidDepartement(dept) {
  return /^(\d{2,3}|2A|2B)$/i.test((dept || "").trim());
}

const initialForm = {
  nom: "",
  prenom: "",
  telephone: "",
  email: "",
  codePostal: "",
  departement: "",
  message: "",
  consentementRgpd: false,
  // Honeypot : un humain ne voit jamais ce champ (voir ContactForm.css).
  societeSite: "",
};

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [sent, setSent] = useState(false);

  const handleChange = (field) => (e) => {
    const value = field === "consentementRgpd" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.nom.trim()) nextErrors.nom = "Le nom est requis.";
    if (!form.prenom.trim()) nextErrors.prenom = "Le prénom est requis.";
    if (!isValidEmail(form.email)) nextErrors.email = "Adresse email invalide.";
    if (!isValidPhoneFR(form.telephone)) nextErrors.telephone = "Numéro de téléphone invalide.";

    const hasCp = form.codePostal.trim().length > 0;
    const hasDept = form.departement.trim().length > 0;
    if (!hasCp && !hasDept) {
      nextErrors.codePostal = "Renseignez un code postal ou un département.";
    } else {
      if (hasCp && !isValidCodePostal(form.codePostal)) {
        nextErrors.codePostal = "Code postal invalide (5 chiffres).";
      }
      if (hasDept && !isValidDepartement(form.departement)) {
        nextErrors.departement = "Département invalide.";
      }
    }

    if (!form.consentementRgpd) {
      nextErrors.consentementRgpd = "L'accord est requis pour envoyer votre demande.";
    }

    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
      <div className="contact-form-confirmation">
        <p>✅ Votre demande a bien été envoyée. Un commercial CarActif va vous recontacter rapidement.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {/* Honeypot anti-spam : masqué visuellement, un bot le remplit, un humain non. */}
      <div className="contact-form-honeypot" aria-hidden="true">
        <label htmlFor="societeSite">Votre société</label>
        <input
          id="societeSite"
          name="societeSite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.societeSite}
          onChange={handleChange("societeSite")}
        />
      </div>

      <div className="contact-form-row">
        <div className="contact-form-field">
          <label htmlFor="prenom">Prénom *</label>
          <input id="prenom" type="text" value={form.prenom} onChange={handleChange("prenom")} disabled={submitting} />
          {errors.prenom && <span className="contact-form-error">{errors.prenom}</span>}
        </div>
        <div className="contact-form-field">
          <label htmlFor="nom">Nom *</label>
          <input id="nom" type="text" value={form.nom} onChange={handleChange("nom")} disabled={submitting} />
          {errors.nom && <span className="contact-form-error">{errors.nom}</span>}
        </div>
      </div>

      <div className="contact-form-row">
        <div className="contact-form-field">
          <label htmlFor="telephone">Téléphone *</label>
          <input
            id="telephone"
            type="tel"
            placeholder="06 12 34 56 78"
            value={form.telephone}
            onChange={handleChange("telephone")}
            disabled={submitting}
          />
          {errors.telephone && <span className="contact-form-error">{errors.telephone}</span>}
        </div>
        <div className="contact-form-field">
          <label htmlFor="email">Email *</label>
          <input id="email" type="email" value={form.email} onChange={handleChange("email")} disabled={submitting} />
          {errors.email && <span className="contact-form-error">{errors.email}</span>}
        </div>
      </div>

      <div className="contact-form-row">
        <div className="contact-form-field">
          <label htmlFor="codePostal">Code postal</label>
          <input
            id="codePostal"
            type="text"
            placeholder="59000"
            value={form.codePostal}
            onChange={handleChange("codePostal")}
            disabled={submitting}
          />
        </div>
        <div className="contact-form-field">
          <label htmlFor="departement">ou Département</label>
          <input
            id="departement"
            type="text"
            placeholder="59"
            value={form.departement}
            onChange={handleChange("departement")}
            disabled={submitting}
          />
        </div>
      </div>
      {errors.codePostal && <span className="contact-form-error">{errors.codePostal}</span>}
      {errors.departement && <span className="contact-form-error">{errors.departement}</span>}

      <div className="contact-form-field">
        <label htmlFor="message">Message (facultatif)</label>
        <textarea
          id="message"
          rows={4}
          value={form.message}
          onChange={handleChange("message")}
          disabled={submitting}
        />
      </div>

      <div className="contact-form-consent">
        <label>
          <input
            type="checkbox"
            checked={form.consentementRgpd}
            onChange={handleChange("consentementRgpd")}
            disabled={submitting}
          />
          <span>
            J'accepte que mes données soient utilisées par CarActif pour me recontacter, conformément à
            la <Link to="/politique-confidentialite">politique de confidentialité</Link>. *
          </span>
        </label>
        {errors.consentementRgpd && <span className="contact-form-error">{errors.consentementRgpd}</span>}
      </div>

      {submitError && <p className="contact-form-submit-error">{submitError}</p>}

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? "Envoi en cours…" : "Envoyer ma demande"}
      </button>
    </form>
  );
}
