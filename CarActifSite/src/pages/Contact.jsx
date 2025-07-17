import { useNavigate } from 'react-router-dom';
import './Contact.css';

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="contact-page">
      <h1>Contactez CarActif</h1>
      <p className="intro-text">
        Chez CarActif, chaque véhicule est suivi par un agent dédié à votre secteur.
        Pour toute recherche ou vente de véhicule, nous vous invitons à contacter
        directement un agent proche de chez vous.
      </p>

      <div className="contact-options">
        <div className="contact-card">
          <h2>📞 Trouver un agent</h2>
          <p>
            Consultez la liste de nos agents pour contacter celui en charge de votre secteur.
            Ils seront ravis de vous accompagner dans vos démarches.
          </p>
          <button onClick={() => navigate('/equipe')}>Voir nos agents</button>
        </div>

        <div className="contact-card">
          <h2>📧 Contacter le siège</h2>
          <p>
            Si vous souhaitez joindre directement le siège pour toute autre demande, vous pouvez
            nous écrire à l'adresse suivante :
          </p>
          <strong>contact@caractif.fr</strong>
        </div>
      </div>
    </div>
  );
}
