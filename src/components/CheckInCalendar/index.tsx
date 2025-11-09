"use client";

import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

import { Card } from "@/components/ui/card";

interface CheckInData {
  date: Date;
  time?: string;
  status?: "present" | "absent" | "late";
}

interface CheckInCalendarProps {
  checkIns?: CheckInData[];
  onDateClick?: (date: Date) => void;
  showLegend?: boolean;
}

export default function CheckInCalendar({
  checkIns = [],
  onDateClick,
  showLegend = true,
}: CheckInCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const getCheckInForDay = (day: number) => {
    return checkIns.find((checkIn) => {
      const checkInDate = new Date(checkIn.date);
      return (
        checkInDate.getDate() === day &&
        checkInDate.getMonth() === currentDate.getMonth() &&
        checkInDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const handleDayClick = (day: number) => {
    if (onDateClick) {
      const clickedDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day,
      );
      onDateClick(clickedDate);
    }
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          style={{ minHeight: "48px", height: "48px" }}
        />,
      );
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const checkIn = getCheckInForDay(day);
      const today = isToday(day);

      days.push(
        <button
          key={day}
          onClick={() => handleDayClick(day)}
          className={`group preserve-3d relative rounded-md transition-all duration-500 ${
            today
              ? "scale-105 bg-linear-to-br from-[#C2A537] to-[#D4B547] font-bold text-black shadow-lg shadow-[#C2A537]/50"
              : "bg-slate-800/40 hover:bg-slate-700/60"
          } ${
            checkIn
              ? checkIn.status === "present"
                ? "bg-green-900/40 shadow-lg ring-2 shadow-green-500/30 ring-green-400/80"
                : checkIn.status === "late"
                  ? "bg-yellow-900/40 shadow-lg ring-2 shadow-yellow-500/30 ring-yellow-400/80"
                  : "bg-red-900/40 shadow-lg ring-2 shadow-red-500/30 ring-red-400/80"
              : ""
          } transform-gpu hover:shadow-2xl hover:shadow-[#C2A537]/50 active:scale-95 ${onDateClick ? "cursor-pointer" : "cursor-default"} `}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
            minHeight: "48px",
            height: "48px",
          }}
        >
          {/* Face frontal do cubo */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 rounded-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-y-12"
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            <span
              className={`text-xs font-bold lg:text-sm ${today ? "text-black" : checkIn ? "text-white" : "text-slate-300"}`}
            >
              {day}
            </span>
            {checkIn && (
              <div
                className={`h-2 w-2 animate-pulse rounded-full lg:h-2.5 lg:w-2.5 ${
                  checkIn.status === "present"
                    ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]"
                    : checkIn.status === "late"
                      ? "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]"
                      : "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]"
                }`}
              />
            )}
          </div>

          {/* Efeito 3D - Sombra do cubo */}
          <div
            className="absolute inset-0 -z-10 rounded-md bg-black/40 opacity-0 blur-md transition-all duration-500 group-hover:translate-y-2 group-hover:opacity-100"
            style={{
              transform: "translateZ(-20px)",
            }}
          />

          {/* Lado direito do cubo */}
          <div
            className="absolute top-0 right-0 h-full w-1 rounded-r-md bg-linear-to-b from-[#C2A537]/30 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100"
            style={{
              transform: "rotateY(90deg) translateZ(0px)",
              transformOrigin: "right",
            }}
          />

          {/* Lado inferior do cubo */}
          <div
            className="absolute bottom-0 left-0 h-1 w-full rounded-b-md bg-linear-to-r from-transparent via-[#C2A537]/30 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100"
            style={{
              transform: "rotateX(90deg) translateZ(0px)",
              transformOrigin: "bottom",
            }}
          />

          {/* Brilho 3D */}
          <div className="absolute inset-0 rounded-md bg-linear-to-br from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Tooltip on hover */}
          {checkIn && (
            <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 scale-0 rounded-lg bg-black/90 px-3 py-2 text-xs text-white opacity-0 shadow-xl transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
              {checkIn.time && <p className="font-semibold">{checkIn.time}</p>}
              <p className="capitalize">
                {checkIn.status === "present"
                  ? "Presente"
                  : checkIn.status === "late"
                    ? "Atrasado"
                    : "Ausente"}
              </p>
              <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-4 border-transparent border-t-black/90" />
            </div>
          )}
        </button>,
      );
    }

    return days;
  };

  return (
    <Card className="flex h-full flex-col border-[#C2A537]/40 bg-linear-to-br from-black/90 to-slate-900/90 p-4 backdrop-blur-sm lg:p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="rounded-lg bg-[#C2A537]/20 p-2">
            <CalendarIcon className="h-4 w-4 text-[#C2A537] lg:h-5 lg:w-5" />
          </div>
          <h3 className="text-lg font-bold text-[#C2A537] lg:text-xl">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
        </div>

        <div className="flex gap-2">
          <button
            onClick={previousMonth}
            className="group rounded-lg bg-slate-800/60 p-2 transition-all duration-300 hover:bg-[#C2A537]/20 hover:shadow-lg hover:shadow-[#C2A537]/20"
          >
            <ChevronLeft className="h-5 w-5 text-slate-400 transition-colors group-hover:text-[#C2A537]" />
          </button>
          <button
            onClick={nextMonth}
            className="group rounded-lg bg-slate-800/60 p-2 transition-all duration-300 hover:bg-[#C2A537]/20 hover:shadow-lg hover:shadow-[#C2A537]/20"
          >
            <ChevronRight className="h-5 w-5 text-slate-400 transition-colors group-hover:text-[#C2A537]" />
          </button>
        </div>
      </div>

      {/* Week Days */}
      <div className="mb-1.5 grid grid-cols-7 gap-0.5 lg:mb-2 lg:gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-[#C2A537]/80"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div
        className="perspective-1000 grid grid-cols-7 gap-0.5 lg:gap-1"
        style={{ perspective: "1000px" }}
      >
        {renderCalendarDays()}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 border-t border-[#C2A537]/20 pt-3 lg:gap-4 lg:pt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-linear-to-br from-[#C2A537] to-[#D4B547] shadow-lg shadow-[#C2A537]/50" />
            <span className="text-xs text-slate-400">Hoje</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
            <span className="text-xs text-slate-400">Presente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50" />
            <span className="text-xs text-slate-400">Atrasado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
            <span className="text-xs text-slate-400">Falta</span>
          </div>
        </div>
      )}
    </Card>
  );
}
