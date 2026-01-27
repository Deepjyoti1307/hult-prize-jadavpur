'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import {
    Phone,
    Shield,
    AlertTriangle,
    ArrowLeft,
    User,
    Siren,
    Heart,
    X,
    ChevronRight,
} from 'lucide-react';

// Emergency contacts - In production, these would come from user settings
const POLICE_NUMBER = '100';
const AMBULANCE_NUMBER = '102';
const WOMEN_HELPLINE = '1091';

interface EmergencyContact {
    id: string;
    name: string;
    relation: string;
    phone: string;
}

// Mock emergency contacts - Would come from user profile
const mockEmergencyContacts: EmergencyContact[] = [
    { id: '1', name: 'Mom', relation: 'Mother', phone: '+91 98765 43210' },
    { id: '2', name: 'Dad', relation: 'Father', phone: '+91 98765 43211' },
];

function EmergencyButton({
    icon: Icon,
    label,
    sublabel,
    phone,
    color,
    onClick,
}: {
    icon: React.ElementType;
    label: string;
    sublabel?: string;
    phone: string;
    color: 'red' | 'blue' | 'purple';
    onClick: () => void;
}) {
    const colorClasses = {
        red: 'from-red-500 to-red-600 shadow-red-500/50 hover:shadow-red-500/70',
        blue: 'from-blue-500 to-blue-600 shadow-blue-500/50 hover:shadow-blue-500/70',
        purple: 'from-purple-500 to-purple-600 shadow-purple-500/50 hover:shadow-purple-500/70',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`w-full bg-gradient-to-r ${colorClasses[color]} p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-4`}
        >
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Icon className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-left">
                <p className="text-white font-bold text-lg">{label}</p>
                {sublabel && <p className="text-white/80 text-sm">{sublabel}</p>}
                <p className="text-white/60 text-xs mt-1">{phone}</p>
            </div>
            <ChevronRight className="w-6 h-6 text-white/60" />
        </motion.button>
    );
}

export default function EmergencyPage() {
    const router = useRouter();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedCall, setSelectedCall] = useState<{ label: string; phone: string } | null>(null);
    const [emergencyContacts] = useState<EmergencyContact[]>(mockEmergencyContacts);

    const handleCall = (label: string, phone: string) => {
        setSelectedCall({ label, phone });
        setShowConfirmModal(true);
    };

    const confirmCall = () => {
        if (selectedCall) {
            // Use tel: protocol to initiate phone call
            window.location.href = `tel:${selectedCall.phone.replace(/\s/g, '')}`;
        }
        setShowConfirmModal(false);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
            {/* Animated background pulse */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Header */}
            <header className="relative z-10 p-6 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                    <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white">Emergency Help</h1>
                    <p className="text-white/60 text-sm">Get immediate assistance</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 px-6 pb-8 max-w-2xl mx-auto space-y-8">
                {/* Big Emergency Button - Movie Style */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-8"
                >
                    <p className="text-white/60 text-sm mb-4 uppercase tracking-wider">Tap for Police Emergency</p>

                    {/* Outer ring animation */}
                    <div className="relative">
                        {/* Pulsing rings */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-44 h-44 rounded-full bg-red-500/20 animate-ping" style={{ animationDuration: '2s' }} />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 rounded-full bg-red-500/10 animate-ping" style={{ animationDuration: '2.5s' }} />
                        </div>

                        {/* Main button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCall('Police Emergency', POLICE_NUMBER)}
                            className="relative w-40 h-40 rounded-full bg-gradient-to-b from-red-500 via-red-600 to-red-700 shadow-[0_10px_40px_rgba(239,68,68,0.5)] hover:shadow-[0_15px_50px_rgba(239,68,68,0.7)] transition-all duration-300 flex items-center justify-center border-4 border-red-400/50 group"
                            style={{
                                boxShadow: 'inset 0 -8px 20px rgba(0,0,0,0.3), inset 0 8px 20px rgba(255,255,255,0.1), 0 10px 40px rgba(239,68,68,0.5)',
                            }}
                        >
                            {/* Inner highlight */}
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-gradient-to-b from-white/30 to-transparent rounded-full blur-sm" />

                            {/* Icon and text */}
                            <div className="flex flex-col items-center">
                                <Siren className="w-12 h-12 text-white mb-2 group-hover:animate-pulse" />
                                <span className="text-white font-bold text-lg">SOS</span>
                            </div>
                        </motion.button>
                    </div>

                    <p className="text-red-400 text-sm mt-6 font-medium">Dial {POLICE_NUMBER}</p>
                </motion.div>

                {/* Quick Emergency Services */}
                <div className="space-y-4">
                    <h2 className="text-white font-semibold flex items-center gap-2">
                        <Shield className="w-5 h-5 text-accent" />
                        Emergency Services
                    </h2>

                    <div className="space-y-3">
                        <EmergencyButton
                            icon={Heart}
                            label="Ambulance"
                            sublabel="Medical Emergency"
                            phone={AMBULANCE_NUMBER}
                            color="red"
                            onClick={() => handleCall('Ambulance', AMBULANCE_NUMBER)}
                        />

                        <EmergencyButton
                            icon={Phone}
                            label="Women Helpline"
                            sublabel="24x7 Support"
                            phone={WOMEN_HELPLINE}
                            color="purple"
                            onClick={() => handleCall('Women Helpline', WOMEN_HELPLINE)}
                        />
                    </div>
                </div>

                {/* Personal Emergency Contacts */}
                <div className="space-y-4">
                    <h2 className="text-white font-semibold flex items-center gap-2">
                        <User className="w-5 h-5 text-accent" />
                        Your Emergency Contacts
                    </h2>

                    {emergencyContacts.length > 0 ? (
                        <div className="space-y-3">
                            {emergencyContacts.map((contact) => (
                                <motion.button
                                    key={contact.id}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => handleCall(contact.name, contact.phone)}
                                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-all flex items-center gap-4"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-accent to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                                        {contact.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-white font-medium">{contact.name}</p>
                                        <p className="text-white/50 text-sm">{contact.relation}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white/60 text-sm">{contact.phone}</span>
                                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                            <Phone className="w-5 h-5 text-green-400" />
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                            <p className="text-white/60">No emergency contacts added yet.</p>
                            <button className="mt-3 text-accent text-sm font-medium hover:underline">
                                Add Emergency Contact
                            </button>
                        </div>
                    )}
                </div>

                {/* Safety Tips */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-yellow-400 font-medium text-sm">Safety Tip</p>
                            <p className="text-white/70 text-sm mt-1">
                                Share your live location with trusted contacts before going to unfamiliar venues. Stay safe!
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showConfirmModal && selectedCall && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                        onClick={() => setShowConfirmModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#1a1a24] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-white">Confirm Call</h3>
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-white/60" />
                                </button>
                            </div>

                            <div className="text-center py-6">
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Phone className="w-10 h-10 text-green-400" />
                                </div>
                                <p className="text-white text-lg font-medium mb-1">Call {selectedCall.label}?</p>
                                <p className="text-white/60 text-2xl font-bold">{selectedCall.phone}</p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmCall}
                                    className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Phone className="w-5 h-5" />
                                    Call Now
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
