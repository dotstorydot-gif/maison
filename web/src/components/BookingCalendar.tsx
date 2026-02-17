"use client";

import { useState, useMemo } from "react";
import {
    Calendar as CalendarIcon, Clock, ArrowLeft,
    ChevronRight, ChevronLeft, CalendarDays
} from "lucide-react";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
    "05:00 PM", "06:00 PM", "07:00 PM"
];

interface BookingCalendarProps {
    onBack: () => void;
    onSelect: (date: string, time: string) => void;
    serviceName: string;
}

export default function BookingCalendar({ onBack, onSelect, serviceName }: BookingCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>("");

    const calendarDays = useMemo(() => {
        const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

        // Get day of week for the 1st (0=Sun, 1=Mon, ...)
        const firstDayIndex = startOfMonth.getDay();

        const days = [];

        // Padding for previous month
        for (let i = 0; i < (firstDayIndex === 0 ? 6 : firstDayIndex - 1); i++) {
            days.push(null);
        }

        // Days of current month
        for (let i = 1; i <= endOfMonth.getDate(); i++) {
            days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
        }

        return days;
    }, [currentMonth]);

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const prevMonth = () => {
        const now = new Date();
        if (currentMonth.getMonth() === now.getMonth() && currentMonth.getFullYear() === now.getFullYear()) return;
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isSelected = (date: Date) => {
        if (!selectedDate) return false;
        return date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();
    };

    const isPast = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const handleContinue = () => {
        if (selectedDate && selectedTime) {
            onSelect(selectedDate.toISOString().split('T')[0], selectedTime);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Date Selection Grid */}
                <div className="glass p-10 rounded-[2.5rem] space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />

                    <div className="flex items-center justify-between mb-2 relative">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <CalendarDays className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight">Select Date</h3>
                                <p className="text-primary/40 text-[9px] font-black uppercase tracking-widest">
                                    {currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                            <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center relative">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                            <div key={i} className="text-[10px] font-black text-primary/30 py-2">{d}</div>
                        ))}
                        {calendarDays.map((date, i) => {
                            if (!date) return <div key={`empty-${i}`} className="p-3" />;
                            const past = isPast(date);
                            const active = isSelected(date);
                            return (
                                <button
                                    key={date.toISOString()}
                                    disabled={past}
                                    onClick={() => setSelectedDate(date)}
                                    className={cn(
                                        "p-3 rounded-xl text-xs font-black transition-all duration-300 relative group",
                                        past ? "text-primary/10 cursor-not-allowed" :
                                            active ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" :
                                                "hover:bg-primary/10 text-white/80 hover:text-primary"
                                    )}
                                >
                                    {date.getDate()}
                                    {isToday(date) && !active && (
                                        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_5px_rgba(152,99,90,1)]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                        <p className="text-[11px] font-bold text-primary/60 italic leading-relaxed">
                            {selectedDate
                                ? `Booking for ${selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}`
                                : "Please select a date from the calendar"}
                        </p>
                    </div>
                </div>

                {/* Time Selection */}
                <div className="glass p-10 rounded-[2.5rem] space-y-8 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full -ml-16 -mb-16 blur-3xl opacity-50" />

                    <div className="flex items-center gap-4 relative">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tight">Available Time</h3>
                            <p className="text-primary/40 text-[10px] font-black uppercase tracking-widest">Select an appointment slot</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 relative">
                        {TIME_SLOTS.map((time) => (
                            <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={cn(
                                    "p-4 rounded-2xl border-2 font-black text-[10px] tracking-widest uppercase transition-all duration-300",
                                    selectedTime === time
                                        ? "bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105"
                                        : "border-white/5 bg-white/5 hover:border-primary/30 text-primary/60 hover:text-primary"
                                )}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6">
                <button
                    onClick={onBack}
                    className="text-primary/40 hover:text-primary transition-colors flex items-center gap-2 font-black text-[10px] uppercase tracking-widest group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Selection
                </button>

                <button
                    disabled={!selectedDate || !selectedTime}
                    onClick={handleContinue}
                    className="w-full md:w-auto bg-primary disabled:opacity-30 hover:bg-primary/90 text-white px-20 py-6 rounded-2xl font-black tracking-[0.2em] uppercase text-xs shadow-2xl shadow-primary/20 transition-all flex items-center justify-center gap-4 group"
                >
                    Finalize Details
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
