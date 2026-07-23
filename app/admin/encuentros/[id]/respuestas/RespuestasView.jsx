"use client";

import { Fragment, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  ListChecks,
  Trash2,
  FileSpreadsheet,
  Users,
} from "lucide-react";
import { computarAnalisis, valorATexto } from "@/lib/forms/analisis";
import { Barra, DonutChart, BarrasVerticales } from "@/app/admin/charts";
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

function AnalisisItem({ a }) {
  // Selección única / booleano con 2-8 opciones usadas → torta. La múltiple NO
  // (sus porcentajes suman > 100%); muchas opciones tampoco (torta ilegible).
  const opcionesConDatos =
    a.modo === "opciones" && !a.multiple ? a.opciones.filter((o) => o.count > 0) : [];
  const opcionesComoTorta = opcionesConDatos.length >= 2 && opcionesConDatos.length <= 8;
  return (
    <div className="bg-[#131535] border border-white/10 rounded-xl p-5 shadow-xl h-80 flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-4 pb-2 border-b border-white/10 shrink-0">
        <h3
          className="font-montserrat font-bold text-sm text-white leading-tight line-clamp-2"
          title={a.etiqueta}
        >
          {a.etiqueta}
        </h3>
        <span className="text-[10px] font-encode text-gray-500 uppercase tracking-wider shrink-0 mt-0.5">
          {a.total} resp.
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
      {a.modo === "opciones" &&
        (opcionesComoTorta ? (
          <DonutChart
            data={opcionesConDatos.map((o) => ({
              valor: o.label,
              count: o.count,
              percent: o.percent,
            }))}
          />
        ) : (
          <div className="space-y-3">
            {a.opciones.map((o) => (
              <Barra key={o.id} label={o.label} count={o.count} percent={o.percent} />
            ))}
          </div>
        ))}

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
        <div className="space-y-4">
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
          {a.distribucion && a.distribucion.length > 1 && (
            <div className="space-y-3">
              <span className="text-[10px] font-encode text-gray-500 uppercase tracking-widest">
                Distribución
              </span>
              <BarrasVerticales data={a.distribucion} />
            </div>
          )}
        </div>
      )}

      {a.modo === "texto" &&
        (a.mostrar === "frecuencias" ? (
          a.frecuencias.length >= 2 && a.frecuencias.length <= 8 ? (
            <DonutChart data={a.frecuencias} />
          ) : (
            <div className="space-y-3">
              {a.frecuencias.slice(0, 15).map((f) => (
                <Barra key={f.valor} label={f.valor} count={f.count} percent={f.percent} />
              ))}
              {a.frecuencias.length > 15 && (
                <p className="text-[11px] text-gray-500 pt-1">
                  y {a.frecuencias.length - 15} valores más…
                </p>
              )}
            </div>
          )
        ) : (
          <div className="space-y-2">
            {a.textos.length === 0 ? (
              <p className="text-xs text-gray-500">Sin respuestas.</p>
            ) : (
              a.textos.map((t, i) => (
                <p
                  key={i}
                  className="text-xs text-gray-300 bg-white/5 rounded-lg px-3 py-2 leading-relaxed break-words"
                >
                  {t}
                </p>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Controles de paginación (Anterior / N de M / Siguiente).
function Paginador({ pagina, total, onCambio }) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center gap-2 text-xs font-encode shrink-0">
      <button
        onClick={() => onCambio(pagina - 1)}
        disabled={pagina <= 1}
        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
      >
        <ChevronLeft size={13} /> Anterior
      </button>
      <span className="text-gray-500 tabular-nums px-1 whitespace-nowrap">
        {pagina} / {total}
      </span>
      <button
        onClick={() => onCambio(pagina + 1)}
        disabled={pagina >= total}
        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
      >
        Siguiente <ChevronRight size={13} />
      </button>
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

  // Análisis: búsqueda de contactos + paginación (tabla y cards)
  const [contactoQuery, setContactoQuery] = useState("");
  const [pagContacto, setPagContacto] = useState(1);
  const [pagCards, setPagCards] = useState(1);
  const CONTACTOS_POR_PAGINA = 8;
  const CARDS_POR_PAGINA = 6;

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

  // Cards de análisis: solo lo analizable. Nombre/teléfono/email (campos de
  // contacto y correos) van a la tabla de contactos, no a una card.
  const analisisCards = useMemo(
    () => analisis.filter((a) => !a.contacto && a.tipo !== "email"),
    [analisis]
  );

  // Contactos filtrados por la búsqueda por nombre (también email/teléfono).
  const contactosFiltrados = useMemo(() => {
    const q = contactoQuery.trim().toLowerCase();
    if (!q) return respuestas;
    return respuestas.filter(
      (r) =>
        (r.nombre ?? "").toLowerCase().includes(q) ||
        (r.email ?? "").toLowerCase().includes(q) ||
        (r.telefono ?? "").includes(q)
    );
  }, [respuestas, contactoQuery]);

  const totalPagContactos = Math.max(
    1,
    Math.ceil(contactosFiltrados.length / CONTACTOS_POR_PAGINA)
  );
  const pagContactoActual = Math.min(pagContacto, totalPagContactos);
  const contactosPagina = contactosFiltrados.slice(
    (pagContactoActual - 1) * CONTACTOS_POR_PAGINA,
    pagContactoActual * CONTACTOS_POR_PAGINA
  );

  const totalPagCards = Math.max(1, Math.ceil(analisisCards.length / CARDS_POR_PAGINA));
  const pagCardsActual = Math.min(pagCards, totalPagCards);
  const cardsPagina = analisisCards.slice(
    (pagCardsActual - 1) * CARDS_POR_PAGINA,
    pagCardsActual * CARDS_POR_PAGINA
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

  const nombreArchivo = () => (encuentro.nombre || "encuentro").replace(/\s+/g, "_");

  // Tabla compartida por las exportaciones: contacto + una columna por pregunta.
  const construirTabla = () => {
    const headers = [
      "Nombre",
      "Email",
      "Teléfono",
      "Fecha",
      "Confirmado",
      ...preguntas.map((p, i) => p.etiqueta?.trim() || `Pregunta ${i + 1}`),
    ];
    const filas = respuestas.map((r) => [
      r.nombre ?? "",
      r.email ?? "",
      r.telefono ?? "",
      new Date(r.created_at).toLocaleString("es-AR"),
      r.confirmado ? "Sí" : "No",
      ...preguntas.map((p) => valorATexto(p, r.respuestas?.[p.id])),
    ]);
    return { headers, filas };
  };

  const exportarCSV = () => {
    const { headers, filas } = construirTabla();
    const csv =
      "data:text/csv;charset=utf-8,﻿" +
      [headers, ...filas]
        .map((fila) => fila.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
        .join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `respuestas_${nombreArchivo()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportarXLSX = async () => {
    const XLSX = await import("xlsx"); // carga bajo demanda
    const { headers, filas } = construirTabla();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...filas]);
    // ancho de columnas según el contenido más largo (con topes)
    ws["!cols"] = headers.map((h, i) => ({
      wch: Math.min(
        50,
        Math.max(12, h.length + 2, ...filas.map((f) => String(f[i] ?? "").length))
      ),
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Respuestas");
    XLSX.writeFile(wb, `respuestas_${nombreArchivo()}.xlsx`);
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
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={exportarXLSX}
                    disabled={respuestas.length === 0}
                    className="bg-[#2c46bf] hover:bg-[#2c46bf]/90 disabled:opacity-40 text-white font-encode font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-colors flex items-center gap-2"
                    title="Descargar como Excel (.xlsx)"
                  >
                    <FileSpreadsheet size={14} /> Excel
                  </button>
                  <button
                    onClick={exportarCSV}
                    disabled={respuestas.length === 0}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 text-gray-300 hover:text-white font-encode font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-xl transition-colors flex items-center gap-2"
                    title="Descargar como CSV"
                  >
                    <Download size={14} /> CSV
                  </button>
                </div>
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
              <div className="space-y-8">
                {/* Contactos: nombre/teléfono/email en una sola tabla */}
                <section className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Users size={15} className="text-[#b7bfe7]" />
                      <h3 className="font-montserrat font-bold text-sm text-white uppercase tracking-wide">
                        Contactos
                      </h3>
                      <span className="text-[10px] font-encode text-gray-500 uppercase tracking-widest">
                        {contactosFiltrados.length}
                      </span>
                    </div>
                    <div className="relative sm:w-72">
                      <input
                        value={contactoQuery}
                        onChange={(e) => {
                          setContactoQuery(e.target.value);
                          setPagContacto(1);
                        }}
                        placeholder="Buscar por nombre..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 pl-9 text-white focus:outline-none focus:border-[#2c46bf] transition-colors text-xs"
                      />
                      <Search className="absolute left-3 top-2.5 text-gray-400" size={13} />
                    </div>
                  </div>

                  <div className="bg-[#131535] border border-white/10 rounded-xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-white/5 border-b border-white/10 text-gray-400 uppercase font-encode tracking-wider text-[10px]">
                            <th className="px-5 py-3 font-semibold">Nombre</th>
                            <th className="px-5 py-3 font-semibold">Teléfono</th>
                            <th className="px-5 py-3 font-semibold">Email</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-gray-300">
                          {contactosPagina.map((r) => (
                            <tr key={r.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-5 py-2.5 font-montserrat font-bold text-white">
                                {r.nombre || "—"}
                              </td>
                              <td className="px-5 py-2.5">{r.telefono || "—"}</td>
                              <td className="px-5 py-2.5">{r.email || "—"}</td>
                            </tr>
                          ))}
                          {contactosPagina.length === 0 && (
                            <tr>
                              <td
                                colSpan={3}
                                className="px-5 py-8 text-center text-gray-500 font-encode uppercase tracking-wide"
                              >
                                Sin coincidencias.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Paginador
                      pagina={pagContactoActual}
                      total={totalPagContactos}
                      onCambio={setPagContacto}
                    />
                  </div>
                </section>

                {/* Análisis por pregunta: cards de tamaño fijo, paginadas */}
                <section className="space-y-4 border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={15} className="text-[#b7bfe7]" />
                      <h3 className="font-montserrat font-bold text-sm text-white uppercase tracking-wide">
                        Análisis por pregunta
                      </h3>
                      <span className="text-[10px] font-encode text-gray-500 uppercase tracking-widest">
                        {analisisCards.length}
                      </span>
                    </div>
                    <Paginador
                      pagina={pagCardsActual}
                      total={totalPagCards}
                      onCambio={setPagCards}
                    />
                  </div>

                  {analisisCards.length === 0 ? (
                    <div className="bg-[#131535] border border-white/10 rounded-xl p-10 text-center text-gray-500 font-encode uppercase tracking-wide text-xs">
                      No hay preguntas para analizar (solo campos de contacto).
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {cardsPagina.map((a) => (
                        <AnalisisItem key={a.preguntaId} a={a} />
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
