import { updateSession } from "@/lib/supabase/proxy";

// En Next.js 16, "middleware" pasó a llamarse "proxy" (misma funcionalidad).
export async function proxy(request) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Todas las rutas excepto:
     * - _next/static, _next/image
     * - archivos estáticos comunes (imágenes, video, favicon)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico)$).*)",
  ],
};
