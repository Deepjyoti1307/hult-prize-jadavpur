'use client';

import { useEffect } from 'react';
import ArtistSidebar from '@/components/ArtistSidebar';
import { renderCanvas, stopCanvas } from '@/components/ui/canvas';
import { Wallet, TrendingUp, ArrowUpRight, Download, Calendar, DollarSign, Clock } from 'lucide-react';

export default function ArtistEarnings() {
    useEffect(() => {
        renderCanvas();
        return () => stopCanvas();
    }, []);

    const transactions = [
        { id: 1, client: 'Priya Sharma', date: 'Oct 24, 2023', amount: 12000, status: 'Completed', type: 'Gig Payment' },
        { id: 2, client: 'Rahul Verma', date: 'Oct 20, 2023', amount: 8000, status: 'Processing', type: 'Advance' },
        { id: 3, client: 'Wedding Planners Inc', date: 'Oct 15, 2023', amount: 25000, status: 'Completed', type: 'Gig Payment' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex relative">
            <canvas className="pointer-events-none fixed inset-0 z-0" id="canvas" />
            <ArtistSidebar />

            <main className="flex-1 overflow-y-auto relative z-10">
                <div className="p-8 pt-20">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Earnings & Payouts</h1>
                            <p className="text-white/60">Track your revenue and withdrawal history</p>
                        </div>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-light text-white rounded-xl font-medium transition-all shadow-lg shadow-accent/20">
                            <Download className="w-4 h-4" />
                            Download Report
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-50 font-black text-6xl text-white/5 select-none -mr-4 -mt-4">₹</div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-2 text-white/60">
                                    <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                                        <Wallet className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium">Total Earned</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white">₹45,000</h2>
                                <div className="flex items-center gap-2 mt-2 text-green-400 text-sm font-medium">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>+15% this month</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-2 text-white/60">
                                    <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium">Pending Payouts</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white">₹8,000</h2>
                                <p className="text-white/40 text-sm mt-2">Available for withdrawal in 2 days</p>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-2 text-white/60">
                                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium">Avg. Per Gig</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white">₹15,000</h2>
                                <p className="text-white/40 text-sm mt-2">Based on last 3 gigs</p>
                            </div>
                        </div>
                    </div>

                    {/* Chart Placeholder */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8">
                        <h3 className="text-xl font-bold text-white mb-6">Revenue Overview</h3>
                        <div className="h-64 flex items-end justify-between gap-4 px-4 pb-4 border-b border-white/10">
                            {[40, 60, 45, 90, 30, 75, 50, 80, 60, 95, 85, 100].map((h, i) => (
                                <div key={i} className="w-full bg-white/5 rounded-t-lg relative group h-full flex items-end">
                                    <div
                                        className="w-full bg-gradient-to-t from-accent/50 to-accent rounded-t-lg transition-all duration-500 group-hover:bg-accent-light"
                                        style={{ height: `${h}%` }}
                                    />
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        ₹{(h * 500).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-white/40 text-sm">
                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
                            <button className="text-accent text-sm font-medium hover:underline flex items-center gap-1">
                                View All <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="divide-y divide-white/5">
                            {transactions.map(tx => (
                                <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                            {tx.status === 'Completed' ?
                                                <ArrowUpRight className="w-5 h-5 text-green-400 rotate-45" /> :
                                                <Clock className="w-5 h-5 text-yellow-400" />
                                            }
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{tx.client}</p>
                                            <p className="text-white/40 text-sm">{tx.type} • {tx.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-bold">+₹{tx.amount.toLocaleString()}</p>
                                        <p className={`text-xs font-medium ${tx.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                                            {tx.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
