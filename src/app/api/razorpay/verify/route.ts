import crypto from 'crypto';
import { NextResponse } from 'next/server';

import { initializeApp, getApps, applicationDefault } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

const adminApp = getApps().length ? getApps()[0] : initializeApp({ credential: applicationDefault() });
const adminDb = getFirestore(adminApp);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            bookingId,
            amount,
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
        } = body;

        if (!bookingId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 });
        }

        const key_secret = process.env.RAZORPAY_KEY_SECRET;
        if (!key_secret) {
            return NextResponse.json({ error: 'Razorpay secret missing' }, { status: 500 });
        }

        const generated = crypto
            .createHmac('sha256', key_secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generated !== razorpay_signature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        const bookingRef = adminDb.collection('bookings').doc(bookingId);
        const bookingSnap = await bookingRef.get();
        if (!bookingSnap.exists) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        const booking = bookingSnap.data() as any;
        const serviceFee = 500;
        const totalPaid = Number(amount) || (booking.fee || 0) + serviceFee;

        await bookingRef.set(
            {
                status: 'Confirmed',
                paymentStatus: 'escrowed',
                paymentOrderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                paymentSignature: razorpay_signature,
                paymentAmount: totalPaid,
                serviceFee,
                paidAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true }
        );

        await adminDb.collection('transactions').add({
            artistId: booking.artistId,
            clientId: booking.clientId,
            clientName: booking.clientName || 'Client',
            bookingId,
            amount: booking.fee || 0,
            type: 'Gig Payment',
            status: 'Processing',
            createdAt: FieldValue.serverTimestamp(),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Verify error:', error);
        return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
    }
}
