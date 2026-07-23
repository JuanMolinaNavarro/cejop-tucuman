"use client";

import { useState } from "react";
import { MapPin, ChevronDown, Check } from "lucide-react";
import { NOMBRES_LOCALIDADES, normalizarClave } from "@/lib/forms/localidades";

// Combobox buscable de localidades de Tucumán. Guarda el nombre (string).
// Solo permite elegir de la lista (sin texto libre).
export default function ComboboxLocalidad({ value, onChange, error }) {
  const [query, setQuery] = useState(value ?? "");
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(0);

  const q = normalizarClave(query);
  const matches = q
    ? NOMBRES_LOCALIDADES.filter((n) => normalizarClave(n).includes(q))
    : NOMBRES_LOCALIDADES;
  const borde = error ? "border-red-400" : "border-white/10";

  const elegir = (nombre) => {
    setQuery(nombre);
    onChange(nombre);
    setAbierto(false);
  };

  // Al perder foco: vacío → limpia; match exacto → canónico; texto no válido →
  // vuelve al último valor válido (no se admite texto libre).
  const confirmarBlur = () => {
    if (query.trim() === "") {
      onChange("");
    } else {
      const canon = NOMBRES_LOCALIDADES.find((n) => normalizarClave(n) === q);
      if (canon) {
        setQuery(canon);
        onChange(canon);
      } else {
        setQuery(value ?? "");
      }
    }
    setAbierto(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setAbierto(true);
      setActivo((a) => Math.min(a + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActivo((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      if (abierto && matches[activo]) {
        e.preventDefault();
        elegir(matches[activo]);
      }
    } else if (e.key === "Escape") {
      setAbierto(false);
    }
  };

  return (
    <div className="relative">
      <MapPin
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setAbierto(true);
          setActivo(0);
        }}
        onFocus={() => setAbierto(true)}
        onBlur={confirmarBlur}
        onKeyDown={onKeyDown}
        placeholder="Buscá tu localidad..."
        autoComplete="off"
        role="combobox"
        aria-expanded={abierto}
        className={`w-full bg-white/5 border ${borde} rounded-lg pl-10 pr-9 py-3 text-white focus:outline-none focus:border-cejop-blue transition-colors font-source`}
      />
      <ChevronDown
        size={16}
        className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform ${
          abierto ? "rotate-180" : ""
        }`}
      />

      {abierto && matches.length > 0 && (
        <ul className="absolute z-30 mt-1 w-full max-h-60 overflow-y-auto bg-[#1a1d42] border border-white/10 rounded-lg shadow-2xl py-1">
          {matches.map((n, i) => (
            <li key={n}>
              <button
                type="button"
                // onMouseDown (no onClick): se dispara antes del blur del input.
                onMouseDown={(e) => {
                  e.preventDefault();
                  elegir(n);
                }}
                onMouseEnter={() => setActivo(i)}
                className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between gap-2 transition-colors ${
                  i === activo ? "bg-cejop-blue/25 text-white" : "text-gray-200 hover:bg-white/5"
                }`}
              >
                <span className="truncate">{n}</span>
                {normalizarClave(value ?? "") === normalizarClave(n) && (
                  <Check size={14} className="text-cejop-blue-light shrink-0" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
      {abierto && matches.length === 0 && (
        <div className="absolute z-30 mt-1 w-full bg-[#1a1d42] border border-white/10 rounded-lg shadow-2xl px-4 py-3 text-xs text-gray-400">
          Sin resultados en la lista.
        </div>
      )}
    </div>
  );
}
