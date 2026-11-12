import { useState } from "react";
import "./PlaqueForm.css";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPhoneFR(phone) {
  return /^(0[1-9]\d{8}|\+33[1-9]\d{8})$/.test((phone || "").replace(/[\s.\-]/g, ""));
}

const initial = { prenom: "", nom: "", telephone: "", email: "", plaque: "", kilometrage: "", consentementRgpd: false, societeSite: "" };

/** Demande d'estimation simplifiée : le client laisse ses coordonnées, un conseiller le rappelle. */
export default function DemandeEstimation() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: k === "consentementRgpd" ? e.target.checked : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!form.prenom.trim()) err.prenom = "Le prénom est requis.";
    if (!form.nom.trim()) err.nom = "Le nom est requis.";
    if (!isValidPhoneFR(form.telephone)) err.telephone = "Numéro de téléphone invalide.";
    if (!isValidEmail(form.email)) err.email = "Adresse email invalide.";
    if (!form.consentementRgpd) err.consentementRgpd = "L'accord est requis pour envoyer votre demande.";
    setErrors(err);
    if (Object.keys(err).length) return;

    setSubmitting(true);
    setSubmitError("");
    const infos = [
      "Demande d'estimation de véhicule",
      form.plaque.trim() ? `Plaque : ${form.plaque.trim().toUpperCase()}` : null,
      form.kilometrage.trim() ? `Kilométrage : ${form.kilometrage.trim()} km` : null,
    ].filter(Boolean).join(" - ");
    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom: form.prenom, nom: form.nom, telephone: form.telephone, email: form.email,
          message: infos, consentementRgpd: form.consentementRgpd, societeSite: form.societeSite, source: "estimation",
        }),
      });
      const result = await response.json();
      if (!result.success) { setSubmitError(result.error || "Une erreur est survenue. Merci de réessayer."); setSubmitting(false); return; }
      setSent(true);
    } catch (e2) {
      console.error(e2);
      setSubmitError("Une erreur est survenue. Merci de réessayer.");
    }
    setSubmitting(false);
  };

  if (sent) {
    return (
      <div className="bp-form">
        <div className="bp-badge">Demande envoyée</div>
        <h1 className="bp-title">Merci <span>{form.prenom}</span></h1>
        <p className="bp-intro">Un conseiller CarActif va prendre contact avec vous très bientôt pour estimer votre véhicule.</p>
      </div>
    );
  }

  return (
    <form className="bp-form" onSubmit={handleSubmit} noValidate>
      <div className="bp-badge">Estimation gratuite</div>
      <h1 className="bp-title">Estimez votre <span>véhicule</span></h1>
      <p className="bp-intro">
        Laissez-nous vos coordonnées : un conseiller CarActif prendra contact avec vous très bientôt pour
        recueillir les informations de votre véhicule et vous proposer une estimation.
      </p>

      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
        <label htmlFor="societeSite">Votre société</label>
        <input id="societeSite" type="text" tabIndex={-1} autoComplete="off" value={form.societeSite} onChange={set("societeSite")} />
      </div>

      <div className="bp-field">
        <label htmlFor="prenom">Prénom *</label>
        <input id="prenom" type="text" autoComplete="given-name" value={form.prenom} onChange={set("prenom")} disabled={submitting} />
        {errors.prenom && <span className="bp-error">{errors.prenom}</span>}
      </div>
      <div className="bp-field">
        <label htmlFor="nom">Nom *</label>
        <input id="nom" type="text" autoComplete="family-name" value={form.nom} onChange={set("nom")} disabled={submitting} />
        {errors.nom && <span className="bp-error">{errors.nom}</span>}
      </div>
      <div className="bp-field">
        <label htmlFor="telephone">Numéro de téléphone *</label>
        <input id="telephone" type="tel" inputMode="tel" autoComplete="tel" placeholder="06 12 34 56 78" value={form.telephone} onChange={set("telephone")} disabled={submitting} />
        {errors.telephone && <span className="bp-error">{errors.telephone}</span>}
      </div>
      <div className="bp-field">
        <label htmlFor="email">Adresse email *</label>
        <input id="email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={set("email")} disabled={submitting} />
        {errors.email && <span className="bp-error">{errors.email}</span>}
      </div>
      <div className="bp-field">
        <label htmlFor="plaque">Plaque d'immatriculation (facultatif)</label>
        <input id="plaque" type="text" placeholder="AA-123-AA" maxLength={9} autoComplete="off" value={form.plaque} onChange={set("plaque")} disabled={submitting} />
      </div>
      <div className="bp-field">
        <label htmlFor="kilometrage">Kilométrage (facultatif)</label>
        <input id="kilometrage" type="number" inputMode="numeric" placeholder="Ex : 85000" min={0} value={form.kilometrage} onChange={set("kilometrage")} disabled={submitting} />
      </div>

      <label style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", fontSize: "0.85rem", margin: "0.5rem 0 1rem" }}>
        <input type="checkbox" checked={form.consentementRgpd} onChange={set("consentementRgpd")} style={{ marginTop: "0.2rem", width: "auto" }} />
        <span>J'accepte que CarActif utilise ces informations pour me recontacter, conformément à la <a href="/politique-confidentialite" className="link-accent">politique de confidentialité</a>.</span>
      </label>
      {errors.consentementRgpd && <p className="bp-error">{errors.consentementRgpd}</p>}
      {submitError && <p className="bp-error">{submitError}</p>}

      <button type="submit" className="bp-btn" disabled={submitting}>
        {submitting ? <span className="bp-spinner" aria-label="Envoi" /> : "Être recontacté"}
      </button>
    </form>
  );
}
