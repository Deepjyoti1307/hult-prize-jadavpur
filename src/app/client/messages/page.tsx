'use client';

import { useState, useEffect } from 'react';
import { renderCanvas, stopCanvas } from '@/components/ui/canvas';
import { Search, MoreVertical, Phone, Video, Image as ImageIcon, Mic, Send, CheckCheck, Smile, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

/* Mock Data */
const CONVERSATIONS = [
    {
        id: '1',
        name: 'Classical Raga Band',
        image: 'https://images.unsplash.com/photo-1511735111813-9725911de47e?q=80&w=200&auto=format&fit=crop',
        lastMessage: 'Perfect, see you at 7 PM!',
        time: '10:42 AM',
        unread: 2,
        online: true,
        typing: false
    },
    {
        id: '2',
        name: 'DJ Pulse',
        image: 'https://images.unsplash.com/photo-1571266028243-371695063ad6?q=80&w=200&auto=format&fit=crop',
        lastMessage: 'Could you clarify the sound requirements?',
        time: 'Yesterday',
        unread: 0,
        online: false,
        typing: false
    },
    {
        id: '3',
        name: 'Sarah Vocalist',
        image: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=200&auto=format&fit=crop',
        lastMessage: 'Thanks for the booking!',
        time: '2 days ago',
        unread: 0,
        online: true,
        typing: true
    }
];

const MOCK_MESSAGES = [
    { id: 1, sender: 'them', text: 'Hi! Thanks for reaching out.', time: '10:30 AM' },
    { id: 2, sender: 'me', text: 'Hey, I wanted to discuss the setlist for the wedding.', time: '10:32 AM' },
    { id: 3, sender: 'them', text: 'Absolutely! We usually do a mix of classical and bollywood.', time: '10:33 AM' },
    { id: 4, sender: 'me', text: 'That sounds great. Can we include "Kesariya"?', time: '10:35 AM' },
    { id: 5, sender: 'them', text: 'Yes, that is one of our favorites to perform!', time: '10:36 AM' },
    { id: 6, sender: 'me', text: 'Perfect, see you at 7 PM!', time: '10:42 AM' },
];

export default function MessagesPage() {
    const [selectedChat, setSelectedChat] = useState<string | null>('1');
    const [messageInput, setMessageInput] = useState('');
    const [activeMessages, setActiveMessages] = useState(MOCK_MESSAGES);

    useEffect(() => {
        renderCanvas();
        return () => stopCanvas();
    }, []);

    const activeConversation = CONVERSATIONS.find(c => c.id === selectedChat);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        setActiveMessages([...activeMessages, {
            id: Date.now(),
            sender: 'me',
            text: messageInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setMessageInput('');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] relative font-sans">
            <canvas className="pointer-events-none fixed inset-0 z-0" id="canvas" />

            <div className="p-4 md:p-8 pt-20 relative z-10 w-full h-screen mx-auto flex gap-6 max-w-[1600px]">
                {/* Chat List */}
                <div className={`w-full md:w-96 flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shrink-0 ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-6 border-b border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-white tracking-tight">Messages</h1>
                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">
                                2
                            </div>
                        </div>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-white transition-colors" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:border-accent/50 focus:outline-none transition-all placeholder:text-white/30"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                        {CONVERSATIONS.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setSelectedChat(chat.id)}
                                className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedChat === chat.id
                                        ? 'bg-white/10 border-white/10 shadow-lg'
                                        : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'
                                    }`}
                            >
                                <div className="flex gap-4">
                                    <div className="relative shrink-0">
                                        <div className="w-12 h-12 rounded-full overflow-hidden">
                                            <img src={chat.image} alt={chat.name} className="w-full h-full object-cover" />
                                        </div>
                                        {chat.online && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0a0a0f] rounded-full" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className={`font-bold truncate ${selectedChat === chat.id ? 'text-white' : 'text-white/90'}`}>
                                                {chat.name}
                                            </h3>
                                            <span className={`text-xs ${chat.unread ? 'text-accent font-bold' : 'text-white/40'}`}>
                                                {chat.time}
                                            </span>
                                        </div>
                                        <p className={`text-sm truncate ${chat.unread ? 'text-white font-medium' : 'text-white/50'}`}>
                                            {chat.typing ? <span className="text-accent italic">Typing...</span> : chat.lastMessage}
                                        </p>
                                    </div>
                                    {chat.unread > 0 && (
                                        <div className="self-center w-5 h-5 bg-accent rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                                            {chat.unread}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`flex-1 flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
                    {selectedChat && activeConversation ? (
                        <>
                            {/* Header */}
                            <div className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setSelectedChat(null)}
                                        className="md:hidden p-2 -ml-2 text-white/60"
                                    >
                                        Back
                                    </button>
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full overflow-hidden">
                                            <img src={activeConversation.image} alt={activeConversation.name} className="w-full h-full object-cover" />
                                        </div>
                                        {activeConversation.online && (
                                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0a0a0f] rounded-full" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">{activeConversation.name}</h2>
                                        <p className="text-xs text-white/50">{activeConversation.online ? 'Online' : 'Offline'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                                        <Phone className="w-5 h-5" />
                                    </button>
                                    <button className="p-2.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                                        <Video className="w-5 h-5" />
                                    </button>
                                    <button className="p-2.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
                                <div className="text-center">
                                    <span className="text-xs font-bold text-white/30 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full">Today</span>
                                </div>
                                {activeMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] md:max-w-[60%] rounded-2xl px-5 py-3 ${msg.sender === 'me'
                                                ? 'bg-accent text-white rounded-br-none shadow-lg shadow-accent/20'
                                                : 'bg-white/10 text-white rounded-bl-none border border-white/5'
                                            }`}>
                                            <p className="leading-relaxed">{msg.text}</p>
                                            <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${msg.sender === 'me' ? 'text-white/60' : 'text-white/40'}`}>
                                                {msg.time}
                                                {msg.sender === 'me' && <CheckCheck className="w-3 h-3" />}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input */}
                            <div className="p-4 md:p-6 bg-white/5 border-t border-white/10">
                                <form onSubmit={handleSend} className="flex gap-4 items-end">
                                    <div className="flex gap-2 pb-3">
                                        <button type="button" className="p-2 text-white/40 hover:text-white transition-colors">
                                            <ImageIcon className="w-5 h-5" />
                                        </button>
                                        <button type="button" className="p-2 text-white/40 hover:text-white transition-colors">
                                            <Mic className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="flex-1 bg-black/20 border border-white/10 rounded-2xl p-2 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/50 transition-all flex gap-2">
                                        <input
                                            type="text"
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-1 bg-transparent border-none text-white focus:ring-0 placeholder:text-white/30 px-3 py-2"
                                        />
                                        <button type="button" className="p-2 text-white/40 hover:text-accent transition-colors">
                                            <Smile className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!messageInput.trim()}
                                        className="p-4 bg-accent hover:bg-accent-light disabled:opacity-50 disabled:hover:bg-accent text-white rounded-2xl shadow-lg shadow-accent/20 transition-all hover:scale-105 active:scale-95"
                                    >
                                        <Send className="w-5 h-5 translate-x-0.5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-white/30">
                            <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
                            <p className="text-lg font-medium">Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
