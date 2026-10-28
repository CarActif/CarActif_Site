import { Link } from "react-router-dom";
import "../styles/chipSection.css";
import "./CommentCaMarche.css";

const ETAPES = [
  {
    numero: 1,
    titre: "Estimation gratuite, chez vous",
    texte:
      "Un agent CarActif de votre secteur se déplace pour évaluer votre véhicule, sans engagement de votre part.",
  },
  {
    numero: 2,
    titre: "Signature du mandat",
    texte:
      "Si vous êtes d'accord, vous signez un mandat qui confie à CarActif la recherche d'un acquéreur, la diffusion de l'annonce, la négociation et la sécurisation du paiement.",
  },
  {
    numero: 3,
    titre: "Contrôle qualité complet du véhicule",
    texte:
      "Avant toute mise en vente, votre voiture passe par un contrôle structuré en plusieurs grandes familles de vérifications (détail ci-dessous), pour une annonce fiable et des acheteurs rassurés.",
  },
  {
    numero: 4,
    titre: "Diffusion & mise en relation",
    texte:
      "Votre annonce est diffusée largement : acheteurs professionnels et particuliers. Nous gérons les appels, les visites et les négociations à votre place.",
  },
  {
    numero: 5,
    titre: "Paiement sécurisé par CashSentinel",
    texte:
      "Une fois un accord trouvé, les fonds de l'acheteur sont bloqués sur le compte séquestre CashSentinel. Ils ne sont débloqués qu'une fois toutes les vérifications faites des deux côtés.",
  },
  {
    numero: 6,
    titre: "Remise du véhicule & versement",
    texte:
      "Le véhicule est remis à l'acheteur, puis le solde net vous est reversé — une fois la commission de CarActif déduite, sans frais caché ni surprise.",
  },
];

const FAMILLES_CONTROLE = [
  {
    icone: "🪪",
    label: "Documents, historique & identification",
    exemples: [
      "Cohérence du numéro de série (VIN) entre carte grise, plaque constructeur et pare-brise",
      "Contrôle technique en cours de validité",
      "Historique non-gage et carnet d'entretien",
    ],
  },
  {
    icone: "🛞",
    label: "Pneumatiques, jantes & roue de secours",
    exemples: [
      "Usure extérieure et intérieure des 4 pneus",
      "État des flancs et des jantes",
      "Présence de la roue de secours ou du kit anti-crevaison",
    ],
  },
  {
    icone: "🚗",
    label: "Carrosserie, alignements & peinture",
    exemples: [
      "État de la peinture sur chaque panneau",
      "Différences de teinte révélatrices d'une réparation",
      "Jeux d'écartement entre portes, ailes et capot",
    ],
  },
  {
    icone: "🔍",
    label: "Vitrage, optiques & joints",
    exemples: [
      "Pare-brise sans impact dans la zone de vision",
      "État des phares et feux arrière",
      "Joints d'étanchéité des portes et du coffre",
    ],
  },
  {
    icone: "💡",
    label: "Éclairage & signalisation",
    exemples: [
      "Test fonctionnel de chaque feu (croisement, route, stop, clignotants)",
      "Feux de recul et antibrouillards",
      "Réglage de la hauteur des phares",
    ],
  },
  {
    icone: "🛋️",
    label: "Habitacle, garnitures & confort",
    exemples: [
      "État des sièges et fonctionnement des réglages",
      "Ceintures de sécurité et prétensionneurs",
      "Moquettes, ciel de toit et odeurs",
    ],
  },
  {
    icone: "📶",
    label: "Équipements électroniques & aides à la conduite",
    exemples: [
      "Lève-vitres, verrouillage centralisé, climatisation",
      "Écran multimédia, GPS, Bluetooth",
      "Caméra et radars de stationnement",
    ],
  },
  {
    icone: "🔧",
    label: "Baie moteur, fluides & batterie",
    exemples: [
      "Niveaux et aspect des huiles et liquides",
      "Recherche de fuites",
      "État de la batterie",
    ],
  },
  {
    icone: "🛑",
    label: "Freinage, châssis & dessous de caisse",
    exemples: [
      "Épaisseur des plaquettes et état des disques",
      "Dessous de caisse et ligne d'échappement",
      "Soufflets de cardan et rotules",
    ],
  },
  {
    icone: "🛣️",
    label: "Essai routier dynamique",
    exemples: [
      "Voyants tableau de bord, démarrage à froid",
      "Comportement moteur et boîte de vitesses en roulant",
      "Freinage, tenue de cap et vibrations",
    ],
  },
];

export default function CommentCaMarche() {
  return (
    <div className="ccm-page">
      <section className="ccm-hero">
        <h1>Comment se passe une vente avec CarActif ?</h1>
        <p className="ccm-intro">
          De l'estimation à la remise des clés, voici le déroulé complet — étape par étape, sans
          mauvaise surprise.
        </p>
      </section>

      <section className="ccm-steps">
        {ETAPES.map((etape) => (
          <div key={etape.numero} className="ccm-step glass-card">
            <div className="ccm-step-number">{etape.numero}</div>
            <div>
              <h2>{etape.titre}</h2>
              <p>{etape.texte}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="ccm-section">
        <div className="chip-header" role="heading" aria-level="2">
          <span className="chip-title"><span className="chip-bold">Le contrôle qualité en détail</span></span>
        </div>
        <p className="section-subtitle">
          Chaque véhicule est vérifié large, famille par famille — en voici quelques exemples.
        </p>
        <div className="ccm-families-grid">
          {FAMILLES_CONTROLE.map((famille) => (
            <div key={famille.label} className="ccm-family-card glass-card">
              <div className="ccm-family-icon">{famille.icone}</div>
              <h3>{famille.label}</h3>
              <ul>
                {famille.exemples.map((ex) => (
                  <li key={ex}>{ex}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="ccm-section ccm-commission">
        <div className="chip-header" role="heading" aria-level="2">
          <span className="chip-title"><span className="chip-bold">Et la commission ?</span></span>
        </div>
        <p>
          Les honoraires de CarActif sont maîtrisés — environ <strong>4 % du prix de vente</strong> — et
          intégrés au prix affiché au public. C'est l'acheteur qui les supporte : vous, vendeur, touchez
          le prix net convenu avec votre commercial, sans frais caché.
        </p>
      </section>

      <section className="ccm-cta">
        <h2>Une question sur le déroulé ?</h2>
        <p>Nos équipes vous expliquent tout, sans engagement de votre part.</p>
        <Link to="/contact" className="btn-primary">Être recontacté</Link>
      </section>
    </div>
  );
}
