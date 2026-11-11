import usePageMeta from "../lib/usePageMeta";
import "./MentionsLegales.css";

export default function MentionsLegales() {
  usePageMeta("Mentions légales", "Mentions légales du site CarActif : éditeur, hébergement, propriété intellectuelle.");
  return (
    <div className="mentions-page glass-card">
      <h1>Mentions légales</h1>

      <section>
        <h2>Éditeur du site</h2>
        <p>
          <strong>CarActif</strong>, société à responsabilité limitée à associé unique (SARL unipersonnelle), au capital de 1 500 €.<br />
          Siège social : Dunkerque (59), Hauts-de-France.<br />
          Immatriculation : société en cours d'immatriculation au registre du commerce et des sociétés. Le numéro SIREN sera indiqué dès son attribution.<br />
          Activité : intermédiaire de vente de véhicules d'occasion entre particuliers, par mandat de vente.<br />
          Directeur de la publication : Charles Fournier, gérant.<br />
          Contact : contact@caractif.fr
        </p>
      </section>

      <section>
        <h2>Hébergement</h2>
        <p>
          Site hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (vercel.com).<br />
          Base de données hébergée par Supabase (supabase.com).
        </p>
      </section>

      <section>
        <h2>Responsabilité</h2>
        <p>
          CarActif s'efforce de fournir des informations exactes et à jour, mais ne peut être tenu responsable des erreurs ou omissions.
          Les estimations de prix présentées sur le site sont indicatives et ne constituent pas une offre d'achat ni un engagement.
        </p>
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          Tous les contenus présents sur ce site (textes, images, logos, mise en page) sont la propriété exclusive de CarActif
          ou de ses partenaires. Toute reproduction est interdite sans autorisation préalable.
        </p>
      </section>

      <section>
        <h2>Données personnelles</h2>
        <p>
          Le traitement de vos données est détaillé dans la politique de confidentialité du site.
        </p>
      </section>
    </div>
  );
}
