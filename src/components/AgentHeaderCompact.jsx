import React from "react";
import PropTypes from "prop-types";
import "./AgentHeaderCompact.css";

export default function AgentHeaderCompact({ avatarSrc, fullName, secteur, phone, email }) {
  return (
    <header className="agent-header-compact-home">
      <div className="agent-header-media-home">
        <div className="agent-header-avatar-wrapper-home">
          <img
            src={avatarSrc || "https://via.placeholder.com/85x85?text=Photo"}
            alt={fullName}
            className="agent-header-avatar-home"
          />
        </div>
        <div className="agent-header-info-home">
          <h2 className="agent-header-name-home">{fullName}</h2>
          {secteur && (
            <span className="agent-header-secteur-badge-home">{secteur}</span>
          )}
          <div className="agent-header-contact-home">
            {phone && (
              <span className="agent-header-phone-home">
                <span className="sr-only">Téléphone : </span>
                <span aria-label="Téléphone" className="agent-header-icon-home">📞</span> <a href={`tel:${phone}`}>{phone}</a>
              </span>
            )}
            {email && (
              <span className="agent-header-email-home">
                <span className="sr-only">Email : </span>
                <span aria-label="Email" className="agent-header-icon-home">✉️</span> <a href={`mailto:${email}`}>{email}</a>
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

AgentHeaderCompact.propTypes = {
  avatarSrc: PropTypes.string,
  fullName: PropTypes.string.isRequired,
  secteur: PropTypes.string,
  phone: PropTypes.string,
  email: PropTypes.string,
};
