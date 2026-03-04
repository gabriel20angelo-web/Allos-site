"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import type { SlotDisponivel } from "@/lib/supabase";

const CATEGORIAS = [
  { value: "primeira_tentativa",  label: "Processo seletivo — 1ª tentativa" },
  { value: "segunda_tentativa",   label: "Processo seletivo — 2ª tentativa ou mais" },
  { value: "reavaliacao",         label: "Já atendo na Allos e quero reavaliação" },
  { value: "testar_habilidades",  label: "Quero testar minhas habilidades clínicas" },
  { value: "omnia_acp",           label: "Faço parte da formação Omnia ACP" },
  { value: "outro",               label: "Outro" },
];

interface Props {
  day: Date;
  hour: number;
  slot: SlotDisponivel;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = "confirm" | "form" | "success";

export default function BookingForm({ day, hour, slot, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<Step>("confirm");
  const [form, setForm] = useState({
    nome_completo: "",
    telefone: "",
    participou_grupo_pratica: null as boolean | null,
    categoria: "",
    categoria_outro: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dateStr    = format(day, "yyyy-MM-dd");
  const timeStr    = `${String(hour).padStart(2, "0")}:00`;
  const displayDate = format(day, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const displayTime = `${timeStr} – ${String(hour + 1).padStart(2, "0")}:00`;
  const vagasRestantes = 2 - (slot.total_agendamentos ?? 0);

  function update(field: string, value: unknown) {
    setForm((p) => ({ ...p, [field]: value }));
    setError("");
  }

  function phone(v: string) {
    const d = v.replace(/\D/g, "");
    if (d.length <= 2)  return d;
    if (d.length <= 7)  return `(${d.slice(0,2)}) ${d.slice(2)}`;
    if (d.length <= 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7,11)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome_completo.trim()) return setError("Informe seu nome completo");
    if (form.telefone.replace(/\D/g,"").length < 10) return setError("Telefone inválido");
    if (form.participou_grupo_pratica === null) return setError("Responda sobre a prática clínica");
    if (!form.categoria) return setError("Selecione uma categoria");
    if (form.categoria === "outro" && !form.categoria_outro.trim()) return setError("Especifique a categoria");

    setLoading(true);
    setError("");

    try {
      // Verificar vagas restantes
      const { data: existing } = await supabase
        .from("agendamentos")
        .select("id")
        .eq("data", dateStr)
        .eq("horario_inicio", timeStr)
        .neq("status", "cancelado");

      if ((existing?.length ?? 0) >= 2) {
        setError("Este horário esgotou agora mesmo. Escolha outro.");
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase.from("agendamentos").insert({
        data: dateStr,
        horario_inicio: timeStr,
        nome_completo: form.nome_completo.trim(),
        telefone: form.telefone.trim(),
        participou_grupo_pratica: form.participou_grupo_pratica,
        categoria: form.categoria,
        categoria_outro: form.categoria === "outro" ? form.categoria_outro.trim() : null,
        status: "pendente",
      });

      if (insertError) throw insertError;
      setStep("success");
      setTimeout(() => onSuccess(), 3500);
    } catch (err) {
      console.error(err);
      setError("Erro ao agendar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const overlay = (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 sm:pt-16 overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
  );

  // ─── Step: confirm (aviso de irreversibilidade) ───────────────────────────
  if (step === "confirm") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md rounded-2xl overflow-hidden"
          style={{ background: "#1A1A1A", border: "1px solid rgba(253,251,247,0.1)" }}
        >
          <div className="p-7">
            {/* Ícone de aviso */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
              style={{ background: "rgba(200,75,49,.1)", border: "1px solid rgba(200,75,49,.25)" }}
            >
              <AlertTriangle size={22} className="text-[#C84B31]" />
            </div>

            <h3 className="font-fraunces font-bold text-[#FDFBF7] mb-2" style={{ fontSize: "20px" }}>
              Atenção antes de confirmar
            </h3>

            {/* Slot info */}
            <div
              className="rounded-xl px-4 py-3 mb-5"
              style={{ background: "rgba(200,75,49,.08)", border: "1px solid rgba(200,75,49,.2)" }}
            >
              <p className="font-dm font-semibold text-[#C84B31] capitalize text-sm">{displayDate}</p>
              <p className="font-dm text-[13px] mt-0.5 flex items-center gap-1.5" style={{ color: "rgba(200,75,49,0.7)" }}>
                <Clock size={12} />
                {displayTime} · {vagasRestantes} vaga{vagasRestantes > 1 ? "s" : ""} restante
              </p>
            </div>

            <ul className="space-y-3 mb-7">
              {[
                "Uma vez confirmado, seu agendamento não poderá ser alterado ou cancelado por você.",
                "Você será contatado via WhatsApp para receber a confirmação oficial.",
                "Certifique-se de que o horário escolhido é de sua total disponibilidade.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(200,75,49,.1)", border: "1px solid rgba(200,75,49,.25)" }}
                  >
                    <span className="font-dm font-bold text-[#C84B31] text-[10px]">{i + 1}</span>
                  </div>
                  <p className="font-dm text-[13px] leading-relaxed" style={{ color: "rgba(253,251,247,0.6)" }}>
                    {item}
                  </p>
                </li>
              ))}
            </ul>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl py-3 font-dm font-medium text-[14px] transition-colors"
                style={{ background: "rgba(253,251,247,0.05)", color: "rgba(253,251,247,0.5)", border: "1px solid rgba(253,251,247,0.08)" }}
              >
                Voltar
              </button>
              <motion.button
                onClick={() => setStep("form")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 rounded-xl py-3 font-dm font-semibold text-white bg-[#C84B31] hover:bg-[#A33D27] transition-colors text-[14px]"
              >
                Entendi, continuar →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Step: success ────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm rounded-2xl p-8 text-center"
          style={{ background: "#1A1A1A", border: "1px solid rgba(253,251,247,0.1)" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "rgba(45,106,79,.15)", border: "1px solid rgba(74,222,128,.3)" }}
          >
            <CheckCircle size={28} className="text-green-400" />
          </motion.div>
          <h3 className="font-fraunces font-bold text-[#FDFBF7] mb-3" style={{ fontSize: "22px" }}>
            Agendamento realizado!
          </h3>
          <p className="font-dm leading-relaxed mb-2" style={{ fontSize: "14px", color: "rgba(253,251,247,0.55)" }}>
            Sua avaliação foi registrada para{" "}
            <strong className="text-[#FDFBF7] capitalize">{displayDate}</strong> às{" "}
            <strong className="text-[#FDFBF7]">{displayTime}</strong>.
          </p>
          <p className="font-dm text-[13px]" style={{ color: "rgba(253,251,247,0.35)" }}>
            Nossa equipe entrará em contato via WhatsApp para confirmar.
          </p>
        </motion.div>
      </div>
    );
  }

  // ─── Step: form ───────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 sm:pt-12 overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg rounded-2xl overflow-hidden mb-8"
        style={{ background: "#1A1A1A", border: "1px solid rgba(253,251,247,0.1)" }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between p-6"
          style={{ borderBottom: "1px solid rgba(253,251,247,0.07)" }}
        >
          <div>
            <h3 className="font-fraunces font-bold text-[#FDFBF7]" style={{ fontSize: "20px" }}>
              Confirmar agendamento
            </h3>
            <p className="font-dm mt-1 text-[13px]" style={{ color: "rgba(253,251,247,0.4)" }}>
              Preencha seus dados para finalizar
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
            style={{ color: "rgba(253,251,247,0.4)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Slot resumo */}
        <div className="px-6 pt-5">
          <div
            className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ background: "rgba(200,75,49,.08)", border: "1px solid rgba(200,75,49,.2)" }}
          >
            <Calendar size={18} className="text-[#C84B31] flex-shrink-0" />
            <div>
              <p className="font-dm font-semibold text-[#C84B31] capitalize text-sm">{displayDate}</p>
              <p className="font-dm text-[12px] flex items-center gap-1" style={{ color: "rgba(200,75,49,0.7)" }}>
                <Clock size={11} /> {displayTime} · 1 hora
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Nome */}
          <Field label="1. Nome completo">
            <input
              type="text"
              value={form.nome_completo}
              onChange={(e) => update("nome_completo", e.target.value)}
              placeholder="Seu nome completo"
              className="allos-input"
            />
          </Field>

          {/* Telefone */}
          <Field label="2. Telefone">
            <input
              type="tel"
              value={form.telefone}
              onChange={(e) => update("telefone", phone(e.target.value))}
              placeholder="(31) 99999-9999"
              maxLength={16}
              className="allos-input"
            />
          </Field>

          {/* Prática */}
          <Field label="3. Você já participou de algum Grupo de Prática Clínica da Allos?">
            <div className="flex gap-3">
              {[true, false].map((val) => (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => update("participou_grupo_pratica", val)}
                  className="flex-1 py-3 rounded-xl font-dm font-medium text-sm transition-all"
                  style={{
                    background: form.participou_grupo_pratica === val ? "rgba(200,75,49,.15)" : "rgba(253,251,247,.04)",
                    border: form.participou_grupo_pratica === val ? "1px solid rgba(200,75,49,.4)" : "1px solid rgba(253,251,247,.08)",
                    color: form.participou_grupo_pratica === val ? "#C84B31" : "rgba(253,251,247,0.5)",
                  }}
                >
                  {val ? "Sim" : "Não"}
                </button>
              ))}
            </div>
          </Field>

          {/* Categoria */}
          <Field label="4. Em que categoria você se encaixa?">
            <div className="space-y-2">
              {CATEGORIAS.map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-start gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all"
                  style={{
                    background: form.categoria === value ? "rgba(200,75,49,.1)" : "rgba(253,251,247,.03)",
                    border: form.categoria === value ? "1px solid rgba(200,75,49,.35)" : "1px solid rgba(253,251,247,.07)",
                  }}
                >
                  <input
                    type="radio"
                    name="categoria"
                    value={value}
                    checked={form.categoria === value}
                    onChange={() => update("categoria", value)}
                    className="mt-0.5 accent-[#C84B31]"
                  />
                  <span
                    className="font-dm text-[13px] leading-snug"
                    style={{ color: form.categoria === value ? "#C84B31" : "rgba(253,251,247,0.55)" }}
                  >
                    {label}
                  </span>
                </label>
              ))}
            </div>

            {form.categoria === "outro" && (
              <input
                type="text"
                value={form.categoria_outro}
                onChange={(e) => update("categoria_outro", e.target.value)}
                placeholder="Especifique..."
                className="allos-input mt-2"
              />
            )}
          </Field>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-xl px-4 py-3"
              style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)" }}
            >
              <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
              <p className="font-dm text-[13px] text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => setStep("confirm")}
              className="flex-1 py-3 rounded-xl font-dm font-medium text-[14px] transition-colors"
              style={{ background: "rgba(253,251,247,.04)", color: "rgba(253,251,247,0.5)", border: "1px solid rgba(253,251,247,.08)" }}
            >
              Voltar
            </button>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 rounded-xl font-dm font-semibold text-white bg-[#C84B31] hover:bg-[#A33D27] transition-colors text-[14px] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Agendando...</> : "Confirmar"}
            </motion.button>
          </div>
        </form>
      </motion.div>

      <style jsx global>{`
        .allos-input {
          width: 100%;
          background: rgba(253,251,247,0.04);
          border: 1px solid rgba(253,251,247,0.1);
          border-radius: 12px;
          padding: 12px 16px;
          font-family: var(--font-dm-sans, sans-serif);
          font-size: 14px;
          color: #FDFBF7;
          outline: none;
          transition: border-color 0.2s;
        }
        .allos-input::placeholder { color: rgba(253,251,247,0.25); }
        .allos-input:focus { border-color: rgba(200,75,49,0.5); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-dm font-medium text-[13px] mb-2.5" style={{ color: "rgba(253,251,247,0.6)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
