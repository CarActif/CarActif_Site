/** Illustrations de voiture (côté, face, arrière) : couleurs réglables selon l'état. */
export default function CarFace({ face, body = "#cbd5e1", shade = "#94a3b8", glass = "#e8eef6", className, style }) {
  const wheel = (cx, cy) => (
    <g key={cx}>
      <circle cx={cx} cy={cy} r="22" fill="#0f172a" />
      <circle cx={cx} cy={cy} r="18" fill="#1e293b" />
      <circle cx={cx} cy={cy} r="11" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
      {[0, 72, 144, 216, 288].map((a) => (
        <line key={a} x1={cx} y1={cy} x2={cx + 9 * Math.cos((a * Math.PI) / 180)} y2={cy + 9 * Math.sin((a * Math.PI) / 180)} stroke="#94a3b8" strokeWidth="2.4" strokeLinecap="round" />
      ))}
      <circle cx={cx} cy={cy} r="3" fill="#64748b" />
    </g>
  );

  if (face === "gauche" || face === "droite") {
    return (
      <svg viewBox="0 0 240 106" className={className} style={{ ...style, transform: face === "droite" ? "scaleX(-1)" : undefined }} aria-hidden="true">
        <ellipse cx="120" cy="98" rx="104" ry="5" fill="#0f172a" opacity=".13" />
        <path d="M10 76 L10 62 Q10 55 18 54 L52 50 Q62 30 90 26 L142 26 Q168 27 182 46 L212 52 Q230 55 230 66 L230 76 Q230 82 224 82 H16 Q10 82 10 76 Z" fill={body} />
        <path d="M10 70 H230 V76 Q230 82 224 82 H16 Q10 82 10 76 Z" fill={shade} opacity=".55" />
        <path d="M62 49 Q70 33 92 30 L110 30 L110 49 Z" fill={glass} />
        <path d="M116 30 L142 30 Q162 31 174 47 L116 49 Z" fill={glass} />
        <path d="M113 30 V70" stroke={shade} strokeWidth="1.6" />
        <rect x="120" y="55" width="12" height="3" rx="1.5" fill={shade} />
        <path d="M176 46 L186 48 L184 54 L174 52 Z" fill={shade} />
        <path d="M218 56 L229 58 L229 64 L216 63 Z" fill="#fde68a" />
        <rect x="10" y="57" width="5" height="9" rx="2" fill="#ef4444" />
        {wheel(56, 80)}
        {wheel(184, 80)}
      </svg>
    );
  }
  const avant = face === "avant";
  return (
    <svg viewBox="0 0 160 110" className={className} style={style} aria-hidden="true">
      <ellipse cx="80" cy="101" rx="62" ry="5" fill="#0f172a" opacity=".13" />
      <rect x="16" y="62" width="17" height="32" rx="5" fill="#1e293b" />
      <rect x="127" y="62" width="17" height="32" rx="5" fill="#1e293b" />
      <rect x="12" y="40" width="16" height="9" rx="4" fill={shade} />
      <rect x="132" y="40" width="16" height="9" rx="4" fill={shade} />
      <path d="M40 50 L49 25 Q51 20 58 20 H102 Q109 20 111 25 L120 50 Z" fill={body} />
      <path d="M24 80 L24 58 Q24 49 33 48 L127 48 Q136 49 136 58 L136 80 Q136 89 126 89 H34 Q24 89 24 80 Z" fill={body} />
      <path d="M52 47 L58 27 H102 L108 47 Z" fill={glass} />
      {avant ? (
        <>
          <path d="M28 58 Q40 52 58 56 L56 67 Q40 69 28 68 Z" fill="#fef3c7" stroke={shade} strokeWidth="1.2" />
          <path d="M132 58 Q120 52 102 56 L104 67 Q120 69 132 68 Z" fill="#fef3c7" stroke={shade} strokeWidth="1.2" />
          <rect x="62" y="58" width="36" height="14" rx="4" fill="#334155" />
          <path d="M66 62 H94 M66 66 H94" stroke="#64748b" strokeWidth="1.4" />
          <rect x="34" y="75" width="92" height="11" rx="5" fill={shade} opacity=".6" />
          <rect x="56" y="78" width="48" height="5" rx="2.5" fill="#1e293b" />
        </>
      ) : (
        <>
          <path d="M28 56 L56 56 L56 66 L28 68 Z" fill="#ef4444" />
          <path d="M132 56 L104 56 L104 66 L132 68 Z" fill="#ef4444" />
          <rect x="66" y="60" width="28" height="9" rx="2" fill="#f8fafc" stroke={shade} strokeWidth="1.2" />
          <rect x="34" y="75" width="92" height="11" rx="5" fill={shade} opacity=".6" />
        </>
      )}
    </svg>
  );
}
