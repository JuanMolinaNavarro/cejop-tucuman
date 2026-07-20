@AGENTS.md

# CEJOP Tucumán

Landing page + panel de administración para **CEJOP Tucumán** (Centro de Jóvenes Políticos), un
programa de formación política e institucional para jóvenes de 18 a 30 años en Tucumán, Argentina.
Sitio en producción: `https://www.cejoptucuman.com`.

## ⚠️ Antes de escribir código

Este proyecto usa **Next.js 16.2.10** (App Router). Como indica `AGENTS.md`, las APIs y convenciones
pueden diferir de lo conocido. **Leé la guía relevante en `node_modules/next/dist/docs/` antes de
escribir código** (especialmente `01-app/` para route handlers, server actions, data fetching y
caching). Prestá atención a los avisos de deprecación.

**Gotchas de Next.js 16 ya detectados:**
- **`middleware` → `proxy`.** El archivo `middleware.js` está deprecado. Se usa `proxy.js` en la raíz
  con un export `proxy(request)` (misma funcionalidad). Ver `node_modules/.../16-proxy.md`.
- **`cookies()` es asíncrono**: `const cookieStore = await cookies()`.
- **Mutaciones vía Server Actions** (`'use server'`) + `useActionState` para estado de carga/errores.
  Validá siempre auth/autorización *dentro* de cada Server Action (son endpoints POST accesibles).

## Comandos

```bash
npm run dev      # servidor de desarrollo (localhost:3000)
npm run build    # build de producción
npm run start    # servir el build
npm run lint     # eslint (eslint.config.mjs, flat config)
```

## Stack

- **Next.js 16.2.10** — App Router, JavaScript (NO TypeScript)
- **React 19.2.4**
- **Tailwind CSS v4** — configurado vía `@import "tailwindcss"` y `@theme inline` en `app/globals.css` (no hay `tailwind.config.js`; PostCSS en `postcss.config.mjs`)
- **Framer Motion 12** — animaciones (`motion`, `AnimatePresence`)
- **lucide-react** — iconos
- Alias de imports: `@/*` → raíz del proyecto (`jsconfig.json`)

## Estructura

```
app/
  layout.js              # Root layout: fuentes (next/font/google) + metadata SEO. Server component.
  page.js                # Landing ("use client"). Hero con video + secciones.
  globals.css            # Tailwind v4: @theme (colores/fuentes) + clases utilitarias custom.
  icon.png               # Favicon (app icon convention)
  inscribite/
    page.js              # (server) trae encuentro activo + form 'inscripcion' publicado; "cerrado" si no hay.
    RenderizadorFormulario.jsx · CampoPregunta.jsx  # (client) wizard dinámico por secciones (recibe tipo).
    actions.js           # (server) enviarInscripcion(formularioId, valores): genérico, sirve inscripción y feedback.
  feedback/[id]/page.js  # (server, público) encuesta de feedback (form 'feedback' publicado) del encuentro [id].
  admin/
    page.js              # (client) Login Supabase Auth (+ is_admin) → redirige a /admin/encuentros.
    actions.js           # Server Actions: CRUD encuentros/formularios/secciones/preguntas/respuestas.
    encuentros/
      page.js            # (server, requireAdmin) Hub: lista/gestión de encuentros + cerrar sesión.
      EncuentrosManager.jsx  # (client) alta/edición/activar/borrar; links a Formulario y Respuestas.
      [id]/formulario/    # ?tipo=inscripcion|feedback (default inscripcion)
        page.js          # (server) get-or-create del formulario del encuentro (del tipo) + monta el builder.
        FormBuilder.jsx  # (client) orquestador: meta, publicar, secciones (Reorder), toasts.
        SeccionCard.jsx · PreguntaCard.jsx · ConfigEditor.jsx  # (client) editor por sección/pregunta/tipo.
      [id]/respuestas/    # ?tipo=inscripcion|feedback (default inscripcion)
        page.js          # (server) trae formulario (del tipo) + respuestas.
        RespuestasView.jsx  # (client) tabla (confirmar/borrar/CSV) + análisis genérico por pregunta.
      [id]/acreditacion/
        page.js          # (server) inscriptos (respuestas) + acreditaciones del encuentro.
        AcreditacionView.jsx  # (client) check-in: marcar presente, walk-ins, contadores, CSV.
  components/
    Header.js            # Nav fijo con estado de scroll + menú mobile ("use client").
    Footer.js            # Footer (server component).
    FAQList.js           # Acordeón de FAQ, data hardcodeada ("use client").
    Loader.js            # Splash de 1s al cargar ("use client").
lib/supabase/
    server.js            # Cliente Supabase para servidor (Server Actions/Components). hasSupabaseEnv().
    client.js            # Cliente Supabase para el navegador.
    auth.js              # requireAdmin() (redirige) y verificarAdmin() (para actions) + esAdmin().
    proxy.js             # updateSession(): refresca sesión y protege /admin. Usado por proxy.js raíz.
lib/forms/               # Núcleo del constructor de formularios dinámicos (JS puro, cliente+servidor)
    tipos.js             # Catálogo de los 8 tipos de pregunta (config, metadata, helpers de opción).
    validation.js        # validarValor/validarValores (fuente de verdad) + construirSchema (Zod 4).
    analisis.js          # computarAnalisis por pregunta (excluye campos de contacto) + valorATexto.
    queries.js           # Lecturas server: formularios publicados/edición, encuentros, respuestas.
    plantillas.js        # Plantillas de sección reutilizables (ej. "Datos de contacto"). Insertables en el builder.
proxy.js                 # Convención de Next 16 (ex-"middleware"). Env-guarded: no-op sin credenciales.
supabase/
    schema.sql           # Esquema DINÁMICO (formularios/secciones/preguntas/respuestas) + RLS. Correr en el SQL Editor.
public/                  # SVGs de ejemplo de create-next-app (sin usar en su mayoría)
```

