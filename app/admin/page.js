"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, LogOut, Check, X, Lock, Mail, Download, 
  ChevronDown, ChevronUp, AlertCircle, RefreshCw, Send, 
  UserCheck, Users, BarChart3, MailCheck, Star, Award, ClipboardList
} from "lucide-react";
import { 
  initialConfirmados, 
  initialPendientes, 
  initialAcreditados, 
  feedbackStats, 
  feedbackComments, 
  emailStats, 
  emailCampaigns, 
  prioritiesAccordionData, 
  dirigentesData 
} from "./mockData";

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [selectedEncounter, setSelectedEncounter] = useState(2); // 2nd encounter active by default
  const [activeTab, setActiveTab] = useState("panel"); // panel, confirmados, pendientes, acreditados, feedback, emails, prioridades, dirigentes
  
  // Settings switches
  const [surveysActive, setSurveysActive] = useState(false); // Pausadas/No se aceptan respuestas
  const [secondEncounterActive, setSecondEncounterActive] = useState(true); // Activo
  
  // Dynamic Data States
  const [confirmados, setConfirmados] = useState(initialConfirmados);
  const [pendientes, setPendientes] = useState(initialPendientes);
  const [acreditados, setAcreditados] = useState(initialAcreditados);
  const [testEmailInput, setTestEmailInput] = useState("");
  const [testEmailSent, setTestEmailSent] = useState(false);

  // Search/Filter states
  const [confirmadosFilter, setConfirmadosFilter] = useState("todos"); // todos, confirmados, sin-confirmar
  const [confirmadosSearch, setConfirmadosSearch] = useState("");
  
  const [pendientesFilter, setPendientesFilter] = useState("pendientes"); // pendientes, aprobados, rechazados, todos
  const [pendientesSearch, setPendientesSearch] = useState("");
  
  const [acreditadosFilter, setAcreditadosFilter] = useState("todos"); // todos, confirm, inscript, walk-in
  const [acreditadosSearch, setAcreditadosSearch] = useState("");

  // Accordion active id for prioridades
  const [expandedPriorityId, setExpandedPriorityId] = useState(null);

  // Check auth on load
  useEffect(() => {
    const isLogged = localStorage.getItem("cejop_admin_logged") === "true";
    if (isLogged) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginEmail === "candemedina2001@gmail.com" && loginPassword === "CEJOP_tuc") {
      setIsAuthenticated(true);
      localStorage.setItem("cejop_admin_logged", "true");
      setLoginError("");
    } else {
      setLoginError("Credenciales incorrectas. Verifique el mail y la contraseña.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("cejop_admin_logged");
  };

  // Switch Toggle Handlers
  const handleToggleConfirmado = (id) => {
    setConfirmados(prev => prev.map(item => {
      if (item.id === id) {
        const updatedStatus = !item.confirmed;
        // If confirmed is changed, also mirror in acreditados if needed
        if (updatedStatus) {
          // If confirming, check if they are already in accredited list, if not add them
          const person = prev.find(p => p.id === id);
          const alreadyAccredited = acreditados.some(a => a.email === person.email && a.encounter === selectedEncounter);
          if (!alreadyAccredited) {
            const now = new Date();
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            const newAccredited = {
              encounter: selectedEncounter,
              id: Date.now() + Math.random(),
              name: person.name,
              email: person.email,
              phone: person.phone,
              type: "Confirmado",
              time: timeStr
            };
            setAcreditados(a => [...a, newAccredited]);
          }
        } else {
          // If unconfirming, remove from accredited list
          const person = prev.find(p => p.id === id);
          setAcreditados(a => a.filter(itemAcc => !(itemAcc.email === person.email && itemAcc.encounter === selectedEncounter)));
        }
        return { ...item, confirmed: updatedStatus };
      }
      return item;
    }));
  };

  const handleApprovePendiente = (id) => {
    setPendientes(prev => prev.map(item => {
      if (item.id === id) {
        // Add to accredited list as Walk-in
        const person = item;
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const newAccredited = {
          encounter: selectedEncounter,
          id: Date.now() + Math.random(),
          name: person.name,
          email: person.email,
          phone: person.phone,
          type: "Walk-in",
          time: timeStr
        };
        setAcreditados(a => [...a, newAccredited]);
        return { ...item, status: "approved" };
      }
      return item;
    }));
  };

  const handleRejectPendiente = (id) => {
    setPendientes(prev => prev.map(item => {
      if (item.id === id) {
        // Remove from accredited list if there
        const person = item;
        setAcreditados(a => a.filter(itemAcc => !(itemAcc.email === person.email && itemAcc.encounter === selectedEncounter)));
        return { ...item, status: "rejected" };
      }
      return item;
    }));
  };

  const handleSendTestEmail = (e) => {
    e.preventDefault();
    if (!testEmailInput.trim()) return;
    setTestEmailSent(true);
    setTimeout(() => {
      setTestEmailSent(false);
      setTestEmailInput("");
    }, 3000);
  };

  const handleDownloadCSV = () => {
    const headers = ["Nombre", "Email", "Telefono", "Tipo", "Hora"];
    const rows = filteredAcreditados.map(a => [a.name, a.email, a.phone, a.type, a.time]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `acreditados_encuentro_${selectedEncounter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations for Stats (based on current selection and actions)
  const currentConfirmados = confirmados.filter(c => c.encounter === selectedEncounter);
  const currentPendientes = pendientes.filter(p => p.encounter === selectedEncounter);
  const currentAcreditados = acreditados.filter(a => a.encounter === selectedEncounter);

  // Confirmados Stats
  const statInscriptos = currentConfirmados.length;
  const statConfirmados = currentConfirmados.filter(c => c.confirmed).length;
  const statSinConfirmar = statInscriptos - statConfirmados;

  // Pendientes Stats
  const statPendientesCount = currentPendientes.filter(p => p.status === "pending").length;
  const statAprobadosCount = currentPendientes.filter(p => p.status === "approved").length;
  const statRechazadosCount = currentPendientes.filter(p => p.status === "rejected").length;
  const statTotalPendientes = currentPendientes.length;

  // Acreditados Stats
  const statTotalAcreditados = currentAcreditados.length;
  const statAcreditadosConfirmados = currentAcreditados.filter(a => a.type === "Confirmado").length;
  const statAcreditadosInscriptos = currentAcreditados.filter(a => a.type === "Inscripto").length;
  const statAcreditadosWalkIns = currentAcreditados.filter(a => a.type === "Walk-in").length;

  // Dashboard Stats
  const dashboardTotalRespuestas = selectedEncounter === 1 ? 104 : 127;
  const dashboardUltimos7Dias = selectedEncounter === 1 ? 0 : 2;
  const dashboardPrioridad1 = selectedEncounter === 1 ? "Educación" : "Educación";
  const dashboardPrioridadMenciones = selectedEncounter === 1 ? 59 : 79;

  // Filters application
  const filteredConfirmados = currentConfirmados.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(confirmadosSearch.toLowerCase()) ||
                          item.email.toLowerCase().includes(confirmadosSearch.toLowerCase()) ||
                          item.location.toLowerCase().includes(confirmadosSearch.toLowerCase());
    
    if (confirmadosFilter === "confirmados") return matchesSearch && item.confirmed;
    if (confirmadosFilter === "sin-confirmar") return matchesSearch && !item.confirmed;
    return matchesSearch;
  });

  const filteredPendientes = currentPendientes.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(pendientesSearch.toLowerCase()) ||
                          item.email.toLowerCase().includes(pendientesSearch.toLowerCase()) ||
                          item.phone.includes(pendientesSearch);

    if (pendientesFilter === "pendientes") return matchesSearch && item.status === "pending";
    if (pendientesFilter === "aprobados") return matchesSearch && item.status === "approved";
    if (pendientesFilter === "rechazados") return matchesSearch && item.status === "rejected";
    return matchesSearch;
  });

  const filteredAcreditados = currentAcreditados.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(acreditadosSearch.toLowerCase()) ||
                          item.email.toLowerCase().includes(acreditadosSearch.toLowerCase());

    if (acreditadosFilter === "confirm") return matchesSearch && item.type === "Confirmado";
    if (acreditadosFilter === "inscript") return matchesSearch && item.type === "Inscripto";
    if (acreditadosFilter === "walk-in") return matchesSearch && item.type === "Walk-in";
    return matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0c1e] text-white flex flex-col justify-center items-center px-4 font-source">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#131535] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#2c46bf] to-transparent"></div>
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-40 h-12 relative mb-4">
              <img
                alt="CEJOP"
                className="object-contain w-full h-full"
                src="https://www.cejoptucuman.com/_next/static/media/cejop_brand_cropped.58e2cc0e.png"
              />
            </div>
            <h1 className="font-montserrat font-bold text-lg text-white/90 uppercase tracking-wider">Panel de Administración</h1>
            <p className="text-sm text-gray-400 mt-1">Ingresá tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-encode font-bold tracking-wider text-gray-300 uppercase mb-2">Correo Electrónico</label>
              <div className="relative">
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pl-10 text-white focus:outline-none focus:border-[#2c46bf] transition-colors text-sm"
                  placeholder="admin@cejop.com"
                  required
                />
                <Mail className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-encode font-bold tracking-wider text-gray-300 uppercase mb-2">Contraseña</label>
              <div className="relative">
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pl-10 text-white focus:outline-none focus:border-[#2c46bf] transition-colors text-sm"
                  placeholder="••••••••"
                  required
                />
                <Lock className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
              </div>
            </div>

            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg p-3 flex items-start gap-2.5 text-xs leading-relaxed">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full font-montserrat font-bold text-xs uppercase tracking-wider bg-[#2c46bf] hover:bg-[#2c46bf]/90 text-white py-4 rounded-lg transition-colors cursor-pointer flex justify-center items-center gap-2"
            >
              Iniciar Sesión
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c1e] text-white flex flex-col font-source antialiased">
      {/* HEADER */}
      <header className="bg-[#121434] border-b border-white/10 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-28 h-8 relative">
            <img
              alt="CEJOP Brand"
              className="object-contain w-full h-full"
              src="https://www.cejoptucuman.com/_next/static/media/cejop_brand_cropped.58e2cc0e.png"
            />
          </div>
          <div className="h-6 w-px bg-white/15 hidden sm:block"></div>
          <div className="text-center sm:text-left">
            <span className="font-montserrat font-bold text-sm tracking-wide text-white uppercase block leading-none">Panel de Administración</span>
            <span className="text-[10px] font-encode tracking-widest text-[#b7bfe7] uppercase block mt-1">CEJOP Tucumán</span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="text-gray-400 hover:text-white transition-colors text-xs font-encode tracking-wider uppercase flex items-center gap-2 border border-white/10 px-4 py-2 rounded-full bg-white/5 cursor-pointer"
        >
          <LogOut size={13} />
          Salir
        </button>
      </header>

      {/* SUB-BAR CONTROLS */}
      <div className="bg-[#121434]/40 border-b border-white/10 px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Encounter Selector */}
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 w-full md:w-auto">
          <button 
            onClick={() => { setSelectedEncounter(1); setActiveTab("panel"); }}
            className={`flex-1 md:flex-initial px-6 py-2 rounded-md font-montserrat text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${selectedEncounter === 1 ? "bg-[#2c46bf] text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
          >
            1er encuentro
          </button>
          <button 
            onClick={() => { setSelectedEncounter(2); setActiveTab("panel"); }}
            className={`flex-1 md:flex-initial px-6 py-2 rounded-md font-montserrat text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${selectedEncounter === 2 ? "bg-[#2c46bf] text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
          >
            2do encuentro
          </button>
        </div>

        {/* Global Settings */}
        {selectedEncounter === 2 && (
          <div className="flex flex-wrap items-center gap-6 text-xs font-encode tracking-wider text-gray-400">
            <div className="flex items-center gap-3">
              <span className="uppercase text-[10px]">Encuestas:</span>
              <button 
                onClick={() => setSurveysActive(!surveysActive)}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer focus:outline-none ${surveysActive ? "bg-green-500" : "bg-white/10"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${surveysActive ? "translate-x-5" : "translate-x-0"}`} />
              </button>
              <span className={`text-[10px] uppercase font-bold ${surveysActive ? "text-green-400" : "text-red-400"}`}>
                {surveysActive ? "Activas" : "Pausadas / No se aceptan respuestas"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="uppercase text-[10px]">2do encuentro:</span>
              <button 
                onClick={() => setSecondEncounterActive(!secondEncounterActive)}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer focus:outline-none ${secondEncounterActive ? "bg-green-500" : "bg-white/10"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${secondEncounterActive ? "translate-x-5" : "translate-x-0"}`} />
              </button>
              <span className={`text-[10px] uppercase font-bold ${secondEncounterActive ? "text-green-400" : "text-red-400"}`}>
                {secondEncounterActive ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* NAVIGATION TABS */}
      <nav className="bg-[#121434]/20 border-b border-white/5 px-6 overflow-x-auto whitespace-nowrap scrollbar-none flex">
        {[
          { id: "panel", label: "Panel", icon: BarChart3 },
          { id: "confirmados", label: "Confirmados", icon: UserCheck },
          { id: "pendientes", label: "Pendientes", icon: Users },
          { id: "acreditados", label: "Acreditados", icon: Award },
          { id: "feedback", label: "Feedback", icon: Star },
          { id: "emails", label: "Emails", icon: MailCheck },
          { id: "prioridades", label: "Prioridades", icon: ClipboardList },
          { id: "dirigentes", label: "Dirigentes", icon: Star }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-4 border-b-2 font-montserrat text-[11px] font-bold uppercase tracking-widest cursor-pointer transition-all flex items-center gap-2 ${activeTab === tab.id ? "border-[#2c46bf] text-white" : "border-transparent text-gray-400 hover:text-white"}`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* MAIN CONTAINER */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: PANEL (DASHBOARD) */}
          {activeTab === "panel" && (
            <motion.div 
              key="panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Stats 1 */}
                <div className="bg-[#131535] border border-white/10 rounded-xl p-6 relative overflow-hidden shadow-xl">
                  <span className="text-gray-400 text-xs font-encode tracking-wider uppercase block">Total respuestas</span>
                  <span className="font-montserrat font-black text-4xl block mt-2 text-white">{dashboardTotalRespuestas}</span>
                  <div className="absolute right-4 bottom-4 text-white/5"><BarChart3 size={70} strokeWidth={1} /></div>
                </div>

                {/* Stats 2 */}
                <div className="bg-[#131535] border border-white/10 rounded-xl p-6 relative overflow-hidden shadow-xl">
                  <span className="text-gray-400 text-xs font-encode tracking-wider uppercase block">Últimos 7 días</span>
                  <span className="font-montserrat font-black text-4xl block mt-2 text-white">{dashboardUltimos7Dias}</span>
                  <div className="absolute right-4 bottom-4 text-white/5"><RefreshCw size={70} strokeWidth={1} /></div>
                </div>

                {/* Stats 3 */}
                <div className="bg-[#131535] border border-white/10 rounded-xl p-6 relative overflow-hidden shadow-xl col-span-1 sm:col-span-2 lg:col-span-1">
                  <span className="text-gray-400 text-xs font-encode tracking-wider uppercase block">Prioridad #1</span>
                  <span className="font-montserrat font-black text-3xl block mt-2 text-white truncate">{dashboardPrioridad1}</span>
                  <span className="text-xs text-[#b7bfe7] font-semibold mt-1 block">{dashboardPrioridadMenciones} menciones de primer nivel</span>
                  <div className="absolute right-4 bottom-4 text-white/5"><Star size={70} strokeWidth={1} /></div>
                </div>
              </div>

              {/* Chart section */}
              <div className="bg-[#131535] border border-white/10 rounded-xl p-6 shadow-xl">
                <h3 className="font-montserrat font-bold text-xs text-white uppercase tracking-wider mb-6">Respuestas por día</h3>
                <div className="h-64 w-full flex items-end justify-between gap-2 pt-6 relative border-b border-white/10 px-2 sm:px-6">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-1">
                    {[1, 2, 3, 4].map(l => <div key={l} className="w-full border-t border-white/5"></div>)}
                  </div>

                  {/* Dynamic SVG / HTML representation of bars */}
                  {selectedEncounter === 1 ? (
                    // 1er encuentro chart data
                    [
                      { day: "Lunes", count: 12, height: "30%" },
                      { day: "Martes", count: 18, height: "45%" },
                      { day: "Miércoles", count: 25, height: "62%" },
                      { day: "Jueves", count: 32, height: "80%" },
                      { day: "Viernes", count: 17, height: "42%" }
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center group relative z-10">
                        <div className="text-[10px] text-gray-400 mb-2 font-encode font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded absolute -top-8">{bar.count}</div>
                        <div className="w-full sm:w-16 bg-gradient-to-t from-[#2c46bf] to-[#b7bfe7] rounded-t-md cursor-pointer hover:brightness-110 transition-all" style={{ height: bar.height }}></div>
                        <span className="text-[10px] text-gray-400 mt-3 font-encode tracking-wider uppercase truncate max-w-full">{bar.day}</span>
                      </div>
                    ))
                  ) : (
                    // 2do encuentro chart data
                    [
                      { day: "09 Jul", count: 14, height: "25%" },
                      { day: "10 Jul", count: 29, height: "52%" },
                      { day: "11 Jul", count: 42, height: "75%" },
                      { day: "12 Jul", count: 30, height: "54%" },
                      { day: "13 Jul", count: 8, height: "14%" },
                      { day: "14 Jul", count: 2, height: "4%" },
                      { day: "15 Jul", count: 2, height: "4%" }
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center group relative z-10">
                        <div className="text-[10px] text-gray-400 mb-2 font-encode font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded absolute -top-8">{bar.count}</div>
                        <div className="w-full sm:w-12 bg-gradient-to-t from-[#2c46bf] to-[#b7bfe7] rounded-t-md cursor-pointer hover:brightness-110 transition-all" style={{ height: bar.height }}></div>
                        <span className="text-[10px] text-gray-400 mt-3 font-encode tracking-wider uppercase truncate max-w-full">{bar.day}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: CONFIRMADOS */}
          {activeTab === "confirmados" && (
            <motion.div 
              key="confirmados"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="font-montserrat font-black text-lg text-white uppercase tracking-wider">Confirmados — {selectedEncounter === 1 ? "Primer encuentro" : "Segundo encuentro"}</h2>
                  <p className="text-xs text-gray-400 mt-1">Total registrados que completaron su postulación.</p>
                </div>

                {/* Counter row */}
                <div className="flex gap-4 bg-white/5 border border-white/10 rounded-xl px-6 py-3 w-full sm:w-auto justify-between">
                  <div className="text-center">
                    <span className="text-[10px] font-encode text-gray-400 uppercase tracking-widest block">Inscriptos</span>
                    <span className="font-montserrat font-bold text-lg block text-white mt-1">{statInscriptos}</span>
                  </div>
                  <div className="w-px bg-white/10 h-8 self-center"></div>
                  <div className="text-center">
                    <span className="text-[10px] font-encode text-gray-400 uppercase tracking-widest block">Confirmados</span>
                    <span className="font-montserrat font-bold text-lg block text-green-400 mt-1">{statConfirmados}</span>
                  </div>
                  <div className="w-px bg-white/10 h-8 self-center"></div>
                  <div className="text-center">
                    <span className="text-[10px] font-encode text-gray-400 uppercase tracking-widest block">Sin confirmar</span>
                    <span className="font-montserrat font-bold text-lg block text-red-400 mt-1">{statSinConfirmar}</span>
                  </div>
                </div>
              </div>

              {/* Filter bar */}
              <div className="bg-[#131535] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:flex-1">
                  <input
                    type="text"
                    value={confirmadosSearch}
                    onChange={(e) => setConfirmadosSearch(e.target.value)}
                    placeholder="Buscar por nombre, email o localidad..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pl-10 text-white focus:outline-none focus:border-[#2c46bf] transition-colors text-xs"
                  />
                  <Search className="absolute left-3.5 top-3 text-gray-400" size={14} />
                </div>

                <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 w-full md:w-auto">
                  <button 
                    onClick={() => setConfirmadosFilter("todos")}
                    className={`flex-1 md:flex-initial px-4 py-2 rounded-md font-montserrat text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${confirmadosFilter === "todos" ? "bg-[#2c46bf] text-white shadow" : "text-gray-400 hover:text-white"}`}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={() => setConfirmadosFilter("confirmados")}
                    className={`flex-1 md:flex-initial px-4 py-2 rounded-md font-montserrat text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${confirmadosFilter === "confirmados" ? "bg-[#2c46bf] text-white shadow" : "text-gray-400 hover:text-white"}`}
                  >
                    Confirmados
                  </button>
                  <button 
                    onClick={() => setConfirmadosFilter("sin-confirmar")}
                    className={`flex-1 md:flex-initial px-4 py-2 rounded-md font-montserrat text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${confirmadosFilter === "sin-confirmar" ? "bg-[#2c46bf] text-white shadow" : "text-gray-400 hover:text-white"}`}
                  >
                    Sin confirmar
                  </button>
                </div>
              </div>

              {/* Table list */}
              <div className="bg-[#131535] border border-white/10 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-gray-400 uppercase font-encode tracking-wider text-[10px]">
                        <th className="px-6 py-4 font-semibold">Nombre</th>
                        <th className="px-6 py-4 font-semibold">Email</th>
                        <th className="px-6 py-4 font-semibold">Localidad</th>
                        <th className="px-6 py-4 font-semibold">Teléfono</th>
                        <th className="px-6 py-4 font-semibold text-center w-24">Confirmado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-source text-gray-300">
                      {filteredConfirmados.length > 0 ? (
                        filteredConfirmados.map(item => (
                          <tr key={item.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-montserrat font-bold text-white">{item.name}</td>
                            <td className="px-6 py-4">{item.email}</td>
                            <td className="px-6 py-4">{item.location}</td>
                            <td className="px-6 py-4">{item.phone}</td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleToggleConfirmado(item.id)}
                                className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer focus:outline-none inline-block ${item.confirmed ? "bg-green-500" : "bg-white/10"}`}
                              >
                                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${item.confirmed ? "translate-x-5" : "translate-x-0"}`} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-gray-500 font-encode tracking-wide uppercase">No se encontraron registrados.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: PENDIENTES */}
          {activeTab === "pendientes" && (
            <motion.div 
              key="pendientes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="font-montserrat font-black text-lg text-white uppercase tracking-wider flex items-center gap-2">
                    Pendientes de acreditación
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse inline-block" title="Live status"></span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Personas que se presentaron sin estar en la lista. Aprobá o rechazá su entrada.</p>
                </div>

                {/* Counter row */}
                <div className="flex gap-4 bg-white/5 border border-white/10 rounded-xl px-6 py-3 w-full sm:w-auto justify-between">
                  <div className="text-center">
                    <span className="text-[10px] font-encode text-gray-400 uppercase tracking-widest block">Pendientes</span>
                    <span className="font-montserrat font-bold text-lg block text-yellow-400 mt-1">{statPendientesCount}</span>
                  </div>
                  <div className="w-px bg-white/10 h-8 self-center"></div>
                  <div className="text-center">
                    <span className="text-[10px] font-encode text-gray-400 uppercase tracking-widest block">Aprobados</span>
                    <span className="font-montserrat font-bold text-lg block text-green-400 mt-1">{statAprobadosCount}</span>
                  </div>
                  <div className="w-px bg-white/10 h-8 self-center"></div>
                  <div className="text-center">
                    <span className="text-[10px] font-encode text-gray-400 uppercase tracking-widest block">Rechazados</span>
                    <span className="font-montserrat font-bold text-lg block text-red-400 mt-1">{statRechazadosCount}</span>
                  </div>
                  <div className="w-px bg-white/10 h-8 self-center"></div>
                  <div className="text-center">
                    <span className="text-[10px] font-encode text-gray-400 uppercase tracking-widest block">Total</span>
                    <span className="font-montserrat font-bold text-lg block text-white mt-1">{statTotalPendientes}</span>
                  </div>
                </div>
              </div>

              {/* Filter bar */}
              <div className="bg-[#131535] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:flex-1">
                  <input
                    type="text"
                    value={pendientesSearch}
                    onChange={(e) => setPendientesSearch(e.target.value)}
                    placeholder="Buscar por nombre, email o teléfono..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pl-10 text-white focus:outline-none focus:border-[#2c46bf] transition-colors text-xs"
                  />
                  <Search className="absolute left-3.5 top-3 text-gray-400" size={14} />
                </div>

                <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 w-full md:w-auto">
                  <button 
                    onClick={() => setPendientesFilter("pendientes")}
                    className={`flex-1 md:flex-initial px-4 py-2 rounded-md font-montserrat text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${pendientesFilter === "pendientes" ? "bg-[#2c46bf] text-white shadow" : "text-gray-400 hover:text-white"}`}
                  >
                    Pendientes
                  </button>
                  <button 
                    onClick={() => setPendientesFilter("aprobados")}
                    className={`flex-1 md:flex-initial px-4 py-2 rounded-md font-montserrat text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${pendientesFilter === "aprobados" ? "bg-[#2c46bf] text-white shadow" : "text-gray-400 hover:text-white"}`}
                  >
                    Aprobados
                  </button>
                  <button 
                    onClick={() => setPendientesFilter("rechazados")}
                    className={`flex-1 md:flex-initial px-4 py-2 rounded-md font-montserrat text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${pendientesFilter === "rechazados" ? "bg-[#2c46bf] text-white shadow" : "text-gray-400 hover:text-white"}`}
                  >
                    Rechazados
                  </button>
                  <button 
                    onClick={() => setPendientesFilter("todos")}
                    className={`flex-1 md:flex-initial px-4 py-2 rounded-md font-montserrat text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${pendientesFilter === "todos" ? "bg-[#2c46bf] text-white shadow" : "text-gray-400 hover:text-white"}`}
                  >
                    Todos
                  </button>
                </div>
              </div>

              {/* Grid cards for Pendientes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPendientes.length > 0 ? (
                  filteredPendientes.map(item => (
                    <div key={item.id} className="bg-[#131535] border border-white/10 rounded-xl p-5 shadow-xl flex flex-col justify-between gap-4 relative overflow-hidden">
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        {item.status === "pending" && <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[9px] font-encode font-bold uppercase px-2 py-0.5 rounded">Pendiente</span>}
                        {item.status === "approved" && <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-encode font-bold uppercase px-2 py-0.5 rounded">Aprobado</span>}
                        {item.status === "rejected" && <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-encode font-bold uppercase px-2 py-0.5 rounded">Rechazado</span>}
                      </div>

                      <div className="space-y-2">
                        <span className="bg-white/5 border border-white/10 text-white/70 text-[9px] font-encode font-bold uppercase px-2 py-0.5 rounded inline-block">Walk-in</span>
                        <h4 className="font-montserrat font-bold text-base text-white">{item.name}</h4>
                        <div className="text-xs text-gray-400 space-y-1">
                          <p>Teléfono: <span className="text-gray-300">{item.phone}</span></p>
                          <p>Email: <span className="text-gray-300 truncate block max-w-xs">{item.email}</span></p>
                          <p>Edad: <span className="text-gray-300">{item.age} años</span></p>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                        <span className="text-[10px] text-gray-500 font-encode tracking-wider">Llegada: {item.time} hs</span>
                        
                        {item.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRejectPendiente(item.id)}
                              className="border border-red-500/30 bg-red-500/15 text-red-400 font-encode font-bold text-[10px] px-3 py-1.5 rounded cursor-pointer hover:bg-red-500/25 transition-colors"
                            >
                              Rechazar
                            </button>
                            <button
                              onClick={() => handleApprovePendiente(item.id)}
                              className="bg-green-500 text-white font-encode font-bold text-[10px] px-3 py-1.5 rounded cursor-pointer hover:bg-green-600 transition-colors"
                            >
                              Aprobar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-[#131535] border border-white/10 rounded-xl p-8 text-center text-gray-500 font-encode tracking-wide uppercase">
                    No hay solicitudes en esta categoría.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 4: ACREDITADOS */}
          {activeTab === "acreditados" && (
            <motion.div 
              key="acreditados"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h2 className="font-montserrat font-black text-lg text-white uppercase tracking-wider flex items-center gap-2">
                    Acreditados — {selectedEncounter === 1 ? "Primer encuentro" : "Segundo encuentro"}
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse inline-block" title="Live check-in sync"></span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Personas registradas físicamente en el ingreso del evento.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                  {/* Counter row */}
                  <div className="flex gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-2.5 justify-between flex-1 lg:flex-none">
                    <div className="text-center">
                      <span className="text-[10px] font-encode text-gray-400 uppercase tracking-widest block">Total</span>
                      <span className="font-montserrat font-bold text-base block text-white mt-0.5">{statTotalAcreditados}</span>
                    </div>
                    <div className="w-px bg-white/10 h-6 self-center"></div>
                    <div className="text-center">
                      <span className="text-[10px] font-encode text-gray-400 uppercase tracking-widest block">Confirm.</span>
                      <span className="font-montserrat font-bold text-base block text-green-400 mt-0.5">{statAcreditadosConfirmados}</span>
                    </div>
                    <div className="w-px bg-white/10 h-6 self-center"></div>
                    <div className="text-center">
                      <span className="text-[10px] font-encode text-gray-400 uppercase tracking-widest block">Inscript.</span>
                      <span className="font-montserrat font-bold text-base block text-yellow-400 mt-0.5">{statAcreditadosInscriptos}</span>
                    </div>
                    <div className="w-px bg-white/10 h-6 self-center"></div>
                    <div className="text-center">
                      <span className="text-[10px] font-encode text-gray-400 uppercase tracking-widest block">Walk-in</span>
                      <span className="font-montserrat font-bold text-base block text-[#b7bfe7] mt-0.5">{statAcreditadosWalkIns}</span>
                    </div>
                  </div>

                  {/* CSV Button */}
                  <button 
                    onClick={handleDownloadCSV}
                    className="bg-[#2c46bf] hover:bg-[#2c46bf]/90 text-white font-encode font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 justify-center w-full lg:w-auto"
                  >
                    <Download size={14} />
                    CSV
                  </button>
                </div>
              </div>

              {/* Filter bar */}
              <div className="bg-[#131535] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:flex-1">
                  <input
                    type="text"
                    value={acreditadosSearch}
                    onChange={(e) => setAcreditadosSearch(e.target.value)}
                    placeholder="Buscar por nombre o email..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pl-10 text-white focus:outline-none focus:border-[#2c46bf] transition-colors text-xs"
                  />
                  <Search className="absolute left-3.5 top-3 text-gray-400" size={14} />
                </div>

                <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 w-full md:w-auto">
                  {[
                    { id: "todos", label: "Todos" },
                    { id: "confirm", label: "Confirm." },
                    { id: "inscript", label: "Inscript." },
                    { id: "walk-in", label: "Walk-in" }
                  ].map(filter => (
                    <button 
                      key={filter.id}
                      onClick={() => setAcreditadosFilter(filter.id)}
                      className={`flex-1 md:flex-initial px-4 py-2 rounded-md font-montserrat text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${acreditadosFilter === filter.id ? "bg-[#2c46bf] text-white shadow" : "text-gray-400 hover:text-white"}`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table list */}
              <div className="bg-[#131535] border border-white/10 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-gray-400 uppercase font-encode tracking-wider text-[10px]">
                        <th className="px-6 py-4 font-semibold">Nombre</th>
                        <th className="px-6 py-4 font-semibold">Email</th>
                        <th className="px-6 py-4 font-semibold">Teléfono</th>
                        <th className="px-6 py-4 font-semibold">Tipo</th>
                        <th className="px-6 py-4 font-semibold text-right">Hora de Acreditación</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-source text-gray-300">
                      {filteredAcreditados.length > 0 ? (
                        filteredAcreditados.map(item => (
                          <tr key={item.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-montserrat font-bold text-white">{item.name}</td>
                            <td className="px-6 py-4">{item.email}</td>
                            <td className="px-6 py-4">{item.phone}</td>
                            <td className="px-6 py-4">
                              {item.type === "Confirmado" && <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-encode font-bold uppercase px-2 py-0.5 rounded">{item.type}</span>}
                              {item.type === "Inscripto" && <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[9px] font-encode font-bold uppercase px-2 py-0.5 rounded">{item.type}</span>}
                              {item.type === "Walk-in" && <span className="bg-[#2c46bf]/15 border border-[#2c46bf]/30 text-[#b7bfe7] text-[9px] font-encode font-bold uppercase px-2 py-0.5 rounded">{item.type}</span>}
                            </td>
                            <td className="px-6 py-4 text-right font-encode font-bold text-gray-400">{item.time} hs</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-gray-500 font-encode tracking-wide uppercase">No hay personas acreditadas.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: FEEDBACK */}
          {activeTab === "feedback" && (
            <motion.div 
              key="feedback"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-montserrat font-black text-lg text-white uppercase tracking-wider">Feedback del encuentro</h2>
                <p className="text-xs text-gray-400 mt-1">Análisis de encuestas de satisfacción recolectadas al final del evento.</p>
              </div>

              {selectedEncounter === 2 ? (
                <div className="bg-[#131535] border border-white/10 rounded-xl p-8 text-center text-gray-500 font-encode tracking-wide uppercase">
                  Todavía no hay respuestas de feedback para el segundo encuentro.
                </div>
              ) : (
                <>
                  {/* Grid general feedback stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-[#131535] border border-white/10 rounded-xl p-5 shadow-xl text-center">
                      <span className="text-gray-400 text-[10px] font-encode tracking-widest uppercase">Respuestas</span>
                      <span className="font-montserrat font-black text-3xl block mt-2 text-white">{feedbackStats[1].respuestas}</span>
                    </div>
                    <div className="bg-[#131535] border border-white/10 rounded-xl p-5 shadow-xl text-center">
                      <span className="text-gray-400 text-[10px] font-encode tracking-widest uppercase">Promedio</span>
                      <span className="font-montserrat font-black text-3xl block mt-2 text-white">{feedbackStats[1].promedio}/10</span>
                    </div>
                    <div className="bg-[#131535] border border-white/10 rounded-xl p-5 shadow-xl text-center">
                      <span className="text-gray-400 text-[10px] font-encode tracking-widest uppercase">NPS</span>
                      <span className="font-montserrat font-black text-3xl block mt-2 text-green-400">+{feedbackStats[1].nps}</span>
                    </div>
                    <div className="bg-[#131535] border border-white/10 rounded-xl p-5 shadow-xl text-center">
                      <span className="text-gray-400 text-[10px] font-encode tracking-widest uppercase">Recomiendan</span>
                      <span className="font-montserrat font-black text-3xl block mt-2 text-white">{feedbackStats[1].recomiendan}%</span>
                    </div>
                  </div>

                  {/* NPS breakdown + Rating Distribution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* NPS */}
                    <div className="bg-[#131535] border border-white/10 rounded-xl p-6 shadow-xl">
                      <h3 className="font-montserrat font-bold text-xs text-white uppercase tracking-wider mb-6">Clasificación NPS</h3>
                      <div className="flex h-6 rounded-full overflow-hidden mb-6">
                        <div className="bg-green-500 h-full flex items-center justify-center text-[10px] font-bold" style={{ width: `${feedbackStats[1].promotores}%` }}>{feedbackStats[1].promotores}%</div>
                        <div className="bg-yellow-500 h-full flex items-center justify-center text-[10px] font-bold text-black" style={{ width: `${feedbackStats[1].pasivos}%` }}>{feedbackStats[1].pasivos}%</div>
                        <div className="bg-red-500 h-full flex items-center justify-center text-[10px] font-bold" style={{ width: `${feedbackStats[1].detractores}%` }}>{feedbackStats[1].detractores}%</div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 font-encode">
                        <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Promotores (9-10)</span>
                        <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> Pasivos (7-8)</span>
                        <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Detractores (0-6)</span>
                      </div>
                    </div>

                    {/* Ratings distribution bars */}
                    <div className="bg-[#131535] border border-white/10 rounded-xl p-6 shadow-xl">
                      <h3 className="font-montserrat font-bold text-xs text-white uppercase tracking-wider mb-4">Distribución de puntuaciones</h3>
                      <div className="space-y-2">
                        {feedbackStats[1].ratings.map((count, index) => {
                          const ratingNum = index + 1;
                          const percent = Math.round((count / feedbackStats[1].respuestas) * 100);
                          return (
                            <div key={ratingNum} className="flex items-center gap-3 text-xs">
                              <span className="w-4 text-right font-encode font-bold text-gray-400">{ratingNum}</span>
                              <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                                <div className="bg-[#2c46bf] h-full rounded-full" style={{ width: `${percent}%` }}></div>
                              </div>
                              <span className="w-8 text-right font-encode text-gray-500">{count} r.</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* NPS analytic lists columns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* List 1 */}
                    <div className="bg-[#131535] border border-white/10 rounded-xl p-5 shadow-xl space-y-4">
                      <h3 className="font-montserrat font-bold text-xs text-white uppercase tracking-wider pb-2 border-b border-white/10">¿Recomendarían el CEJOP?</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-300">Sí</span>
                          <span className="font-montserrat font-bold text-green-400">{feedbackStats[1].recomiendanPercentages.si}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full" style={{ width: `${feedbackStats[1].recomiendanPercentages.si}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-300">Tal vez</span>
                          <span className="font-montserrat font-bold text-yellow-400">{feedbackStats[1].recomiendanPercentages.talvez}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-yellow-500 h-full" style={{ width: `${feedbackStats[1].recomiendanPercentages.talvez}%` }}></div>
                        </div>

                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-300">No</span>
                          <span className="font-montserrat font-bold text-red-400">{feedbackStats[1].recomiendanPercentages.no}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full" style={{ width: `${feedbackStats[1].recomiendanPercentages.no}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* List 2 */}
                    <div className="bg-[#131535] border border-white/10 rounded-xl p-5 shadow-xl space-y-4">
                      <h3 className="font-montserrat font-bold text-xs text-white uppercase tracking-wider pb-2 border-b border-white/10">Próximos temas más pedidos</h3>
                      <div className="space-y-3">
                        {feedbackStats[1].proximosTemas.map((tema, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-gray-300 truncate max-w-[200px]">{tema.name}</span>
                              <span className="font-encode text-gray-400 font-bold">{tema.count} v.</span>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-[#2c46bf] h-full" style={{ width: `${tema.percent}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* List 3 */}
                    <div className="bg-[#131535] border border-white/10 rounded-xl p-5 shadow-xl space-y-4">
                      <h3 className="font-montserrat font-bold text-xs text-white uppercase tracking-wider pb-2 border-b border-white/10">Espacios de procedencia</h3>
                      <div className="space-y-2">
                        {feedbackStats[1].procedencia.map((proc, i) => (
                          <div key={i} className="flex justify-between items-center bg-white/5 px-3 py-2 border border-white/5 rounded-lg text-xs">
                            <span className="text-gray-300 font-encode font-bold uppercase tracking-wider text-[10px]">{proc.space}</span>
                            <span className="bg-[#2c46bf] text-white px-2 py-0.5 rounded font-montserrat font-bold text-[10px]">{proc.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Individual feedback comment listings */}
                  <div className="bg-[#131535] border border-white/10 rounded-xl p-6 shadow-xl space-y-5">
                    <h3 className="font-montserrat font-bold text-xs text-white uppercase tracking-wider pb-2 border-b border-white/10">Comentarios individuales</h3>
                    <div className="divide-y divide-white/5">
                      {feedbackComments.map(comment => (
                        <div key={comment.id} className="py-4 first:pt-0 last:pb-0 flex flex-col gap-2 font-source">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex items-center gap-3">
                              <span className="bg-green-500/10 border border-green-500/20 text-green-400 font-montserrat font-bold text-xs px-2.5 py-0.5 rounded-full">
                                {comment.rating}/10
                              </span>
                              <span className="text-xs text-gray-400 font-semibold">{comment.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-gray-500 font-encode">
                              <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded uppercase font-bold">{comment.space}</span>
                              <span>{comment.time}</span>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic">"{comment.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* TAB 6: EMAILS */}
          {activeTab === "emails" && (
            <motion.div 
              key="emails"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Ping Test Form */}
                <div className="bg-[#131535] border border-white/10 rounded-xl p-6 shadow-xl space-y-4 md:col-span-2">
                  <h3 className="font-montserrat font-bold text-xs text-white uppercase tracking-wider pb-2 border-b border-white/10 flex items-center gap-2">
                    <Send size={14} className="text-[#b7bfe7]" />
                    Prueba de envío (Ping test)
                  </h3>
                  <form onSubmit={handleSendTestEmail} className="space-y-4">
                    <p className="text-xs text-gray-400 leading-relaxed">Mandá un correo de prueba a cualquier dirección para testear la integración del sistema SMTP de CEJOP.</p>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={testEmailInput}
                        onChange={(e) => setTestEmailInput(e.target.value)}
                        placeholder="tu@email.com"
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#2c46bf] transition-colors text-xs"
                        required
                      />
                      <button
                        type="submit"
                        disabled={testEmailSent}
                        className="bg-[#2c46bf] hover:bg-[#2c46bf]/90 disabled:bg-[#2c46bf]/40 text-white font-encode font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                      >
                        Enviar test
                      </button>
                    </div>

                    <AnimatePresence>
                      {testEmailSent && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg p-3 text-xs flex items-center gap-2"
                        >
                          <Check size={14} />
                          <span>¡Correo de prueba enviado con éxito! Revisá tu casilla.</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </div>

                {/* Email Stats */}
                <div className="bg-[#131535] border border-white/10 rounded-xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <h3 className="font-montserrat font-bold text-xs text-white uppercase tracking-wider pb-2 border-b border-white/10 flex items-center gap-2">
                      <MailCheck size={14} className="text-[#b7bfe7]" />
                      Emails enviados
                    </h3>
                    <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                      <div>
                        <span className="text-[9px] font-encode text-gray-500 uppercase block">Total</span>
                        <span className="font-montserrat font-black text-2xl block text-white mt-1">{emailStats.total}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-encode text-gray-500 uppercase block">Enviados</span>
                        <span className="font-montserrat font-black text-2xl block text-green-400 mt-1">{emailStats.enviados}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-encode text-gray-500 uppercase block">Fallidos</span>
                        <span className="font-montserrat font-black text-2xl block text-red-400 mt-1">{emailStats.fallidos}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 italic mt-6 leading-relaxed">Tasa de entrega del 98.7% utilizando SendGrid SMTP Services.</p>
                </div>
              </div>

              {/* Campaign list */}
              <div className="bg-[#131535] border border-white/10 rounded-xl overflow-hidden shadow-xl">
                <div className="bg-white/5 border-b border-white/10 px-6 py-4">
                  <h3 className="font-montserrat font-bold text-xs text-white uppercase tracking-wider">Campañas de Email</h3>
                </div>
                <div className="divide-y divide-white/5">
                  {emailCampaigns
                    .filter(c => c.encounter === selectedEncounter)
                    .map((campaign, i) => (
                      <div key={i} className="px-6 py-4 flex justify-between items-center font-source text-xs hover:bg-white/2 transition-colors">
                        <div className="space-y-1">
                          <span className="font-montserrat font-bold text-white text-sm block">{campaign.name}</span>
                          <span className="bg-white/5 border border-white/10 text-gray-400 text-[9px] font-encode font-bold uppercase px-2 py-0.5 rounded inline-block">{campaign.type}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-400 font-encode tracking-wider text-[10px] block uppercase">Destinatarios</span>
                          <span className="font-montserrat font-bold text-sm block text-white mt-1">{campaign.sent} enviados</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 7: PRIORIDADES */}
          {activeTab === "prioridades" && (
            <motion.div 
              key="prioridades"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-montserrat font-black text-lg text-white uppercase tracking-wider">Prioridades seleccionadas</h2>
                <p className="text-xs text-gray-400 mt-1">Preguntas de profundidad redactadas por los postulantes para justificar sus prioridades temáticas.</p>
              </div>

              {/* Accordion List */}
              <div className="space-y-4">
                {prioritiesAccordionData[selectedEncounter].map((topic) => {
                  const isExpanded = expandedPriorityId === topic.id;
                  return (
                    <div 
                      key={topic.id} 
                      className="bg-[#131535] border border-white/10 rounded-xl overflow-hidden shadow-xl"
                    >
                      <button
                        onClick={() => setExpandedPriorityId(isExpanded ? null : topic.id)}
                        className="w-full px-6 py-4 flex justify-between items-center hover:bg-white/5 transition-colors cursor-pointer text-left focus:outline-none"
                      >
                        <span className="font-montserrat font-bold text-sm uppercase tracking-wide text-white">{topic.title}</span>
                        {isExpanded ? <ChevronUp size={16} className="text-[#b7bfe7]" /> : <ChevronDown size={16} className="text-gray-400" />}
                      </button>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden bg-[#121434]/40"
                          >
                            <div className="px-6 py-5 border-t border-white/5 space-y-4 divide-y divide-white/5">
                              {topic.responses.map((resp, idx) => (
                                <div key={idx} className="pt-3 first:pt-0 flex gap-4 text-xs sm:text-sm text-gray-300 leading-relaxed font-source">
                                  <div className="text-gray-500 font-bold shrink-0 mt-0.5">#{idx + 1}</div>
                                  <p className="italic">"{resp}"</p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 8: DIRIGENTES */}
          {activeTab === "dirigentes" && (
            <motion.div 
              key="dirigentes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-montserrat font-black text-lg text-white uppercase tracking-wider">Dirigentes mencionados</h2>
                <p className="text-xs text-gray-400 mt-1">Ranking de los dirigentes políticos provinciales y nacionales más y menos valorados por los inscriptos.</p>
              </div>

              {/* 4-column layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Column 1: Tucumán Admiran */}
                <div className="bg-[#131535] border border-white/10 rounded-xl p-5 shadow-xl space-y-5">
                  <h3 className="font-montserrat font-bold text-xs text-white uppercase tracking-wider pb-2 border-b border-white/10 text-center flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Tucumán — Admiran
                  </h3>
                  <div className="space-y-4">
                    {dirigentesData[selectedEncounter].tucumanAdmiran.map((dir, i) => (
                      <div key={i} className="space-y-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-300">{dir.name}</span>
                          <span className="font-encode text-gray-400 font-bold">{dir.count} v.</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full" style={{ width: `${dir.percent}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Argentina Admiran */}
                <div className="bg-[#131535] border border-white/10 rounded-xl p-5 shadow-xl space-y-5">
                  <h3 className="font-montserrat font-bold text-xs text-white uppercase tracking-wider pb-2 border-b border-white/10 text-center flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Argentina — Admiran
                  </h3>
                  <div className="space-y-4">
                    {dirigentesData[selectedEncounter].argentinaAdmiran.map((dir, i) => (
                      <div key={i} className="space-y-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-300">{dir.name}</span>
                          <span className="font-encode text-gray-400 font-bold">{dir.count} v.</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full" style={{ width: `${dir.percent}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 3: Tucumán Cuestionan */}
                <div className="bg-[#131535] border border-white/10 rounded-xl p-5 shadow-xl space-y-5">
                  <h3 className="font-montserrat font-bold text-xs text-white uppercase tracking-wider pb-2 border-b border-white/10 text-center flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Tucumán — Cuestionan
                  </h3>
                  <div className="space-y-4">
                    {dirigentesData[selectedEncounter].tucumanCuestionan.map((dir, i) => (
                      <div key={i} className="space-y-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-300">{dir.name}</span>
                          <span className="font-encode text-gray-400 font-bold">{dir.count} v.</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full" style={{ width: `${dir.percent}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 4: Argentina Cuestionan */}
                <div className="bg-[#131535] border border-white/10 rounded-xl p-5 shadow-xl space-y-5">
                  <h3 className="font-montserrat font-bold text-xs text-white uppercase tracking-wider pb-2 border-b border-white/10 text-center flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Argentina — Cuestionan
                  </h3>
                  <div className="space-y-4">
                    {dirigentesData[selectedEncounter].argentinaCuestionan.map((dir, i) => (
                      <div key={i} className="space-y-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-300">{dir.name}</span>
                          <span className="font-encode text-gray-400 font-bold">{dir.count} v.</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full" style={{ width: `${dir.percent}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
