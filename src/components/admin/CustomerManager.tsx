"use client";

import { useState, useEffect } from 'react';
import { Search, Mail, Phone, Calendar, History } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Customer {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    created_at: string;
}

export default function CustomerManager() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            const { data } = await supabase
                .from('customers')
                .select('*')
                .order('full_name');
            if (data) setCustomers(data);
            setLoading(false);
        };
        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(c =>
        c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-20 text-center opacity-20">Loading...</div>;

    return (
        <div className="space-y-8 animate-in">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black tracking-tight uppercase tracking-widest">Customer Database</h2>
                    <p className="text-primary/40 text-xs font-medium">Keep track of your loyal clients</p>
                </div>
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20" />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-secondary rounded-xl text-xs outline-none focus:border-primary/20 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="bg-white rounded-3xl border border-secondary overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-secondary/5 border-b border-secondary">
                        <tr>
                            <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-primary/40">Customer</th>
                            <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-primary/40">Contact Information</th>
                            <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-primary/40">Joined</th>
                            <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-primary/40">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary/5">
                        {filteredCustomers.map(customer => (
                            <tr key={customer.id} className="group hover:bg-secondary/5 transition-all">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center text-primary text-xs font-black">
                                            {customer.full_name[0]}
                                        </div>
                                        <div className="font-bold text-sm text-primary">{customer.full_name}</div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs font-medium text-primary/60">
                                            <Mail className="w-3.5 h-3.5 opacity-30" />
                                            {customer.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-medium text-primary/60">
                                            <Phone className="w-3.5 h-3.5 opacity-30" />
                                            {customer.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2 text-xs font-bold text-primary/30 uppercase tracking-widest">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(customer.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <button className="p-2 hover:bg-white rounded-lg transition-all text-primary/20 hover:text-primary">
                                        <History className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
