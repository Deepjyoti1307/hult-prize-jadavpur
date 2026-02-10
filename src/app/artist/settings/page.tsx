'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';
import ArtistSidebar from '@/components/ArtistSidebar';
import { renderCanvas, stopCanvas } from '@/components/ui/canvas';
import { User, Mail, Phone, MapPin, Camera, Save, Bell, Shield, LogOut, Check } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { uploadProfilePhoto } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';
import PulsatingDots from '@/components/ui/pulsating-loader';

export default function ArtistSettings() {
    const { profile } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Controlled form state
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [bio, setBio] = useState('');
    const [category, setCategory] = useState('Live Band');
    const [photoURL, setPhotoURL] = useState('');
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync form state with profile when it loads
    useEffect(() => {
        if (profile) {
            setName(profile.name || '');
            setPhone(profile.phoneNumber || '');
            setLocation(profile.location?.address || '');
            setBio(profile.bio || '');
            setCategory(profile.category || 'Live Band');
            setPhotoURL(profile.photoURL || '');
        }
    }, [profile]);

    useEffect(() => {
        renderCanvas();
        return () => stopCanvas();
    }, []);

    const handleSave = async () => {
        if (!profile?.uid) return;
        setIsLoading(true);
        try {
            const userRef = doc(db, 'users', profile.uid);
            await updateDoc(userRef, {
                name,
                phoneNumber: phone,
                'location.address': location,
                bio,
                category,
                photoURL,
                updatedAt: new Date(),
            });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2000);
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !profile?.uid) return;

        setIsUploadingPhoto(true);
        try {
            const url = await uploadProfilePhoto(file, profile.uid);

            await updateDoc(doc(db, 'users', profile.uid), {
                photoURL: url,
                updatedAt: new Date(),
            });

            setPhotoURL(url);
        } catch (error) {
            console.error('Error uploading photo:', error);
        } finally {
            setIsUploadingPhoto(false);
            event.target.value = '';
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        router.replace('/login?type=artist');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex relative">
            <canvas className="pointer-events-none fixed inset-0 z-0" id="canvas" />
            <ArtistSidebar />

            <main className="flex-1 overflow-y-auto relative z-10">
                <div className="p-8 pt-20 max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                            <p className="text-white/60">Manage your profile and account preferences</p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isLoading || saveSuccess}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg ${saveSuccess
                                ? 'bg-green-500 text-white shadow-green-500/20'
                                : 'bg-accent hover:bg-accent-light text-white shadow-accent/20 disabled:opacity-50'
                                }`}
                        >
                            {isLoading ? (
                                <div className="scale-75">
                                    <PulsatingDots />
                                </div>
                            ) : saveSuccess ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {saveSuccess ? 'Saved!' : 'Save Changes'}
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Profile Picture & Basic Info */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-white mb-6">Public Profile</h2>

                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="flex flex-col items-center gap-4">
                                    <div
                                        onClick={handlePhotoClick}
                                        className="w-32 h-32 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center relative group cursor-pointer overflow-hidden"
                                    >
                                        {photoURL ? (
                                            <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <Camera className="w-8 h-8 text-white/40 group-hover:text-white transition-colors" />
                                        )}
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white text-xs font-medium">
                                                {isUploadingPhoto ? 'Uploading...' : 'Change Photo'}
                                            </span>
                                        </div>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handlePhotoChange}
                                    />
                                </div>

                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                    <div className="space-y-2">
                                        <label className="text-white/60 text-sm font-medium">Display Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-accent/50 focus:outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-white/60 text-sm font-medium">Category</label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent/50 focus:outline-none transition-colors appearance-none"
                                        >
                                            <option>Live Band</option>
                                            <option>DJ</option>
                                            <option>Solo Musician</option>
                                            <option>Classical</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-white/60 text-sm font-medium">Bio</label>
                                        <textarea
                                            rows={4}
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-accent/50 focus:outline-none transition-colors resize-none"
                                            placeholder="Tell clients about your style, experience, and what makes you unique..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-white mb-6">Contact Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-white/60 text-sm font-medium">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                        <input
                                            type="email"
                                            defaultValue={profile?.email || ''}
                                            disabled
                                            className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-white/50 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-white/60 text-sm font-medium">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-accent/50 focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-white/60 text-sm font-medium">Base Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-accent/50 focus:outline-none transition-colors"
                                            placeholder="e.g. Mumbai, Maharashtra"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-white mb-6">Notifications</h2>
                            <div className="space-y-4">
                                {[
                                    { title: 'New Gig Requests', desc: 'Get notified when a client sends you a booking request' },
                                    { title: 'Messages', desc: 'Receive alerts for new messages from clients' },
                                    { title: 'Marketing Updates', desc: 'Receive news about platform features and tips', checked: false },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                        <div>
                                            <h4 className="text-white font-medium">{item.title}</h4>
                                            <p className="text-white/40 text-sm">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked={item.checked !== false} />
                                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                            <h2 className="text-red-400 font-bold text-xl mb-4">Account Actions</h2>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-medium transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
