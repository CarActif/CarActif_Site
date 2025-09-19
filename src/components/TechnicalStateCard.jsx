import React from 'react';
import './TechnicalStateCard.css';
import transmissionImg from '../../public/transmission.png';

const TechnicalStateCard = ({
	pneus = {},
	plaquettesAvant,
	plaquettesArriere,
	typeDistribution,
	anneeDistribution
}) => {
	return (
		<section className="ts-section">
			<h2 className="ts-title">🛠️ Contrôle Technique & État</h2>
			{/* Plaquettes Avant */}
			<div className="ts-plaquettes ts-plaquettes-avant">
				<span>Plaquettes Avant</span>
				<strong>{plaquettesAvant}</strong>
			</div>
			{/* Bloc carré pneus + schéma */}
			<div className="ts-pneus-schema-zone">
				{/* Usure Pneu AV G */}
				<div className="ts-pneu-card ts-pneu-av-g">
					<span>Usure Pneu AV G</span>
					<strong>{pneus.avG}</strong>
				</div>
				{/* Usure Pneu AV D */}
				<div className="ts-pneu-card ts-pneu-av-d">
					<span>Usure Pneu AV D</span>
					<strong>{pneus.avD}</strong>
				</div>
				{/* Schéma transmission/roues */}
				<div className="ts-schema-center">
					<img src={transmissionImg} alt="Schéma roues + transmission" className="ts-schema-img" />
				</div>
				{/* Usure Pneu AR G */}
				<div className="ts-pneu-card ts-pneu-ar-g">
					<span>Usure Pneu AR G</span>
					<strong>{pneus.arG}</strong>
				</div>
				{/* Usure Pneu AR D */}
				<div className="ts-pneu-card ts-pneu-ar-d">
					<span>Usure Pneu AR D</span>
					<strong>{pneus.arD}</strong>
				</div>
			</div>
			{/* Plaquettes Arrière */}
			<div className="ts-plaquettes ts-plaquettes-arriere">
				<span>Plaquettes Arrière</span>
				<strong>{plaquettesArriere}</strong>
			</div>
			{/* Infos Distribution */}
			<div className="ts-distribution-row">
				<div className="ts-distribution-card">
					<span>Type de Distribution</span>
					<strong>{typeDistribution}</strong>
				</div>
				<div className="ts-distribution-card">
					<span>Année Distribution</span>
					<strong>{anneeDistribution}</strong>
				</div>
			</div>
		</section>
	);
};

export default TechnicalStateCard;
