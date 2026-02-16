"use client";

import { useState } from "react";
import { LayoutDashboard, Users, Calendar, Settings, TrendingUp, Clock, PoundSterling, Plus, Search, Bell } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import ManualAppointmentModal from "@/components/admin/ManualAppointmentModal";
import ServiceManager from "@/components/admin/ServiceManager";
import EmployeeManager from "@/components/admin/EmployeeManager";
import CustomerManager from "@/components/admin/CustomerManager";
import CalendarManager from "@/components/admin/CalendarManager";
import ReportManager from "@/components/admin/ReportManager";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const STATS = [
    { name: "Total Revenue", value: "£2,040", icon: PoundSterling, change: "+12.5%", color: "text-green-600" },
    { name: "Appointments", value: "33", icon: Calendar, change: "-6%", color: "text-red-500" },
    { name: "Hours Worked", value: "32.8h", icon: Clock, change: "-4%", color: "text-red-500" },
    { name: "New Customers", value: "8", icon: Users, change: "-11%", color: "text-red-500" },
];

export default function AdminDashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Overview");

    return (
        <div className="min-h-screen flex bg-secondary/5 text-primary">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-secondary p-6 space-y-8 flex flex-col shadow-sm">
                <div className="flex items-center gap-3">
                    <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
                    <div className="text-xl font-black tracking-tighter text-primary">
                        MAISON ADMIN
                    </div>
                </div>

                <nav className="flex-1 space-y-1">
                    {[
                        { name: "Overview", icon: LayoutDashboard },
                        { name: "Calendar", icon: Calendar },
                        { name: "Employees", icon: Users },
                        { name: "Services", icon: Settings },
                        { name: "Customers", icon: Users },
                        { name: "Reports", icon: TrendingUp },
                    ].map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.name)}
                            className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm uppercase tracking-widest",
                                activeTab === item.name ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-primary/40 hover:bg-secondary/10 hover:text-primary"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 bg-secondary/15 rounded-2xl space-y-3">
                    <div className="font-bold text-sm uppercase tracking-wider opacity-60">Support</div>
                    <p className="text-xs text-primary/40 leading-relaxed uppercase tracking-widest font-bold">Documentation & Help</p>
                    <button className="w-full py-2.5 bg-white text-primary font-bold text-xs rounded-lg shadow-sm border border-secondary">Get Help</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Navbar */}
                <header className="bg-white border-b border-secondary px-10 py-6 flex justify-between items-center z-10">
                    <div className="flex items-center gap-6 flex-1 max-w-xl">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/20 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search appointments, customers..."
                                className="w-full pl-12 pr-6 py-4 bg-secondary/5 rounded-2xl outline-none border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="p-4 bg-secondary/5 hover:bg-secondary/10 rounded-2xl transition-all relative">
                            <Bell className="w-6 h-6 text-primary/60" />
                            <span className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3"
                        >
                            <Plus className="w-6 h-6" />
                            <span>New Appointment</span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-10 space-y-10">
                    {activeTab === "Overview" && (
                        <>
                            <header>
                                <h2 className="text-2xl font-black tracking-tight mb-1">Dashboard Overview</h2>
                                <p className="text-primary/40 text-sm font-medium">Welcome back, Admin.</p>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {STATS.map((stat) => (
                                    <div key={stat.name} className="bg-white p-6 rounded-2xl border border-secondary shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 rounded-xl bg-secondary/20 group-hover:bg-primary transition-colors">
                                                <stat.icon className="w-5 h-5 text-primary group-hover:text-white" />
                                            </div>
                                            <div className={cn("text-xs font-black px-2 py-0.5 bg-secondary/20 rounded-md", stat.color)}>{stat.change}</div>
                                        </div>
                                        <div className="text-xs font-bold text-primary/30 uppercase tracking-widest mb-1">{stat.name}</div>
                                        <div className="text-2xl font-black tracking-tighter">{stat.value}</div>
                                    </div>
                                ))}
                            </div>

                            <section className="bg-white p-8 rounded-3xl border border-secondary shadow-sm">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h3 className="text-lg font-black tracking-tight">Upcoming Appointments</h3>
                                        <p className="text-primary/40 text-[11px] font-bold uppercase tracking-widest">Live Schedule</p>
                                    </div>
                                    <button className="text-primary text-xs font-bold hover:underline">View Calendar</button>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { id: 1, customer: "Sarah Johnson", service: "Japanese Manicure", time: "03:30 PM", status: "confirmed", amount: "£50" },
                                        { id: 2, customer: "Emma Wilson", service: "Japanese Pedicure", time: "04:30 PM", status: "pending", amount: "£50" },
                                        { id: 3, customer: "Olivia Brown", service: "BIAB Manicure", time: "05:30 PM", status: "confirmed", amount: "£80" },
                                    ].map((apt) => (
                                        <div key={apt.id} className="group flex items-center justify-between p-4 bg-secondary/5 hover:bg-secondary/10 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-primary/10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary text-sm font-black shadow-sm group-hover:scale-105 transition-transform">
                                                    {apt.customer[0]}
                                                </div>
                                                <div>
                                                    <div className="font-black text-base">{apt.customer}</div>
                                                    <div className="text-primary/40 text-sm font-bold">{apt.service}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <div className="text-right">
                                                    <div className="font-black text-base">{apt.time}</div>
                                                    <div className="text-primary text-sm font-black opacity-40">{apt.amount}</div>
                                                </div>
                                                <div className={cn(
                                                    "px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest",
                                                    apt.status === "confirmed" ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-secondary/40 text-primary/40"
                                                )}>
                                                    {apt.status}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}

                    {activeTab === "Services" && <ServiceManager />}
                    {activeTab === "Employees" && <EmployeeManager />}
                    {activeTab === "Customers" && <CustomerManager />}
                    {activeTab === "Calendar" && <CalendarManager />}

                    {activeTab === "Reports" && <ReportManager />}
                </div>
            </main>

            {/* Modal */}
            <ManualAppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
