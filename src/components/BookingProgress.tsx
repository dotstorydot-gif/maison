"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
    id: number;
    name: string;
}

const STEPS: Step[] = [
    { id: 1, name: "Services" },
    { id: 2, name: "Logistics" },
    { id: 3, name: "Profile" },
    { id: 4, name: "Summary" },
    { id: 5, name: "Payment" },
];

export default function BookingProgress({ currentStep }: { currentStep: number }) {
    return (
        <div className="w-full max-w-4xl mx-auto mb-16 px-4">
            <div className="relative flex justify-between">
                {/* Line Behind */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-secondary/20 -translate-y-1/2 -z-10" />

                {/* Progress Line */}
                <div
                    className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 -z-10 transition-all duration-700 ease-in-out"
                    style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                />

                {STEPS.map((step) => {
                    const isCompleted = currentStep > step.id;
                    const isActive = currentStep === step.id;

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-3">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 border-2",
                                    isCompleted ? "bg-primary border-primary text-white" :
                                        isActive ? "bg-white border-primary text-primary shadow-[0_0_20px_rgba(152,99,90,0.3)]" :
                                            "bg-white border-secondary text-primary/20"
                                )}
                            >
                                {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                            </div>
                            <span
                                className={cn(
                                    "text-[10px] uppercase tracking-[0.2em] font-black transition-colors duration-500",
                                    isActive ? "text-primary" : "text-primary/20"
                                )}
                            >
                                {step.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
