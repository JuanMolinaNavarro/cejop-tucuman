-- ============================================================================
-- CEJOP Tucumán — Esquema de base de datos (Supabase / Postgres)
-- Modelo de FORMULARIOS DINÁMICOS: el admin crea encuentros y arma, para cada
-- uno, su formulario de inscripción con las preguntas y secciones que quiera.
-- ----------------------------------------------------------------------------
-- Cómo usarlo:
--   1. Creá un proyecto en https://supabase.com
--   2. Abrí el SQL Editor y pegá/ejecutá este archivo completo.
--   3. Copiá las credenciales del proyecto a .env.local (ver .env.example).
--   4. Creá tu usuario admin en Authentication > Users y agregá su id a la
--      tabla `admins` (ver el bloque final "Bootstrap admin").
--
-- Modelo: encuentros → formularios → secciones (pasos) → preguntas (config
-- jsonb por tipo). Las respuestas del público se guardan en `respuestas`
-- (columnas de contacto + `respuestas` jsonb con { pregunta_id: valor }).
-- ============================================================================

-- ------------------------------------------------------------------
-- Tablas
-- ------------------------------------------------------------------

-- Encuentros (1er, 2do, ...). Controla qué edición está activa y si las
-- inscripciones/encuestas aceptan respuestas.
create table if not exists public.encuentros (
  id                bigint generated always as identity primary key,
  numero            int  not null unique,
  nombre            text not null,
  fecha             date,
  activo            boolean not null default false,
  encuestas_activas boolean not null default false,
  created_at        timestamptz not null default now()
);

