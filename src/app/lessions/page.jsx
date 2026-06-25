"use client";

import React, { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

const PublicLessonsPage = () => {
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const isPremiumUser = user?.plan === "premium" || user?.isPremium || false;

    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                // ব্যাকএন্ড থেকে সমস্ত পাবলিক লেসন নিয়ে আসা
                const res = await fetch('http://localhost:8000/api/public-lessons');
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
            <div className="min-h-screen bg-slate-950 flex justify-center items-center">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">🌟 Public Life Lessons</h1>
                    <p className="text-slate-400 text-sm mt-2">পৃথিবীর বিভিন্ন প্রান্তের মানুষের অভিজ্ঞতা ও জীবনের গভীর উপলব্ধি থেকে শিক্ষা নিন।</p>
                </div>

                {/* কার্ড লেআউট গ্রিড */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lessons.map((lesson) => {
                        const isLocked = lesson.accessLevel === "Premium" && !isPremiumUser;

                        return (
                            <div key={lesson._id} className="relative group overflow-hidden bg-gradient-to-b from-slate-900 to-black border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between h-[420px] transition-all duration-300 hover:border-slate-700">
                                
                                {/* কন্টেন্ট বডি (ইউজার প্রীমিয়াম না হলে ব্লার দেখাবে) */}
                                <div className={`p-6 space-y-4 flex-1 ${isLocked ? "blur-sm select-none pointer-events-none" : ""}`}>
                                    {/* ক্যাটাগরি ও অ্যাক্সেস ব্যাজ */}
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-md font-bold">
                                            {lesson.category}
                                        </span>
                                        <span className={`px-2.5 py-1 rounded-md font-black uppercase tracking-wider ${
                                            lesson.accessLevel === "Premium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-slate-800 text-slate-400"
                                        }`}>
                                            {lesson.accessLevel === "Premium" ? "Premium ⭐" : "Free"}
                                        </span>
                                    </div>

                                    {/* টাইটেল ও ডেসক্রিপশন প্রাকদর্শন */}
                                    <div>
                                        <h3 className="text-lg font-black text-slate-100 line-clamp-2 group-hover:text-white transition-colors">{lesson.title}</h3>
                                        <p className="text-slate-400 text-xs mt-2 leading-relaxed line-clamp-4">{lesson.description}</p>
                                    </div>

                                    {/* ইমোশনাল টোন */}
                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                        <span>🎭 Tone:</span> <span className="text-slate-300 font-medium">{lesson.emotionalTone}</span>
                                    </div>
                                </div>

                                {/* ক্রিয়েটর ইনফো এবং অ্যাকশন বাটন (এটি লক হলেও ভিজিবল থাকবে) */}
                                <div className="p-6 border-t border-slate-900 bg-black/40 flex flex-col gap-4 mt-auto">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <img 
                                                src={lesson.creator?.image || "https://placehold.co/100"} 
                                                alt={lesson.creator?.name}
                                                className="w-8 h-8 rounded-full border border-slate-800 object-cover"
                                            />
                                            <div>
                                                <p className="text-xs font-bold text-slate-200 truncate max-w-[120px]">{lesson.creator?.name}</p>
                                                <span className="text-[10px] text-slate-500 block">{new Date(lesson.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        {/* See Details বাটন */}
                                        {!isLocked && (
                                            <Link href={`/lessons/${lesson._id}`} className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 text-xs font-bold rounded-xl transition-all">
                                                See Details
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {/* 🔒 প্রীমিয়াম লক ওভারলে স্ক্রিন */}
                                {isLocked && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs z-10 p-6 text-center space-y-3">
                                        <div className="text-3xl drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]">🔒</div>
                                        <p className="text-sm font-black text-white">Premium Lesson</p>
                                        <p className="text-[11px] text-slate-400 max-w-[180px]">Upgrade to premium to unlock this lifelong wisdom.</p>
                                        <Link href="/dashboard/upgrade" className="mt-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-[11px] uppercase tracking-wider px-4 py-2 rounded-xl shadow-lg shadow-amber-500/10">
                                            Upgrade to view
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