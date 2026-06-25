"use client";

import React, { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

const PublicLessonsPage = () => {
    const { data: session } = authClient.useSession();
    const user = session?.user;
    
    // matching with the updated backend structure where plan can be "Pro" or "premium"
    const isPremiumUser = user?.userPlan === "Pro";

    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/lessons');
                const data = await res.json();
                setLessons(data);
            } catch (err) {
                console.error("Error fetching public lessons:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLessons();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex justify-center items-center">
                <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black py-12 px-4 sm:px-6 lg:px-8 selection:bg-slate-900 selection:text-white">
            <div className="max-w-6xl mx-auto space-y-10">
                
                {/* Header Section */}
                <div className="border-b border-slate-100 pb-6">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                        🌟 Public Life Lessons
                    </h1>
                    <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">
                        Explore shared wisdom, life-changing realisations, and personal insights from people worldwide.
                    </p>
                </div>

                {/* Card Layout Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {lessons.map((lesson) => {
                        const isPremiumLesson = lesson.accessLevel === "Premium";
                        const isLocked = isPremiumLesson && !isPremiumUser;
                         
                        return (
                            <div 
                                key={lesson._id} 
                                className="relative group overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md flex flex-col justify-between h-[520px] transition-all duration-300 hover:border-slate-400"
                            >
                                
                                {/* 🖼️ Lesson Cover Image Section */}
                                <div className="w-full h-44 overflow-hidden border-b border-slate-100 relative bg-slate-50">
                                    <img 
                                        src={lesson?.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop"} 
                                        alt={lesson?.title} 
                                        className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                                            isLocked ? "blur-md scale-110 select-none pointer-events-none" : ""
                                        }`}
                                    />
                                </div>

                                {/* Content Body */}
                                <div className={`p-6 space-y-4 flex-1 flex flex-col ${isLocked ? "blur-xs select-none pointer-events-none opacity-40" : ""}`}>
                                    
                                    {/* Category & Access Level Badges */}
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="bg-slate-100 border border-slate-200 text-slate-800 px-3 py-1 rounded-lg font-bold uppercase tracking-wider">
                                            {lesson?.category || "General"}
                                        </span>
                                        <span className={`px-3 py-1 rounded-lg font-black uppercase tracking-widest text-[10px] border ${
                                            isPremiumLesson 
                                                ? "bg-amber-50 text-amber-700 border-amber-200 shadow-xs" 
                                                : "bg-slate-50 text-slate-500 border-slate-100"
                                        }`}>
                                            {isPremiumLesson ? "Premium ⭐" : "Free"}
                                        </span>
                                    </div>

                                    {/* Title & Short Description Preview */}
                                    <div className="flex-1 space-y-3">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                            {lesson?.title}
                                        </h3>
                                        <p className="text-slate-600 text-[16px] font-normal leading-relaxed line-clamp-3">
                                            {lesson?.description}
                                        </p>
                                    </div>

                                    {/* Emotional Tone Indicator */}
                                    <div className="text-xs text-slate-400 flex items-center gap-1.5 font-semibold pt-2">
                                        <span>🎭 Tone:</span> 
                                        <span className="text-slate-700 font-bold uppercase tracking-wide bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                            {lesson?.emotionalTone || "Neutral"}
                                        </span>
                                    </div>
                                </div>

                              {/* Creator Info Panel & Navigation Action Button */}
<div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-4 mt-auto">
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            
            {/* 📸 ক্রিয়েটরের ইমেজ লজিক */}
            <img 
                src={
                    // যদি এই লেসনের ক্রিয়েটর এবং বর্তমান লগইন থাকা ইউজার একই হয়, তবে সেশনের ইমেজ দেখাবে
                    user?.email === lesson?.creatorEmail 
                        ? user?.image 
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(lesson?.creatorName || 'Anonymous')}&background=f1f5f9&color=0f172a&bold=true`
                } 
                alt={lesson?.creatorName || "Author"}
                className="w-9 h-9 rounded-full border border-slate-200 object-cover shadow-xs"
            />
            
            <div>
                {/* 👤 ডাটাবেজ থেকে সরাসরি আসা creatorName */}
                <p className="text-xs font-bold text-slate-800 truncate max-w-[130px]">
                    {lesson?.creatorName || "Anonymous"}
                </p>
                <span className="text-[10px] font-medium text-slate-400 block mt-0.5">
                    {lesson.createdAt ? new Date(lesson.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Recent"}
                </span>
            </div>
        </div>

        {/* See Details Button */}
        {!isLocked && (
            <Link 
                href={`/lessions/${lesson._id}`} 
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
            >
                See Details
            </Link>
        )}
    </div>
</div>

                                {/* 🔒 Professional Lock Overlay for Free Plan Viewers */}
                                {isLocked && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 p-6 text-center space-y-4 transition-all">
                                        <div className="w-12 h-12 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center text-xl shadow-xs animate-pulse">
                                            🔒
                                        </div>
                                        <div>
                                            <p className="text-md font-black text-slate-900 tracking-tight">Premium Insight Locked</p>
                                            <p className="text-xs text-slate-500 max-w-[200px] mt-1 mx-auto leading-normal font-medium">
                                                Upgrade your membership subscription package to view this insight.
                                            </p>
                                        </div>
                                        <Link 
                                            href="/pricing" 
                                            className="mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
                                        >
                                            Upgrade Plan
                                        </Link>
                                    </div>
                                )}

                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PublicLessonsPage;