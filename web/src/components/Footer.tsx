"use client";

import Link from "next/link";
import { Instagram, Music2 as TikTok, Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-secondary py-20">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="space-y-6">
                    <h3 className="text-xl font-black uppercase tracking-widest text-primary">Maison DE POUPÉE</h3>
                    <p className="text-primary/40 text-sm leading-relaxed max-w-xs">
                        Boutique beauty and grooming experience in the heart of London. Dedicated to empowerment and luxury.
                    </p>
                    <div className="flex gap-4">
                        <a
                            href="https://www.instagram.com/deena.osmann?igsh=MW1vY2ZnbWsybjJsNg%3D%3D"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a
                            href="https://www.tiktok.com/@deenaosmannn?_t=ZN-90jk1i8x66Y&_r=1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                        >
                            <TikTok className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/30 mb-6">Navigation</h4>
                    <ul className="space-y-4">
                        {[
                            { name: 'Home', href: '/' },
                            { name: 'Booking', href: '/booking' },
                            { name: 'About Us', href: '/about' },
                            { name: 'Contact Us', href: '/contact' },
                            { name: 'Careers', href: '/careers' },
                            { name: 'Meet Deena', href: '/owner' }
                        ].map(item => (
                            <li key={item.name}>
                                <Link href={item.href} className="text-sm font-bold text-primary/60 hover:text-primary transition-colors">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/30 mb-6">Contact</h4>
                    <ul className="space-y-4">
                        <li className="text-sm font-bold text-primary/60">London, United Kingdom</li>
                        <li className="text-sm font-bold text-primary/60">contact@maisondepoupee.co.uk</li>
                        <li className="text-sm font-bold text-primary/60">+44 (0) 20 1234 5678</li>
                    </ul>
                </div>

                <div className="flex flex-col items-center justify-center md:items-end">
                    <div className="p-8 bg-secondary/5 rounded-[2rem] text-center md:text-right border border-secondary/10">
                        <p className="text-xs font-black uppercase tracking-widest text-primary/40 mb-2">Developed by</p>
                        <div className="font-black text-primary flex items-center gap-2 justify-center md:justify-end">
                            <span>Antigravity AI</span>
                            <Heart className="w-3 h-3 text-red-400 fill-current" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-secondary/20 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/20">
                    © {new Date().getFullYear()} Maison DE POUPÉE. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
}
