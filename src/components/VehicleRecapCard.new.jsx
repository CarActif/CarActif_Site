import React from 'react';

// Fonction utilitaire pour la couleur des pourcentages
const getColor = (value) => {
  if (typeof value !== 'number') return '#111';
  if (value <= 31) return '#22c55e'; // vert
  if (value <= 71) return '#f59e42'; // orange
  return '#ef4444'; // rouge
};

import './VehicleRecapCard.css';
import pneusSchema from '../../public/transmission.png';

const VehicleRecapCard = ({ marque, modele, annee, carburant, prix, finition, version, kilometrage, pneus }) => {
  // pneus: { avG, avD, arG, arD }
  return (
    <div className="vehicle-recap-card">
      <div className="vehicle-recap-header">
        <h3 className="vehicle-recap-title">{marque} {modele}</h3>
        {(finition || version) && (
          <div className="vehicle-recap-sub-light">
            {finition && <span>{finition}</span>}
            {finition && version && <span> - </span>}
            {version && <span>{version}</span>}
          </div>
        )}
      </div>
      <div className="vehicle-recap-infos-row">
        {annee && <span className="vehicle-recap-infos-item">{annee}</span>}
        {kilometrage && <span className="vehicle-recap-infos-item">{kilometrage.toLocaleString('fr-FR')} km</span>}
        {carburant && <span className="vehicle-recap-infos-item">{carburant}</span>}
      </div>
      <div className="vehicle-recap-pneus-card">
          <div className="pneus-corner pneus-av-g">
            <span>Usure Pneus AV G</span>
            <span className="pneus-value" style={{ color: getColor(pneus?.avG) }}>{pneus?.avG ?? 'NC'}</span>
          </div>
          <div className="pneus-corner pneus-av-d">
            <span>Usure Pneus AV D</span>
            <span className="pneus-value" style={{ color: getColor(pneus?.avD) }}>{pneus?.avD ?? 'NC'}</span>
          </div>
          <div className="pneus-corner pneus-ar-g">
            <span>Usure Pneus AR G</span>
            <span className="pneus-value" style={{ color: getColor(pneus?.arG) }}>{pneus?.arG ?? 'NC'}</span>
          </div>
          <div className="pneus-corner pneus-ar-d">
            <span>Usure Pneus AR D</span>
            <span className="pneus-value" style={{ color: getColor(pneus?.arD) }}>{pneus?.arD ?? 'NC'}</span>
          </div>
        <img src={pneusSchema} alt="Schéma pneus" className="pneus-schema-img" />
      </div>
      <div className="vehicle-recap-price">
        {prix && (
          <span>{prix} €</span>
        )}
      </div>
    </div>
  );
};

export default VehicleRecapCard;
