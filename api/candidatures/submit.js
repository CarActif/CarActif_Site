// Fonction serverless Vercel — valide et enregistre une candidature dans Supabase.
// Le CV (s'il y en a un) a déjà été envoyé directement au bucket Storage
// `candidatures-cv` par le client (src/lib/uploadCandidatureCv.js) AVANT cet
// appel : on ne reçoit ici que le chemin de stockage (`cvPath`), jamais le
// fichier lui-même — évite la limite de taille du corps des fonctions Vercel.
import { createClient } from "@supabase/supabase-js";
import { createHmac } from "crypto";

const rawUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseUrl = (rawUrl || "").replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
const rateLimitSalt = process.env.RATE_LIMIT_SALT || supabaseAnonKey || "caractif-candidature";

const RATE_LIMIT_WINDOW_MINUTES = 10;
const RATE_LIMIT_MAX_PER_WINDOW = 3;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhoneFR(phone) {
  return /^(0[1-9]\d{8}|\+33[1-9]\d{8})$/.test((phone || "").replace(/[\s.\-]/g, ""));
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value || "");
}

function hashIp(ip) {
  return createHmac("sha256", rateLimitSalt).update(ip).digest("hex");
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
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
  const { nom, telephone, email, message, posteId, cvPath, societeSite } = body;

  // Honeypot : voir ContactForm.jsx pour l'explication du pattern.
  if (societeSite) {
    return res.status(200).json({ success: true });
  }

  if (!nom || typeof nom !== "string" || !nom.trim()) {
    return res.status(400).json({ success: false, error: "Le nom est requis." });
  }
  if (!telephone || !isValidPhoneFR(telephone)) {
    return res
      .status(400)
      .json({ success: false, error: "Numéro de téléphone invalide (format français attendu)." });
  }
  if (email && !isValidEmail(email)) {
    return res.status(400).json({ success: false, error: "Adresse email invalide." });
  }
  if (posteId && !isUuid(posteId)) {
    return res.status(400).json({ success: false, error: "Poste invalide." });
  }
  if (cvPath && typeof cvPath !== "string") {
    return res.status(400).json({ success: false, error: "Fichier CV invalide." });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  if (posteId) {
    const { data: poste } = await supabase
      .from("postes")
      .select("id, statut")
      .eq("id", posteId)
      .maybeSingle();
    if (!poste || poste.statut !== "ouvert") {
      return res.status(400).json({ success: false, error: "Ce poste n'est plus disponible." });
    }
  }

  const ip = getClientIp(req);
  const ipHash = hashIp(ip);
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();

  const { count, error: countError } = await supabase
    .from("candidatures")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", windowStart);

  if (!countError && count !== null && count >= RATE_LIMIT_MAX_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      error: "Trop de candidatures envoyées récemment. Merci de réessayer dans quelques minutes.",
    });
  }

  // Pas de .select() après l'insert, même raison que api/contact/submit.js : la policy
  // "candidatures_all_gerant" ne donne de lecture qu'au gérant, jamais à un visiteur anonyme.
  // Demander la ligne en retour ferait échouer l'insertion entière (RLS), et donner SELECT à
  // anon exposerait les candidatures (dont le CV) de tout le monde à n'importe qui.
  const { error } = await supabase.from("candidatures").insert({
    poste_id: posteId || null,
    nom: nom.trim(),
    telephone: telephone.trim(),
    email: email && typeof email === "string" ? email.trim() : null,
    message: typeof message === "string" && message.trim() ? message.trim() : null,
    cv_path: cvPath || null,
    ip_hash: ipHash,
  });

  if (error) {
    console.error("Erreur insertion candidature:", error);
    return res.status(500).json({ success: false, error: "Impossible d'enregistrer votre candidature. Réessayez." });
  }

  return res.status(200).json({ success: true });
}
