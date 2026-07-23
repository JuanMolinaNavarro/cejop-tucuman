"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  TrendingUp,
  UserCheck,
  CalendarRange,
  BarChart3,
  ArrowRight,
  LogOut,
  MessageSquare,
  MapPin,
  Cake,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DonutChart, BarrasVerticales } from "@/app/admin/charts";

const LOGO =
  "https://www.cejoptucuman.com/_next/static/media/cejop_brand_cropped.58e2cc0e.png";

function StatCard({ label, valor, sub, Icon, color = "text-white" }) {
  return (
    <div className="bg-[#131535] border border-white/10 rounded-xl p-6 relative overflow-hidden shadow-xl">
      <span className="text-gray-400 text-xs font-encode tracking-wider uppercase block">
        {label}
      </span>
      <span className={`font-montserrat font-black text-4xl block mt-2 ${color}`}>
        {valor}
      </span>
      {sub && <span className="text-xs text-[#b7bfe7] font-semibold mt-1 block">{sub}</span>}
      <div className="absolute right-4 bottom-3 text-white/5 pointer-events-none">
        <Icon size={68} strokeWidth={1} />
      </div>
    </div>
  );
}

function EstadoBadge({ estado }) {
  const map = {
    publicado: "bg-green-500/10 border-green-500/20 text-green-400",
    borrador: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  };
  const label = estado === "publicado" ? "Publicado" : estado === "borrador" ? "Borrador" : "Sin form.";
  const c = map[estado] ?? "bg-white/5 border-white/10 text-gray-400";
  return (
    <span className={`text-[9px] font-encode font-bold uppercase px-2 py-0.5 rounded border ${c}`}>
      {label}
    </span>
  );
}

