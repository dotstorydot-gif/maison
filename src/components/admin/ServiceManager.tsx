"use client";

import { useState, useEffect } from 'react';
import { Plus, Edit2, PoundSterling, Clock, X, Trash2 } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    category_id: string;
}

interface Category {
    id: string;
    name: string;
}

export default function ServiceManager() {
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formData, setFormData] = useState<Partial<Service>>({
        name: '',
        description: '',
        price: 0,
        duration: 30,
        category_id: ''
    });

    const fetchData = async () => {
        setLoading(true);
        const { data: s } = await supabase.from('services').select('*').order('name');
        const { data: c } = await supabase.from('categories').select('*').order('name');
        if (s) setServices(s);
        if (c) setCategories(c);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setEditingService(null);
        setFormData({
            name: '',
            description: '',
            price: 50,
            duration: 60,
            category_id: categories[0]?.id || ''
        });
        setIsModalOpen(true);
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setFormData(service);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingService) {
            const { error } = await supabase
                .from('services')
                .update(formData)
                .eq('id', editingService.id);
            if (!error) fetchData();
        } else {
            const { error } = await supabase
                .from('services')
                .insert([formData]);
            if (!error) fetchData();
        }
        setIsModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this service?')) {
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', id);
            if (!error) fetchData();
        }
    };

    if (loading) return <div className="p-20 text-center opacity-20">Loading...</div>;

    return (
        <div className="space-y-8 animate-in">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black tracking-tight uppercase tracking-widest">Service Catalog</h2>
                    <p className="text-primary/40 text-xs font-medium">Manage your treatments and pricing</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Service
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {categories.map(cat => (
                    <div key={cat.id} className="bg-white rounded-2xl border border-secondary p-6 space-y-4">
                        <div className="flex justify-between items-center border-b border-secondary pb-3">
                            <h3 className="text-base font-black uppercase tracking-widest text-primary/60">{cat.name}</h3>
                            <button className="text-xs font-bold text-primary/20 hover:text-primary transition-colors">Edit</button>
                        </div>
                        <div className="space-y-3">
                            {services.filter(s => s.category_id === cat.id).map(service => (
                                <div key={service.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-secondary/5 transition-all">
                                    <div className="flex flex-col">
                                        <span className="text-base font-bold text-primary">{service.name}</span>
                                        <div className="flex items-center gap-2 text-sm font-medium text-primary/40">
                                            <div className="flex items-center gap-0.5"><Clock className="w-3.5 h-3.5" /> {service.duration}m</div>
                                            <div className="flex items-center gap-0.5"><PoundSterling className="w-3.5 h-3.5" /> {service.price}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={() => handleEdit(service)}
                                            className="p-2 hover:bg-white rounded-lg transition-all text-primary/40 hover:text-primary"
                                        >
                                            <Edit2 className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="p-2 hover:bg-white rounded-lg transition-all text-red-400/40 hover:text-red-400"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Service Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-8 py-6 border-b border-secondary flex justify-between items-center bg-secondary/5">
                            <h2 className="text-xl font-black tracking-tight text-primary uppercase tracking-widest">
                                {editingService ? 'Edit Service' : 'Add New Service'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-secondary/20 rounded-full transition-colors">
                                <X className="w-6 h-6 text-primary" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Service Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-secondary/5 border-2 border-transparent focus:border-primary/20 rounded-xl outline-none font-bold text-sm"
                                        placeholder="e.g. Japanese Head Spa"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Price (£)</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                            className="w-full px-4 py-3 bg-secondary/5 border-2 border-transparent focus:border-primary/20 rounded-xl outline-none font-bold text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Duration (min)</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.duration}
                                            onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })}
                                            className="w-full px-4 py-3 bg-secondary/5 border-2 border-transparent focus:border-primary/20 rounded-xl outline-none font-bold text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Category</label>
                                    <select
                                        required
                                        value={formData.category_id}
                                        onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                        className="w-full px-4 py-3 bg-secondary/5 border-2 border-transparent focus:border-primary/20 rounded-xl outline-none font-bold text-sm uppercase"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-secondary/5 border-2 border-transparent focus:border-primary/20 rounded-xl outline-none font-bold text-sm min-h-[100px]"
                                        placeholder="Service details..."
                                    />
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
                                    {editingService ? 'Update Service' : 'Create Service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
