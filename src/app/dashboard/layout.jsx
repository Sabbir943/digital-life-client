"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DashBoardLayout = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // মক ইউজার ডাটা (আপনার Auth State থেকে এটি ডাইনামিক করে নেবেন)
    const user = {
        name: "John Doe",
        isPremium: true,
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
    };

    // লিংক অ্যাক্টিভ কিনা তা চেক করার ফাংশন
    const isActiveLink = (href) => pathname === href;

    const getLinkStyle = (href) => 
        `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
            isActiveLink(href)
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
        }`;

    const handleLogout = () => {
        // এখানে আপনার Better Auth বা কাস্টম লগআউট লজিক বসাবেন
        console.log("Logging out...");
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row antialiased font-sans text-slate-800">
            
            {/* --- MOBILE TOP BAR --- */}
            <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
                <Link href="/" className="flex items-center gap-2 font-black text-lg tracking-wider text-indigo-400">
                    🌱 <span>DLL</span>
                </Link>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-slate-400 hover:text-white focus:outline-none"
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
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* --- SIDEBAR NAVIGATION --- */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-white p-5 flex flex-col justify-between
                transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen sticky top-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="space-y-6">
                    {/* Brand Identity */}
                    <div className="px-2 py-4 border-b border-slate-800/60 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-600/30">
                            🧠
                        </div>
                        <div>
                            <h1 className="font-black tracking-wide text-md text-slate-100">Digital Life Lessons</h1>
                            <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">User Dashboard</p>
                        </div>
                    </div>

                    {/* Navigation List */}
                    <nav>
                        <ul className="flex flex-col space-y-1.5">
                            <li>
                                <Link href="/dashboard" className={getLinkStyle('/dashboard')} onClick={() => setIsOpen(false)}>
                                    <span className="text-lg">📊</span> Home Overview
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/user/add-lesson" className={getLinkStyle('/dashboard/user/add-lesson')} onClick={() => setIsOpen(false)}>
                                    <span className="text-lg">➕</span> Add Lesson
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/user/my-lessons" className={getLinkStyle('/dashboard/user/my-lessons')} onClick={() => setIsOpen(false)}>
                                    <span className="text-lg">📝</span> My Lessons
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/user/my-favorite" className={getLinkStyle('/dashboard/user/my-favorites')} onClick={() => setIsOpen(false)}>
                                    <span className="text-lg">🔖</span> My Favorites
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/user/My Profile" className={getLinkStyle('/dashboard/user/my-profile')} onClick={() => setIsOpen(false)}>
                                    <span className="text-lg">👤</span> Profile Settings
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                {/* --- FOOTER SECTIONS & LOGOUT --- */}
                <div className="space-y-4 border-t border-slate-800/60 pt-4">
                    {/* User Mini Card */}
                    <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-2xl border border-slate-800/40">
                        <img 
                            src={user.photoURL} 
                            alt={user.name} 
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-800"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-200 truncate">{user.name}</p>
                            {user.isPremium ? (
                                <span className="inline-flex items-center text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-md font-bold mt-0.5 border border-amber-500/20">
                                    Premium ⭐
                                </span>
                            ) : (
                                <span className="inline-flex items-center text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-medium mt-0.5">
                                    Free Plan
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200 group"
                    >
                        <span className="text-lg transform group-hover:translate-x-1 transition-transform">🚪</span>
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT LAYOUT --- */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-7xl w-full mx-autoA">
                    {children}
                </main>
            </div>

        </div>
    );
};

export default DashBoardLayout;