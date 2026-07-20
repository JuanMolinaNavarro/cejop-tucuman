"use server";

// Server Actions de administración: gestión de encuentros y del constructor de
// formularios (formularios/secciones/preguntas). Cada una valida admin; RLS es
// la garantía real. Devuelven { ok, error?, data? }.
import { revalidatePath } from "next/cache";
import { verificarAdmin } from "@/lib/supabase/auth";
import { configPorDefecto, IDS_TIPOS } from "@/lib/forms/tipos";
import { PLANTILLAS_POR_ID } from "@/lib/forms/plantillas";

function fail(error) {
  return { ok: false, error };
}

// ------------------------------------------------------------------
// Encuentros
// ------------------------------------------------------------------

export async function crearEncuentro({ nombre, fecha } = {}) {
  const auth = await verificarAdmin();
  if (!auth.ok) return fail(auth.error);
  const { supabase } = auth;

  if (!nombre || !nombre.trim()) return fail("El nombre es obligatorio");

  // numero autoincremental = max + 1
  const { data: ult } = await supabase
    .from("encuentros")
    .select("numero")
    .order("numero", { ascending: false })
    .limit(1)
    .maybeSingle();
  const numero = (ult?.numero ?? 0) + 1;

  const { data, error } = await supabase
    .from("encuentros")
    .insert({ numero, nombre: nombre.trim(), fecha: fecha || null })
    .select()
    .single();
  if (error) return fail(error.message);

  revalidatePath("/admin/encuentros");
  return { ok: true, data };
}

export async function actualizarEncuentro(id, patch = {}) {
  const auth = await verificarAdmin();
  if (!auth.ok) return fail(auth.error);
  const { supabase } = auth;

  const campos = {};
  if (patch.nombre !== undefined) campos.nombre = String(patch.nombre).trim();
  if (patch.fecha !== undefined) campos.fecha = patch.fecha || null;
  if (patch.encuestas_activas !== undefined)
    campos.encuestas_activas = Boolean(patch.encuestas_activas);

  // "activo" es excluyente: al activar uno, se desactivan los demás.
  if (patch.activo === true) {
    await supabase.from("encuentros").update({ activo: false }).neq("id", id);
    campos.activo = true;
  } else if (patch.activo === false) {
    campos.activo = false;
  }

  if (Object.keys(campos).length === 0) return { ok: true };

  const { error } = await supabase.from("encuentros").update(campos).eq("id", id);
  if (error) return fail(error.message);

  revalidatePath("/admin/encuentros");
  return { ok: true };
}

export async function eliminarEncuentro(id) {
  const auth = await verificarAdmin();
  if (!auth.ok) return fail(auth.error);
  const { error } = await auth.supabase.from("encuentros").delete().eq("id", id);
  if (error) return fail(error.message);
  revalidatePath("/admin/encuentros");
  return { ok: true };
}

// ------------------------------------------------------------------
// Formularios
// ------------------------------------------------------------------

/** Devuelve el formulario del encuentro (creándolo si no existe). */
export async function asegurarFormulario(encuentroId, tipo = "inscripcion") {
  const auth = await verificarAdmin();
  if (!auth.ok) return fail(auth.error);
  const { supabase } = auth;

  const { data: existente } = await supabase
    .from("formularios")
    .select("id")
    .eq("encuentro_id", encuentroId)
    .eq("tipo", tipo)
    .maybeSingle();
  if (existente) return { ok: true, data: existente };

  const { data, error } = await supabase
    .from("formularios")
    .insert({
      encuentro_id: encuentroId,
      tipo,
      titulo:
        tipo === "feedback" ? "Encuesta de feedback" : "Formulario de inscripción",
      estado: "borrador",
    })
    .select("id")
    .single();
  if (error) return fail(error.message);
  return { ok: true, data };
}

export async function actualizarFormularioMeta(formularioId, { titulo, descripcion } = {}) {
  const auth = await verificarAdmin();
  if (!auth.ok) return fail(auth.error);
  const campos = {};
  if (titulo !== undefined) campos.titulo = String(titulo).trim() || "Formulario";
  if (descripcion !== undefined) campos.descripcion = descripcion || null;
  const { error } = await auth.supabase
    .from("formularios")
    .update(campos)
    .eq("id", formularioId);
  if (error) return fail(error.message);
  return { ok: true };
}

export async function publicarFormulario(formularioId) {
  const auth = await verificarAdmin();
  if (!auth.ok) return fail(auth.error);
  const { supabase } = auth;

  // Validar que tenga al menos una pregunta antes de publicar.
  const { count } = await supabase
    .from("preguntas")
    .select("id", { count: "exact", head: true })
    .eq("formulario_id", formularioId);
  if (!count) return fail("Agregá al menos una pregunta antes de publicar");

  const { error } = await supabase
    .from("formularios")
    .update({ estado: "publicado" })
    .eq("id", formularioId);
  if (error) return fail(error.message);
  revalidatePath("/admin/encuentros");
  return { ok: true };
}

