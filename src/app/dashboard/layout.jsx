"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

const DashBoardLayout = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const isActiveLink = (href) => pathname === href;

    const getLinkStyle = (href) => 
        `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
            isActiveLink(href)
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 translate-x-1'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
        }`;

    const handleLogout = async () => {
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => router.push('/login')
                }
            });
        } catch (err) {
            console.error("Logout process failed:", err);
        }
    };

    if (isPending) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium text-sm animate-pulse">Loading dashboard environment...</p>
            </div>
        );
    }

    const isPremiumUser = user?.plan === "premium" || user?.isPremium;

    return (
        <div className="h-screen w-screen bg-slate-950 flex flex-col md:flex-row overflow-hidden antialiased font-sans text-slate-200">
            
            {/* --- MOBILE TOP BAR --- */}
            <div className="md:hidden bg-slate-900/80 backdrop-blur-md text-white px-5 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-slate-800/50 flex-shrink-0">
                <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-wider text-indigo-400">
                    🌱 <span>DLL</span>
                </Link>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/50"
                    aria-label="Toggle Menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* --- MOBILE SIDEBAR BACKDROP --- */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* --- SIDEBAR NAVIGATION --- */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800/60 p-5 flex flex-col justify-between
                transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-full flex-shrink-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="space-y-7">
                    {/* Brand Identity */}
                    <div className="px-2 py-3 border-b border-slate-800/60 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-600/40">
                            🧠
                        </div>
                        <div>
                            <h1 className="font-black tracking-wide text-md text-slate-100 leading-tight">Digital Life Lessons</h1>
                            <p className="text-[10px] text-slate-500 font-bold tracking-wider uppercase mt-0.5">User Dashboard</p>
                        </div>
                    </div>

                    {/* Navigation List */}
                    <nav>
                        <ul className="flex flex-col space-y-2">
                            <li>
                                <Link href="/dashboard" className={getLinkStyle('/dashboard')} onClick={() => setIsOpen(false)}>
                                    <span className="text-base">📊</span> Home Overview
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/user/add-lesson" className={getLinkStyle('/dashboard/user/add-lesson')} onClick={() => setIsOpen(false)}>
                                    <span className="text-base">➕</span> Add Lesson
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/user/my-lessons" className={getLinkStyle('/dashboard/user/my-lessons')} onClick={() => setIsOpen(false)}>
                                    <span className="text-base">📝</span> My Lessons
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/user/myFav" className={getLinkStyle('/dashboard/user/myFav')} onClick={() => setIsOpen(false)}>
                                    <span className="text-base">🔖</span> My Favorites
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/user/myProf" className={getLinkStyle('/dashboard/user/myProf')} onClick={() => setIsOpen(false)}>
                                    <span className="text-base">👤</span> Profile Settings
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                {/* --- FOOTER SECTIONS & LOGOUT --- */}
                <div className="space-y-4 border-t border-slate-800/60 pt-4">
                    {/* User Mini Card */}
                    <div className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800/40">
                        <img 
                            src={user?.image || user?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} 
                            alt={user?.name || "User Avatar"} 
                            referrerPolicy='no-referrer'
                            width={40} // 🟢 উইডথ ডিফাইন করে দেওয়া হলো লেআউট শিফট এড়াতে
                            height={40} // 🟢 হাইট ডিফাইন করে দেওয়া হলো
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-800"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-200 truncate">{user?.name || "Anonymous"}</p>
                            {isPremiumUser ? (
                                <span className="inline-flex items-center text-[9px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-md font-bold mt-0.5 border border-amber-500/20 shadow-sm animate-pulse">
                                    Premium ⭐
                                </span>
                            ) : (
                                <span className="inline-flex items-center text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-medium mt-0.5">
                                    Free Plan
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200 group"
                    >
                        <span className="text-lg transform group-hover:translate-x-1 transition-transform">🚪</span>
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* --- SCROLLABLE MAIN CONTENT AREA --- */}
            <div className="flex-1 min-h-0 h-full overflow-y-auto bg-slate-950 custom-scrollbar">
                <main className="p-5 sm:p-8 md:p-10 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>

        </div>
    );
};

export default DashBoardLayout;