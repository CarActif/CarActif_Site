import { useEffect, useMemo, useState } from "react";
import { ScanSearch, X, ChevronLeft, ChevronRight } from "lucide-react";
import "./DefautsVehicule.css";

const FACES = [
  { id: "gauche", label: "Côté gauche" },
  { id: "droite", label: "Côté droit" },
  { id: "avant", label: "Avant" },
  { id: "arriere", label: "Arrière" },
];

function Voiture({ face }) {
  const props = { fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  if (face === "avant" || face === "arriere") {
    return (
      <svg viewBox="0 0 80 56" className="dv-icone" {...props}>
        <path d="M16 24 L22 10 Q23 8 26 8 H54 Q57 8 58 10 L64 24" />
        <rect x="8" y="24" width="64" height="20" rx="6" />
        <path d="M20 24 L24 14 H56 L60 24" />
        <circle cx="19" cy="34" r="3.2" fill={face === "avant" ? "currentColor" : "none"} />
        <circle cx="61" cy="34" r="3.2" fill={face === "avant" ? "currentColor" : "none"} />
        <path d="M32 36 H48" />
        <rect x="12" y="44" width="10" height="8" rx="2" />
        <rect x="58" y="44" width="10" height="8" rx="2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 56" className="dv-icone" {...props} style={face === "droite" ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M6 38 V30 Q6 26 10 25 L28 22 L40 10 Q42 8 46 8 H78 Q82 8 85 11 L96 22 L110 25 Q114 26 114 30 V38 Q114 41 111 41 H104" />
      <path d="M16 41 H34 M82 41 H88" />
      <path d="M40 22 L48 12 H62 V22 Z M66 22 V12 H78 L88 22 Z" />
      <circle cx="26" cy="41" r="9" />
      <circle cx="96" cy="41" r="9" />
    </svg>
  );
}

export default function DefautsVehicule({ defauts }) {
  const liste = useMemo(
    () => (Array.isArray(defauts) ? defauts.filter((d) => d && d.url && FACES.some((f) => f.id === d.face)) : []),
    [defauts]
  );
  const premiere = FACES.find((f) => liste.some((d) => d.face === f.id))?.id ?? null;
  const [face, setFace] = useState(premiere);
  const [zoom, setZoom] = useState(null); // index dans photosFace

  useEffect(() => { setFace(premiere); }, [premiere]);
  const photosFace = liste.filter((d) => d.face === face);

  useEffect(() => {
    if (zoom == null) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setZoom(null);
      if (e.key === "ArrowRight") setZoom((i) => (i + 1) % photosFace.length);
      if (e.key === "ArrowLeft") setZoom((i) => (i - 1 + photosFace.length) % photosFace.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom, photosFace.length]);

  if (liste.length === 0) return null;
  const nb = liste.length;

  return (
    <section className="vp-carte dv">
      <h2 className="vp-carte__titre"><ScanSearch size={20} aria-hidden="true" />Défauts apparents</h2>
      <p className="dv-intro">
        Chez CarActif, on joue la transparence : {nb} défaut{nb > 1 ? "s" : ""} signalé{nb > 1 ? "s" : ""} sur ce véhicule.
        Touchez une face pour voir les photos.
      </p>

      <div className="dv-faces">
        {FACES.map((f) => {
          const n = liste.filter((d) => d.face === f.id).length;
          const actif = n > 0;
          return (
            <button key={f.id} type="button" disabled={!actif}
              className={"dv-face" + (actif ? " dv-face--defaut" : " dv-face--ras") + (f.id === face && actif ? " on" : "")}
              onClick={() => { setFace(f.id); setZoom(null); }}
              aria-pressed={f.id === face && actif}
              aria-label={actif ? `${f.label} : ${n} défaut${n > 1 ? "s" : ""}` : `${f.label} : rien à signaler`}>
              <span className="dv-visuel"><Voiture face={f.id} /></span>
              <span className="dv-nom">{f.label}</span>
              {actif ? <span className="dv-badge">{n}</span> : <span className="dv-ras">Rien à signaler</span>}
            </button>
          );
        })}
      </div>

      {photosFace.length > 0 && (
        <ul className="dv-photos">
          {photosFace.map((d, i) => (
            <li key={d.id || i}>
              <button type="button" className="dv-photo" onClick={() => setZoom(i)}>
                <img src={d.url} alt={d.note || "Défaut apparent"} loading="lazy" />
                {d.note && <span>{d.note}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}

      {zoom != null && photosFace[zoom] && (
        <div className="dv-lightbox" role="dialog" aria-modal="true" onClick={() => setZoom(null)}>
          <button type="button" className="dv-x" aria-label="Fermer" onClick={() => setZoom(null)}><X size={22} /></button>
          {photosFace.length > 1 && (
            <button type="button" className="dv-nav dv-nav--g" aria-label="Précédente"
              onClick={(e) => { e.stopPropagation(); setZoom((zoom - 1 + photosFace.length) % photosFace.length); }}><ChevronLeft size={26} /></button>
          )}
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={photosFace[zoom].url} alt={photosFace[zoom].note || "Défaut apparent"} />
            {photosFace[zoom].note && <figcaption>{photosFace[zoom].note}</figcaption>}
          </figure>
          {photosFace.length > 1 && (
            <button type="button" className="dv-nav dv-nav--d" aria-label="Suivante"
              onClick={(e) => { e.stopPropagation(); setZoom((zoom + 1) % photosFace.length); }}><ChevronRight size={26} /></button>
          )}
        </div>
      )}
    </section>
  );
}