export async function despublicarFormulario(formularioId) {
  const auth = await verificarAdmin();
  if (!auth.ok) return fail(auth.error);
  const { error } = await auth.supabase
    .from("formularios")
    .update({ estado: "borrador" })
    .eq("id", formularioId);
  if (error) return fail(error.message);
  revalidatePath("/admin/encuentros");
  return { ok: true };
}

// ------------------------------------------------------------------
// Secciones
// ------------------------------------------------------------------

export async function crearSeccion(formularioId, { titulo } = {}) {
  const auth = await verificarAdmin();
  if (!auth.ok) return fail(auth.error);
  const { supabase } = auth;

  const { data: ult } = await supabase
    .from("secciones")
    .select("orden")
    .eq("formulario_id", formularioId)
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();
  const orden = (ult?.orden ?? -1) + 1;

  const { data, error } = await supabase
    .from("secciones")
    .insert({ formulario_id: formularioId, titulo: titulo || "Nueva sección", orden })
    .select()
    .single();
  if (error) return fail(error.message);
  return { ok: true, data: { ...data, preguntas: [] } };
}

/** Inserta una sección desde una plantilla (con todas sus preguntas). */
export async function crearSeccionDesdePlantilla(formularioId, plantillaId) {
  const auth = await verificarAdmin();
  if (!auth.ok) return fail(auth.error);
  const { supabase } = auth;

  const plantilla = PLANTILLAS_POR_ID[plantillaId];
  if (!plantilla) return fail("Plantilla inválida");

  const { data: ult } = await supabase
    .from("secciones")
    .select("orden")
    .eq("formulario_id", formularioId)
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();
  const orden = (ult?.orden ?? -1) + 1;

  const { data: seccion, error: eSec } = await supabase
    .from("secciones")
    .insert({
      formulario_id: formularioId,
      titulo: plantilla.seccion.titulo,
      descripcion: plantilla.seccion.descripcion ?? null,
      orden,
    })
    .select()
    .single();
  if (eSec) return fail(eSec.message);

  const filas = plantilla.seccion.preguntas.map((p, i) => ({
    seccion_id: seccion.id,
    formulario_id: formularioId,
    tipo: p.tipo,
    etiqueta: p.etiqueta,
    ayuda: p.ayuda ?? null,
    requerido: Boolean(p.requerido),
    orden: i,
    config: p.config ?? {},
  }));

  const { data: preguntas, error: ePreg } = await supabase
    .from("preguntas")
    .insert(filas)
    .select();
  if (ePreg) return fail(ePreg.message);

  const preguntasOrdenadas = (preguntas ?? []).sort((a, b) => a.orden - b.orden);
  return { ok: true, data: { ...seccion, preguntas: preguntasOrdenadas } };
}

export async function actualizarSeccion(seccionId, { titulo, descripcion } = {}) {
  const auth = await verificarAdmin();
  if (!auth.ok) return fail(auth.error);
  const campos = {};
  if (titulo !== undefined) campos.titulo = String(titulo).trim() || "Sección";
  if (descripcion !== undefined) campos.descripcion = descripcion || null;
  const { error } = await auth.supabase
    .from("secciones")
    .update(campos)
    .eq("id", seccionId);
  if (error) return fail(error.message);
  return { ok: true };
}

export async function eliminarSeccion(seccionId) {
  const auth = await verificarAdmin();
  if (!auth.ok) return fail(auth.error);
  const { error } = await auth.supabase.from("secciones").delete().eq("id", seccionId);
  if (error) return fail(error.message);
  return { ok: true };
}

export async function reordenarSecciones(idsEnOrden = []) {
  const auth = await verificarAdmin();
  if (!auth.ok) return fail(auth.error);
  const { supabase } = auth;
  for (let i = 0; i < idsEnOrden.length; i++) {
    const { error } = await supabase
      .from("secciones")
      .update({ orden: i })
      .eq("id", idsEnOrden[i]);
    if (error) return fail(error.message);
  }
  return { ok: true };
}

// ------------------------------------------------------------------
// Preguntas
// ------------------------------------------------------------------

