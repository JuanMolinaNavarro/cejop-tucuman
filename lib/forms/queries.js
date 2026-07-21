// Lecturas de formularios/respuestas desde Supabase (lado servidor).
// Usar desde Server Components y Server Actions. Si Supabase no está
// configurado, devuelven valores vacíos para no romper el sitio.
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

/** Ordena secciones y preguntas por su campo `orden` (robusto ante el backend). */
export function ordenarFormulario(form) {
  if (!form) return form;
  const secciones = [...(form.secciones ?? [])]
    .sort((a, b) => a.orden - b.orden)
    .map((s) => ({
      ...s,
      preguntas: [...(s.preguntas ?? [])].sort((a, b) => a.orden - b.orden),
    }));
  return { ...form, secciones };
}

/** Todas las preguntas de un formulario, en orden de sección y de pregunta. */
export function preguntasEnOrden(form) {
  const ordenado = ordenarFormulario(form);
  return (ordenado?.secciones ?? []).flatMap((s) => s.preguntas ?? []);
}

// ------------------------------------------------------------------
// Encuentros
// ------------------------------------------------------------------

export async function getEncuentros() {
  if (!hasSupabaseEnv()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("encuentros")
    .select("*")
    .order("numero", { ascending: true });
  return data ?? [];
}

/**
 * Datos agregados para el dashboard del admin (todo con datos reales).
 * Requiere sesión admin (RLS). Distingue inscripción de feedback por el tipo
 * del formulario. Fechas calculadas en el servidor.
 */
export async function getDashboardData() {
  const vacio = {
    totalInscripciones: 0,
    inscripciones7: 0,
    totalFeedback: 0,
    totalAcreditados: 0,
    totalEncuentros: 0,
    encuentroActivo: null,
    porDia: [],
    porEncuentro: [],
  };
  if (!hasSupabaseEnv()) return vacio;
  const supabase = await createClient();

  const [encRes, formRes, respRes, acredRes] = await Promise.all([
    supabase.from("encuentros").select("*").order("numero", { ascending: true }),
    supabase.from("formularios").select("id, encuentro_id, tipo, estado"),
    supabase.from("respuestas").select("id, encuentro_id, formulario_id, created_at"),
    supabase.from("acreditaciones").select("id, encuentro_id"),
  ]);

  const encuentros = encRes.data ?? [];
  const forms = formRes.data ?? [];
  const respuestas = respRes.data ?? [];
  const acred = acredRes.data ?? [];

  const tipoPorForm = {};
  const formInscPorEnc = {};
  for (const f of forms) {
    tipoPorForm[f.id] = f.tipo;
    if (f.tipo === "inscripcion") formInscPorEnc[f.encuentro_id] = f;
  }

  const inscripciones = respuestas.filter(
    (r) => tipoPorForm[r.formulario_id] === "inscripcion"
  );
  const feedback = respuestas.filter(
    (r) => tipoPorForm[r.formulario_id] === "feedback"
  );

  // Últimos 7 días
  const ahora = new Date();
  const hace7 = new Date(ahora);
  hace7.setDate(ahora.getDate() - 7);
  const inscripciones7 = inscripciones.filter(
    (r) => new Date(r.created_at) >= hace7
  ).length;

  // Serie por día (últimos 14 días)
  const dias = [];
  const idx = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(ahora);
    d.setDate(ahora.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
    const item = { key, label, count: 0 };
    dias.push(item);
    idx[key] = item;
  }
  for (const r of inscripciones) {
    const key = new Date(r.created_at).toISOString().slice(0, 10);
    if (idx[key]) idx[key].count += 1;
  }

  // Conteos por encuentro
  const inscPorEnc = {};
  for (const r of inscripciones)
    inscPorEnc[r.encuentro_id] = (inscPorEnc[r.encuentro_id] ?? 0) + 1;
  const acredPorEnc = {};
  for (const a of acred)
    acredPorEnc[a.encuentro_id] = (acredPorEnc[a.encuentro_id] ?? 0) + 1;

  return {
    totalInscripciones: inscripciones.length,
    inscripciones7,
    totalFeedback: feedback.length,
    totalAcreditados: acred.length,
    totalEncuentros: encuentros.length,
    encuentroActivo: encuentros.find((e) => e.activo) ?? null,
    porDia: dias,
    porEncuentro: encuentros.map((e) => ({
      id: e.id,
      numero: e.numero,
      nombre: e.nombre,
      activo: e.activo,
      formEstado: formInscPorEnc[e.id]?.estado ?? null,
      inscripciones: inscPorEnc[e.id] ?? 0,
      acreditados: acredPorEnc[e.id] ?? 0,
    })),
  };
}

/**
 * Encuentros + resumen para el hub: estado del formulario de inscripción y
 * cantidad de respuestas. Requiere sesión admin (RLS sobre respuestas).
 */
export async function getEncuentrosConResumen() {
  if (!hasSupabaseEnv()) return [];
  const supabase = await createClient();
  const [encRes, formRes, respRes] = await Promise.all([
    supabase.from("encuentros").select("*").order("numero", { ascending: true }),
    supabase.from("formularios").select("id, encuentro_id, tipo, estado"),
    supabase.from("respuestas").select("encuentro_id"),
  ]);
  const encuentros = encRes.data ?? [];
  const forms = formRes.data ?? [];
  const resp = respRes.data ?? [];

  const countByEnc = {};
  for (const r of resp) {
    countByEnc[r.encuentro_id] = (countByEnc[r.encuentro_id] ?? 0) + 1;
  }
  const formInscByEnc = {};
  for (const f of forms) {
    if (f.tipo === "inscripcion") formInscByEnc[f.encuentro_id] = f;
  }

  return encuentros.map((e) => ({
    ...e,
    formEstado: formInscByEnc[e.id]?.estado ?? null,
    respuestasCount: countByEnc[e.id] ?? 0,
  }));
}

export async function getEncuentro(id) {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("encuentros")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data ?? null;
}

/** Encuentro marcado como activo (para el formulario público). */
export async function getEncuentroActivo() {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("encuentros")
    .select("*")
    .eq("activo", true)
    .order("numero", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data ?? null;
}

// ------------------------------------------------------------------
// Formularios
// ------------------------------------------------------------------

/**
 * Formulario PUBLICADO de un encuentro, con secciones y preguntas anidadas.
 * Lo lee el público en /inscribite (RLS permite SELECT si está publicado).
 */
export async function getFormularioPublicado(encuentroId, tipo = "inscripcion") {
  if (!hasSupabaseEnv() || !encuentroId) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("formularios")
    .select("*, secciones(*, preguntas(*))")
    .eq("encuentro_id", encuentroId)
    .eq("tipo", tipo)
    .eq("estado", "publicado")
    .maybeSingle();
  return data ? ordenarFormulario(data) : null;
}

/**
 * Formulario de un encuentro para EDITAR en el admin (incluye borradores).
 * Requiere sesión admin (RLS). Devuelve null si no existe.
 */
export async function getFormularioParaEditar(encuentroId, tipo = "inscripcion") {
  if (!hasSupabaseEnv() || !encuentroId) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("formularios")
    .select("*, secciones(*, preguntas(*))")
    .eq("encuentro_id", encuentroId)
    .eq("tipo", tipo)
    .maybeSingle();
  return data ? ordenarFormulario(data) : null;
}

export async function getFormularioPorId(formularioId) {
  if (!hasSupabaseEnv() || !formularioId) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("formularios")
    .select("*, secciones(*, preguntas(*))")
    .eq("id", formularioId)
    .maybeSingle();
  return data ? ordenarFormulario(data) : null;
}

// ------------------------------------------------------------------
// Respuestas (admin)
// ------------------------------------------------------------------

export async function getRespuestas(formularioId) {
  if (!hasSupabaseEnv() || !formularioId) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("respuestas")
    .select("*")
    .eq("formulario_id", formularioId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

// ------------------------------------------------------------------
// Acreditaciones (check-in)
// ------------------------------------------------------------------

export async function getAcreditaciones(encuentroId) {
  if (!hasSupabaseEnv() || !encuentroId) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("acreditaciones")
    .select("*")
    .eq("encuentro_id", encuentroId)
    .order("created_at", { ascending: false });
  return data ?? [];
}
