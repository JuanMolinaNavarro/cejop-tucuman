"use server";

// Envío del formulario público de inscripción.
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import { construirSchema, normalizarValor } from "@/lib/forms/validation";

const CONTACTO = ["nombre", "email", "telefono"];

export async function enviarInscripcion(formularioId, valores) {
  if (!hasSupabaseEnv()) return { ok: false, error: "Backend no configurado" };
  const supabase = await createClient();

  // Traer el formulario publicado + su encuentro para validar en el servidor
  // (nunca confiar en lo que manda el cliente).
  const { data: form } = await supabase
    .from("formularios")
    .select("*, secciones(*, preguntas(*)), encuentros(*)")
    .eq("id", formularioId)
    .eq("estado", "publicado")
    .maybeSingle();

  if (!form) return { ok: false, error: "El formulario no está disponible." };
  if (!form.encuentros?.encuestas_activas) {
    return { ok: false, error: "Las inscripciones están cerradas." };
  }

  const preguntas = (form.secciones ?? []).flatMap((s) => s.preguntas ?? []);

  // Validación autoritativa con Zod.
  const parsed = construirSchema(preguntas).safeParse(valores ?? {});
  if (!parsed.success) {
    return { ok: false, error: "Revisá los datos: algunas respuestas no son válidas." };
  }

  // Normalizar valores y extraer campos de contacto (según rol_contacto).
  const respuestas = {};
  const contacto = { nombre: null, email: null, telefono: null };
  for (const p of preguntas) {
    const v = normalizarValor(p, valores?.[p.id]);
    if (v === undefined) continue;
    respuestas[p.id] = v;
    const rol = p.config?.rol_contacto;
    if (rol && CONTACTO.includes(rol)) {
      contacto[rol] = typeof v === "string" ? v : String(v);
    }
  }

  const { error } = await supabase.from("respuestas").insert({
    formulario_id: form.id,
    encuentro_id: form.encuentros.id,
    nombre: contacto.nombre,
    email: contacto.email,
    telefono: contacto.telefono,
    respuestas,
  });

  if (error) {
    // El check de RLS también frena si el encuentro cerró las inscripciones.
    return { ok: false, error: "No se pudo enviar la inscripción. Intentá de nuevo." };
  }

  // TODO (Fase 7): enviar email de confirmación con Resend.
  return { ok: true };
}
