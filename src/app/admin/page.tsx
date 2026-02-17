"use client";

import { useState, useEffect, useCallback } from "react";
import { LayoutDashboard, Users, Calendar, Settings, TrendingUp, Plus, Search, Bell, Lock, LogOut, PoundSterling } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import ManualAppointmentModal from "@/components/admin/ManualAppointmentModal";
import ServiceManager from "@/components/admin/ServiceManager";
import EmployeeManager from "@/components/admin/EmployeeManager";
import CustomerManager from "@/components/admin/CustomerManager";
import CalendarManager from "@/components/admin/CalendarManager";
import ReportManager from "@/components/admin/ReportManager";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function AdminDashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Overview");
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [stats, setStats] = useState<{ name: string; value: string; icon: any; change: string; color: string }[]>([
        { name: "Total Revenue", value: "£0", icon: PoundSterling, change: "Live", color: "text-green-600" },
        { name: "Total Appointments", value: "0", icon: Calendar, change: "Live", color: "text-blue-500" },
        { name: "Total Customers", value: "0", icon: Users, change: "Live", color: "text-purple-500" },
    ]);
    const [upcomingAppointments, setUpcomingAppointments] = useState<{
        id: string;
        customer: string;
        service: string;
        time: string;
        status: string;
        amount: string;
    }[]>([]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchDashboardData = useCallback(async () => {
        try {
            const { data: appointments } = await supabase.from('appointments').select('total_amount');
            const { count: customerCount } = await supabase.from('customers').select('*', { count: 'exact', head: true });
            const { count: appointmentCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true });

            const totalRevenue = appointments?.reduce((sum, apt) => sum + (apt.total_amount || 0), 0) || 0;

            setStats([
                { name: "Total Revenue", value: `£${totalRevenue.toLocaleString()}`, icon: PoundSterling, change: "Live", color: "text-green-600" },
                { name: "Total Appointments", value: String(appointmentCount || 0), icon: Calendar, change: "Live", color: "text-blue-500" },
                { name: "Total Customers", value: String(customerCount || 0), icon: Users, change: "Live", color: "text-purple-500" },
            ]);

            const { data: upcoming } = await supabase
                .from('appointments')
                .select(`
                    id,
                    appointment_date,
                    start_time,
                    total_amount,
                    status,
                    customers (full_name)
                `)
                .order('appointment_date', { ascending: true })
                .order('start_time', { ascending: true })
                .limit(5);

            if (upcoming) {
                setUpcomingAppointments(upcoming.map((apt: any) => ({
                    id: apt.id,
                    customer: (apt.customers as any)?.full_name || "Unknown",
                    service: "Appt Review",
                    time: `${apt.appointment_date} @ ${apt.start_time}`,
                    status: apt.status,
                    amount: `£${apt.total_amount}`
                })));
            }
        } catch (err) {
            console.error("Dashboard fetch error:", err);
        }
    }, []);

    useEffect(() => {
        if (user && activeTab === "Overview") {
            fetchDashboardData();
        }
    }, [user, activeTab, fetchDashboardData]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const isAdmin = user?.email?.endsWith('@maisondepoupee.com');

    if (!user || !isAdmin) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
                <div className="max-w-md w-full glass p-10 rounded-[2.5rem] border-primary/20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">MAISON ADMIN</h1>
                        <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Authorized Personnel Only</p>
                    </div>

                    {!user ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-primary/40 ml-4 tracking-widest">Admin Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                                    placeholder="admin@maisondepoupee.com"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-primary/40 ml-4 tracking-widest">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-white p-4 rounded-xl font-black tracking-widest uppercase text-xs mt-4 shadow-xl shadow-primary/20 transition-all"
                            >
                                Enter Dashboard
                            </button>
                        </form>
                    ) : (
                        <div className="text-center space-y-6">
                            <p className="text-red-500 font-bold bg-red-500/10 p-4 rounded-2xl text-sm leading-relaxed">
                                Access Denied. Your account ({user.email}) does not have administrative privileges.
                            </p>
                            <button onClick={handleLogout} className="text-primary text-xs font-black uppercase tracking-widest hover:underline">
                                Logout & Try Another Account
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-secondary/5 text-primary">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-secondary p-6 space-y-8 flex flex-col shadow-sm">
                <div className="flex items-center gap-3">
                    <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
                    <div className="text-xl font-black tracking-tighter text-primary">
                        MAISON ADMIN (LATEST)
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

                <div className="mt-auto space-y-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500/40 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold text-sm uppercase tracking-widest"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>

                    <div className="p-4 bg-secondary/15 rounded-2xl space-y-3">
                        <div className="font-bold text-sm uppercase tracking-wider opacity-60">Support</div>
                        <p className="text-xs text-primary/40 leading-relaxed uppercase tracking-widest font-bold">Documentation & Help</p>
                        <button className="w-full py-2.5 bg-white text-primary font-bold text-xs rounded-lg shadow-sm border border-secondary">Get Help</button>
                    </div>
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
                                <h2 className="text-2xl font-black tracking-tight mb-1 font-serif">Dashboard Overview</h2>
                                <p className="text-primary/40 text-sm font-medium">Welcome back, Admin.</p>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {stats.map((stat: any) => (
                                    <div key={stat.name} className="bg-white p-8 rounded-3xl border border-secondary shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group overflow-hidden relative">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="flex justify-between items-center mb-6 relative">
                                            <div className="p-4 rounded-2xl bg-secondary/15 group-hover:bg-primary transition-all duration-500 scale-100 group-hover:scale-110">
                                                <stat.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                                            </div>
                                            <div className={cn(
                                                "text-[9px] font-black px-3 py-1 bg-secondary/20 rounded-full uppercase tracking-widest border border-white/50",
                                                stat.color
                                            )}>
                                                {stat.change}
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <div className="text-[11px] font-black text-primary/30 uppercase tracking-[0.2em] mb-2">{stat.name}</div>
                                            <div className="text-4xl font-black tracking-tighter text-primary">{stat.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <section className="bg-white p-8 rounded-3xl border border-secondary shadow-sm">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h3 className="text-lg font-black tracking-tight font-serif">Upcoming Appointments</h3>
                                        <p className="text-primary/40 text-[11px] font-bold uppercase tracking-widest">Live Schedule</p>
                                    </div>
                                    <button className="text-primary text-xs font-bold hover:underline">View Calendar</button>
                                </div>

                                <div className="space-y-4">
                                    {upcomingAppointments.length > 0 ? (
                                        upcomingAppointments.map((apt: any) => (
                                            <div key={apt.id} className="group flex items-center justify-between p-4 bg-secondary/5 hover:bg-secondary/10 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-primary/10">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary text-sm font-black shadow-sm group-hover:scale-105 transition-transform uppercase">
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
                                                        "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                                        apt.status === "confirmed" ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-secondary/40 text-primary/40"
                                                    )}>
                                                        {apt.status}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 bg-secondary/5 rounded-2xl border border-dashed border-primary/10">
                                            <Calendar className="w-8 h-8 text-primary/10 mx-auto mb-4" />
                                            <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.2em]">No upcoming appointments found</p>
                                        </div>
                                    )}
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
