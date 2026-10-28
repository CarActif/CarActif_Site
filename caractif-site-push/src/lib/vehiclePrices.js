// Table de correspondance marque + modèle + motorisation → prix neuf approximatif (France).
// Sert de base au calcul d'estimation (voir estimationCalculator.js).
// Les prix sont des ordres de grandeur (catalogue constructeur, TTC, hors option) et sont
// volontairement approximatifs : cette page fournit une estimation indicative, pas un chiffrage officiel.

export const VEHICLE_PRICES = [
  // Renault Clio
  { marque: "Renault", modele: "Clio", motorisationMatch: ["tce 90", "sce 65", "tce 65"], prixNeufApprox: 19000 },
  { marque: "Renault", modele: "Clio", motorisationMatch: ["tce 130", "gt line"], prixNeufApprox: 22500 },
  { marque: "Renault", modele: "Clio", motorisationMatch: ["e-tech", "hybride", "hybrid"], prixNeufApprox: 24500 },

  // Peugeot 208
  { marque: "Peugeot", modele: "208", motorisationMatch: ["puretech 75", "puretech 100"], prixNeufApprox: 19500 },
  { marque: "Peugeot", modele: "208", motorisationMatch: ["puretech 130", "gt"], prixNeufApprox: 24000 },
  { marque: "Peugeot", modele: "208", motorisationMatch: ["e-208", "electrique", "électrique"], prixNeufApprox: 34000 },

  // Peugeot 308
  { marque: "Peugeot", modele: "308", motorisationMatch: ["puretech 130"], prixNeufApprox: 27000 },
  { marque: "Peugeot", modele: "308", motorisationMatch: ["bluehdi", "diesel"], prixNeufApprox: 29000 },
  { marque: "Peugeot", modele: "308", motorisationMatch: ["hybrid 225", "hybride rechargeable"], prixNeufApprox: 37000 },

  // Citroën C3
  { marque: "Citroen", modele: "C3", motorisationMatch: ["puretech 83"], prixNeufApprox: 18500 },
  { marque: "Citroen", modele: "C3", motorisationMatch: ["puretech 110"], prixNeufApprox: 21000 },

  // Mercedes Classe A
  { marque: "Mercedes-Benz", modele: "Classe A", motorisationMatch: ["180", "a 180"], prixNeufApprox: 38000 },
  { marque: "Mercedes-Benz", modele: "Classe A", motorisationMatch: ["200 cdi", "200 d", "a 200"], prixNeufApprox: 42000 },
  { marque: "Mercedes-Benz", modele: "Classe A", motorisationMatch: ["250 amg", "amg line", "a 250"], prixNeufApprox: 52000 },

  // Volkswagen Golf
  { marque: "Volkswagen", modele: "Golf", motorisationMatch: ["tsi 110"], prixNeufApprox: 29000 },
  { marque: "Volkswagen", modele: "Golf", motorisationMatch: ["tdi 115", "tdi"], prixNeufApprox: 32000 },
  { marque: "Volkswagen", modele: "Golf", motorisationMatch: ["gti"], prixNeufApprox: 42000 },

  // Dacia Sandero
  { marque: "Dacia", modele: "Sandero", motorisationMatch: ["tce 90"], prixNeufApprox: 15000 },
  { marque: "Dacia", modele: "Sandero", motorisationMatch: ["stepway"], prixNeufApprox: 17500 },

  // Ford Fiesta
  { marque: "Ford", modele: "Fiesta", motorisationMatch: ["ecoboost 100"], prixNeufApprox: 20000 },
  { marque: "Ford", modele: "Fiesta", motorisationMatch: ["st"], prixNeufApprox: 27000 },

  // BMW Série 1
  { marque: "BMW", modele: "Serie 1", motorisationMatch: ["116i"], prixNeufApprox: 32000 },
  { marque: "BMW", modele: "Serie 1", motorisationMatch: ["118d"], prixNeufApprox: 36000 },
  { marque: "BMW", modele: "Serie 1", motorisationMatch: ["m135i"], prixNeufApprox: 48000 },

  // Audi A3
  { marque: "Audi", modele: "A3", motorisationMatch: ["30 tfsi"], prixNeufApprox: 33000 },
  { marque: "Audi", modele: "A3", motorisationMatch: ["35 tdi"], prixNeufApprox: 37000 },
  { marque: "Audi", modele: "A3", motorisationMatch: ["s line", "35 tfsi"], prixNeufApprox: 39000 },

  // Toyota Yaris
  { marque: "Toyota", modele: "Yaris", motorisationMatch: ["vvt-i 70", "essence"], prixNeufApprox: 18000 },
  { marque: "Toyota", modele: "Yaris", motorisationMatch: ["hybrid 116", "hybride"], prixNeufApprox: 23500 },
];

// Segments utilisés pour l'estimation par défaut quand la marque/le modèle n'est pas dans la table.
const SEGMENT_DEFAULT_PRICE = {
  citadine: 19000,
  compacte: 29000,
  premium: 42000,
};

const MARQUE_SEGMENT_HINT = {
  renault: "citadine",
  peugeot: "compacte",
  citroen: "citadine",
  dacia: "citadine",
  ford: "citadine",
  toyota: "citadine",
  volkswagen: "compacte",
  audi: "compacte",
  bmw: "premium",
  "mercedes-benz": "premium",
  mercedes: "premium",
};

const FALLBACK_PRICE = 22000; // aucune marque reconnue : moyenne toutes catégories confondues

function normalize(str) {
  return (str || "")
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Cherche le prix neuf approximatif d'un véhicule à partir de sa marque, son modèle
 * et sa motorisation (telle que retournée par l'API d'identification par plaque).
 *
 * @returns {{ prix: number, exact: boolean }} `exact` vaut false quand la marque/le modèle
 *   n'a pas été trouvé dans la table et qu'on est retombé sur une moyenne de segment.
 */
export function findPrixNeuf(marque, modele, motorisation) {
  const nMarque = normalize(marque);
  const nModele = normalize(modele);
  const nMoto = normalize(motorisation);

  const candidates = VEHICLE_PRICES.filter((entry) => {
    const eMarque = normalize(entry.marque);
    const eModele = normalize(entry.modele);
    if (eMarque !== nMarque) return false;
    return eModele === nModele || (nModele && (nModele.includes(eModele) || eModele.includes(nModele)));
  });

  if (candidates.length === 0) {
    const segment = MARQUE_SEGMENT_HINT[nMarque];
    const prix = segment ? SEGMENT_DEFAULT_PRICE[segment] : FALLBACK_PRICE;
    return { prix, exact: false };
  }

  let best = null;
  let bestScore = 0;
  for (const entry of candidates) {
    const score = entry.motorisationMatch.reduce(
      (acc, kw) => (nMoto && nMoto.includes(normalize(kw)) ? acc + 1 : acc),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (best) {
    return { prix: best.prixNeufApprox, exact: true };
  }

  // Marque/modèle reconnus mais motorisation non identifiable précisément :
  // on moyenne les motorisations connues de ce modèle (plus précis qu'un segment générique).
  const avg = Math.round(candidates.reduce((sum, e) => sum + e.prixNeufApprox, 0) / candidates.length);
  return { prix: avg, exact: true };
}
