import { Briefcase, Send, FileText, User, Mail, Phone, Heart } from "lucide-react";

export default function CareersPage() {
    const roles = [
        "Beauty Therapist",
        "Nail technicians",
        "Hair Stylist",
        "Aesthetician"
    ];

    return (
        <div className="animate-in bg-white min-h-screen pb-24">
            {/* Hero Section */}
            <section className="py-24 bg-secondary/5 border-b border-secondary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-[100px]" />
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-primary mb-6">Join Our Team</h1>
                    <p className="text-xl md:text-2xl font-light text-primary/60 italic max-w-2xl mx-auto">
                        &rdquo; Become part of the Maison De Poupée team of professionals. &rdquo;
                    </p>
                </div>
            </section>

            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    {/* Left Side: Roles & Info */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary/40">Open Roles</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {roles.map((role) => (
                                    <div key={role} className="glass p-6 rounded-3xl border border-secondary hover:border-primary/30 transition-all group">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Briefcase className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="font-black text-lg text-primary">{role}</h3>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-primary/30 mt-1">Full-time / Part-time</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Heart className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-black uppercase tracking-widest text-primary text-sm">Our Culture</h4>
                                    <p className="text-[10px] text-primary/40 font-bold uppercase tracking-widest mt-1">Empowerment • Professionalism • Excellence</p>
                                </div>
                            </div>
                            <p className="mt-6 text-sm text-primary/60 font-medium leading-relaxed">
                                At Maison De Poupée, we don't just provide services; we create experiences. We are looking for passionate individuals who strive for perfection and want to grow within the luxury beauty industry.
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Application Form */}
                    <div className="glass p-10 rounded-[3rem] border-primary/20 shadow-2xl relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mb-32 blur-3xl opacity-50" />

                        <div className="relative space-y-8">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight mb-2">Apply Now</h3>
                                <p className="text-primary/40 text-[10px] font-black uppercase tracking-widest">Start your journey with us</p>
                            </div>

                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 flex items-center gap-2 px-1">
                                        <User className="w-3 h-3" /> Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full bg-secondary/20 border-white/5 rounded-2xl px-6 py-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="Your Name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 flex items-center gap-2 px-1">
                                        <Mail className="w-3 h-3" /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full bg-secondary/20 border-white/5 rounded-2xl px-6 py-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 flex items-center gap-2 px-1">
                                        <Briefcase className="w-3 h-3" /> Position Applying For
                                    </label>
                                    <select className="w-full bg-secondary/20 border-white/5 rounded-2xl px-6 py-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none">
                                        <option value="">Select a position</option>
                                        {roles.map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 flex items-center gap-2 px-1">
                                        <FileText className="w-3 h-3" /> CV / Portfolio Link
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full bg-secondary/20 border-white/5 rounded-2xl px-6 py-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="Link to your CV or Portfolio"
                                    />
                                </div>

                                <button
                                    type="button"
                                    className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-2xl font-black text-sm tracking-[0.3em] uppercase shadow-2xl shadow-primary/20 transition-all flex items-center justify-center gap-4 group active:scale-[0.98]"
                                >
                                    Send Application
                                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
