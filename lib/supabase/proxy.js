import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

/**
 * Refresca la sesión de Supabase en cada request y protege /admin.
 * Si Supabase todavía no está configurado, es un no-op (deja pasar todo).
 *
 * Se usa desde el archivo `proxy.js` de la raíz (en Next.js 16 el antiguo
 * "middleware" se llama ahora "proxy").
 */
export async function updateSession(request) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // No ejecutar código entre createServerClient y auth.getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protección de rutas de admin bajo /admin/* (la pantalla de login vive en
  // /admin y se maneja del lado del cliente; acá cubrimos posibles subrutas).
  const path = request.nextUrl.pathname;
  const isProtectedAdmin =
    path.startsWith("/admin/") && !path.startsWith("/admin/login");

  if (isProtectedAdmin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
