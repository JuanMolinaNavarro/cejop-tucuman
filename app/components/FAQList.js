"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    q: "¿Necesito experiencia previa en política?",
    a: "No. El programa está pensado para jóvenes que quieren aprender, no para quienes ya saben todo. Lo que valoramos es la curiosidad, el compromiso y las ganas de entender cómo funcionan las cosas."
  },
  {
    q: "¿Es un espacio partidario?",
    a: "No. CEJOP Tucumán no tiene afiliación partidaria ni ideológica. La pluralidad es una condición estructural del programa: convocamos jóvenes de distintas trayectorias precisamente porque creemos que aprender con otros que piensan distinto es más enriquecedor."
  },
  {
    q: "¿Tiene costo?",
    a: "El programa es gratuito. Estamos trabajando para garantizar también la accesibilidad en términos de transporte y materiales para jóvenes del interior de la provincia."
  },
  {
    q: "¿Quiénes son los referentes y docentes?",
    a: "Convocamos a referentes reales del sistema público: funcionarios del ejecutivo y legislativo, jueces, periodistas, empresarios, dirigentes de organizaciones sociales. No es una lista cerrada: se construye junto con cada edición del programa."
  },
  {
    q: "¿Cómo es el proceso de selección?",
    a: "Vas a completar un formulario de inscripción con datos básicos y una pregunta de motivación. Seleccionamos perfiles diversos para asegurar la heterogeneidad del grupo. La selección no evalúa conocimiento, sino potencial y compromiso."
  },
  {
    q: "¿Qué compromiso implica participar?",
    a: "El programa tiene encuentros periódicos durante ocho meses (abril–noviembre). Esperamos una participación activa y continua. La asistencia regular es parte del compromiso que asumís al sumarte."
  },
  {
    q: "¿Puedo participar si no soy de San Miguel de Tucumán?",
    a: "Sí. El programa tiene vocación federal dentro de la provincia y buscamos representar a jóvenes de distintas localidades de Tucumán. Estamos trabajando en soluciones de accesibilidad para quienes viven fuera de la capital."
  }
];

export default function FAQList() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="space-y-2">
      {faqData.map((item, idx) => (
        <div key={idx} className="border-b border-gray-200">
          <button
            onClick={() => toggleFAQ(idx)}
            className="w-full flex items-start justify-between gap-4 py-6 text-left group focus:outline-none"
          >
            <span className="font-montserrat font-semibold text-base md:text-lg text-cejop-dark group-hover:text-cejop-blue transition-colors duration-200">
              {item.q}
            </span>
            <span
              className={`shrink-0 mt-0.5 text-cejop-blue transition-transform duration-300 ${
                activeIndex === idx ? "rotate-180" : ""
              }`}
            >
              <ChevronDown size={20} />
            </span>
          </button>
          <AnimatePresence initial={false}>
            {activeIndex === idx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="font-source text-sm text-gray-600 leading-relaxed pb-6">
                  {item.a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
