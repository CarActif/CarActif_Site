import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../supabase";
import { GARANTIE_INCLUSE_DEFAUT, AVANTAGES_GARANTIE, eligibiliteGarantie } from "../lib/garantieInclusse";
import "./GarantieInclusse.css";

export default function GarantieInclusse({ annee, kilometrage }) {
  const [niveau, setNiveau] = useState(GARANTIE_INCLUSE_DEFAUT);

  useEffect(() => {
    let actif = true;
    supabase
      .from("garantie_niveaux")
      .select("code, nom, age_max, km_max, plafond_eur, diagnostics_ttc")
      .eq("incluse", true)
      .maybeSingle()
      .then(({ data }) => {
        if (actif && data) setNiveau(data);
      });
    return () => {
      actif = false;
    };
  }, []);

  const { eligible } = eligibiliteGarantie({ annee, kilometrage }, niveau);

  return (
    <section className="infos-cles-container glass-card garantie-incluse" aria-labelledby="garantie-incluse-title">
      <div className="garantie-incluse__head">
        <span className="garantie-incluse__badge">Incluse</span>
        <h2 id="garantie-incluse-title" className="garantie-incluse__title">Garantie mécanique 3 mois</h2>
      </div>

      {eligible === false ? (
        <p className="garantie-incluse__alerte">
          Ce véhicule dépasse les limites de la garantie incluse (jusqu'à {niveau.age_max} ans et{" "}
          {Number(niveau.km_max).toLocaleString("fr-FR")} km). Votre agent vous indique les solutions possibles.
        </p>
      ) : (
        <>
          {eligible === null && (
            <p className="garantie-incluse__alerte">Éligibilité à confirmer avec l'agent CarActif.</p>
          )}
          <ul className="garantie-incluse__liste">
            {AVANTAGES_GARANTIE.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </>
      )}

      <p className="garantie-incluse__extension">
        Une extension de garantie (durée plus longue ou niveau de couverture supérieur) peut être proposée
        par votre agent, selon l'âge et le kilométrage du véhicule.
      </p>
      <Link to="/garantie" className="link-accent">Voir le détail de la garantie</Link>
      <p className="garantie-incluse__mention">
        Couverture sous conditions, avec vétusté. Les conditions générales et particulières sont remises à l'acheteur.
      </p>
    </section>
  );
}
