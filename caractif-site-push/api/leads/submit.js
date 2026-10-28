// Fonction serverless Vercel — valide et enregistre un lead d'estimation dans Supabase.
// Utilise la clé anon (comme le reste du site) : c'est la policy RLS "INSERT only" sur
// estimations_leads qui empêche un client de lire les leads des autres, pas le secret de la clé.
import { createClient } from "@supabase/supabase-js";

const rawUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseUrl = (rawUrl || "").replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhoneFR(phone) {
  const cleaned = (phone || "").replace(/[\s.\-]/g, "");
  return /^(0[1-9]\d{8}|\+33[1-9]\d{8})$/.test(cleaned);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Méthode non autorisée." });
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquantes côté serveur.");
    return res.status(500).json({ success: false, error: "Service momentanément indisponible." });
  }

  const body = req.body || {};
  const {
    plaque,
    marque,
    modele,
    annee,
    motorisation,
    energie,
    transmission,
    puissanceCh,
    kilometrage,
    estimationMin,
    estimationMoy,
    estimationMax,
    nom,
    email,
    telephone,
  } = body;

  if (!plaque || typeof plaque !== "string") {
    return res.status(400).json({ success: false, error: "Plaque manquante." });
  }
  if (!nom || typeof nom !== "string" || !nom.trim()) {
    return res.status(400).json({ success: false, error: "Le nom est requis." });
  }
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ success: false, error: "Adresse email invalide." });
  }
  if (!telephone || !isValidPhoneFR(telephone)) {
    return res
      .status(400)
      .json({ success: false, error: "Numéro de téléphone invalide (format français attendu)." });
  }

  const km = Number(kilometrage);
  if (!Number.isFinite(km) || km < 0 || km > 500000) {
    return res.status(400).json({ success: false, error: "Kilométrage invalide." });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase
    .from("estimations_leads")
    .insert({
      plaque,
      marque: marque || null,
      modele: modele || null,
      annee: annee ? Number(annee) : null,
      motorisation: motorisation || null,
      energie: energie || null,
      transmission: transmission || null,
      puissance_ch: puissanceCh ? Number(puissanceCh) : null,
      kilometrage: km,
      estimation_min: estimationMin ?? null,
      estimation_moy: estimationMoy ?? null,
      estimation_max: estimationMax ?? null,
      nom: nom.trim(),
      email: email.trim(),
      telephone: telephone.trim(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("Erreur insertion lead estimation:", error);
    return res.status(500).json({ success: false, error: "Impossible d'enregistrer votre demande. Réessayez." });
  }

  return res.status(200).json({ success: true, leadId: data.id });
}
