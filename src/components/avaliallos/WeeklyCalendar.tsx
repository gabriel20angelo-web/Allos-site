"use client";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import {
  startOfWeek, endOfWeek, addWeeks, subWeeks,
  eachDayOfInterval, format, isToday, isBefore, startOfDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { SlotDisponivel, Disponibilidade } from "@/lib/supabase";

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 7h–19h

// ─── BOOKING mode (público) ───────────────────────────────────────────────────
interface BookingProps {
  mode: "booking";
  slots: SlotDisponivel[];
  onSlotClick: (day: Date, hour: number, slot: SlotDisponivel) => void;
}

// ─── MANAGER mode (avaliador) ─────────────────────────────────────────────────
interface ManagerProps {
  mode: "manager";
  mySlots: Disponibilidade[];
  allSlots: SlotDisponivel[];
  onToggle: (day: Date, hour: number) => void;
  actionLoading: string | null;
}

type Props = BookingProps | ManagerProps;

// ─── helpers ──────────────────────────────────────────────────────────────────
function dayKey(day: Date, hour: number) {
  return `${format(day, "yyyy-MM-dd")}_${String(hour).padStart(2, "0")}:00`;
}

// ─── Cell components ─────────────────────────────────────────────────────────
function BookingCell({
  slot, hour, onClick,
}: { slot: SlotDisponivel | null; hour: number; onClick: () => void }) {
  const label = `${String(hour).padStart(2, "0")}:00`;

  if (!slot) return <div className="w-full h-full" />;

  const vagas = 2 - (slot.total_agendamentos ?? 0);
  const isFull = vagas <= 0;

  if (isFull) {
    return (
      <div
        className="w-full h-full rounded-lg flex flex-col justify-center px-2 py-1.5"
        style={{ background: "rgba(253,251,247,0.04)", border: "1px solid rgba(253,251,247,0.06)" }}
      >
        <span className="font-dm text-[11px] font-medium" style={{ color: "rgba(253,251,247,0.3)" }}>{label}</span>
        <span className="font-dm text-[10px]" style={{ color: "rgba(253,251,247,0.2)" }}>Esgotado</span>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full h-full rounded-lg flex flex-col justify-center px-2 py-1.5 text-left transition-all duration-200 hover:scale-[1.02] group"
      style={{
        background: "rgba(200,75,49,.1)",
        border: "1px solid rgba(200,75,49,.3)",
      }}
    >
      <span className="font-dm text-[11px] font-semibold text-[#C84B31]">{label}</span>
      <span className="font-dm text-[10px]" style={{ color: "rgba(200,75,49,0.7)" }}>
        {vagas}/2 {vagas === 1 ? "vaga" : "vagas"}
      </span>
      {slot.total_avaliadores > 0 && (
        <span className="font-dm text-[9px] mt-0.5 flex items-center gap-0.5" style={{ color: "rgba(253,251,247,0.3)" }}>
          <Users size={9} />
          {slot.total_avaliadores} avaliador{slot.total_avaliadores > 1 ? "es" : ""}
        </span>
      )}
    </button>
  );
}

function ManagerCell({
  isMine, slot, hour, isPast, onClick, isLoading,
}: {
  isMine: boolean; slot: SlotDisponivel | null; hour: number;
  isPast: boolean; onClick: () => void; isLoading: boolean;
}) {
  const label = `${String(hour).padStart(2, "0")}:00`;
  const hasBooking = (slot?.total_agendamentos ?? 0) > 0;

  if (isPast) {
    return <div className="w-full h-full rounded-lg" style={{ background: "rgba(253,251,247,0.02)" }} />;
  }

  if (isMine) {
    return (
      <button
        onClick={onClick}
        disabled={isLoading}
        title={hasBooking ? "Há agendamentos neste slot" : "Remover disponibilidade"}
        className="w-full h-full rounded-lg flex flex-col justify-center px-2 py-1.5 text-left transition-all disabled:opacity-50"
        style={{
          background: "rgba(200,75,49,.2)",
          border: "1px solid rgba(200,75,49,.5)",
        }}
      >
        <span className="font-dm text-[11px] font-bold text-[#C84B31]">{label}</span>
        <span className="font-dm text-[10px]" style={{ color: "rgba(200,75,49,0.7)" }}>
          {isLoading ? "..." : hasBooking ? `${slot!.total_agendamentos} ag.` : "Meu slot"}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="w-full h-full rounded-lg flex flex-col justify-center px-2 py-1.5 text-left transition-all hover:opacity-80 disabled:opacity-50"
      style={{ background: "rgba(253,251,247,0.03)", border: "1px solid rgba(253,251,247,0.07)" }}
    >
      <span className="font-dm text-[11px]" style={{ color: "rgba(253,251,247,0.35)" }}>
        {isLoading ? "..." : label}
      </span>
      {slot && slot.total_avaliadores > 0 && (
        <span className="font-dm text-[10px]" style={{ color: "rgba(253,251,247,0.2)" }}>
          +{slot.total_avaliadores}
        </span>
      )}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function WeeklyCalendar(props: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd   = endOfWeek(currentDate,   { weekStartsOn: 1 });
  const weekDays  = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Build maps
  const slotMap = useMemo(() => {
    const map: Record<string, SlotDisponivel> = {};
    const source = props.mode === "booking" ? props.slots : props.allSlots;
    source.forEach((s) => {
      const k = `${s.data}_${s.horario_inicio.substring(0, 5)}`;
      map[k] = s;
    });
    return map;
  }, [props]);

  const mySlotMap = useMemo(() => {
    if (props.mode !== "manager") return {};
    const map: Record<string, boolean> = {};
    props.mySlots.forEach((s) => {
      const k = `${s.data}_${s.horario_inicio.substring(0, 5)}`;
      map[k] = true;
    });
    return map;
  }, [props]);

  const headerBg = "#161616";
  const borderColor = "rgba(253,251,247,0.06)";

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${borderColor}`, background: "#141414" }}
    >
      {/* Week navigation */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ background: headerBg, borderBottom: `1px solid ${borderColor}` }}
      >
        <button
          onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
          style={{ color: "rgba(253,251,247,0.5)" }}
        >
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <p className="font-fraunces font-bold text-[#FDFBF7]" style={{ fontSize: "15px" }}>
            {format(weekStart, "d 'de' MMMM", { locale: ptBR })} —{" "}
            {format(weekEnd, "d 'de' MMMM", { locale: ptBR })}
          </p>
          <p className="font-dm text-[11px] mt-0.5" style={{ color: "rgba(253,251,247,0.3)" }}>
            {format(weekStart, "yyyy")}
          </p>
        </div>
        <button
          onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
          style={{ color: "rgba(253,251,247,0.5)" }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[680px]">
          {/* Day headers */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: "64px repeat(7, 1fr)",
              borderBottom: `1px solid ${borderColor}`,
              background: headerBg,
            }}
          >
            <div />
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className="py-3 text-center"
                style={{ borderLeft: `1px solid ${borderColor}` }}
              >
                <p className="font-dm text-[10px] tracking-widest uppercase" style={{ color: "rgba(253,251,247,0.35)" }}>
                  {format(day, "EEE", { locale: ptBR })}
                </p>
                <p
                  className={`font-fraunces font-bold mt-1 ${isToday(day) ? "text-[#C84B31]" : "text-[#FDFBF7]"}`}
                  style={{ fontSize: "18px" }}
                >
                  {format(day, "d")}
                </p>
              </div>
            ))}
          </div>

          {/* Time rows */}
          <div className="max-h-[500px] overflow-y-auto">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="grid"
                style={{
                  gridTemplateColumns: "64px repeat(7, 1fr)",
                  borderBottom: `1px solid ${borderColor}`,
                }}
              >
                <div className="flex items-center justify-end pr-3 py-1">
                  <span className="font-dm text-[11px]" style={{ color: "rgba(253,251,247,0.25)" }}>
                    {String(hour).padStart(2, "0")}:00
                  </span>
                </div>

                {weekDays.map((day) => {
                  const k = dayKey(day, hour);
                  const slot = slotMap[k] ?? null;
                  const isPast = isBefore(day, startOfDay(today)) && !isToday(day);
                  const isLoading = props.mode === "manager" && props.actionLoading === k;

                  return (
                    <div
                      key={`${day.toISOString()}_${hour}`}
                      className="p-1 min-h-[52px]"
                      style={{ borderLeft: `1px solid ${borderColor}` }}
                    >
                      {props.mode === "booking" ? (
                        isPast ? null : (
                          <BookingCell
                            slot={slot}
                            hour={hour}
                            onClick={() => slot && !slot.cheio && (props as BookingProps).onSlotClick(day, hour, slot)}
                          />
                        )
                      ) : (
                        <ManagerCell
                          isMine={!!mySlotMap[k]}
                          slot={slot}
                          hour={hour}
                          isPast={isPast}
                          isLoading={isLoading}
                          onClick={() => (props as ManagerProps).onToggle(day, hour)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div
        className="flex flex-wrap items-center gap-5 px-5 py-3"
        style={{ background: headerBg, borderTop: `1px solid ${borderColor}` }}
      >
        {props.mode === "booking" ? (
          <>
            <LegendItem color="rgba(200,75,49,.2)" border="rgba(200,75,49,.4)" label="Disponível" />
            <LegendItem color="rgba(253,251,247,.04)" border="rgba(253,251,247,.08)" label="Esgotado" />
          </>
        ) : (
          <>
            <LegendItem color="rgba(200,75,49,.2)" border="rgba(200,75,49,.5)" label="Meu slot" />
            <LegendItem color="rgba(253,251,247,.03)" border="rgba(253,251,247,.07)" label="Clique para adicionar" />
          </>
        )}
      </div>
    </div>
  );
}

function LegendItem({ color, border, label }: { color: string; border: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded" style={{ background: color, border: `1px solid ${border}` }} />
      <span className="font-dm text-[11px]" style={{ color: "rgba(253,251,247,0.4)" }}>{label}</span>
    </div>
  );
}
