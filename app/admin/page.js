"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const LOGO =
  "https://www.cejoptucuman.com/_next/static/media/cejop_brand_cropped.58e2cc0e.png";
const DESTINO = "/admin/encuentros";

export default function AdminLogin() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Si ya hay sesión de admin, ir directo al panel real.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: admin } = await supabase.rpc("is_admin");
          if (active && admin === true) {
            router.replace(DESTINO);
            return;
          }
        }
      } catch {
        // sin conexión / sin env: se muestra el login
      }
      if (active) setChecking(false);
    })();
    return () => {
      active = false;
    };
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) {
        setLoginError("Credenciales incorrectas. Verificá el mail y la contraseña.");
        return;
      }
      const { data: admin } = await supabase.rpc("is_admin");
      if (admin !== true) {
        await supabase.auth.signOut();
        setLoginError("Esta cuenta no tiene permisos de administrador.");
        return;
      }
      router.replace(DESTINO);
    } catch {
      setLoginError("No se pudo conectar. Intentá de nuevo en unos segundos.");
    } finally {
      setLoginLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0b0c1e] text-white flex flex-col justify-center items-center px-4 font-source">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
      </div>
    );
  }

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
            <img alt="CEJOP" className="object-contain w-full h-full" src={LOGO} />
          </div>
          <h1 className="font-montserrat font-bold text-lg text-white/90 uppercase tracking-wider">
            Panel de Administración
          </h1>
          <p className="text-sm text-gray-400 mt-1">Ingresá tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-encode font-bold tracking-wider text-gray-300 uppercase mb-2">
              Correo Electrónico
            </label>
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
            <label className="block text-xs font-encode font-bold tracking-wider text-gray-300 uppercase mb-2">
              Contraseña
            </label>
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
            disabled={loginLoading}
            className="w-full font-montserrat font-bold text-xs uppercase tracking-wider bg-[#2c46bf] hover:bg-[#2c46bf]/90 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-lg transition-colors cursor-pointer flex justify-center items-center gap-2"
          >
            {loginLoading ? "Ingresando…" : "Iniciar Sesión"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
