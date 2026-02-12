'use client';

import { motion, AnimatePresence } from 'motion/react';
import {
    X, AlertTriangle, Send, Camera, MapPin, Shield, ChevronRight,
    ChevronLeft, Trash2, Loader2, LocateFixed, AlertOctagon, Phone
} from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/auth-context';
import { uploadIncidentPhoto } from '@/lib/appwrite';
import PulsatingDots from '@/components/ui/pulsating-loader';

interface IncidentModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId?: string;
}

interface LocationData {
    address: string;
    coords: { lat: number; lng: number } | null;
    loading: boolean;
    error: string | null;
}

interface PhotoItem {
    file: File;
    preview: string;
    uploading: boolean;
    uploaded: boolean;
    url?: string;
    fileId?: string;
}

const ISSUE_CATEGORIES = [
    { value: 'Artist No-Show', icon: '🚫', label: 'Artist No-Show', desc: 'Artist did not arrive at the venue' },
    { value: 'Payment Issue', icon: '💳', label: 'Payment Issue', desc: 'Overcharge, refund, or payment failure' },
    { value: 'Safety Concern', icon: '⚠️', label: 'Safety Concern', desc: 'Unsafe conditions at the event or venue' },
    { value: 'Harassment', icon: '🛑', label: 'Harassment', desc: 'Inappropriate behavior or threats' },
    { value: 'Property Damage', icon: '🔨', label: 'Property Damage', desc: 'Equipment or venue damage during event' },
    { value: 'Quality Issue', icon: '📉', label: 'Quality Issue', desc: 'Performance not as described or agreed' },
    { value: 'Late Arrival', icon: '⏰', label: 'Late Arrival', desc: 'Artist arrived significantly late' },
    { value: 'Other', icon: '📋', label: 'Other', desc: 'Any issue not listed above' },
];

