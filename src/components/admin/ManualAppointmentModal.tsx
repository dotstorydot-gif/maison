"use client";

import { useState, useEffect, useCallback } from 'react';
import { X, Plus, Info, RotateCcw, Lock, ChevronDown } from "lucide-react";
import { supabase } from '@/lib/supabase';

interface Service {
    id: string;
    name: string;
    price: number;
}

interface Employee {
    id: string;
    full_name: string;
}

export default function ManualAppointmentModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [services, setServices] = useState<Service[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        customerNotes: '',
        adminNotes: '',
        serviceId: '',
        employeeId: '',
        appointmentDate: '',
        startTime: '09:00',
        useCoupon: false,
        paymentStatus: 'unpaid',
        createPaymentRequest: false,
    });

    const fetchInitialData = useCallback(async () => {
        try {
            const { data: s } = await supabase.from('services').select('id, name, price').order('name');
            const { data: e } = await supabase.from('employees').select('id, full_name').eq('is_active', true);
            if (s) setServices(s);
            if (e) setEmployees(e);
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    }, []);

    const handleCreateAppointment = async () => {
        try {
            // 1. Handle Customer (Find or Create)
            let customerId;
            const { data: customerData } = await supabase
                .from('customers')
                .select('id')
                .eq('email', formData.email)
                .single();

            if (customerData) {
                customerId = customerData.id;
            } else {
                const { data: newCustomer, error: custError } = await supabase
                    .from('customers')
                    .insert({
                        full_name: `${formData.firstName} ${formData.lastName}`,
                        email: formData.email,
                        phone: formData.phone
                    })
                    .select('id')
                    .single();
                if (custError) throw custError;
                customerId = newCustomer.id;
            }

            // 2. Create Appointment
            const { error: apptError } = await supabase
                .from('appointments')
                .insert({
                    customer_id: customerId,
                    employee_id: formData.employeeId || null,
                    service_id: formData.serviceId || null,
                    appointment_date: formData.appointmentDate,
                    start_time: formData.startTime,
                    end_time: formData.startTime, // Simplified
                    status: 'confirmed',
                    total_amount: totalPrice,
                    payment_status: formData.paymentStatus,
                    notes: formData.customerNotes,
                    admin_notes: formData.adminNotes
                });

            if (apptError) throw apptError;

            alert('Appointment created successfully!');
            onClose();
        } catch (error: any) {
            console.error('Error creating appointment:', error);
            alert('Failed to create appointment: ' + error.message);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchInitialData();
        }
    }, [isOpen, fetchInitialData]);

    if (!isOpen) return null;

    const selectedService = services.find(s => s.id === formData.serviceId);
    const totalPrice = selectedService?.price || 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-5 border-b border-secondary flex justify-between items-center bg-secondary/5">
                    <h2 className="text-xl font-black tracking-tight text-primary uppercase tracking-widest">New Appointment</h2>
                    <button onClick={onClose} className="p-1.5 hover:bg-secondary/20 rounded-full transition-colors">
                        <X className="w-5 h-5 text-primary" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Customer Info Section */}
                    <section className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest font-black text-primary/30 ml-1">First Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Sarah"
                                    className="w-full px-4 py-3 bg-secondary/5 border border-transparent focus:border-primary/20 focus:bg-white rounded-xl outline-none transition-all text-base font-medium"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-black text-primary/30 ml-1">Last Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Johnson"
                                    className="w-full px-4 py-3 bg-secondary/5 border border-transparent focus:border-primary/20 focus:bg-white rounded-xl outline-none transition-all text-sm font-medium"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-primary/60 ml-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full px-5 py-4 bg-secondary/5 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-primary/60 ml-1">Telephone Number</label>
                            <div className="relative">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <span className="text-lg">🇬🇧</span>
                                    <span className="text-primary font-medium">+44</span>
                                    <ChevronDown className="w-4 h-4 text-primary/40" />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="7400 123456"
                                    className="w-full pl-28 pr-5 py-4 bg-secondary/5 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-primary/60 ml-1">Customer Notes</label>
                            <textarea
                                placeholder="Customer Notes"
                                rows={3}
                                className="w-full px-5 py-4 bg-secondary/5 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all resize-none"
                                value={formData.customerNotes}
                                onChange={(e) => setFormData({ ...formData, customerNotes: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-primary/60 ml-1">Notes only visible to admins</label>
                            <textarea
                                placeholder="Notes only visible to admins"
                                rows={2}
                                className="w-full px-5 py-4 bg-secondary/5 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all resize-none italic"
                                value={formData.adminNotes}
                                onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                            />
                        </div>
                    </section>

                    {/* Pricing Section */}
                    <section className="space-y-6 pt-6 border-t border-secondary">
                        <div className="flex justify-between items-center text-primary">
                            <h3 className="text-xl font-bold">Price Breakdown</h3>
                            <button className="flex items-center gap-1.5 text-sm font-semibold opacity-60 hover:opacity-100 transition-opacity">
                                <RotateCcw className="w-4 h-4" /> Recalculate
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-primary/30 ml-1">Service</label>
                                    <select
                                        className="w-full px-4 py-3 bg-secondary/5 rounded-xl outline-none border border-transparent focus:border-primary/20 text-sm font-medium"
                                        value={formData.serviceId}
                                        onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                                    >
                                        <option value="">Select Service</option>
                                        {services.map(s => <option key={s.id} value={s.id}>{s.name} - £{s.price}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-primary/30 ml-1">Appointment Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 bg-secondary/5 rounded-xl outline-none border border-transparent focus:border-primary/20 text-sm font-medium"
                                        value={formData.appointmentDate}
                                        onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            {selectedService && (
                                <div className="space-y-3 px-2">
                                    <div className="flex justify-between text-primary/80 font-medium">
                                        <span>{selectedService.name}</span>
                                        <span>£{selectedService.price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-primary/40 font-medium">
                                        <span>Sub Total</span>
                                        <span>£{selectedService.price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-2">
                                        <span className="text-lg font-bold text-primary">Total Price</span>
                                        <span className="text-3xl font-black text-primary">£{selectedService.price.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-primary/30 ml-1">Assign Employee</label>
                                    <select
                                        className="w-full px-4 py-3 bg-secondary/5 rounded-xl outline-none border border-transparent focus:border-primary/20 text-sm font-medium"
                                        value={formData.employeeId}
                                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                    >
                                        <option value="">Assign Employee</option>
                                        {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.full_name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-primary/30 ml-1">Start Time</label>
                                    <input
                                        type="time"
                                        className="w-full px-4 py-3 bg-secondary/5 rounded-xl outline-none border border-transparent focus:border-primary/20 text-sm font-medium"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Payment Section */}
                    <section className="space-y-6 pt-6 border-t border-secondary">
                        <div className="flex justify-between items-center text-primary">
                            <h3 className="text-xl font-bold">Balance & Payments</h3>
                            <select
                                className="bg-secondary/10 px-4 py-2 rounded-xl text-sm font-bold outline-none border-none"
                                value={formData.paymentStatus}
                                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                            >
                                <option value="unpaid">Not Paid</option>
                                <option value="paid">Paid</option>
                            </select>
                        </div>

                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-2xl font-black text-primary">£0.00</div>
                                <div className="text-xs font-bold text-primary/40 uppercase">Total Payments</div>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-black text-primary italic">£{totalPrice.toFixed(2)}</div>
                                <div className="text-xs font-bold text-primary/40 uppercase">Total Balance Due</div>
                            </div>
                        </div>

                        <div className="bg-secondary/10 p-4 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${formData.createPaymentRequest ? 'bg-primary' : 'bg-primary/20'}`}
                                    onClick={() => setFormData({ ...formData, createPaymentRequest: !formData.createPaymentRequest })}>
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.createPaymentRequest ? 'left-7' : 'left-1'}`} />
                                </div>
                                <span className="font-bold text-primary/80">Create a Payment Request</span>
                            </div>
                            <Info className="w-5 h-5 text-primary/30" />
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-primary">Transactions</h4>
                            <button className="w-full py-4 border-2 border-dashed border-primary/20 rounded-2xl flex items-center justify-center gap-2 text-primary/60 font-bold hover:bg-primary/5 transition-colors">
                                <Plus className="w-5 h-5" /> Add Transaction
                            </button>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-secondary flex gap-4 items-center bg-white">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-primary text-sm font-black uppercase tracking-widest hover:bg-secondary/10 rounded-xl transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateAppointment}
                        disabled={!formData.email || !formData.serviceId || !formData.appointmentDate}
                        className="flex-1 px-6 py-3 bg-primary text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        Create Appointment
                    </button>
                    <div className="flex items-center gap-2 ml-2 opacity-30">
                        <Lock className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black tracking-widest uppercase">Secure</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
