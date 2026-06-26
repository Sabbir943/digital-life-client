"use client";

import React, { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import Swal from 'sweetalert2';
import Link from 'next/link';

const ProfilePage = () => {
    const { data: session, isPending: authPending } = authClient.useSession();
    const user = session?.user;

    const [myLessons, setMyLessons] = useState([]);
    const [savedCount, setSavedCount] = useState(0);
    const [loadingData, setLoadingData] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    // এডিট স্টেট
    const [displayName, setDisplayName] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');

    useEffect(() => {
        if (user) {
            setDisplayName(user.name || '');
            setPhotoUrl(user.image || '');
            fetchProfileStatsAndLessons();
        }
    }, [user]);

    // ১. ইউজারের তৈরি করা লেসন এবং সেভ করা লেসনের সংখ্যা ফেচ করা
    const fetchProfileStatsAndLessons = async () => {
        if (!user?.email) return;
        try {
            setLoadingData(true);
            
            // ইউজারের তৈরি করা নিজস্ব সব লেসন ফেচ
            const lessonsRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons?email=${user.email}`);
            const lessonsData = await lessonsRes.json();
            
            // ডাটা অ্যারে কিনা তা নিশ্চিত করা এবং শুধুমাত্র "Public" লেসনগুলো ফিল্টার করে সর্ট করা
            if (Array.isArray(lessonsData)) {
                const publicLessons = lessonsData
                    .filter(lesson => lesson.visibility === "Public")
                    .sort((a, b) => {
                        const dateA = a.createdAt ? new Date(a.createdAt) : 0;
                        const dateB = b.createdAt ? new Date(b.createdAt) : 0;
                        return dateB - dateA;
                    });
                setMyLessons(publicLessons);
            }

            // ইউজারের সেভ করা ফেভারিট লেসনের সংখ্যা জানার জন্য বুকমার্ক এপিআই কল
            const favRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.email}/favorites`);
            const favData = await favRes.json();
            if (Array.isArray(favData)) {
                setSavedCount(favData.length);
            }

        } catch (error) {
            console.error("Error fetching profile data:", error);
        } finally {
            setLoadingData(false);
        }
    };

    // ২. প্রোফাইল আপডেট হ্যান্ডলার (Better-Auth এর updateUser মেথড ব্যবহার করে)
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        
        if (!displayName.trim()) {
            return Swal.fire({ 
                icon: 'warning', 
                title: 'Name cannot be empty', 
                background: '#1e293b', 
                color: '#fff' 
            });
        }

        const fallbackPhoto = photoUrl.trim() || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName)}`;

        try {
            setIsUpdating(true);
            
            // 🟢 Better-Auth এর বিল্ট-ইন আপডেট ক্লায়েন্ট ফাংশন কল
            await authClient.updateUser({
                name: displayName.trim(),
                image: fallbackPhoto,
            });

            // লোকাল স্টেট সিঙ্ক নিশ্চিত করা
            setDisplayName(displayName.trim());
            setPhotoUrl(fallbackPhoto);

            Swal.fire({
                title: 'Profile Updated!',
                text: 'আপনার প্রোফাইলের তথ্য রিয়েল-টাইমে আপডেট করা হয়েছে।',
                icon: 'success',
                background: '#1e293b',
                color: '#fff',
                confirmButtonColor: '#6366f1'
            });
        } catch (error) {
            console.error("Failed to update profile:", error);
            Swal.fire({ 
                icon: 'error', 
                title: 'Update Failed', 
                text: 'Something went wrong while communicating with auth server.', 
                background: '#1e293b', 
                color: '#fff' 
            });
        } finally {
            setIsUpdating(false);
        }
    };

    if (authPending || loadingData) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-slate-400 animate-pulse">Loading your professional profile...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* প্রোফাইল কার্ড ও এডিট ফর্ম কন্টেইনার */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* বাম পাশের ভিজ্যুয়াল প্রোফাইল কার্ড */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 flex flex-col items-center text-center justify-center relative overflow-hidden backdrop-blur-md shadow-xl">
                    {/* প্রিমিয়াম ব্যাজ */}
                    {user?.userPlan === "Pro" && (
                        <span className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-orange-500/20 animate-pulse">
                            ⭐ Premium Pro
                        </span>
                    )}

                    <div className="relative group">
                        <img 
                            src={user?.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user?.name || 'default')}`} 
                            alt="Profile" 
                            className="w-24 h-24 rounded-full object-cover border-4 border-slate-800/80 group-hover:border-indigo-500/50 transition-all duration-300"
                        />
                    </div>

                    <h2 className="text-xl font-black text-white mt-4 tracking-tight">{user?.name || "Anonymous User"}</h2>
                    <p className="text-slate-400 text-xs mt-1 selection:bg-indigo-500">{user?.email}</p>

                    {/* স্ট্যাটস কাউন্টার */}
                    <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-6 border-t border-slate-900">
                        <div className="bg-slate-900/40 border border-slate-800/50 p-3 rounded-xl">
                            <span className="block text-xl font-black text-indigo-400">{myLessons.length}</span>
                            <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Public Shared</span>
                        </div>
                        <div className="bg-slate-900/40 border border-slate-800/50 p-3 rounded-xl">
                            <span className="block text-xl font-black text-rose-400">{savedCount}</span>
                            <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Saved Lessons</span>
                        </div>
                    </div>
                </div>

                {/* ডান পাশের প্রোফাইল এডিট ফর্ম */}
                <div className="lg:col-span-2 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-center">
                    <h3 className="text-md font-bold text-slate-200 mb-4 flex items-center gap-2">
                        🛠️ Manage Your Credentials
                    </h3>
                    
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* ডিসপ্লে নাম */}
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Display Name</label>
                                <input 
                                    type="text" 
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl px-4 py-2.5 text-slate-200 text-sm transition-all"
                                    placeholder="Your Name"
                                />
                            </div>

                            {/* ইমেইল এড্রেস (রিড অনলি) */}
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address (Non-Editable)</label>
                                <input 
                                    type="email" 
                                    value={user?.email || ''} 
                                    disabled
                                    className="w-full bg-slate-900/40 border border-slate-850 rounded-xl px-4 py-2.5 text-slate-500 text-sm cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* প্রোফাইল পিকচার ইউআরএল */}
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Profile Avatar URL</label>
                            <input 
                                type="text" 
                                value={photoUrl}
                                onChange={(e) => setPhotoUrl(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl px-4 py-2.5 text-slate-200 text-sm transition-all"
                                placeholder="https://example.com/photo.jpg"
                            />
                        </div>

                        {/* সাবমিট বাটন */}
                        <div className="flex justify-end pt-2">
                            <button 
                                type="submit"
                                disabled={isUpdating}
                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-indigo-600/10"
                            >
                                {isUpdating ? 'Saving...' : '💾 Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

            </div>

            <hr className="border-slate-900" />

            {/* ইউজারের তৈরি করা সকল পাবলিক লেসনের গ্রিড */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                        📜 My Published Wisdom ({myLessons.length})
                    </h2>
                    <p className="text-slate-400 text-xs mt-1">আপনার দ্বারা জনসমক্ষে প্রকাশিত সকল লাইফ লেসনগুলোর তালিকা নিচে দেওয়া হলো।</p>
                </div>

                {myLessons.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-slate-800 rounded-3xl bg-slate-900/10">
                        <p className="text-slate-500 text-sm font-medium">You haven't published any public lessons yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myLessons.map((lesson) => (
                            <div 
                                key={lesson._id} 
                                className="bg-slate-950/40 border border-slate-850/80 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all duration-300 backdrop-blur-sm group relative"
                            >
                                <div>
                                    {/* ক্যাটাগরি ও ইমোショナル টোন ব্যাজ */}
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-black uppercase rounded-md">
                                            {lesson.category}
                                        </span>
                                        <span className="text-[11px] font-bold text-violet-400 flex items-center gap-1">
                                            🎭 {lesson.emotionalTone}
                                        </span>
                                    </div>

                                    {/* টাইটেল */}
                                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
                                        {lesson.title}
                                    </h3>

                                    {/* লেসন কনটেন্টের ছোট অংশ */}
                                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                                        {lesson.lesson}
                                    </p>
                                </div>

                                <div className="mt-5 pt-4 border-t border-slate-900 flex items-center justify-between">
                                    {/* স্ট্যাটস (লাইক ও ফেভারিট কাউন্ট) */}
                                    <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
                                        <span>❤️ {lesson.likesCount || 0}</span>
                                        <span>🔖 {lesson.favoritesCount || 0}</span>
                                    </div>

                                    {/* ভিউ ডিটেইলস বাটন */}
                                    <Link 
                                        href={`/lessions/${lesson._id}`}
                                        className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-all"
                                    >
                                        Read Lesson ➔
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;