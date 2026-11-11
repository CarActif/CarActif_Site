/** Garantie incluse dans chaque mandat : Classique 3 mois (valeurs de repli si la base est injoignable). */
export const GARANTIE_INCLUSE_DEFAUT = {
  code: "classique",
  nom: "Classique",
  age_max: 20,
  km_max: 200000,
  plafond_eur: 1500,
  diagnostics_ttc: 60,
};

export const AVANTAGES_GARANTIE = [
  "Prise en charge des pannes mécaniques, électriques et électroniques couvertes, jusqu'à 1 500 € TTC par sinistre",
  "Diagnostics inclus jusqu'à 60 € TTC et ingrédients (huiles, liquides) aux frais réels",
  "Assistance routière 7j/7 et 24h/24",
  "Kilométrage illimité pendant la durée de la garantie, et nombre de sinistres illimité",
  "Aucune franchise, aucun délai de carence, aucune dégressivité",
  "Règlement directement auprès du réparateur",
  "Garantie valable en Europe et cessible gratuitement en cas de revente",
];

/** Retourne { eligible: true | false | null, age, km } (null = à confirmer). */
export function eligibiliteGarantie({ annee, kilometrage }, niveau = GARANTIE_INCLUSE_DEFAUT) {
  const match = annee != null ? String(annee).match(/^\d{4}/) : null;
  const anneeNum = match ? Number(match[0]) : null;
  const km = kilometrage != null && kilometrage !== "" ? Number(kilometrage) : null;
  if (anneeNum == null || km == null || Number.isNaN(km)) return { eligible: null, age: null, km };
  const age = new Date().getFullYear() - anneeNum;
  return { eligible: age <= niveau.age_max && km <= niveau.km_max, age, km };
}
