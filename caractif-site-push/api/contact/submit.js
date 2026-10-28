// Fonction serverless Vercel — valide et enregistre une demande de contact dans Supabase.
// Même convention que api/leads/submit.js : clé anon, c'est la policy RLS "INSERT only"
// sur demandes_contact qui protège les données, pas le secret de la clé.
import { createClient } from "@supabase/supabase-js";
import { createHmac } from "crypto";

const rawUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseUrl = (rawUrl || "").replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
const rateLimitSalt = process.env.RATE_LIMIT_SALT || supabaseAnonKey || "caractif-contact";

const RATE_LIMIT_WINDOW_MINUTES = 10;
const RATE_LIMIT_MAX_PER_WINDOW = 3;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhoneFR(phone) {
  const cleaned = (phone || "").replace(/[\s.\-]/g, "");
  return /^(0[1-9]\d{8}|\+33[1-9]\d{8})$/.test(cleaned);
}

function isValidCodePostal(cp) {
  return /^\d{5}$/.test((cp || "").trim());
}

function isValidDepartement(dept) {
  return /^(\d{2,3}|2A|2B)$/.test((dept || "").trim().toUpperCase());
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
  const {
    nom,
    prenom,
    telephone,
    email,
    codePostal,
    departement,
    message,
    consentementRgpd,
    // Honeypot : champ invisible côté humain (voir ContactForm.jsx). Un bot qui
    // remplit tous les champs d'un formulaire le remplira aussi ; un humain ne
    // le voit jamais et le laisse vide.
    societeSite,
  } = body;

  // Honeypot déclenché : on répond succès (pour ne pas renseigner le bot sur
  // la détection) mais on n'écrit rien en base.
  if (societeSite) {
    return res.status(200).json({ success: true });
  }

  if (!nom || typeof nom !== "string" || !nom.trim()) {
    return res.status(400).json({ success: false, error: "Le nom est requis." });
  }
  if (!prenom || typeof prenom !== "string" || !prenom.trim()) {
    return res.status(400).json({ success: false, error: "Le prénom est requis." });
  }
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ success: false, error: "Adresse email invalide." });
  }
  if (!telephone || !isValidPhoneFR(telephone)) {
    return res
      .status(400)
      .json({ success: false, error: "Numéro de téléphone invalide (format français attendu)." });
  }

  const cp = typeof codePostal === "string" ? codePostal.trim() : "";
  const dept = typeof departement === "string" ? departement.trim() : "";
  const hasCp = cp.length > 0;
  const hasDept = dept.length > 0;

  if (!hasCp && !hasDept) {
    return res
      .status(400)
      .json({ success: false, error: "Merci de renseigner un code postal ou un département." });
  }
  if (hasCp && !isValidCodePostal(cp)) {
    return res.status(400).json({ success: false, error: "Code postal invalide (5 chiffres attendus)." });
  }
  if (hasDept && !isValidDepartement(dept)) {
    return res.status(400).json({ success: false, error: "Département invalide." });
  }
  if (!consentementRgpd) {
    return res
      .status(400)
      .json({ success: false, error: "Merci d'accepter la politique de confidentialité pour continuer." });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const ip = getClientIp(req);
  const ipHash = hashIp(ip);
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();

  const { count, error: countError } = await supabase
    .from("demandes_contact")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", windowStart);

  if (!countError && count !== null && count >= RATE_LIMIT_MAX_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      error: "Trop de demandes envoyées récemment. Merci de réessayer dans quelques minutes.",
    });
  }

  // Pas de .select() après l'insert : la policy RLS "demandes_contact_select_authenticated"
  // n'autorise que les commerciaux/gérant à relire la table, jamais un visiteur anonyme.
  // Si on demandait la ligne en retour (.select().single()), PostgREST doit la relire pour
  // la renvoyer, cette relecture est bloquée par la RLS, et Postgres rejette l'INSERT entier
  // avec "new row violates row-level security policy" — alors que l'insertion elle-même est
  // parfaitement autorisée. Donner SELECT à anon pour contourner exposerait les coordonnées
  // de tous les visiteurs à n'importe qui : hors de question, on se contente de l'insertion.
  const { error } = await supabase.from("demandes_contact").insert({
    nom: nom.trim(),
    prenom: prenom.trim(),
    telephone: telephone.trim(),
    email: email.trim(),
    code_postal: hasCp ? cp : null,
    departement: hasDept ? dept.toUpperCase() : null,
    message: typeof message === "string" && message.trim() ? message.trim() : null,
    ip_hash: ipHash,
  });

  if (error) {
    console.error("Erreur insertion demande de contact:", error);
    return res.status(500).json({ success: false, error: "Impossible d'enregistrer votre demande. Réessayez." });
  }

  return res.status(200).json({ success: true });
}
