"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import Swal from 'sweetalert2';

const MyFavorites = () => {
    const { data: session, isPending: authPending } = authClient.useSession();
    const user = session?.user;

    const [favorites, setFavorites] = useState([]);
    const [filteredFavorites, setFilteredFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    // ফিল্টারিং স্টেট
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedTone, setSelectedTone] = useState('All');

    // ১. ব্যাকএন্ড থেকে ইউজারের সেভ করা ফেভারিট লিস্ট ফেচ করা
    const fetchFavorites = async () => {
        if (!user?.email) return;
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:8000/api/users/${user.email}/favorites`);
            const data = await res.json();
            setFavorites(data);
            setFilteredFavorites(data);
        } catch (error) {
            console.error("Error fetching favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.email) {
            fetchFavorites();
        }
    }, [user?.email]);

    // ২. ক্লায়েন্ট সাইড ফিল্টারিং লজিক (Category এবং Emotional Tone এর উপর ভিত্তি করে)
    useEffect(() => {
        let updatedList = [...favorites];

        if (selectedCategory !== 'All') {
            updatedList = updatedList.filter(lesson => lesson.category === selectedCategory);
        }

        if (selectedTone !== 'All') {
            updatedList = updatedList.filter(lesson => lesson.emotionalTone === selectedTone);
        }

        setFilteredFavorites(updatedList);
    }, [selectedCategory, selectedTone, favorites]);

    // ৩. ফেভারিট লিস্ট থেকে রিমুভ করার লজিক (টগল ফেভারিট এপিআই কল)
    const handleRemoveFavorite = async (lessonId) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${lessonId}/favorite`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user?.email, toggle: false }) // toggle: false মানে রিমুভ
            });

            if (res.ok) {
                // স্টেট থেকে সাথে সাথে রিমুভ করে দেওয়া যাতে পেজ রিফ্রেশ করতে না হয়
                setFavorites(prev => prev.filter(lesson => lesson._id !== lessonId));
                
                Swal.fire({
                    title: 'Removed from Favorites',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    background: '#1e293b',
                    color: '#fff',
                    iconColor: '#f43f5e'
                });
            } else {
                throw new Error("Failed to remove");
            }
        } catch (err) {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong!', background: '#1e293b', color: '#fff' });
        }
    };

    if (authPending || loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-slate-400 animate-pulse">Loading your saved wisdom...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* হেডার সেকশন */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                        🔖 Saved Bookmarks
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">আপনার সেভ করে রাখা জীবনমুখী শিক্ষণীয় গল্পগুলো এখানে সংরক্ষিত রয়েছে।</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Total Bookmarked: {favorites.length}
                </div>
            </div>

            {/* ফিল্টারিং প্যানেল */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md">
                {/* ক্যাটাগরি ফিল্টার */}
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Filter by Category</label>
                    <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                        <option value="All">All Categories</option>
                        <option value="Personal Growth">Personal Growth</option>
                        <option value="Career">Career</option>
                        <option value="Relationships">Beautiful Relationships</option>
                        <option value="Mindset">Mindset Shift</option>
                        <option value="Mistakes Learned">Mistakes Learned</option>
                    </select>
                </div>

                {/* ইমোশনাল টোন ফিল্টার */}
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Filter by Emotional Tone</label>
                    <select 
                        value={selectedTone}
                        onChange={(e) => setSelectedTone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                        <option value="All">All Tones</option>
                        <option value="Motivational">Motivational</option>
                        <option value="Sad">Sad / Emotional</option>
                        <option value="Realization">Realization</option>
                        <option value="Gratitude">Gratitude</option>
                    </select>
                </div>
            </div>

            {/* টেবিল কন্টেইনার */}
            {filteredFavorites.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-slate-800 rounded-3xl bg-slate-900/10">
                    <p className="text-slate-500 text-sm font-medium">No saved lessons found matching the criteria.</p>
                </div>
            ) : (
                <div className="w-full overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-950/60 backdrop-blur-md shadow-xl">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-slate-900/80 text-slate-400 font-bold border-b border-slate-800/80 text-xs uppercase tracking-wider">
                                <th className="p-4">Lesson Details</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Tone / Mood</th>
                                <th className="p-4">Creator</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                            {filteredFavorites.map((lesson) => (
                                <tr key={lesson._id} className="hover:bg-slate-900/30 transition-colors">
                                    
                                    {/* লেসন টাইটেল এবং টাইমিং */}
                                    <td className="p-4 max-w-xs">
                                        <p className="font-bold text-slate-100 truncate">{lesson?.title}</p>
                                        <span className="text-[10px] text-slate-500 font-medium block mt-1">
                                            🕒 Shared on: {new Date(lesson?.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>

                                    {/* ক্যাটাগরি ব্যাজ */}
                                    <td className="p-4">
                                        <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold rounded-lg">
                                            {lesson?.category}
                                        </span>
                                    </td>

                                    {/* ইমোশনাল টোন ব্যাজ */}
                                    <td className="p-4">
                                        <span className="px-2.5 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-bold rounded-lg">
                                            🎭 {lesson?.emotionalTone}
                                        </span>
                                    </td>

                                    {/* ক্রিয়েটর ইনফো */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
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
                                            <span className="text-xs font-medium text-slate-400 truncate max-w-[100px] block">
                                                {lesson?.creatorName}
                                            </span>
                                        </div>
                                    </td>

                                    {/* অ্যাকশন বাটনসমূহ */}
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {/* Details Button */}
                                            <Link 
                                                href={`/lessions/${lesson._id}`}
                                                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all"
                                            >
                                                👁️ View Details
                                            </Link>

                                            {/* Remove Button */}
                                            <button 
                                                onClick={() => handleRemoveFavorite(lesson._id)}
                                                className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-xl transition-all cursor-pointer"
                                                title="Remove from bookmarks"
                                            >
                                                ❌ Remove
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyFavorites;