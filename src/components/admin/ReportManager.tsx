"use client";

import { useState, useEffect, useCallback } from 'react';
import {
    Users,
    Calendar,
    Clock,
    PoundSterling,
    Download,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    UserCheck,
    AlertCircle
} from "lucide-react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ReportData {
    totalRevenue: number;
    totalAppointments: number;
    totalHours: number;
    newCustomers: number;
    totalTax: number;
    employeeWorkload: {
        name: string;
        clientCount: number;
        revenue: number;
    }[];
}

export default function ReportManager() {
    const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ReportData | null>(null);

    const fetchReportData = useCallback(async () => {
        setLoading(true);
        try {
            // Calculate date range
            const now = new Date();
            const startDate = new Date();
            if (period === 'day') startDate.setHours(0, 0, 0, 0);
            else if (period === 'week') startDate.setDate(now.getDate() - 7);
            else if (period === 'month') startDate.setMonth(now.getMonth() - 1);
            else if (period === 'year') startDate.setFullYear(now.getFullYear() - 1);

            // Use manual format to avoid toISOString issues in some environments
            const y = startDate.getFullYear();
            const m = String(startDate.getMonth() + 1).padStart(2, '0');
            const d = String(startDate.getDate()).padStart(2, '0');
            const dateStr = `${y}-${m}-${d}`;

            // Fetch Appointments with joined data
            const { data: appts, error: apptsError } = await supabase
                .from('appointments')
                .select(`
                        *,
                        employees(full_name)
                    `)
                .gte('appointment_date', dateStr);

            if (apptsError) throw apptsError;

            // Fetch New Customers
            const { count: customerCount, error: custError } = await supabase
                .from('customers')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', startDate.toISOString());

            if (custError) throw custError;

            if (appts) {
                let revenue = 0;
                let tax = 0;
                const workloadMap: Record<string, { count: number, revenue: number }> = {};

                appts.forEach((app: any) => {
                    const amount = Number(app.total_amount) || 0;
                    // We assume total_amount is gross (inc tax if applicable) or we estimate tax
                    // For now, let's stick to the 20% estimate logic but use pre-calculated total

                    const taxRate = 0.20; // Default estimate
                    const priceExTax = amount / (1 + taxRate);
                    const itemTax = amount - priceExTax;

                    revenue += amount;
                    tax += itemTax;

                    const empName = app.employees?.full_name || 'Unassigned';
                    if (!workloadMap[empName]) workloadMap[empName] = { count: 0, revenue: 0 };
                    workloadMap[empName].count += 1;
                    workloadMap[empName].revenue += amount;
                });

                setData({
                    totalRevenue: revenue,
                    totalAppointments: appts.length,
                    totalHours: 0, // Duration calculation would require join but total_amount is better for revenue
                    newCustomers: customerCount || 0,
                    totalTax: tax,
                    employeeWorkload: Object.entries(workloadMap).map(([name, stats]) => ({
                        name,
                        clientCount: stats.count,
                        revenue: stats.revenue
                    }))
                });
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setLoading(false);
        }
    }, [period]);

    useEffect(() => {
        fetchReportData();
    }, [fetchReportData]);

    const exportToCSV = () => {
        if (!data) return;

        const rows = [
            ["Metric", "Value"],
            ["Total Revenue (Inc Tax)", `£${data.totalRevenue.toFixed(2)}`],
            ["Total Tax", `£${data.totalTax.toFixed(2)}`],
            ["Total Appointments", data.totalAppointments],
            ["Total Hours Worked", data.totalHours],
            ["New Customers", data.newCustomers],
            ["", ""],
            ["Employee", "Clients", "Revenue (Ex Tax)"],
            ...data.employeeWorkload.map(e => [e.name, e.clientCount, `£${e.revenue.toFixed(2)}`])
        ];

        const csvContent = "data:text/csv;charset=utf-8,"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `report_${period}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return (
        <div className="p-20 flex flex-col items-center justify-center opacity-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-bold uppercase tracking-widest text-xs">Generating Analytics...</p>
        </div>
    );

    if (!data) return (
        <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div>
                <h3 className="text-xl font-black uppercase tracking-widest">Analytics Error</h3>
                <p className="text-primary/40 text-sm font-medium max-w-sm mx-auto">We couldn&apos;t load the reporting data. Please try again later or contact support.</p>
            </div>
            <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all"
            >
                Retry
            </button>
        </div>
    );

    const stats = [
        { name: "Total Revenue", value: `£${data?.totalRevenue.toFixed(2)}`, icon: PoundSterling, change: "+12.5%", trend: "up" },
        { name: "Appointments", value: data?.totalAppointments.toString(), icon: Calendar, change: "+8.2%", trend: "up" },
        { name: "Hours Worked", value: `${data?.totalHours}h`, icon: Clock, change: "-3.1%", trend: "down" },
        { name: "New Customers", value: data?.newCustomers.toString(), icon: Users, change: "+15.0%", trend: "up" },
    ];

    return (
        <div className="space-y-8 animate-in pb-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight uppercase tracking-widest">Analytics Dashboard</h2>
                    <p className="text-primary/40 text-sm font-medium">Automated performance reports and insights</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-white border border-secondary rounded-xl p-1 shadow-sm">
                        {(['day', 'week', 'month', 'year'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                    period === p ? "bg-primary text-white shadow-md shadow-primary/20" : "text-primary/40 hover:text-primary"
                                )}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-5 py-3 bg-white border border-secondary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-secondary/10 transition-all shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-3xl border border-secondary shadow-sm hover:shadow-lg transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-2xl bg-secondary/20 group-hover:bg-primary transition-colors">
                                <stat.icon className="w-5 h-5 text-primary group-hover:text-white" />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg",
                                stat.trend === 'up' ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50"
                            )}>
                                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {stat.change}
                            </div>
                        </div>
                        <div className="text-[10px] font-black text-primary/30 uppercase tracking-widest mb-1">{stat.name}</div>
                        <div className="text-3xl font-black tracking-tighter">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Employee Workload */}
                <div className="lg:col-span-8 bg-white rounded-[32px] border border-secondary shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-secondary flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-widest text-primary">Technician Workload</h3>
                            <p className="text-primary/40 text-xs font-medium">Busiest employees by client volume</p>
                        </div>
                        <BarChart3 className="w-5 h-5 text-primary/20" />
                    </div>
                    <div className="p-8 space-y-6 flex-1">
                        {data?.employeeWorkload.map((emp, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center font-black text-primary text-xs uppercase">
                                            {emp.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="font-black text-sm">{emp.name}</div>
                                            <div className="text-[10px] font-black text-primary/30 uppercase tracking-widest">{emp.clientCount} Clients</div>
                                        </div>
                                    </div>
                                    <div className="font-black text-primary text-sm">£{emp.revenue.toFixed(2)}</div>
                                </div>
                                <div className="h-3 w-full bg-secondary/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${Math.min(100, (emp.clientCount / (data.totalAppointments || 1)) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {data?.employeeWorkload.length === 0 && (
                            <div className="h-40 flex flex-col items-center justify-center text-center opacity-20">
                                <UserCheck className="w-10 h-10 mb-2" />
                                <p className="text-xs font-black uppercase tracking-widest">No workload data for this period</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tax Summary */}
                <div className="lg:col-span-4 bg-white rounded-[32px] border border-secondary shadow-sm overflow-hidden border-2 border-primary/5">
                    <div className="p-8 border-b border-secondary flex justify-between items-center bg-secondary/5">
                        <h3 className="text-lg font-black uppercase tracking-widest text-primary">Tax Estimate</h3>
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <AlertCircle className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="p-8 space-y-8">
                        <div className="text-center py-6">
                            <div className="text-xs font-black text-primary/30 uppercase tracking-widest mb-2">Estimated Tax Due</div>
                            <div className="text-5xl font-black text-primary tracking-tighter">£{data?.totalTax.toFixed(2)}</div>
                            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">
                                20% standard VAT
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-secondary/10">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-black text-primary/40 uppercase tracking-widest">Net Revenue</span>
                                <span className="font-black text-primary">£{(data!.totalRevenue - data!.totalTax).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-black text-primary/40 uppercase tracking-widest">Tax Component</span>
                                <span className="font-black text-primary">£{data?.totalTax.toFixed(2)}</span>
                            </div>
                            <div className="pt-4 flex justify-between items-center text-sm border-t border-secondary/10">
                                <span className="font-black text-primary uppercase tracking-widest">Gross Total</span>
                                <span className="font-black text-primary">£{data?.totalRevenue.toFixed(2)}</span>
                            </div>
                        </div>

                        <button className="w-full py-4 bg-secondary/10 hover:bg-secondary/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Detailed Tax Breakdown
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
    return inputs.filter(Boolean).join(' ');
}
