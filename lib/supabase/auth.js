// Helpers de autorización de admin para el servidor (Server Components y
// Server Actions). La garantía real de acceso es RLS + `is_admin()` en la base;
// esto agrega chequeos tempranos y redirecciones limpias.
import { redirect } from "next/navigation";
import { createClient, hasSupabaseEnv } from "./server";

/** Usuario de Supabase Auth en la request actual, o null. */
export async function getUsuario() {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}

/** ¿El usuario actual está en la allowlist `admins`? */
export async function esAdmin() {
  if (!hasSupabaseEnv()) return false;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data, error } = await supabase.rpc("is_admin");
  return !error && data === true;
}

/**
 * Variante para Server Actions: NO redirige, devuelve un resultado.
 * @returns {Promise<{ok:true, supabase, user} | {ok:false, error:string}>}
 */
export async function verificarAdmin() {
  if (!hasSupabaseEnv()) return { ok: false, error: "Backend no configurado" };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };
  const { data: admin, error } = await supabase.rpc("is_admin");
  if (error || admin !== true) return { ok: false, error: "No autorizado" };
  return { ok: true, supabase, user };
}

/**
 * Exige sesión de admin. Si no hay, redirige a /admin (donde vive el login).
 * Devuelve { supabase, user } para reutilizar el cliente autenticado.
 * Usar al inicio de rutas y Server Actions de administración.
 */
export async function requireAdmin() {
  if (!hasSupabaseEnv()) redirect("/admin");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin");
  const { data: admin, error } = await supabase.rpc("is_admin");
  if (error || admin !== true) redirect("/admin");
  return { supabase, user };
}
