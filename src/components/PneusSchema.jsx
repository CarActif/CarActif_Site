import "./PneusSchema.css";

/** Les valeurs arrivent parfois en texte ("20") : on les convertit. */
export function versNombre(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(String(v).replace(",", ".").replace("%", "").trim());
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : null;
}

const PALIERS = [
  [0, [22, 163, 74]],    // vert
  [30, [22, 163, 74]],   // vert
  [50, [234, 179, 8]],   // jaune
  [71, [249, 115, 22]],  // orange
  [100, [220, 38, 38]],  // rouge
];

/** Couleur continue : vert, jaune, orange, rouge selon l'usure (0 à 100 %). */
export function couleurContinue(valeur) {
  const v = versNombre(valeur);
  if (v === null) return "#94A3B8";
  for (let i = 1; i < PALIERS.length; i++) {
    const [b, cb] = PALIERS[i];
    const [a, ca] = PALIERS[i - 1];
    if (v <= b) {
      const t = b === a ? 0 : (v - a) / (b - a);
      const c = ca.map((x, k) => Math.round(x + (cb[k] - x) * t));
      return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
    }
  }
  return "rgb(220, 38, 38)";
}

export function etatUsure(valeur) {
  const v = versNombre(valeur);
  if (v === null) return "Non renseigné";
  if (v < 31) return "Bon état";
  if (v <= 71) return "À surveiller";
  return "À remplacer";
}

/**
 * Un pneu vu du dessus. `ext` = côté carrosserie extérieur (flanc visible), `int` = côté intérieur.
 * Le dégradé va du côté extérieur au côté intérieur du pneu.
 */
function Pneu({ id, x, y, label, ext, int, gauche }) {
  const e = versNombre(ext);
  const i = versNombre(int);
  const ref = e ?? i;
  // à gauche, l'extérieur est à gauche ; à droite, il est à droite
  const colG = gauche ? couleurContinue(e ?? i) : couleurContinue(i ?? e);
  const colD = gauche ? couleurContinue(i ?? e) : couleurContinue(e ?? i);
  const gid = `grad-${id}`;
  const fmt = (v) => (v === null ? "NC" : `${Math.round(v)}`);
  const lblG = gauche ? fmt(e) : fmt(i);
  const lblD = gauche ? fmt(i) : fmt(e);
  const aria = `${label} : extérieur ${e === null ? "non renseigné" : e + " %"}, intérieur ${i === null ? "non renseigné" : i + " %"}`;
  return (
    <g aria-label={aria}>
      <defs>
        <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={colG} />
          <stop offset="1" stopColor={colD} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width="48" height="88" rx="11" fill={ref === null ? "#94A3B8" : `url(#${gid})`} stroke="#0F172A" strokeWidth="2" />
      {[20, 32, 44, 56, 68].map((dy) => (
        <line key={dy} x1={x + 6} x2={x + 42} y1={y + dy} y2={y + dy} stroke="rgba(0,0,0,0.22)" strokeWidth="2" />
      ))}
      <text x={x + 12} y={y + 50} textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" stroke="rgba(0,0,0,0.55)" strokeWidth="0.7" paintOrder="stroke">{lblG}</text>
      <text x={x + 36} y={y + 50} textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" stroke="rgba(0,0,0,0.55)" strokeWidth="0.7" paintOrder="stroke">{lblD}</text>
    </g>
  );
}

/**
 * Schéma des 4 pneus vu du dessus, avec dégradé entre côté extérieur et côté intérieur.
 * Props : pour chaque pneu (avG, avD, arG, arD) un objet {ext, int} (nombres ou texte).
 */
export default function PneusSchema({ avG, avD, arG, arD }) {
  return (
    <div className="pneus-schema">
      <svg viewBox="0 0 270 300" role="img" aria-label="Schéma de l'usure des pneus, vue de dessus" className="pneus-schema__svg">
        <text x="135" y="13" textAnchor="middle" fontSize="12" fontWeight="600" fill="#475569">AVANT</text>
        <rect x="68" y="26" width="134" height="250" rx="46" fill="#E2E8F0" stroke="#64748B" strokeWidth="3" />
        <path d="M86 90 Q135 70 184 90 L178 126 L92 126 Z" fill="#BFDBFE" stroke="#64748B" strokeWidth="2" />
        <rect x="92" y="134" width="86" height="70" rx="10" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" />
        <path d="M92 212 L178 212 L184 242 Q135 260 86 242 Z" fill="#BFDBFE" stroke="#64748B" strokeWidth="2" />
        <Pneu id="avg" x={10} y={42} gauche label="Avant gauche" ext={avG?.ext} int={avG?.int} />
        <Pneu id="avd" x={212} y={42} label="Avant droit" ext={avD?.ext} int={avD?.int} />
        <Pneu id="arg" x={10} y={182} gauche label="Arrière gauche" ext={arG?.ext} int={arG?.int} />
        <Pneu id="ard" x={212} y={182} label="Arrière droit" ext={arD?.ext} int={arD?.int} />
        <text x="135" y="295" textAnchor="middle" fontSize="12" fontWeight="600" fill="#475569">ARRIÈRE</text>
      </svg>
      <div className="pneus-schema__echelle" aria-hidden="true"><span>0 %</span><i /><span>100 %</span></div>
      <p className="pneus-schema__note">Usure mesurée par l'agent CarActif sur chaque côté du pneu (extérieur et intérieur). 0 % = neuf, 100 % = limite légale. Le dégradé montre une usure inégale.</p>
    </div>
  );
}
