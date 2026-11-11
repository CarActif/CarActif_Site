/** Colonnes utilisées par les listes / cartes véhicules */
export const MANDAT_CARD_SELECT = [
  "id",
  "marque",
  "modele",
  "annee",
  "energie",
  "carburant",
  "kilometrage",
  "boite_vitesse",
  "prix_affiche",
  "photo_url",
  "statut",
  "finition",
  "motorisation",
  "version",
  "puissance",
  "agent_id",
  "date_ajout",
  "departement",
].join(", ");

/**
 * Extrait l'année (nombre) depuis vehicle.annee, qui peut être stocké soit comme
 * une année seule (ex: 2015), soit comme une date complète (ex: "2015-06-15").
 * IMPORTANT : ne jamais faire `new Date(annee).getFullYear()` directement — si
 * `annee` est déjà un nombre (ex: 2015), `new Date(2015)` l'interprète comme
 * 2015 millisecondes après le 1er janvier 1970, ce qui donne l'année 1970.
 */
export function getAnneeYear(annee) {
  if (annee === null || annee === undefined || annee === "") return null;
  const match = String(annee).match(/^\d{4}/);
  return match ? Number(match[0]) : null;
}
