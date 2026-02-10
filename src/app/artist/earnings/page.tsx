'use client';

import { useEffect, useMemo } from 'react';
import ArtistSidebar from '@/components/ArtistSidebar';
import { renderCanvas, stopCanvas } from '@/components/ui/canvas';
import { Wallet, TrendingUp, ArrowUpRight, Download, DollarSign, Clock, Receipt } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function ArtistEarnings() {
    const { transactions, artistBookings } = useAuth();

    useEffect(() => {
        renderCanvas();
        return () => stopCanvas();
    }, []);

    // Calculate stats from real data
    const stats = useMemo(() => {
        const completedTransactions = transactions.filter(t => t.status === 'Completed');
        const totalEarned = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
        const pendingPayouts = transactions
            .filter(t => t.status === 'Processing' || t.status === 'Pending')
            .reduce((sum, t) => sum + t.amount, 0);
        const completedGigs = artistBookings.filter(b => b.status === 'Completed').length;
        const avgPerGig = completedGigs > 0 ? Math.round(totalEarned / completedGigs) : 0;

        return { totalEarned, pendingPayouts, avgPerGig, completedGigs };
    }, [transactions, artistBookings]);

    // Calculate monthly data for chart
    const monthlyData = useMemo(() => {
        const months = Array(12).fill(0);
        transactions.forEach(t => {
            if (t.status === 'Completed' && t.createdAt) {
                const date = (t.createdAt as { toDate?: () => Date })?.toDate?.() || new Date(t.createdAt as string);
                const month = date.getMonth();
                months[month] += t.amount;
            }
        });
        const maxAmount = Math.max(...months, 1);
        return months.map(amount => Math.round((amount / maxAmount) * 100));
    }, [transactions]);

    const formatDate = (timestamp: unknown) => {
        if (!timestamp) return 'N/A';
        const date = (timestamp as { toDate?: () => Date })?.toDate?.() || new Date(timestamp as string);
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    };

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
                                <h2 className="text-3xl font-bold text-white">₹{stats.totalEarned.toLocaleString()}</h2>
                                <div className="flex items-center gap-2 mt-2 text-green-400 text-sm font-medium">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>{stats.completedGigs} completed gigs</span>
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
                                <h2 className="text-3xl font-bold text-white">₹{stats.pendingPayouts.toLocaleString()}</h2>
                                <p className="text-white/40 text-sm mt-2">
                                    {stats.pendingPayouts > 0 ? 'Processing...' : 'No pending payouts'}
                                </p>
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
                                <h2 className="text-3xl font-bold text-white">₹{stats.avgPerGig.toLocaleString()}</h2>
                                <p className="text-white/40 text-sm mt-2">Based on {stats.completedGigs} gigs</p>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8">
                        <h3 className="text-xl font-bold text-white mb-6">Revenue Overview</h3>
                        <div className="h-64 flex items-end justify-between gap-4 px-4 pb-4 border-b border-white/10">
                            {monthlyData.map((h, i) => (
                                <div key={i} className="w-full bg-white/5 rounded-t-lg relative group h-full flex items-end">
                                    <div
                                        className="w-full bg-gradient-to-t from-accent/50 to-accent rounded-t-lg transition-all duration-500 group-hover:bg-accent-light"
                                        style={{ height: `${Math.max(h, 5)}%` }}
                                    />
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {h > 0 ? `${h}%` : 'No data'}
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
                            {transactions.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Receipt className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                    <p className="text-white/40 font-medium">No transactions yet</p>
                                    <p className="text-white/30 text-sm mt-1">Complete gigs to start earning!</p>
                                </div>
                            ) : (
                                transactions.slice(0, 10).map(tx => (
                                    <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                                {tx.status === 'Completed' ?
                                                    <ArrowUpRight className="w-5 h-5 text-green-400 rotate-45" /> :
                                                    <Clock className="w-5 h-5 text-yellow-400" />
                                                }
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{tx.clientName}</p>
                                                <p className="text-white/40 text-sm">{tx.type} • {formatDate(tx.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-bold">+₹{tx.amount.toLocaleString()}</p>
                                            <p className={`text-xs font-medium ${tx.status === 'Completed' ? 'text-green-400' :
                                                    tx.status === 'Processing' ? 'text-yellow-400' :
                                                        'text-white/40'
                                                }`}>
                                                {tx.status}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
