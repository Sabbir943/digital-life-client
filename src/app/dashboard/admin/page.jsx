"use client";

import React, { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const ADMIN_EMAIL = "admin@gmail.com";

export default function AdminDashboardHome() {
    const { data: session, isPending: authPending } = authClient.useSession();
    const router = useRouter();
    const [stats, setStats] = useState({ totalUsers: 0, publicLessons: 0, flaggedLessons: 0, todayLessons: 0 });
    const [topContributors, setTopContributors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authPending && (!session?.user || session.user.email !== ADMIN_EMAIL)) {
            router.replace('/');
        } else if (!authPending) {
            fetchMetrics();
        }
    }, [session, authPending, router]);

    const fetchMetrics = async () => {
        try {
            const uRes = await fetch('http://localhost:8000/api/admin/users');
            const lRes = await fetch('http://localhost:8000/api/admin/lessons');
            const users = await uRes.json();
            const lessons = await lRes.json();

            if (Array.isArray(users) && Array.isArray(lessons)) {
                const todayStr = new Date().toDateString();
                setStats({
                    totalUsers: users.length,
                    publicLessons: lessons.filter(l => l.visibility === 'Public').length,
                    flaggedLessons: lessons.filter(l => l.reports?.length > 0).length,
                    todayLessons: lessons.filter(l => new Date(l.createdAt).toDateString() === todayStr).length
                });

                // Top Contributors Logic
                const countMap = {};
                lessons.forEach(l => { if(l.userEmail) countMap[l.userEmail] = (countMap[l.userEmail] || 0) + 1; });
                const sorted = Object.keys(countMap).map(e => ({ email: e, count: countMap[e] })).sort((a,b) => b.count - a.count).slice(0, 3);
                setTopContributors(sorted);
            }
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    if (loading) return <div className="text-center py-20 text-xs text-slate-500 animate-pulse">Loading Analytics Panel...</div>;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: 'Total Users', val: stats.totalUsers, color: 'text-white' },
                    { label: 'Public Lessons', val: stats.publicLessons, color: 'text-emerald-400' },
                    { label: 'Reported Content', val: stats.flaggedLessons, color: 'text-rose-500' },
                    { label: "Today's Entries", val: stats.todayLessons, color: 'text-indigo-400' }
                ].map((card, i) => (
                    <div key={i} className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 backdrop-blur-md">
                        <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">{card.label}</span>
                        <h3 className={`text-3xl font-black ${card.color} mt-1`}>{card.val}</h3>
                    </div>
                ))}
            </div>

            {/* Graphs & Top Contributors Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-950/60 border border-slate-900 rounded-2xl p-5 backdrop-blur-md h-64 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-slate-200">Platform Growth Analytics</h3>
                        <p className="text-[11px] text-slate-500">Live user growth vs lesson contributions tracking graph.</p>
                    </div>
                    {/* Simulated Graph bars */}
                    <div className="flex items-end justify-between gap-4 h-32 border-b border-slate-900 pb-1">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => (
                            <div key={i} className="flex flex-col items-center flex-1 gap-1">
                                <div className="flex items-end gap-1 w-full justify-center">
                                    <div className="w-2.5 h-12 bg-indigo-500 rounded-t-sm"></div>
                                    <div className="w-2.5 h-20 bg-violet-400 rounded-t-sm"></div>
                                </div>
                                <span className="text-[9px] text-slate-500 mt-1">{m}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 backdrop-blur-md">
                    <h3 className="text-sm font-bold text-slate-200 mb-4">👑 Top Contributors</h3>
                    <div className="space-y-3">
                        {topContributors.map((c, i) => (
                            <div key={i} className="p-3 bg-slate-900/50 border border-slate-850 rounded-xl flex items-center justify-between">
                                <span className="text-xs text-slate-400 truncate max-w-[65%]">{c.email}</span>
                                <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">{c.count} Lessons</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}