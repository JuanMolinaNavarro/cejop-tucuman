"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const prioritiesList = [
  { id: 'salud', label: 'Salud pública', question: '¿Cómo mejorar el acceso y la calidad del sistema de salud?' },
  { id: 'educacion', label: 'Educación', question: '¿Cómo transformar la educación para prepararnos para el futuro?' },
  { id: 'seguridad', label: 'Seguridad', question: '¿Cómo enfrentar la inseguridad de manera efectiva?' },
  { id: 'medio_ambiente', label: 'Medio ambiente', question: '¿Qué políticas ecológicas urgentes necesita Tucumán?' },
  { id: 'desarrollo_econ', label: 'Desarrollo económico', question: '¿Cómo reactivar la producción y la inversión en la provincia?' },
  { id: 'tecnologia', label: 'Tecnología', question: '¿Cómo integrar la innovación tecnológica en el sector productivo?' },
  { id: 'cultura', label: 'Cultura', question: '¿Cómo potenciar las industrias culturales e identidad local?' },
  { id: 'participacion', label: 'Participación ciudadana', question: '¿Cómo involucrar activamente a la sociedad en las decisiones?' },
  { id: 'derechos_humanos', label: 'Derechos humanos', question: '¿Cómo garantizar los derechos de todos los sectores?' },
  { id: 'inclusion_social', label: 'Inclusión social', question: '¿Qué políticas de integración social considerás indispensables?' },
  { id: 'sectores_vuln', label: 'Sectores vulnerables', question: '¿Cómo mejorar el acompañamiento a familias de bajos recursos?' },
  { id: 'transparencia', label: 'Transparencia', question: '¿Cómo asegurar el control y la rendición de cuentas pública?' },
  { id: 'empleo_joven', label: 'Empleo joven', question: '¿Cómo facilitar la inserción laboral de los jóvenes en Tucumán?' }
];

const axesList = [
  { id: 'reforma_elect', label: 'Reforma electoral', question: 'Reforma electoral, representación política y fortalecimiento democrático. Boleta Única vs. sistema de acoples: ¿qué cambia realmente en la representación política y cómo impacta en Tucumán?' },
  { id: 'juventud_part', label: 'Juventud y participación', question: '¿Cómo abrir canales efectivos para que la juventud incida en el diseño de políticas públicas reales?' },
  { id: 'mod_institucional', label: 'Modernización institucional', question: '¿Cómo lograr administraciones públicas más eficientes, ágiles y orientadas al ciudadano?' },
  { id: 'transp_leg', label: 'Transparencia legislativa', question: '¿Cómo abrir los parlamentos a la ciudadanía y facilitar el acceso a la información pública?' },
  { id: 'asesores_leg', label: 'Asesores legislativos', question: '¿Cuál es el rol técnico y la responsabilidad de los equipos de asesoría en el congreso?' },
  { id: 'cercania_ciudadana', label: 'Cercanía con la ciudadanía', question: '¿Cómo construir puentes de confianza y comunicación directa entre representantes y representados?' },
  { id: 'consensos_polarizacion', label: 'Consensos en polarización', question: '¿Cómo generar diálogos fructíferos y acuerdos transversales en contextos altamente polarizados?' },
  { id: 'politica_redes', label: 'Política y redes sociales', question: 'El impacto de los algoritmos y la desinformación en el debate público y las campañas electorales.' },
  { id: 'leg_transformacion', label: 'Legislatura y transformación', question: '¿Qué rol juegan las leyes provinciales como herramientas para el cambio social y productivo?' },
  { id: 'futuro_tucuman', label: 'Futuro de Tucumán', question: 'Desafíos estratégicos y oportunidades de crecimiento para la provincia en la próxima década.' }
];

