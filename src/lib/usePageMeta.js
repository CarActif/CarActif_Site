import { useEffect } from "react";

const SUFFIXE = "CarActif";

/** Met à jour le titre de l'onglet et la meta description de la page courante. */
export default function usePageMeta(titre, description) {
  useEffect(() => {
    document.title = titre ? `${titre} | ${SUFFIXE}` : SUFFIXE;
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }
  }, [titre, description]);
}
