import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** ¿Están configuradas las credenciales de Supabase? */
export function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Cliente de Supabase para usar en el servidor (Server Components, Server
 * Actions y Route Handlers). Lee/escribe la sesión desde las cookies.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Llamado desde un Server Component (donde no se pueden setear
            // cookies). Es ignorable si el middleware refresca la sesión.
          }
        },
      },
    }
  );
}
