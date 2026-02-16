"use client";

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Mail, Phone, X, Trash2, Camera, Calendar } from "lucide-react";
import { createClient } from '@supabase/supabase-js';
import EmployeeScheduleModal from './EmployeeScheduleModal';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Employee {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    is_active: boolean;
    photo_url?: string;
}

export default function EmployeeManager() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [formData, setFormData] = useState<Partial<Employee>>({
        full_name: '',
        email: '',
        phone: '',
        is_active: true
    });

    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [scheduleEmployee, setScheduleEmployee] = useState<Employee | null>(null);

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase.from('employees').select('*').order('full_name');
        if (data) setEmployees(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const handleAdd = () => {
        setEditingEmployee(null);
        setFormData({
            full_name: '',
            email: '',
            phone: '',
            is_active: true
        });
        setIsModalOpen(true);
    };

    const handleEdit = (emp: Employee) => {
        setEditingEmployee(emp);
        setFormData(emp);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingEmployee) {
            const { error } = await supabase
                .from('employees')
                .update(formData)
                .eq('id', editingEmployee.id);
            if (!error) fetchEmployees();
        } else {
            const { error } = await supabase
                .from('employees')
                .insert([formData]);
            if (!error) fetchEmployees();
        }
        setIsModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this technician?')) {
            const { error } = await supabase
                .from('employees')
                .delete()
                .eq('id', id);
            if (!error) fetchEmployees();
        }
    };

    if (loading) return <div className="p-20 text-center opacity-20">Loading...</div>;

    return (
        <div className="space-y-8 animate-in">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black tracking-tight uppercase tracking-widest">Team Management</h2>
                    <p className="text-primary/40 text-xs font-medium">Manage your staff and schedules</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Employee
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map(emp => (
                    <div key={emp.id} className="bg-white rounded-2xl border border-secondary p-6 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <div className={cn("w-2 h-2 rounded-full", emp.is_active ? "bg-green-400" : "bg-red-400")} />
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-primary font-black uppercase shadow-sm">
                                {emp.full_name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-primary">{emp.full_name}</h3>
                                <p className="text-sm font-bold text-primary/30 uppercase tracking-widest">Lead Technician</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-sm font-medium text-primary/60">
                                <Mail className="w-4 h-4 opacity-30" />
                                {emp.email}
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-primary/60">
                                <Phone className="w-4 h-4 opacity-30" />
                                {emp.phone}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setScheduleEmployee(emp);
                                    setIsScheduleModalOpen(true);
                                }}
                                className="flex-1 py-3 bg-secondary/10 hover:bg-secondary/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                            >
                                <Calendar className="w-3 h-3" />
                                Schedule
                            </button>
                            <button
                                onClick={() => handleEdit(emp)}
                                className="px-5 py-3 bg-secondary/10 hover:bg-secondary/20 rounded-xl text-primary/40 hover:text-primary transition-all"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(emp.id)}
                                className="px-5 py-3 bg-red-400/10 hover:bg-red-400/20 rounded-xl text-red-500 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Employee Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-8 py-6 border-b border-secondary flex justify-between items-center bg-secondary/5">
                            <h2 className="text-xl font-black tracking-tight text-primary uppercase tracking-widest">
                                {editingEmployee ? 'Edit Technician' : 'Add New Technician'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-secondary/20 rounded-full transition-colors">
                                <X className="w-6 h-6 text-primary" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="flex justify-center mb-6">
                                <div className="relative group cursor-pointer">
                                    <div className="w-32 h-32 rounded-3xl bg-secondary/10 flex items-center justify-center border-2 border-dashed border-secondary hover:border-primary/40 transition-all">
                                        <Camera className="w-8 h-8 text-primary/20 group-hover:text-primary/40" />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center bg-primary/20 text-white opacity-0 group-hover:opacity-100 rounded-3xl transition-all">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Upload Photo</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.full_name}
                                        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                        className="w-full px-4 py-3 bg-secondary/5 border-2 border-transparent focus:border-primary/20 rounded-xl outline-none font-bold text-sm"
                                        placeholder="Full Name"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-secondary/5 border-2 border-transparent focus:border-primary/20 rounded-xl outline-none font-bold text-sm"
                                        placeholder="email@example.com"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Phone Number</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-secondary/5 border-2 border-transparent focus:border-primary/20 rounded-xl outline-none font-bold text-sm"
                                        placeholder="+44 ..."
                                    />
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-secondary/5 rounded-2xl">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-5 h-5 accent-primary cursor-pointer"
                                    />
                                    <label className="text-xs font-black text-primary uppercase tracking-widest cursor-pointer">Active Team Member</label>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-4 text-primary text-xs font-black uppercase tracking-widest hover:bg-secondary/10 rounded-2xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-4 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    {editingEmployee ? 'Update Technician' : 'Add Technician'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isScheduleModalOpen && scheduleEmployee && (
                <EmployeeScheduleModal
                    isOpen={isScheduleModalOpen}
                    onClose={() => setIsScheduleModalOpen(false)}
                    employeeId={scheduleEmployee.id}
                    employeeName={scheduleEmployee.full_name}
                />
            )}
        </div>
    );
}

function cn(...inputs: (string | boolean | undefined)[]) {
    return inputs.filter(Boolean).join(' ');
}
