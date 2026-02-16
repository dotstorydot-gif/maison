"use client";

import { MapPin, Phone, Mail, Instagram, Music2 as TikTok, ChevronRight } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="animate-in bg-white min-h-screen">
            {/* Header */}
            <section className="py-24 bg-secondary/5 border-b border-secondary/10 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-primary">Get in Touch</h1>
                    <p className="text-primary/40 mt-4 font-black uppercase tracking-[0.3em] text-[10px]">We are here to assist you</p>
                </div>
            </section>

            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-primary mb-8">Visit The Maison</h2>
                            <div className="space-y-8">
                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-secondary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-black uppercase tracking-widest text-xs text-primary/40 mb-2">Location</h4>
                                        <p className="font-black text-primary">Mayfair, London, United Kingdom</p>
                                    </div>
                                </div>

                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-secondary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-black uppercase tracking-widest text-xs text-primary/40 mb-2">Phone</h4>
                                        <p className="font-black text-primary">+44 (0) 20 1234 5678</p>
                                    </div>
                                </div>

                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-secondary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-black uppercase tracking-widest text-xs text-primary/40 mb-2">Email</h4>
                                        <p className="font-black text-primary">contact@maisondepoupee.co.uk</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-secondary/10 rounded-[2.5rem] border border-secondary/20">
                            <h3 className="text-xl font-black uppercase tracking-widest text-primary mb-6">Socials</h3>
                            <div className="flex gap-4">
                                <a
                                    href="https://www.instagram.com/deena.osmann?igsh=MW1vY2ZnbWsybjJsNg%3D%3D"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-4 bg-white rounded-2xl border border-secondary text-primary font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-primary hover:text-white transition-all"
                                >
                                    <Instagram className="w-4 h-4" />
                                    Instagram
                                </a>
                                <a
                                    href="https://www.tiktok.com/@deenaosmannn?_t=ZN-90jk1i8x66Y&_r=1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-4 bg-white rounded-2xl border border-secondary text-primary font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-primary hover:text-white transition-all"
                                >
                                    <TikTok className="w-4 h-4" />
                                    TikTok
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-secondary shadow-2xl relative">
                        <div className="absolute top-0 right-10 -translate-y-1/2 p-4 bg-primary rounded-2xl text-white shadow-xl">
                            <Mail className="w-6 h-6" />
                        </div>

                        <h3 className="text-2xl font-black uppercase tracking-tighter text-primary mb-10">Send a Message</h3>

                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Full Name</label>
                                    <input type="text" className="w-full px-6 py-5 bg-secondary/5 rounded-2xl border border-secondary focus:border-primary focus:outline-none font-bold" placeholder="Jane Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Email Address</label>
                                    <input type="email" className="w-full px-6 py-5 bg-secondary/5 rounded-2xl border border-secondary focus:border-primary focus:outline-none font-bold" placeholder="jane@example.com" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Subject</label>
                                <select className="w-full px-6 py-5 bg-secondary/5 rounded-2xl border border-secondary focus:border-primary focus:outline-none font-bold appearance-none">
                                    <option>General Inquiry</option>
                                    <option>Booking Modification</option>
                                    <option>Feedback</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Message</label>
                                <textarea rows={5} className="w-full px-6 py-5 bg-secondary/5 rounded-2xl border border-secondary focus:border-primary focus:outline-none font-bold resize-none" placeholder="Your message here..."></textarea>
                            </div>

                            <button className="w-full py-6 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:shadow-2xl hover:shadow-primary/40 transition-all flex items-center justify-center gap-3 group">
                                Send Inquiry
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
