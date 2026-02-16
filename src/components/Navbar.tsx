"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const pathname = usePathname();

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Booking", href: "/booking" },
        { name: "About Us", href: "/about" },
        { name: "Contact Us", href: "/contact" },
        { name: "Careers", href: "/careers" },
        { name: "Meet Deena", href: "/owner" },
    ];

    const leftLinks = navLinks.slice(0, 3);
    const rightLinks = navLinks.slice(3);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-secondary/20 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-28 flex items-center justify-between">
                {/* Desktop Layout - Left Links */}
                <div className="hidden md:flex flex-1 items-center justify-end gap-12 lg:gap-16 pr-8 lg:pr-12">
                    {leftLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:text-primary whitespace-nowrap",
                                pathname === link.href ? "text-primary" : "text-primary/40"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Centered Logo */}
                <div className="flex shrink-0 items-center justify-center">
                    <Link href="/">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/20 transition-all duration-500" />
                            <div className="relative p-2 flex items-center justify-center">
                                <img src="/logox.png" alt="Maison DE POUPÉE" className="h-14 md:h-20 w-auto object-contain" />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Desktop Layout - Right Links */}
                <div className="hidden md:flex flex-1 items-center justify-start gap-12 lg:gap-16 pl-8 lg:pr-12">
                    {rightLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:text-primary whitespace-nowrap",
                                pathname === link.href ? "text-primary" : "text-primary/40"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Mobile Indicator / Menu Placeholder */}
                <div className="md:hidden flex-1 flex justify-end">
                    {/* Mobile menu could be added here if needed */}
                </div>
            </div>
        </nav>
    );
}
