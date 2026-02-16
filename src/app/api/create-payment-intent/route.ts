import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
if (!stripeSecretKey) {
    console.warn('Stripe Secret Key missing. Stripe client will not be initialized correctly.');
}

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-01-27.acacia' as any,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { serviceIds, isDeposit, customerDetails } = body;

        console.log("DEBUG: create-payment-intent received:", { serviceIds, isDeposit, customerDetails });

        if (!serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) {
            console.error("DEBUG: Missing or invalid serviceIds in request body");
            return NextResponse.json({ error: 'Missing serviceIds' }, { status: 400 });
        }

        // 1. Fetch live prices from Supabase
        console.log("DEBUG: Querying Supabase for serviceIds:", serviceIds);
        const { data: services, error: serviceError } = await supabaseAdmin
            .from('services')
            .select('id, price, name')
            .in('id', serviceIds);

        if (serviceError) {
            console.error("DEBUG: Supabase query error:", serviceError);
            return NextResponse.json({ error: 'Database error: ' + serviceError.message }, { status: 500 });
        }

        if (!services || services.length === 0) {
            console.error("DEBUG: No services found for IDs:", serviceIds);
            return NextResponse.json({ error: 'Services not found' }, { status: 404 });
        }

        const totalAmount = services.reduce((sum, s) => sum + Number(s.price), 0);
        const finalAmount = isDeposit ? totalAmount / 2 : totalAmount;

        console.log("DEBUG: Total price:", totalAmount, "Final (calc) price:", finalAmount);

        // 2. Create Stripe Payment Intent
        try {
            console.log("DEBUG: Creating Stripe Payment Intent for amount (cents):", Math.round(finalAmount * 100));
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(finalAmount * 100),
                currency: 'gbp',
                metadata: {
                    serviceIds: serviceIds.join(','),
                    serviceNames: services.map(s => s.name).join(', '),
                    customerEmail: customerDetails?.email || 'N/A'
                },
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            console.log("DEBUG: Stripe Payment Intent created:", paymentIntent.id);

            return NextResponse.json({
                clientSecret: paymentIntent.client_secret,
                amount: finalAmount
            });
        } catch (stripeErr: any) {
            console.error("DEBUG: Stripe SDK error:", stripeErr);
            return NextResponse.json({ error: 'Stripe error: ' + stripeErr.message }, { status: 500 });
        }

    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error("DEBUG: Unexpected error in API route:", err);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
