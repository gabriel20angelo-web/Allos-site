"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { LogOut, UserCircle, Loader2 } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PasswordGate from "@/components/avaliallos/PasswordGate";
import SlotManager from "@/components/avaliallos/SlotManager";
import { supabase } from "@/lib/supabase";
import type { Avaliador } from "@/lib/supabase";

export default function AvaliadorPage() {
  const [auth, setAuth] = useState(false);
  const [avaliador, setAvaliador] = useState<Avaliador | null>(null);
  const [existing, setExisting] = useState<Avaliador[]>([]);
  const [nameInput, setNameInput] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAvaliadores = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("avaliadores").select("*").order("nome");
    setExisting(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (auth && !avaliador) fetchAvaliadores();
  }, [auth, avaliador, fetchAvaliadores]);

  async function createAvaliador() {
    if (!nameInput.trim()) return;
    setLoading(true);
    const { data } = await supabase.from("avaliadores").insert({ nome: nameInput.trim() }).select().single();
    if (data) setAvaliador(data);
    setLoading(false);
  }

  function handleLogout() {
    setAuth(false);
    setAvaliador(null);
    setExisting([]);
    setNameInput("");
  }

  if (!auth) {
    return (
      <PasswordGate
        title="Área do Avaliador"
        description="Acesso restrito aos avaliadores da Allos"
        envKey="NEXT_PUBLIC_AVALIADOR_PASSWORD"
        onAuthenticated={() => setAuth(true)}
      />
    );
  }

  if (!avaliador) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "#111111" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-7">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
              style={{ background: "rgba(200,75,49,.1)", border: "1px solid rgba(200,75,49,.25)" }}
            >
              <UserCircle size={24} className="text-[#C84B31]" />
            </div>
            <h2 className="font-fraunces font-bold text-[#FDFBF7]" style={{ fontSize: "22px" }}>Identificação</h2>
            <p className="font-dm mt-1 text-[13px]" style={{ color: "rgba(253,251,247,0.4)" }}>
              Selecione seu nome ou cadastre-se
            </p>
          </div>

          <div
            className="rounded-2xl p-6 space-y-5"
            style={{ background: "rgba(253,251,247,.03)", border: "1px solid rgba(253,251,247,.08)" }}
          >
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 size={22} className="animate-spin text-[#C84B31]" />
              </div>
            ) : (
              <>
                {existing.length > 0 && (
                  <div>
                    <p className="font-dm font-medium text-[12px] uppercase tracking-widest mb-3" style={{ color: "rgba(253,251,247,0.3)" }}>
                      Avaliadores cadastrados
                    </p>
                    <div className="space-y-2">
                      {existing.map((av) => (
                        <button
                          key={av.id}
                          onClick={() => setAvaliador(av)}
                          className="w-full text-left px-4 py-3 rounded-xl font-dm font-medium text-[14px] transition-all hover:border-[#C84B31]/50"
                          style={{
                            color: "rgba(253,251,247,0.75)",
                            background: "rgba(253,251,247,.04)",
                            border: "1px solid rgba(253,251,247,.08)",
                          }}
                        >
                          {av.nome}
                        </button>
                      ))}
                    </div>
                    <div className="h-px my-4" style={{ background: "rgba(253,251,247,0.07)" }} />
                  </div>
                )}

                <div>
                  <p className="font-dm font-medium text-[12px] uppercase tracking-widest mb-3" style={{ color: "rgba(253,251,247,0.3)" }}>
                    {existing.length > 0 ? "Novo avaliador" : "Cadastre seu nome"}
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && createAvaliador()}
                      placeholder="Seu nome completo"
                      className="flex-1 rounded-xl px-4 py-3 font-dm text-[14px] outline-none"
                      style={{
                        background: "rgba(253,251,247,.05)",
                        border: "1px solid rgba(253,251,247,.1)",
                        color: "#FDFBF7",
                      }}
                      autoFocus={existing.length === 0}
                    />
                    <button
                      onClick={createAvaliador}
                      disabled={!nameInput.trim() || loading}
                      className="px-5 rounded-xl font-dm font-semibold text-[14px] text-white bg-[#C84B31] hover:bg-[#A33D27] transition-colors disabled:opacity-40"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Avaliador logado ─────────────────────────────────────────────────────
  return (
    <>
      <NavBar />
      <main
        className="min-h-screen"
        style={{ background: "radial-gradient(ellipse 60% 35% at 50% 0%, rgba(200,75,49,.04) 0%, transparent 55%), #111111" }}
      >
        <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-10 pt-32 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <p className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-2">
                Área do Avaliador
              </p>
              <h1 className="font-fraunces font-bold text-[#FDFBF7]" style={{ fontSize: "clamp(26px,4vw,40px)" }}>
                Olá, <span className="italic text-[#C84B31]">{avaliador.nome}</span>
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 font-dm font-medium text-[13px] rounded-full px-5 py-2.5 transition-all"
              style={{ color: "rgba(253,251,247,0.5)", border: "1px solid rgba(253,251,247,.1)" }}
            >
              <LogOut size={15} /> Sair
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.6 }}
            className="rounded-2xl px-5 py-4 mb-8"
            style={{ background: "rgba(200,75,49,.06)", border: "1px solid rgba(200,75,49,.15)" }}
          >
            <p className="font-dm text-[13px]" style={{ color: "rgba(253,251,247,0.55)" }}>
              Clique nos horários para disponibilizá-los ou removê-los. <strong className="text-[#FDFBF7]">Atenção:</strong> não é possível remover um horário que já possui agendamentos — contate o administrador nesses casos.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <SlotManager avaliadorId={avaliador.id} avaliadorNome={avaliador.nome} />
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
