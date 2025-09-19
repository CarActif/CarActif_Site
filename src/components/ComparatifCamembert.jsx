
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip } from "chart.js";
Chart.register(ArcElement, Tooltip);

// Palette imposée
const COLORS = {
  vendeur: "var(--caractif-green, #2E7D32)", // Vert CarActif
  honoraires: "#2196F3", // Bleu
  decote: "#C62828", // Rouge 800
  marge: "#E65100", // Orange 900
  showroom: "#2E7D32", // Vert CarActif (remplace tout noir/brun)
  equipe: "#F9A825", // Ambre 700
  assurances: "#455A64", // Bleu-gris 700
  marketing: "#AD1457", // Rose 800
};


const BASE_PRIX = 40000;

// Données garage pour 40 000 € (total 100%)
const garageParts = [
  { label: "Ce que vous touchez (net vendeur)", value: 28400, percent: 71, color: "#2E7D32", textColor: "#FFFFFF" },
  { label: "Décote de reprise", value: 6000, percent: 15, color: COLORS.decote, textColor: "#FFFFFF" },
  { label: "Marge du garage", value: 2000, percent: 5, color: COLORS.marge, textColor: "#FFFFFF" },
  { label: "Showroom (loyer & charges)", value: 1000, percent: 2.5, color: COLORS.showroom, textColor: "#FFFFFF" },
  { label: "Équipe commerciale", value: 1400, percent: 3.5, color: COLORS.equipe, textColor: "#263238" },
  { label: "Assurances & frais financiers", value: 800, percent: 2, color: COLORS.assurances, textColor: "#FFFFFF" },
  { label: "Marketing & annonces", value: 400, percent: 1, color: COLORS.marketing, textColor: "#FFFFFF" },
];

// Données CarActif pour 40 000 € (total 100%)
const carActifParts = [
  { label: "Honoraires CarActif", value: 2490, percent: Math.round(2490 / 40000 * 100), color: COLORS.honoraires, textColor: "#2196F3" },
  { label: "Montant reçu par le vendeur", value: 37510, percent: Math.round(37510 / 40000 * 100), color: "#2E7D32", textColor: "#FFFFFF" },
];

// Calculs écart
const diffValue = carActifParts[1].value - garageParts[0].value;
const diffPercent = ((carActifParts[1].value / garageParts[0].value) - 1) * 100;

function formatNumber(n) {
  return n.toLocaleString('fr-FR').replace(/\s/g, '\u202F');
}
function formatPercent(p) {
  return p.toString().replace('.', ',') + ' %';
}

function Donut({ parts, netValue, netPercent, baseLabel, legend, centerNote }) {
  const data = {
    labels: parts.map(p => p.label),
    datasets: [
      {
        data: parts.map(p => p.value),
        backgroundColor: parts.map(p => p.color),
        borderWidth: 2,
        borderColor: "#fff",
        cutout: "60%",
        circumference: 360,
        rotation: -90,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: false,
        labels: {
          color: parts.map(p => p.color),
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const p = parts[context.dataIndex];
            return `${p.label}: ${formatPercent(p.percent)} (${formatNumber(p.value)} €)`;
          },
        },
      },
    },
    maintainAspectRatio: false,
    rotation: -90,
  };
  return (
    <div className="donut-container">
      <div className="donut-chart">
        <Pie data={data} options={options} width={300} height={300} />
        <div className="donut-center">
          <div className="donut-net" style={{color:'var(--caractif-green, #2E7D32)', fontWeight:700, fontSize:'2.1em'}}>{formatNumber(netValue)} €</div>
          <div className="donut-percent" style={{color:'#888', fontSize:'1em'}}>{formatPercent(netPercent)}</div>
        </div>
      </div>
      <div className="donut-base">{baseLabel}</div>
      <div className="donut-legend">{legend}</div>
      {centerNote && <div className="donut-note">{centerNote}</div>}
    </div>
  );
}

