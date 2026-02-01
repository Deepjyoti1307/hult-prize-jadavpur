'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { renderCanvas, stopCanvas } from '@/components/ui/canvas';
import { User, Bell, Shield, CreditCard, LogOut, Camera, Save, Mail, MapPin } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const { profile } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [name, setName] = useState(profile?.name || '');
    const [email, setEmail] = useState(profile?.email || '');
    const [location, setLocation] = useState(profile?.location?.address || '');

    useEffect(() => {
        if (profile) {
            setName(profile.name || '');
            setEmail(profile.email || '');
            setLocation(profile.location?.address || '');
        }
    }, [profile]);

    useEffect(() => {
        renderCanvas();
        return () => stopCanvas();
    }, []);

    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
    };

    const handleLogout = async () => {
        await signOut(auth);
        router.replace('/login?type=client');
    };

    const tabs = [
        { id: 'profile', label: 'Edit Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] relative font-sans">
            <canvas className="pointer-events-none fixed inset-0 z-0" id="canvas" />

            <div className="p-8 pt-20 relative z-10 max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-8">Settings</h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-72 shrink-0">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden p-2 space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === tab.id
                                            ? 'bg-accent text-white shadow-lg shadow-accent/20'
                                            : 'text-white/60 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}

                            <div className="h-px bg-white/10 my-2 mx-2" />

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium text-sm text-red-400 hover:bg-red-500/10"
                            >
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                            {activeTab === 'profile' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-6">
                                        <div className="relative group cursor-pointer">
                                            <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/10 overflow-hidden">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${name || profile?.name || 'User'}`}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                                <Camera className="w-6 h-6" />
                                            </div>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white mb-1">Profile Photo</h2>
                                            <p className="text-white/50 text-sm">Update your public photo.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-white/70">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:border-accent/50 focus:outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-white/70">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    disabled
                                                    className="w-full bg-white/5 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-white/50 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-bold text-white/70">Location</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                                <input
                                                    type="text"
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                    placeholder="e.g. Mumbai, India"
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:border-accent/50 focus:outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/10 flex justify-end">
                                        <button
                                            onClick={handleSave}
                                            disabled={isLoading}
                                            className="px-8 py-3 bg-accent hover:bg-accent-light text-white font-bold rounded-xl shadow-lg shadow-accent/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                                        >
                                            {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>

                                    {['Booking Updates', 'New Messages', 'Promotional Offers', 'Security Alerts'].map((item) => (
                                        <div key={item} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                            <div>
                                                <h3 className="text-white font-bold">{item}</h3>
                                                <p className="text-white/40 text-sm">Receive notifications about {item.toLowerCase()}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {['security', 'billing'].includes(activeTab) && (
                                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                        {activeTab === 'security' ? <Shield className="w-8 h-8 text-white/20" /> : <CreditCard className="w-8 h-8 text-white/20" />}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{activeTab === 'security' ? 'Security Settings' : 'Payment Methods'}</h3>
                                    <p className="text-white/50 max-w-sm">This section is currently under development. Please check back later.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
