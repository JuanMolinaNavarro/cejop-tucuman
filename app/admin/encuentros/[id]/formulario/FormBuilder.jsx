"use client";

import { useState, useTransition, useCallback } from "react";
import Link from "next/link";
import { Reorder } from "framer-motion";
import { ArrowLeft, Plus, Loader2, Eye, EyeOff, Inbox, Copy } from "lucide-react";
import {
  actualizarFormularioMeta,
  publicarFormulario,
  despublicarFormulario,
  crearSeccion,
  crearSeccionDesdePlantilla,
  actualizarSeccion,
  eliminarSeccion,
  reordenarSecciones,
  crearPregunta,
  actualizarPregunta,
  eliminarPregunta,
  reordenarPreguntas,
} from "@/app/admin/actions";
import SeccionCard from "./SeccionCard";
import { PLANTILLAS_SECCION } from "@/lib/forms/plantillas";

export default function FormBuilder({ encuentro, formularioInicial, tipo = "inscripcion" }) {
  const form = formularioInicial;
  const esFeedback = tipo === "feedback";
  const [titulo, setTitulo] = useState(form.titulo ?? "");
  const [descripcion, setDescripcion] = useState(form.descripcion ?? "");
  const [estado, setEstado] = useState(form.estado ?? "borrador");
  const [secciones, setSecciones] = useState(form.secciones ?? []);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState(null); // { tipo: 'ok'|'error', texto }
  const [menuSeccion, setMenuSeccion] = useState(false);

  const flash = (tipo, texto) => {
    setMsg({ tipo, texto });
    setTimeout(() => setMsg(null), 3000);
  };
  const run = (fn) =>
    startTransition(async () => {
      const r = await fn();
      if (r && !r.ok) flash("error", r.error || "Ocurrió un error");
    });

  // --- Meta ---
  const guardarMeta = () =>
    run(() => actualizarFormularioMeta(form.id, { titulo, descripcion }));

  const togglePublicar = () =>
    startTransition(async () => {
      if (estado === "publicado") {
        const r = await despublicarFormulario(form.id);
        if (r.ok) setEstado("borrador");
        else flash("error", r.error);
      } else {
        const r = await publicarFormulario(form.id);
        if (r.ok) {
          setEstado("publicado");
          flash("ok", "Formulario publicado");
        } else flash("error", r.error);
      }
    });

  // --- Secciones ---
  const agregarSeccion = () =>
    startTransition(async () => {
      const r = await crearSeccion(form.id, { titulo: `Sección ${secciones.length + 1}` });
      if (r.ok) setSecciones((prev) => [...prev, r.data]);
      else flash("error", r.error);
    });

  const agregarDesdePlantilla = (plantillaId) =>
    startTransition(async () => {
      const r = await crearSeccionDesdePlantilla(form.id, plantillaId);
      if (r.ok) setSecciones((prev) => [...prev, r.data]);
      else flash("error", r.error);
    });

  const onReorderSecciones = (nuevas) => {
    setSecciones(nuevas);
    run(() => reordenarSecciones(nuevas.map((s) => s.id)));
  };

  const updateSeccion = useCallback((seccionId, patch) => {
    setSecciones((prev) =>
      prev.map((s) => (s.id === seccionId ? { ...s, ...patch } : s))
    );
  }, []);

  const persistSeccion = useCallback(
    (seccionId, patch) => run(() => actualizarSeccion(seccionId, patch)),
    []
  );

  const borrarSeccion = useCallback((seccionId) => {
    setSecciones((prev) => prev.filter((s) => s.id !== seccionId));
    run(() => eliminarSeccion(seccionId));
  }, []);

  // --- Preguntas (operan sobre la sección correspondiente) ---
  const setPreguntas = useCallback((seccionId, updater) => {
    setSecciones((prev) =>
      prev.map((s) =>
        s.id === seccionId
          ? { ...s, preguntas: updater(s.preguntas ?? []) }
          : s
      )
    );
  }, []);

  const agregarPregunta = useCallback(
    (seccionId, tipo) =>
      startTransition(async () => {
        const r = await crearPregunta(seccionId, tipo);
        if (r.ok) setPreguntas(seccionId, (ps) => [...ps, r.data]);
        else flash("error", r.error);
      }),
    [setPreguntas]
  );

  const updatePregunta = useCallback(
    (seccionId, preguntaId, patch) => {
      setPreguntas(seccionId, (ps) =>
        ps.map((p) => (p.id === preguntaId ? { ...p, ...patch } : p))
      );
    },
    [setPreguntas]
  );

  const persistPregunta = useCallback(
    (preguntaId, patch) => run(() => actualizarPregunta(preguntaId, patch)),
    []
  );

  const borrarPregunta = useCallback(
    (seccionId, preguntaId) => {
      setPreguntas(seccionId, (ps) => ps.filter((p) => p.id !== preguntaId));
      run(() => eliminarPregunta(preguntaId));
    },
    [setPreguntas]
  );

  const onReorderPreguntas = useCallback(
    (seccionId, nuevas) => {
      setPreguntas(seccionId, () => nuevas);
      run(() => reordenarPreguntas(seccionId, nuevas.map((p) => p.id)));
    },
    [setPreguntas]
  );

  const totalPreguntas = secciones.reduce(
    (n, s) => n + (s.preguntas?.length ?? 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#0b0c1e] text-white font-source antialiased">
      {/* Header */}
      <header className="bg-[#121434] border-b border-white/10 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/admin/encuentros"
              className="text-gray-400 hover:text-white transition-colors shrink-0"
              title="Volver a encuentros"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="min-w-0">
              <span className="font-montserrat font-bold text-sm tracking-wide uppercase block leading-none truncate">
                {encuentro.nombre}
              </span>
              <span className="text-[10px] font-encode tracking-widest text-[#b7bfe7] uppercase block mt-1">
                {esFeedback ? "Encuesta de feedback" : "Formulario de inscripción"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/admin/encuentros/${encuentro.id}/respuestas?tipo=${tipo}`}
              className="text-gray-400 hover:text-white text-[11px] font-encode uppercase tracking-wider border border-white/10 px-3 py-1.5 rounded-full hidden sm:inline-flex items-center gap-1.5"
            >
              <Inbox size={12} /> Respuestas
            </Link>
            <span
              className={`text-[10px] font-encode font-bold uppercase px-2.5 py-1 rounded-full border ${
                estado === "publicado"
                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                  : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
              }`}
            >
              {estado === "publicado" ? "Publicado" : "Borrador"}
            </span>
            <button
              onClick={togglePublicar}
              disabled={pending}
              className="bg-[#2c46bf] hover:bg-[#2c46bf]/90 disabled:opacity-60 text-white font-encode font-bold text-[11px] uppercase tracking-wider px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              {estado === "publicado" ? <EyeOff size={13} /> : <Eye size={13} />}
              {estado === "publicado" ? "Despublicar" : "Publicar"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto w-full p-6 md:p-8 space-y-6">
        {/* Meta del formulario */}
        <section className="bg-[#131535] border border-white/10 rounded-xl p-6 shadow-xl space-y-4">
          <div>
            <label className="block text-[10px] font-encode tracking-widest text-gray-400 uppercase mb-1.5">
              Título del formulario
            </label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              onBlur={guardarMeta}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-montserrat font-bold focus:outline-none focus:border-[#2c46bf] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-encode tracking-widest text-gray-400 uppercase mb-1.5">
              Descripción (opcional)
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              onBlur={guardarMeta}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2c46bf] transition-colors resize-none"
            />
          </div>
          <p className="text-[11px] text-gray-500">
            {secciones.length} {secciones.length === 1 ? "sección" : "secciones"} ·{" "}
            {totalPreguntas} {totalPreguntas === 1 ? "pregunta" : "preguntas"}
          </p>
        </section>

        {/* Secciones (reordenables) */}
        {secciones.length > 0 && (
          <Reorder.Group
            axis="y"
            values={secciones}
            onReorder={onReorderSecciones}
            className="space-y-6"
          >
            {secciones.map((seccion, idx) => (
              <SeccionCard
                key={seccion.id}
                seccion={seccion}
                indice={idx + 1}
                pending={pending}
                onUpdate={updateSeccion}
                onPersist={persistSeccion}
                onDelete={borrarSeccion}
                onAddPregunta={agregarPregunta}
                onUpdatePregunta={updatePregunta}
                onPersistPregunta={persistPregunta}
                onDeletePregunta={borrarPregunta}
                onReorderPreguntas={onReorderPreguntas}
              />
            ))}
          </Reorder.Group>
        )}

        <div>
          <button
            onClick={() => setMenuSeccion((v) => !v)}
            disabled={pending}
            className="w-full border border-dashed border-white/20 hover:border-[#2c46bf] hover:bg-white/5 text-gray-300 hover:text-white rounded-xl py-4 font-encode font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {pending ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            Agregar sección
          </button>

          {menuSeccion && (
            <div className="mt-2 bg-[#1a1d42] border border-white/15 rounded-lg p-1.5 space-y-1">
              <button
                onClick={() => {
                  setMenuSeccion(false);
                  agregarSeccion();
                }}
                className="w-full text-left px-3 py-2.5 rounded-md hover:bg-[#2c46bf]/20 transition-colors flex items-center gap-2.5"
              >
                <Plus size={15} className="text-[#b7bfe7] shrink-0" />
                <span className="text-sm text-gray-200">Sección en blanco</span>
              </button>

              <div className="px-3 pt-2 pb-1 text-[10px] font-encode uppercase tracking-widest text-gray-500">
                Plantillas reutilizables
              </div>
              {PLANTILLAS_SECCION.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setMenuSeccion(false);
                    agregarDesdePlantilla(p.id);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-md hover:bg-[#2c46bf]/20 transition-colors flex items-start gap-2.5"
                >
                  <Copy size={15} className="text-[#b7bfe7] shrink-0 mt-0.5" />
                  <span>
                    <span className="text-sm text-gray-200 block">{p.nombre}</span>
                    <span className="text-[11px] text-gray-500 block leading-snug">
                      {p.descripcion}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {esFeedback ? (
          <div className="text-[11px] text-gray-500 leading-relaxed pt-2 space-y-1.5">
            <p>
              Encuesta de feedback del encuentro. Se comparte con los asistentes
              (normalmente después del evento) en esta URL pública:
            </p>
            <code className="text-cejop-blue-light bg-white/5 border border-white/10 rounded px-2 py-1 inline-block">
              /feedback/{encuentro.id}
            </code>
            <p>
              Para que reciba respuestas: <strong className="text-gray-400">publicá</strong> la
              encuesta y poné el encuentro <strong className="text-gray-400">recibiendo respuestas</strong>.
            </p>
          </div>
        ) : (
          <p className="text-[11px] text-gray-500 leading-relaxed pt-2">
            Cada sección es un paso del formulario. Arrastrá desde el borde para reordenar secciones y
            preguntas. Los cambios se guardan solos. Para que el público lo vea:{" "}
            <strong className="text-gray-400">publicá</strong> el formulario y poné el encuentro como{" "}
            <strong className="text-gray-400">activo</strong> con las{" "}
            <strong className="text-gray-400">respuestas habilitadas</strong>.
          </p>
        )}
      </main>

      {/* Toast */}
      {msg && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-lg text-sm font-semibold shadow-2xl border ${
            msg.tipo === "ok"
              ? "bg-green-500/15 border-green-500/30 text-green-300"
              : "bg-red-500/15 border-red-500/30 text-red-300"
          }`}
        >
          {msg.texto}
        </div>
      )}
    </div>
  );
}
