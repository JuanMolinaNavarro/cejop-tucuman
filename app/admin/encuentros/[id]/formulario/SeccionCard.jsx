"use client";

import { useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import {
  GripVertical,
  Trash2,
  Plus,
  Type,
  AlignLeft,
  Mail,
  Hash,
  ToggleLeft,
  CircleDot,
  ListChecks,
  ListOrdered,
  MapPin,
} from "lucide-react";
import { TIPOS_PREGUNTA } from "@/lib/forms/tipos";
import PreguntaCard from "./PreguntaCard";

const ICONOS = {
  Type,
  AlignLeft,
  Mail,
  Hash,
  ToggleLeft,
  CircleDot,
  ListChecks,
  ListOrdered,
  MapPin,
};

export default function SeccionCard({
  seccion,
  indice,
  pending,
  onUpdate,
  onPersist,
  onDelete,
  onAddPregunta,
  onUpdatePregunta,
  onPersistPregunta,
  onDeletePregunta,
  onReorderPreguntas,
}) {
  const controls = useDragControls();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const preguntas = seccion.preguntas ?? [];

  return (
    <Reorder.Item
      value={seccion}
      dragListener={false}
      dragControls={controls}
      className="list-none bg-[#131535] border border-white/10 rounded-xl shadow-xl"
    >
      {/* Encabezado de la sección */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5 rounded-t-xl">
        <button
          onPointerDown={(e) => controls.start(e)}
          className="text-gray-500 hover:text-white cursor-grab active:cursor-grabbing touch-none shrink-0"
          title="Arrastrar para reordenar"
          aria-label="Reordenar sección"
        >
          <GripVertical size={18} />
        </button>
        <span className="text-[10px] font-encode font-bold tracking-widest text-[#b7bfe7] uppercase shrink-0">
          Paso {indice}
        </span>
        <input
          defaultValue={seccion.titulo}
          onBlur={(e) => {
            const v = e.target.value.trim();
            if (v && v !== seccion.titulo) {
              onUpdate(seccion.id, { titulo: v });
              onPersist(seccion.id, { titulo: v });
            }
          }}
          className="flex-1 bg-transparent border border-transparent hover:border-white/10 focus:border-[#2c46bf] rounded px-2 py-1 font-montserrat font-bold text-white focus:outline-none transition-colors min-w-0"
          placeholder="Título de la sección"
        />
        <button
          onClick={() => {
            if (confirm(`¿Eliminar la sección "${seccion.titulo}" y sus preguntas?`))
              onDelete(seccion.id);
          }}
          className="text-gray-500 hover:text-red-400 p-1.5 rounded transition-colors shrink-0"
          title="Eliminar sección"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Preguntas */}
      <div className="p-4 space-y-3">
        {preguntas.length > 0 ? (
          <Reorder.Group
            axis="y"
            values={preguntas}
            onReorder={(n) => onReorderPreguntas(seccion.id, n)}
            className="space-y-3"
          >
            {preguntas.map((pregunta) => (
              <PreguntaCard
                key={pregunta.id}
                pregunta={pregunta}
                seccionId={seccion.id}
                onUpdate={onUpdatePregunta}
                onPersist={onPersistPregunta}
                onDelete={onDeletePregunta}
              />
            ))}
          </Reorder.Group>
        ) : (
          <p className="text-center text-gray-600 text-xs font-encode uppercase tracking-wider py-4">
            Sin preguntas todavía
          </p>
        )}

        {/* Agregar pregunta */}
        <div>
          <button
            onClick={() => setMenuAbierto((v) => !v)}
            disabled={pending}
            className="w-full border border-dashed border-white/15 hover:border-[#2c46bf] hover:bg-white/5 text-gray-400 hover:text-white rounded-lg py-2.5 font-encode font-bold text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Plus size={14} />
            Agregar pregunta
          </button>

          {menuAbierto && (
            <div className="mt-2 bg-[#1a1d42] border border-white/15 rounded-lg p-1.5 grid grid-cols-2 sm:grid-cols-4 gap-1">
              {TIPOS_PREGUNTA.map((t) => {
                const Icon = ICONOS[t.icon] ?? Type;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      onAddPregunta(seccion.id, t.id);
                      setMenuAbierto(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#2c46bf]/20 text-left transition-colors"
                  >
                    <Icon size={15} className="text-[#b7bfe7] shrink-0" />
                    <span className="text-xs text-gray-200 leading-tight">{t.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Reorder.Item>
  );
}
