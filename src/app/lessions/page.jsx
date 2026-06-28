"use client";

import React, { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

const PublicLessonsPage = () => {
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const isPremiumUser = user?.userPlan === "Pro";

    // 🔄 স্টেট ম্যানেজমেন্ট
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // সার্চ, ফিল্টার, সর্ট স্টেট
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [tone, setTone] = useState("All");
    const [sort, setSort] = useState("newest");
    
    // পেজিনেশন স্টেট
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 6; // প্রতি পেজে ৬ টি করে কার্ড দেখাবে

    useEffect(() => {
        const fetchLessons = async () => {
            setLoading(true);
            try {
                // কুয়েরি প্যারামিটার বিল্ড করা
                const queryParams = new URLSearchParams({
                    search,
                    category,
                    tone,
                    sort,
                    page: currentPage,
                    limit
                });

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public-lessons?${queryParams.toString()}`);
                const data = await res.json();
                
                if (data.lessons) {
                    setLessons(data.lessons);
                    setTotalPages(data.pagination.totalPages || 1);
                }
            } catch (err) {
                console.error("Error fetching public lessons:", err);
            } finally {
                setLoading(false);
            }
        };
        
        // টাইপিংয়ের সাথে সাথে ঘন ঘন রিকোয়েস্ট এড়াতে একটি ডিবউন্স বা সিম্পল ইফেক্ট ট্রিগার
        fetchLessons();
    }, [search, category, tone, sort, currentPage]);

    // ফিল্টার চেঞ্জ হলে পেজ ১-এ রিটার্ন করার হ্যান্ডলার
    const handleFilterChange = (setter, value) => {
        setter(value);
        setCurrentPage(1);
    };

    // পেজিনেশন বাটন জেনারেটর (ইমেজের মত '...' হ্যান্ডেল করার জন্য)
    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 3;

        for (let i = 1; i <= Math.min(maxVisiblePages, totalPages); i++) {
            pages.push(i);
        }

        if (totalPages > maxVisiblePages) {
            if (totalPages > maxVisiblePages + 1) {
                pages.push("...");
            }
            pages.push(totalPages);
        }

        return pages.map((page, index) => {
            if (page === "...") {
                return (
                    <span key={`ellipsis-${index}`} className="text-slate-600 px-2 font-medium">
                        •••
                    </span>
                );
            }
            return (
                <button
                    key={`page-${page}`}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${
                        currentPage === page
                            ? "bg-[#6320a0]/30 text-purple-400 border border-purple-500/30"
                            : "text-slate-500 hover:text-slate-300"
                    }`}
                >
                    {page}
                </button>
            );
        });
    };

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

                {/* 🔍 Challenge 1: Search, Filter, Sort Controls Panel */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    {/* Search Input */}
                    <div className="flex flex-col space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search Keywords</label>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleFilterChange(setSearch, e.target.value)}
                            placeholder="Type title or keyword..."
                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-slate-950 text-slate-800 font-medium shadow-2xs"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-col space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                        <select
                            value={category}
                            onChange={(e) => handleFilterChange(setCategory, e.target.value)}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-slate-950 text-slate-800 font-medium shadow-2xs"
                        >
                            <option value="All">All Categories</option>
                            <option value="Career">Career</option>
                            <option value="Relationships">Relationships</option>
                            <option value="Personal Growth">Personal Growth</option>
                            <option value="General">General</option>
                        </select>
                    </div>

                    {/* Emotional Tone Filter */}
                    <div className="flex flex-col space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Emotional Tone</label>
                        <select
                            value={tone}
                            onChange={(e) => handleFilterChange(setTone, e.target.value)}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-slate-950 text-slate-800 font-medium shadow-2xs"
                        >
                            <option value="All">All Tones</option>
                            <option value="Reflective">Reflective</option>
                            <option value="Motivated">Motivated</option>
                            <option value="Sad">Sad</option>
                            <option value="Neutral">Neutral</option>
                        </select>
                    </div>

                    {/* Sort Options */}
                    <div className="flex flex-col space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sort By</label>
                        <select
                            value={sort}
                            onChange={(e) => handleFilterChange(setSort, e.target.value)}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-slate-950 text-slate-800 font-medium shadow-2xs"
                        >
                            <option value="newest">Newest Added</option>
                            <option value="oldest">Oldest First</option>
                            <option value="most-saved">Most Favorited 🔖</option>
                            <option value="most-liked">Most Liked ❤️</option>
                        </select>
                    </div>
                </div>

                {/* Card Layout Grid / Loading State */}
                {loading ? (
                    <div className="h-64 flex justify-center items-center">
                        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : lessons.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium">No public lessons matched your filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {lessons.map((lesson) => {
                            const isPremiumLesson = lesson.accessLevel === "Premium";
                            const isLocked = isPremiumLesson && !isPremiumUser;

                            return (
                                <div
                                    key={lesson._id}
                                    className="relative group overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md flex flex-col justify-between h-[520px] transition-all duration-300 hover:border-slate-400"
                                >
                                    {/* Cover Image */}
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
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="bg-slate-100 border border-slate-200 text-slate-800 px-3 py-1 rounded-lg font-bold uppercase tracking-wider">
                                                {lesson?.category || "General"}
                                            </span>
                                            <span className={`px-3 py-1 rounded-lg font-black uppercase tracking-widest text-[10px] border ${
                                                isPremiumLesson ? "bg-amber-50 text-amber-700 border-amber-200 shadow-xs" : "bg-slate-50 text-slate-500 border-slate-100"
                                            }`}>
                                                {isPremiumLesson ? "Premium ⭐" : "Free"}
                                            </span>
                                        </div>

                                        <div className="flex-1 space-y-3">
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                                {lesson?.title}
                                            </h3>
                                            <p className="text-slate-600 text-[16px] font-normal leading-relaxed line-clamp-3">
                                                {lesson?.description}
                                            </p>
                                        </div>

                                        <div className="text-xs text-slate-400 flex items-center gap-1.5 font-semibold pt-2">
                                            <span>🎭 Tone:</span>
                                            <span className="text-slate-700 font-bold uppercase tracking-wide bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                                {lesson?.emotionalTone || "Neutral"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Creator Info Footer */}
                                    <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-4 mt-auto">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={
                                                        user?.email === lesson?.creatorEmail
                                                            ? user?.image
                                                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(lesson?.creatorName || 'Anonymous')}&background=f1f5f9&color=0f172a&bold=true`
                                                    }
                                                    alt={lesson?.creatorName || "Author"}
                                                    className="w-9 h-9 rounded-full border border-slate-200 object-cover shadow-xs"
                                                />
                                                <div>
                                                    <p className="text-xs font-bold text-slate-800 truncate max-w-[130px]">
                                                        {lesson?.creatorName || "Anonymous"}
                                                    </p>
                                                    <span className="text-[10px] font-medium text-slate-400 block mt-0.5">
                                                        {lesson.createdAt ? new Date(lesson.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Recent"}
                                                    </span>
                                                </div>
                                            </div>

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

                                    {/* Lock Overlay */}
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
                )}

                {/* 🪐 Challenge 3: Photo-Realistic Dark Pagination Controls (Attached Screen Design Match) */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center pt-8 border-t border-slate-100">
                        <div className="flex items-center gap-6 bg-[#090b11] px-6 py-4 rounded-3xl shadow-2xl border border-slate-900">
                            
                            {/* Previous Button */}
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm border transition-all ${
                                    currentPage === 1
                                        ? "border-slate-800 text-slate-700 cursor-not-allowed opacity-40"
                                        : "border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 active:scale-95"
                                }`}
                            >
                                <span>≪</span> Previous
                            </button>

                            {/* Center Numbers Container */}
                            <div className="flex items-center gap-1.5 bg-[#121420]/80 px-4 py-2 rounded-2xl border border-slate-800/40">
                                {renderPageNumbers()}
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-sm text-white transition-all shadow-md active:scale-95 ${
                                    currentPage === totalPages
                                        ? "bg-slate-800 text-slate-500 cursor-not-allowed opacity-40"
                                        : "bg-gradient-to-r from-[#ba43fc] via-[#8c3af5] to-[#4a4bf7] hover:brightness-110 shadow-purple-900/30"
                                }`}
                            >
                                Next <span>≫</span>
                            </button>
                            
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PublicLessonsPage;