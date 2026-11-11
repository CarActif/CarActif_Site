import supabase from "../supabase";

export const CV_BUCKET = "candidatures-cv";
export const CV_MAX_SIZE_BYTES = 5 * 1024 * 1024;
export const CV_ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function validateCvFile(file) {
  if (!file) return null;
  if (!CV_ALLOWED_TYPES.includes(file.type)) {
    return "Format de fichier non accepté (PDF, DOC ou DOCX uniquement).";
  }
  if (file.size > CV_MAX_SIZE_BYTES) {
    return "Le fichier dépasse la taille maximale de 5 Mo.";
  }
  return null;
}

/**
 * Envoie le CV directement dans le bucket privé (policy RLS "insert public"
 * sur storage.objects) et renvoie le CHEMIN de stockage — jamais une URL
 * publique, le bucket n'en génère pas puisqu'il est privé. Le gérant y
 * accède plus tard via une URL signée depuis le CRM.
 */
export async function uploadCandidatureCv(file) {
  const error = validateCvFile(file);
  if (error) throw new Error(error);

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${crypto.randomUUID()}-${safeName}`;

  const { error: uploadError } = await supabase.storage.from(CV_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) throw uploadError;

  return path;
}
