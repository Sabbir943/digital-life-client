"use client";

import React, { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

const DashboardHome = () => {
    const { data: session, isPending: authPending } = authClient.useSession();
    const user = session?.user;

    const [stats, setStats] = useState({ created: 0, saved: 0 });
    const [recentLessons, setRecentLessons] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    // চার্টের জন্য মক ডাটা (ইউজারের সাপ্তাহিক কন্ট্রিবিউশন রিফ্লেকশন)
    const weeklyAnalytics = [
        { day: 'Sat', count: 2, height: 'h-12' },
        { day: 'Sun', count: 5, height: 'h-28' },
        { day: 'Mon', count: 3, height: 'h-16' },
        { day: 'Tue', count: 8, height: 'h-40' },
        { day: 'Wed', count: 4, height: 'h-20' },
        { day: 'Thu', count: 6, height: 'h-32' },
        { day: 'Fri', count: 1, height: 'h-6' },
    ];

    useEffect(() => {
        if (user) {
            fetchDashboardOverviewData();
        }
    }, [user]);

    const fetchDashboardOverviewData = async () => {
        if (!user?.email) return;
        try {
            setLoadingData(true);
            
            // ১. ইউজারের তৈরি করা লেসন ফেচ করা
            const lessonsRes = await fetch(`http://localhost:8000/api/lessons?email=${user.email}`);
            const lessonsData = await lessonsRes.json();
            
            if (Array.isArray(lessonsData)) {
                setStats(prev => ({ ...prev, created: lessonsData.length }));
                
                // রিসেন্ট ৩টি লেসন ফিল্টার ও সর্ট করা (Newest First)
                const sortedRecent = lessonsData
                    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                    .slice(0, 3);
                setRecentLessons(sortedRecent);
            }

            // ২. ইউজারের সেভ করা ফেভারিট লেসন ফেচ করা
            const favRes = await fetch(`http://localhost:8000/api/users/${user.email}/favorites`);
            const favData = await favRes.json();
            if (Array.isArray(favData)) {
                setStats(prev => ({ ...prev, saved: favData.length }));
            }

        } catch (error) {
            console.error("Error loading dashboard metrics:", error);
        } finally {
            setLoadingData(false);
        }
    };

    if (authPending || loadingData) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-slate-400 animate-pulse">Aggregating your insight metrics...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* টপ ওয়েলকাম ব্যানার */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-950/60 to-slate-950/40 border border-indigo-500/10 backdrop-blur-md relative overflow-hidden shadow-xl">
                <div className="relative z-10">
                    <h1 className="text-2xl font-black text-white tracking-tight">
                        Welcome Back, {user?.name || 'Explorer'}! 👋
                    </h1>
                    <p className="text-slate-400 text-xs mt-1">
                        আপনার আজকের ড্যাশবোর্ড ওভারভিউ এবং প্ল্যাটফর্মের পারফরম্যান্স স্ট্যাটস নিচে দেওয়া হলো।
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
            </div>

            {/* মেট্রিক্স এবং চার্ট গ্রিড */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* বাম পাশের মেট্রিক্স কার্ডস */}
                <div className="lg:col-span-1 flex flex-col gap-4 justify-between">
                    {/* কার্ড ১: মোট তৈরি করা লেসন */}
                    <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between backdrop-blur-md shadow-lg group hover:border-indigo-500/30 transition-all">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Lessons Created</span>
                            <h3 className="text-3xl font-black text-white mt-1 group-hover:text-indigo-400 transition-colors">{stats.created}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xl">
                            📝
                        </div>
                    </div>

                    {/* কার্ড ২: মোট সেভ করা লেসন */}
                    <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between backdrop-blur-md shadow-lg group hover:border-rose-500/30 transition-all">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Saved Favorites</span>
                            <h3 className="text-3xl font-black text-white mt-1 group-hover:text-rose-400 transition-colors">{stats.saved}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-xl">
                            🔖
                        </div>
                    </div>

                    {/* কার্ড ৩: মেম্বারশিপ প্ল্যান */}
                    <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between backdrop-blur-md shadow-lg">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Account Status</span>
                            <h3 className="text-lg font-black text-white mt-1 flex items-center gap-1.5">
                                {user?.userPlan === "Pro" ? (
                                    <span className="text-amber-400 flex items-center gap-1">⭐ Premium Pro</span>
                                ) : (
                                    <span className="text-slate-400">Standard Tier</span>
                                )}
                            </h3>
                        </div>
                        {user?.userPlan !== "Pro" && (
                            <Link href="/dashboard/billing" className="text-[11px] font-bold px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-all">
                                Upgrade
                            </Link>
                        )}
                    </div>
                </div>

                {/* ডান পাশের এনালিটিক্স চার্ট উইজেট */}
                <div className="lg:col-span-2 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col backdrop-blur-md shadow-lg justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-slate-200">Weekly Reflections Chart</h3>
                            <p className="text-[11px] text-slate-500">আপনার এই সপ্তাহের দৈনিক লেসন প্রকাশের রেশিও।</p>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">Active</span>
                    </div>

                    {/* পিওর Tailwind বার চার্ট */}
                    <div className="flex items-end justify-between gap-2 pt-6 px-2 h-44 border-b border-slate-900">
                        {weeklyAnalytics.map((item, index) => (
                            <div key={index} className="flex flex-col items-center flex-1 group">
                                <div className="text-[10px] font-bold text-indigo-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {item.count}
                                </div>
                                <div className={`w-full max-w-[24px] ${item.height} bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-violet-400 rounded-t-md transition-all duration-500 relative shadow-lg shadow-indigo-500/10`}></div>
                                <span className="text-[10px] text-slate-500 font-medium mt-2 block">{item.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* কুইক শর্টকাট এবং রিসেন্ট লেসন সেকশন গ্রিড */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* রিসেন্টলি অ্যাডেড লেসন লিস্ট (বাম পাশে ২ কলাম) */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-md font-bold text-slate-200 flex items-center gap-2">
                        ⏱️ Recently Added Insights
                    </h3>

                    {recentLessons.length === 0 ? (
                        <div className="p-8 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10 text-center">
                            <p className="text-xs text-slate-500">You haven't added any lessons yet.</p>
                            <Link href="/dashboard/add-lessons" className="text-xs text-indigo-400 hover:underline mt-2 inline-block">Create your first lesson now</Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentLessons.map((lesson) => (
                                <div key={lesson._id} className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl flex items-center justify-between hover:border-slate-800 transition-all">
                                    <div className="space-y-1 max-w-[70%]">
                                        <h4 className="text-xs font-bold text-slate-200 truncate">{lesson.title}</h4>
                                        <p className="text-[11px] text-slate-400 line-clamp-1">{lesson.lesson}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${lesson.visibility === 'Public' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                            {lesson.visibility}
                                        </span>
                                        <Link href={`/lessons/${lesson._id}`} className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300">
                                            View ➔
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* কুইক শর্টকাট অ্যাকশন প্যানেল (ডান পাশে ১ কলাম) */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-md font-bold text-slate-200">
                        ⚡ Quick Actions
                    </h3>
                    
                    <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-2.5 backdrop-blur-md shadow-lg">
                        <Link href="/dashboard/add-lessons" className="w-full p-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10">
                            ➕ Create New Lesson
                        </Link>
                        
                        <Link href="/dashboard/profile" className="w-full p-3 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2">
                            👤 Edit Profile Info
                        </Link>

                        <Link href="/" className="w-full p-3 bg-slate-900/40 hover:bg-slate-850 text-slate-400 hover:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-dashed border-slate-800">
                            🌐 Browse Public Feed
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardHome;