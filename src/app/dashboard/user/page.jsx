"use client";

import React, { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

const DashboardHome = () => {
    const { data: session, isPending: authPending } = authClient.useSession();
    const user = session?.user;

    const [stats, setStats] = useState({ created: 0, saved: 0 });
    const [recentLessons, setRecentLessons] = useState([]);
    const [weeklyAnalytics, setWeeklyAnalytics] = useState([]); // 🟢 এখন এটি পুরোপুরি ডাইনামিক স্টেট
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (user) {
            fetchDashboardOverviewData();
        }
    }, [user]);

    // 🟢 বিগত ৭ দিনের কন্ট্রিবিউশন ক্যালকুলেট করার হেল্পার ফাংশন
    const generateWeeklyAnalytics = (allLessons) => {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const analyticsMap = {};

        // গত ৭ দিনের ডেট অবজেক্ট তৈরি এবং ম্যাপ ইনিশিয়ালাইজ করা
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayName = daysOfWeek[d.getDay()];
            const dateString = d.toDateString(); // ইউনিক কি (Key) হিসেবে ব্যবহারের জন্য
            
            analyticsMap[dateString] = {
                day: dayName,
                count: 0,
                dateObj: d
            };
        }

        // ইউজারের লেসনগুলো লুপ চালিয়ে সঠিক দিনের সাথে ম্যাচ করা
        allLessons.forEach(lesson => {
            if (!lesson.createdAt) return;
            const lessonDateStr = new Date(lesson.createdAt).toDateString();
            
            if (analyticsMap[lessonDateStr]) {
                analyticsMap[lessonDateStr].count += 1;
            }
        });

        // অবজেক্ট ম্যাপকে অ্যারেতে রূপান্তর এবং Tailwind হাইট ডাইনামিকালি সেট করা
        const formattedData = Object.values(analyticsMap).map(item => {
            let heightClass = 'h-2'; // ডিফল্ট (০টি লেসন থাকলে ছোট একটি ডট/বার দেখাবে)
            
            // কাউন্টের ওপর ভিত্তি করে গ্রাফ বারের হাইট নির্ধারণ (Tailwind Arbitrary values)
            if (item.count > 0 && item.count <= 2) heightClass = 'h-12';
            else if (item.count > 2 && item.count <= 4) heightClass = 'h-24';
            else if (item.count > 4 && item.count <= 7) heightClass = 'h-36';
            else if (item.count > 7) heightClass = 'h-44';

            return {
                day: item.day,
                count: item.count,
                height: heightClass
            };
        });

        setWeeklyAnalytics(formattedData);
    };

    const fetchDashboardOverviewData = async () => {
        if (!user?.email) return;
        try {
            setLoadingData(true);
            
            // ১. ইউজারের তৈরি করা সব লেসন ফেচ করা
            const lessonsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons?email=${user.email}`);
            const lessonsData = await lessonsRes.json();
            
            if (Array.isArray(lessonsData)) {
                setStats(prev => ({ ...prev, created: lessonsData.length }));
                
                // রিসেন্ট ৩টি লেসন ফিল্টার ও সর্ট করা (Newest First)
                const sortedRecent = [...lessonsData]
                    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                    .slice(0, 3);
                setRecentLessons(sortedRecent);

                // 🟢 ডাইনামিক চার্ট ডাটা জেনারেট করার ফাংশন কল
                generateWeeklyAnalytics(lessonsData);
            }

            // ২. ইউজারের সেভ করা ফেভারিট লেসন ফেচ করা
            const favRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.email}/favorites`);
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
                    <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between backdrop-blur-md shadow-lg group hover:border-indigo-500/30 transition-all">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Lessons Created</span>
                            <h3 className="text-3xl font-black text-white mt-1 group-hover:text-indigo-400 transition-colors">{stats.created}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xl">
                            📝
                        </div>
                    </div>

                    <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between backdrop-blur-md shadow-lg group hover:border-rose-500/30 transition-all">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Saved Favorites</span>
                            <h3 className="text-3xl font-black text-white mt-1 group-hover:text-rose-400 transition-colors">{stats.saved}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-xl">
                            🔖
                        </div>
                    </div>

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
                    </div>
                </div>

                {/* ডান পাশের এনালিটিক্স চার্ট উইজেট (এখন ১০০% ডাইনামিক) */}
                <div className="lg:col-span-2 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col backdrop-blur-md shadow-lg justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-slate-200">Weekly Reflections Chart</h3>
                            <p className="text-[11px] text-slate-500">গত ৭ দিনের রিয়েল-টাইম কন্ট্রিবিউশন বার গ্রাফ।</p>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">Live Sync</span>
                    </div>

                    {/* পিওর Tailwind বার চার্ট */}
                    <div className="flex items-end justify-between gap-2 pt-6 px-2 h-44 border-b border-slate-900">
                        {weeklyAnalytics.map((item, index) => (
                            <div key={index} className="flex flex-col items-center flex-1 group">
                                <div className="text-[10px] font-bold text-indigo-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {item.count} lessons
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
                
                {/* রিসেন্টলি অ্যাডেড লেসন লিস্ট */}
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
                                        <Link href={`/lessions/${lesson._id}`} className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300">
                                            View ➔
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* কুইক শর্টকাট অ্যাকশন প্যানেল */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-md font-bold text-slate-200">
                        ⚡ Quick Actions
                    </h3>
                    
                    <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-2.5 backdrop-blur-md shadow-lg">
                        <Link href="/dashboard/user/add-lesson" className="w-full p-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10">
                            ➕ Create New Lesson
                        </Link>
                        
                        <Link href="/dashboard/user/myProf" className="w-full p-3 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2">
                            👤 Edit Profile Info
                        </Link>

                        <Link href="/lessions" className="w-full p-3 bg-slate-900/40 hover:bg-slate-850 text-slate-400 hover:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-dashed border-slate-800">
                            🌐 Browse Public Feed
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardHome;