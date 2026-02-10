'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, Send } from 'lucide-react';
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/auth-context';
import PulsatingDots from '@/components/ui/pulsating-loader';

interface IncidentModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId?: string;
}

export default function IncidentModal({ isOpen, onClose, bookingId }: IncidentModalProps) {
    const { profile } = useAuth();
    const [submitted, setSubmitted] = useState(false);
    const [incidentType, setIncidentType] = useState('Artist No-Show');
    const [description, setDescription] = useState('');
    const [incidentId, setIncidentId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile?.uid) return;

        setIsSubmitting(true);
        try {
            const incidentRef = await addDoc(collection(db, 'incidents'), {
                bookingId: bookingId || null,
                reporterId: profile.uid,
                reporterName: profile.name,
                reporterEmail: profile.email,
                reporterRole: profile.role,
                type: incidentType,
                description,
                status: 'Open',
                priority: incidentType === 'Safety Concern' || incidentType === 'Harassment' ? 'High' : 'Normal',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // Generate a human-readable incident ID
            const year = new Date().getFullYear();
            const shortId = incidentRef.id.slice(-4).toUpperCase();
            setIncidentId(`INC-${year}-${shortId}`);
            setSubmitted(true);

            // Reset and close after showing success
            setTimeout(() => {
                setSubmitted(false);
                setDescription('');
                setIncidentType('Artist No-Show');
                onClose();
            }, 3000);
        } catch (error) {
            console.error('Error submitting incident:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-[#1a1a24] border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden z-[70]"
                        >
                            {!submitted ? (
                                <form onSubmit={handleSubmit} className="p-6">
                                    <div className="flex items-center gap-3 mb-6 text-red-400">
                                        <AlertTriangle className="w-6 h-6" />
                                        <h2 className="text-xl font-bold">Report an Incident</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-white/60 text-sm mb-2">Issue Type</label>
                                            <select
                                                value={incidentType}
                                                onChange={(e) => setIncidentType(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500/50"
                                            >
                                                <option>Artist No-Show</option>
                                                <option>Payment Issue</option>
                                                <option>Safety Concern</option>
                                                <option>Harassment</option>
                                                <option>Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-white/60 text-sm mb-2">Description</label>
                                            <textarea
                                                rows={4}
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500/50 resize-none"
                                                placeholder="Please describe what happened..."
                                                required
                                            />
                                        </div>

                                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                                            <p className="text-red-300 text-xs">
                                                <strong>Note:</strong> Payments are automatically locked when an incident is reported. Our support team will investigate immediately.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            disabled={isSubmitting}
                                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !description.trim()}
                                            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isSubmitting ? (
                                                <div className="scale-75">
                                                    <PulsatingDots />
                                                </div>
                                            ) : (
                                                <Send className="w-4 h-4" />
                                            )}
                                            {isSubmitting ? 'Submitting...' : 'Submit Report'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="p-8 text-center">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <div className="w-8 h-8 rounded-full bg-green-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Report Received</h3>
                                    <p className="text-white/60 text-sm">
                                        We have received your report. The reference ID is <span className="text-white font-mono">#{incidentId}</span>. Payments have been frozen pending investigation.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
