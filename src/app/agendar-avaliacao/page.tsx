"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Loader2, AlertCircle, Calendar, Shield } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import WeeklyCalendar from "@/components/avaliallos/WeeklyCalendar";
import BookingForm from "@/components/avaliallos/BookingForm";
import { supabase } from "@/lib/supabase";
import type { SlotDisponivel } from "@/lib/supabase";

export default function AgendarAvaliacaoPage() {
  const [slots, setSlots] = useState<SlotDisponivel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ day: Date; hour: number; slot: SlotDisponivel } | null>(null);

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Buscar slots disponíveis com contagem de agendamentos
      const { data: rawSlots, error: sErr } = await supabase
        .from("slots_disponiveis")
        .select("*")
        .gte("data", new Date().toISOString().split("T")[0]);

      if (sErr) throw sErr;

      // Para cada slot, contar agendamentos ativos
      const { data: bookings, error: bErr } = await supabase
        .from("agendamentos")
        .select("data, horario_inicio")
        .gte("data", new Date().toISOString().split("T")[0])
        .neq("status", "cancelado");

      if (bErr) throw bErr;

      // Montar contagens
      const countMap: Record<string, number> = {};
      (bookings ?? []).forEach((b) => {
        const k = `${b.data}_${b.horario_inicio.substring(0, 5)}`;
        countMap[k] = (countMap[k] ?? 0) + 1;
      });

      const enriched: SlotDisponivel[] = (rawSlots ?? []).map((s) => {
        const k = `${s.data}_${s.horario_inicio.substring(0, 5)}`;
        const count = countMap[k] ?? 0;
        return { ...s, total_agendamentos: count, cheio: count >= 2 };
      });

      setSlots(enriched);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os horários. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  const disponiveis = slots.filter((s) => !s.cheio).length;

  return (
    <>
      <NavBar />
      <main
        id="main-content"
        className="min-h-screen"
        style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(200,75,49,.05) 0%, transparent 60%), #111111" }}
      >
        {/* Grain */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[.035] z-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-10 pt-32 pb-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-dm text-[12px] font-medium mb-6"
              style={{ background: "rgba(200,75,49,.1)", border: "1px solid rgba(200,75,49,.25)", color: "rgba(253,251,247,0.7)" }}
            >
              <Calendar size={13} className="text-[#C84B31]" />
              AvaliAllos · Sistema de Agendamento
            </div>

            <h1 className="font-fraunces font-bold text-[#FDFBF7] leading-tight mb-4"
              style={{ fontSize: "clamp(36px,5vw,60px)" }}>
              Agendar sua{" "}
              <span className="italic text-[#C84B31]">Avaliação</span>
            </h1>
            <p className="font-dm max-w-[520px]" style={{ fontSize: "16px", color: "rgba(253,251,247,0.5)" }}>
              Escolha um horário disponível e preencha seus dados. Você receberá a confirmação via WhatsApp.
            </p>
          </motion.div>

          {/* Info banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl px-6 py-4 mb-8"
            style={{ background: "rgba(200,75,49,.06)", border: "1px solid rgba(200,75,49,.15)" }}
          >
            <div className="flex items-start gap-3 flex-1">
              <Shield size={18} className="text-[#C84B31] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-dm font-semibold text-[#C84B31] text-[13px] mb-0.5">Como agendar</p>
                <p className="font-dm text-[13px]" style={{ color: "rgba(253,251,247,0.5)" }}>
                  Clique em um horário disponível no calendário. Cada avaliação tem duração de <strong className="text-[#FDFBF7]">1 hora</strong> e cada slot comporta até <strong className="text-[#FDFBF7]">2 participantes</strong>.
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0"
              style={{ background: "rgba(253,251,247,.04)", border: "1px solid rgba(253,251,247,.08)" }}
            >
              <span className="font-dm font-bold text-[#C84B31]">{loading ? "—" : disponiveis}</span>
              <span className="font-dm text-[12px]" style={{ color: "rgba(253,251,247,0.4)" }}>
                vaga{disponiveis !== 1 ? "s" : ""} disponível{disponiveis !== 1 ? "is" : ""}
              </span>
              <button onClick={fetchSlots} className="ml-1 hover:text-[#C84B31] transition-colors" style={{ color: "rgba(253,251,247,0.3)" }}>
                <RefreshCw size={13} />
              </button>
            </div>
          </motion.div>

          {/* Calendário */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 size={28} className="animate-spin text-[#C84B31] mb-3" />
                <p className="font-dm text-[14px]" style={{ color: "rgba(253,251,247,0.4)" }}>Carregando horários...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 rounded-2xl"
                style={{ background: "rgba(239,68,68,.05)", border: "1px solid rgba(239,68,68,.15)" }}>
                <AlertCircle size={28} className="text-red-400 mb-3" />
                <p className="font-dm text-[14px] text-red-400 mb-4">{error}</p>
                <button onClick={fetchSlots} className="flex items-center gap-2 font-dm font-semibold text-[13px] text-white bg-[#C84B31] rounded-full px-5 py-2.5 hover:bg-[#A33D27] transition-colors">
                  <RefreshCw size={14} /> Tentar novamente
                </button>
              </div>
            ) : (
              <WeeklyCalendar
                mode="booking"
                slots={slots}
                onSlotClick={(day, hour, slot) => setSelectedSlot({ day, hour, slot })}
              />
            )}
          </motion.div>
        </div>
      </main>
      <Footer />

      {/* Modal */}
      {selectedSlot && (
        <BookingForm
          day={selectedSlot.day}
          hour={selectedSlot.hour}
          slot={selectedSlot.slot}
          onClose={() => setSelectedSlot(null)}
          onSuccess={() => { setSelectedSlot(null); fetchSlots(); }}
        />
      )}
    </>
  );
}
