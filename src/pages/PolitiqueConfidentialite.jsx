import usePageMeta from "../lib/usePageMeta";
import "./PolitiqueConfidentialite.css";

export default function PolitiqueConfidentialite() {
  usePageMeta("Politique de confidentialité", "Comment CarActif collecte, utilise et protège vos données personnelles.");
  return (
    <div className="politique-page glass-card">
      <h1>Politique de confidentialité</h1>

      <section>
        <h2>Responsable du traitement</h2>
        <p>
          <strong>CarActif</strong>, SARL unipersonnelle, Dunkerque (59).<br />
          Contact : contact@caractif.fr
        </p>
      </section>

      <section>
        <h2>Données collectées</h2>
        <ul>
          <li><strong>Formulaire de contact</strong> : nom, prénom, téléphone, adresse e-mail, code postal ou département, message facultatif.</li>
          <li><strong>Estimation en ligne</strong> : plaque d'immatriculation, kilométrage, caractéristiques du véhicule, et vos coordonnées si vous demandez à être rappelé.</li>
          <li><strong>Candidatures</strong> : coordonnées, message et CV que vous choisissez de nous transmettre.</li>
        </ul>
      </section>

      <section>
        <h2>Finalités et base légale</h2>
        <p>
          Vos données servent uniquement à répondre à votre demande : vous recontacter au sujet d'une estimation ou de la vente
          d'un véhicule, ou étudier votre candidature. La base légale est votre consentement, recueilli au moment de l'envoi du
          formulaire. Elles ne sont ni revendues ni transmises à des tiers à des fins commerciales.
        </p>
      </section>

      <section>
        <h2>Destinataires et sous-traitants</h2>
        <p>
          Vos données sont accessibles aux équipes CarActif concernées par votre demande (commercial de votre secteur, gérant).
          Elles sont hébergées par nos prestataires techniques, Supabase (base de données) et Vercel (site), qui agissent
          comme sous-traitants.
        </p>
      </section>

      <section>
        <h2>Durée de conservation</h2>
        <ul>
          <li>Demandes de contact et d'estimation : 3 ans à compter du dernier échange avec vous.</li>
          <li>Candidatures non retenues : 2 ans maximum, sauf demande de suppression plus rapide.</li>
        </ul>
      </section>

      <section>
        <h2>Vos droits</h2>
        <p>
          Conformément au Règlement général sur la protection des données (RGPD), vous disposez d'un droit d'accès,
          de rectification, d'effacement, de limitation et d'opposition, ainsi que du droit de retirer votre consentement à tout
          moment. Pour les exercer, écrivez à contact@caractif.fr. Vous pouvez aussi introduire une réclamation auprès de la CNIL (cnil.fr).
        </p>
      </section>
    </div>
  );
}
