'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import ArtistSidebar from '@/components/ArtistSidebar';
import IncidentModal from '@/components/IncidentModal';
import { renderCanvas, stopCanvas } from '@/components/ui/canvas';
import {
    Shield, AlertTriangle, MapPin, Phone, Lock, Radio,
    ChevronRight, Users, Eye, LocateFixed, Loader2,
    Wifi, WifiOff, Siren, FileText, PhoneCall, Heart
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { doc, setDoc, updateDoc, serverTimestamp, onSnapshot, GeoPoint } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';

const Safety3DScene = dynamic(() => import('@/components/Safety3DScene'), { ssr: false });

interface LiveLocation {
    lat: number;
    lng: number;
    address: string;
    accuracy: number;
    timestamp: number;
}

export default function ArtistSafety() {
    const { profile } = useAuth();
    const [incidentModalOpen, setIncidentModalOpen] = useState(false);

    // Live location state
    const [isTracking, setIsTracking] = useState(false);
    const [liveLocation, setLiveLocation] = useState<LiveLocation | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const watchIdRef = useRef<number | null>(null);
    const [sosActive, setSosActive] = useState(false);
    const [sosCountdown, setSosCountdown] = useState(0);
    const sosTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Trusted contacts (from profile or mock)
    const trustedContacts = [
        { name: 'Mom', phone: '+91 98765 43210' },
        { name: 'Manager', phone: '+91 98765 43211' },
    ];

    useEffect(() => {
        renderCanvas();
        return () => stopCanvas();
    }, []);

    // Cleanup watchPosition on unmount
    useEffect(() => {
        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
            if (sosTimerRef.current) clearInterval(sosTimerRef.current);
        };
    }, []);

    // Reverse geocode
    const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                { headers: { 'Accept-Language': 'en' } }
            );
            const data = await res.json();
            return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        } catch {
            return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        }
    };

    // Push location to Firestore
    const pushLocationToFirestore = useCallback(async (lat: number, lng: number, address: string, accuracy: number) => {
        if (!profile?.uid) return;
        const locationDocRef = doc(db, 'liveLocations', profile.uid);
        try {
            await setDoc(locationDocRef, {
                userId: profile.uid,
                userName: profile.name || 'Artist',
                role: 'artist',
                coordinates: new GeoPoint(lat, lng),
                address,
                accuracy,
                isLive: true,
                sosActive: sosActive,
                updatedAt: serverTimestamp(),
            }, { merge: true });
        } catch (err) {
            console.error('Failed to push location:', err);
        }
    }, [profile, sosActive]);

    // Start live tracking
    const startTracking = useCallback(() => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            return;
        }

        setLocationLoading(true);
        setLocationError(null);

        const watchId = navigator.geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                const address = await reverseGeocode(latitude, longitude);
                const loc: LiveLocation = {
                    lat: latitude,
                    lng: longitude,
                    address,
                    accuracy,
                    timestamp: Date.now(),
                };
                setLiveLocation(loc);
                setIsTracking(true);
                setLocationLoading(false);
                await pushLocationToFirestore(latitude, longitude, address, accuracy);
            },
            (err) => {
                setLocationLoading(false);
                if (err.code === 1) {
                    setLocationError('Location permission denied. Please enable it in your browser settings.');
                } else if (err.code === 2) {
                    setLocationError('Location unavailable. Check your GPS/network.');
                } else {
                    setLocationError('Location request timed out. Try again.');
                }
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );

        watchIdRef.current = watchId;
    }, [pushLocationToFirestore]);

    // Stop tracking
    const stopTracking = useCallback(async () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setIsTracking(false);

        // Mark as offline in Firestore
        if (profile?.uid) {
            try {
                const locationDocRef = doc(db, 'liveLocations', profile.uid);
                await updateDoc(locationDocRef, {
                    isLive: false,
                    sosActive: false,
                    updatedAt: serverTimestamp(),
                });
            } catch { /* ignore if doc doesn't exist */ }
        }
    }, [profile]);

    // SOS trigger with 5-second countdown
    const triggerSOS = useCallback(() => {
        if (sosActive) {
            // Cancel SOS
            setSosActive(false);
            setSosCountdown(0);
            if (sosTimerRef.current) clearInterval(sosTimerRef.current);
            return;
        }

        // Start tracking if not already
        if (!isTracking) startTracking();

        setSosCountdown(5);
        sosTimerRef.current = setInterval(() => {
            setSosCountdown(prev => {
                if (prev <= 1) {
                    if (sosTimerRef.current) clearInterval(sosTimerRef.current);
                    // Activate SOS
                    setSosActive(true);
                    // Update Firestore with SOS flag
                    if (profile?.uid && liveLocation) {
                        const locationDocRef = doc(db, 'liveLocations', profile.uid);
                        setDoc(locationDocRef, {
                            sosActive: true,
                            sosTriggeredAt: serverTimestamp(),
                        }, { merge: true });
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [sosActive, isTracking, startTracking, profile, liveLocation]);

    const timeSince = (ts: number) => {
        const seconds = Math.floor((Date.now() - ts) / 1000);
        if (seconds < 10) return 'Just now';
        if (seconds < 60) return `${seconds}s ago`;
        return `${Math.floor(seconds / 60)}m ago`;
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex relative">
            <canvas className="pointer-events-none fixed inset-0 z-0" id="canvas" />
            <ArtistSidebar />

            <main className="flex-1 overflow-y-auto relative z-10">
                <div className="p-6 md:p-8 pt-20 max-w-7xl mx-auto">
                    {/* ═══════ Hero: 3D Shield + SOS ═══════ */}
                    <div className="relative mb-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            {/* 3D Shield */}
                            <div className="relative h-[380px] md:h-[440px] order-2 lg:order-1">
                                <Safety3DScene />
                                {/* Radial glow behind */}
                                <div className="absolute inset-0 pointer-events-none"
                                    style={{ background: 'radial-gradient(ellipse at center, rgba(45,139,122,0.08) 0%, transparent 70%)' }}
                                />
                            </div>

                            {/* SOS & Info */}
                            <div className="order-1 lg:order-2 space-y-6">
                                <div>
                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3"
                                    >
                                        Safety <span className="text-accent">Center</span>
                                    </motion.h1>
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-white/50 text-lg max-w-md leading-relaxed"
                                    >
                                        Your protection is our priority. Access emergency tools, live tracking, and incident reporting — all in one place.
                                    </motion.p>
                                </div>

                                {/* SOS BUTTON */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <button
                                        onClick={triggerSOS}
                                        className={`relative w-full py-6 rounded-3xl font-bold text-xl shadow-2xl transition-all active:scale-[0.97] overflow-hidden group ${
                                            sosActive
                                                ? 'bg-red-600 text-white shadow-red-600/40 animate-pulse'
                                                : sosCountdown > 0
                                                ? 'bg-orange-600 text-white shadow-orange-600/30'
                                                : 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-red-600/30 hover:shadow-red-500/50'
                                        }`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                        <span className="relative z-10 flex items-center justify-center gap-3">
                                            {sosActive ? (
                                                <>
                                                    <Siren className="w-7 h-7 animate-bounce" />
                                                    SOS ACTIVE — TAP TO CANCEL
                                                </>
                                            ) : sosCountdown > 0 ? (
                                                <>
                                                    <AlertTriangle className="w-7 h-7" />
                                                    ACTIVATING IN {sosCountdown}...
                                                </>
                                            ) : (
                                                <>
                                                    <AlertTriangle className="w-7 h-7" />
                                                    TRIGGER SOS ALERT
                                                </>
                                            )}
                                        </span>
                                    </button>
                                    <p className="text-white/30 text-xs text-center mt-2">
                                        {sosActive
                                            ? 'Your live location is being shared with the Tarang Safety Team and your trusted contacts.'
                                            : 'Press to alert Tarang Safety Team. 5-second countdown before activation.'}
                                    </p>
                                </motion.div>

                                {/* Quick emergency dials */}
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: 'Police', number: '100', icon: Shield, color: 'from-blue-600/20 to-blue-800/10 border-blue-500/20 text-blue-400' },
                                        { label: 'Ambulance', number: '102', icon: Heart, color: 'from-red-600/20 to-red-800/10 border-red-500/20 text-red-400' },
                                        { label: 'Women Help', number: '1091', icon: PhoneCall, color: 'from-purple-600/20 to-purple-800/10 border-purple-500/20 text-purple-400' },
                                    ].map((item) => (
                                        <a
                                            key={item.number}
                                            href={`tel:${item.number}`}
                                            className={`bg-gradient-to-br ${item.color} border rounded-2xl p-4 text-center hover:scale-[1.02] transition-transform active:scale-95`}
                                        >
                                            <item.icon className="w-6 h-6 mx-auto mb-2" />
                                            <p className="text-white text-sm font-bold">{item.label}</p>
                                            <p className="text-white/40 text-xs mt-0.5">{item.number}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ═══════ Live Location Section ═══════ */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-10"
                    >
                        <div className="bg-gradient-to-br from-accent/5 to-transparent border border-accent/10 rounded-3xl p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl border ${isTracking ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-white/5 border-white/10 text-white/60'}`}>
                                            {isTracking ? <Wifi className="w-7 h-7" /> : <WifiOff className="w-7 h-7" />}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                                Live Location
                                                {isTracking && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold rounded-full">
                                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                                        LIVE
                                                    </span>
                                                )}
                                            </h2>
                                            <p className="text-white/40 text-sm">
                                                {isTracking
                                                    ? 'Your location is being shared in real-time with trusted contacts'
                                                    : 'Share your real-time location during gigs for safety'}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={isTracking ? stopTracking : startTracking}
                                        disabled={locationLoading}
                                        className={`px-8 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 ${
                                            isTracking
                                                ? 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20'
                                                : 'bg-accent text-white shadow-lg shadow-accent/20 hover:shadow-accent/40'
                                        }`}
                                    >
                                        {locationLoading ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</>
                                        ) : isTracking ? (
                                            <><Radio className="w-4 h-4" /> Stop Sharing</>
                                        ) : (
                                            <><LocateFixed className="w-4 h-4" /> Start Sharing</>
                                        )}
                                    </button>
                                </div>

                                {locationError && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-4">
                                        <p className="text-red-400 text-sm">{locationError}</p>
                                    </div>
                                )}

                                {liveLocation && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-black/30 border border-white/5 rounded-2xl p-5 space-y-4"
                                    >
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-white/80 text-sm leading-relaxed">{liveLocation.address}</p>
                                                <p className="text-white/20 text-xs font-mono mt-1">
                                                    {liveLocation.lat.toFixed(6)}, {liveLocation.lng.toFixed(6)}
                                                    <span className="ml-3">±{liveLocation.accuracy.toFixed(0)}m</span>
                                                </p>
                                            </div>
                                            <span className="text-white/30 text-xs whitespace-nowrap">{timeSince(liveLocation.timestamp)}</span>
                                        </div>

                                        {/* Trusted contacts */}
                                        <div className="pt-3 border-t border-white/5">
                                            <p className="text-white/30 text-xs uppercase tracking-wider mb-2">Sharing with</p>
                                            <div className="flex flex-wrap gap-2">
                                                {trustedContacts.map((c, i) => (
                                                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-xs font-medium">
                                                        <Users className="w-3 h-3" /> {c.name}
                                                    </span>
                                                ))}
                                                <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-medium hover:bg-accent/20 transition-colors">
                                                    + Add Contact
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {!liveLocation && !locationError && !locationLoading && (
                                    <div className="bg-black/20 border border-white/5 rounded-2xl p-8 text-center">
                                        <MapPin className="w-10 h-10 text-white/10 mx-auto mb-3" />
                                        <p className="text-white/30 text-sm">Press &quot;Start Sharing&quot; to begin live location tracking</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.section>

                    {/* ═══════ Action Cards Grid ═══════ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                        {/* Report Incident */}
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            onClick={() => setIncidentModalOpen(true)}
                            className="bg-gradient-to-br from-red-500/10 to-red-900/5 border border-red-500/15 rounded-3xl p-6 text-left hover:border-red-500/30 transition-all group"
                        >
                            <div className="p-3 bg-red-500/10 rounded-2xl text-red-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                                <FileText className="w-7 h-7" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-1">Report Incident</h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                File a detailed report with photos, severity level, and auto-detected location
                            </p>
                            <div className="flex items-center text-red-400 text-sm font-medium mt-4">
                                Open Report Form <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.button>

                        {/* Verification Status */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-3 rounded-2xl border ${
                                    profile?.adminApproval?.status === 'approved'
                                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                        : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                                }`}>
                                    <Shield className="w-7 h-7" />
                                </div>
                                {profile?.adminApproval?.status === 'approved' && (
                                    <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold rounded-full">
                                        VERIFIED
                                    </span>
                                )}
                            </div>
                            <h3 className="text-white font-bold text-lg mb-1">Identity Verification</h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                {profile?.adminApproval?.status === 'approved'
                                    ? 'Your account is verified. Clients see a trust badge on your profile.'
                                    : 'Verification is pending. Complete it to build trust with clients.'}
                            </p>
                        </motion.div>

                        {/* Gig Check-In */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-6"
                        >
                            <div className="p-3 bg-accent/10 rounded-2xl text-accent w-fit mb-4">
                                <Eye className="w-7 h-7" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-1">Gig Check-In</h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                Auto check-in when you arrive at a venue. Your client gets notified and your location is logged securely.
                            </p>
                            <div className="flex items-center text-accent text-sm font-medium mt-4">
                                Coming Soon <span className="ml-2 px-2 py-0.5 bg-accent/10 border border-accent/20 text-[10px] rounded-full font-bold">BETA</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* ═══════ Safety Resources ═══════ */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h3 className="text-xl font-bold text-white mb-5">Safety Resources</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                {
                                    icon: Lock,
                                    title: 'Safety Guidelines',
                                    desc: 'Best practices for staying safe at gigs and venues',
                                    href: '/safety',
                                },
                                {
                                    icon: FileText,
                                    title: 'Privacy Policy',
                                    desc: 'How Tarang protects your personal data and location',
                                    href: '/privacy',
                                },
                                {
                                    icon: Phone,
                                    title: '24/7 Support',
                                    desc: 'Reach our safety team anytime via chat or phone',
                                    href: '/contact',
                                },
                            ].map((item, i) => (
                                <a
                                    key={i}
                                    href={item.href}
                                    className="bg-white/[0.02] border border-white/[0.06] p-5 rounded-2xl hover:bg-white/[0.05] hover:border-white/10 cursor-pointer transition-all group"
                                >
                                    <item.icon className="w-7 h-7 text-accent mb-3 group-hover:scale-110 transition-transform" />
                                    <h4 className="text-white font-bold mb-1 text-sm">{item.title}</h4>
                                    <p className="text-white/40 text-xs leading-relaxed mb-3">{item.desc}</p>
                                    <div className="flex items-center text-accent text-xs font-medium">
                                        Learn More <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </motion.section>
                </div>
            </main>

            {/* Incident Modal */}
            <IncidentModal
                isOpen={incidentModalOpen}
                onClose={() => setIncidentModalOpen(false)}
            />
        </div>
    );
}
