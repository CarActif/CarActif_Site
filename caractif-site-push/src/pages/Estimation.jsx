import { useState } from "react";
import PlaqueForm from "../components/estimation/PlaqueForm";
import EstimationResult from "../components/estimation/EstimationResult";
import ContactModal from "../components/estimation/ContactModal";
import { findPrixNeuf } from "../lib/vehiclePrices";
import { calculateEstimation } from "../lib/estimationCalculator";
import "./Estimation.css";

export default function Estimation() {
  const [step, setStep] = useState("idle"); // idle | loading | result
  const [error, setError] = useState("");

  const [plaque, setPlaque] = useState("");
  const [kilometrage, setKilometrage] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [estimation, setEstimation] = useState(null);

  const [contactOpen, setContactOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  const handleEstimate = async ({ plaque: plaqueValue, kilometrage: km }) => {
    setStep("loading");
    setError("");
    setConfirmation(null);
    setPlaque(plaqueValue);
    setKilometrage(km);

    try {
      const response = await fetch("/api/vehicules/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plaque: plaqueValue }),
      });
      const result = await response.json();

      if (!result.success) {
        setError(result.error || "Impossible d'identifier ce véhicule.");
        setStep("idle");
        return;
      }

      const vehicleData = result.data;
      const { prix, exact } = findPrixNeuf(
        vehicleData.marque,
        vehicleData.modele,
        vehicleData.motorisation || ""
      );
      const calc = calculateEstimation(
        prix,
        vehicleData.annee || new Date().getFullYear(),
        km,
        !exact
      );

      setVehicle(vehicleData);
      setEstimation(calc);
      setStep("result");
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue. Merci de réessayer.");
      setStep("idle");
    }
  };

  const handleContactSubmit = async (contact) => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plaque,
          marque: vehicle.marque,
          modele: vehicle.modele,
          annee: vehicle.annee,
          motorisation: vehicle.motorisation,
          energie: vehicle.energie,
          transmission: vehicle.transmission,
          puissanceCh: vehicle.puissanceCh,
          kilometrage,
          estimationMin: estimation.min,
          estimationMoy: estimation.moy,
          estimationMax: estimation.max,
          ...contact,
        }),
      });
      const result = await response.json();

      if (!result.success) {
        setSubmitError(result.error || "Impossible d'envoyer votre demande.");
        setSubmitting(false);
        return;
      }

      setConfirmation({ nom: contact.nom, telephone: contact.telephone });
      setContactOpen(false);
    } catch (err) {
      console.error(err);
      setSubmitError("Une erreur est survenue. Merci de réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetFlow = () => {
    setStep("idle");
    setVehicle(null);
    setEstimation(null);
    setConfirmation(null);
    setError("");
  };

  return (
    <div className="estimation-page bp-page">
      <div className="bp-orb bp-orb--blue" />
      <div className="bp-orb bp-orb--purple" />
      {step !== "result" && (
        <PlaqueForm onSubmit={handleEstimate} loading={step === "loading"} error={error} />
      )}

      {step === "result" && vehicle && estimation && (
        <>
          <EstimationResult
            vehicle={vehicle}
            estimation={estimation}
            onContact={() => setContactOpen(true)}
          />
          <button type="button" className="link-accent restart-link" onClick={resetFlow}>
            Estimer un autre véhicule
          </button>
        </>
      )}

      {confirmation && (
        <div className="confirmation-banner glass-card">
          Merci {confirmation.nom}, un conseiller CarActif vous recontacte sous 24h au{" "}
          {confirmation.telephone}.
        </div>
      )}

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        onSubmit={handleContactSubmit}
        submitting={submitting}
        submitError={submitError}
      />
    </div>
  );
}
