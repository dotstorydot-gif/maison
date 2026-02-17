"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { CreditCard, Lock, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, ShoppingBag, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Service {
    id: string;
    category_id: string;
    name: string;
    duration: number;
    price: number;
    description: string;
}

interface PaymentGatewayProps {
    onBack: () => void;
    bookingDetails: {
        isGroup: boolean;
        groupSize: number;
        date: string;
        time: string;
        services: Service[];
        totalPrice: number;
        paymentChoice: 'deposit' | 'full';
        paymentAmount: number;
        customer: {
            fullName: string;
            email: string;
            phone: string;
        };
    };
}

export default function PaymentGateway({ onBack, bookingDetails }: PaymentGatewayProps) {
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const handleInitialSubmit = useCallback(async () => {
        setIsProcessing(true);
        setError(null);
        try {
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceIds: bookingDetails.services.map(s => s.id),
                    isDeposit: bookingDetails.paymentChoice === 'deposit',
                    customerDetails: { email: bookingDetails.customer.email }
                }),
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setClientSecret(data.clientSecret);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Initialization failed";
            setError(message);
        } finally {
            // Processing handled by Stripe transition
        }
    }, [bookingDetails.services, bookingDetails.paymentChoice, bookingDetails.customer.email]);

    useEffect(() => {
        if (!clientSecret) {
            handleInitialSubmit();
        }
    }, [clientSecret, handleInitialSubmit]);

    if (isSuccess) {
        return (
            <div className="animate-in flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20">
                    <CheckCircle2 className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-3xl font-black mb-4 tracking-tight">Booking Confirmed!</h2>
                <p className="text-muted-foreground max-w-md mb-12 text-lg">
                    Thank you, <span className="text-primary font-bold">{bookingDetails.customer.fullName}</span>.
                    We&apos;ve reserved your session for <span className="text-primary font-bold">{bookingDetails.date}</span> at <span className="text-primary font-bold">{bookingDetails.time}</span>.
                </p>

                <div className="glass p-8 rounded-[2rem] w-full max-w-md mb-12 text-left space-y-4">
                    <div className="flex items-center gap-3 text-primary/40 text-[10px] font-black uppercase tracking-widest mb-2">
                        <ShoppingBag className="w-3 h-3" />
                        Reserved Services
                    </div>
                    {bookingDetails.services.map(s => (
                        <div key={s.id} className="flex justify-between items-center text-sm font-bold">
                            <span>{s.name}</span>
                            <span>£{s.price}</span>
                        </div>
                    ))}
                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-widest text-primary/40">Total Paid Today</span>
                        <span className="text-2xl font-black tracking-tighter text-primary">£{bookingDetails.paymentAmount.toFixed(2)}</span>
                    </div>
                </div>

                <button
                    onClick={() => window.location.href = '/'}
                    className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-2xl transition-all font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20"
                >
                    Return Home
                </button>
            </div>
        );
    }

    const renderContent = () => (
        <div className="animate-in space-y-8">
            <header className="flex items-center gap-4">
                <button onClick={onBack} className="p-3 hover:bg-white/5 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div>
                    <h2 className="text-3xl font-black tracking-tight mb-1">Checkout</h2>
                    <p className="text-primary/40 font-black uppercase tracking-widest text-[10px]">Elegance in Every Detail</p>
                </div>
            </header>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl flex items-center gap-3 text-red-500 animate-in">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm font-bold">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7 space-y-8">
                    <div className="glass p-10 rounded-[3rem] space-y-10 relative overflow-hidden border-primary/20 shadow-2xl">
                        {/* Background Shine */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl" />

                        <div className="flex items-center justify-between relative">
                            <h3 className="text-2xl font-black flex items-center gap-4 tracking-tight">
                                <CreditCard className="w-8 h-8 text-primary" />
                                Payment Method
                            </h3>
                            <div className="flex items-center gap-2 group">
                                <Lock className="w-4 h-4 text-primary/40" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/40">Secure Checkout</span>
                            </div>
                        </div>

                        <div className="space-y-6 relative">
                            {clientSecret ? (
                                <div className="space-y-4 animate-in">
                                    <PaymentElement />
                                </div>
                            ) : (
                                <div className="p-12 glass rounded-[2.5rem] flex flex-col items-center justify-center gap-6 animate-pulse">
                                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Initializing Secure Transaction...</p>
                                </div>
                            )}
                        </div>

                        <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-8 relative">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                                    <Lock className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Encryption</p>
                                    <p className="text-xs font-bold">256-bit SSL Protected</p>
                                </div>
                            </div>
                            <Image
                                src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                                alt="Stripe"
                                className="h-7 opacity-30 grayscale brightness-150 transition-opacity hover:opacity-100"
                                width={70}
                                height={30}
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-12 xl:col-span-5 space-y-8">
                    <div className="glass p-10 rounded-[3rem] border-primary/20 bg-primary/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full -ml-32 -mb-32 blur-3xl" />

                        <div className="relative space-y-8">
                            <div className="flex items-center gap-3 text-primary/40 text-[11px] font-black uppercase tracking-[0.2em]">
                                <ShoppingBag className="w-4 h-4" />
                                Reservation Summary
                            </div>

                            <div className="space-y-4">
                                {bookingDetails.services.map(s => (
                                    <div key={s.id} className="flex justify-between items-start group">
                                        <div className="max-w-[70%]">
                                            <p className="font-black text-sm leading-tight mb-1 group-hover:text-primary transition-colors">{s.name}</p>
                                            <p className="text-[10px] text-muted-foreground/60 font-medium uppercase">{s.duration} MIN</p>
                                        </div>
                                        <span className="font-black text-sm">£{s.price}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-primary/10 space-y-4">
                                <div className="flex flex-col gap-1 text-primary/60">
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] mb-1">Appointment Schedule</span>
                                    <div className="flex items-center gap-2 text-xs font-bold bg-primary/5 p-3 rounded-xl border border-primary/10">
                                        <Calendar className="w-3.5 h-3.5 text-primary" />
                                        <span>{bookingDetails.date} • {bookingDetails.time}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Subtotal</span>
                                    <span className="text-sm font-black opacity-40">£{bookingDetails.totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between items-center bg-primary text-white p-6 rounded-2xl shadow-xl shadow-primary/10 gap-x-6 gap-y-3 min-h-[100px] sm:min-h-[80px]">
                                    <div className="flex flex-col text-center sm:text-left space-y-0.5">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Amount Due Now</span>
                                        <span className="text-[10px] font-bold italic opacity-50 leading-tight">
                                            {bookingDetails.paymentChoice === 'deposit' ? '50% Security Deposit' : 'Pay in Full'}
                                        </span>
                                    </div>
                                    <span className="text-3xl sm:text-4xl font-black tracking-tighter shrink-0 leading-none py-1">
                                        £{bookingDetails.paymentAmount.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <CheckoutButton
                                clientSecret={clientSecret}
                                bookingDetails={bookingDetails}
                                onSuccess={() => setIsSuccess(true)}
                                onError={setError}
                            />

                            <p className="text-center text-[9px] font-black uppercase tracking-[0.2em] text-primary/20">
                                Clicking authorize confirms your booking
                            </p>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-[2rem] border-primary/10 flex items-center gap-4 bg-white/5 opacity-60">
                        <Calendar className="w-5 h-5 text-primary shrink-0" />
                        <p className="text-[10px] font-bold italic leading-relaxed">
                            A confirmation email will be sent to {bookingDetails.customer.email} instantly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    if (clientSecret) {
        return (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
                {renderContent()}
            </Elements>
        );
    }

    return renderContent();
}

function CheckoutButton({ clientSecret, bookingDetails, onSuccess, onError }: {
    clientSecret: string | null;
    bookingDetails: {
        customer: { email: string; fullName: string; phone: string };
        date: string;
        time: string;
        totalPrice: number;
        paymentChoice: 'deposit' | 'full';
        paymentAmount: number;
        isGroup: boolean;
        groupSize: number;
        services: { id: string }[];
    };
    onSuccess: () => void;
    onError: (msg: string | null) => void;
}) {
    const stripe = useStripe();
    const elements = useElements();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCheckout = async () => {
        if (!stripe || !elements) return;
        setIsSubmitting(true);
        onError(null);

        try {
            const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: 'if_required',
            });

            if (stripeError) throw stripeError;

            // Save to Supabase
            const { data: customerData } = await supabase
                .from('customers')
                .select('id')
                .eq('email', bookingDetails.customer.email)
                .single();

            let customerId = customerData?.id;

            if (!customerId) {
                const { data: newCustomer, error: custError } = await supabase
                    .from('customers')
                    .insert({
                        full_name: bookingDetails.customer.fullName,
                        email: bookingDetails.customer.email,
                        phone: bookingDetails.customer.phone
                    })
                    .select('id')
                    .single();
                if (custError) throw custError;
                customerId = newCustomer?.id;
            }

            const { data: appointment, error: bookingError } = await supabase
                .from('appointments')
                .insert({
                    customer_id: customerId,
                    appointment_date: bookingDetails.date,
                    start_time: bookingDetails.time,
                    end_time: bookingDetails.time,
                    total_amount: bookingDetails.totalPrice,
                    deposit_amount: bookingDetails.paymentChoice === 'deposit' ? bookingDetails.paymentAmount : 0,
                    payment_choice: bookingDetails.paymentChoice,
                    status: 'confirmed',
                    payment_status: bookingDetails.paymentChoice === 'full' ? 'paid' : 'partially_paid',
                    is_group_booking: bookingDetails.isGroup,
                    group_size: bookingDetails.groupSize,
                    stripe_payment_intent_id: paymentIntent?.id
                })
                .select('id')
                .single();

            if (bookingError) throw bookingError;

            const serviceLinks = bookingDetails.services.map((s: { id: string }) => ({
                appointment_id: appointment.id,
                service_id: s.id
            }));

            const { error: linkError } = await supabase
                .from('appointment_services')
                .insert(serviceLinks);

            if (linkError) throw linkError;

            onSuccess();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Payment failed";
            onError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={isSubmitting || !stripe || !clientSecret}
            className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-2xl font-black text-xs sm:text-sm tracking-widest uppercase shadow-2xl shadow-primary/20 transition-all duration-500 flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.98]"
        >
            {isSubmitting ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
                <>
                    Authorize Checkout
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
            )}
        </button>
    );
}
