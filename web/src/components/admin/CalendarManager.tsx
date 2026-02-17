"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Users, LayoutGrid, List } from "lucide-react";
import { createClient } from '@supabase/supabase-js';
import { cn } from "@/lib/utils";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Appointment {
    id: string;
    customer_id: string;
    employee_id: string;
    appointment_date: string;
    appointment_time: string;
    status: string;
    total_amount: number;
    customers: { full_name: string };
    employees: { full_name: string };
    appointment_services: {
        services: { name: string, price: number }
    }[];
}

export default function CalendarManager() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [view, setView] = useState<'day' | 'month'>('day');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true);
            const dateStr = selectedDate.toISOString().split('T')[0];
            const { data } = await supabase
                .from('appointments')
                .select(`
                    *,
                    customers(full_name),
                    employees(full_name),
                    appointment_services(
                        services(name, price)
                    )
                `)
                .eq('appointment_date', dateStr)
                .order('appointment_time');

            if (data) setAppointments(data as any);
            setLoading(false);
        };
        fetchAppointments();
    }, [selectedDate]);

    const nextDay = () => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1));
    const prevDay = () => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 1));
    const nextMonth = () => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
    const prevMonth = () => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
        return days;
    };

    const hours = Array.from({ length: 12 }, (_, i) => i + 9);

    return (
        <div className="space-y-8 animate-in pb-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight uppercase tracking-widest">Master Calendar</h2>
                    <p className="text-primary/40 text-sm font-medium">Coordinate your team and appointments</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-white border border-secondary rounded-xl p-1">
                        <button
                            onClick={() => setView('day')}
                            className={cn("px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all", view === 'day' ? "bg-primary text-white shadow-md shadow-primary/20" : "text-primary/40 hover:text-primary")}
                        >
                            <List className="w-4 h-4 md:hidden" />
                            <span className="hidden md:block">Day View</span>
                        </button>
                        <button
                            onClick={() => setView('month')}
                            className={cn("px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all", view === 'month' ? "bg-primary text-white shadow-md shadow-primary/20" : "text-primary/40 hover:text-primary")}
                        >
                            <LayoutGrid className="w-4 h-4 md:hidden" />
                            <span className="hidden md:block">Month View</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-4 bg-white border border-secondary p-1 rounded-xl">
                        <button onClick={view === 'day' ? prevDay : prevMonth} className="p-2 hover:bg-secondary/10 rounded-lg transition-all"><ChevronLeft className="w-5 h-5 text-primary" /></button>
                        <div className="px-2 font-black text-sm uppercase tracking-widest text-primary min-w-[140px] text-center">
                            {view === 'day'
                                ? selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                : selectedDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
                            }
                        </div>
                        <button onClick={view === 'day' ? nextDay : nextMonth} className="p-2 hover:bg-secondary/10 rounded-lg transition-all"><ChevronRight className="w-5 h-5 text-primary" /></button>
                    </div>
                </div>
            </header>
            {loading ? (
                <div className="p-20 flex flex-col items-center justify-center opacity-20 bg-white rounded-3xl border border-secondary">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="font-black uppercase tracking-widest text-xs">Loading Master Schedule...</p>
                </div>
            ) : view === 'day' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 bg-white rounded-3xl border border-secondary shadow-sm overflow-hidden">
                        <div className="divide-y divide-secondary/5">
                            {hours.map(hour => {
                                const timeStr = `${hour.toString().padStart(2, '0')}:00`;
                                const hourApt = appointments.find(a => a.appointment_time.startsWith(timeStr.slice(0, 2)));

                                return (
                                    <div key={hour} className="flex min-h-[80px] group">
                                        <div className="w-20 border-r border-secondary/10 p-4 text-center">
                                            <span className="text-xs font-black text-primary/30 uppercase">{hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'PM' : 'AM'}</span>
                                        </div>
                                        <div className="flex-1 p-2 relative">
                                            {hourApt ? (
                                                <div className="h-full w-full bg-primary/10 border-l-4 border-l-primary rounded-xl p-3 animate-in flex justify-between items-center group/card hover:bg-primary/15 transition-all cursor-pointer">
                                                    <div>
                                                        <div className="font-black text-sm text-primary">{hourApt.customers?.full_name}</div>
                                                        <div className="text-xs font-bold text-primary/40 uppercase tracking-wider">
                                                            {hourApt.appointment_services?.length > 1
                                                                ? `${hourApt.appointment_services[0].services.name} + ${hourApt.appointment_services.length - 1} more`
                                                                : hourApt.appointment_services?.[0]?.services?.name || 'No services'}
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex items-center gap-4">
                                                        <div className="hidden sm:block">
                                                            <div className="text-[10px] font-black text-primary/20 uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
                                                                <Users className="w-3 h-3" />
                                                                {hourApt.employees?.full_name || 'Unassigned'}
                                                            </div>
                                                            <div className="text-sm font-black text-primary">£{hourApt.total_amount || 0}</div>
                                                        </div>
                                                        <div className="px-3 py-1 bg-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm border border-primary/5">Confirmed</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-full w-full border-2 border-dashed border-secondary/10 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                                    <button className="text-[10px] font-black text-primary/20 uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-colors">
                                                        <Plus className="w-3 h-3" />
                                                        Add Booking
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-secondary shadow-sm">
                            <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6 pb-4 border-b border-secondary">Shift Management</h3>
                            <div className="text-center py-8 opacity-20 italic text-[10px] font-black uppercase tracking-widest underline decoration-primary/20">
                                Staff Scheduling Module Coming Soon
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-secondary shadow-sm p-8 animate-in">
                    <div className="grid grid-cols-7 gap-4 mb-8">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <div key={day} className="text-center text-[10px] font-black text-primary/30 uppercase tracking-widest">{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-px bg-secondary/10 border border-secondary/10 rounded-2xl overflow-hidden">
                        {getDaysInMonth(selectedDate).map((day, i) => (
                            <div key={i}
                                onClick={() => { if (day) { setSelectedDate(day); setView('day'); } }}
                                className={cn(
                                    "min-h-[120px] bg-white p-4 transition-all flex flex-col items-start gap-2",
                                    day ? "hover:bg-secondary/5 cursor-pointer" : "opacity-20",
                                    day?.toDateString() === selectedDate.toDateString() ? "bg-primary/5" : ""
                                )}>
                                {day && (
                                    <>
                                        <span className={cn("text-xs font-bold", day.toDateString() === new Date().toDateString() ? "w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center -ml-1" : "text-primary")}>
                                            {day.getDate()}
                                        </span>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
