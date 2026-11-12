import { useEffect, useMemo, useState } from "react";
import { ScanSearch, X, ChevronLeft, ChevronRight } from "lucide-react";
import CarFace from "./CarFace";
import "./DefautsVehicule.css";

const FACES = [
  { id: "gauche", label: "Côté gauche" },
  { id: "droite", label: "Côté droit" },
  { id: "avant", label: "Avant" },
  { id: "arriere", label: "Arrière" },
];

export default function DefautsVehicule({ defauts }) {
  const src = defauts && typeof defauts === "object" && !Array.isArray(defauts) ? defauts : {};
  const info = useMemo(() => {
    const o = {};
    for (const f of FACES) {
      const d = src[f.id] || {};
      const photos = Array.isArray(d.photos) ? d.photos.filter((p) => p && p.url) : [];
      o[f.id] = { actif: !!d.actif, note: d.note || "", photos };
    }
    return o;
  }, [defauts]); // eslint-disable-line react-hooks/exhaustive-deps
  const nbFaces = FACES.filter((f) => info[f.id].actif).length;
  const premiere = FACES.find((f) => info[f.id].actif)?.id ?? null;
  const [face, setFace] = useState(premiere);
  const [zoom, setZoom] = useState(null);

  useEffect(() => { setFace(premiere); }, [premiere]);
  const photosFace = face ? info[face].photos : [];

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


  const cur = face ? info[face] : null;

  return (
    <section className="vp-carte dv">
      <h2 className="vp-carte__titre"><ScanSearch size={20} aria-hidden="true" />Défauts apparents</h2>
      <p className="dv-intro">
        {nbFaces === 0
          ? "Chez CarActif, on joue la transparence : aucun défaut apparent signalé sur ce véhicule."
          : `Chez CarActif, on joue la transparence : ${nbFaces === 1 ? "1 face présente" : `${nbFaces} faces présentent`} un défaut. Touchez une face pour le voir.`}
      </p>

      <div className="dv-faces">
        {FACES.map((f) => {
          const actif = info[f.id].actif;
          const n = info[f.id].photos.length;
          return (
            <button key={f.id} type="button" disabled={!actif}
              className={"dv-face" + (actif ? " dv-face--defaut" : " dv-face--ras") + (f.id === face && actif ? " on" : "")}
              onClick={() => { setFace(f.id); setZoom(null); }}
              aria-pressed={f.id === face && actif}
              aria-label={actif ? `${f.label} : défaut signalé` : `${f.label} : rien à signaler`}>
              <span className="dv-visuel">
                <CarFace face={f.id} className="dv-icone" body={actif ? "#fdba74" : "#cbd5e1"} shade={actif ? "#ea580c" : "#94a3b8"} />
              </span>
              <span className="dv-nom">{f.label}</span>
              {actif ? <span className="dv-etat">Défaut signalé</span> : <span className="dv-ras">Rien à signaler</span>}
              {actif && n > 0 && <span className="dv-badge">{n}</span>}
            </button>
          );
        })}
      </div>

      {cur && cur.actif && (cur.note || cur.photos.length === 0) && (
        <p className="dv-note">{cur.note || "Défaut signalé, votre agent vous donne le détail."}</p>
      )}

      {photosFace.length > 0 && (
        <ul className="dv-photos">
          {photosFace.map((d, i) => (
            <li key={d.url + i}>
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
