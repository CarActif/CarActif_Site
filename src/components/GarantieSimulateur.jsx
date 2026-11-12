import { useEffect, useMemo, useState } from "react";
import supabase from "../supabase";
import "./GarantieSimulateur.css";

const eur = (n) =>
  Number(n).toLocaleString("fr-FR", { minimumFractionDigits: Number.isInteger(Number(n)) ? 0 : 2, maximumFractionDigits: 2 }) + " €";

export default function GarantieSimulateur({ annee, kilometrage, marque }) {
  const [niveaux, setNiveaux] = useState(null);
  const [duree, setDuree] = useState(null);
  const [code, setCode] = useState(null);
  const [opts, setOpts] = useState([]);

  useEffect(() => {
    const a = parseInt(String(annee ?? "").slice(0, 4), 10);
    const km = Number(kilometrage);
    if (!a || !Number.isFinite(km)) return setNiveaux([]);
    let actif = true;
    supabase.rpc("garantie_simulation", { p_annee: a, p_km: km, p_marque: marque ?? null }).then(({ data, error }) => {
      if (!actif) return;
      const liste = !error && Array.isArray(data) ? data : [];
      setNiveaux(liste);
      const incl = liste.find((n) => n.incluse) || liste[0];
      if (incl) {
        setCode(incl.code);
        setDuree(incl.durees[0]?.duree ?? null);
      }
    });
    return () => { actif = false; };
  }, [annee, kilometrage, marque]);

  const dureesDispo = useMemo(
    () => [...new Set((niveaux || []).flatMap((n) => n.durees.map((d) => d.duree)))].sort((a, b) => a - b),
    [niveaux]
  );

  if (!niveaux || niveaux.length === 0) return null;

  const prixDe = (n, d) => n.durees.find((x) => x.duree === d)?.prix_ttc ?? null;
  const choisi = niveaux.find((n) => n.code === code);
  const choisiOk = choisi && prixDe(choisi, duree) != null;
  const optionsDispo = choisiOk ? choisi.options.filter((o) => o.duree === duree) : [];
  const base = choisiOk ? (choisi.incluse && duree === 3 ? 0 : prixDe(choisi, duree)) : 0;
  const total = base + optionsDispo.filter((o) => opts.includes(o.code)).reduce((s, o) => s + Number(o.prix_ttc), 0);

  const changerDuree = (d) => {
    setDuree(d);
    setOpts([]);
    if (choisi && prixDe(choisi, d) == null) {
      const alt = niveaux.find((n) => prixDe(n, d) != null);
      if (alt) setCode(alt.code);
    }
  };
  const changerNiveau = (c) => { setCode(c); setOpts([]); };

  return (
    <div className="gs">
      <div className="gs__top">
        <div>
          <h3 className="gs__title">Simulez votre garantie</h3>
          <p className="gs__sub">Prix calculé pour ce véhicule, sans franchise.</p>
        </div>
        <div className="gs__seg" role="tablist" aria-label="Durée de la garantie">
          {dureesDispo.map((d) => (
            <button key={d} type="button" role="tab" aria-selected={d === duree}
              className={d === duree ? "on" : ""} onClick={() => changerDuree(d)}>
              {d} mois
            </button>
          ))}
        </div>
      </div>

      <div className="gs__niveaux">
        {niveaux.map((n) => {
          const p = prixDe(n, duree);
          const dispo = p != null;
          const inclus = n.incluse && duree === 3;
          return (
            <button key={n.code} type="button" disabled={!dispo}
              className={"gs__niveau" + (n.code === code && dispo ? " on" : "")}
              onClick={() => changerNiveau(n.code)} aria-pressed={n.code === code && dispo}>
              <span className="gs__nom">{n.nom}</span>
              <span className="gs__plafond">{eur(n.plafond_eur)}</span>
              <span className="gs__plafond-l">de prise en charge par sinistre</span>
              <span className="gs__prix">{!dispo ? "Indisponible" : inclus ? "Incluse" : eur(p)}</span>
            </button>
          );
        })}
      </div>

      {optionsDispo.length > 0 && (
        <div className="gs__options">
          <span className="gs__opt-t">Options</span>
          {optionsDispo.map((o) => (
            <label key={o.code} className={"gs__opt" + (opts.includes(o.code) ? " on" : "")}>
              <input type="checkbox" checked={opts.includes(o.code)}
                onChange={() => setOpts((x) => (x.includes(o.code) ? x.filter((c) => c !== o.code) : [...x, o.code]))} />
              <span>{o.libelle}</span>
              <b>+ {eur(o.prix_ttc)}</b>
            </label>
          ))}
        </div>
      )}

      {choisiOk && (
        <div className="gs__total">
          <div>
            <span className="gs__total-l">Garantie {choisi.nom} · {duree} mois</span>
            <span className="gs__total-d">Diagnostics jusqu'à {eur(choisi.diagnostics_ttc)} · assistance 24h/24</span>
          </div>
          <strong>{total === 0 ? "Incluse" : eur(total)}</strong>
        </div>
      )}
      <p className="gs__mention">
        Prix TTC indicatifs pour un véhicule standard, confirmés par votre agent. Couverture sous conditions, avec vétusté sauf option.
      </p>
    </div>
  );
}
