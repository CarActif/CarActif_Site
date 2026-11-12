import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, X, Images, Calendar, Gauge, Fuel, Settings2, MapPin, Phone, ChevronLeft, ChevronRight,
  ShieldCheck, Lock, BadgeCheck, CircleDot, Disc3, Link2, Cog, Wrench, Car, Armchair, ClipboardList,
} from "lucide-react";
import supabase from "../supabase";
import usePageMeta from "../lib/usePageMeta";
import PneusSchema, { versNombre, couleurContinue, etatUsure } from "../components/PneusSchema";
import GarantieInclusse from "../components/GarantieInclusse";
import MaintenanceHistory from "../components/MaintenanceHistory";
import { getAnneeYear } from "../utils/mandats";
import { getBoiteVitesseFromVehicle } from "../utils/boiteVitesse";
import "./VehiclePage.css";

const fmtKm = (km) => (km ? `${Number(km).toLocaleString("fr-FR")} km` : null);
const fmtPrix = (p) => (p != null ? `${Number(p).toLocaleString("fr-FR")} €` : "Prix sur demande");

function Ligne({ label, children }) {
  if (children === null || children === undefined || children === "") return null;
  return (
    <div className="vp-ligne">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Fiche({ titre, icone: Icone, children }) {
  return (
    <section className="vp-carte">
      <h2 className="vp-carte__titre">{Icone && <Icone size={20} aria-hidden="true" />}{titre}</h2>
      {children}
    </section>
  );
}

export default function VehiclePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [galerie, setGalerie] = useState(false);
  const [v, setV] = useState(null);
  const [photo, setPhoto] = useState(0);
  const [onglet, setOnglet] = useState("pneus");

  useEffect(() => {
    let actif = true;
    supabase
      .from("mandats")
      .select(`*, agents:agent_id (prenom, nom, telephone, photo_url, secteur, email)`)
      .eq("id", id)
      .single()
      .then(({ data }) => actif && setV(data));
    return () => { actif = false; };
  }, [id]);

  usePageMeta(
    v ? `${v.marque} ${v.modele}` : "Véhicule",
    v ? `${v.marque} ${v.modele} ${v.annee ?? ""} en vente avec CarActif : état détaillé, garantie 3 mois incluse, paiement sécurisé par séquestre.` : undefined
  );

  const photos = useMemo(() => (Array.isArray(v?.photo_url) ? v.photo_url.filter(Boolean) : []), [v]);

  if (!v) return <p className="vp-chargement">Chargement...</p>;

  const annee = getAnneeYear(v.annee);
  const boite = getBoiteVitesseFromVehicle(v);
  const energie = v.energie || v.carburant;
  const titre = `${v.marque ?? ""} ${v.modele ?? ""}`.trim();
  const sousTitre = [v.version, v.finition, v.motorisation].filter(Boolean).join(" · ");
  const agent = v.agents;
  const tel = agent?.telephone ? String(agent.telephone).replace(/\s/g, "") : null;
  const lieu = [v.ville, v.departement && `(${v.departement})`].filter(Boolean).join(" ");
  const suivant = (d) => setPhoto((p) => (p + d + photos.length) % photos.length);

  const pneus = [
    ["Avant gauche", v.pneu_av_g, v.pneu_av_g_int],
    ["Avant droit", v.pneu_av_d, v.pneu_av_d_int],
    ["Arrière gauche", v.pneu_ar_g, v.pneu_ar_g_int],
    ["Arrière droit", v.pneu_ar_d, v.pneu_ar_d_int],
  ];

  const onglets = [
    { id: "pneus", label: "Pneus et freinage", icone: CircleDot },
    { id: "moteur", label: "Moteur et distribution", icone: Cog },
    { id: "carrosserie", label: "Carrosserie", icone: Car },
    { id: "interieur", label: "Intérieur", icone: Armchair },
    { id: "essai", label: "Essai routier", icone: Gauge },
    { id: "entretien", label: "Entretien", icone: ClipboardList },
  ];

  return (
    <div className="vp">
      <header className="vp-hero">
        <div className="vp-hero__photo">
          {photos.length > 0 ? (
            <img src={photos[photo]} alt={`${titre}, photo ${photo + 1}`} />
          ) : (
            <div className="vp-hero__vide">Photos à venir</div>
          )}
          <div className="vp-hero__degrade" />
          <div className="vp-hero__haut">
            <button type="button" className="vp-chip" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/vehicules"))}><ArrowLeft size={18} aria-hidden="true" />Retour</button>
            <div className="vp-hero__haut-droite">
              {photos.length > 1 && <button type="button" className="vp-chip" onClick={() => setGalerie(true)}><Images size={18} aria-hidden="true" /><span className="vp-chip__txt">Toutes les photos&nbsp;</span>({photos.length})</button>}
              <Link to="/" className="vp-chip vp-chip--carre" aria-label="Accueil CarActif"><X size={18} aria-hidden="true" /></Link>
            </div>
          </div>
          {v.statut === "Sous offre" && <span className="vp-statut">Sous offre</span>}
          {photos.length > 1 && (
            <>
              <button type="button" className="vp-fleche vp-fleche--g" onClick={() => suivant(-1)} aria-label="Photo précédente"><ChevronLeft /></button>
              <button type="button" className="vp-fleche vp-fleche--d" onClick={() => suivant(1)} aria-label="Photo suivante"><ChevronRight /></button>
            </>
          )}
          <div className="vp-hero__texte">
            <div>
              <h1>{titre}</h1>
              {sousTitre && <p>{sousTitre}</p>}
              <ul className="vp-pastilles">
                {annee && <li><Calendar size={16} aria-hidden="true" />{annee}</li>}
                {v.kilometrage && <li><Gauge size={16} aria-hidden="true" />{fmtKm(v.kilometrage)}</li>}
                {energie && <li><Fuel size={16} aria-hidden="true" />{energie}</li>}
                {boite && <li><Settings2 size={16} aria-hidden="true" />{boite}</li>}
                {lieu && <li><MapPin size={16} aria-hidden="true" />{lieu}</li>}
              </ul>
            </div>
            <div className="vp-hero__prix">{fmtPrix(v.prix_affiche)}</div>
          </div>
        </div>
        {photos.length > 1 && (
          <div className="vp-vignettes" role="list">
            {photos.map((u, i) => (
              <button key={u + i} type="button" role="listitem" className={i === photo ? "is-active" : ""} onClick={() => setPhoto(i)} aria-label={`Afficher la photo ${i + 1}`}>
                <img src={u} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </header>

      {galerie && (
        <div className="vp-galerie" role="dialog" aria-modal="true" aria-label="Toutes les photos">
          <button type="button" className="vp-chip vp-galerie__fermer" onClick={() => setGalerie(false)}><X size={18} aria-hidden="true" />Fermer</button>
          <div className="vp-galerie__grille">
            {photos.map((u, i) => (
              <button key={u + i} type="button" onClick={() => { setPhoto(i); setGalerie(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}><img src={u} alt={`${titre}, photo ${i + 1}`} loading="lazy" /></button>
            ))}
          </div>
        </div>
      )}

      <div className="vp-conteneur">
        <div className="vp-grille">
          <main className="vp-principal">
            <Fiche titre="Caractéristiques" icone={ClipboardList}>
              <dl className="vp-lignes">
                <Ligne label="Mise en circulation">{annee}</Ligne>
                <Ligne label="Kilométrage">{fmtKm(v.kilometrage)}</Ligne>
                <Ligne label="Énergie">{energie}</Ligne>
                <Ligne label="Boîte de vitesses">{boite}</Ligne>
                <Ligne label="Motorisation">{v.motorisation}</Ligne>
                <Ligne label="Puissance DIN">{v.puissance_din ? `${v.puissance_din} ch` : null}</Ligne>
                <Ligne label="Puissance fiscale">{v.puissance_fiscale ? `${v.puissance_fiscale} CV` : null}</Ligne>
                <Ligne label="Finition">{v.finition}</Ligne>
                <Ligne label="Version">{v.version}</Ligne>
                <Ligne label="Portes">{v.nb_portes}</Ligne>
                <Ligne label="Places">{v.nb_places}</Ligne>
                <Ligne label="Couleur extérieure">{v.couleur}</Ligne>
                <Ligne label="Couleur intérieure">{v.couleur_interieure}</Ligne>
                <Ligne label="Crit'Air">{v.critair && <span className="vp-critair" data-critair={v.critair}>{v.critair}</span>}</Ligne>
                <Ligne label="Localisation">{lieu}</Ligne>
              </dl>
              {v.infos_url && <a className="vp-lien" href={v.infos_url} target="_blank" rel="noopener noreferrer">Voir toutes les informations</a>}
            </Fiche>

            <Fiche titre="Contrôle mécanique" icone={Wrench}>
              <div className="vp-controle">
                <div className="vp-onglets" role="tablist" aria-label="Rubriques du contrôle">
                  {onglets.map(({ id: oid, label, icone: I }) => (
                    <button key={oid} type="button" role="tab" aria-selected={onglet === oid} className={onglet === oid ? "is-active" : ""} onClick={() => setOnglet(oid)}>
                      <I size={20} aria-hidden="true" />{label}
                    </button>
                  ))}
                </div>
                <div className="vp-panneau" role="tabpanel">
                  {onglet === "pneus" && (
                    <div className="vp-pneus">
                      <PneusSchema
                        avG={{ ext: v.pneu_av_g, int: v.pneu_av_g_int }}
                        avD={{ ext: v.pneu_av_d, int: v.pneu_av_d_int }}
                        arG={{ ext: v.pneu_ar_g, int: v.pneu_ar_g_int }}
                        arD={{ ext: v.pneu_ar_d, int: v.pneu_ar_d_int }}
                      />
                      <table className="vp-tableau">
                        <thead><tr><th>Pneu</th><th>Ext.</th><th>Int.</th><th>État</th></tr></thead>
                        <tbody>
                          {pneus.map(([nom, e, i]) => {
                            const pire = Math.max(versNombre(e) ?? -1, versNombre(i) ?? -1);
                            return (
                              <tr key={nom}>
                                <td>{nom}</td>
                                <td>{versNombre(e) === null ? "NC" : `${versNombre(e)} %`}</td>
                                <td>{versNombre(i) === null ? "NC" : `${versNombre(i)} %`}</td>
                                <td><span className="vp-point" style={{ background: couleurContinue(pire < 0 ? null : pire) }} />{etatUsure(pire < 0 ? null : pire)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <dl className="vp-lignes vp-lignes--une vp-freins">
                        <Ligne label="Plaquettes avant">{v.plaquettes_av || "NC"}</Ligne>
                        <Ligne label="Plaquettes arrière">{v.plaquettes_ar || "NC"}</Ligne>
                      </dl>
                    </div>
                  )}
                  {onglet === "moteur" && (
                    <dl className="vp-lignes vp-lignes--une">
                      <Ligne label="État de l'huile">{v.huile_moteur || "NC"}</Ligne>
                      <Ligne label="Fuite d'huile">{v.fuite_huile || "NC"}</Ligne>
                      <Ligne label="État de l'embrayage">{v.embrayage || "NC"}</Ligne>
                      <Ligne label="Type de distribution">{v.type_distribution || "NC"}</Ligne>
                      <Ligne label="Dernière distribution">{v.annee_distribution || "NC"}</Ligne>
                    </dl>
                  )}
                  {onglet === "carrosserie" && (
                    <dl className="vp-lignes vp-lignes--une">
                      <Ligne label="État de la carrosserie">{v.carrosserie || "NC"}</Ligne>
                      <Ligne label="Couleur extérieure">{v.couleur}</Ligne>
                    </dl>
                  )}
                  {onglet === "interieur" && (
                    <dl className="vp-lignes vp-lignes--une">
                      <Ligne label="État intérieur">{v.interieur || "NC"}</Ligne>
                      <Ligne label="Couleur intérieure">{v.couleur_interieure}</Ligne>
                    </dl>
                  )}
                  {onglet === "entretien" && <MaintenanceHistory entretien={v.entretien} />}
                  {onglet === "essai" && (
                    <div>
                      <dl className="vp-lignes vp-lignes--une">
                        <Ligne label="Vibrations observées">{v.vibrations || "NC"}</Ligne>
                      </dl>
                      <p className="vp-commentaire">{v.commentaire_test || "Aucun commentaire de l'agent pour le moment."}</p>
                    </div>
                  )}
                </div>
              </div>
            </Fiche>

            {v.equipements?.length > 0 && (
              <Fiche titre="Équipements" icone={Armchair}>
                <ul className="vp-puces">{v.equipements.map((e, i) => <li key={i}>{e}</li>)}</ul>
              </Fiche>
            )}

            <GarantieInclusse annee={v.annee} kilometrage={v.kilometrage} />
          </main>

          <aside className="vp-lateral">
            <div className="vp-achat">
              <p className="vp-achat__label">Prix TTC</p>
              <p className="vp-achat__prix">{fmtPrix(v.prix_affiche)}</p>
              {tel ? (
                <a className="vp-bouton vp-bouton--plein" href={`tel:${tel}`}><Phone size={18} aria-hidden="true" />Appeler {agent?.prenom || "mon agent"}</a>
              ) : null}
              <Link className="vp-bouton vp-bouton--contour" to="/contact">Planifier une visite</Link>
              <ul className="vp-garanties">
                <li><ShieldCheck size={18} aria-hidden="true" />Garantie 3 mois incluse</li>
                <li><Lock size={18} aria-hidden="true" />Paiement sécurisé par séquestre</li>
                <li><BadgeCheck size={18} aria-hidden="true" />Véhicule contrôlé par un agent</li>
              </ul>
            </div>
            {agent && (
              <Link to={`/agent/${v.agent_id}`} className="vp-agent">
                {agent.photo_url ? <img src={agent.photo_url} alt="" /> : <span className="vp-agent__init">{(agent.prenom || "?")[0]}</span>}
                <span><strong>{agent.prenom} {agent.nom}</strong><small>{agent.secteur ? `Secteur : ${agent.secteur}` : "Agent CarActif"}</small></span>
              </Link>
            )}
          </aside>
        </div>
      </div>

      {tel && (
        <a className="vp-appel-mobile" href={`tel:${tel}`}><Phone size={18} aria-hidden="true" />Appeler {agent?.prenom || "mon agent"} · {fmtPrix(v.prix_affiche)}</a>
      )}
    </div>
  );
}
