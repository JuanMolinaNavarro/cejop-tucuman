-- ============================================================================
-- Migración: habilitar el tipo de pregunta 'localidad' (combobox de localidades
-- de Tucumán) en una base YA creada.
-- ----------------------------------------------------------------------------
-- Correr UNA vez en el SQL Editor de Supabase. Reemplaza el CHECK de
-- public.preguntas.tipo para aceptar además 'localidad'. Idempotente.
-- ============================================================================

alter table public.preguntas drop constraint if exists preguntas_tipo_check;

alter table public.preguntas
  add constraint preguntas_tipo_check check (tipo in (
    'texto_corto','texto_largo','email','numero','boolean',
    'seleccion_unica','seleccion_multiple','ranking','localidad'));