const SEVERITY_LEVELS = [
    { value: 'low', label: 'Low', color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10', desc: 'Minor inconvenience' },
    { value: 'medium', label: 'Medium', color: 'text-orange-400 border-orange-500/30 bg-orange-500/10', desc: 'Affected event quality' },
    { value: 'high', label: 'High', color: 'text-red-400 border-red-500/30 bg-red-500/10', desc: 'Serious issue, needs urgent attention' },
    { value: 'critical', label: 'Critical', color: 'text-red-300 border-red-400/40 bg-red-500/20', desc: 'Emergency — safety at risk' },
];

export default function IncidentModal({ isOpen, onClose, bookingId }: IncidentModalProps) {
    const { profile } = useAuth();
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [incidentType, setIncidentType] = useState('');
    const [severity, setSeverity] = useState('medium');
    const [description, setDescription] = useState('');
    const [incidentId, setIncidentId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [location, setLocation] = useState<LocationData>({
        address: '',
        coords: null,
        loading: false,
        error: null,
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const TOTAL_STEPS = 4;

    // Auto-detect location when modal opens
    const detectLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setLocation(prev => ({ ...prev, error: 'Geolocation not supported by your browser' }));
            return;
        }
        setLocation(prev => ({ ...prev, loading: true, error: null }));

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                        { headers: { 'Accept-Language': 'en' } }
                    );
                    const data = await res.json();
                    const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                    setLocation({
                        address,
                        coords: { lat: latitude, lng: longitude },
                        loading: false,
                        error: null,
                    });
                } catch {
                    setLocation({
                        address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                        coords: { lat: latitude, lng: longitude },
                        loading: false,
                        error: null,
                    });
                }
            },
            (err) => {
                setLocation(prev => ({
                    ...prev,
                    loading: false,
                    error: err.code === 1 ? 'Location permission denied. Please enable it.' : 'Could not detect location.',
                }));
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, []);

    useEffect(() => {
        if (isOpen) {
            detectLocation();
        }
    }, [isOpen, detectLocation]);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep(1);
                setSubmitted(false);
                setIncidentType('');
                setSeverity('medium');
                setDescription('');
                setPhotos([]);
            }, 300);
        }
    }, [isOpen]);

    const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const newPhotos: PhotoItem[] = Array.from(files).slice(0, 5 - photos.length).map(file => ({
            file,
            preview: URL.createObjectURL(file),
            uploading: false,
            uploaded: false,
        }));
        setPhotos(prev => [...prev, ...newPhotos].slice(0, 5));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const uploadAllPhotos = async (): Promise<{ url: string; fileId: string }[]> => {
        const results: { url: string; fileId: string }[] = [];
        for (let i = 0; i < photos.length; i++) {
            if (photos[i].uploaded && photos[i].url && photos[i].fileId) {
                results.push({ url: photos[i].url!, fileId: photos[i].fileId! });
                continue;
            }
            setPhotos(prev => prev.map((p, idx) => idx === i ? { ...p, uploading: true } : p));
            try {
                const res = await uploadIncidentPhoto(photos[i].file, 'pending');
                results.push(res);
                setPhotos(prev => prev.map((p, idx) => idx === i ? { ...p, uploading: false, uploaded: true, url: res.url, fileId: res.fileId } : p));
            } catch {
                setPhotos(prev => prev.map((p, idx) => idx === i ? { ...p, uploading: false } : p));
            }
        }
        return results;
    };

    const handleSubmit = async () => {
        if (!profile?.uid || !incidentType || !description.trim()) return;

        setIsSubmitting(true);
        try {
            // Upload photos first
            const uploadedPhotos = await uploadAllPhotos();

            const incidentRef = await addDoc(collection(db, 'incidents'), {
                bookingId: bookingId || null,
                reporterId: profile.uid,
                reporterName: profile.name,
                reporterEmail: profile.email,
                reporterRole: profile.role,
                type: incidentType,
                severity,
                description,
                photos: uploadedPhotos,
                location: {
                    address: location.address || 'Not provided',
                    coords: location.coords,
                },
                status: 'Open',
                priority: severity === 'critical' || severity === 'high' ? 'High' : severity === 'medium' ? 'Normal' : 'Low',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            const year = new Date().getFullYear();
            const shortId = incidentRef.id.slice(-4).toUpperCase();
            setIncidentId(`INC-${year}-${shortId}`);
            setSubmitted(true);

            setTimeout(() => {
                onClose();
            }, 4000);
        } catch (error) {
            console.error('Error submitting incident:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const canProceed = () => {
        switch (step) {
            case 1: return !!incidentType;
            case 2: return description.trim().length >= 10;
            case 3: return true; // photos & location are optional
            case 4: return true;
            default: return false;
        }
    };

    const selectedIssue = ISSUE_CATEGORIES.find(c => c.value === incidentType);
    const selectedSev = SEVERITY_LEVELS.find(s => s.value === severity);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 30 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 340 }}
                        className="relative w-full max-w-lg bg-[#12121c] border border-red-500/20 rounded-3xl shadow-2xl shadow-red-900/10 overflow-hidden z-[70] max-h-[90vh] flex flex-col"
                    >
                        {/* Top Accent Bar */}
                        <div className="h-1 w-full bg-gradient-to-r from-red-500 via-orange-500 to-red-400" />

                        {!submitted ? (
                            <>
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 pt-5 pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
                                            <AlertTriangle className="w-5 h-5 text-red-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-white">Report an Incident</h2>
                                            <p className="text-white/40 text-xs">Step {step} of {TOTAL_STEPS}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-white/5 rounded-xl transition-colors"
                                    >
                                        <X className="w-5 h-5 text-white/40" />
                                    </button>
                                </div>

                                {/* Progress bar */}
                                <div className="px-6 pb-4">
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                                            animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                                            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                                        />
                                    </div>
                                </div>

                                {/* Scrollable content area */}
                                <div className="flex-1 overflow-y-auto px-6 pb-4 custom-scrollbar">
                                    <AnimatePresence mode="wait">
                                        {/* STEP 1 — Issue Type */}
                                        {step === 1 && (
                                            <motion.div
                                                key="step1"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-3"
                                            >
                                                <p className="text-white/60 text-sm mb-4">What kind of issue are you reporting?</p>
                                                <div className="grid grid-cols-2 gap-2.5">
                                                    {ISSUE_CATEGORIES.map(cat => (
                                                        <button
                                                            key={cat.value}
                                                            onClick={() => setIncidentType(cat.value)}
                                                            className={`text-left p-3.5 rounded-2xl border transition-all duration-200 group ${incidentType === cat.value
                                                                ? 'bg-red-500/10 border-red-500/40 shadow-lg shadow-red-900/10'
                                                                : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/10'
                                                                }`}
                                                        >
                                                            <span className="text-xl mb-1.5 block">{cat.icon}</span>
                                                            <span className={`text-sm font-semibold block leading-tight ${incidentType === cat.value ? 'text-red-300' : 'text-white/80'}`}>
                                                                {cat.label}
                                                            </span>
                                                            <span className="text-[10px] text-white/30 leading-tight block mt-1">{cat.desc}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* STEP 2 — Description & Severity */}
                                        {step === 2 && (
                                            <motion.div
                                                key="step2"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-5"
                                            >
                                                {/* Severity selector */}
                                                <div>
                                                    <label className="block text-white/50 text-xs font-medium mb-2 uppercase tracking-wider">How severe is this?</label>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {SEVERITY_LEVELS.map(sev => (
                                                            <button
                                                                key={sev.value}
                                                                onClick={() => setSeverity(sev.value)}
                                                                className={`px-2 py-2.5 rounded-xl border text-center transition-all duration-200 ${severity === sev.value
                                                                    ? sev.color + ' ring-1 ring-current/20'
                                                                    : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:bg-white/[0.04]'
                                                                    }`}
                                                            >
                                                                <span className="text-xs font-bold block">{sev.label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {selectedSev && (
                                                        <p className="text-white/30 text-[10px] mt-1.5 pl-1">{selectedSev.desc}</p>
                                                    )}
                                                </div>

                                                {/* Description */}
                                                <div>
                                                    <label className="block text-white/50 text-xs font-medium mb-2 uppercase tracking-wider">
                                                        Describe what happened
                                                    </label>
                                                    <textarea
                                                        rows={5}
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        className="w-full bg-black/30 border border-white/[0.06] rounded-2xl px-4 py-3.5 text-white text-sm outline-none focus:border-red-500/30 resize-none placeholder-white/20 transition-colors"
                                                        placeholder="Please describe the incident in detail — what happened, when, who was involved, and any other relevant context..."
                                                        required
                                                    />
                                                    <div className="flex justify-between mt-1 px-1">
                                                        <p className="text-white/20 text-[10px]">Minimum 10 characters</p>
                                                        <p className={`text-[10px] ${description.length >= 10 ? 'text-green-400/60' : 'text-white/20'}`}>
                                                            {description.length} chars
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* STEP 3 — Photos & Location */}
                                        {step === 3 && (
                                            <motion.div
                                                key="step3"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-5"
                                            >
                                                {/* Photo Evidence */}
                                                <div>
                                                    <label className="block text-white/50 text-xs font-medium mb-2 uppercase tracking-wider">
                                                        Photo Evidence <span className="text-white/20 normal-case">(optional, up to 5)</span>
                                                    </label>
                                                    <div className="grid grid-cols-3 gap-2.5">
                                                        {photos.map((photo, idx) => (
                                                            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group">
                                                                <img
                                                                    src={photo.preview}
                                                                    alt={`Evidence ${idx + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                {photo.uploading && (
                                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                                                    </div>
                                                                )}
                                                                {photo.uploaded && (
                                                                    <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                                        <span className="text-white text-[10px]">✓</span>
                                                                    </div>
                                                                )}
                                                                <button
                                                                    onClick={() => removePhoto(idx)}
                                                                    className="absolute top-1.5 left-1.5 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                                                                >
                                                                    <Trash2 className="w-3 h-3 text-white" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                        {photos.length < 5 && (
                                                            <button
                                                                onClick={() => fileInputRef.current?.click()}
                                                                className="aspect-square rounded-2xl border-2 border-dashed border-white/10 hover:border-red-500/30 flex flex-col items-center justify-center gap-1.5 transition-colors bg-white/[0.01] hover:bg-red-500/5"
                                                            >
                                                                <Camera className="w-5 h-5 text-white/30" />
                                                                <span className="text-[10px] text-white/30">Add Photo</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={handlePhotoAdd}
                                                        className="hidden"
                                                    />
                                                </div>

                                                {/* Location */}
                                                <div>
                                                    <label className="block text-white/50 text-xs font-medium mb-2 uppercase tracking-wider">
                                                        Incident Location
                                                    </label>
                                                    <div className="bg-black/30 border border-white/[0.06] rounded-2xl p-3.5 space-y-3">
                                                        {location.loading ? (
                                                            <div className="flex items-center gap-3 text-white/40 text-sm">
                                                                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                                                                <span>Detecting your location...</span>
                                                            </div>
                                                        ) : location.error ? (
                                                            <div className="space-y-2">
                                                                <p className="text-red-400/70 text-xs">{location.error}</p>
                                                                <button
                                                                    onClick={detectLocation}
                                                                    className="flex items-center gap-2 text-accent text-xs font-medium hover:underline"
                                                                >
                                                                    <LocateFixed className="w-3.5 h-3.5" /> Try again
                                                                </button>
                                                            </div>
                                                        ) : location.address ? (
                                                            <div className="space-y-2">
                                                                <div className="flex items-start gap-2.5">
                                                                    <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                                                    <p className="text-white/70 text-sm leading-relaxed">{location.address}</p>
                                                                </div>
                                                                {location.coords && (
                                                                    <p className="text-white/20 text-[10px] pl-7 font-mono">
                                                                        {location.coords.lat.toFixed(6)}, {location.coords.lng.toFixed(6)}
                                                                    </p>
                                                                )}
                                                                <button
                                                                    onClick={detectLocation}
                                                                    className="flex items-center gap-1.5 text-accent/70 text-xs font-medium hover:text-accent transition-colors pl-7"
                                                                >
                                                                    <LocateFixed className="w-3 h-3" /> Refresh location
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={detectLocation}
                                                                className="flex items-center gap-2 text-accent text-sm font-medium"
                                                            >
                                                                <LocateFixed className="w-4 h-4" /> Detect my location
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Emergency callout */}
                                                <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-4 flex items-start gap-3">
                                                    <Phone className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-red-300 text-xs font-semibold mb-0.5">In immediate danger?</p>
                                                        <p className="text-red-300/50 text-[11px] leading-relaxed">
                                                            Call emergency services (112) immediately. This report system is for non-emergency incidents.
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* STEP 4 — Review & Submit */}
                                        {step === 4 && (
                                            <motion.div
                                                key="step4"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-4"
                                            >
                                                <p className="text-white/50 text-xs mb-3">Review your report before submitting</p>

                                                {/* Summary card */}
                                                <div className="bg-black/30 border border-white/[0.06] rounded-2xl divide-y divide-white/[0.04] overflow-hidden">
                                                    {/* Issue type */}
                                                    <div className="p-4 flex items-center gap-3">
                                                        <span className="text-xl">{selectedIssue?.icon}</span>
                                                        <div>
                                                            <p className="text-white/40 text-[10px] uppercase tracking-wider">Issue Type</p>
                                                            <p className="text-white font-semibold text-sm">{incidentType}</p>
                                                        </div>
                                                    </div>

                                                    {/* Severity */}
                                                    <div className="p-4 flex items-center gap-3">
                                                        <AlertOctagon className={`w-5 h-5 ${severity === 'critical' || severity === 'high' ? 'text-red-400' : severity === 'medium' ? 'text-orange-400' : 'text-yellow-400'}`} />
                                                        <div>
                                                            <p className="text-white/40 text-[10px] uppercase tracking-wider">Severity</p>
                                                            <p className="text-white font-semibold text-sm capitalize">{severity}</p>
                                                        </div>
                                                    </div>

                                                    {/* Description */}
                                                    <div className="p-4">
                                                        <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Description</p>
                                                        <p className="text-white/70 text-sm leading-relaxed line-clamp-3">{description}</p>
                                                    </div>

                                                    {/* Photos */}
                                                    {photos.length > 0 && (
                                                        <div className="p-4">
                                                            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-2">Evidence ({photos.length} photo{photos.length > 1 ? 's' : ''})</p>
                                                            <div className="flex gap-2">
                                                                {photos.map((p, i) => (
                                                                    <div key={i} className="w-12 h-12 rounded-lg overflow-hidden border border-white/10">
                                                                        <img src={p.preview} alt="" className="w-full h-full object-cover" />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Location */}
                                                    {location.address && (
                                                        <div className="p-4 flex items-start gap-3">
                                                            <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="text-white/40 text-[10px] uppercase tracking-wider">Location</p>
                                                                <p className="text-white/70 text-xs leading-relaxed mt-0.5">{location.address}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Warning */}
                                                <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-4">
                                                    <p className="text-red-300/80 text-xs leading-relaxed">
                                                        <strong className="text-red-300">⚠ Important:</strong> By submitting this report, payments will be automatically frozen pending investigation. Our safety team will review within 24 hours. False reports may lead to account suspension.
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Footer with navigation */}
                                <div className="px-6 py-4 border-t border-white/[0.04] flex gap-3">
                                    {step > 1 ? (
                                        <button
                                            onClick={() => setStep(s => s - 1)}
                                            disabled={isSubmitting}
                                            className="flex items-center gap-1.5 px-4 py-3 bg-white/5 hover:bg-white/10 text-white/70 font-medium rounded-xl transition-all text-sm disabled:opacity-50"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Back
                                        </button>
                                    ) : (
                                        <button
                                            onClick={onClose}
                                            disabled={isSubmitting}
                                            className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white/70 font-medium rounded-xl transition-all text-sm disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    {step < TOTAL_STEPS ? (
                                        <button
                                            onClick={() => setStep(s => s + 1)}
                                            disabled={!canProceed()}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/80 hover:bg-red-500 text-white font-bold rounded-xl transition-all text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            Continue
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all text-sm disabled:opacity-50"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="scale-75">
                                                        <PulsatingDots />
                                                    </div>
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Submit Report
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* Success state */
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-8 text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', delay: 0.1, damping: 12 }}
                                    className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-5 border border-green-500/30"
                                >
                                    <Shield className="w-8 h-8 text-green-400" />
                                </motion.div>
                                <h3 className="text-xl font-bold text-white mb-2">Report Submitted</h3>
                                <p className="text-white/50 text-sm mb-4 leading-relaxed">
                                    Your report has been received and our safety team has been notified. Reference ID:
                                </p>
                                <div className="inline-block bg-black/40 border border-white/10 rounded-xl px-4 py-2 mb-4">
                                    <span className="text-white font-mono font-bold text-lg">#{incidentId}</span>
                                </div>
                                <p className="text-white/30 text-xs">
                                    Payments have been frozen. You&apos;ll receive updates via email.
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
