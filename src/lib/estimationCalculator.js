// Calcul de l'estimation de reprise à partir du prix neuf approximatif, de l'âge
// et du kilométrage du véhicule. Fonction pure, aucune dépendance externe.

/**
 * @typedef {Object} EstimationResult
 * @property {number} min
 * @property {number} moy
 * @property {number} max
 * @property {number} prixNeufUtilise
 * @property {boolean} estimationApproximative - true si le modèle exact n'était pas dans notre base
 */

/**
 * @param {number} prixNeuf
 * @param {number} annee
 * @param {number} kilometrage
 * @param {boolean} estimationApproximative
 * @returns {EstimationResult}
 */
export function calculateEstimation(prixNeuf, annee, kilometrage, estimationApproximative) {
  const anneeActuelle = new Date().getFullYear();
  const anciennete = Math.max(1, anneeActuelle - annee);

  let prix = prixNeuf;
  prix *= 0.85; // décote première année -15%
  if (anciennete > 1) {
    prix *= Math.pow(0.9, anciennete - 1); // -10%/an ensuite
  }

  const kmRefParAn = 15000;
  const kmRef = kmRefParAn * anciennete;
  const surKm = Math.max(0, kilometrage - kmRef);
  prix -= surKm * 0.1;

  prix = Math.max(prix, prixNeuf * 0.05); // plancher à 5% du prix neuf pour éviter des valeurs négatives/absurdes

  return {
    min: Math.round(prix * 0.85),
    moy: Math.round(prix),
    max: Math.round(prix * 1.15),
    prixNeufUtilise: prixNeuf,
    estimationApproximative,
  };
}
