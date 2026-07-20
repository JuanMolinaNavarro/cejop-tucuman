"use client";

import { useState } from "react";
import { Reorder, useDragControls, AnimatePresence, motion } from "framer-motion";
import { GripVertical, Trash2, ChevronDown } from "lucide-react";
import { tipoInfo } from "@/lib/forms/tipos";
import ConfigEditor from "./ConfigEditor";

export default function PreguntaCard({
  pregunta,
  seccionId,
  onUpdate, // (seccionId, preguntaId, patch)
  onPersist, // (preguntaId, patch)
  onDelete, // (seccionId, preguntaId)
}) {
  const controls = useDragControls();
  const [abierto, setAbierto] = useState(false);
  const info = tipoInfo(pregunta.tipo);

  const setConfig = (config) => onUpdate(seccionId, pregunta.id, { config });
  const persistConfig = (config) => onPersist(pregunta.id, { config });

  return (
    <Reorder.Item
      value={pregunta}
      dragListener={false}
      dragControls={controls}
      className="list-none bg-white/[0.03] border border-white/10 rounded-lg"
    >
      {/* Fila principal */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button
          onPointerDown={(e) => controls.start(e)}
          className="text-gray-600 hover:text-white cursor-grab active:cursor-grabbing touch-none shrink-0"
          aria-label="Reordenar pregunta"
        >
          <GripVertical size={16} />
        </button>

        <input
          defaultValue={pregunta.etiqueta}
          onBlur={(e) => {
            const v = e.target.value;
            if (v !== pregunta.etiqueta) {
              onUpdate(seccionId, pregunta.id, { etiqueta: v });
              onPersist(pregunta.id, { etiqueta: v });
            }
          }}
          className="flex-1 bg-transparent border border-transparent hover:border-white/10 focus:border-[#2c46bf] rounded px-2 py-1 text-sm text-white focus:outline-none transition-colors min-w-0"
          placeholder="Texto de la pregunta"
        />

        <span className="text-[9px] font-encode font-bold uppercase tracking-wider text-[#b7bfe7] bg-[#2c46bf]/15 border border-[#2c46bf]/25 px-2 py-0.5 rounded shrink-0 hidden sm:inline">
          {info?.label ?? pregunta.tipo}
        </span>

        <label className="flex items-center gap-1.5 shrink-0" title="¿Obligatoria?">
          <span className="text-[9px] font-encode uppercase text-gray-500 hidden md:inline">
            Oblig.
          </span>
          <button
            type="button"
            onClick={() => {
              const nuevo = !pregunta.requerido;
              onUpdate(seccionId, pregunta.id, { requerido: nuevo });
              onPersist(pregunta.id, { requerido: nuevo });
            }}
            className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${
              pregunta.requerido ? "bg-green-500" : "bg-white/10"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                pregunta.requerido ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </label>

        <button
          onClick={() => setAbierto((v) => !v)}
          className="text-gray-400 hover:text-white p-1 shrink-0 transition-transform"
          style={{ transform: abierto ? "rotate(180deg)" : "none" }}
          aria-label="Editar pregunta"
        >
          <ChevronDown size={16} />
        </button>

        <button
          onClick={() => onDelete(seccionId, pregunta.id)}
          className="text-gray-600 hover:text-red-400 p-1 shrink-0 transition-colors"
          aria-label="Eliminar pregunta"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Panel expandible */}
      <AnimatePresence initial={false}>
        {abierto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-4 border-t border-white/10">
              <div>
                <label className="block text-[10px] font-encode tracking-widest text-gray-400 uppercase mb-1.5 mt-3">
                  Texto de ayuda (opcional)
                </label>
                <input
                  defaultValue={pregunta.ayuda ?? ""}
                  onBlur={(e) => {
                    const v = e.target.value;
                    if (v !== (pregunta.ayuda ?? "")) {
                      onUpdate(seccionId, pregunta.id, { ayuda: v });
                      onPersist(pregunta.id, { ayuda: v });
                    }
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#2c46bf] transition-colors"
                  placeholder="Aclaración que se muestra debajo de la pregunta"
                />
              </div>

              <ConfigEditor
                pregunta={pregunta}
                onChange={setConfig}
                onCommit={persistConfig}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}
