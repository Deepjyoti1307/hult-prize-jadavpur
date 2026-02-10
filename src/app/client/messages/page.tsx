'use client';

import { useState, useEffect, useRef } from 'react';
import { renderCanvas, stopCanvas } from '@/components/ui/canvas';
import { Search, MoreVertical, Phone, Video, Image as ImageIcon, Mic, Send, CheckCheck, Smile, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import PulsatingDots from '@/components/ui/pulsating-loader';

export default function MessagesPage() {
    const {
        user,
        profile,
        conversations,
        messages,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        markConversationRead,
        artists
    } = useAuth();

    const [messageInput, setMessageInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        renderCanvas();
        return () => stopCanvas();
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Mark as read when conversation is selected
    useEffect(() => {
        if (activeConversationId) {
            markConversationRead(activeConversationId);
        }
    }, [activeConversationId, markConversationRead]);

    const activeConversation = conversations.find(c => c.id === activeConversationId);
    const otherUserId = activeConversation?.participants.find(p => p !== user?.uid);
    const otherUserName = otherUserId ? activeConversation?.participantNames?.[otherUserId] : 'User';
    const otherUserImage = otherUserId ? activeConversation?.participantImages?.[otherUserId] : '';

    const filteredConversations = conversations.filter(c => {
        const otherId = c.participants.find(p => p !== user?.uid);
        const name = otherId ? c.participantNames?.[otherId] : '';
        return name?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim() || !activeConversationId || sending) return;

        setSending(true);
        try {
            await sendMessage(activeConversationId, messageInput.trim());
            setMessageInput('');
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSending(false);
        }
    };

    const formatTime = (timestamp: unknown) => {
        if (!timestamp) return '';
        const date = (timestamp as { toDate?: () => Date })?.toDate?.() || new Date(timestamp as string);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatConversationTime = (timestamp: unknown) => {
        if (!timestamp) return '';
        const date = (timestamp as { toDate?: () => Date })?.toDate?.() || new Date(timestamp as string);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return formatTime(timestamp);
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    };

    const getUnreadCount = (convo: typeof conversations[0]) => {
        return user?.uid ? (convo.unreadCount?.[user.uid] || 0) : 0;
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] relative font-sans">
            <canvas className="pointer-events-none fixed inset-0 z-0" id="canvas" />

            <div className="p-4 md:p-8 pt-20 relative z-10 w-full h-screen mx-auto flex gap-6 max-w-[1600px]">
                {/* Chat List */}
                <div className={`w-full md:w-96 flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shrink-0 ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-6 border-b border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-white tracking-tight">Messages</h1>
                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">
                                {conversations.reduce((acc, c) => acc + getUnreadCount(c), 0)}
                            </div>
                        </div>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-white transition-colors" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:border-accent/50 focus:outline-none transition-all placeholder:text-white/30"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                        {filteredConversations.length === 0 ? (
                            <div className="text-center py-12 text-white/40">
                                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p className="font-medium">No conversations yet</p>
                                <p className="text-sm mt-1">Start chatting with an artist!</p>
                            </div>
                        ) : (
                            filteredConversations.map((chat) => {
                                const otherId = chat.participants.find(p => p !== user?.uid);
                                const name = otherId ? chat.participantNames?.[otherId] : 'User';
                                const image = otherId ? chat.participantImages?.[otherId] : '';
                                const unread = getUnreadCount(chat);

                                return (
                                    <div
                                        key={chat.id}
                                        onClick={() => setActiveConversationId(chat.id)}
                                        className={`p-4 rounded-xl cursor-pointer transition-all border ${activeConversationId === chat.id
                                            ? 'bg-white/10 border-white/10 shadow-lg'
                                            : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'
                                            }`}
                                    >
                                        <div className="flex gap-4">
                                            <div className="relative shrink-0">
                                                <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10">
                                                    <img src={image || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`} alt={name} className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className={`font-bold truncate ${activeConversationId === chat.id ? 'text-white' : 'text-white/90'}`}>
                                                        {name}
                                                    </h3>
                                                    <span className={`text-xs ${unread > 0 ? 'text-accent font-bold' : 'text-white/40'}`}>
                                                        {formatConversationTime(chat.lastMessageAt)}
                                                    </span>
                                                </div>
                                                <p className={`text-sm truncate ${unread > 0 ? 'text-white font-medium' : 'text-white/50'}`}>
                                                    {chat.lastMessage || 'No messages yet'}
                                                </p>
                                            </div>
                                            {unread > 0 && (
                                                <div className="self-center w-5 h-5 bg-accent rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                                                    {unread}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`flex-1 flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
                    {activeConversationId && activeConversation ? (
                        <>
                            {/* Header */}
                            <div className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setActiveConversationId(null)}
                                        className="md:hidden p-2 -ml-2 text-white/60"
                                    >
                                        Back
                                    </button>
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10">
                                            <img src={otherUserImage || `https://api.dicebear.com/7.x/initials/svg?seed=${otherUserName}`} alt={otherUserName || ''} className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">{otherUserName}</h2>
                                        <p className="text-xs text-white/50">Click to view profile</p>
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
                                {messages.length === 0 ? (
                                    <div className="text-center py-12 text-white/40">
                                        <p>No messages yet. Say hello!</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-center">
                                            <span className="text-xs font-bold text-white/30 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full">Messages</span>
                                        </div>
                                        {messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[80%] md:max-w-[60%] rounded-2xl px-5 py-3 ${msg.senderId === user?.uid
                                                    ? 'bg-accent text-white rounded-br-none shadow-lg shadow-accent/20'
                                                    : 'bg-white/10 text-white rounded-bl-none border border-white/5'
                                                    }`}>
                                                    <p className="leading-relaxed">{msg.text}</p>
                                                    <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${msg.senderId === user?.uid ? 'text-white/60' : 'text-white/40'}`}>
                                                        {formatTime(msg.createdAt)}
                                                        {msg.senderId === user?.uid && <CheckCheck className="w-3 h-3" />}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </>
                                )}
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
                                        disabled={!messageInput.trim() || sending}
                                        className="p-4 bg-accent hover:bg-accent-light disabled:opacity-50 disabled:hover:bg-accent text-white rounded-2xl shadow-lg shadow-accent/20 transition-all hover:scale-105 active:scale-95"
                                    >
                                        {sending ? (
                                            <div className="scale-75">
                                                <PulsatingDots />
                                            </div>
                                        ) : (
                                            <Send className="w-5 h-5 translate-x-0.5" />
                                        )}
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
