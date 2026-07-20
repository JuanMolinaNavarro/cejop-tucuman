"use client";

import { ArrowUp, ArrowDown, X, Plus } from "lucide-react";
import { nuevaOpcion, ROLES_CONTACTO } from "@/lib/forms/tipos";

const inputCls =
  "bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#2c46bf] transition-colors";

function Campo({ label, children }) {
  return (
    <div>
      <label className="block text-[10px] font-encode tracking-widest text-gray-400 uppercase mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

// IMPORTANTE: componente a nivel de módulo (identidad estable). Si se definiera
// dentro de ConfigEditor, se recrearía en cada render y los inputs perderían el
// foco al escribir.
function OpcionesEditor({ config, set, commit, onCommit, conDetalle }) {
  const opciones = config.opciones ?? [];

  const mover = (i, delta) => {
    const j = i + delta;
    if (j < 0 || j >= opciones.length) return;
    const copia = [...opciones];
    [copia[i], copia[j]] = [copia[j], copia[i]];
    commit({ opciones: copia });
  };

  return (
    <Campo label="Opciones">
      <div className="space-y-2">
        {opciones.map((o, i) => (
          <div key={o.id} className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <input
                value={o.label}
                onChange={(e) =>
                  set({
                    opciones: opciones.map((x) =>
                      x.id === o.id ? { ...x, label: e.target.value } : x
                    ),
                  })
                }
                onBlur={() => onCommit(config)}
                className={`${inputCls} flex-1`}
                placeholder={`Opción ${i + 1}`}
              />
              <button
                onClick={() => mover(i, -1)}
                disabled={i === 0}
                className="text-gray-500 hover:text-white p-1.5 disabled:opacity-30"
                title="Subir"
              >
                <ArrowUp size={14} />
              </button>
              <button
                onClick={() => mover(i, 1)}
                disabled={i === opciones.length - 1}
                className="text-gray-500 hover:text-white p-1.5 disabled:opacity-30"
                title="Bajar"
              >
                <ArrowDown size={14} />
              </button>
              <button
                onClick={() =>
                  commit({ opciones: opciones.filter((x) => x.id !== o.id) })
                }
                className="text-gray-500 hover:text-red-400 p-1.5"
                title="Quitar opción"
              >
                <X size={14} />
              </button>
            </div>
            {conDetalle && (
              <input
                value={o.detalle ?? ""}
                onChange={(e) =>
                  set({
                    opciones: opciones.map((x) =>
                      x.id === o.id ? { ...x, detalle: e.target.value } : x
                    ),
                  })
                }
                onBlur={() => onCommit(config)}
                className={`${inputCls} w-full text-xs text-gray-300`}
                placeholder="Detalle / pregunta que se muestra al elegir (opcional)"
              />
            )}
          </div>
        ))}
        <button
          onClick={() =>
            commit({
              opciones: [
                ...opciones,
                nuevaOpcion(`Opción ${opciones.length + 1}`, opciones),
              ],
            })
          }
          className="w-full border border-dashed border-white/15 hover:border-[#2c46bf] text-gray-400 hover:text-white rounded-lg py-2 text-[11px] font-encode font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={13} /> Agregar opción
        </button>
      </div>
    </Campo>
  );
}

export default function ConfigEditor({ pregunta, onChange, onCommit }) {
  const config = pregunta.config ?? {};
  const set = (patch) => onChange({ ...config, ...patch });
  const commit = (patch) => {
    const c = { ...config, ...patch };
    onChange(c);
    onCommit(c);
  };

  switch (pregunta.tipo) {
    case "texto_corto":
      return (
        <div className="grid sm:grid-cols-2 gap-4">
          <Campo label="Placeholder">
            <input
              value={config.placeholder ?? ""}
              onChange={(e) => set({ placeholder: e.target.value })}
              onBlur={() => onCommit(config)}
              className={`${inputCls} w-full`}
            />
          </Campo>
          <Campo label="Guardar como (contacto)">
            <select
              value={config.rol_contacto ?? ""}
              onChange={(e) => commit({ rol_contacto: e.target.value })}
              className={`${inputCls} w-full [color-scheme:dark]`}
            >
              {ROLES_CONTACTO.map((r) => (
                <option key={r.id} value={r.id} className="bg-[#1a1d42] text-white">
                  {r.label}
                </option>
              ))}
            </select>
          </Campo>
        </div>
      );

    case "texto_largo":
      return (
        <Campo label="Placeholder">
          <input
            value={config.placeholder ?? ""}
            onChange={(e) => set({ placeholder: e.target.value })}
            onBlur={() => onCommit(config)}
            className={`${inputCls} w-full`}
          />
        </Campo>
      );

    case "email":
      return (
        <Campo label="Guardar como (contacto)">
          <select
            value={config.rol_contacto ?? "email"}
            onChange={(e) => commit({ rol_contacto: e.target.value })}
            className={`${inputCls} w-full [color-scheme:dark]`}
          >
            {ROLES_CONTACTO.map((r) => (
              <option key={r.id} value={r.id} className="bg-[#1a1d42] text-white">
                {r.label}
              </option>
            ))}
          </select>
        </Campo>
      );

    case "numero":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Campo label="Mínimo">
              <input
                type="number"
                value={config.min ?? ""}
                onChange={(e) =>
                  set({ min: e.target.value === "" ? null : Number(e.target.value) })
                }
                onBlur={() => onCommit(config)}
                className={`${inputCls} w-full`}
              />
            </Campo>
            <Campo label="Máximo">
              <input
                type="number"
                value={config.max ?? ""}
                onChange={(e) =>
                  set({ max: e.target.value === "" ? null : Number(e.target.value) })
                }
                onBlur={() => onCommit(config)}
                className={`${inputCls} w-full`}
              />
            </Campo>
            <label className="flex items-center gap-2 self-end pb-2">
              <input
                type="checkbox"
                checked={config.entero ?? false}
                onChange={(e) => commit({ entero: e.target.checked })}
                className="accent-[#2c46bf]"
              />
              <span className="text-xs text-gray-300">Solo enteros</span>
            </label>
          </div>
          <Campo label="Guardar como (contacto)">
            <select
              value={config.rol_contacto ?? ""}
              onChange={(e) => commit({ rol_contacto: e.target.value })}
              className={`${inputCls} w-full sm:w-64 [color-scheme:dark]`}
            >
              {ROLES_CONTACTO.filter(
                (r) => r.id === "" || r.id === "telefono"
              ).map((r) => (
                <option key={r.id} value={r.id} className="bg-[#1a1d42] text-white">
                  {r.label}
                </option>
              ))}
            </select>
          </Campo>
        </div>
      );

    case "boolean":
      return (
        <div className="grid grid-cols-2 gap-4">
          <Campo label="Etiqueta afirmativa">
            <input
              value={config.etiqueta_si ?? "Sí"}
              onChange={(e) => set({ etiqueta_si: e.target.value })}
              onBlur={() => onCommit(config)}
              className={`${inputCls} w-full`}
            />
          </Campo>
          <Campo label="Etiqueta negativa">
            <input
              value={config.etiqueta_no ?? "No"}
              onChange={(e) => set({ etiqueta_no: e.target.value })}
              onBlur={() => onCommit(config)}
              className={`${inputCls} w-full`}
            />
          </Campo>
        </div>
      );

    case "seleccion_unica":
      return (
        <OpcionesEditor
          config={config}
          set={set}
          commit={commit}
          onCommit={onCommit}
          conDetalle={false}
        />
      );

    case "seleccion_multiple":
      return (
        <div className="space-y-4">
          <OpcionesEditor
            config={config}
            set={set}
            commit={commit}
            onCommit={onCommit}
            conDetalle={false}
          />
          <div className="grid grid-cols-2 gap-4">
            <Campo label="Mínimo a elegir">
              <input
                type="number"
                min={0}
                value={config.min ?? ""}
                onChange={(e) =>
                  set({ min: e.target.value === "" ? null : Number(e.target.value) })
                }
                onBlur={() => onCommit(config)}
                className={`${inputCls} w-full`}
              />
            </Campo>
            <Campo label="Máximo a elegir">
              <input
                type="number"
                min={1}
                value={config.max ?? ""}
                onChange={(e) =>
                  set({ max: e.target.value === "" ? null : Number(e.target.value) })
                }
                onBlur={() => onCommit(config)}
                className={`${inputCls} w-full`}
              />
            </Campo>
          </div>
        </div>
      );

    case "ranking":
      return (
        <div className="space-y-4">
          <Campo label="Cantidad a elegir y ordenar (N)">
            <input
              type="number"
              min={1}
              max={(config.opciones ?? []).length || 1}
              value={config.n ?? 3}
              onChange={(e) => set({ n: Number(e.target.value) })}
              onBlur={() => onCommit(config)}
              className={`${inputCls} w-32`}
            />
          </Campo>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.con_detalle ?? false}
              onChange={(e) => commit({ con_detalle: e.target.checked })}
              className="accent-[#2c46bf]"
            />
            <span className="text-xs text-gray-300">
              Cada opción tiene un detalle/pregunta
            </span>
          </label>
          <OpcionesEditor
            config={config}
            set={set}
            commit={commit}
            onCommit={onCommit}
            conDetalle={config.con_detalle ?? false}
          />
        </div>
      );

    default:
      return null;
  }
}
