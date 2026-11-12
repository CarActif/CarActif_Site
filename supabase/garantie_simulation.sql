-- Simulation de garantie pour UN véhicule. Même règle que le CRM (lib/garanties.js) :
-- prix client TTC = (tarif HTVA Opteven x coefficient + marge) x (1 + TVA). Seul le prix TTC final est renvoyé.
create or replace function public.garantie_simulation(p_annee int, p_km int, p_marque text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_age int := extract(year from now())::int - p_annee;
  v_marge numeric := coalesce((select valeur::numeric from parametres_crm where cle = 'marge_garantie_pct'), 50);
  v_tva numeric := coalesce((select valeur::numeric from parametres_crm where cle = 'tva_garantie_pct'), 20);
  v_coef numeric := case when lower(coalesce(p_marque,'')) in ('jaguar','land rover','land-rover') then 4 else 1 end;
  res jsonb := '[]'::jsonb;
  n record;
  v_tranche int;
  durees jsonb;
  opts jsonb;
begin
  if p_annee is null or p_km is null then return res; end if;
  for n in select * from garantie_niveaux order by ordre loop
    select min(t.tranche) into v_tranche from garantie_tarifs t
     where t.niveau = n.code and not t.mensuel and v_age <= t.age_max and p_km <= t.km_max;
    if v_tranche is null then continue; end if;

    select coalesce(jsonb_agg(jsonb_build_object('duree', t.duree_mois,
             'prix_ttc', round(round(t.prix_htva * v_coef * (1 + v_marge/100), 2) * (1 + v_tva/100), 2)) order by t.duree_mois), '[]'::jsonb)
      into durees
    from garantie_tarifs t
    where t.niveau = n.code and not t.mensuel and t.tranche = v_tranche;

    select coalesce(jsonb_agg(jsonb_build_object('code', o.code, 'libelle', o.libelle, 'duree', o.duree_mois,
             'prix_ttc', round(round(o.prix_htva * v_coef * (1 + v_marge/100), 2) * (1 + v_tva/100), 2)) order by o.code, o.duree_mois), '[]'::jsonb)
      into opts
    from garantie_options o
    where o.niveau = n.code and not o.mensuel;

    res := res || jsonb_build_object(
      'code', n.code, 'nom', n.nom, 'ordre', n.ordre, 'incluse', n.incluse,
      'plafond_eur', n.plafond_eur, 'diagnostics_ttc', n.diagnostics_ttc,
      'durees', durees, 'options', opts);
  end loop;
  return res;
end $$;
revoke all on function public.garantie_simulation(int, int, text) from public;
grant execute on function public.garantie_simulation(int, int, text) to anon, authenticated;
drop function if exists public.garantie_simulation(int, int);
