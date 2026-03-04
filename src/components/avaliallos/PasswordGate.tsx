"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, AlertCircle } from "lucide-react";

interface Props {
  title: string;
  description?: string;
  envKey: string; // chave da variável de ambiente a comparar
  onAuthenticated: () => void;
}

export default function PasswordGate({ title, description, envKey, onAuthenticated }: Props) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // pequeno delay para não revelar timing
    setTimeout(() => {
      const expected = process.env[envKey];
      if (pw === expected) {
        onAuthenticated();
      } else {
        setError("Senha incorreta. Tente novamente.");
        setPw("");
      }
      setLoading(false);
    }, 350);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#111111" }}
    >
      {/* Grain */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[.04] z-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(200,75,49,.07) 0%, transparent 70%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
            style={{ background: "rgba(200,75,49,.1)", border: "1px solid rgba(200,75,49,.25)" }}
          >
            <Lock size={22} className="text-[#C84B31]" />
          </div>
          <h1 className="font-fraunces font-bold text-[#FDFBF7]" style={{ fontSize: "26px" }}>
            {title}
          </h1>
          {description && (
            <p className="font-dm mt-2" style={{ fontSize: "14px", color: "rgba(253,251,247,0.45)" }}>
              {description}
            </p>
          )}
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-7"
          style={{ background: "rgba(253,251,247,0.03)", border: "1px solid rgba(253,251,247,0.08)" }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-dm font-medium text-[13px] mb-2" style={{ color: "rgba(253,251,247,0.6)" }}>
                Senha de acesso
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={pw}
                  onChange={(e) => { setPw(e.target.value); setError(""); }}
                  placeholder="••••••••••"
                  className="w-full rounded-xl px-4 py-3 font-dm text-sm pr-11 outline-none transition-all"
                  style={{
                    background: "rgba(253,251,247,0.05)",
                    border: error ? "1px solid rgba(239,68,68,.5)" : "1px solid rgba(253,251,247,0.12)",
                    color: "#FDFBF7",
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "rgba(253,251,247,0.4)" }}
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl px-4 py-3"
                style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)" }}
              >
                <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                <p className="font-dm text-[13px] text-red-400">{error}</p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={!pw || loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full font-dm font-semibold text-white rounded-xl py-3 transition-colors disabled:opacity-40"
              style={{ background: "#C84B31", fontSize: "14px" }}
            >
              {loading ? "Verificando..." : "Entrar"}
            </motion.button>
          </form>
        </div>

        <p className="text-center mt-4 font-dm" style={{ fontSize: "12px", color: "rgba(253,251,247,0.2)" }}>
          Associação Allos · Área restrita
        </p>
      </motion.div>
    </div>
  );
}
