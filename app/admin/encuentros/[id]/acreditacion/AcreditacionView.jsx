"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Search,
  Check,
  UserPlus,
  Loader2,
  X,
} from "lucide-react";
import { acreditar, desacreditar, registrarWalkIn } from "@/app/admin/actions";

function hhmm(iso) {
  try {
    return new Date(iso).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "";
  }
}

export default function AcreditacionView({
  encuentro,
  inscriptosIniciales,
  acreditacionesIniciales,
}) {
  const [inscriptos] = useState(inscriptosIniciales ?? []);
  const [acreditaciones, setAcreditaciones] = useState(acreditacionesIniciales ?? []);
  const [busqueda, setBusqueda] = useState("");
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState(null);
  const [w, setW] = useState({ nombre: "", email: "", telefono: "" });

  const flash = (tipo, texto) => {
    setMsg({ tipo, texto });
    setTimeout(() => setMsg(null), 3000);
  };

  const acredPorResp = useMemo(() => {
    const m = new Map();
    for (const a of acreditaciones) if (a.respuesta_id) m.set(String(a.respuesta_id), a);
    return m;
  }, [acreditaciones]);

  const walkIns = acreditaciones.filter((a) => !a.respuesta_id);
  const presentes = acreditaciones.length;

  const filtrados = inscriptos.filter((i) => {
    const q = busqueda.toLowerCase();
    return (
      !q ||
      (i.nombre ?? "").toLowerCase().includes(q) ||
      (i.email ?? "").toLowerCase().includes(q) ||
      (i.telefono ?? "").includes(q)
    );
  });

  const togglePresente = (insc) => {
    const acred = acredPorResp.get(String(insc.id));
    if (acred) {
      setAcreditaciones((prev) => prev.filter((a) => a.id !== acred.id));
      startTransition(async () => {
        const r = await desacreditar(acred.id);
        if (!r.ok) flash("error", r.error);
      });
    } else {
      startTransition(async () => {
        const r = await acreditar(encuentro.id, insc);
        if (r.ok) setAcreditaciones((prev) => [r.data, ...prev]);
        else flash("error", r.error);
      });
    }
  };

  const registrar = () => {
    if (!w.nombre.trim()) {
      flash("error", "Poné al menos el nombre del walk-in.");
      return;
    }
    startTransition(async () => {
      const r = await registrarWalkIn(encuentro.id, w);
      if (r.ok) {
        setAcreditaciones((prev) => [r.data, ...prev]);
        setW({ nombre: "", email: "", telefono: "" });
      } else {
        flash("error", r.error);
      }
    });
  };

  const quitarWalkIn = (a) => {
    setAcreditaciones((prev) => prev.filter((x) => x.id !== a.id));
    startTransition(async () => {
      const r = await desacreditar(a.id);
      if (!r.ok) flash("error", r.error);
    });
  };

  const exportarCSV = () => {
    const headers = ["Nombre", "Email", "Teléfono", "Tipo", "Hora"];
    const filas = acreditaciones.map((a) => [
      a.nombre ?? "",
      a.email ?? "",
      a.telefono ?? "",
      a.tipo ?? "",
      hhmm(a.created_at),
    ]);
    const csv =
      "data:text/csv;charset=utf-8,﻿" +
      [headers, ...filas]
        .map((f) => f.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
        .join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `acreditados_${(encuentro.nombre || "encuentro").replace(/\s+/g, "_")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tipoBadge = (tipo) => {
    const map = {
      Confirmado: "bg-green-500/10 border-green-500/20 text-green-400",
      Inscripto: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
      "Walk-in": "bg-[#2c46bf]/15 border-[#2c46bf]/30 text-[#b7bfe7]",
    };
    return map[tipo] ?? "bg-white/5 border-white/10 text-gray-400";
  };

  return (
    <div className="min-h-screen bg-[#0b0c1e] text-white font-source antialiased">
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
                Acreditación · check-in
              </span>
            </div>
          </div>
          <button
            onClick={exportarCSV}
            disabled={acreditaciones.length === 0}
            className="bg-[#2c46bf] hover:bg-[#2c46bf]/90 disabled:opacity-40 text-white font-encode font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full transition-colors flex items-center gap-2 shrink-0"
          >
            <Download size={13} /> CSV
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto w-full p-6 md:p-8 space-y-6">
        {/* Contadores */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { l: "Inscriptos", v: inscriptos.length, c: "text-white" },
            { l: "Presentes", v: presentes, c: "text-green-400" },
            { l: "Walk-ins", v: walkIns.length, c: "text-[#b7bfe7]" },
          ].map((s) => (
            <div
              key={s.l}
              className="bg-[#131535] border border-white/10 rounded-xl p-5 text-center shadow-xl"
            >
              <span className="text-[10px] font-encode text-gray-400 uppercase tracking-widest block">
                {s.l}
              </span>
              <span className={`font-montserrat font-black text-3xl block mt-1 ${s.c}`}>
                {s.v}
              </span>
            </div>
          ))}
        </div>

        {/* Inscriptos */}
        <section className="space-y-4">
          <h2 className="font-montserrat font-bold text-xs text-white uppercase tracking-wider">
            Inscriptos
          </h2>
          <div className="bg-[#131535] border border-white/10 rounded-xl p-4">
            <div className="relative">
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, email o teléfono..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pl-10 text-white focus:outline-none focus:border-[#2c46bf] transition-colors text-sm"
              />
              <Search className="absolute left-3.5 top-3 text-gray-400" size={15} />
            </div>
          </div>

          {inscriptos.length === 0 ? (
            <div className="bg-[#131535] border border-white/10 rounded-xl p-8 text-center text-gray-500 font-encode uppercase tracking-wide text-xs">
              Este encuentro todavía no tiene inscriptos.
            </div>
          ) : (
            <div className="space-y-2">
              {filtrados.map((insc) => {
                const acred = acredPorResp.get(String(insc.id));
                const presente = Boolean(acred);
                return (
                  <div
                    key={insc.id}
                    className={`bg-[#131535] border rounded-xl p-4 flex items-center justify-between gap-4 transition-colors ${
                      presente ? "border-green-500/30" : "border-white/10"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-montserrat font-bold text-white truncate">
                          {insc.nombre || "—"}
                        </span>
                        {insc.confirmado && (
                          <span className="text-[9px] font-encode font-bold uppercase px-1.5 py-0.5 rounded border bg-green-500/10 border-green-500/20 text-green-400 shrink-0">
                            Confirmado
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 block truncate">
                        {[insc.email, insc.telefono].filter(Boolean).join(" · ") || "sin contacto"}
                      </span>
                    </div>
                    <button
                      onClick={() => togglePresente(insc)}
                      disabled={pending}
                      className={`shrink-0 font-encode font-bold text-[11px] uppercase tracking-wider px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 ${
                        presente
                          ? "bg-green-500/15 border border-green-500/30 text-green-400 hover:bg-green-500/25"
                          : "bg-[#2c46bf] text-white hover:bg-[#2c46bf]/90"
                      }`}
                    >
                      <Check size={14} />
                      {presente ? `Presente · ${hhmm(acred.created_at)}` : "Marcar presente"}
                    </button>
                  </div>
                );
              })}
              {filtrados.length === 0 && (
                <div className="bg-[#131535] border border-white/10 rounded-xl p-6 text-center text-gray-500 font-encode uppercase tracking-wide text-xs">
                  Sin coincidencias.
                </div>
              )}
            </div>
          )}
        </section>

        {/* Walk-ins */}
        <section className="space-y-4">
          <h2 className="font-montserrat font-bold text-xs text-white uppercase tracking-wider">
            Walk-ins (llegaron sin inscribirse)
          </h2>
          <div className="bg-[#131535] border border-white/10 rounded-xl p-4 shadow-xl">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={w.nombre}
                onChange={(e) => setW({ ...w, nombre: e.target.value })}
                placeholder="Nombre y apellido *"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2c46bf] transition-colors"
              />
              <input
                value={w.telefono}
                onChange={(e) => setW({ ...w, telefono: e.target.value })}
                placeholder="Teléfono"
                className="sm:w-40 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2c46bf] transition-colors"
              />
              <input
                value={w.email}
                onChange={(e) => setW({ ...w, email: e.target.value })}
                placeholder="Email"
                className="sm:w-48 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#2c46bf] transition-colors"
              />
              <button
                onClick={registrar}
                disabled={pending}
                className="bg-[#2c46bf] hover:bg-[#2c46bf]/90 disabled:opacity-60 text-white font-encode font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0"
              >
                {pending ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                Registrar
              </button>
            </div>
          </div>

          {walkIns.length > 0 && (
            <div className="space-y-2">
              {walkIns.map((a) => (
                <div
                  key={a.id}
                  className="bg-[#131535] border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-montserrat font-bold text-white truncate">
                        {a.nombre}
                      </span>
                      <span
                        className={`text-[9px] font-encode font-bold uppercase px-1.5 py-0.5 rounded border shrink-0 ${tipoBadge(
                          "Walk-in"
                        )}`}
                      >
                        Walk-in · {hhmm(a.created_at)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 block truncate">
                      {[a.email, a.telefono].filter(Boolean).join(" · ") || "sin contacto"}
                    </span>
                  </div>
                  <button
                    onClick={() => quitarWalkIn(a)}
                    disabled={pending}
                    className="shrink-0 text-gray-500 hover:text-red-400 border border-white/10 hover:border-red-400/30 p-2 rounded-lg transition-colors disabled:opacity-50"
                    title="Quitar walk-in"
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

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