Rutas públicas: `/` (landing) · `/inscribite` (inscripción del encuentro activo) · `/feedback/[id]`
(encuesta de feedback de un encuentro). Admin: `/admin` (login) · `/admin/encuentros` (hub) ·
`/admin/encuentros/[id]/formulario` · `/admin/encuentros/[id]/respuestas` (ambas con `?tipo`).

## Sistema de diseño

**Colores** (definidos en `app/globals.css` con `@theme inline`, usar como `bg-cejop-*`, `text-cejop-*`):

| Token | Hex | Uso |
|---|---|---|
| `cejop-dark` | `#1a1a2e` | Fondo oscuro principal, texto |
| `cejop-blue` | `#2c46bf` | Azul de marca / acentos |
| `cejop-blue-variant` | `#2d4bc1` | Hover de botones |
| `cejop-blue-secondary` | `#5267c9` | — |
| `cejop-blue-light` | `#b7bfe7` | Acentos claros sobre fondo oscuro |
| `cejop-bg` | `#f0f2fa` | Fondo de secciones claras |

**Fuentes** (cargadas en `layout.js`, expuestas como variables CSS):
`font-montserrat` (títulos, black/900), `font-encode` (Encode Sans Condensed — kickers/labels en
mayúsculas con tracking), `font-source` (Source Sans 3 — cuerpo).

**Clases utilitarias custom** (en `globals.css`): `btn-primary`, `btn-primary-bw`, `btn-outline-bw`,
`section-container` (max-w-7xl centrado con padding), `section-pad` (padding vertical de sección),
`scroll-trigger`.

## Backend (Supabase + Resend)

- **Persistencia + Auth:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`). **Emails:** Resend.
  **Validación:** Zod.
- **Variables de entorno:** ver `.env.example`. `.env.local` existe con placeholders vacíos; mientras
  estén vacíos, `hasSupabaseEnv()` y las guardas del `proxy.js` dejan el backend inactivo sin romper
  el sitio.
- **Esquema (modelo dinámico de formularios):** `supabase/schema.sql` — `encuentros` →
  `formularios` → `secciones` (pasos) → `preguntas` (`config` jsonb por tipo); las respuestas del
  público van en `respuestas` (contacto + `respuestas` jsonb `{pregunta_id: valor}`). Además
  `acreditaciones`, `pendientes`, `feedback`, `admins`. RLS con `is_admin()`: SELECT público solo si
  el formulario está `publicado`; INSERT de `respuestas` con check de `publicado` + `encuestas_activas`;
  gestión solo admin. El admin arma los formularios; **ya no hay tabla `inscripciones` de columnas
  fijas**. Correr el archivo en el SQL Editor. Ver plan en `~/.claude/plans/`.
- **Admin allowlist:** un usuario es admin si su `auth.uid()` está en `public.admins` (ver bloque
  "Bootstrap admin" al final del schema).
- **Setup manual pendiente del usuario:** crear proyecto Supabase + correr `schema.sql` + cargar env;
  crear cuenta Resend + verificar dominio + cargar `RESEND_API_KEY`.

## Estado actual y puntos importantes

- **Formularios dinámicos: funcionando de punta a punta.** El admin crea encuentros y arma sus
  formularios (`/admin/encuentros`); `/inscribite` renderiza el formulario publicado del encuentro
  activo y persiste las respuestas; el admin ve respuestas + análisis genérico y exporta CSV
  (`/admin/encuentros/[id]/respuestas`). Auth real de admin con Supabase Auth. `mockData.js` eliminado.
- **Auth admin:** login en `/admin` (cliente, Supabase `signInWithPassword` + chequeo `is_admin`) →
  redirige a `/admin/encuentros`. Rutas `/admin/*` protegidas por `proxy.js` (sesión) + `requireAdmin()`
  (server) + RLS (autorización real). Ya no hay credenciales hardcodeadas.
- **Pendiente — Emails (Resend, Fase 7):** en `app/inscribite/actions.js` hay un TODO para el email de
  confirmación; falta `RESEND_API_KEY` + dominio verificado.
- **Pendiente — Pulido de diseño (Fase 2):** imágenes con `<img>` + *hotlink* a producción/GCS (migrar
  a `next/image` + `remotePatterns`); la landing entera es `"use client"` siendo mayormente estática
  (migrable a server components aislando la interactividad); accesibilidad/responsive.
- **Dashboard legacy retirado:** las features del mock viejo (acreditación en puerta, feedback,
  campañas de email) NO se reconstruyeron —eran mock—; si se necesitan, son un proyecto aparte.

## Convenciones

- Componentes en JavaScript con extensión `.js`, export default por archivo.
- `"use client"` solo donde hay hooks/estado/eventos/Framer Motion.
- Estilos con clases Tailwind inline; patrones repetidos → clase custom en `globals.css`.
- Idioma del producto: español rioplatense (voseo). Mantené el tono en el copy.
