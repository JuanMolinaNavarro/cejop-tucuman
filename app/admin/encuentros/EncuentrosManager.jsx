"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Trash2,
  LogOut,
  FileText,
  Loader2,
  CalendarDays,
  Inbox,
  MessageSquare,
  UserCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  crearEncuentro,
  actualizarEncuentro,
  eliminarEncuentro,
} from "../actions";

function Switch({ on, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-10 h-5 rounded-full p-0.5 transition-colors focus:outline-none disabled:opacity-50 ${
        on ? "bg-green-500" : "bg-white/10"
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full bg-white transition-transform ${
          on ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function EstadoForm({ estado }) {
  const map = {
    publicado: { l: "Publicado", c: "bg-green-500/10 border-green-500/20 text-green-400" },
    borrador: { l: "Borrador", c: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" },
  };
  const s = map[estado] ?? {
    l: "Sin formulario",
    c: "bg-white/5 border-white/10 text-gray-400",
  };
  return (
    <span
      className={`text-[9px] font-encode font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${s.c}`}
    >
      {s.l}
    </span>
  );
}

export default function EncuentrosManager({ encuentrosIniciales }) {
  const [encuentros, setEncuentros] = useState(encuentrosIniciales ?? []);
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const cerrarSesion = async () => {
    try {
      await createClient().auth.signOut();
    } finally {
      router.replace("/admin");
    }
  };

  const crear = () => {
    setError("");
    if (!nombre.trim()) {
      setError("Poné un nombre para el encuentro.");
      return;
    }
    startTransition(async () => {
      const r = await crearEncuentro({ nombre, fecha });
      if (r.ok) {
        setEncuentros((prev) =>
          [...prev, { ...r.data, formEstado: null, respuestasCount: 0 }].sort(
            (a, b) => a.numero - b.numero
          )
        );
        setNombre("");
        setFecha("");
      } else {
        setError(r.error);
      }
    });
  };

  const setFlag = (enc, campo) => {
    const nuevo = !enc[campo];
    startTransition(async () => {
      const r = await actualizarEncuentro(enc.id, { [campo]: nuevo });
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setEncuentros((prev) =>
        prev.map((e) => {
          if (e.id === enc.id) return { ...e, [campo]: nuevo };
          // "activo" es excluyente
          if (campo === "activo" && nuevo) return { ...e, activo: false };
          return e;
        })
      );
    });
  };

  const guardarNombre = (enc, valor) => {
    const limpio = valor.trim();
    if (!limpio || limpio === enc.nombre) return;
    startTransition(async () => {
      const r = await actualizarEncuentro(enc.id, { nombre: limpio });
      if (r.ok) {
        setEncuentros((prev) =>
          prev.map((e) => (e.id === enc.id ? { ...e, nombre: limpio } : e))
        );
      } else {
        setError(r.error);
      }
    });
  };

  const eliminar = (enc) => {
    if (
      !confirm(
        `¿Eliminar "${enc.nombre}"? Se borran también su formulario y todas las respuestas. Esta acción no se puede deshacer.`
      )
    )
      return;
    startTransition(async () => {
      const r = await eliminarEncuentro(enc.id);
      if (r.ok) {
        setEncuentros((prev) => prev.filter((e) => e.id !== enc.id));
      } else {
        setError(r.error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0c1e] text-white font-source antialiased">
      {/* Header */}
      <header className="bg-[#121434] border-b border-white/10 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <img
            alt="CEJOP"
            className="h-8 w-auto object-contain"
            src="https://www.cejoptucuman.com/_next/static/media/cejop_brand_cropped.58e2cc0e.png"
          />
          <div className="h-6 w-px bg-white/15 hidden sm:block" />
          <div>
            <span className="font-montserrat font-bold text-sm tracking-wide uppercase block leading-none">
              Encuentros
            </span>
            <span className="text-[10px] font-encode tracking-widest text-[#b7bfe7] uppercase block mt-1">
              Gestión y formularios
            </span>
          </div>
        </div>
        <button
          onClick={cerrarSesion}
          className="text-gray-400 hover:text-white transition-colors text-xs font-encode tracking-wider uppercase flex items-center gap-2 border border-white/10 px-4 py-2 rounded-full bg-white/5 cursor-pointer"
        >
          <LogOut size={13} />
          Cerrar sesión
        </button>
      </header>

      <main className="max-w-4xl mx-auto w-full p-6 md:p-8 space-y-8">
        {/* Crear encuentro */}
        <section className="bg-[#131535] border border-white/10 rounded-xl p-6 shadow-xl">
          <h2 className="font-montserrat font-bold text-xs text-white uppercase tracking-wider mb-4">
            Nuevo encuentro
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre (ej. Tercer encuentro)"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2c46bf] transition-colors"
            />
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2c46bf] transition-colors [color-scheme:dark]"
            />
            <button
              onClick={crear}
              disabled={pending}
              className="bg-[#2c46bf] hover:bg-[#2c46bf]/90 disabled:opacity-60 text-white font-encode font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {pending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Crear
            </button>
          </div>
          {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
        </section>

        {/* Lista */}
        <section className="space-y-4">
          {encuentros.length === 0 ? (
            <div className="bg-[#131535] border border-white/10 rounded-xl p-8 text-center text-gray-500 font-encode tracking-wide uppercase text-xs">
              Todavía no hay encuentros. Creá el primero arriba.
            </div>
          ) : (
            encuentros.map((enc) => (
              <div
                key={enc.id}
                className="bg-[#131535] border border-white/10 rounded-xl p-5 shadow-xl flex flex-col gap-4"
              >
                {/* Fila 1: número + nombre + badges + eliminar */}
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-9 h-9 rounded-lg bg-[#2c46bf]/20 border border-[#2c46bf]/30 text-[#b7bfe7] font-montserrat font-bold flex items-center justify-center text-sm">
                    {enc.numero}
                  </span>
                  <div className="min-w-0 flex-1">
                    <input
                      defaultValue={enc.nombre}
                      onBlur={(e) => guardarNombre(enc, e.target.value)}
                      className="w-full bg-transparent border border-transparent hover:border-white/10 focus:border-[#2c46bf] rounded px-2 py-1 -ml-2 font-montserrat font-bold text-white text-base focus:outline-none transition-colors"
                    />
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 px-0.5">
                      <EstadoForm estado={enc.formEstado} />
                      <span className="text-[11px] text-gray-500">
                        {enc.respuestasCount ?? 0}{" "}
                        {(enc.respuestasCount ?? 0) === 1 ? "respuesta" : "respuestas"}
                      </span>
                      {enc.fecha && (
                        <span className="text-[11px] text-gray-500 flex items-center gap-1">
                          <CalendarDays size={11} />
                          {enc.fecha}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => eliminar(enc)}
                    disabled={pending}
                    className="shrink-0 text-gray-500 hover:text-red-400 border border-white/10 hover:border-red-400/30 p-2 rounded-lg transition-colors disabled:opacity-50"
                    title="Eliminar encuentro"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Fila 2: toggles + acciones */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/5 pt-4">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-encode tracking-wider text-gray-400">
                    <label className="flex items-center gap-2">
                      <span className="uppercase">Activo</span>
                      <Switch on={enc.activo} onClick={() => setFlag(enc, "activo")} disabled={pending} />
                    </label>
                    <label className="flex items-center gap-2">
                      <span className="uppercase">Recibir resp.</span>
                      <Switch
                        on={enc.encuestas_activas}
                        onClick={() => setFlag(enc, "encuestas_activas")}
                        disabled={pending}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/encuentros/${enc.id}/formulario`}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-encode font-bold text-[11px] uppercase tracking-wider px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText size={13} />
                      Formulario
                    </Link>
                    <Link
                      href={`/admin/encuentros/${enc.id}/respuestas`}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-encode font-bold text-[11px] uppercase tracking-wider px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Inbox size={13} />
                      Respuestas
                    </Link>
                    <Link
                      href={`/admin/encuentros/${enc.id}/formulario?tipo=feedback`}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-encode font-bold text-[11px] uppercase tracking-wider px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={13} />
                      Feedback
                    </Link>
                    <Link
                      href={`/admin/encuentros/${enc.id}/acreditacion`}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-encode font-bold text-[11px] uppercase tracking-wider px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <UserCheck size={13} />
                      Acreditación
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        <p className="text-[11px] text-gray-500 leading-relaxed">
          <strong className="text-gray-400">Activo:</strong> es el encuentro que ve el público en la
          página de inscripción (solo uno a la vez).{" "}
          <strong className="text-gray-400">Recibir resp.:</strong> habilita o pausa la recepción de
          respuestas (de inscripción y de feedback). Cada formulario además tiene que estar{" "}
          <em>publicado</em> para aceptar respuestas.
        </p>
      </main>
    </div>
  );
}
