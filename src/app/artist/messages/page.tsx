'use client';

import { useEffect, useRef, useState } from 'react';
import ArtistSidebar from '@/components/ArtistSidebar';
import { renderCanvas, stopCanvas } from '@/components/ui/canvas';
import { Search, MoreVertical, Phone, Video, Image as ImageIcon, Mic, Send, MessageSquare, CheckCheck } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import PulsatingDots from '@/components/ui/pulsating-loader';

export default function ArtistMessages() {
    const {
        user,
        profile,
        conversations,
        messages,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        markConversationRead
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

    const getInitials = (name: string) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex relative">
            <canvas className="pointer-events-none fixed inset-0 z-0" id="canvas" />
            <ArtistSidebar />

            <main className="flex-1 relative z-10 flex flex-col h-screen pt-20">
                <div className="flex-1 flex overflow-hidden p-6 gap-6">
                    {/* Contacts List */}
                    <div className={`w-80 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
                        <div className="p-4 border-b border-white/10">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-white">Messages</h2>
                                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">
                                    {conversations.reduce((acc, c) => acc + getUnreadCount(c), 0)}
                                </div>
                            </div>
                            <div className="relative">
                                <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search chats..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-accent/50"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            {filteredConversations.length === 0 ? (
                                <div className="text-center py-12 text-white/40">
                                    <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                    <p className="font-medium text-sm">No conversations yet</p>
                                </div>
                            ) : (
                                filteredConversations.map(chat => {
                                    const otherId = chat.participants.find(p => p !== user?.uid);
                                    const name = otherId ? chat.participantNames?.[otherId] : 'User';
                                    const image = otherId ? chat.participantImages?.[otherId] : '';
                                    const unread = getUnreadCount(chat);

                                    return (
                                        <div
                                            key={chat.id}
                                            onClick={() => setActiveConversationId(chat.id)}
                                            className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${activeConversationId === chat.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                                        >
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold overflow-hidden">
                                                    {image ? (
                                                        <img src={image} alt={name || ''} className="w-full h-full object-cover" />
                                                    ) : (
                                                        getInitials(name || '')
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-white font-medium truncate">{name}</h3>
                                                    <span className={`text-xs whitespace-nowrap ${unread > 0 ? 'text-accent font-bold' : 'text-white/40'}`}>
                                                        {formatConversationTime(chat.lastMessageAt)}
                                                    </span>
                                                </div>
                                                <p className={`text-sm truncate ${unread > 0 ? 'text-white font-medium' : 'text-white/60'}`}>
                                                    {chat.lastMessage || 'No messages yet'}
                                                </p>
                                            </div>
                                            {unread > 0 && (
                                                <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                    {unread}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className={`flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col overflow-hidden ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
                        {activeConversationId && activeConversation ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setActiveConversationId(null)}
                                            className="md:hidden p-2 -ml-2 text-white/60"
                                        >
                                            Back
                                        </button>
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold overflow-hidden">
                                            {otherUserImage ? (
                                                <img src={otherUserImage} alt={otherUserName || ''} className="w-full h-full object-cover" />
                                            ) : (
                                                getInitials(otherUserName || '')
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold">{otherUserName}</h3>
                                            <p className="text-white/60 text-xs">Click to view details</p>
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
                                    {messages.length === 0 ? (
                                        <div className="text-center py-12 text-white/40">
                                            <p>No messages yet. Say hello!</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-center">
                                                <span className="bg-white/5 text-white/40 text-xs px-3 py-1 rounded-full">Messages</span>
                                            </div>

                                            {messages.map((msg) => (
                                                <div
                                                    key={msg.id}
                                                    className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div className={`p-3 rounded-2xl max-w-[80%] ${msg.senderId === user?.uid
                                                        ? 'bg-accent text-white rounded-tr-sm'
                                                        : 'bg-white/10 text-white rounded-tl-sm'
                                                        }`}>
                                                        <p>{msg.text}</p>
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

                                {/* Input Area */}
                                <div className="p-4 border-t border-white/10 bg-white/5">
                                    <form onSubmit={handleSend} className="flex items-center gap-2">
                                        <button type="button" className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-accent transition-all">
                                            <ImageIcon className="w-5 h-5" />
                                        </button>
                                        <button type="button" className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-accent transition-all">
                                            <Mic className="w-5 h-5" />
                                        </button>
                                        <input
                                            type="text"
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent/50 placeholder:text-white/30"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!messageInput.trim() || sending}
                                            className="p-2.5 bg-accent hover:bg-accent-light disabled:opacity-50 text-white rounded-xl transition-all shadow-lg shadow-accent/20"
                                        >
                                            {sending ? (
                                                <div className="scale-75">
                                                    <PulsatingDots />
                                                </div>
                                            ) : (
                                                <Send className="w-5 h-5" />
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
            </main>
        </div>
    );
}
