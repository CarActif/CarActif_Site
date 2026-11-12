-- Simulation de garantie pour UN véhicule (age + km) : ne révèle que les niveaux éligibles, pas la grille complète.
create or replace function public.garantie_simulation(p_annee int, p_km int)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_age int := extract(year from now())::int - p_annee;
  res jsonb := '[]'::jsonb;
  n record;
  durees jsonb;
  opts jsonb;
begin
  if p_annee is null or p_km is null then return res; end if;
  for n in select * from garantie_niveaux order by ordre loop
    if v_age > n.age_max or p_km > n.km_max then continue; end if;

    select coalesce(jsonb_agg(jsonb_build_object('duree', d.duree_mois, 'prix_ttc', d.prix_ttc) order by d.duree_mois), '[]'::jsonb)
      into durees
    from (
      select distinct on (t.duree_mois) t.duree_mois, t.prix_ttc
      from garantie_tarifs t
      where t.niveau = n.code and not t.mensuel and v_age <= t.age_max and p_km <= t.km_max
      order by t.duree_mois, t.tranche
    ) d;

    select coalesce(jsonb_agg(jsonb_build_object('code', o.code, 'libelle', o.libelle, 'duree', o.duree_mois, 'prix_ttc', o.prix_ttc) order by o.code, o.duree_mois), '[]'::jsonb)
      into opts
    from garantie_options o
    where o.niveau = n.code and not o.mensuel;

    if jsonb_array_length(durees) > 0 then
      res := res || jsonb_build_object(
        'code', n.code, 'nom', n.nom, 'ordre', n.ordre, 'incluse', n.incluse,
        'plafond_eur', n.plafond_eur, 'diagnostics_ttc', n.diagnostics_ttc,
        'age_max', n.age_max, 'km_max', n.km_max,
        'durees', durees, 'options', opts);
    end if;
  end loop;
  return res;
end $$;
revoke all on function public.garantie_simulation(int, int) from public;
grant execute on function public.garantie_simulation(int, int) to anon, authenticated;
