'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, MapPin } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    artistId: string;
    artistName: string;
    artistImage: string;
    artistPrice?: number;
}

export default function BookingModal({
    isOpen,
    onClose,
    artistId,
    artistName,
    artistImage,
    artistPrice = 15000,
}: BookingModalProps) {
    const [step, setStep] = useState(1);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState(2);
    const [location, setLocation] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { createBooking } = useAuth();

    const totalPrice = useMemo(() => artistPrice, [artistPrice]);

    // Reset state on close
    const handleClose = () => {
        setStep(1);
        setDate('');
        setTime('');
        setDuration(2);
        setLocation('');
        onClose();
    };

    const handleProceed = () => {
        if (!date || !time || !location) return;
        setStep(2);
    };

    const handleConfirmBooking = async () => {
        if (submitting) return;
        setSubmitting(true);
        await createBooking({
            artistId,
            artistName,
            artistImage,
            date,
            time,
            durationHours: duration,
            location,
            fee: totalPrice,
            status: 'Pending',
        });
        setSubmitting(false);
        setStep(3);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                                <h2 className="text-xl font-bold text-white">Book {artistName}</h2>
                                <button
                                    onClick={handleClose}
                                    className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-6">
                                {/* Simulated Form Step */}
                                {step === 1 ? (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-white/80">Event Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                                <input
                                                    type="date"
                                                    value={date}
                                                    onChange={(event) => setDate(event.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pl-10 py-3 text-white outline-none focus:border-accent/50 transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-white/80">Start Time</label>
                                                <div className="relative">
                                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                                    <input
                                                        type="time"
                                                        value={time}
                                                        onChange={(event) => setTime(event.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pl-10 py-3 text-white outline-none focus:border-accent/50 transition-colors"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-white/80">Duration (Hrs)</label>
                                                <input
                                                    type="number"
                                                    placeholder="2"
                                                    value={duration}
                                                    min={1}
                                                    onChange={(event) => setDuration(Number(event.target.value || 1))}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent/50 transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-white/80">Event Location</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                                <input
                                                    type="text"
                                                    placeholder="Enter venue address"
                                                    value={location}
                                                    onChange={(event) => setLocation(event.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pl-10 py-3 text-white outline-none focus:border-accent/50 transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : step === 2 ? (
                                    <div className="space-y-6">
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                            <h3 className="text-white font-bold mb-2">Payment Summary</h3>
                                            <div className="flex justify-between text-white/60 text-sm mb-1">
                                                <span>Artist Fee ({duration} Hours)</span>
                                                <span>₹{totalPrice.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-white/60 text-sm mb-1">
                                                <span>Service Fee</span>
                                                <span>₹500</span>
                                            </div>
                                            <div className="border-t border-white/10 my-2 pt-2 flex justify-between text-white font-bold">
                                                <span>Total to Pay</span>
                                                <span>₹{(totalPrice + 500).toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex gap-3">
                                            <div className="mt-1">
                                                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                                    <span className="text-black text-xs font-bold">✓</span>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-green-400 font-bold text-sm">Escrow Protected</h4>
                                                <p className="text-green-400/60 text-xs mt-1">
                                                    Your payment is held securely in escrow. It is only released to the artist
                                                    <strong> after</strong> the event is successfully completed.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <div className="w-8 h-8 rounded-full bg-green-500" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Booking Confirmed!</h3>
                                        <p className="text-white/60 text-sm">
                                            Payment secured. The artist has been notified.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-white/10 bg-white/5">
                                {step === 1 ? (
                                    <button
                                        onClick={handleProceed}
                                        disabled={!date || !time || !location}
                                        className="w-full py-3 bg-accent hover:bg-accent-light text-white font-bold rounded-xl transition-all shadow-lg shadow-accent/20"
                                    >
                                        Proceed to Payment
                                    </button>
                                ) : step === 2 ? (
                                    <button
                                        onClick={handleConfirmBooking}
                                        disabled={submitting}
                                        className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-500/20"
                                    >
                                        {submitting ? 'Booking...' : 'Pay Securely & Book'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleClose}
                                        className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
                                    >
                                        Close
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
