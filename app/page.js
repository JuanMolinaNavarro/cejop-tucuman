"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown, Users, Globe, BookOpen, Heart } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FAQList from "./components/FAQList";
import Loader from "./components/Loader";

export default function Home() {
  return (
    <>
      <Loader />
      <Header />

      <main>
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex flex-col overflow-hidden bg-cejop-dark" aria-label="Sección principal CEJOP Tucumán">
          <div className="absolute inset-0 z-0">
            <video autoPlay muted loop playsInline className="w-full h-full object-cover">
              <source src="https://storage.googleapis.com/marketar_bucket/cejop/video_landing.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/50 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center flex-1 section-container pt-28 pb-32 md:pt-36 md:pb-40">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <span className="inline-block font-encode text-xs font-semibold tracking-[0.4em] uppercase text-white/90 border border-white/20 px-4 py-1.5 backdrop-blur-sm bg-white/5">
                Tucumán · 2026 · Formación Política
              </span>
            </motion.div>

            <div className="flex flex-col gap-6 md:gap-10">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col md:flex-row md:items-end gap-2 md:gap-6"
              >
                <span className="font-montserrat font-black text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] uppercase leading-none tracking-tight text-white drop-shadow-2xl">ENTENDÉ</span>
                <span className="font-source text-sm md:text-base text-white/70 md:mb-2 max-w-xs leading-relaxed">Cómo funciona realmente el Estado, la política y las instituciones.</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col md:flex-row md:items-end gap-2 md:gap-6 md:pl-16 lg:pl-32"
              >
                <span className="font-montserrat font-black text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] uppercase leading-none tracking-tight text-white drop-shadow-2xl">CONECTÁ</span>
                <span className="font-source text-sm md:text-base text-white/70 md:mb-2 max-w-xs leading-relaxed">Con jóvenes de trayectorias diversas y referentes del sistema público.</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col md:flex-row md:items-end gap-2 md:gap-6"
              >
                <span className="font-montserrat font-black text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] uppercase leading-none tracking-tight text-white drop-shadow-2xl">PARTICIPÁ</span>
                <span className="font-source text-sm md:text-base text-white/70 md:mb-2 max-w-xs leading-relaxed">En espacios de formación, simulaciones y experiencias institucionales.</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="flex flex-col md:flex-row md:items-end gap-2 md:gap-6 md:pl-16 lg:pl-32"
              >
                <span className="font-montserrat font-black text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] uppercase leading-none tracking-tight text-white drop-shadow-2xl">TRANSFORMÁ</span>
                <span className="font-source text-sm md:text-base text-white/70 md:mb-2 max-w-xs leading-relaxed">Tu mirada sobre la reality política y social de la provincia.</span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-12 flex flex-col sm:flex-row gap-4"
            >
              <Link href="/inscribite" className="btn-primary-bw text-sm px-8 py-4">Inscribite al 2do encuentro</Link>
              <Link href="#programa" className="btn-outline-bw text-sm px-8 py-4 text-center">Conocé el programa</Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="mt-16 self-start"
            >
              <Link href="#problema" className="flex flex-col items-center gap-2 text-white hover:text-white transition-colors">
                <span className="font-encode text-xs tracking-[0.3em] uppercase">Explorá</span>
                <ChevronDown size={20} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* SECTION: EL PROBLEMA */}
        <section id="problema" className="section-pad bg-white overflow-hidden" aria-labelledby="problema-title">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="lg:pr-8"
              >
                <span className="inline-block font-encode text-xs font-semibold tracking-[0.3em] uppercase text-cejop-blue mb-6 border-l-2 border-cejop-blue pl-3">
                  El problema que nos convoca
                </span>
                <h2 id="problema-title" className="font-montserrat font-black text-3xl sm:text-4xl md:text-5xl text-cejop-dark leading-tight mb-6">
                  Hay una brecha entre los jóvenes y los espacios donde se toman las decisiones.
                </h2>
                <p className="font-source text-lg text-gray-600 leading-relaxed mb-6">
                  La distancia no es apatía. Es la ausencia de espacios reales donde preguntar y conectar con quienes toman decisiones.
                </p>
                <div className="space-y-6 mb-10">
                  <div className="flex items-start gap-4">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cejop-blue shrink-0"></div>
                    <p className="font-source text-lg text-gray-600 leading-relaxed">
                      <span className="font-bold text-cejop-dark">18–30:</span> la generación más alejada de los centros de decisión.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cejop-blue shrink-0"></div>
                    <p className="font-source text-lg text-gray-600 leading-relaxed">
                      <span className="font-bold text-cejop-dark">Pluralidad:</span> la política necesita más voces, más trayectorias y más debate.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="relative lg:mt-16"
              >
                <div className="relative aspect-[4/3] w-full max-w-md lg:max-w-none rounded-2xl overflow-hidden shadow-2xl">
                  <img alt="Formación y debate político" className="object-cover w-full h-full" src="https://storage.googleapis.com/marketar_bucket/cejop/seccion2.jpeg" />
                  <div className="absolute top-6 right-6 bg-cejop-dark/80 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 z-10">
                    <p className="font-montserrat font-black text-white text-sm tracking-widest uppercase">
                      CONECTÁ <span className="text-cejop-blue-light">AHORA</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION: LA RESPUESTA */}
        <section id="programa" className="section-pad bg-cejop-dark text-white overflow-hidden" aria-labelledby="solution-title">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mb-16 md:mb-24"
            >
              <span className="inline-block font-encode text-xs font-semibold tracking-[0.3em] uppercase text-cejop-blue-light mb-6 border-l-2 border-cejop-blue pl-3">
                La respuesta al vacío
              </span>
              <h2 id="solution-title" className="font-montserrat font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
                CEJOP Tucumán es el espacio que faltaba.
              </h2>
              <p className="font-source text-lg text-white/70 leading-relaxed">
                No es una escuela partidaria. No es una ONG subsidiaria de ningún partido. No es una fundación. Es un espacio impulsado por jóvenes de distintos partidos y trayectorias que creen que la política tiene que volver a estar en manos de la sociedad.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10"
            >
              {/* Pillar 1 */}
              <div className="bg-cejop-dark p-8 group hover:bg-cejop-blue transition-colors duration-500">
                <div className="mb-6">
                  <Users size={28} className="text-cejop-blue-light group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-montserrat font-bold text-xl mb-3 group-hover:text-white transition-colors">Pluralidad</h3>
                <p className="font-source text-sm text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">
                  No importa de dónde venís ideológicamente. Importa que querés aprender y construir. La diversidad de visiones enriquece la experiencia de todos.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="bg-cejop-dark p-8 group hover:bg-cejop-blue transition-colors duration-500">
                <div className="mb-6">
                  <Globe size={28} className="text-cejop-blue-light group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-montserrat font-bold text-xl mb-3 group-hover:text-white transition-colors">Federalismo</h3>
                <p className="font-source text-sm text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">
                  Una formación pensada desde y para Tucumán. Con foco en la realidad provincial, sus instituciones y su gente.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="bg-cejop-dark p-8 group hover:bg-cejop-blue transition-colors duration-500">
                <div className="mb-6">
                  <BookOpen size={28} className="text-cejop-blue-light group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-montserrat font-bold text-xl mb-3 group-hover:text-white transition-colors">Formación</h3>
                <p className="font-source text-sm text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">
                  No es información suelta. Es un recorrido estructurado, con profundidad, referentes reales y herramientas concretas para leer la realidad.
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="bg-cejop-dark p-8 group hover:bg-cejop-blue transition-colors duration-500">
                <div className="mb-6">
                  <Heart size={28} className="text-cejop-blue-light group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-montserrat font-bold text-xl mb-3 group-hover:text-white transition-colors">Comunidad</h3>
                <p className="font-source text-sm text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">
                  El vínculo entre participantes es parte del programa. Una red de jóvenes con perspectivas distintas que se construye desde el primer día.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION: QUE TE LLEVAS */}
        <section id="que-te-llevas" className="section-pad bg-cejop-bg overflow-hidden" aria-labelledby="benefits-title">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="mb-16 md:mb-24"
            >
              <span className="inline-block font-encode text-xs font-semibold tracking-[0.3em] uppercase text-cejop-blue mb-6 border-l-2 border-cejop-blue pl-3">
                Por qué sumarte
              </span>
              <h2 id="benefits-title" className="font-montserrat font-black text-3xl sm:text-4xl md:text-5xl text-cejop-dark max-w-2xl">
                Con qué vas a contar.
              </h2>
            </motion.div>

            <div className="space-y-0">
              {/* Benefit 1 */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-8 py-8 border-t border-cejop-blue/15 hover:border-cejop-blue transition-colors duration-300"
              >
                <span className="font-montserrat font-black text-4xl text-cejop-blue/30 group-hover:text-cejop-blue transition-colors duration-300 w-14 shrink-0 leading-none">01</span>
                <h3 className="font-montserrat font-bold text-xl sm:text-2xl md:text-3xl text-cejop-blue group-hover:text-cejop-dark transition-colors duration-300 flex-1 leading-snug uppercase">
                  Entendé cómo funciona el Estado desde adentro
                </h3>
                <p className="font-source text-sm text-gray-500 max-w-xs md:max-w-sm leading-relaxed md:text-right">
                  Módulos con referentes reales del sistema público: funcionarios, legisladores, jueces, periodistas, empresarios.
                </p>
              </motion.div>

              {/* Benefit 2 */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-8 py-8 border-t border-cejop-blue/15 hover:border-cejop-blue transition-colors duration-300"
              >
                <span className="font-montserrat font-black text-4xl text-cejop-blue/30 group-hover:text-cejop-blue transition-colors duration-300 w-14 shrink-0 leading-none">02</span>
                <h3 className="font-montserrat font-bold text-xl sm:text-2xl md:text-3xl text-cejop-blue group-hover:text-cejop-dark transition-colors duration-300 flex-1 leading-snug uppercase">
                  Conocé cara a cara a quienes toman las decisiones
                </h3>
                <p className="font-source text-sm text-gray-500 max-w-xs md:max-w-sm leading-relaxed md:text-right">
                  Conectate con actores estratégicos de la provincia y construí vínculos que van más allá del programa.
                </p>
              </motion.div>

              {/* Benefit 3 */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-8 py-8 border-t border-cejop-blue/15 hover:border-cejop-blue transition-colors duration-300"
              >
                <span className="font-montserrat font-black text-4xl text-cejop-blue/30 group-hover:text-cejop-blue transition-colors duration-300 w-14 shrink-0 leading-none">03</span>
                <h3 className="font-montserrat font-bold text-xl sm:text-2xl md:text-3xl text-cejop-blue group-hover:text-cejop-dark transition-colors duration-300 flex-1 leading-snug uppercase">
                  Debatí, simulá y analizá casos reales
                </h3>
                <p className="font-source text-sm text-gray-500 max-w-xs md:max-w-sm leading-relaxed md:text-right">
                  Simulaciones, visitas institucionales y casos reales. No solo escuchás: hacés, debatís y analizás.
                </p>
              </motion.div>

              {/* Benefit 4 */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-8 py-8 border-t border-cejop-blue/15 hover:border-cejop-blue transition-colors duration-300"
              >
                <span className="font-montserrat font-black text-4xl text-cejop-blue/30 group-hover:text-cejop-blue transition-colors duration-300 w-14 shrink-0 leading-none">04</span>
                <h3 className="font-montserrat font-bold text-xl sm:text-2xl md:text-3xl text-cejop-blue group-hover:text-cejop-dark transition-colors duration-300 flex-1 leading-snug uppercase">
                  Encontrate con jóvenes que piensan distinto
                </h3>
                <p className="font-source text-sm text-gray-500 max-w-xs md:max-w-sm leading-relaxed md:text-right">
                  Universitarios, militantes, independientes, organizaciones sociales. La diversidad es parte del programa.
                </p>
              </motion.div>

              {/* Benefit 5 */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-8 py-8 border-t border-cejop-blue/15 hover:border-cejop-blue transition-colors duration-300"
              >
                <span className="font-montserrat font-black text-4xl text-cejop-blue/30 group-hover:text-cejop-blue transition-colors duration-300 w-14 shrink-0 leading-none">05</span>
                <h3 className="font-montserrat font-bold text-xl sm:text-2xl md:text-3xl text-cejop-blue group-hover:text-cejop-dark transition-colors duration-300 flex-1 leading-snug uppercase">
                  Formá tu propia mirada, sin dogmas
                </h3>
                <p className="font-source text-sm text-gray-500 max-w-xs md:max-w-sm leading-relaxed md:text-right">
                  Herramientas para analizar la realidad política y social desde múltiples perspectivas.
                </p>
              </motion.div>

              {/* Benefit 6 */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-8 py-8 border-t border-cejop-blue/15 hover:border-cejop-blue transition-colors duration-300"
              >
                <span className="font-montserrat font-black text-4xl text-cejop-blue/30 group-hover:text-cejop-blue transition-colors duration-300 w-14 shrink-0 leading-none">06</span>
                <h3 className="font-montserrat font-bold text-xl sm:text-2xl md:text-3xl text-cejop-blue group-hover:text-cejop-dark transition-colors duration-300 flex-1 leading-snug uppercase">
                  Conectate con una red que va más allá de Tucumán
                </h3>
                <p className="font-source text-sm text-gray-500 max-w-xs md:max-w-sm leading-relaxed md:text-right">
                  Formá parte de una red con proyección nacional que se conecta con experiencias similares en otras provincias.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION: COMO FUNCIONA */}
        <section id="como-funciona" className="section-pad bg-white overflow-hidden" aria-labelledby="how-title">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-block font-encode text-xs font-semibold tracking-[0.3em] uppercase text-cejop-blue mb-6 border-l-2 border-cejop-blue pl-3">
                  El Programa
                </span>
                <h2 id="how-title" className="font-montserrat font-black text-3xl sm:text-4xl md:text-5xl text-cejop-dark leading-tight mb-4">
                  Formación política desde y para Tucumán.
                </h2>
                <p className="font-source text-base text-gray-600 leading-relaxed mb-12">
                  Programa anual (abril–diciembre). No es solo charlas: es una experiencia formativa que mezcla profundidad, práctica y comunidad.
                </p>

                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" aria-hidden="true"></div>
                  <div className="space-y-6">
                    {/* Month indicators */}
                    {[
                      { m: "Abr", t: "Territorio desde los municipios" },
                      { m: "May", t: "La cocina del poder: Ministerio del Interior" },
                      { m: "Jun", t: "Economía" },
                      { m: "Jul", t: "Poder judicial" },
                      { m: "Ago", t: "Poder legislativo" },
                      { m: "Sep", t: "Urbanización y política social" },
                      { m: "Oct", t: "Medios y opinión pública" },
                      { m: "Nov", t: "Juventudes y trabajo" },
                      { m: "Dic", t: "Empresas y producción" }
                    ].map((month, idx) => (
                      <div key={idx} className="flex gap-5 relative">
                        <div className="relative z-10 shrink-0">
                          <div className="w-10 h-10 bg-cejop-blue flex items-center justify-center rounded">
                            <span className="font-montserrat font-bold text-white text-[10px] leading-tight text-center">{month.m}</span>
                          </div>
                        </div>
                        <div className="pt-2">
                          <h3 className="font-montserrat font-bold text-sm text-cejop-dark">{month.t}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="font-source text-xs text-gray-400 mt-8 italic">
                  El cronograma es orientativo. El orden de los encuentros y las fechas pueden ajustarse según la dinámica del programa y la disponibilidad de los expositores.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="lg:sticky lg:top-24"
              >
                <div className="relative aspect-[3/4] w-full max-w-md mx-auto lg:max-w-none rounded-xl overflow-hidden shadow-2xl">
                  <img alt="Mesa de trabajo — formación política CEJOP" className="object-cover object-top w-full h-full" src="https://www.cejoptucuman.com/_next/static/media/timeline-mesa-cejop.20fdb3ba.png" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION: LEGITIMIDAD */}
        <section id="legitimidad" className="section-pad bg-cejop-dark text-white overflow-hidden" aria-labelledby="social-proof-title">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="mb-16 md:mb-20"
            >
              <span className="inline-block font-encode text-xs font-semibold tracking-[0.3em] uppercase text-cejop-blue-light mb-6 border-l-2 border-cejop-blue pl-3">
                Quiénes estamos detrás
              </span>
              <h2 id="social-proof-title" className="font-montserrat font-black text-3xl sm:text-4xl md:text-5xl leading-tight max-w-3xl">
                Una experiencia con respaldo real y proyección federal.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <p className="font-source text-white/70 text-base leading-relaxed mb-10">
                  CEJOP Tucumán nace a partir de una experiencia desarrollada en Buenos Aires que reunió a jóvenes con referentes de la política, la gestión pública, el periodismo y el sector productivo. Hoy ese modelo se adapta al territorio provincial, conectando a Tucumán con una red más amplia de formación y debate político.
                </p>

                <div className="grid grid-cols-2 gap-px bg-white/10 rounded-lg overflow-hidden border border-white/10">
                  <div className="bg-cejop-dark p-6 transition-all duration-300 hover:bg-white/5">
                    <p className="font-montserrat font-black text-3xl md:text-4xl text-cejop-blue-light mb-1">+100</p>
                    <p className="font-source text-xs text-white/50 leading-snug">jóvenes formados en BA</p>
                  </div>
                  <div className="bg-cejop-dark p-6 transition-all duration-300 hover:bg-white/5">
                    <p className="font-montserrat font-black text-3xl md:text-4xl text-cejop-blue-light mb-1">+30</p>
                    <p className="font-source text-xs text-white/50 leading-snug">referentes convocados</p>
                  </div>
                  <div className="bg-cejop-dark p-6 transition-all duration-300 hover:bg-white/5">
                    <p className="font-montserrat font-black text-3xl md:text-4xl text-cejop-blue-light mb-1">9</p>
                    <p className="font-source text-xs text-white/50 leading-snug">meses de programa</p>
                  </div>
                  <div className="bg-cejop-dark p-6 transition-all duration-300 hover:bg-white/5">
                    <p className="font-montserrat font-black text-3xl md:text-4xl text-cejop-blue-light mb-1">2026</p>
                    <p className="font-source text-xs text-white/50 leading-snug">primera edición Tucumán</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-2 gap-2"
              >
                <div className="col-span-2 relative aspect-[16/9] overflow-hidden rounded-lg">
                  <img alt="Jóvenes dialogando con referentes políticos en CEJOP Buenos Aires" className="object-cover w-full h-full" src="https://www.cejoptucuman.com/_next/static/media/social-grupo-dialogo.8942c055.jpg" />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <img alt="Ramiro Marra en clase de Poder Legislativo — CEJOP" className="object-cover w-full h-full" src="https://www.cejoptucuman.com/_next/static/media/social-marra-clase.704f93a1.jpg" />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <img alt="Presentación en encuentro CEJOP con banner institucional" className="object-cover w-full h-full" src="https://www.cejoptucuman.com/_next/static/media/social-presentacion-cejop.279bc073.jpg" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION: FAQ */}
        <section id="faq" className="section-pad bg-cejop-bg overflow-hidden" aria-labelledby="faq-title">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-2"
              >
                <span className="inline-block font-encode text-xs font-semibold tracking-[0.3em] uppercase text-cejop-blue mb-6 border-l-2 border-cejop-blue pl-3">
                  Todo lo que querés saber
                </span>
                <h2 id="faq-title" className="font-montserrat font-black text-3xl sm:text-4xl md:text-5xl text-cejop-dark leading-tight mb-6">
                  Preguntas frecuentes
                </h2>
                <p className="font-source text-base text-gray-600 leading-relaxed">
                  ¿Todavía tenés dudas? Escribinos a
                  <a href="mailto:cejoptucuman@gmail.com" className="text-cejop-blue hover:underline font-medium ml-1">cejoptucuman@gmail.com</a>.
                  Contestamos todos los mensajes.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-3"
              >
                <FAQList />
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION: CTA */}
        <section className="section-pad bg-cejop-dark text-white relative overflow-hidden" aria-labelledby="cta-title">
          <div className="absolute inset-0 bg-gradient-to-tr from-cejop-blue/20 to-transparent pointer-events-none"></div>
          <div className="section-container relative z-10 text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 id="cta-title" className="font-montserrat font-black text-4xl sm:text-5xl md:text-6xl leading-tight mb-6">
                ¿Querés formar parte de la próxima edición?
              </h2>
              <p className="font-source text-lg text-white/70 leading-relaxed mb-10">
                Completá tu postulación en pocos minutos. Los cupos son limitados para asegurar una experiencia personalizada y de alto impacto.
              </p>
              <Link href="/inscribite" className="btn-primary-bw text-sm px-10 py-5">Quiero inscribirme</Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
