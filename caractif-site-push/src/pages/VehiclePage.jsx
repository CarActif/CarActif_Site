import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import supabase from "../supabase";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";
import "./VehiclePage.css";
import "../styles/controle-technique-etat.css";
import MaintenanceHistory from "../components/MaintenanceHistory";
import VehicleRecapCard from "../components/VehicleRecapCard";
import { getAnneeYear } from "../utils/mandats";

export default function VehiclePage() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [showAllInfos, setShowAllInfos] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      const { data } = await supabase
        .from("mandats")
        .select(`
          *,
          agents:agent_id (
            prenom,
            nom,
            telephone,
            photo_url,
            secteur,
            email
          )
        `)
        .eq("id", id)
        .single();

      setVehicle(data);
    };

    fetchVehicle();
  }, [id]);

  if (!vehicle)
    return (
      <p style={{ textAlign: "center", color: "#FFD700", fontSize: "1.5rem" }}>
        Chargement...
      </p>
    );

  return (
    <div className="vehiclepage-wrapper">
      <div className="photo-agent-wrapper">
        <section className="gallery-part glass-card vehicle-gallery-panel" aria-label="Galerie photos">
          <h2 className="bloc-title vehicle-gallery-title">Galerie Photos</h2>

          {vehicle.photo_url?.length > 0 ? (
            <>
              <div className="photo-container">
                <Swiper
                  modules={[Navigation]}
                  navigation
                  className="main-swiper-modern vehicle-gallery-swiper"
                  spaceBetween={10}
                  slidesPerView={1}
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  onSlideChange={(swiper) => setActivePhotoIndex(swiper.activeIndex)}
                >
                  {vehicle.photo_url.map((url, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={url}
                        alt={`Photo ${index + 1}`}
                        className="photo-slide-img vehicle-gallery-main-img"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="thumb-container vehicle-gallery-thumbs">
                {vehicle.photo_url.map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`vehicle-gallery-thumb${index === activePhotoIndex ? " is-active" : ""}`}
                    aria-label={`Afficher la photo ${index + 1}`}
                    onClick={() => {
                      setActivePhotoIndex(index);
                      swiperRef.current?.slideTo(index);
                    }}
                  >
                    <img src={url} alt="" className="thumb-img-modern" />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="vehicle-gallery-empty">Aucune photo disponible.</p>
          )}
        </section>
        {/* Colonne droite : agent + recap card */}
  <div className="side-cards-wrapper">
          <Link
            to={`/agent/${vehicle.agent_id}`}
            className="agent-hero-card agent-hero-link"
            style={{ textDecoration: "none" }}
          >
            <img
              src={
                vehicle.agents?.photo_url ||
                "https://via.placeholder.com/160x160.png?text=No+Photo"
              }
              alt={vehicle.agents?.nom || "Agent"}
              className="agent-avatar"
            />
            <h2 className="agent-title">
              {vehicle.agents?.prenom} <span className="agent-nom">{vehicle.agents?.nom}</span>
            </h2>
            <div className="agent-secteur">
              {vehicle.agents?.secteur && (
                <>
                  Secteur : <b>{vehicle.agents.secteur}</b>
                </>
              )}
            </div>
            <div className="agent-contact">
              <div>
                <b>📞</b>{" "}
                <span className="tel-link">{vehicle.agents?.telephone || "Non renseigné"}</span>
              </div>
              {vehicle.agents?.email && (
                <div>
                  <b>✉️</b>{" "}
                  <span className="mail-link">{vehicle.agents.email}</span>
                </div>
              )}
            </div>
          </Link>
          <VehicleRecapCard
            marque={vehicle.marque}
            modele={vehicle.modele}
            annee={getAnneeYear(vehicle.annee) || ''}
            carburant={vehicle.energie}
            prix={vehicle.prix_affiche ? vehicle.prix_affiche.toLocaleString("fr-FR") : 'Prix sur demande'}
            finition={vehicle.finition}
            version={vehicle.version}
            kilometrage={vehicle.kilometrage}
          />
        </div>
      </div>

      {/* Bloc Infos générales */}
      <section className="infos-cles-container" aria-labelledby="infos-cles-title">
        <h2 id="infos-cles-title" className="vehicle-title">
          {vehicle.marque} {vehicle.modele}
        </h2>
  {/* Le prix est maintenant affiché dans la carte récapitulative */}
        <dl className="infos-cles-list">
          {/* Finition */}
          {vehicle.finition && (
            <div className="infos-cles-item">
              <dt className="infos-cles-label">Finition</dt>
              <dd className="infos-cles-value" title={vehicle.finition}>{vehicle.finition}</dd>
            </div>
          )}
          {/* Version */}
          {vehicle.version && (
            <div className="infos-cles-item">
              <dt className="infos-cles-label">Version</dt>
              <dd className="infos-cles-value" title={vehicle.version}>{vehicle.version}</dd>
            </div>
          )}
          {/* Année */}
          {vehicle.annee && (
            <div className="infos-cles-item">
              <dt className="infos-cles-label">Année</dt>
              <dd className="infos-cles-value" title={getAnneeYear(vehicle.annee)}>{getAnneeYear(vehicle.annee)}</dd>
            </div>
          )}
          {/* Kilométrage */}
          {vehicle.kilometrage && (
            <div className="infos-cles-item">
              <dt className="infos-cles-label">Kilométrage</dt>
              <dd className="infos-cles-value" title={vehicle.kilometrage.toLocaleString("fr-FR") + " km"}>{vehicle.kilometrage.toLocaleString("fr-FR") + " km"}</dd>
            </div>
          )}
            {/* Boîte de vitesses */}
            {vehicle.boite_vitesse && (
              <div className="infos-cles-item">
                <dt className="infos-cles-label">Boîte de vitesses</dt>
                <dd className="infos-cles-value" title={vehicle.boite_vitesse}>{vehicle.boite_vitesse}</dd>
              </div>
            )}
          {/* Portes */}
          {vehicle.nb_portes && (
            <div className="infos-cles-item">
              <dt className="infos-cles-label">Portes</dt>
              <dd className="infos-cles-value" title={vehicle.nb_portes}>{vehicle.nb_portes}</dd>
            </div>
          )}
          {/* Places */}
          {vehicle.nb_places && (
            <div className="infos-cles-item">
              <dt className="infos-cles-label">Places</dt>
              <dd className="infos-cles-value" title={vehicle.nb_places}>{vehicle.nb_places}</dd>
            </div>
          )}
          {/* Couleur Extérieure */}
          {vehicle.couleur && (
            <div className="infos-cles-item">
              <dt className="infos-cles-label">Couleur Extérieure</dt>
              <dd className="infos-cles-value" title={vehicle.couleur}>{vehicle.couleur}</dd>
            </div>
          )}
          {/* Couleur Intérieure */}
          {vehicle.couleur_interieure && (
            <div className="infos-cles-item">
              <dt className="infos-cles-label">Couleur Intérieure</dt>
              <dd className="infos-cles-value" title={vehicle.couleur_interieure}>{vehicle.couleur_interieure}</dd>
            </div>
          )}
          {/* Crit'Air */}
          {vehicle.critair && (
            <div className="infos-cles-item">
              <dt className="infos-cles-label">Crit'Air</dt>
              <dd className="infos-cles-value" title={vehicle.critair}>
                <span className="critair-badge" aria-label={`Vignette Crit'Air ${vehicle.critair}`} data-critair={vehicle.critair}>{vehicle.critair}</span>
              </dd>
            </div>
          )}
          {/* Motorisation */}
          {vehicle.motorisation && (
            <div className="infos-cles-item">
              <dt className="infos-cles-label">Motorisation</dt>
              <dd className="infos-cles-value">{vehicle.motorisation}</dd>
            </div>
          )}
          {/* Carburant */}
          {vehicle.energie && (
            <div className="infos-cles-item">
              <dt className="infos-cles-label">Carburant</dt>
              <dd className="infos-cles-value">{vehicle.energie}</dd>
            </div>
          )}
          {/* Puissance DIN */}
          {vehicle.puissance_din && (
            <div className="infos-cles-item">
              <dt className="infos-cles-label">Puissance DIN</dt>
              <dd className="infos-cles-value">{vehicle.puissance_din} ch</dd>
            </div>
          )}
          {/* Puissance Fiscale */}
          {vehicle.puissance_fiscale && (
            <div className="infos-cles-item">
              <dt className="infos-cles-label">Puissance Fiscale</dt>
              <dd className="infos-cles-value">{vehicle.puissance_fiscale} CV</dd>
            </div>
          )}
          {/* Localisation */}
          {(vehicle.ville || vehicle.departement) && (
            <div className="infos-cles-item">
              <dt className="infos-cles-label">Localisation</dt>
              <dd className="infos-cles-value localisation-value">
                <span className="icon-pin" aria-hidden="true"></span>
                {vehicle.ville}
                {vehicle.ville && vehicle.departement ? ` (${vehicle.departement})` : vehicle.departement ? vehicle.departement : ""}
              </dd>
            </div>
          )}
        </dl>
        {vehicle.infos_url && (
          <div className="infos-cles-link-wrapper">
            <a href={vehicle.infos_url} className="infos-cles-link" target="_blank" rel="noopener noreferrer">
              Voir toutes les informations
            </a>
          </div>
        )}
      </section>

      {/* Bloc Contrôle Technique & État */}

        <section className="infos-cles-container" aria-labelledby="controle-technique-title">
          <h3 id="controle-technique-title" className="bloc-title">🛠️ Contrôle Technique & État</h3>
          <dl className="infos-cles-list">
            {/* Pneus */}
            {[
              { label: "Usure Pneu AV G", value: vehicle?.pneu_av_g },
              { label: "Usure Pneu AV D", value: vehicle?.pneu_av_d },
              { label: "Usure Pneu AR G", value: vehicle?.pneu_ar_g },
              { label: "Usure Pneu AR D", value: vehicle?.pneu_ar_d }
            ].map((pneu) => {
              let color = '#111';
              if (typeof pneu.value === 'number') {
                if (pneu.value < 31) color = '#16A34A';
                else if (pneu.value <= 71) color = '#F97316';
                else color = '#DC2626';
              }
              return (
                <div className="infos-cles-item" key={pneu.label}>
                  <dt className="infos-cles-label">{pneu.label}</dt>
                  <dd className="infos-cles-value" style={{ color }}>{
                    typeof pneu.value === 'number' ? `${pneu.value} %` : (pneu.value || 'NC')
                  }</dd>
                </div>
              );
            })}
            {/* Plaquettes */}
            {[
              { label: "Plaquettes Avant", value: vehicle?.plaquettes_av },
              { label: "Plaquettes Arrière", value: vehicle?.plaquettes_ar }
            ].map((plaq) => (
              <div className="infos-cles-item" key={plaq.label}>
                <dt className="infos-cles-label">{plaq.label}</dt>
                <dd className="infos-cles-value">{plaq.value || 'NC'}</dd>
              </div>
            ))}
          </dl>
        </section>

      {/* Bloc État Moteur & Essai Routier */}
      <section className="infos-cles-container" aria-labelledby="etat-moteur-title">
        <h3 id="etat-moteur-title" className="bloc-title">🔧 État Moteur & Essai Routier</h3>
        <dl className="infos-cles-list">
          <div className="infos-cles-item">
            <dt className="infos-cles-label">État de l’huile</dt>
            <dd className="infos-cles-value">{vehicle.huile_moteur || "NC"}</dd>
          </div>
          <div className="infos-cles-item">
            <dt className="infos-cles-label">Fuite d’huile</dt>
            <dd className="infos-cles-value">{vehicle.fuite_huile || "NC"}</dd>
          </div>
          <div className="infos-cles-item">
            <dt className="infos-cles-label">État de l’embrayage</dt>
            <dd className="infos-cles-value">{vehicle.embrayage || "NC"}</dd>
          </div>
          <div className="infos-cles-item">
            <dt className="infos-cles-label">Vibrations observées</dt>
            <dd className="infos-cles-value">{vehicle.vibrations || "NC"}</dd>
          </div>
          <div className="infos-cles-item">
            <dt className="infos-cles-label">Type de Distribution</dt>
            <dd className="infos-cles-value">{vehicle.type_distribution || "NC"}</dd>
          </div>
          <div className="infos-cles-item">
            <dt className="infos-cles-label">Année Distribution</dt>
            <dd className="infos-cles-value">{vehicle.annee_distribution || "NC"}</dd>
          </div>
        </dl>
        <div className="commentaire-essai">
          <strong>📝 Commentaires Essai :</strong>
          <p>{vehicle.commentaire_test || "Aucun commentaire disponible."}</p>
        </div>
      </section>

      {/* Bloc Esthétique & Historique */}
      <section className="infos-cles-container" aria-labelledby="esthetique-title">
        <h3 id="esthetique-title" className="bloc-title">🎨 Esthétique & Historique d’entretien</h3>
        <dl className="infos-cles-list">
          <div className="infos-cles-item">
            <dt className="infos-cles-label">État Carrosserie</dt>
            <dd className="infos-cles-value">{vehicle.carrosserie || "NC"}</dd>
          </div>
          <div className="infos-cles-item">
            <dt className="infos-cles-label">État Intérieur</dt>
            <dd className="infos-cles-value">{vehicle.interieur || "NC"}</dd>
          </div>
        </dl>
        <MaintenanceHistory entretien={vehicle.entretien} />
      </section>

      {/* Bloc Garantie & Équipements */}
      <section className="infos-cles-container" aria-labelledby="garantie-title">
        <h3 id="garantie-title" className="bloc-title">🎯 Équipements</h3>
        <dl className="infos-cles-list equipements-list-responsive">
          {vehicle.equipements?.length > 0 && vehicle.equipements.map((equipement, index) => (
            <div className="infos-cles-item" key={index}>
              <dt className="infos-cles-label">Équipement</dt>
              <dd className="infos-cles-value">{equipement}</dd>
            </div>
          ))}
        </dl>
      </section>
      {/* Card Garantie séparée */}
      <section className="infos-cles-container glass-card garantie-section" aria-labelledby="garantie-card-title">
        <h2 id="garantie-card-title" className="garantie-main-title">Garantie & Tarifs</h2>
        <div className="garantie-grid">
          <div className="glass-card garantie-subcard">
            <h3 className="garantie-subcard-title">Thermique / Hybride / E85</h3>
            <div className="garantie-label">Pièces couvertes :</div>
            <div className="garantie-highlight">
              <span className="garantie-highlight-strong">Prestige Total : jusqu’à 77 pièces couvertes, l’expérience sans concession.*</span><br/>
              <span className="garantie-disclaimer">Couverture et tarif indicatifs : la liste exacte et le prix varient selon le véhicule (année, kilométrage, motorisation, historique) et le plafond choisi.*</span>
            </div>
            <ul className="garantie-parts-list">
              <li>✅ <span className="garantie-part-name">Moteur</span></li>
              <li>✅ <span className="garantie-part-name">Boîte de vitesse</span></li>
              <li>✅ <span className="garantie-part-name">Circuit de refroidissement</span></li>
              <li>✅ <span className="garantie-part-name">Freins</span></li>
              <li>✅ <span className="garantie-part-name">Direction</span></li>
              <li>✅ <span className="garantie-part-name">Arbres de transmission</span></li>
              <li>✅ <span className="garantie-part-name">Pompe d’injection & injecteurs</span></li>
              <li>✅ <span className="garantie-part-name">Turbo</span></li>
              <li>✅ <span className="garantie-part-name">Boîtiers électroniques (gestion moteur/boîte)</span></li>
              <li>✅ <span className="garantie-part-name">Alternateur</span></li>
              <li>✅ <span className="garantie-part-name">Démarreur</span></li>
              <li>✅ <span className="garantie-part-name">Capteurs de gestion moteur/boîte</span></li>
              <li>✅ <span className="garantie-part-name">...et bien plus</span></li>
            </ul>
            <div className="garantie-pricing">
              <div><span className="garantie-term">3 mois</span> — <span className="garantie-included">INCLUS</span></div>
              <div><span className="garantie-term">6 mois</span> — <strong>10 000 km</strong> : <span className="garantie-price">379 € TTC*</span></div>
              <div><span className="garantie-term">12 mois</span> — <strong>20 000 km</strong> : <span className="garantie-price">449 € TTC*</span></div>
              <div><span className="garantie-term">Mensualité 12 mois</span> : <span className="garantie-price">49,99 €/mois TTC*</span></div>
            </div>
            <a href="/garantie" className="link-accent">En savoir +</a>
          </div>
          <div className="glass-card garantie-subcard">
            <h3 className="garantie-subcard-title">Électrique</h3>
            <div className="garantie-label">Pièces couvertes :</div>
            <ul className="garantie-parts-list">
              <li>✅ <span className="garantie-part-name">Moteur, Réducteur</span></li>
              <li>✅ <span className="garantie-part-name">Calculateurs (batterie, commutateur, moteur)</span></li>
              <li>✅ <span className="garantie-part-name">Alimentation (régulateur, onduleur, câbles)</span></li>
              <li>✅ <span className="garantie-part-name">Freins</span></li>
              <li>✅ <span className="garantie-part-name">Direction</span></li>
              <li>✅ <span className="garantie-part-name">Climatisation (hors recharge gaz)</span></li>
              <li>✅ <span className="garantie-part-name">Accessoires électriques/électroniques</span></li>
            </ul>
            <div className="garantie-pricing">
              <div><span className="garantie-term">3 mois</span> — <span className="garantie-included">INCLUS</span></div>
              <div><span className="garantie-term">6 mois</span> — <strong>6 000 km</strong> : <span className="garantie-price">322 € TTC*</span></div>
              <div><span className="garantie-term">12 mois</span> — <strong>12 000 km</strong> : <span className="garantie-price">382 € TTC*</span></div>
              <div><span className="garantie-term">Mensualité 12 mois</span> : <span className="garantie-price">42,49 €/mois TTC*</span></div>
            </div>
            <a href="/garantie" className="link-accent">En savoir +</a>
          </div>
        </div>
      </section>
    </div>
  );
}


