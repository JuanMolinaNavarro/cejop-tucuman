"use client";

import { Fragment, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Search,
  ChevronDown,
  BarChart3,
  ListChecks,
  Trash2,
} from "lucide-react";
import { computarAnalisis, valorATexto } from "@/lib/forms/analisis";
import {
  toggleConfirmadoRespuesta,
  eliminarRespuesta,
} from "@/app/admin/actions";

function Switch({ on, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-10 h-5 rounded-full p-0.5 transition-colors focus:outline-none disabled:opacity-50 inline-block ${
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

function Barra({ label, count, percent, color = "#2c46bf", sufijo }) {
  return (
    <div className="space-y-1 text-xs">
      <div className="flex justify-between items-center gap-2">
        <span className="text-gray-300 truncate">{label}</span>
        <span className="font-encode text-gray-400 font-bold shrink-0">
          {count} {sufijo || ""} · {percent}%
        </span>
      </div>
      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function AnalisisItem({ a }) {
  return (
    <div className="bg-[#131535] border border-white/10 rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-white/10">
        <h3 className="font-montserrat font-bold text-sm text-white">{a.etiqueta}</h3>
        <span className="text-[10px] font-encode text-gray-500 uppercase tracking-wider shrink-0">
          {a.total} resp.
        </span>
      </div>

      {a.modo === "opciones" && (
        <div className="space-y-3">
          {a.opciones.map((o) => (
            <Barra key={o.id} label={o.label} count={o.count} percent={o.percent} />
          ))}
        </div>
      )}

      {a.modo === "ranking" && (
        <div className="space-y-3">
          <p className="text-[10px] text-gray-500 mb-1">
            Ordenado por puntaje ponderado (1er puesto = {a.n} pts).
          </p>
          {a.items.map((o) => (
            <Barra
              key={o.id}
              label={o.label}
              count={o.score}
              percent={
                a.items[0]?.score ? Math.round((o.score / a.items[0].score) * 100) : 0
              }
              sufijo="pts"
            />
          ))}
        </div>
      )}

      {a.modo === "numero" && (
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { l: "Mínimo", v: a.min },
            { l: "Promedio", v: a.promedio },
            { l: "Máximo", v: a.max },
          ].map((s) => (
            <div key={s.l} className="bg-white/5 rounded-lg py-3">
              <span className="block text-[10px] font-encode text-gray-500 uppercase">
                {s.l}
              </span>
              <span className="block font-montserrat font-black text-xl text-white mt-1">
                {s.v ?? "—"}
              </span>
            </div>
          ))}
        </div>
      )}

      {a.modo === "texto" && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {a.textos.length === 0 ? (
            <p className="text-xs text-gray-500">Sin respuestas.</p>
          ) : (
            a.textos.map((t, i) => (
              <p
                key={i}
                className="text-xs text-gray-300 bg-white/5 rounded-lg px-3 py-2 leading-relaxed"
              >
                {t}
              </p>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function RespuestasView({
  encuentro,
  formulario,
  respuestasIniciales,
  tipo = "inscripcion",
}) {
  const esFeedback = tipo === "feedback";
  const preguntas = useMemo(
    () => (formulario?.secciones ?? []).flatMap((s) => s.preguntas ?? []),
    [formulario]
  );
  const [respuestas, setRespuestas] = useState(respuestasIniciales ?? []);
  const [tab, setTab] = useState("respuestas");
  const [busqueda, setBusqueda] = useState("");
  const [expandida, setExpandida] = useState(null);
  const [pending, startTransition] = useTransition();

  const filtradas = respuestas.filter((r) => {
    const q = busqueda.toLowerCase();
    return (
      !q ||
      (r.nombre ?? "").toLowerCase().includes(q) ||
      (r.email ?? "").toLowerCase().includes(q) ||
      (r.telefono ?? "").includes(q)
    );
  });

  const confirmados = respuestas.filter((r) => r.confirmado).length;
  const analisis = useMemo(
    () => computarAnalisis(preguntas, respuestas),
    [preguntas, respuestas]
  );

  const toggleConf = (r) => {
    const nuevo = !r.confirmado;
    setRespuestas((prev) =>
      prev.map((x) => (x.id === r.id ? { ...x, confirmado: nuevo } : x))
    );
    startTransition(() => toggleConfirmadoRespuesta(r.id, nuevo));
  };

  const borrar = (r) => {
    if (!confirm(`¿Eliminar la respuesta de ${r.nombre || r.email || "esta persona"}?`))
      return;
    setRespuestas((prev) => prev.filter((x) => x.id !== r.id));
    startTransition(() => eliminarRespuesta(r.id));
  };

  const exportarCSV = () => {
    const headers = ["Nombre", "Email", "Teléfono", "Fecha", "Confirmado", ...preguntas.map((p) => p.etiqueta)];
    const filas = respuestas.map((r) => [
      r.nombre ?? "",
      r.email ?? "",
      r.telefono ?? "",
      new Date(r.created_at).toLocaleString("es-AR"),
      r.confirmado ? "Sí" : "No",
      ...preguntas.map((p) => valorATexto(p, r.respuestas?.[p.id])),
    ]);
    const csv =
      "data:text/csv;charset=utf-8,﻿" +
      [headers, ...filas]
        .map((fila) => fila.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
        .join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `respuestas_${(encuentro.nombre || "encuentro").replace(/\s+/g, "_")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0b0c1e] text-white font-source antialiased">
      {/* Header */}
      <header className="bg-[#121434] border-b border-white/10 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
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
                {esFeedback ? "Feedback — respuestas" : "Inscripciones — respuestas"}
              </span>
            </div>
          </div>
          <Link
            href={`/admin/encuentros/${encuentro.id}/formulario?tipo=${tipo}`}
            className="text-gray-400 hover:text-white transition-colors text-xs font-encode tracking-wider uppercase border border-white/10 px-4 py-2 rounded-full bg-white/5 shrink-0"
          >
            Editar formulario
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto w-full p-6 md:p-8 space-y-6">
        {!formulario ? (
          <div className="bg-[#131535] border border-white/10 rounded-xl p-8 text-center text-gray-500 font-encode uppercase tracking-wide text-xs">
            Este encuentro todavía no tiene formulario.
          </div>
        ) : (
          <>
            {/* Resumen + tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                <button
                  onClick={() => setTab("respuestas")}
                  className={`px-5 py-2 rounded-md font-montserrat text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                    tab === "respuestas" ? "bg-[#2c46bf] text-white shadow" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <ListChecks size={14} /> Respuestas
                </button>
                <button
                  onClick={() => setTab("analisis")}
                  className={`px-5 py-2 rounded-md font-montserrat text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                    tab === "analisis" ? "bg-[#2c46bf] text-white shadow" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <BarChart3 size={14} /> Análisis
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-2.5">
                  <div className="text-center">
                    <span className="text-[10px] font-encode text-gray-400 uppercase tracking-widest block">Total</span>
                    <span className="font-montserrat font-bold text-base block text-white mt-0.5">{respuestas.length}</span>
                  </div>
                  <div className="w-px bg-white/10 h-6 self-center" />
                  <div className="text-center">
                    <span className="text-[10px] font-encode text-gray-400 uppercase tracking-widest block">Confirm.</span>
                    <span className="font-montserrat font-bold text-base block text-green-400 mt-0.5">{confirmados}</span>
                  </div>
                </div>
                <button
                  onClick={exportarCSV}
                  disabled={respuestas.length === 0}
                  className="bg-[#2c46bf] hover:bg-[#2c46bf]/90 disabled:opacity-40 text-white font-encode font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-colors flex items-center gap-2 shrink-0"
                >
                  <Download size={14} /> CSV
                </button>
              </div>
            </div>

            {respuestas.length === 0 ? (
              <div className="bg-[#131535] border border-white/10 rounded-xl p-10 text-center text-gray-500 font-encode uppercase tracking-wide text-xs">
                Todavía no hay respuestas para este formulario.
              </div>
            ) : tab === "respuestas" ? (
              <>
                <div className="bg-[#131535] border border-white/10 rounded-xl p-4">
                  <div className="relative">
                    <input
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      placeholder="Buscar por nombre, email o teléfono..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pl-10 text-white focus:outline-none focus:border-[#2c46bf] transition-colors text-xs"
                    />
                    <Search className="absolute left-3.5 top-3 text-gray-400" size={14} />
                  </div>
                </div>

                <div className="bg-[#131535] border border-white/10 rounded-xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-gray-400 uppercase font-encode tracking-wider text-[10px]">
                          <th className="px-5 py-4 font-semibold w-8"></th>
                          <th className="px-5 py-4 font-semibold">Nombre</th>
                          <th className="px-5 py-4 font-semibold">Email</th>
                          <th className="px-5 py-4 font-semibold">Teléfono</th>
                          <th className="px-5 py-4 font-semibold">Fecha</th>
                          <th className="px-5 py-4 font-semibold text-center">Confirm.</th>
                          <th className="px-5 py-4 font-semibold w-8"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-gray-300">
                        {filtradas.map((r) => (
                          <Fragment key={r.id}>
                            <tr className="hover:bg-white/5 transition-colors">
                              <td className="px-5 py-3">
                                <button
                                  onClick={() => setExpandida(expandida === r.id ? null : r.id)}
                                  className="text-gray-400 hover:text-white transition-transform"
                                  style={{ transform: expandida === r.id ? "rotate(180deg)" : "none" }}
                                >
                                  <ChevronDown size={15} />
                                </button>
                              </td>
                              <td className="px-5 py-3 font-montserrat font-bold text-white">{r.nombre || "—"}</td>
                              <td className="px-5 py-3">{r.email || "—"}</td>
                              <td className="px-5 py-3">{r.telefono || "—"}</td>
                              <td className="px-5 py-3 text-gray-400">
                                {new Date(r.created_at).toLocaleDateString("es-AR")}
                              </td>
                              <td className="px-5 py-3 text-center">
                                <Switch on={r.confirmado} onClick={() => toggleConf(r)} disabled={pending} />
                              </td>
                              <td className="px-5 py-3 text-center">
                                <button
                                  onClick={() => borrar(r)}
                                  disabled={pending}
                                  className="text-gray-600 hover:text-red-400 transition-colors"
                                  title="Eliminar respuesta"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                            {expandida === r.id && (
                              <tr className="bg-[#0f1230]">
                                <td colSpan={7} className="px-5 py-4">
                                  <div className="space-y-2">
                                    {preguntas.map((p) => (
                                      <div key={p.id} className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3">
                                        <span className="text-[11px] font-encode uppercase tracking-wider text-gray-500">{p.etiqueta}</span>
                                        <span className="sm:col-span-2 text-gray-200">
                                          {valorATexto(p, r.respuestas?.[p.id]) || <span className="text-gray-600">—</span>}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        ))}
                        {filtradas.length === 0 && (
                          <tr>
                            <td colSpan={7} className="px-5 py-8 text-center text-gray-500 font-encode uppercase tracking-wide">
                              Sin coincidencias.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {analisis.map((a) => (
                  <AnalisisItem key={a.preguntaId} a={a} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
