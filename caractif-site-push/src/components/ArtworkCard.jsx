import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Fuel, Gauge, MapPin, Settings2 } from "lucide-react";
import { getBoiteVitesseFromVehicle } from "../utils/boiteVitesse";
import "./ArtworkCard.css";

const spring = { type: "spring", stiffness: 280, damping: 26 };

function getVehicleVariantLine(vehicle) {
  const line = [vehicle.version, vehicle.finition].filter(Boolean).join(" ");
  return line || vehicle.motorisation || "";
}

function StatusBadge({ statut }) {
  if (statut === "Sous offre") {
    return (
      <span className="artwork-card__badge artwork-card__badge--offre">
        Sous offre
      </span>
    );
  }
  if (statut === "Vendu") {
    return (
      <span className="artwork-card__badge artwork-card__badge--vendu">Vendu</span>
    );
  }
  return null;
}

function SpecItem({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="artwork-card__spec">
      <Icon className="artwork-card__spec-icon" aria-hidden="true" strokeWidth={1.75} />
      <span className="artwork-card__spec-value">{value}</span>
      {label && <span className="artwork-card__spec-label">{label}</span>}
    </div>
  );
}

export default function ArtworkCard({
  vehicle,
  index = 0,
  to,
  onClick,
  disabled = false,
  className = "",
  role,
  tabIndex,
  onKeyDown,
}) {
  const boiteLabel = getBoiteVitesseFromVehicle(vehicle);
  const isMuted =
    disabled || vehicle.statut === "Sous offre" || vehicle.statut === "Vendu";

  const subtitle = getVehicleVariantLine(vehicle);

  const priceFormatted =
    vehicle.prix_affiche != null
      ? `${vehicle.prix_affiche.toLocaleString("fr-FR")} €`
      : "—";

  const content = (
    <>
      <div className="artwork-card__top">
        <div className="artwork-card__media">
          <img
            src={vehicle.photo_url?.[0] || "https://via.placeholder.com/640x360"}
            alt={`${vehicle.marque} ${vehicle.modele}`}
            className={isMuted ? "artwork-card__img--muted" : ""}
            loading="lazy"
          />
          <div className="artwork-card__media-scrim" aria-hidden="true" />
          <div className="artwork-card__media-corner">
            {vehicle.departement && (
              <span className="artwork-card__location">
                <MapPin
                  className="artwork-card__location-icon"
                  aria-hidden="true"
                  strokeWidth={2}
                />
                {vehicle.departement}
              </span>
            )}
            <StatusBadge statut={vehicle.statut} />
          </div>
          <p className="artwork-card__price" aria-label={`Prix : ${priceFormatted}`}>
            {priceFormatted}
          </p>
        </div>
      </div>

      <div className="artwork-card__body">
        <div className="artwork-card__headline">
          <h3 className="artwork-card__title">
            {vehicle.marque} {vehicle.modele}
          </h3>
          {subtitle && (
            <p className="artwork-card__subtitle" title={subtitle}>
              {subtitle}
            </p>
          )}
        </div>

        <div className="artwork-card__specs">
          <SpecItem
            icon={Calendar}
            value={vehicle.annee ? String(vehicle.annee).slice(0, 4) : null}
          />
          <SpecItem
            icon={Fuel}
            value={vehicle.energie || vehicle.carburant || null}
          />
          <SpecItem
            icon={Gauge}
            value={
              vehicle.kilometrage != null
                ? `${vehicle.kilometrage.toLocaleString("fr-FR")} km`
                : null
            }
          />
          <SpecItem icon={Settings2} value={boiteLabel || null} />
        </div>
      </div>
    </>
  );

  const cardClass = [
    "artwork-card",
    !disabled && (to || onClick) ? "artwork-card--interactive" : "",
    disabled ? "artwork-card--disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const motionProps = {
    initial: { opacity: 0, y: 12, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { ...spring, delay: index * 0.05 },
  };

  if (to && !disabled) {
    return (
      <motion.div {...motionProps}>
        <Link
          to={to}
          className={cardClass}
          aria-label={`Voir ${vehicle.marque} ${vehicle.modele}, ${priceFormatted}`}
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.article
      {...motionProps}
      className={cardClass}
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      aria-disabled={disabled || undefined}
    >
      {content}
    </motion.article>
  );
}
