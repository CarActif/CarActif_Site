/**
 * Libellé court pour les cartes véhicules (BVM / BVA).
 * Retourne null si la valeur est absente — l'appelant peut masquer le badge.
 */
export function formatBoiteVitesse(value) {
  if (value == null || String(value).trim() === "") {
    return null;
  }

  const normalized = String(value).trim().toLowerCase();

  if (/auto|bva|dsg|edc|cvt|tiptronic|robot/i.test(normalized)) {
    return "BVA";
  }
  if (/manuel|bvm|mécan|mecan/i.test(normalized)) {
    return "BVM";
  }
  if (/séquent|sequent|seq/i.test(normalized)) {
    return "Séq.";
  }

  return String(value).trim();
}

export function getBoiteVitesseFromVehicle(vehicle) {
  return formatBoiteVitesse(vehicle?.boite_vitesse ?? vehicle?.boite);
}
