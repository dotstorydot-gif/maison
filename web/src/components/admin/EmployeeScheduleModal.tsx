"use client";

import { useState, useEffect, useCallback } from 'react';
import { X, Clock, Save, Calendar } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Availability {
    id?: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_working: boolean;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function EmployeeScheduleModal({
    isOpen,
    onClose,
    employeeId,
    employeeName
}: {
    isOpen: boolean;
    onClose: () => void;
    employeeId: string;
    employeeName: string;
}) {
    const [schedule, setSchedule] = useState<Availability[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchSchedule = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase
            .from('availability')
            .select('*')
            .eq('employee_id', employeeId)
            .order('day_of_week');

        // Initialize with default 9-5 if no schedule exists
        const fullSchedule = DAYS.map((_, index) => {
            const existing = data?.find(d => d.day_of_week === index);
            return existing || {
                day_of_week: index,
                start_time: '09:00',
                end_time: '17:00',
                is_working: index !== 0 // Default Sunday off
            };
        });

        setSchedule(fullSchedule);
        setLoading(false);
    }, [employeeId]);

    useEffect(() => {
        if (isOpen && employeeId) {
            fetchSchedule();
        }
    }, [isOpen, employeeId, fetchSchedule]);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Upsert all days
            for (const day of schedule) {
                const payload = {
                    employee_id: employeeId,
                    day_of_week: day.day_of_week,
                    start_time: day.start_time,
                    end_time: day.end_time,
                    is_working: day.is_working
                };

                if (day.id) {
                    await supabase.from('availability').update(payload).eq('id', day.id);
                } else {
                    await supabase.from('availability').insert([payload]);
                }
            }
            alert('Schedule updated successfully!');
            onClose();
        } catch (error) {
            console.error('Error saving schedule:', error);
            alert('Failed to save schedule.');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                <header className="px-8 py-6 border-b border-secondary flex justify-between items-center bg-secondary/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-primary uppercase tracking-widest">Technician Schedule</h2>
                            <p className="text-xs font-bold text-primary/40 uppercase tracking-[0.2em]">{employeeName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-secondary/20 rounded-full transition-colors">
                        <X className="w-6 h-6 text-primary" />
                    </button>
                </header>

                <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto">
                    {loading ? (
                        <div className="py-20 text-center opacity-20">Loading Schedule...</div>
                    ) : (
                        schedule.map((day, idx) => (
                            <div key={idx} className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all ${day.is_working ? 'bg-white border-secondary/50' : 'bg-secondary/5 border-transparent opacity-60'}`}>
                                <div className="flex items-center gap-6 min-w-[120px]">
                                    <div
                                        onClick={() => {
                                            const next = [...schedule];
                                            next[idx].is_working = !next[idx].is_working;
                                            setSchedule(next);
                                        }}
                                        className={`w-14 h-7 rounded-full relative transition-all cursor-pointer ${day.is_working ? 'bg-primary' : 'bg-primary/20'}`}
                                    >
                                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${day.is_working ? 'left-8' : 'left-1'}`} />
                                    </div>
                                    <span className="font-black text-sm uppercase tracking-widest">{DAYS[day.day_of_week]}</span>
                                </div>

                                {day.is_working ? (
                                    <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-primary/20" />
                                            <input
                                                type="time"
                                                value={day.start_time.substring(0, 5)}
                                                onChange={(e) => {
                                                    const next = [...schedule];
                                                    next[idx].start_time = e.target.value;
                                                    setSchedule(next);
                                                }}
                                                className="bg-secondary/10 px-3 py-2 rounded-xl text-sm font-bold border-none outline-none focus:bg-secondary/20 transition-colors"
                                            />
                                        </div>
                                        <span className="text-primary/20 font-black">—</span>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="time"
                                                value={day.end_time.substring(0, 5)}
                                                onChange={(e) => {
                                                    const next = [...schedule];
                                                    next[idx].end_time = e.target.value;
                                                    setSchedule(next);
                                                }}
                                                className="bg-secondary/10 px-3 py-2 rounded-xl text-sm font-bold border-none outline-none focus:bg-secondary/20 transition-colors"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/20 pr-4 italic">Off Duty</span>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <footer className="p-8 bg-secondary/5 border-t border-secondary flex gap-4">
                    <button
                        onClick={onClose}
                        className="px-8 py-4 text-primary text-xs font-black uppercase tracking-widest hover:bg-secondary/10 rounded-2xl transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                        {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Schedule</>}
                    </button>
                </footer>
            </div>
        </div>
    );
}
