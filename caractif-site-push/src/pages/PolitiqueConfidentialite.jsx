import './PolitiqueConfidentialite.css';

export default function PolitiqueConfidentialite() {
  return (
    <div className="politique-page glass-card">
      <h1>Politique de confidentialité</h1>

      <p className="politique-draft-notice">
        Page en version minimale, en attente de relecture juridique complète par CarActif —
        les informations ci-dessous sont correctes mais peuvent être complétées.
      </p>

      <section>
        <h2>Responsable du traitement</h2>
        <p><strong>CarActif</strong><br />
        8, Boulevard Léo Lagrange, 59820 Gravelines<br />
        contact@caractif.fr<br />
        01 23 45 67 89</p>
      </section>

      <section>
        <h2>Données collectées</h2>
        <p>
          Lorsque vous utilisez le formulaire de contact de ce site, nous collectons : votre nom, prénom,
          numéro de téléphone, adresse email, code postal ou département, et le contenu de votre message
          si vous en rédigez un.
        </p>
      </section>

      <section>
        <h2>Finalité</h2>
        <p>
          Ces données sont utilisées exclusivement pour permettre à un commercial CarActif de vous
          recontacter au sujet de votre demande. Elles ne sont ni revendues ni transmises à des tiers à
          des fins commerciales.
        </p>
      </section>

      <section>
        <h2>Durée de conservation</h2>
        <p>
          À compléter par CarActif en fonction de sa politique interne de gestion des leads.
        </p>
      </section>

      <section>
        <h2>Vos droits</h2>
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un
          droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ces
          droits, contactez-nous à l'adresse contact@caractif.fr.
        </p>
      </section>
    </div>
  );
}
