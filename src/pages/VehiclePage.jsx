import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./VehiclePage.css";

const supabase = createClient(
  "https://rhbnlcmsyqjbzykexttt.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoYm5sY21zeXFqYnp5a2V4dHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NDA5OTcsImV4cCI6MjA2NjAxNjk5N30.o24Li47McJpMVaa2sEjwR8oOa1mobsUqhdUUD2VwpT8"
);

export default function VehiclePage() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

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
        {/* Galerie Photos */}
        <div className="gallery-part">
          <div className="photo-container">
            {vehicle.photo_url?.length > 0 ? (
              <Swiper
                modules={[Navigation, Thumbs]}
                navigation
                thumbs={{ swiper: thumbsSwiper }}
                className="main-swiper-modern"
                spaceBetween={10}
                slidesPerView={1}
              >
                {vehicle.photo_url.map((url, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={url}
                      alt={`photo-${index}`}
                      className="photo-slide-img"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p>Aucune photo disponible.</p>
            )}
          </div>

          {vehicle.photo_url?.length > 0 && (
            <div className="thumb-container">
              <Swiper
                onSwiper={setThumbsSwiper}
                slidesPerView={5}
                spaceBetween={10}
                className="thumbs-swiper-modern"
              >
                {vehicle.photo_url.map((url, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={url}
                      alt={`thumb-${index}`}
                      className="thumb-img-modern"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>

        {/* Carte Agent VERSION TEXTE SEULEMENT */}
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

      </div>

      {/* Bloc Infos générales */}
      <div className="bloc-general-modern">
        <h2 className="vehicle-title">
          {vehicle.marque} {vehicle.modele}
        </h2>
        <h3 className="vehicle-price">
          {vehicle.prix_affiche
            ? `${vehicle.prix_affiche.toLocaleString("fr-FR")} €`
            : "Prix sur demande"}
        </h3>

        <div className="vehicle-details-grid">
          <div>
            <strong>Finition :</strong> <span>{vehicle.finition}</span>
          </div>
          <div>
            <strong>Version :</strong> <span>{vehicle.version}</span>
          </div>
          <div>
            <strong>Année :</strong>{" "}
            <span>
              {vehicle.annee
                ? new Date(vehicle.annee).getFullYear()
                : "NC"}
            </span>
          </div>
          <div>
            <strong>Kilométrage :</strong>{" "}
            <span>
              {vehicle.kilometrage
                ? vehicle.kilometrage.toLocaleString("fr-FR")
                : "NC"}{" "}
              km
            </span>
          </div>
          <div>
            <strong>Portes :</strong> <span>{vehicle.nb_portes}</span>
          </div>
          <div>
            <strong>Places :</strong> <span>{vehicle.nb_places}</span>
          </div>
          <div>
            <strong>Couleur Extérieure :</strong>{" "}
            <span>{vehicle.couleur}</span>
          </div>
          <div>
            <strong>Couleur Intérieure :</strong>{" "}
            <span>{vehicle.couleur_interieure}</span>
          </div>
          <div>
            <strong>Crit'Air :</strong> <span>{vehicle.critair}</span>
          </div>
          <div>
            <strong>Motorisation :</strong>{" "}
            <span>{vehicle.motorisation || "NC"}</span>
          </div>
          <div>
            <strong>Carburant :</strong>{" "}
            <span>{vehicle.energie || "NC"}</span>
          </div>
          <div>
            <strong>Puissance DIN :</strong>{" "}
            <span>{vehicle.puissance_din || "NC"} ch</span>
          </div>
          <div>
            <strong>Puissance Fiscale :</strong>{" "}
            <span>{vehicle.puissance_fiscale || "NC"} CV</span>
          </div>
        </div>
      </div>

      {/* Bloc Contrôle Technique & État */}
      <div className="bloc-general-modern">
        <h3 className="bloc-title">🛠️ Contrôle Technique & État</h3>
        <div className="vehicle-details-grid">
          <div>
            <strong>Usure Pneus AV G :</strong>{" "}
            <span>{vehicle.pneu_av_g || "NC"} %</span>
          </div>
          <div>
            <strong>Usure Pneus AV D :</strong>{" "}
            <span>{vehicle.pneu_av_d || "NC"} %</span>
          </div>
          <div>
            <strong>Usure Pneus AR G :</strong>{" "}
            <span>{vehicle.pneu_ar_g || "NC"} %</span>
          </div>
          <div>
            <strong>Usure Pneus AR D :</strong>{" "}
            <span>{vehicle.pneu_ar_d || "NC"} %</span>
          </div>
          <div>
            <strong>Plaquettes Avant :</strong>{" "}
            <span>{vehicle.plaquettes_av || "NC"}</span>
          </div>
          <div>
            <strong>Plaquettes Arrière :</strong>{" "}
            <span>{vehicle.plaquettes_ar || "NC"}</span>
          </div>
          <div>
            <strong>Type de Distribution :</strong>{" "}
            <span>{vehicle.type_distribution || "NC"}</span>
          </div>
          <div>
            <strong>Année Distribution :</strong>{" "}
            <span>{vehicle.annee_distribution || "NC"}</span>
          </div>
        </div>
      </div>

      {/* Bloc État Moteur & Essai Routier */}
      <div className="bloc-general-modern">
        <h3 className="bloc-title">🔧 État Moteur & Essai Routier</h3>
        <div className="vehicle-details-grid">
          <div>
            <strong>État de l’huile :</strong>{" "}
            <span>{vehicle.huile_moteur || "NC"}</span>
          </div>
          <div>
            <strong>Fuite d’huile :</strong>{" "}
            <span>{vehicle.fuite_huile || "NC"}</span>
          </div>
          <div>
            <strong>État de l’embrayage :</strong>{" "}
            <span>{vehicle.embrayage || "NC"}</span>
          </div>
          <div>
            <strong>Vibrations observées :</strong>{" "}
            <span>{vehicle.vibrations || "NC"}</span>
          </div>
        </div>
        <div className="commentaire-essai">
          <strong>📝 Commentaires Essai :</strong>
          <p>{vehicle.commentaire_test || "Aucun commentaire disponible."}</p>
        </div>
      </div>

      {/* Bloc Esthétique & Historique */}
      <div className="bloc-general-modern">
        <h3 className="bloc-title">🎨 Esthétique & Historique d’entretien</h3>
        <div className="vehicle-details-grid">
          <div>
            <strong>État Carrosserie :</strong>{" "}
            <span>{vehicle.carrosserie || "NC"}</span>
          </div>
          <div>
            <strong>État Intérieur :</strong>{" "}
            <span>{vehicle.interieur || "NC"}</span>
          </div>
        </div>

        <div className="historique-entretien">
          <strong>📜 Historique d’entretien :</strong>
          {vehicle.entretien?.length > 0 ? (
            <ul>
              {vehicle.entretien.map((item, index) => (
                <li key={index}>
                  <strong>{item.km} km</strong> — {item.date} —{" "}
                  {item.description}
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun historique d’entretien disponible.</p>
          )}
        </div>
      </div>

      {/* Bloc Garantie & Équipements */}
      <div className="bloc-general-modern">
        <h3 className="bloc-title">🎯 Garantie & Équipements</h3>
        <div className="vehicle-details-grid">
          <div>
            <strong>Garantie :</strong>{" "}
            <span>{vehicle.garantie || "NC"}</span>
          </div>
        </div>
        <div className="equipements-options">
          <strong>⚙️ Équipements & Options :</strong>
          {vehicle.equipements?.length > 0 ? (
            <ul>
              {vehicle.equipements.map((equipement, index) => (
                <li key={index}>✅ {equipement}</li>
              ))}
            </ul>
          ) : (
            <p>Aucun équipement renseigné.</p>
          )}
        </div>
      </div>
    </div>
  );
}


