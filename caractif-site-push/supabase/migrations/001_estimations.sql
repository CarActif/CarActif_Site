-- =============================================================================
-- CarActif — Migration : leads d'estimation (page /estimation)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.estimations_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Véhicule
  plaque VARCHAR(10) NOT NULL,
  marque VARCHAR(50),
  modele VARCHAR(50),
  annee INT,
  motorisation VARCHAR(100),
  energie VARCHAR(30),
  transmission VARCHAR(30),
  puissance_ch INT,
  kilometrage INT NOT NULL,

  -- Estimation calculée
  estimation_min DECIMAL(10,2),
  estimation_moy DECIMAL(10,2),
  estimation_max DECIMAL(10,2),

  -- Contact
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  telephone VARCHAR(20) NOT NULL,

  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'abandoned'))
);

CREATE INDEX IF NOT EXISTS idx_estimations_email ON public.estimations_leads(email);
CREATE INDEX IF NOT EXISTS idx_estimations_created ON public.estimations_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_estimations_status ON public.estimations_leads(status);

-- Activer RLS (Row Level Security)
ALTER TABLE public.estimations_leads ENABLE ROW LEVEL SECURITY;

-- Autoriser l'insertion publique (formulaire du site)
DROP POLICY IF EXISTS "Autoriser insertion publique des leads" ON public.estimations_leads;
CREATE POLICY "Autoriser insertion publique des leads"
  ON public.estimations_leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Aucune policy SELECT pour "anon" : personne côté client ne peut lire les leads.
-- Pour consulter les leads plus tard (dashboard admin), utiliser la clé service_role
-- (jamais exposée au navigateur) ou une policy dédiée à un rôle authentifié.
