import './MentionsLegales.css';

export default function MentionsLegales() {
  return (
    <div className="mentions-page">
      <h1>Mentions Légales</h1>

      <section>
        <h2>Éditeur du site</h2>
        <p><strong>CarActif</strong><br />
        8, Boulevard Léo Lagrange, 59820 Gravelines<br />
        contact@caractif.fr<br />
        01 23 45 67 89</p>
      </section>

      <section>
        <h2>Hébergement</h2>
        <p>Hébergeur : IONOS<br />
        2 rue Kellermann, 59100 Roubaix<br />
        www.ionos.com</p>
      </section>

      <section>
        <h2>Responsabilité</h2>
        <p>
          CarActif s'efforce de fournir des informations exactes mais ne peut être tenu responsable des erreurs ou omissions.
        </p>
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          Tous les contenus présents sur ce site sont la propriété exclusive de CarActif. Toute reproduction est interdite sans autorisation préalable.
        </p>
      </section>
    </div>
  );
}