function GarageLegend() {
  return (
    <div>
      {garageParts.map(p => (
        <div key={p.label} style={{display:'flex',alignItems:'center',marginBottom:10}}>
          <span style={{
            display:'inline-block',
            width:18,
            height:18,
            borderRadius:'50%',
            background:p.color,
            marginRight:10,
            border:'1.5px solid #fff'
          }}></span>
          <span style={{
            color:p.color,
            fontWeight:600,
            fontSize:'1em',
          }}>
            {p.label} : <span style={{color:p.color}}>{formatPercent(p.percent)} ({formatNumber(p.value)} €)</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function CarActifLegend() {
  return (
    <div>
      {carActifParts.map(p => (
        <div key={p.label} style={{display:'flex',alignItems:'center',marginBottom:10}}>
          <span style={{
            display:'inline-block',
            width:18,
            height:18,
            borderRadius:'50%',
            background:p.color,
            marginRight:10,
            border:'1.5px solid #fff'
          }}></span>
          <span style={{
            color:p.color,
            fontWeight:600,
            fontSize:'1em',
          }}>
            {p.label} : <span style={{color:p.color}}>{formatPercent(p.percent)} ({formatNumber(p.value)} €)</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ComparatifCamembert() {
  return (
    <div className="comparatif-camembert">
      <div className="donuts-diff" style={{marginBottom:'2em',marginTop:0}}>
        <div className="diff-label">Différence estimative :</div>
        <div className="diff-value">+{diffValue.toLocaleString()} € (+{diffPercent.toFixed(1)}%)</div>
        <div className="diff-note">pour le vendeur avec CarActif</div>
      </div>
      <div className="donuts-layout">
        <Donut
          parts={garageParts}
          netValue={garageParts[0].value}
          netPercent={garageParts[0].percent}
          baseLabel="Exemple 40 000 € prix marché"
          legend={<GarageLegend />}
        />
        <Donut
          parts={carActifParts}
          netValue={carActifParts[1].value}
          netPercent={carActifParts[1].percent}
          baseLabel="Exemple 40 000 € prix marché"
          legend={<CarActifLegend />}
          centerNote={
            <div style={{marginTop:'1em',fontSize:'1.05em'}}>
              <div style={{color:'#888',marginTop:'0.3em'}}>Nos 5 % couvrent tout. Rien d’autre à déduire.</div>
            </div>
          }
        />
      </div>
      <div className="comparatif-note">
        <span></span>
      </div>
      {/* Styles inline pour la démo, à mettre dans un fichier CSS dédié */}
      <style>{`
        .comparatif-camembert {
          width: 100%;
          margin: 0 auto;
          padding: 1em 0 2em 0;
        }
        .donuts-layout {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          justify-content: center;
          gap: 2em;
        }
        .donut-container {
          width: 420px;
          min-width: 380px;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #fafbfc;
          border-radius: 16px;
          box-shadow: 0 2px 8px #0001;
          padding: 1em 0.5em 1em 0.5em;
        }
        .donut-chart {
          position: relative;
          width: 380px;
          height: 380px;
        }
        .donut-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }
        .donut-net {
          font-size: 2.1em;
          font-weight: 700;
          color: #2ecc40;
        }
        .donut-percent {
          font-size: 1em;
          color: #555;
        }
        .donut-base {
          font-size: 1em;
          color: #888;
          margin: 0.7em 0 0.2em 0;
        }
        .donut-legend {
          font-size: 0.98em;
          margin-top: 0.3em;
          width: 100%;
        }
        .donut-note {
          font-size: 0.95em;
          color: #008060;
          margin-top: 0.5em;
          text-align: center;
        }
        .donuts-diff {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 180px;
          margin-top: 0;
          margin-bottom: 2em;
        }
        .diff-label {
          font-size: 1.1em;
          color: #222;
          font-weight: 500;
        }
        .diff-value {
          font-size: 1.7em;
          font-weight: 700;
          color: #2ecc40;
        }
        .diff-note {
          font-size: 1em;
          color: #555;
        }
        .comparatif-note {
          text-align: center;
          font-size: 0.95em;
          color: #888;
          margin-top: 2em;
        }
        @media (max-width: 900px) {
          .donuts-layout {
            flex-direction: column;
            align-items: center;
            gap: 1.5em;
          }
          .donuts-diff {
            margin-top: 0;
            margin-bottom: 1.5em;
            min-width: 0;
          }
        }
      `}</style>
    </div>
  );
}
