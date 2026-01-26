'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, Send } from 'lucide-react';
import { useState } from 'react';

interface IncidentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function IncidentModal({ isOpen, onClose }: IncidentModalProps) {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // Simulate API call
        setTimeout(() => {
            setSubmitted(false);
            onClose();
        }, 2000);
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
                                            <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500/50">
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
                                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                        >
                                            <Send className="w-4 h-4" />
                                            Submit Report
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
                                        We have received your report. The reference ID is #INC-2026-889. Payments have been frozen pending investigation.
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
