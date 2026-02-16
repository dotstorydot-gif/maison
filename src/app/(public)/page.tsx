"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, Star, ChevronRight, Quote } from "lucide-react";

export default function HomePage() {
    const services = [
        {
            title: "Body",
            text: "Your body is your power-honor it with treatments designed to sculpt, soothe, and contour your shape. Indulge in expert massages and specialized care to shine within.",
            video: "https://maisondepoupee.co.uk/wp-content/uploads/2024/10/Body-Contour.mp4",
            type: "video",
        },
        {
            title: "Skin Care",
            text: "Your skin tells your story-let it glow with confidence, no makeup needed. Our skincare treatments heal, protect, and prevent aging, embrace your beauty naturally.",
            image: "https://maisondepoupee.co.uk/wp-content/uploads/2025/03/Face.jpg",
            type: "image",
        },
        {
            title: "Hair",
            text: "Your hair is your crown-wear it with confidence and grace. From the perfect cut to flawless styling and luxurious extensions, we create a look that's uniquely yours. Because when you feel your best, you shine unapologetically!",
            video: "https://maisondepoupee.co.uk/wp-content/uploads/2024/10/Nails.mp4",
            type: "video",
        },
        {
            title: "Nails",
            text: "Your nails are a reflection of your femininity-let them shine with care and the finest products. From nourishing treatments to the perfect style, we craft a look that complements your unique beauty. Walk out with confidence, knowing your nails are as bold and elegant as you are!",
            video: "https://maisondepoupee.co.uk/wp-content/uploads/2024/10/Nails.mp4",
            type: "video",
        },
        {
            title: "Eye lashes",
            text: "Let your eyes do the talking with luxurious, voluminous lashes that enhance your natural beauty. From classic elegance to bold drama, our expert lash artists create the perfect look for you. Feel confident, radiant, and effortlessly glamorous-because your beauty deserves to shine!",
            image: "https://maisondepoupee.co.uk/wp-content/uploads/2025/02/Screenshot-2025-02-15-at-6.41.19%E2%80%AFPM.png",
            type: "image",
        },
        {
            title: "Semi Permanent Makeup",
            text: "Enhance your natural beauty effortlessly with semi-permanent makeup-flawless brows, defined eyes. Wake up every day with confidence, knowing your features are perfectly shaped and beautifully enhanced.",
            icon: "face",
        },
        {
            title: "Aesthetics",
            text: "Elevate your beauty with advanced aesthetic treatments designed to enhance, rejuvenate, and empower. From skin-perfecting solutions to non-invasive enhancements, we bring out your natural glow with expert care.",
            image: "https://maisondepoupee.co.uk/wp-content/uploads/2025/03/aser.jpg",
            type: "image",
        }
    ];

    return (
        <div className="animate-in bg-white">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Banner Background */}
                <div className="absolute inset-0 z-0 bg-black">
                    <div className="absolute inset-0 bg-black/30 z-10" />
                    <Image
                        src="/10.jpg"
                        alt="Maison DE POUPÉE Banner"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="max-w-5xl mx-auto px-6 text-center relative z-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-white mb-6 border border-white/20">
                        <Sparkles className="w-3 h-3 text-primary" />
                        The Dollhouse of Elegance
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-white mb-4">
                        MAISON DE <br />
                        <span className="text-primary italic animate-pulse">POUPÉE</span>
                    </h1>

                    {/* Logo under text as requested */}
                    <div className="flex justify-center mb-8">
                        <Image src="/logox.png" alt="Maison Logo" width={161} height={242} className="w-24 h-auto opacity-90 drop-shadow-lg" />
                    </div>

                    <p className="max-w-xl mx-auto text-lg font-light text-white/90 leading-relaxed mb-10 italic">
                        Where beauty meets empowerment, and every woman is treated like royalty.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-5">
                        <Link
                            href="/booking"
                            className="group flex items-center gap-4 px-8 py-4 bg-primary text-white rounded-full text-xs font-black uppercase tracking-widest hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105"
                        >
                            Reserve Your Throne
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/about"
                            className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                        >
                            The Experience
                        </Link>
                    </div>
                </div>
            </section>

            {/* Showcase Sections */}
            <section className="py-20 space-y-24">
                {services.map((service, index) => (
                    <div key={service.title} className="max-w-6xl mx-auto px-6">
                        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                            {/* Media Side */}
                            <div className={`relative group ${index % 2 === 1 ? 'lg:order-2' : ''} flex justify-center`}>
                                <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-xl group-hover:bg-primary/10 transition-all duration-700" />
                                {/* Enforced 9:16 Aspect Ratio Container */}
                                <div className="relative rounded-[2rem] overflow-hidden border border-secondary shadow-xl w-full max-w-sm aspect-[9/16] bg-secondary/5">
                                    {service.type === 'video' ? (
                                        <video
                                            className="w-full h-full object-cover"
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                        >
                                            <source src={service.video} type="video/mp4" />
                                        </video>
                                    ) : service.type === 'image' && service.image ? (
                                        <Image
                                            src={service.image}
                                            alt={service.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center p-10 text-center bg-gradient-to-br from-white to-secondary/10">
                                            <div className="space-y-4">
                                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
                                                    <Star className="w-8 h-8 text-primary" />
                                                </div>
                                                <h3 className="text-2xl font-black uppercase tracking-widest text-primary/40 leading-relaxed">{service.title}</h3>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="space-y-6 text-center lg:text-left">
                                <div className="space-y-3">
                                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-primary leading-none">
                                        {service.title}.
                                    </h2>
                                    <div className="h-1 w-16 bg-primary/20 rounded-full mx-auto lg:mx-0" />
                                </div>
                                <p className="text-lg font-light text-primary/70 leading-relaxed italic max-w-md mx-auto lg:mx-0">
                                    {service.text}
                                </p>
                                <Link
                                    href="/booking"
                                    className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary group pt-2"
                                >
                                    Book This Service
                                    <div className="w-8 h-8 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                        <ChevronRight className="w-3 h-3" />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Final CTA */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary -z-10" />
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />

                <div className="max-w-4xl mx-auto px-6 text-center text-white space-y-12">
                    <Quote className="w-20 h-20 text-white/10 mx-auto" />
                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter">
                        Ready to feeling <br />
                        <span className="italic opacity-40 uppercase">Unstoppable?</span>
                    </h2>
                    <p className="text-xl font-light opacity-80 italic">
                        Step into our dollhouse of elegance and walk out feeling like the princess you truly are.
                    </p>
                    <Link
                        href="/booking"
                        className="inline-flex px-12 py-6 bg-white text-primary rounded-[2.5rem] text-sm font-black uppercase tracking-widest hover:scale-110 transition-all shadow-2xl hover:bg-secondary/10"
                    >
                        Begin Your Transformation
                    </Link>
                </div>
            </section>
        </div>
    );
}
