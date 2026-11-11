// Fonction serverless Vercel — identifie un véhicule à partir de sa plaque.
// La clé RapidAPI (PLAQUE_API_KEY) reste ici, côté serveur : jamais exposée au navigateur.
// IMPORTANT : ne renomme jamais ces variables avec le préfixe VITE_, sinon Vite les inclut
// dans le bundle client et la clé devient publique.

const FORMAT_SIV = /^[A-Z]{2}[0-9]{3}[A-Z]{2}$/; // format actuel : AA-123-AA
const FORMAT_FNI = /^[0-9]{1,4}[A-Z]{1,3}[0-9]{2,3}$/; // ancien format : 123-ABC-12 (approximatif)

function cleanPlaque(raw) {
  return (raw || "").toString().trim().toUpperCase().replace(/[\s-]/g, "");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Méthode non autorisée." });
  }

  const { plaque } = req.body || {};
  const cleaned = cleanPlaque(plaque);

  if (!cleaned) {
    return res.status(400).json({ success: false, error: "Plaque manquante." });
  }

  if (!FORMAT_SIV.test(cleaned) && !FORMAT_FNI.test(cleaned)) {
    return res.status(400).json({
      success: false,
      error: "Format de plaque invalide. Utilisez le format AA-123-AA ou 123-ABC-12.",
    });
  }

  const apiUrl = process.env.PLAQUE_API_URL;
  const apiKey = process.env.PLAQUE_API_KEY;
  const apiHost = process.env.PLAQUE_API_HOST;

  if (!apiUrl || !apiKey || !apiHost) {
    console.error("Variables PLAQUE_API_URL / PLAQUE_API_KEY / PLAQUE_API_HOST manquantes côté serveur.");
    return res.status(500).json({ success: false, error: "Service d'identification indisponible." });
  }

  const formatted = FORMAT_SIV.test(cleaned)
    ? `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5, 7)}`
    : cleaned;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${apiUrl}/?plaque=${encodeURIComponent(formatted)}`, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": apiHost,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 404) {
      return res.status(404).json({ success: false, error: "Plaque non trouvée. Vérifiez la saisie." });
    }

    if (!response.ok) {
      return res
        .status(502)
        .json({ success: false, error: "Le service d'identification est momentanément indisponible." });
    }

    const raw = await response.json();

    // NOTE : la forme exacte de la réponse RapidAPI n'a pas pu être vérifiée ici (pas d'appel réel
    // effectué). Ce mapping couvre les noms de champs les plus probables — à ajuster après un premier
    // test avec une vraie plaque (voir les étapes manuelles en fin de réponse).
    const data = {
      marque: raw.marque || raw.brand || raw.make || null,
      modele: raw.modele || raw.model || null,
      annee: raw.annee ? Number(raw.annee) : raw.year ? Number(raw.year) : null,
      motorisation: raw.motorisation || raw.version || raw.finition || null,
      energie: raw.energie || raw.energy || raw.carburant || raw.fuel || null,
      transmission: raw.boite_vitesse || raw.transmission || raw.gearbox || null,
      puissanceCh: raw.puissance_ch
        ? Number(raw.puissance_ch)
        : raw.horsepower
        ? Number(raw.horsepower)
        : null,
    };

    if (!data.marque || !data.modele) {
      return res.status(502).json({ success: false, error: "Réponse du service d'identification incomplète." });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      return res
        .status(504)
        .json({ success: false, error: "Le service d'identification met trop de temps à répondre." });
    }
    console.error("Erreur identification plaque:", err);
    return res.status(500).json({ success: false, error: "Erreur lors de l'identification du véhicule." });
  }
}
