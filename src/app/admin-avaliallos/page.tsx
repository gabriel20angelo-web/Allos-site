"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Download, RefreshCw, CheckCircle, XCircle, Clock,
  Search, Loader2, AlertCircle, Unlock
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PasswordGate from "@/components/avaliallos/PasswordGate";
import { supabase } from "@/lib/supabase";
import type { Agendamento } from "@/lib/supabase";

const STATUS_CONFIG = {
  pendente:  { label: "Pendente",  color: "rgba(245,158,11,", Icon: Clock },
  aprovado:  { label: "Aprovado",  color: "rgba(74,222,128,", Icon: CheckCircle },
  cancelado: { label: "Cancelado", color: "rgba(239,68,68,",  Icon: XCircle },
} as const;

const CAT_LABELS: Record<string, string> = {
  primeira_tentativa: "Processo seletivo (1ª tentativa)",
  segunda_tentativa:  "Processo seletivo (2ª+ tentativa)",
  reavaliacao:        "Reavaliação",
  testar_habilidades: "Testar habilidades",
  omnia_acp:          "Formação Omnia ACP",
  outro:              "Outro",
};

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [forceSlot, setForceSlot] = useState<{ data: string; horario: string } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("agendamentos").select("*").order("created_at", { ascending: false });
    setAgendamentos(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { if (auth) fetchData(); }, [auth, fetchData]);

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    await supabase.from("agendamentos").update({ status }).eq("id", id);
    setAgendamentos((prev) => prev.map((a) => a.id === id ? { ...a, status: status as Agendamento["status"] } : a));
    setUpdatingId(null);
  }

  // ─── Forçar liberação: cancela todos os agendamentos do slot e remove todas as disponibilidades
  async function forceReleaseSlot(data: string, horario: string) {
    const { error: e1 } = await supabase.from("agendamentos").update({ status: "cancelado" }).eq("data", data).eq("horario_inicio", horario).neq("status", "cancelado");
    const { error: e2 } = await supabase.from("disponibilidades").delete().eq("data", data).eq("horario_inicio", horario);
    if (e1 || e2) alert("Erro ao liberar slot. Tente novamente.");
    else { alert("Slot liberado com sucesso."); fetchData(); }
    setForceSlot(null);
  }

  function exportTxt() {
    const filtered = getFiltered();
    const lines = ["═══════════════════", " AvaliAllos - Export", `═══════════════════`, ""];
    filtered.forEach((a, i) => {
      lines.push(`── ${i+1} ── ${a.nome_completo}`);
      lines.push(`Tel: ${a.telefone}`);
      lines.push(`Data: ${a.data} às ${a.horario_inicio?.substring(0,5)}`);
      lines.push(`Cat: ${CAT_LABELS[a.categoria] ?? a.categoria}${a.categoria_outro ? ` (${a.categoria_outro})` : ""}`);
      lines.push(`Prática: ${a.participou_grupo_pratica ? "Sim" : "Não"}`);
      lines.push(`Status: ${STATUS_CONFIG[a.status]?.label ?? a.status}`);
      lines.push("");
    });
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.href = url; el.download = `avaliallos-${format(new Date(),"yyyy-MM-dd")}.txt`; el.click();
    URL.revokeObjectURL(url);
  }

  function getFiltered() {
    return agendamentos.filter((a) => {
      if (statusFilter !== "todos" && a.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return a.nome_completo.toLowerCase().includes(q) || a.telefone.includes(q);
      }
      return true;
    });
  }

  if (!auth) {
    return (
      <PasswordGate
        title="Painel Administrativo"
        description="Acesso restrito à administração da Allos"
        envKey="NEXT_PUBLIC_ADMIN_PASSWORD"
        onAuthenticated={() => setAuth(true)}
      />
    );
  }

  const filtered = getFiltered();
  const stats = {
    total:     agendamentos.length,
    pendentes: agendamentos.filter((a) => a.status === "pendente").length,
    aprovados: agendamentos.filter((a) => a.status === "aprovado").length,
    cancelados:agendamentos.filter((a) => a.status === "cancelado").length,
  };

  // Slots únicos com agendamentos para o painel de liberação
  const slotGroups = agendamentos
    .filter((a) => a.status !== "cancelado")
    .reduce<Record<string, Agendamento[]>>((acc, a) => {
      const k = `${a.data}_${a.horario_inicio?.substring(0,5)}`;
      if (!acc[k]) acc[k] = [];
      acc[k].push(a);
      return acc;
    }, {});

  return (
    <>
      <NavBar />
      <main className="min-h-screen" style={{ background: "#111111" }}>
        <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-10 pt-32 pb-24">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <p className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-2">AvaliAllos</p>
              <h1 className="font-fraunces font-bold text-[#FDFBF7]" style={{ fontSize: "clamp(26px,4vw,40px)" }}>
                Painel <span className="italic text-[#C84B31]">Administrativo</span>
              </h1>
            </div>
            <div className="flex gap-2">
              <Btn icon={<RefreshCw size={14} />} label="Atualizar" onClick={fetchData} />
              <Btn icon={<Download size={14} />} label="Exportar" onClick={exportTxt} primary />
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: "Total", value: stats.total, color: "rgba(253,251,247,0.9)" },
              { label: "Pendentes", value: stats.pendentes, color: "#F59E0B" },
              { label: "Aprovados", value: stats.aprovados, color: "#4ADE80" },
              { label: "Cancelados", value: stats.cancelados, color: "#EF4444" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl px-5 py-4"
                style={{ background: "rgba(253,251,247,.03)", border: "1px solid rgba(253,251,247,.07)" }}>
                <p className="font-dm text-[11px] uppercase tracking-widest mb-1" style={{ color: "rgba(253,251,247,0.35)" }}>{s.label}</p>
                <p className="font-fraunces font-bold" style={{ fontSize: "28px", color: s.color }}>{s.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Liberação forçada de slots */}
          {Object.keys(slotGroups).length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
              className="rounded-2xl p-6 mb-8"
              style={{ background: "rgba(239,68,68,.04)", border: "1px solid rgba(239,68,68,.12)" }}>
              <div className="flex items-center gap-2 mb-4">
                <Unlock size={15} className="text-red-400" />
                <p className="font-dm font-semibold text-[13px] text-red-400">Liberar slot (forçar)</p>
              </div>
              <p className="font-dm text-[12px] mb-4" style={{ color: "rgba(253,251,247,0.4)" }}>
                Cancela todos os agendamentos do slot e remove as disponibilidades dos avaliadores.
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(slotGroups).map(([k, ags]) => {
                  const [d, t] = k.split("_");
                  return (
                    <button
                      key={k}
                      onClick={() => setForceSlot({ data: d, horario: t! })}
                      className="font-dm text-[12px] px-3 py-2 rounded-xl transition-colors hover:border-red-400/50"
                      style={{ background: "rgba(239,68,68,.07)", border: "1px solid rgba(239,68,68,.15)", color: "#EF4444" }}
                    >
                      {d} às {t} · {ags.length} ag.
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Filtros */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
            className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(253,251,247,0.3)" }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome ou telefone..."
                className="w-full pl-10 pr-4 py-3 rounded-xl font-dm text-[14px] outline-none"
                style={{ background: "rgba(253,251,247,.04)", border: "1px solid rgba(253,251,247,.08)", color: "#FDFBF7" }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl px-4 py-3 font-dm text-[14px] outline-none sm:w-48"
              style={{ background: "rgba(253,251,247,.04)", border: "1px solid rgba(253,251,247,.08)", color: "#FDFBF7" }}
            >
              <option value="todos">Todos</option>
              <option value="pendente">Pendentes</option>
              <option value="aprovado">Aprovados</option>
              <option value="cancelado">Cancelados</option>
            </select>
          </motion.div>

          {/* Lista */}
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={24} className="animate-spin text-[#C84B31]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 rounded-2xl"
              style={{ background: "rgba(253,251,247,.02)", border: "1px solid rgba(253,251,247,.06)" }}>
              <AlertCircle size={28} className="mb-3" style={{ color: "rgba(253,251,247,0.2)" }} />
              <p className="font-dm text-[14px]" style={{ color: "rgba(253,251,247,0.3)" }}>Nenhum agendamento encontrado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((a) => {
                const cfg = STATUS_CONFIG[a.status] ?? STATUS_CONFIG.pendente;
                const Icon = cfg.Icon;
                const dateStr = a.data ? format(parseISO(a.data), "EEE, dd/MM", { locale: ptBR }) : "—";
                const time = a.horario_inicio?.substring(0,5) ?? "--:--";
                const isUpdating = updatingId === a.id;

                return (
                  <motion.div
                    key={a.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl px-6 py-5"
                    style={{ background: "rgba(253,251,247,.03)", border: "1px solid rgba(253,251,247,.07)" }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap mb-2">
                          <h3 className="font-fraunces font-bold text-[#FDFBF7]" style={{ fontSize: "16px" }}>{a.nome_completo}</h3>
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-dm text-[11px] font-semibold"
                            style={{ background: `${cfg.color}.1)`, color: `${cfg.color}.9)`, border: `1px solid ${cfg.color}.25)` }}
                          >
                            <Icon size={11} /> {cfg.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-5 gap-y-1 font-dm text-[13px]" style={{ color: "rgba(253,251,247,0.45)" }}>
                          <span className="capitalize">{dateStr} às {time}</span>
                          <span>{a.telefone}</span>
                          <span>{CAT_LABELS[a.categoria] ?? a.categoria}{a.categoria_outro ? ` (${a.categoria_outro})` : ""}</span>
                          <span>Prática: {a.participou_grupo_pratica ? "Sim" : "Não"}</span>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex gap-2 shrink-0">
                        {a.status !== "aprovado" && (
                          <ActionBtn
                            label="Aprovar" loading={isUpdating}
                            color="rgba(74,222,128," icon={<CheckCircle size={12} />}
                            onClick={() => updateStatus(a.id, "aprovado")}
                          />
                        )}
                        {a.status !== "cancelado" && (
                          <ActionBtn
                            label="Cancelar" loading={isUpdating}
                            color="rgba(239,68,68," icon={<XCircle size={12} />}
                            onClick={() => updateStatus(a.id, "cancelado")}
                          />
                        )}
                        {a.status === "cancelado" && (
                          <ActionBtn
                            label="Reabrir" loading={isUpdating}
                            color="rgba(245,158,11," icon={<Clock size={12} />}
                            onClick={() => updateStatus(a.id, "pendente")}
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Confirm force release modal */}
      {forceSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm rounded-2xl p-7"
            style={{ background: "#1A1A1A", border: "1px solid rgba(239,68,68,.25)" }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)" }}>
              <Unlock size={20} className="text-red-400" />
            </div>
            <h3 className="font-fraunces font-bold text-[#FDFBF7] mb-2" style={{ fontSize: "18px" }}>Liberar slot</h3>
            <p className="font-dm text-[13px] mb-6" style={{ color: "rgba(253,251,247,0.5)" }}>
              Isso vai <strong className="text-red-400">cancelar todos os agendamentos</strong> do slot{" "}
              <strong className="text-[#FDFBF7]">{forceSlot.data} às {forceSlot.horario}</strong> e remover as disponibilidades. Não há como desfazer.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setForceSlot(null)}
                className="flex-1 rounded-xl py-3 font-dm text-[14px]"
                style={{ background: "rgba(253,251,247,.05)", color: "rgba(253,251,247,0.5)", border: "1px solid rgba(253,251,247,.08)" }}>
                Voltar
              </button>
              <button onClick={() => forceReleaseSlot(forceSlot.data, `${forceSlot.horario}:00`)}
                className="flex-1 rounded-xl py-3 font-dm font-semibold text-[14px] text-white transition-colors"
                style={{ background: "#EF4444" }}>
                Confirmar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

// ─── Helpers UI ───────────────────────────────────────────────────────────────
function Btn({ icon, label, onClick, primary }: { icon: React.ReactNode; label: string; onClick: () => void; primary?: boolean }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-2 font-dm font-semibold text-[13px] rounded-full px-5 py-2.5 transition-colors"
      style={primary
        ? { background: "#C84B31", color: "#fff" }
        : { background: "rgba(253,251,247,.05)", color: "rgba(253,251,247,0.6)", border: "1px solid rgba(253,251,247,.1)" }
      }>
      {icon} {label}
    </button>
  );
}

function ActionBtn({ label, loading, color, icon, onClick }: { label: string; loading: boolean; color: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={loading}
      className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-dm text-[12px] font-semibold transition-colors disabled:opacity-50"
      style={{ background: `${color}.08)`, color: `${color}.9)`, border: `1px solid ${color}.2)` }}>
      {loading ? <Loader2 size={11} className="animate-spin" /> : icon}
      {label}
    </button>
  );
}
