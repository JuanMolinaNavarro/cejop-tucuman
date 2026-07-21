-- ============================================================================
-- CEJOP Tucumán — Datos de PRUEBA para el dashboard (respuestas + acreditaciones)
-- ----------------------------------------------------------------------------
-- Correr UNA vez en el SQL Editor de Supabase (bypasea RLS).
-- Genera inscripciones ficticias repartidas en los últimos 14 días (con
-- respuestas armadas según las preguntas reales de cada formulario de
-- inscripción), y acredita a un ~60% + algunos walk-ins.
-- Todo queda marcado con email '@seed.cejop' para poder borrarlo (ver LIMPIEZA).
-- ============================================================================

do $$
declare
  f            record;
  preg         record;
  i            int;
  n_por_form   int := 22;         -- inscripciones ficticias por formulario
  v_resp_id    uuid;
  v_created    timestamptz;
  v_jsonb      jsonb;
  v_nombre     text;
  v_email      text;
  v_tel        text;
  v_confirmado boolean;
  v_total_resp  int := 0;
  v_total_acred int := 0;
  nombres text[] := array[
    'María José Albarracín','Santiago Bustos','Florencia Medina','Joaquín González',
    'Camila Ruiz','Mateo Díaz','Lucía Fernández','Bautista Herrera','Martina Mansilla',
    'Facundo Ortiz','Agustina Carrizo','Tomás Juárez','Sofía Leguizamón','Lucas Alderete',
    'Delfina Soria','Rodrigo Ledesma','Guadalupe Juárez','Nicolás Giménez','Victoria Romano',
    'Franco Maza','Julieta Valdez','Ignacio Brandán','Valentina Luna','Bruno Villagra'
  ];
  localidades text[] := array[
    'San Miguel de Tucumán','Yerba Buena','Concepción','Tafí Viejo',
    'Aguilares','Monteros','Lules','Banda del Río Salí'
  ];
begin
  for f in
    select id as form_id, encuentro_id
    from public.formularios
    where tipo = 'inscripcion'
  loop
    for i in 1..n_por_form loop
      v_nombre     := nombres[1 + ((i - 1) % array_length(nombres, 1))];
      v_email      := 'inscripto' || f.encuentro_id || '_' || i || '@seed.cejop';
      v_tel        := '381' || lpad((floor(random() * 9999999))::int::text, 7, '0');
      v_confirmado := random() < 0.5;
      v_created    := now() - random() * 13.5 * interval '1 day';

      -- Armar el jsonb de respuestas a partir de las preguntas del formulario
      v_jsonb := '{}'::jsonb;
      for preg in
        select * from public.preguntas where formulario_id = f.form_id
      loop
        v_jsonb := v_jsonb || jsonb_build_object(
          preg.id::text,
          case preg.tipo
            when 'email' then to_jsonb(v_email)
            when 'texto_corto' then to_jsonb(
              case preg.config->>'rol_contacto'
                when 'nombre'   then v_nombre
                when 'telefono' then v_tel
                else localidades[1 + floor(random() * array_length(localidades, 1))::int]
              end)
            when 'texto_largo' then to_jsonb(
              'Me interesa la política y quiero entender cómo funcionan las instituciones.'::text)
            when 'numero' then to_jsonb(
              case when preg.config->>'rol_contacto' = 'telefono'
                   then floor(3814000000 + random() * 999999)::bigint
                   else (18 + floor(random() * 13))::int
              end)
            when 'boolean' then to_jsonb(random() < 0.5)
            when 'seleccion_unica' then coalesce(
              (select to_jsonb(o->>'id')
                 from jsonb_array_elements(preg.config->'opciones') o
                 order by random() limit 1),
              'null'::jsonb)
            when 'seleccion_multiple' then (
              select coalesce(jsonb_agg(id), '[]'::jsonb) from (
                select o->>'id' as id
                  from jsonb_array_elements(preg.config->'opciones') o
                  order by random()
                  limit greatest(1, coalesce((preg.config->>'min')::int, 2))
              ) s)
            when 'ranking' then (
              select coalesce(jsonb_agg(id), '[]'::jsonb) from (
                select o->>'id' as id
                  from jsonb_array_elements(preg.config->'opciones') o
                  order by random()
                  limit coalesce((preg.config->>'n')::int, 3)
              ) s)
            else 'null'::jsonb
          end
        );
      end loop;

      insert into public.respuestas
        (formulario_id, encuentro_id, nombre, email, telefono, respuestas, confirmado, created_at)
      values
        (f.form_id, f.encuentro_id, v_nombre, v_email, v_tel, v_jsonb, v_confirmado, v_created)
      returning id into v_resp_id;
      v_total_resp := v_total_resp + 1;

      -- Acreditar ~60%
      if random() < 0.6 then
        insert into public.acreditaciones
          (encuentro_id, respuesta_id, nombre, email, telefono, tipo, created_at)
        values
          (f.encuentro_id, v_resp_id, v_nombre, v_email, v_tel,
           case when v_confirmado then 'Confirmado' else 'Inscripto' end,
           now() - random() * 2 * interval '1 day');
        v_total_acred := v_total_acred + 1;
      end if;
    end loop;

    -- Walk-ins por encuentro
    for i in 1..4 loop
      insert into public.acreditaciones
        (encuentro_id, respuesta_id, nombre, email, tipo, created_at)
      values
        (f.encuentro_id, null, 'Walk-in ' || i,
         'walkin' || f.encuentro_id || '_' || i || '@seed.cejop', 'Walk-in',
         now() - random() * 1 * interval '1 day');
      v_total_acred := v_total_acred + 1;
    end loop;
  end loop;

  raise notice 'Seed listo: % respuestas y % acreditaciones insertadas.',
    v_total_resp, v_total_acred;
end $$;

-- ============================================================================
-- LIMPIEZA — borrar SOLO los datos de prueba (correr cuando quieras):
--
--   delete from public.acreditaciones where email like '%@seed.cejop';
--   delete from public.respuestas    where email like '%@seed.cejop';
-- ============================================================================
