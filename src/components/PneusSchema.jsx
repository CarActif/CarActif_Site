import "./PneusSchema.css";

/** Couleur selon le taux d'usure (0 % = neuf, 100 % = à remplacer). */
export function couleurUsure(valeur) {
  if (typeof valeur !== "number") return { fond: "#94A3B8", texte: "#475569", etat: "Non renseigné" };
  if (valeur < 31) return { fond: "#16A34A", texte: "#166534", etat: "Bon état" };
  if (valeur <= 71) return { fond: "#F97316", texte: "#9A3412", etat: "À surveiller" };
  return { fond: "#DC2626", texte: "#991B1B", etat: "À remplacer" };
}

function Pneu({ x, y, label, valeur }) {
  const c = couleurUsure(valeur);
  const texte = typeof valeur === "number" ? `${valeur} %` : "NC";
  return (
    <g aria-label={`${label} : ${typeof valeur === "number" ? `${valeur} % d'usure, ${c.etat}` : "non renseigné"}`}>
      <rect x={x} y={y} width="44" height="86" rx="10" fill={c.fond} stroke="#0F172A" strokeWidth="2" />
      {/* sculptures */}
      {[18, 30, 42, 54, 66].map((dy) => (
        <line key={dy} x1={x + 6} x2={x + 38} y1={y + dy} y2={y + dy} stroke="rgba(0,0,0,0.25)" strokeWidth="2" />
      ))}
      <text x={x + 22} y={y + 49} textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff" stroke="rgba(0,0,0,0.45)" strokeWidth="0.6" paintOrder="stroke">
        {texte}
      </text>
    </g>
  );
}

/**
 * Schéma des 4 pneus vu du dessus.
 * Props : avG, avD, arG, arD (nombres 0 à 100, ou null si non renseigné).
 */
export default function PneusSchema({ avG, avD, arG, arD }) {
  return (
    <div className="pneus-schema">
      <svg viewBox="0 0 260 300" role="img" aria-label="Schéma de l'usure des pneus, vue de dessus" className="pneus-schema__svg">
        <text x="130" y="14" textAnchor="middle" fontSize="12" fontWeight="600" fill="#475569">AVANT</text>
        {/* carrosserie vue de dessus */}
        <rect x="62" y="28" width="136" height="252" rx="46" fill="#E2E8F0" stroke="#64748B" strokeWidth="3" />
        <path d="M82 92 Q130 72 178 92 L172 128 L88 128 Z" fill="#BFDBFE" stroke="#64748B" strokeWidth="2" />
        <rect x="88" y="136" width="84" height="70" rx="10" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" />
        <path d="M88 214 L172 214 L178 244 Q130 262 82 244 Z" fill="#BFDBFE" stroke="#64748B" strokeWidth="2" />
        <Pneu x={12} y={44} label="Pneu avant gauche" valeur={avG} />
        <Pneu x={204} y={44} label="Pneu avant droit" valeur={avD} />
        <Pneu x={12} y={184} label="Pneu arrière gauche" valeur={arG} />
        <Pneu x={204} y={184} label="Pneu arrière droit" valeur={arD} />
        <text x="130" y="296" textAnchor="middle" fontSize="12" fontWeight="600" fill="#475569">ARRIÈRE</text>
      </svg>
      <ul className="pneus-schema__legende" aria-label="Légende des couleurs">
        <li><span style={{ background: "#16A34A" }} />Moins de 31 % : bon état</li>
        <li><span style={{ background: "#F97316" }} />31 à 71 % : à surveiller</li>
        <li><span style={{ background: "#DC2626" }} />Plus de 71 % : à remplacer</li>
        <li><span style={{ background: "#94A3B8" }} />NC : non renseigné</li>
      </ul>
      <p className="pneus-schema__note">Taux d'usure mesuré par l'agent CarActif : 0 % pour un pneu neuf, 100 % pour un pneu à la limite légale.</p>
    </div>
  );
}
