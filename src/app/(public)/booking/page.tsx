"use client";

import { useState, useEffect } from "react";
import {
  Scissors, Sparkles, Heart, Clock, ChevronRight,
  User, Star, Zap, ShoppingBag, Trash2,
  Users, Calendar as CalendarIcon, Wallet, ArrowLeft,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import BookingProgress from "@/components/BookingProgress";
import BookingCalendar from "@/components/BookingCalendar";
import PaymentGateway from "@/components/PaymentGateway";

interface Service {
  id: string;
  category_id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

interface Category {
  id: string;
  name: string;
  icon_name: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  Sparkles,
  Scissors,
  Star,
  Zap,
  User
};

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  const [logistics, setLogistics] = useState({
    isGroup: false,
    groupSize: 1,
    date: "",
    time: ""
  });

  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    phone: ""
  });

  const [paymentChoice, setPaymentChoice] = useState<'deposit' | 'full'>('deposit');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: catData, error: catError } = await supabase.from('categories').select('*').order('name');
        const { data: servData, error: servError } = await supabase.from('services').select('*').order('name');

        if (catError) throw catError;
        if (servError) throw servError;

        if (catData) {
          setCategories(catData);
          if (catData.length > 0) setSelectedCategoryId(catData[0].id);
        }
        if (servData) setServices(servData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleService = (service: Service) => {
    if (selectedServices.find(s => s.id === service.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + Number(s.price), 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  const filteredServices = services.filter(s => s.category_id === selectedCategoryId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <BookingProgress currentStep={step} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="mb-10 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Select Services</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  Discover our collection of premium treatments. You can select multiple services for a complete session.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Category Filter */}
                <div className="space-y-3">
                  {categories.map((category) => {
                    const Icon = ICON_MAP[category.icon_name] || Heart;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategoryId(category.id)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
                          selectedCategoryId === category.id
                            ? "bg-primary text-white shadow-xl shadow-primary/20"
                            : "glass hover:bg-white/5 text-muted-foreground"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-bold text-sm tracking-wide">{category.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Service List */}
                <div className="md:col-span-3 space-y-4">
                  {filteredServices.map((service) => {
                    const isSelected = selectedServices.find(s => s.id === service.id);
                    return (
                      <div
                        key={service.id}
                        onClick={() => toggleService(service)}
                        className={cn(
                          "glass p-6 rounded-3xl flex items-center justify-between gap-6 transition-all duration-500 cursor-pointer group",
                          isSelected ? "border-primary/50 bg-primary/5 shadow-2xl shadow-primary/10" : "hover:border-primary/30"
                        )}
                      >
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{service.name}</h3>
                          <p className="text-muted-foreground text-sm line-clamp-1">{service.description}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-primary/60 bg-primary/5 px-2 py-1 rounded-full">
                              <Clock className="w-3 h-3" />
                              {service.duration} MIN
                            </div>
                            <div className="text-lg font-black tracking-tight">£{service.price}</div>
                          </div>
                        </div>

                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                          isSelected ? "bg-primary text-white scale-110" : "bg-white/5 text-primary group-hover:bg-primary/10"
                        )}>
                          {isSelected ? <ShoppingBag className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </div>
                      </div>
                    );
                  })}
                  {filteredServices.length === 0 && (
                    <div className="text-center py-20 glass rounded-[2rem] text-muted-foreground">
                      No services found in this category.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-black mb-4">Logistics</h1>
                <p className="text-muted-foreground">Is this a solo retreat or a group experience? Every beauty moment is better together.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Individual vs Group */}
                <div
                  onClick={() => setLogistics({ ...logistics, isGroup: false })}
                  className={cn(
                    "glass p-8 rounded-[2rem] cursor-pointer transition-all duration-500 text-center group",
                    !logistics.isGroup ? "border-primary bg-primary/5" : "hover:border-primary/30"
                  )}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Individual Booking</h3>
                  <p className="text-muted-foreground text-sm">Treat yourself to a personalized beauty experience.</p>
                </div>

                <div
                  onClick={() => setLogistics({ ...logistics, isGroup: true })}
                  className={cn(
                    "glass p-8 rounded-[2rem] cursor-pointer transition-all duration-500 text-center group",
                    logistics.isGroup ? "border-primary bg-primary/5" : "hover:border-primary/30"
                  )}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Group Booking</h3>
                  <p className="text-muted-foreground text-sm">Book multiple slots for your friends or family.</p>
                  {logistics.isGroup && (
                    <div className="mt-6 flex items-center justify-center gap-4 animate-in fade-in duration-500">
                      <input
                        type="number"
                        min="2"
                        max="10"
                        value={logistics.groupSize}
                        onChange={(e) => setLogistics({ ...logistics, groupSize: parseInt(e.target.value) })}
                        className="w-20 bg-white/5 border border-primary/20 rounded-xl px-4 py-2 text-center font-bold"
                      />
                      <span className="text-sm font-bold text-primary/60">PEOPLE</span>
                    </div>
                  )}
                </div>
              </div>

              <BookingCalendar
                serviceName={`${selectedServices.length} Selected Services`}
                onBack={() => setStep(1)}
                onSelect={(date, time) => {
                  setLogistics({ ...logistics, date, time });
                  setStep(3);
                }}
              />
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl mx-auto space-y-10">
              <div className="text-center">
                <h1 className="text-4xl font-black mb-4">Your Profile</h1>
                <p className="text-muted-foreground">Almost ready. We just need a few details to finalize your reservation.</p>
              </div>

              <div className="glass p-10 rounded-[2.5rem] space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-primary/40 ml-4 tracking-widest">Full Name</label>
                  <input
                    type="text"
                    placeholder="Deena Osman"
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-primary/40 ml-4 tracking-widest">Email Address</label>
                  <input
                    type="email"
                    placeholder="hello@maisondepoupee.com"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-primary/40 ml-4 tracking-widest">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+44 20 1234 5678"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                  />
                </div>

                <button
                  disabled={!customer.fullName || !customer.email || !customer.phone}
                  onClick={() => setStep(4)}
                  className="w-full bg-primary hover:bg-primary/90 text-white p-5 rounded-2xl font-black tracking-widest uppercase text-sm mt-4 shadow-xl shadow-primary/20 transition-all disabled:opacity-30"
                >
                  Review Summary
                </button>
              </div>

              <button onClick={() => setStep(2)} className="w-full text-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest">
                <ArrowLeft className="w-3 h-3" />
                Back to Calendar
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-black mb-4">Summary</h1>
                <p className="text-muted-foreground">Please review your booking request details before proceeding to payment.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Services Review */}
                <div className="glass p-10 rounded-[2.5rem] space-y-8">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary/40 mb-6">Selected Services</h3>
                    <div className="space-y-4">
                      {selectedServices.map(s => (
                        <div key={s.id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                          <span className="font-bold">{s.name}</span>
                          <span className="font-black">£{s.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                    <span className="text-xl font-black">Total Price</span>
                    <span className="text-3xl font-black tracking-tighter text-primary">£{totalPrice}</span>
                  </div>
                </div>

                {/* Right: Personal & Time Review */}
                <div className="space-y-8">
                  <div className="glass p-8 rounded-[2rem] flex items-center gap-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <CalendarIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Date & Time</p>
                      <p className="text-lg font-black">{logistics.date} at {logistics.time}</p>
                    </div>
                  </div>

                  <div className="glass p-8 rounded-[2rem] flex items-center gap-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Client Details</p>
                      <p className="text-lg font-black">{customer.fullName}</p>
                      <p className="text-muted-foreground text-sm">{customer.email}</p>
                    </div>
                  </div>

                  <div className="glass p-8 rounded-[2rem] flex items-center gap-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Booking Type</p>
                      <p className="text-lg font-black">{logistics.isGroup ? `Group of ${logistics.groupSize}` : "Individual Booking"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <button onClick={() => setStep(3)} className="bg-white/5 hover:bg-white/10 text-primary-foreground px-12 py-5 rounded-2xl font-black tracking-widest uppercase text-sm flex-1 transition-all">
                  Edit Details
                </button>
                <button onClick={() => setStep(5)} className="bg-primary hover:bg-primary/90 text-white px-12 py-5 rounded-2xl font-black tracking-widest uppercase text-sm flex-[2] shadow-xl shadow-primary/20 transition-all">
                  Proceed to Payment
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-black mb-4 tracking-tight">Final Step: Secure Payment</h1>
                <p className="text-muted-foreground">Select your preferred payment option below to secure your booking.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div
                  onClick={() => setPaymentChoice('deposit')}
                  className={cn(
                    "glass p-10 rounded-[2.5rem] cursor-pointer transition-all duration-500 group relative overflow-hidden",
                    paymentChoice === 'deposit' ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "hover:border-primary/20"
                  )}
                >
                  <div className="flex justify-between items-start mb-10">
                    <div className="p-4 bg-primary/10 rounded-2xl">
                      <Wallet className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform" />
                    </div>
                    {paymentChoice === 'deposit' && (
                      <div className="bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Selected</div>
                    )}
                  </div>
                  <h3 className="text-2xl font-black mb-2 tracking-tight">Pay 50% Deposit</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">Secure your appointment today and pay the remaining balance at the salon for maximum flexibility.</p>
                  <div className="text-4xl font-black tracking-tighter text-primary">£{(totalPrice / 2).toFixed(2)}</div>
                </div>

                <div
                  onClick={() => setPaymentChoice('full')}
                  className={cn(
                    "glass p-10 rounded-[2.5rem] cursor-pointer transition-all duration-500 group relative overflow-hidden",
                    paymentChoice === 'full' ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "hover:border-primary/20"
                  )}
                >
                  <div className="flex justify-between items-start mb-10">
                    <div className="p-4 bg-primary/10 rounded-2xl">
                      <Star className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform" />
                    </div>
                    {paymentChoice === 'full' && (
                      <div className="bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Selected</div>
                    )}
                  </div>
                  <h3 className="text-2xl font-black mb-2 tracking-tight">Full Payment</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">Enjoy a seamless, cashless experience at the salon by completing your payment in full right now.</p>
                  <div className="text-4xl font-black tracking-tighter text-primary">£{totalPrice}</div>
                </div>
              </div>

              <div className="max-w-xl mx-auto pt-10">
                <PaymentGateway
                  onBack={() => setStep(4)}
                  bookingDetails={{
                    isGroup: logistics.isGroup,
                    groupSize: logistics.groupSize,
                    date: logistics.date,
                    time: logistics.time,
                    services: selectedServices,
                    totalPrice: totalPrice,
                    paymentChoice: paymentChoice,
                    paymentAmount: paymentChoice === 'deposit' ? totalPrice / 2 : totalPrice,
                    customer: customer
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Floating Sidebar (Basket) - Visible on Step 1 */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-6">
          {selectedServices.length > 0 && (
            <div className="glass p-8 rounded-[2.5rem] border-primary/20 animate-in slide-in-from-right-4 duration-700 shadow-2xl shadow-primary/5 overflow-hidden relative">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-secondary/10 rounded-full -ml-10 -mb-10 blur-2xl opacity-50" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-primary p-2.5 rounded-xl text-white">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-widest text-primary">Your Selection</h2>
                </div>

                <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedServices.map((service) => (
                    <div key={service.id} className="flex justify-between items-center group animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="flex-1">
                        <p className="font-bold text-sm tracking-tight leading-tight mb-1">{service.name}</p>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">£{service.price}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleService(service);
                        }}
                        className="p-2.5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-6 border-t border-primary/10">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-primary/40">
                    <span>Duration</span>
                    <span>{totalDuration} MIN</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black uppercase tracking-widest text-primary/40">Estimated Total</span>
                    <span className="text-3xl font-black tracking-tighter text-primary">£{totalPrice}</span>
                  </div>
                </div>

                {step === 1 && (
                  <button
                    onClick={() => setStep(2)}
                    className="w-full bg-primary hover:bg-primary/90 text-white p-5 rounded-2xl font-black tracking-widest uppercase text-xs mt-8 shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 group"
                  >
                    Choose Date
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          )}

          {selectedServices.length === 0 && (
            <div className="glass p-10 rounded-[2.5rem] border-white/5 text-center space-y-6">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8 text-white/20" />
              </div>
              <p className="text-sm font-bold text-muted-foreground leading-relaxed">Select one or more services to start your booking journey.</p>
            </div>
          )}

          <div className="glass p-6 rounded-[2rem] border-primary/10 flex items-start gap-4">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground/80 leading-relaxed font-semibold italic">
              Cancellations must be made 24 hours in advance. Deposits are transferable but non-refundable for late cancellations.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
