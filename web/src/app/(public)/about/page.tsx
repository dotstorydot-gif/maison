import { Play, Star, Heart, Sparkles } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="animate-in bg-white min-h-screen">
            {/* Hero Header */}
            <section className="py-24 bg-secondary/5 border-b border-secondary/10 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-primary">About Us</h1>
                    <p className="text-primary/40 mt-6 font-black uppercase tracking-[0.4em] text-xs">Maison de Poupeé Experience</p>
                </div>
            </section>

            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    {/* Video Section */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-2xl group-hover:bg-primary/20 transition-all duration-700" />
                        <div className="relative rounded-[2.5rem] overflow-hidden border border-secondary shadow-2xl bg-black aspect-video flex items-center justify-center">
                            <video
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                autoPlay
                                muted
                                loop
                                playsInline
                            >
                                <source src="https://maisondepoupee.co.uk/wp-content/uploads/2024/10/Walkthrough.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>

                            {/* Play Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Play className="w-8 h-8 text-white fill-white" />
                                </div>
                            </div>
                        </div>

                        {/* Floating Labels */}
                        <div className="absolute -top-6 -right-6 glass p-4 rounded-2xl border border-primary/20 animate-bounce-slow">
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-primary fill-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Luxury Salon</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-primary" />
                                <span className="text-xs font-black uppercase tracking-[0.3em] text-primary/40">Our Philosophy</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-primary leading-[1.1]">
                                Where Beauty Meets <span className="text-primary/30">Empowerment</span>.
                            </h2>
                        </div>

                        <div className="space-y-6 text-lg md:text-xl text-primary/70 font-light leading-relaxed">
                            <p>
                                Welcome to Maison de Poupeé ~ where beauty meets empowerment, and every woman is treated like royalty. From head to toe, we offer everything you need to glow with confidence, from expert hair styling and skincare to flawless nails and luxurious body treatments.
                            </p>
                            <p>
                                Our team of specialists in every department is dedicated to bringing out your unique beauty with personalized care and top-quality treatments. Step into our dollhouse of elegance and walk out feeling like the princess you truly are.
                            </p>
                            <p className="font-bold italic text-primary">
                                &rdquo; Because at Maison de Poupeé, beauty isn’t just a service ~ it’s an experience designed to make you feel unstoppable! &rdquo;
                            </p>
                        </div>

                        <div className="pt-8 border-t border-secondary/20 grid grid-cols-2 gap-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-black text-xs uppercase tracking-widest text-primary">Empowerment</h4>
                                    <p className="text-[10px] text-primary/40 font-bold uppercase tracking-widest">Confidence First</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-black text-xs uppercase tracking-widest text-primary">Excellence</h4>
                                    <p className="text-[10px] text-primary/40 font-bold uppercase tracking-widest">Top-tier Care</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
