"use client";
import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { startOfWeek, endOfWeek, format } from "date-fns";
import { supabase } from "@/lib/supabase";
import WeeklyCalendar from "./WeeklyCalendar";
import type { Disponibilidade, SlotDisponivel } from "@/lib/supabase";

interface Props {
  avaliadorId: string;
  avaliadorNome: string;
}

export default function SlotManager({ avaliadorId, avaliadorNome }: Props) {
  const [currentDate] = useState(new Date());
  const [mySlots, setMySlots] = useState<Disponibilidade[]>([]);
  const [allSlots, setAllSlots] = useState<SlotDisponivel[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd   = endOfWeek(currentDate,   { weekStartsOn: 1 });
    const startStr  = format(weekStart, "yyyy-MM-dd");
    const endStr    = format(weekEnd,   "yyyy-MM-dd");

    const [{ data: mine }, { data: all }] = await Promise.all([
      supabase.from("disponibilidades").select("*").eq("avaliador_id", avaliadorId).gte("data", startStr).lte("data", endStr),
      supabase.from("slots_disponiveis").select("*").gte("data", startStr).lte("data", endStr),
    ]);

    setMySlots(mine ?? []);
    setAllSlots(all ?? []);
    setLoading(false);
  }, [avaliadorId, currentDate]);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  async function handleToggle(day: Date, hour: number) {
    const dateStr = format(day, "yyyy-MM-dd");
    const timeStr = `${String(hour).padStart(2, "0")}:00`;
    const key     = `${dateStr}_${timeStr}`;
    const existing = mySlots.find((s) => s.data === dateStr && s.horario_inicio === timeStr);

    setActionLoading(key);

    if (existing) {
      // Verificar agendamentos antes de remover
      const { data: agendamentos } = await supabase
        .from("agendamentos")
        .select("id")
        .eq("data", dateStr)
        .eq("horario_inicio", timeStr)
        .neq("status", "cancelado");

      if ((agendamentos?.length ?? 0) > 0) {
        alert(`Não é possível remover este slot: há ${agendamentos!.length} agendamento(s) ativo(s). Contate o administrador se precisar liberar.`);
        setActionLoading(null);
        return;
      }

      await supabase.from("disponibilidades").delete().eq("id", existing.id);
    } else {
      await supabase.from("disponibilidades").insert({ avaliador_id: avaliadorId, data: dateStr, horario_inicio: timeStr });
    }

    await fetchSlots();
    setActionLoading(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#C84B31]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-dm text-[13px]" style={{ color: "rgba(253,251,247,0.4)" }}>
          Clique para adicionar ou remover seus horários disponíveis.
        </p>
        <button
          onClick={fetchSlots}
          className="flex items-center gap-1.5 font-dm text-[12px] transition-colors hover:text-[#C84B31]"
          style={{ color: "rgba(253,251,247,0.4)" }}
        >
          <RefreshCw size={13} /> Atualizar
        </button>
      </div>

      <WeeklyCalendar
        mode="manager"
        mySlots={mySlots}
        allSlots={allSlots}
        onToggle={handleToggle}
        actionLoading={actionLoading}
      />
    </div>
  );
}