export async function crearPregunta(seccionId, tipo) {
  const auth = await verificarAdmin();
  if (!auth.ok) return fail(auth.error);
  const { supabase } = auth;
  if (!IDS_TIPOS.includes(tipo)) return fail("Tipo de pregunta inválido");

  const { data: seccion, error: eSec } = await supabase
    .from("secciones")
    .select("id, formulario_id")
    .eq("id", seccionId)
    .single();
  if (eSec) return fail(eSec.message);

  const { data: ult } = await supabase
    .from("preguntas")
    .select("orden")
    .eq("seccion_id", seccionId)
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();
  const orden = (ult?.orden ?? -1) + 1;

  const { data, error } = await supabase
    .from("preguntas")
    .insert({
      seccion_id: seccionId,
      formulario_id: seccion.formulario_id,
      tipo,
      etiqueta: "Pregunta nueva",
      requerido: false,
      orden,
      config: configPorDefecto(tipo),
    })
    .select()
    .single();
  if (error) return fail(error.message);
  return { ok: true, data };
}

export async function actualizarPregunta(preguntaId, patch = {}) {
  const auth = await verificarAdmin();
  if (!auth.ok) return fail(auth.error);
  const campos = {};
  if (patch.etiqueta !== undefined) campos.etiqueta = String(patch.etiqueta);
  if (patch.ayuda !== undefined) campos.ayuda = patch.ayuda || null;
  if (patch.requerido !== undefined) campos.requerido = Boolean(patch.requerido);
  if (patch.config !== undefined) campos.config = patch.config;
  const { error } = await auth.supabase
    .from("preguntas")
    .update(campos)
    .eq("id", preguntaId);
  if (error) return fail(error.message);
  return { ok: true };
}

export async function eliminarPregunta(preguntaId) {
  const auth = await verificarAdmin();
  if (!auth.ok) return fail(auth.error);
  const { error } = await auth.supabase.from("preguntas").delete().eq("id", preguntaId);
  if (error) return fail(error.message);
  return { ok: true };
}

export async function reordenarPreguntas(seccionId, idsEnOrden = []) {
  const auth = await verificarAdmin();
  if (!auth.ok) return fail(auth.error);
  const { supabase } = auth;
  for (let i = 0; i < idsEnOrden.length; i++) {
    const { error } = await supabase
      .from("preguntas")
      .update({ orden: i, seccion_id: seccionId })
      .eq("id", idsEnOrden[i]);
    if (error) return fail(error.message);
  }
  return { ok: true };
}

// ------------------------------------------------------------------
// Respuestas (gestión desde el panel)
// ------------------------------------------------------------------

export async function toggleConfirmadoRespuesta(id, confirmado) {
  const auth = await verificarAdmin();
  if (!auth.ok) return fail(auth.error);
  const { error } = await auth.supabase
    .from("respuestas")
    .update({ confirmado: Boolean(confirmado) })
    .eq("id", id);
  if (error) return fail(error.message);
  return { ok: true };
}

export async function eliminarRespuesta(id) {
  const auth = await verificarAdmin();
  if (!auth.ok) return fail(auth.error);
  const { error } = await auth.supabase.from("respuestas").delete().eq("id", id);
  if (error) return fail(error.message);
  return { ok: true };
}

// ------------------------------------------------------------------
// Acreditación / check-in
// ------------------------------------------------------------------

/** Marca presente a un inscripto (crea la acreditación). */
export async function acreditar(encuentroId, respuesta) {
  const auth = await verificarAdmin();
  if (!auth.ok) return fail(auth.error);
  const tipo = respuesta?.confirmado ? "Confirmado" : "Inscripto";
  const { data, error } = await auth.supabase
    .from("acreditaciones")
    .insert({
      encuentro_id: encuentroId,
      respuesta_id: respuesta.id,
      nombre: respuesta.nombre,
      email: respuesta.email,
      telefono: respuesta.telefono,
      tipo,
    })
    .select()
    .single();
  if (error) return fail(error.message);
  return { ok: true, data };
}

/** Quita una acreditación (por id). */
export async function desacreditar(acreditacionId) {
  const auth = await verificarAdmin();
  if (!auth.ok) return fail(auth.error);
  const { error } = await auth.supabase
    .from("acreditaciones")
    .delete()
    .eq("id", acreditacionId);
  if (error) return fail(error.message);
  return { ok: true };
}

/** Registra una persona que llegó sin estar inscripta (walk-in). */
export async function registrarWalkIn(encuentroId, { nombre, email, telefono } = {}) {
  const auth = await verificarAdmin();
  if (!auth.ok) return fail(auth.error);
  if (!nombre || !nombre.trim()) return fail("El nombre es obligatorio");
  const { data, error } = await auth.supabase
    .from("acreditaciones")
    .insert({
      encuentro_id: encuentroId,
      respuesta_id: null,
      nombre: nombre.trim(),
      email: email || null,
      telefono: telefono || null,
      tipo: "Walk-in",
    })
    .select()
    .single();
  if (error) return fail(error.message);
  return { ok: true, data };
}
