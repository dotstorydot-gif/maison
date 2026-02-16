import { Instagram, Music2 as TikTok, Heart, Quote } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="animate-in bg-white min-h-screen">
            {/* Hero Header */}
            <section className="py-24 bg-secondary/5 border-b border-secondary/10">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-primary">Our Story</h1>
                    <p className="text-primary/40 mt-4 font-black uppercase tracking-[0.3em] text-[10px]">Brought to you by Deena Osman</p>
                </div>
            </section>

            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    {/* Founder Image */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-2xl group-hover:bg-primary/20 transition-all duration-700" />
                        <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-secondary shadow-2xl">
                            <img
                                src="/deena.png"
                                alt="Deena Osman"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Social Overlay */}
                        <div className="absolute -bottom-10 -right-10 flex flex-col gap-4 p-6 bg-white rounded-[2rem] border border-secondary shadow-xl animate-bounce-slow">
                            <a
                                href="https://www.instagram.com/deena.osmann?igsh=MW1vY2ZnbWsybjJsNg%3D%3D"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                                <Instagram className="w-6 h-6" />
                            </a>
                            <a
                                href="https://www.tiktok.com/@deenaosmannn?_t=ZN-90jk1i8x66Y&_r=1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                                <TikTok className="w-6 h-6" />
                            </a>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-12">
                        <div className="relative">
                            <Quote className="w-20 h-20 text-primary/5 absolute -top-10 -left-10" />
                            <p className="text-2xl md:text-3xl font-light leading-relaxed text-primary/80 italic">
                                &ldquo;Living in London my whole life, I have struggled to find a one-stop shop where I can get all of my treatments done which has a luxurious atmosphere and professional experienced team.&rdquo;
                            </p>
                        </div>

                        <div className="space-y-6 text-lg text-primary/60 font-medium leading-relaxed">
                            <p>
                                &ldquo;I therefore developed a passion for all things beauty and have taken it upon myself to achieve this dream so that other women can have this opportunity where they can come to Maison De Poupée and request any treatment and leave feeling like they are the best version of themselves.&rdquo;
                            </p>
                            <p>
                                &ldquo;Our aim is to also build a community where it feels like home, where our clients needs are met and they can feel empowered, confident, and healthy.&rdquo;
                            </p>
                        </div>

                        <div className="pt-8 border-t border-secondary/20">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Heart className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-black uppercase tracking-widest text-primary">Our Mission</h4>
                                    <p className="text-sm text-primary/40 font-bold uppercase tracking-widest mt-1">Empowering Women Daily</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
