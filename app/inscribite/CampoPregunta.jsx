"use client";

// Renderiza el control adecuado según el tipo de pregunta.
// Reutiliza las clases del sistema de diseño: btn-toggle, priority-btn, badge-rank.
export default function CampoPregunta({ pregunta, valor, onChange, error }) {
  const cfg = pregunta.config ?? {};
  const opciones = cfg.opciones ?? [];
  const borde = error ? "border-red-400" : "border-white/10";
  const inputBase = `w-full bg-white/5 border ${borde} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cejop-blue transition-colors font-source`;

  switch (pregunta.tipo) {
    case "texto_corto":
      return (
        <input
          type="text"
          value={valor ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={cfg.placeholder || ""}
          className={inputBase}
        />
      );

    case "email":
      return (
        <input
          type="email"
          value={valor ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={cfg.placeholder || "tu@email.com"}
          className={inputBase}
        />
      );

    case "numero":
      return (
        <input
          type="number"
          inputMode="numeric"
          value={valor ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={cfg.placeholder || ""}
          min={cfg.min ?? undefined}
          max={cfg.max ?? undefined}
          className={`${inputBase} [color-scheme:dark]`}
        />
      );

    case "texto_largo":
      return (
        <textarea
          rows={cfg.rows ?? 4}
          value={valor ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={cfg.placeholder || ""}
          className={`${inputBase} resize-none`}
        />
      );

    case "boolean":
      return (
        <div className="flex gap-2">
          {[
            { v: true, l: cfg.etiqueta_si ?? "Sí" },
            { v: false, l: cfg.etiqueta_no ?? "No" },
          ].map((o) => (
            <button
              key={String(o.v)}
              type="button"
              onClick={() => onChange(o.v)}
              className={`btn-toggle flex-1 py-3 text-sm font-encode font-bold ${
                valor === o.v ? "active" : ""
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
      );

    case "seleccion_unica":
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {opciones.map((o) => (
            <button
              key={o.id}
              type="button"
              title={o.detalle || undefined}
              onClick={() => onChange(o.id)}
              className={`priority-btn ${valor === o.id ? "selected" : ""}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      );

    case "seleccion_multiple": {
      const arr = Array.isArray(valor) ? valor : [];
      const max = cfg.max;
      const toggle = (id) => {
        if (arr.includes(id)) onChange(arr.filter((x) => x !== id));
        else if (!max || arr.length < max) onChange([...arr, id]);
      };
      return (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {opciones.map((o) => {
              const sel = arr.includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  title={o.detalle || undefined}
                  onClick={() => toggle(o.id)}
                  className={`priority-btn ${sel ? "selected" : ""}`}
                >
                  {o.label}
                  {sel && <span className="badge-rank">✓</span>}
                </button>
              );
            })}
          </div>
          {(cfg.min || cfg.max) && (
            <p className="text-xs text-white/40 mt-2">
              {cfg.min && cfg.max
                ? `Elegí entre ${cfg.min} y ${cfg.max}.`
                : cfg.min
                ? `Elegí al menos ${cfg.min}.`
                : `Elegí como máximo ${cfg.max}.`}{" "}
              Seleccionadas: {arr.length}
            </p>
          )}
        </div>
      );
    }

    case "ranking": {
      const arr = Array.isArray(valor) ? valor : [];
      const n = cfg.n ?? 3;
      const toggle = (id) => {
        if (arr.includes(id)) onChange(arr.filter((x) => x !== id));
        else if (arr.length < n) onChange([...arr, id]);
      };
      return (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {opciones.map((o) => {
              const rank = arr.indexOf(o.id);
              const sel = rank >= 0;
              return (
                <button
                  key={o.id}
                  type="button"
                  title={o.detalle || undefined}
                  onClick={() => toggle(o.id)}
                  className={`priority-btn ${sel ? "selected" : ""}`}
                >
                  {o.label}
                  {sel && <span className="badge-rank">{rank + 1}</span>}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-white/40 mt-2">
            Tocá las opciones en orden de preferencia (elegí {n}). Seleccionadas:{" "}
            {arr.length}/{n}. Tocá de nuevo para quitar.
          </p>
        </div>
      );
    }

    default:
      return null;
  }
}
