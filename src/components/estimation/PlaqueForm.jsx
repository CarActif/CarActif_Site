import { useState } from "react";
import "./PlaqueForm.css";

function formatPlaqueInput(raw) {
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
  const letters1 = cleaned.slice(0, 2);
  const digits = cleaned.slice(2, 5);
  const letters2 = cleaned.slice(5, 7);
  return [letters1, digits, letters2].filter(Boolean).join("-");
}

export default function PlaqueForm({ onSubmit, loading, error }) {
  const [plaque, setPlaque] = useState("");
  const [kilometrage, setKilometrage] = useState("");
  const [localError, setLocalError] = useState("");

  const handlePlaqueChange = (e) => {
    setPlaque(formatPlaqueInput(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (!plaque.trim()) {
      setLocalError("Veuillez saisir votre plaque d'immatriculation.");
      return;
    }

    const km = Number(kilometrage);
    if (!kilometrage || !Number.isFinite(km) || km < 0 || km > 500000) {
      setLocalError("Veuillez saisir un kilométrage valide (entre 0 et 500 000 km).");
      return;
    }

    onSubmit({ plaque, kilometrage: km });
  };

  return (
    <form className="bp-form" onSubmit={handleSubmit}>
      <div className="bp-badge">Estimation gratuite · 30 secondes</div>
      <h1 className="bp-title">
        Estimez votre <span>véhicule</span>
      </h1>
      <p className="bp-intro">
        Renseignez votre plaque d'immatriculation et votre kilométrage pour obtenir une
        estimation gratuite et indicative.
      </p>

      <div className="bp-field">
        <label htmlFor="plaque">Plaque d'immatriculation</label>
        <input
          id="plaque"
          type="text"
          placeholder="AA-123-AA"
          value={plaque}
          onChange={handlePlaqueChange}
          maxLength={9}
          autoComplete="off"
          disabled={loading}
        />
      </div>

      <div className="bp-field">
        <label htmlFor="kilometrage">Kilométrage</label>
        <input
          id="kilometrage"
          type="number"
          placeholder="Ex : 85000"
          value={kilometrage}
          onChange={(e) => setKilometrage(e.target.value)}
          min={0}
          max={500000}
          disabled={loading}
        />
      </div>

      {(localError || error) && <p className="bp-error">{localError || error}</p>}

      <button type="submit" className="bp-btn" disabled={loading}>
        {loading ? <span className="bp-spinner" aria-label="Chargement" /> : "Estimer ma voiture"}
      </button>
    </form>
  );
}
