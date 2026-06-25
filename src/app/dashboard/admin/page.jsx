"use client";

import React, { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ADMIN_EMAIL = "admin@platform.com"; // 🔒 আপনার ফিক্সড অ্যাডমিন ইমেইল

const AdminDashboardHome = () => {
    const { data: session, isPending: authPending } = authClient.useSession();
    const user = session?.user;
    const router = useRouter();

    const [stats, setStats] = useState({ totalUsers: 0, publicLessons: 0, flaggedLessons: 0, todayLessons: 0 });
    const [topContributors, setTopContributors] = useState([]);
    const [loading, setLoading] = useState(true);

    // গ্রোথ গ্রাফের জন্য ডাইনামিক অ্যানালিটিক্স ডেটা
    const growthAnalytics = [
        { month: 'Jan', users: 12, lessons: 25, uHeight: 'h-10', lHeight: 'h-20' },
        { month: 'Feb', users: 24, lessons: 48, uHeight: 'h-16', lHeight: 'h-28' },
        { month: 'Mar', users: 45, lessons: 90, uHeight: 'h-24', lHeight: 'h-36' },
        { month: 'Apr', users: 80, lessons: 140, uHeight: 'h-36', lHeight: 'h-44' },
    ];

    useEffect(() => {
        if (!authPending) {
            if (!user || user.email !== ADMIN_EMAIL) {
                router.push('/'); // অ্যাডমিন না হলে হোমপেজে রিডাইরেক্ট
            } else {
                fetchAdminMetrics();
            }
        }
    }, [user, authPending]);

    const fetchAdminMetrics = async () => {
        try {
            setLoading(true);
            // ১. সকল ইউজার ডেটা ফেচ
            const userRes = await fetch('http://localhost:8000/api/admin/users');
            const users = await userRes.json();

            // ২. সকল লেসন ডেটা ফেচ
            const lessonRes = await fetch('http://localhost:8000/api/admin/lessons');
            const lessons = await lessonRes.json();

            if (Array.isArray(users) && Array.isArray(lessons)) {
                const todayStr = new Date().toDateString();
                
                const todayCount = lessons.filter(l => new Date(l.createdAt).toDateString() === todayStr).length;
                const publicCount = lessons.filter(l => l.visibility === 'Public').length;
                const flaggedCount = lessons.filter(l => l.reports && l.reports.length > 0).length;

                setStats({
                    totalUsers: users.length,
                    publicLessons: publicCount,
                    flaggedLessons: flaggedCount,
                    todayLessons: todayCount
                });

                // মোস্ট অ্যাক্টিভ কন্ট্রিবিউটর ক্যালকুলেট করা (Top 3)
                const contributorMap = {};
                lessons.forEach(l => {
                    if(!l.userEmail) return;
                    contributorMap[l.userEmail] = (contributorMap[l.userEmail] || 0) + 1;
                });

                const sortedContributors = Object.keys(contributorMap)
                    .map(email => ({ email, count: contributorMap[email] }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 3);

                setTopContributors(sortedContributors);
            }
        } catch (error) {
            console.error("Admin metrics fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    if (authPending || loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* টপ মেগা ওভারভিউ প্যানেল */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Total Active Users</span>
                    <h3 className="text-3xl font-black text-white mt-1">{stats.totalUsers}</h3>
                </div>
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Public Insights</span>
                    <h3 className="text-3xl font-black text-emerald-400 mt-1">{stats.publicLessons}</h3>
                </div>
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Flagged/Reported</span>
                    <h3 className="text-3xl font-black text-rose-500 mt-1">{stats.flaggedLessons}</h3>
                </div>
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Today's New Entries</span>
                    <h3 className="text-3xl font-black text-indigo-400 mt-1">{stats.todayLessons}</h3>
                </div>
            </div>

            {/* গ্রাফ ও কন্ট্রিবিউটর গ্রিড */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* গ্রোথ চার্ট উইজেট */}
                <div className="lg:col-span-2 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-slate-200">Platform Growth Analytics</h3>
                        <p className="text-[11px] text-slate-500">ইউজার বৃদ্ধি (Indigo) বনাম লেসন কন্ট্রিবিউশন (Violet)।</p>
                    </div>

                    <div className="flex items-end justify-between gap-4 pt-8 px-2 h-44 border-b border-slate-900">
                        {growthAnalytics.map((item, index) => (
                            <div key={index} className="flex flex-col items-center flex-1">
                                <div className="flex items-end gap-1.5 w-full justify-center">
                                    <div className={`w-3 ${item.uHeight} bg-indigo-500 rounded-t-sm shadow-md`}></div>
                                    <div className={`w-3 ${item.lHeight} bg-violet-400 rounded-t-sm shadow-md`}></div>
                                </div>
                                <span className="text-[10px] text-slate-500 font-bold mt-2">{item.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* শীর্ষ কন্ট্রিবিউটর প্যানেল */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-slate-200 mb-4">👑 Most Active Contributors</h3>
                        <div className="space-y-3">
                            {topContributors.map((c, i) => (
                                <div key={i} className="p-3 bg-slate-900/50 border border-slate-850 rounded-xl flex items-center justify-between">
                                    <span className="text-xs text-slate-300 font-medium truncate max-w-[70%]">{c.email}</span>
                                    <span className="text-[11px] font-black bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                                        {c.count} Lessons
                                    </span>
                                </div>
                            ))}
                            {topContributors.length === 0 && <p className="text-xs text-slate-500">No active data yet.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardHome;