"use client";
// Componentes de gráficos reutilizables del admin (sin librerías: SVG + divs).
// Usados por el análisis de respuestas y por el dashboard.

// Barra horizontal con etiqueta + valor.
export function Barra({ label, count, percent, color = "#2c46bf", sufijo }) {
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

// Paleta para los segmentos de la torta (tonos fríos, distinguibles sobre fondo oscuro).
export const PALETA = [
  "#2c46bf",
  "#00b8d4",
  "#7c5cff",
  "#00c2a8",
  "#b7bfe7",
  "#3fa9f5",
  "#8a9bf0",
  "#f06292",
];

// Gráfico de torta (donut) + leyenda. data: [{ valor, count, percent }].
export function DonutChart({ data }) {
  const r = 40;
  const C = 2 * Math.PI * r;
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  const dashes = data.map((d) => (d.count / total) * C);
  const segmentos = data.map((d, i) => ({
    key: String(d.valor),
    color: PALETA[i % PALETA.length],
    dash: dashes[i],
    // offset = -(suma de los segmentos previos), calculado sin mutar variables
    offset: -dashes.slice(0, i).reduce((s, x) => s + x, 0),
  }));
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative shrink-0">
        <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="15" />
          {segmentos.map((s) => (
            <circle
              key={s.key}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="15"
              strokeDasharray={`${s.dash} ${C - s.dash}`}
              strokeDashoffset={s.offset}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-montserrat font-black text-lg text-white leading-none">{total}</span>
          <span className="text-[9px] font-encode text-gray-500 uppercase tracking-wider">total</span>
        </div>
      </div>
      <div className="w-full space-y-1.5">
        {data.map((d, i) => (
          <div key={String(d.valor)} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: PALETA[i % PALETA.length] }}
            />
            <span className="text-gray-300 truncate flex-1" title={String(d.valor)}>
              {d.valor}
            </span>
            <span className="text-gray-500 font-encode font-bold shrink-0">
              {d.count} · {d.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Bar chart vertical (histograma), mismo estilo que el dashboard. data: [{ valor, count }].
export function BarrasVerticales({ data }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="h-36 flex items-end justify-between gap-1 border-b border-white/10 px-0.5">
      {data.map((d) => (
        <div
          key={String(d.valor)}
          className="flex-1 flex flex-col items-center justify-end h-full group relative"
        >
          <span className="text-[9px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-1.5 py-0.5 rounded absolute -top-5 z-10 whitespace-nowrap">
            {d.count}
          </span>
          <div
            className="w-full max-w-[24px] bg-gradient-to-t from-[#2c46bf] to-[#b7bfe7] rounded-t cursor-pointer hover:brightness-110 transition-all min-h-[3px]"
            style={{ height: `${(d.count / max) * 100}%` }}
          />
          <span className="text-[8px] text-gray-500 mt-1 font-encode">{d.valor}</span>
        </div>
      ))}
    </div>
  );
}
