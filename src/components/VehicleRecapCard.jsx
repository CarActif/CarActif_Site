
import React from 'react';
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
  {/* ...aucune info pneus ni schéma... */}
      <div className="vehicle-recap-price">
        {prix && (
          <span>{prix} €</span>
        )}
      </div>
    </div>
  );
};

export default VehicleRecapCard;