export default function Inscribite() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  // Form Fields States
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    first_cejop: "",
    location: "",
    affiliated: "",
    ong: "",
    occupation: "",
    
    leader_val_tuc: "",
    why_val_tuc: "",
    leader_val_arg: "",
    why_val_arg: "",
    
    leader_ques_tuc: "",
    why_ques_tuc: "",
    leader_ques_arg: "",
    why_ques_arg: "",
    
    priority_1: "",
    priority_2: "",
    priority_3: "",
    
    why_priority_1: "",
    why_priority_2: "",
    why_priority_3: "",
    
    axis_1: "",
    axis_2: "",
    axis_3: "",
    
    extra_theme: ""
  });

  // Local Selection Trackers
  const [selectedPriorities, setSelectedPriorities] = useState({ 1: null, 2: null, 3: null });
  const [selectedAxes, setSelectedAxes] = useState({ 1: null, 2: null, 3: null });
  const [activePriorityId, setActivePriorityId] = useState(null);
  const [activeAxisId, setActiveAxisId] = useState(null);

  // Error States
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleToggleSelect = (name, value) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Steps Ranking handlers
  const handleRankPriority = (rank) => {
    if (!activePriorityId) return;

    // Remove priority if already ranked somewhere else
    let updated = { ...selectedPriorities };
    for (const r in updated) {
      if (updated[r] === activePriorityId) {
        updated[r] = null;
      }
    }

    updated[rank] = activePriorityId;
    setSelectedPriorities(updated);

    // Update form values
    setFormData({
      ...formData,
      priority_1: updated[1] || "",
      priority_2: updated[2] || "",
      priority_3: updated[3] || ""
    });

    if (errors.priorities) {
      setErrors({ ...errors, priorities: null });
    }
  };

  const handleRankAxis = (rank) => {
    if (!activeAxisId) return;

    let updated = { ...selectedAxes };
    for (const r in updated) {
      if (updated[r] === activeAxisId) {
        updated[r] = null;
      }
    }

    updated[rank] = activeAxisId;
    setSelectedAxes(updated);

    // Update form values
    setFormData({
      ...formData,
      axis_1: updated[1] || "",
      axis_2: updated[2] || "",
      axis_3: updated[3] || ""
    });

    if (errors.axes) {
      setErrors({ ...errors, axes: null });
    }
  };

  const validateStep = (step) => {
    let tempErrors = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.name.trim()) tempErrors.name = "Nombre y apellido requerido";
      if (!formData.phone.trim()) tempErrors.phone = "Teléfono requerido";
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        tempErrors.email = "Mail requerido";
      } else if (!emailRegex.test(formData.email)) {
        tempErrors.email = "Formato de mail no válido";
      }

      if (!formData.age.trim()) tempErrors.age = "Edad requerida";
      if (!formData.location.trim()) tempErrors.location = "Localidad requerida";
      if (!formData.first_cejop) tempErrors.first_cejop = "Selección requerida";
      if (!formData.affiliated) tempErrors.affiliated = "Selección requerida";
      if (!formData.ong) tempErrors.ong = "Selección requerida";
      if (!formData.occupation.trim()) tempErrors.occupation = "Cuéntanos sobre ti requerido";
    }

    if (step === 2) {
      if (!formData.leader_val_tuc.trim()) tempErrors.leader_val_tuc = "Dirigente requerido";
      if (!formData.leader_val_arg.trim()) tempErrors.leader_val_arg = "Dirigente requerido";
    }

    if (step === 3) {
      if (!formData.leader_ques_tuc.trim()) tempErrors.leader_ques_tuc = "Dirigente requerido";
      if (!formData.leader_ques_arg.trim()) tempErrors.leader_ques_arg = "Dirigente requerido";
    }

    if (step === 4) {
      if (!selectedPriorities[1] || !selectedPriorities[2] || !selectedPriorities[3]) {
        tempErrors.priorities = "Debes seleccionar exactamente 3 prioridades ordenadas";
      }
    }

    if (step === 6) {
      if (!selectedAxes[1] || !selectedAxes[2] || !selectedAxes[3]) {
        tempErrors.axes = "Debes seleccionar exactamente 3 ejes ordenados";
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all steps
    let isAllValid = true;
    for (let i = 1; i <= totalSteps; i++) {
      if (!validateStep(i)) {
        isAllValid = false;
        setCurrentStep(i);
        break;
      }
    }

    if (isAllValid) {
      setFormSubmitted(true);
    }
  };

  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <>
      <Header />

      <main className="view-section min-h-screen bg-[#1a1a2e] text-white py-24 md:py-32 flex flex-col justify-center">
        <div className="section-container max-w-3xl">
          
          <div className="mb-10 text-center">
            <Link href="/" className="inline-block mb-6 relative w-36 h-10">
              <img
                alt="CEJOP Tucumán"
                className="object-contain w-full h-full"
                src="https://www.cejoptucuman.com/_next/static/media/cejop_brand_cropped.58e2cc0e.png"
              />
            </Link>
            <h1 className="font-montserrat font-black text-3xl md:text-4xl text-white uppercase tracking-tight">Formulario de Inscripción</h1>
            <p className="font-source text-white/60 mt-2">Completá todos los campos para postularte a la edición 2026</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            
            {/* Step Indicators */}
            <div className="mb-8">
              <div className="flex justify-between items-center text-xs font-encode tracking-widest text-cejop-blue-light uppercase mb-2">
                <span>Paso {currentStep} de {totalSteps}</span>
                <span>{percent}% completado</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.4 }}
                  className="h-full bg-cejop-blue"
                />
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                
                {/* STEP 1: Personal Data */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="form-step"
                  >
                    <h2 className="font-montserrat font-bold text-xl mb-6 text-cejop-blue-light border-b border-white/10 pb-2">Tus datos personales</h2>
                    <div className="space-y-5">
                      <div>
                        <label className="block font-source text-sm font-semibold mb-2">Nombre y apellido *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cejop-blue transition-colors font-source ${errors.name ? "border-red-400" : "border-white/10"}`}
                          placeholder="Tu nombre completo"
                        />
                        {errors.name && <span className="text-xs text-red-400 mt-1 block">{errors.name}</span>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block font-source text-sm font-semibold mb-2">Teléfono *</label>
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cejop-blue transition-colors font-source ${errors.phone ? "border-red-400" : "border-white/10"}`}
                            placeholder="381 ..."
                          />
                          {errors.phone && <span className="text-xs text-red-400 mt-1 block">{errors.phone}</span>}
                        </div>
                        <div>
                          <label className="block font-source text-sm font-semibold mb-2">Mail *</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cejop-blue transition-colors font-source ${errors.email ? "border-red-400" : "border-white/10"}`}
                            placeholder="tu@email.com"
                          />
                          {errors.email && <span className="text-xs text-red-400 mt-1 block">{errors.email}</span>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block font-source text-sm font-semibold mb-2">Edad *</label>
                          <input
                            type="text"
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cejop-blue transition-colors font-source ${errors.age ? "border-red-400" : "border-white/10"}`}
                            placeholder="18–30"
                          />
                          {errors.age && <span className="text-xs text-red-400 mt-1 block">{errors.age}</span>}
                        </div>
                        <div>
                          <label className="block font-source text-sm font-semibold mb-2">Localidad *</label>
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cejop-blue transition-colors font-source ${errors.location ? "border-red-400" : "border-white/10"}`}
                            placeholder="Tu ciudad"
                          />
                          {errors.location && <span className="text-xs text-red-400 mt-1 block">{errors.location}</span>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                          <label className="block font-source text-sm font-semibold mb-2">¿Fuiste al primer CEJOP? *</label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleSelect("first_cejop", "si")}
                              className={`btn-toggle flex-1 py-3 text-sm font-encode font-bold ${formData.first_cejop === "si" ? "active" : ""}`}
                            >
                              Sí
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleSelect("first_cejop", "no")}
                              className={`btn-toggle flex-1 py-3 text-sm font-encode font-bold ${formData.first_cejop === "no" ? "active" : ""}`}
                            >
                              No
                            </button>
                          </div>
                          {errors.first_cejop && <span className="text-xs text-red-400 mt-1 block">{errors.first_cejop}</span>}
                        </div>
                        
                        <div>
                          <label className="block font-source text-sm font-semibold mb-2">¿Estás afiliado? *</label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleSelect("affiliated", "si")}
                              className={`btn-toggle flex-1 py-3 text-sm font-encode font-bold ${formData.affiliated === "si" ? "active" : ""}`}
                            >
                              Sí
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleSelect("affiliated", "no")}
                              className={`btn-toggle flex-1 py-3 text-sm font-encode font-bold ${formData.affiliated === "no" ? "active" : ""}`}
                            >
                              No
                            </button>
                          </div>
                          {errors.affiliated && <span className="text-xs text-red-400 mt-1 block">{errors.affiliated}</span>}
                        </div>

                        <div>
                          <label className="block font-source text-sm font-semibold mb-2">¿Participás en ONG? *</label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleSelect("ong", "si")}
                              className={`btn-toggle flex-1 py-3 text-sm font-encode font-bold ${formData.ong === "si" ? "active" : ""}`}
                            >
                              Sí
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleSelect("ong", "no")}
                              className={`btn-toggle flex-1 py-3 text-sm font-encode font-bold ${formData.ong === "no" ? "active" : ""}`}
                            >
                              No
                            </button>
                          </div>
                          {errors.ong && <span className="text-xs text-red-400 mt-1 block">{errors.ong}</span>}
                        </div>
                      </div>

                      <div>
                        <label className="block font-source text-sm font-semibold mb-2">¿A qué te dedicás? *</label>
                        <textarea
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleInputChange}
                          rows={3}
                          className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cejop-blue transition-colors font-source resize-none ${errors.occupation ? "border-red-400" : "border-white/10"}`}
                          placeholder="Contanos brevemente: si estudiás (qué carrera), si trabajás (de qué y dónde), o ambos."
                        />
                        {errors.occupation && <span className="text-xs text-red-400 mt-1 block">{errors.occupation}</span>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Leaders Valued */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="form-step"
                  >
                    <h2 className="font-montserrat font-bold text-xl mb-6 text-cejop-blue-light border-b border-white/10 pb-2">Dirigentes que valorás</h2>
                    <div className="space-y-5">
                      <div>
                        <label className="block font-source text-sm font-semibold mb-2">¿Qué dirigente de Tucumán te gusta más? *</label>
                        <input
                          type="text"
                          name="leader_val_tuc"
                          value={formData.leader_val_tuc}
                          onChange={handleInputChange}
                          className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cejop-blue transition-colors font-source ${errors.leader_val_tuc ? "border-red-400" : "border-white/10"}`}
                          placeholder="Nombre y apellido del dirigente"
                        />
                        {errors.leader_val_tuc && <span className="text-xs text-red-400 mt-1 block">{errors.leader_val_tuc}</span>}
                      </div>
                      <div>
                        <label className="block font-source text-sm font-semibold mb-2">¿Por qué? (Opcional)</label>
                        <textarea
                          name="why_val_tuc"
                          value={formData.why_val_tuc}
                          onChange={handleInputChange}
                          rows={2}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cejop-blue transition-colors font-source resize-none"
                          placeholder="Contanos en pocas palabras"
                        />
                      </div>

                      <div className="border-t border-white/10 pt-4">
                        <label className="block font-source text-sm font-semibold mb-2">¿Qué dirigente de Argentina te gusta más? *</label>
                        <input
                          type="text"
                          name="leader_val_arg"
                          value={formData.leader_val_arg}
                          onChange={handleInputChange}
                          className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cejop-blue transition-colors font-source ${errors.leader_val_arg ? "border-red-400" : "border-white/10"}`}
                          placeholder="Nombre y apellido del dirigente"
                        />
                        {errors.leader_val_arg && <span className="text-xs text-red-400 mt-1 block">{errors.leader_val_arg}</span>}
                      </div>
                      <div>
                        <label className="block font-source text-sm font-semibold mb-2">¿Por qué? (Opcional)</label>
                        <textarea
                          name="why_val_arg"
                          value={formData.why_val_arg}
                          onChange={handleInputChange}
                          rows={2}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cejop-blue transition-colors font-source resize-none"
                          placeholder="Contanos en pocas palabras"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Leaders Questioned */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="form-step"
                  >
                    <h2 className="font-montserrat font-bold text-xl mb-6 text-cejop-blue-light border-b border-white/10 pb-2">Dirigentes que cuestionás</h2>
                    <div className="space-y-5">
                      <div>
                        <label className="block font-source text-sm font-semibold mb-2">¿Qué dirigente de Tucumán te gusta menos? *</label>
                        <input
                          type="text"
                          name="leader_ques_tuc"
                          value={formData.leader_ques_tuc}
                          onChange={handleInputChange}
                          className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cejop-blue transition-colors font-source ${errors.leader_ques_tuc ? "border-red-400" : "border-white/10"}`}
                          placeholder="Nombre y apellido del dirigente"
                        />
                        {errors.leader_ques_tuc && <span className="text-xs text-red-400 mt-1 block">{errors.leader_ques_tuc}</span>}
                      </div>
                      <div>
                        <label className="block font-source text-sm font-semibold mb-2">¿Por qué? (Opcional)</label>
                        <textarea
                          name="why_ques_tuc"
                          value={formData.why_ques_tuc}
                          onChange={handleInputChange}
                          rows={2}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cejop-blue transition-colors font-source resize-none"
                          placeholder="Contanos en pocas palabras"
                        />
                      </div>

                      <div className="border-t border-white/10 pt-4">
                        <label className="block font-source text-sm font-semibold mb-2">¿Qué dirigente de Argentina te gusta menos? *</label>
                        <input
                          type="text"
                          name="leader_ques_arg"
                          value={formData.leader_ques_arg}
                          onChange={handleInputChange}
                          className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cejop-blue transition-colors font-source ${errors.leader_ques_arg ? "border-red-400" : "border-white/10"}`}
                          placeholder="Nombre y apellido del dirigente"
                        />
                        {errors.leader_ques_arg && <span className="text-xs text-red-400 mt-1 block">{errors.leader_ques_arg}</span>}
                      </div>
                      <div>
                        <label className="block font-source text-sm font-semibold mb-2">¿Por qué? (Opcional)</label>
                        <textarea
                          name="why_ques_arg"
                          value={formData.why_ques_arg}
                          onChange={handleInputChange}
                          rows={2}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cejop-blue transition-colors font-source resize-none"
                          placeholder="Contanos en pocas palabras"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Agenda priorities */}
                {currentStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="form-step"
                  >
                    <h2 className="font-montserrat font-bold text-xl mb-2 text-cejop-blue-light pb-1">Agenda para Tucumán</h2>
                    <p className="font-source text-sm text-white/50 mb-6">Seleccioná exactamente 3 temáticas prioritarias para la provincia y ordenalas por relevancia (1, 2 y 3).</p>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {prioritiesList.map(item => {
                          let rank = null;
                          for (const r in selectedPriorities) {
                            if (selectedPriorities[r] === item.id) rank = r;
                          }

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setActivePriorityId(item.id)}
                              className={`priority-btn ${activePriorityId === item.id ? "border-cejop-blue bg-white/10" : ""} ${rank ? "selected" : ""}`}
                            >
                              {item.label}
                              {rank && <span className="badge-rank">{rank}</span>}
                            </button>
                          );
                        })}
                      </div>

                      {/* Rank panel */}
                      <AnimatePresence mode="wait">
                        {activePriorityId && (
                          <motion.div
                            key={activePriorityId}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-white/5 border border-white/10 p-5 rounded-lg overflow-hidden"
                          >
                            <h3 className="font-montserrat font-bold text-sm text-cejop-blue-light uppercase tracking-wider mb-2">
                              {prioritiesList.find(p => p.id === activePriorityId)?.label}
                            </h3>
                            <p className="font-source text-sm text-white/70 mb-4">
                              {prioritiesList.find(p => p.id === activePriorityId)?.question}
                            </p>
                            
                            <div className="flex gap-2">
                              {[1, 2, 3].map(r => (
                                <button
                                  key={r}
                                  type="button"
                                  onClick={() => handleRankPriority(r)}
                                  className={`btn-rank flex-1 py-2 text-xs font-encode font-bold ${selectedPriorities[r] === activePriorityId ? "active" : ""}`}
                                >
                                  Prioridad {r}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {errors.priorities && <span className="text-xs text-red-400 mt-1 block">{errors.priorities}</span>}
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: Deep Dive */}
                {currentStep === 5 && (
                  <motion.div
                    key="step-5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="form-step"
                  >
                    <h2 className="font-montserrat font-bold text-xl mb-2 text-cejop-blue-light pb-1">Profundicemos</h2>
                    <p className="font-source text-sm text-white/50 mb-6">Opcional — si querés, contanos por qué elegiste cada una de estas temáticas.</p>
                    
                    <div className="space-y-5">
                      {[1, 2, 3].map(rank => {
                        const priorityId = selectedPriorities[rank];
                        if (!priorityId) return null;
                        const priorityObj = prioritiesList.find(p => p.id === priorityId);

                        return (
                          <div key={rank} className="space-y-2">
                            <label className="block font-source text-sm font-semibold mb-2">
                              Prioridad {rank}: {priorityObj?.label} (Opcional)
                            </label>
                            <textarea
                              name={`why_priority_${rank}`}
                              value={formData[`why_priority_${rank}`]}
                              onChange={handleInputChange}
                              rows={3}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cejop-blue transition-colors font-source resize-none"
                              placeholder="¿Por qué considerás que es un tema prioritario en la provincia y qué medidas propondrías?"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 6: Axes */}
                {currentStep === 6 && (
                  <motion.div
                    key="step-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="form-step"
                  >
                    <h2 className="font-montserrat font-bold text-xl mb-2 text-cejop-blue-light pb-1">Ejes de Interés</h2>
                    <p className="font-source text-sm text-white/50 mb-6">Seleccioná exactamente 3 ejes para debatir en el próximo encuentro y dales un orden (1, 2 y 3).</p>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {axesList.map(item => {
                          let rank = null;
                          for (const r in selectedAxes) {
                            if (selectedAxes[r] === item.id) rank = r;
                          }

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setActiveAxisId(item.id)}
                              className={`axis-btn ${activeAxisId === item.id ? "border-cejop-blue bg-white/10" : ""} ${rank ? "selected" : ""}`}
                            >
                              {item.label}
                              {rank && <span className="badge-rank">{rank}</span>}
                            </button>
                          );
                        })}
                      </div>

                      {/* Rank panel */}
                      <AnimatePresence mode="wait">
                        {activeAxisId && (
                          <motion.div
                            key={activeAxisId}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-white/5 border border-white/10 p-5 rounded-lg overflow-hidden"
                          >
                            <h3 className="font-montserrat font-bold text-sm text-cejop-blue-light uppercase tracking-wider mb-2">
                              {axesList.find(a => a.id === activeAxisId)?.label}
                            </h3>
                            <p className="font-source text-sm text-white/70 mb-4">
                              {axesList.find(a => a.id === activeAxisId)?.question}
                            </p>
                            
                            <div className="flex gap-2">
                              {[1, 2, 3].map(r => (
                                <button
                                  key={r}
                                  type="button"
                                  onClick={() => handleRankAxis(r)}
                                  className={`btn-rank-axis flex-1 py-2 text-xs font-encode font-bold ${selectedAxes[r] === activeAxisId ? "active" : ""}`}
                                >
                                  Eje {r}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {errors.axes && <span className="text-xs text-red-400 mt-1 block">{errors.axes}</span>}
                    </div>
                  </motion.div>
                )}

                {/* STEP 7: One Last Thing */}
                {currentStep === 7 && (
                  <motion.div
                    key="step-7"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="form-step"
                  >
                    <h2 className="font-montserrat font-bold text-xl mb-6 text-cejop-blue-light border-b border-white/10 pb-2">Una última cosa</h2>
                    <div className="space-y-5">
                      <div>
                        <label className="block font-source text-sm font-semibold mb-2">¿Hay alguna temática que no esté en la lista y que considerés prioritaria? (Opcional)</label>
                        <textarea
                          name="extra_theme"
                          value={formData.extra_theme}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cejop-blue transition-colors font-source resize-none"
                          placeholder="Este campo es opcional. Si las temáticas anteriores cubrieron tus inquietudes, podés enviar directamente."
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                
              </AnimatePresence>

              {/* Form Navigation buttons */}
              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between gap-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="btn-outline-bw text-xs px-6 py-3"
                  >
                    Anterior
                  </button>
                )}
                <div className="flex-1"></div>
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-primary-bw text-xs px-8 py-3 w-full sm:w-auto text-center"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn-primary text-xs px-8 py-3 w-full sm:w-auto text-center"
                  >
                    Enviar inscripción
                  </button>
                )}
              </div>
            </form>

            {/* Success Overlay Screen */}
            <AnimatePresence>
              {formSubmitted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#1a1a2e] rounded-2xl flex flex-col justify-center items-center text-center p-6 sm:p-10 z-10"
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-cejop-blue rounded-full flex items-center justify-center mb-6"
                  >
                    <Check size={36} className="text-white" strokeWidth={3} />
                  </motion.div>
                  <h2 className="font-montserrat font-black text-2xl sm:text-3xl text-white uppercase mb-4">¡Inscripción recibida!</h2>
                  <p className="font-source text-white/70 max-w-md leading-relaxed mb-8">
                    Tu postulación ha sido enviada con éxito. Vamos a analizar tu perfil para asegurar la diversidad en esta edición. Nos pondremos en contacto con vos a la brevedad.
                  </p>
                  <Link href="/" className="btn-primary-bw text-xs px-8 py-4">
                    Volver al inicio
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
