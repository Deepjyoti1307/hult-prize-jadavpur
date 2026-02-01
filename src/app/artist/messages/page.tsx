'use client';

import { useEffect } from 'react';
import ArtistSidebar from '@/components/ArtistSidebar';
import { renderCanvas, stopCanvas } from '@/components/ui/canvas';
import { Search, MoreVertical, Phone, Video, Image as ImageIcon, Mic, Send } from 'lucide-react';

export default function ArtistMessages() {
    useEffect(() => {
        renderCanvas();
        return () => stopCanvas();
    }, []);

    // Mock data for UI
    const contacts = [
        { id: 1, name: 'Priya Sharma', lastMessage: 'That sounds great! See you then.', time: '10:30 AM', unread: 2, online: true, avatar: 'P' },
        { id: 2, name: 'Rahul Verma', lastMessage: 'Can we extend the duration by 1 hr?', time: 'Yesterday', unread: 0, online: false, avatar: 'R' },
        { id: 3, name: 'Wedding Planners Inc', lastMessage: 'Payment has been processed.', time: '2 days ago', unread: 0, online: true, avatar: 'W' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex relative">
            <canvas className="pointer-events-none fixed inset-0 z-0" id="canvas" />
            <ArtistSidebar />
            
            <main className="flex-1 relative z-10 flex flex-col h-screen pt-20">
                <div className="flex-1 flex overflow-hidden p-6 gap-6">
                    {/* Contacts List */}
                    <div className="w-80 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col hidden md:flex">
                        <div className="p-4 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
                            <div className="relative">
                                <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input 
                                    type="text" 
                                    placeholder="Search chats..." 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-accent/50"
                                />
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            {contacts.map(contact => (
                                <div key={contact.id} className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-all ${contact.id === 1 ? 'bg-white/10' : ''}`}>
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                                            {contact.avatar}
                                        </div>
                                        {contact.online && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0f]"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-white font-medium truncate">{contact.name}</h3>
                                            <span className="text-white/40 text-xs whitespace-nowrap">{contact.time}</span>
                                        </div>
                                        <p className="text-white/60 text-sm truncate">{contact.lastMessage}</p>
                                    </div>
                                    {contact.unread > 0 && (
                                        <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                                            {contact.unread}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col overflow-hidden">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                                    P
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">Priya Sharma</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        <span className="text-white/60 text-xs">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all">
                                    <Phone className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all">
                                    <Video className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <div className="flex justify-center">
                                <span className="bg-white/5 text-white/40 text-xs px-3 py-1 rounded-full">Today</span>
                            </div>
                            
                            <div className="flex justify-end">
                                <div className="bg-accent text-white p-3 rounded-2xl rounded-tr-sm max-w-[80%]">
                                    <p>Hi Priya! Just confirming the equipment details for Saturday.</p>
                                    <span className="text-white/60 text-xs block text-right mt-1">10:28 AM</span>
                                </div>
                            </div>

                            <div className="flex justify-start">
                                <div className="bg-white/10 text-white p-3 rounded-2xl rounded-tl-sm max-w-[80%]">
                                    <p>Hey! Yes, we have arranged the sound system as requested. Need anything else?</p>
                                    <span className="text-white/40 text-xs block mt-1">10:30 AM</span>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <div className="bg-accent text-white p-3 rounded-2xl rounded-tr-sm max-w-[80%]">
                                    <p>That sounds great! See you then.</p>
                                    <span className="text-white/60 text-xs block text-right mt-1">10:30 AM</span>
                                </div>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-white/5">
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-accent transition-all">
                                    <ImageIcon className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-accent transition-all">
                                    <Mic className="w-5 h-5" />
                                </button>
                                <input 
                                    type="text" 
                                    placeholder="Type a message..." 
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent/50 placeholder:text-white/30"
                                />
                                <button className="p-2.5 bg-accent hover:bg-accent-light text-white rounded-xl transition-all shadow-lg shadow-accent/20">
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
