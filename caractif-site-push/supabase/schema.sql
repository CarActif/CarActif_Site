-- =============================================================================
-- CarActif — Schéma Supabase (généré depuis l'analyse du codebase React)
-- Tables : agents, mandats
-- Storage : bucket public "photo-profil"
-- Relation : mandats.agent_id → agents.id
-- =============================================================================

-- Extensions utiles (déjà disponibles sur Supabase, idempotent)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- TABLE : agents
-- Fichiers : Equipe.jsx, AgentPage.jsx, VehiclePage.jsx (jointure)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.agents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prenom        TEXT,
  nom           TEXT NOT NULL,
  telephone     TEXT,
  email         TEXT,
  photo_url     TEXT,
  secteur       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.agents IS 'Agents CarActif (page Équipe, fiches agent, lien mandats)';
COMMENT ON COLUMN public.agents.photo_url IS 'URL publique de la photo de profil';

-- -----------------------------------------------------------------------------
-- TABLE : mandats
-- Fichiers : Home.jsx, Vehicules.jsx, VehiclePage.jsx, AgentPage.jsx
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mandats (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id            UUID REFERENCES public.agents(id) ON DELETE SET NULL,

  -- Identification & affichage catalogue
  marque              TEXT,
  modele              TEXT,
  annee               DATE,
  finition            TEXT,
  version             TEXT,
  motorisation        TEXT,
  puissance           TEXT,
  energie             TEXT,
  carburant           TEXT,
  boite_vitesse       TEXT,
  boite               TEXT,
  kilometrage         INTEGER,
  prix_affiche        NUMERIC(12, 2),
  statut              TEXT,
  date_ajout          TIMESTAMPTZ DEFAULT now(),
  photo_url           TEXT[] DEFAULT '{}',
  ville               TEXT,
  departement         TEXT,
  infos_url           TEXT,

  -- Caractéristiques
  nb_portes           SMALLINT,
  nb_places           SMALLINT,
  couleur             TEXT,
  couleur_interieure  TEXT,
  critair             SMALLINT,
  puissance_din       SMALLINT,
  puissance_fiscale   SMALLINT,

  -- Contrôle technique & pneus (pourcentages 0–100)
  pneu_av_g           SMALLINT,
  pneu_av_d           SMALLINT,
  pneu_ar_g           SMALLINT,
  pneu_ar_d           SMALLINT,
  plaquettes_av       TEXT,
  plaquettes_ar       TEXT,

  -- État moteur & essai
  huile_moteur        TEXT,
  fuite_huile         TEXT,
  embrayage           TEXT,
  vibrations          TEXT,
  type_distribution   TEXT,
  annee_distribution  TEXT,
  commentaire_test    TEXT,

  -- Esthétique
  carrosserie         TEXT,
  interieur           TEXT,

  -- JSON : historique d'entretien [{ date, km, description, origine? }]
  -- origine attendue : "constructeur" | "garage" (MaintenanceHistory.jsx)
  entretien           JSONB DEFAULT '[]'::jsonb,

  -- Liste d'équipements (affichage fiche véhicule)
  equipements         TEXT[] DEFAULT '{}',

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- statut libre en TEXT ; valeurs UI connues :
  -- "Mandat signé", "Archivé", "Vendu", "Sous offre"
  CONSTRAINT mandats_pneu_pct_check CHECK (
    (pneu_av_g IS NULL OR (pneu_av_g >= 0 AND pneu_av_g <= 100)) AND
    (pneu_av_d IS NULL OR (pneu_av_d >= 0 AND pneu_av_d <= 100)) AND
    (pneu_ar_g IS NULL OR (pneu_ar_g >= 0 AND pneu_ar_g <= 100)) AND
    (pneu_ar_d IS NULL OR (pneu_ar_d >= 0 AND pneu_ar_d <= 100))
  )
);

COMMENT ON TABLE public.mandats IS 'Véhicules en mandat (catalogue, fiche détail, mandats par agent)';
COMMENT ON COLUMN public.mandats.agent_id IS 'FK vers agents — jointure Supabase : agents:agent_id (...)';
COMMENT ON COLUMN public.mandats.statut IS 'Valeurs UI : Mandat signé, Archivé, Vendu, Sous offre (+ libres)';
COMMENT ON COLUMN public.mandats.entretien IS 'Tableau JSON [{ "date": "...", "km": 12345, "description": "...", "origine": "constructeur"|"garage" }]';

-- -----------------------------------------------------------------------------
-- INDEX
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_mandats_agent_id ON public.mandats(agent_id);
CREATE INDEX IF NOT EXISTS idx_mandats_statut ON public.mandats(statut);
CREATE INDEX IF NOT EXISTS idx_mandats_date_ajout ON public.mandats(date_ajout DESC);
CREATE INDEX IF NOT EXISTS idx_mandats_marque ON public.mandats(marque);
CREATE INDEX IF NOT EXISTS idx_agents_secteur ON public.agents(secteur);

-- -----------------------------------------------------------------------------
-- TRIGGER updated_at
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS agents_set_updated_at ON public.agents;
CREATE TRIGGER agents_set_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS mandats_set_updated_at ON public.mandats;
CREATE TRIGGER mandats_set_updated_at
  BEFORE UPDATE ON public.mandats
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (lecture publique — site vitrine avec clé anon)
-- -----------------------------------------------------------------------------
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture publique agents" ON public.agents;
CREATE POLICY "Lecture publique agents"
  ON public.agents
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Lecture publique mandats" ON public.mandats;
CREATE POLICY "Lecture publique mandats"
  ON public.mandats
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- -----------------------------------------------------------------------------
-- STORAGE : bucket "photo-profil" (Home.jsx — photo hero)
-- À exécuter si le bucket n'existe pas encore (Dashboard > Storage possible aussi)
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('photo-profil', 'photo-profil', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Lecture publique photo-profil" ON storage.objects;
CREATE POLICY "Lecture publique photo-profil"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'photo-profil');

-- -----------------------------------------------------------------------------
-- DONNÉES DE DÉMO (optionnel — décommenter pour tester le site)
-- -----------------------------------------------------------------------------
/*
INSERT INTO public.agents (id, prenom, nom, telephone, email, photo_url, secteur) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Jean', 'Dupont', '06 12 34 56 78', 'jean.dupont@caractif.fr', 'https://via.placeholder.com/160', 'Île-de-France');

INSERT INTO public.mandats (
  agent_id, marque, modele, annee, energie, kilometrage, prix_affiche, statut,
  boite_vitesse, photo_url, finition, equipements, entretien
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Peugeot', '208', '2020-06-15', 'Essence', 45000, 12990, 'En vente',
  'Manuelle',
  ARRAY['https://via.placeholder.com/800x500'],
  'Active',
  ARRAY['Climatisation', 'GPS'],
  '[{"date":"2024-01-10","km":40000,"description":"Révision","origine":"garage"}]'::jsonb
);
*/