-- Formularios: uno por (encuentro, tipo). v1 usa tipo='inscripcion'; el modelo
-- ya permite otros tipos (p. ej. 'feedback') a futuro.
create table if not exists public.formularios (
  id           bigint generated always as identity primary key,
  encuentro_id bigint not null references public.encuentros(id) on delete cascade,
  tipo         text not null default 'inscripcion',
  titulo       text not null,
  descripcion  text,
  estado       text not null default 'borrador'
               check (estado in ('borrador','publicado','cerrado')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (encuentro_id, tipo)
);

-- Secciones = pasos del wizard del formulario público.
create table if not exists public.secciones (
  id            bigint generated always as identity primary key,
  formulario_id bigint not null references public.formularios(id) on delete cascade,
  titulo        text not null,
  descripcion   text,
  orden         int not null default 0,
  created_at    timestamptz not null default now()
);

-- Preguntas. `config` (jsonb) guarda lo específico de cada tipo: opciones,
-- N de ranking, min/max, placeholder, rol_contacto, etc.
create table if not exists public.preguntas (
  id            bigint generated always as identity primary key,
  seccion_id    bigint not null references public.secciones(id) on delete cascade,
  formulario_id bigint not null references public.formularios(id) on delete cascade, -- denormalizado
  tipo          text not null check (tipo in (
                  'texto_corto','texto_largo','email','numero','boolean',
                  'seleccion_unica','seleccion_multiple','ranking','localidad')),
  etiqueta      text not null,
  ayuda         text,
  requerido     boolean not null default false,
  orden         int not null default 0,
  config        jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

-- Respuestas = envíos del formulario público. Columnas de contacto para
-- listar/CSV/dedup + `respuestas` jsonb con { "<pregunta_id>": valor }.
create table if not exists public.respuestas (
  id            uuid primary key default gen_random_uuid(),
  formulario_id bigint not null references public.formularios(id) on delete cascade,
  encuentro_id  bigint references public.encuentros(id) on delete set null, -- denormalizado
  nombre        text,
  email         text,
  telefono      text,
  respuestas    jsonb not null default '{}'::jsonb,
  confirmado    boolean not null default false,   -- gestión desde el panel admin
  created_at    timestamptz not null default now()
);

-- Acreditaciones = check-in físico en el ingreso del evento.
create table if not exists public.acreditaciones (
  id            uuid primary key default gen_random_uuid(),
  encuentro_id  bigint references public.encuentros(id) on delete cascade,
  respuesta_id  uuid references public.respuestas(id) on delete set null,
  nombre        text not null,
  email         text,
  telefono      text,
  tipo          text not null check (tipo in ('Confirmado','Inscripto','Walk-in')),
  hora          text,
  created_at    timestamptz not null default now()
);

-- Pendientes = personas que llegan sin estar en la lista (walk-in) y esperan
-- aprobación. Al aprobarse, se crea una acreditación de tipo 'Walk-in'.
create table if not exists public.pendientes (
  id            uuid primary key default gen_random_uuid(),
  encuentro_id  bigint references public.encuentros(id) on delete cascade,
  nombre        text not null,
  telefono      text,
  email         text,
  edad          text,
  hora          text,
  estado        text not null default 'pending' check (estado in ('pending','approved','rejected')),
  created_at    timestamptz not null default now()
);

-- Feedback = encuesta de satisfacción post-encuentro (tabla dedicada por ahora).
create table if not exists public.feedback (
  id            uuid primary key default gen_random_uuid(),
  encuentro_id  bigint references public.encuentros(id) on delete cascade,
  rating        int check (rating between 1 and 10),
  email         text,
  comentario    text,
  espacio       text,           -- Universidad / Militancia / Independiente / ...
  recomienda    text check (recomienda in ('si','talvez','no')),
  proximos_temas text[],
  created_at    timestamptz not null default now()
);

-- Allowlist de administradores (usuarios de Supabase Auth con acceso al panel).
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------
-- Índices
-- ------------------------------------------------------------------
create index if not exists idx_formularios_encuentro   on public.formularios(encuentro_id);
create index if not exists idx_secciones_formulario     on public.secciones(formulario_id, orden);
create index if not exists idx_preguntas_formulario     on public.preguntas(formulario_id, orden);
create index if not exists idx_preguntas_seccion        on public.preguntas(seccion_id, orden);
create index if not exists idx_respuestas_formulario    on public.respuestas(formulario_id);
create index if not exists idx_respuestas_encuentro     on public.respuestas(encuentro_id);
create index if not exists idx_respuestas_email         on public.respuestas(email);
create index if not exists idx_respuestas_jsonb         on public.respuestas using gin (respuestas);
create index if not exists idx_acreditaciones_encuentro on public.acreditaciones(encuentro_id);
create index if not exists idx_pendientes_encuentro     on public.pendientes(encuentro_id);
create index if not exists idx_feedback_encuentro       on public.feedback(encuentro_id);

-- ------------------------------------------------------------------
-- Trigger: mantener formularios.updated_at
-- ------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists formularios_set_updated_at on public.formularios;
create trigger formularios_set_updated_at
  before update on public.formularios
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------------
-- Helper: ¿el usuario actual es admin?
-- ------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ------------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------------
alter table public.encuentros     enable row level security;
alter table public.formularios    enable row level security;
alter table public.secciones      enable row level security;
alter table public.preguntas      enable row level security;
alter table public.respuestas     enable row level security;
alter table public.acreditaciones enable row level security;
alter table public.pendientes     enable row level security;
alter table public.feedback       enable row level security;
alter table public.admins         enable row level security;

-- encuentros: lectura pública (para mostrar la edición activa), escritura admin
drop policy if exists encuentros_select_public on public.encuentros;
create policy encuentros_select_public on public.encuentros for select using (true);
drop policy if exists encuentros_admin_write on public.encuentros;
create policy encuentros_admin_write on public.encuentros for all
  using (public.is_admin()) with check (public.is_admin());

-- formularios: lectura pública SOLO si está publicado; escritura admin
drop policy if exists formularios_select_public on public.formularios;
create policy formularios_select_public on public.formularios for select
  using (estado = 'publicado' or public.is_admin());
drop policy if exists formularios_admin_write on public.formularios;
create policy formularios_admin_write on public.formularios for all
  using (public.is_admin()) with check (public.is_admin());

-- secciones: lectura pública si el formulario padre está publicado; escritura admin
drop policy if exists secciones_select_public on public.secciones;
create policy secciones_select_public on public.secciones for select
  using (public.is_admin() or exists (
    select 1 from public.formularios f
    where f.id = secciones.formulario_id and f.estado = 'publicado'));
drop policy if exists secciones_admin_write on public.secciones;
create policy secciones_admin_write on public.secciones for all
  using (public.is_admin()) with check (public.is_admin());

-- preguntas: lectura pública si el formulario padre está publicado; escritura admin
drop policy if exists preguntas_select_public on public.preguntas;
create policy preguntas_select_public on public.preguntas for select
  using (public.is_admin() or exists (
    select 1 from public.formularios f
    where f.id = preguntas.formulario_id and f.estado = 'publicado'));
drop policy if exists preguntas_admin_write on public.preguntas;
create policy preguntas_admin_write on public.preguntas for all
  using (public.is_admin()) with check (public.is_admin());

-- respuestas: INSERT público SOLO si el formulario está publicado Y el encuentro
-- acepta respuestas (encuestas_activas). Lectura/edición/borrado: solo admin.
drop policy if exists respuestas_insert_public on public.respuestas;
create policy respuestas_insert_public on public.respuestas for insert
  with check (exists (
    select 1 from public.formularios f
    join public.encuentros e on e.id = f.encuentro_id
    where f.id = respuestas.formulario_id
      and f.estado = 'publicado'
      and e.encuestas_activas = true));
drop policy if exists respuestas_admin_read on public.respuestas;
create policy respuestas_admin_read on public.respuestas for select using (public.is_admin());
drop policy if exists respuestas_admin_update on public.respuestas;
create policy respuestas_admin_update on public.respuestas for update
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists respuestas_admin_delete on public.respuestas;
create policy respuestas_admin_delete on public.respuestas for delete using (public.is_admin());

-- feedback: envío público (encuesta), lectura admin
drop policy if exists feedback_insert_public on public.feedback;
create policy feedback_insert_public on public.feedback for insert with check (true);
drop policy if exists feedback_admin_read on public.feedback;
create policy feedback_admin_read on public.feedback for select using (public.is_admin());

-- acreditaciones y pendientes: solo admin (personal en la puerta, autenticado)
drop policy if exists acreditaciones_admin_all on public.acreditaciones;
create policy acreditaciones_admin_all on public.acreditaciones for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists pendientes_admin_all on public.pendientes;
create policy pendientes_admin_all on public.pendientes for all
  using (public.is_admin()) with check (public.is_admin());

-- admins: cada uno puede ver su propia fila (la gestión se hace desde Supabase)
drop policy if exists admins_select_self on public.admins;
create policy admins_select_self on public.admins for select using (user_id = auth.uid());

-- ------------------------------------------------------------------
-- Seed inicial de encuentros (opcional; el admin puede crear/editar más)
-- ------------------------------------------------------------------
insert into public.encuentros (numero, nombre, activo, encuestas_activas)
values (1, 'Primer encuentro',  false, false),
       (2, 'Segundo encuentro', true,  false)
on conflict (numero) do nothing;

-- ------------------------------------------------------------------
-- Bootstrap admin (ejecutar UNA vez, después de crear el usuario en
-- Authentication > Users). Reemplazá el email por el tuyo:
--
--   insert into public.admins (user_id, email)
--   select id, email from auth.users where email = 'tu-email@ejemplo.com'
--   on conflict (user_id) do nothing;
-- ------------------------------------------------------------------

-- ==================================================================
-- MIGRACIÓN (solo si YA corriste una versión anterior con la tabla
-- `inscripciones` de columnas fijas). En una base nueva, IGNORAR.
--
--   alter table public.acreditaciones drop constraint if exists acreditaciones_inscripcion_id_fkey;
--   alter table public.acreditaciones rename column inscripcion_id to respuesta_id;
--   alter table public.acreditaciones
--     add constraint acreditaciones_respuesta_id_fkey
--     foreign key (respuesta_id) references public.respuestas(id) on delete set null;
--   drop table if exists public.inscripciones cascade;
-- ==================================================================