export default function DashboardView({ data }) {
  const router = useRouter();
  const maxDia = Math.max(1, ...data.porDia.map((d) => d.count));
  const hayDatos = data.totalInscripciones > 0 || data.totalAcreditados > 0;
  const demo = data.demografia ?? {
    edad: null,
    localidad: [],
    totalEdad: 0,
    totalLocalidad: 0,
  };
  const hayDemografia = demo.totalEdad > 0 || demo.totalLocalidad > 0;

  const cerrarSesion = async () => {
    try {
      await createClient().auth.signOut();
    } finally {
      router.replace("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c1e] text-white font-source antialiased">
      {/* Header */}
      <header className="bg-[#121434] border-b border-white/10 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <img alt="CEJOP" className="h-8 w-auto object-contain" src={LOGO} />
          <div className="h-6 w-px bg-white/15 hidden sm:block" />
          <div className="text-center sm:text-left">
            <span className="font-montserrat font-bold text-sm tracking-wide text-white uppercase block leading-none">
              Panel de Administración
            </span>
            <span className="text-[10px] font-encode tracking-widest text-[#b7bfe7] uppercase block mt-1">
              CEJOP Tucumán
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-4 py-2 rounded-full bg-[#2c46bf] text-white text-xs font-encode font-bold uppercase tracking-wider flex items-center gap-2">
            <BarChart3 size={13} /> Dashboard
          </span>
          <Link
            href="/admin/encuentros"
            className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white text-xs font-encode font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <CalendarRange size={13} /> Encuentros
          </Link>
          <button
            onClick={cerrarSesion}
            className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white text-xs font-encode tracking-wider uppercase flex items-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut size={13} /> Salir
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full p-6 md:p-8 space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Inscripciones"
            valor={data.totalInscripciones}
            sub={`${data.totalEncuentros} ${data.totalEncuentros === 1 ? "encuentro" : "encuentros"}`}
            Icon={ClipboardList}
          />
          <StatCard
            label="Últimos 7 días"
            valor={data.inscripciones7}
            sub="nuevas inscripciones"
            Icon={TrendingUp}
            color="text-[#b7bfe7]"
          />
          <StatCard
            label="Acreditados"
            valor={data.totalAcreditados}
            sub="check-in en eventos"
            Icon={UserCheck}
            color="text-green-400"
          />
          <StatCard
            label="Feedback"
            valor={data.totalFeedback}
            sub="respuestas de encuestas"
            Icon={MessageSquare}
          />
        </div>

        {/* Encuentro activo */}
        {data.encuentroActivo && (
          <div className="bg-gradient-to-r from-[#2c46bf]/20 to-transparent border border-[#2c46bf]/20 rounded-xl px-6 py-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-encode uppercase tracking-widest text-[#b7bfe7]">
                Encuentro activo
              </span>
              <span className="font-montserrat font-bold text-white">
                {data.encuentroActivo.nombre}
              </span>
            </div>
            <Link
              href={`/admin/encuentros/${data.encuentroActivo.id}/respuestas`}
              className="text-xs font-encode uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              Ver respuestas <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* Gráfico */}
        <div className="bg-[#131535] border border-white/10 rounded-xl p-6 shadow-xl">
          <h3 className="font-montserrat font-bold text-xs text-white uppercase tracking-wider mb-6">
            Inscripciones por día · últimos 14 días
          </h3>
          <div className="h-56 w-full flex items-end justify-between gap-1.5 relative border-b border-white/10 px-1">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-1">
              {[1, 2, 3, 4].map((l) => (
                <div key={l} className="w-full border-t border-white/5" />
              ))}
            </div>
            {data.porDia.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end">
                <div className="text-[10px] text-white font-encode font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded absolute -top-7">
                  {d.count}
                </div>
                <div
                  className="w-full max-w-[26px] bg-gradient-to-t from-[#2c46bf] to-[#b7bfe7] rounded-t-md cursor-pointer hover:brightness-110 transition-all min-h-[2px]"
                  style={{ height: `${(d.count / maxDia) * 100}%` }}
                />
                <span className="text-[9px] text-gray-500 mt-2 font-encode tracking-wider">
                  {d.label}
                </span>
              </div>
            ))}
          </div>
          {!hayDatos && (
            <p className="text-center text-gray-500 text-xs font-encode uppercase tracking-wide mt-4">
              Todavía no hay inscripciones registradas.
            </p>
          )}
        </div>

        {/* Demografía agregada de todos los encuentros */}
        {hayDemografia && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Edad */}
            <div className="bg-[#131535] border border-white/10 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-montserrat font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                  <Cake size={14} className="text-[#b7bfe7]" /> Edad de los inscriptos
                </h3>
                <span className="text-[10px] font-encode text-gray-500 uppercase tracking-widest">
                  {demo.totalEdad} con dato
                </span>
              </div>
              {demo.edad?.distribucion?.length ? (
                <>
                  <div className="grid grid-cols-3 gap-3 text-center mb-5">
                    {[
                      { l: "Mínima", v: demo.edad.min },
                      { l: "Promedio", v: demo.edad.promedio },
                      { l: "Máxima", v: demo.edad.max },
                    ].map((s) => (
                      <div key={s.l} className="bg-white/5 rounded-lg py-3">
                        <span className="block text-[10px] font-encode text-gray-500 uppercase">
                          {s.l}
                        </span>
                        <span className="block font-montserrat font-black text-2xl text-white mt-1">
                          {s.v ?? "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <BarrasVerticales data={demo.edad.distribucion} />
                </>
              ) : (
                <p className="text-center text-gray-500 text-xs font-encode uppercase tracking-wide py-10">
                  Sin datos de edad todavía.
                </p>
              )}
            </div>

            {/* Localidad */}
            <div className="bg-[#131535] border border-white/10 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-montserrat font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                  <MapPin size={14} className="text-[#b7bfe7]" /> Localidad de los inscriptos
                </h3>
                <span className="text-[10px] font-encode text-gray-500 uppercase tracking-widest">
                  {demo.totalLocalidad} con dato
                </span>
              </div>
              {demo.localidad.length ? (
                <DonutChart data={demo.localidad} />
              ) : (
                <p className="text-center text-gray-500 text-xs font-encode uppercase tracking-wide py-10">
                  Sin datos de localidad todavía.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Resumen por encuentro */}
        <div className="bg-[#131535] border border-white/10 rounded-xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-white/10 bg-white/5">
            <h3 className="font-montserrat font-bold text-xs text-white uppercase tracking-wider">
              Resumen por encuentro
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-gray-400 uppercase font-encode tracking-wider text-[10px] border-b border-white/10">
                  <th className="px-6 py-3 font-semibold">Encuentro</th>
                  <th className="px-6 py-3 font-semibold">Formulario</th>
                  <th className="px-6 py-3 font-semibold text-center">Inscripciones</th>
                  <th className="px-6 py-3 font-semibold text-center">Acreditados</th>
                  <th className="px-6 py-3 font-semibold text-right">Gestionar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {data.porEncuentro.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 font-encode uppercase tracking-wide">
                      Todavía no hay encuentros.
                    </td>
                  </tr>
                ) : (
                  data.porEncuentro.map((e) => (
                    <tr key={e.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-montserrat font-bold text-white">{e.nombre}</span>
                          {e.activo && (
                            <span className="text-[9px] font-encode font-bold uppercase px-1.5 py-0.5 rounded border bg-[#2c46bf]/15 border-[#2c46bf]/30 text-[#b7bfe7]">
                              Activo
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <EstadoBadge estado={e.formEstado} />
                      </td>
                      <td className="px-6 py-4 text-center font-montserrat font-bold text-white">
                        {e.inscripciones}
                      </td>
                      <td className="px-6 py-4 text-center font-montserrat font-bold text-green-400">
                        {e.acreditados}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/encuentros/${e.id}/respuestas`}
                          className="text-[#b7bfe7] hover:text-white inline-flex items-center gap-1 font-encode uppercase tracking-wider text-[11px]"
                        >
                          Abrir <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
