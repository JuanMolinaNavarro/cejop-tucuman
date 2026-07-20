"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";
import CampoPregunta from "./CampoPregunta";
import { validarValor } from "@/lib/forms/validation";
import { enviarInscripcion } from "./actions";

export default function RenderizadorFormulario({ formulario, tipo = "inscripcion" }) {
  const esFeedback = tipo === "feedback";
  const secciones = formulario.secciones ?? [];
  const total = secciones.length;

  const [step, setStep] = useState(0);
  const [valores, setValores] = useState({});
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");

  const seccionActual = secciones[step];
  const percent = Math.round(((step + 1) / total) * 100);

  const setValor = (pid, v) => {
    setValores((prev) => ({ ...prev, [pid]: v }));
    if (errores[pid]) setErrores((prev) => ({ ...prev, [pid]: null }));
  };

  const validarSeccion = (sec) => {
    const errs = {};
    for (const p of sec.preguntas ?? []) {
      const e = validarValor(p, valores[p.id]);
      if (e) errs[p.id] = e;
    }
    return errs;
  };

  const handleNext = () => {
    const errs = validarSeccion(seccionActual);
    if (Object.keys(errs).length) {
      setErrores((prev) => ({ ...prev, ...errs }));
      return;
    }
    setStep((s) => s + 1);
    window.scrollTo(0, 0);
  };

  const handlePrev = () => {
    setStep((s) => s - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validar todo el formulario.
    const allErrs = {};
    for (const sec of secciones) Object.assign(allErrs, validarSeccion(sec));
    if (Object.keys(allErrs).length) {
      setErrores(allErrs);
      const idx = secciones.findIndex((sec) =>
        (sec.preguntas ?? []).some((p) => allErrs[p.id])
      );
      if (idx >= 0) setStep(idx);
      window.scrollTo(0, 0);
      return;
    }

    setEnviando(true);
    setErrorGeneral("");
    const r = await enviarInscripcion(formulario.id, valores);
    setEnviando(false);
    if (r.ok) setEnviado(true);
    else setErrorGeneral(r.error || "No se pudo enviar la inscripción.");
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      {/* Progreso */}
      <div className="mb-8">
        <div className="flex justify-between items-center text-xs font-encode tracking-widest text-cejop-blue-light uppercase mb-2">
          <span>
            Paso {step + 1} de {total}
          </span>
          <span>{percent}% completado</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.4 }}
            className="h-full bg-cejop-blue"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
            <h2 className="font-montserrat font-bold text-xl mb-1 text-cejop-blue-light">
              {seccionActual?.titulo}
            </h2>
            {seccionActual?.descripcion && (
              <p className="font-source text-sm text-white/50 mb-6">
                {seccionActual.descripcion}
              </p>
            )}

            <div className="space-y-5 mt-6">
              {(seccionActual?.preguntas ?? []).map((p) => (
                <div key={p.id}>
                  <label className="block font-source text-sm font-semibold mb-2">
                    {p.etiqueta}
                    {p.requerido && <span className="text-cejop-blue-light"> *</span>}
                  </label>
                  {p.ayuda && (
                    <p className="text-xs text-white/40 mb-2 -mt-1">{p.ayuda}</p>
                  )}
                  <CampoPregunta
                    pregunta={p}
                    valor={valores[p.id]}
                    onChange={(v) => setValor(p.id, v)}
                    error={errores[p.id]}
                  />
                  {errores[p.id] && (
                    <span className="text-xs text-red-400 mt-1 block">
                      {errores[p.id]}
                    </span>
                  )}
                </div>
              ))}
            </div>
        </motion.div>

        {errorGeneral && (
          <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg p-3 text-sm">
            {errorGeneral}
          </div>
        )}

        {/* Navegación */}
        <div className="mt-8 pt-6 border-t border-white/10 flex justify-between gap-4">
          {step > 0 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="btn-outline-bw text-xs px-6 py-3"
            >
              Anterior
            </button>
          ) : (
            <div />
          )}
          {step < total - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary-bw text-xs px-8 py-3"
            >
              Siguiente
            </button>
          ) : (
            <button
              type="submit"
              disabled={enviando}
              className="btn-primary text-xs px-8 py-3 disabled:opacity-60"
            >
              {enviando ? "Enviando…" : "Enviar inscripción"}
            </button>
          )}
        </div>
      </form>

      {/* Overlay de éxito */}
      <AnimatePresence>
        {enviado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#1a1a2e] rounded-2xl flex flex-col justify-center items-center text-center p-6 sm:p-10 z-10"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-cejop-blue rounded-full flex items-center justify-center mb-6"
            >
              <Check size={36} className="text-white" strokeWidth={3} />
            </motion.div>
            <h2 className="font-montserrat font-black text-2xl sm:text-3xl text-white uppercase mb-4">
              {esFeedback ? "¡Gracias por tu feedback!" : "¡Inscripción recibida!"}
            </h2>
            <p className="font-source text-white/70 max-w-md leading-relaxed mb-8">
              {esFeedback
                ? "Tu respuesta se registró. ¡Gracias por ayudarnos a mejorar los próximos encuentros!"
                : "Tu postulación se envió con éxito. Nos pondremos en contacto con vos a la brevedad."}
            </p>
            <Link href="/" className="btn-primary-bw text-xs px-8 py-4">
              Volver al inicio
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
