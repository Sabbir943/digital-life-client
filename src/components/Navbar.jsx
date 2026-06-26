"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    FiCompass, FiPlus, FiBookOpen, FiGlobe, FiAward, 
    FiLogOut, FiUser, FiMenu, FiX, FiChevronDown, FiHome, FiShield 
} from 'react-icons/fi';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

// 🛡️ আপনার ফিক্সড অ্যাডমিন ইমেইল ক্রেডেনশিয়াল
const ADMIN_EMAIL = "admin@gmail.com";

const Navbar = () => { 
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const pathname = usePathname();
  
    // Better Auth সেশন কল
    const { data: session } = authClient.useSession(); 
    
    const handleLogOut = async () => {
        try {
            await authClient.signOut();
            toast.success("Logout done!!");
        } catch (err) {
            toast.error("Something went wrong!");
        }
    };
    
    const isLoggedIn = !!session; 
    const user = session?.user;
    
    // ⚡ অ্যাডমিন এবং প্রিমিয়াম ইউজার ভ্যালিডেশন
    const isAdmin = user?.email === ADMIN_EMAIL;
    const isPremiumUser = user?.userPlan === "Pro";

    // রোল অনুযায়ী ডাইনামিক ড্যাশবোর্ড রুট নির্ধারণ
    const dashboardHref = isAdmin ? '/dashboard/admin' : '/dashboard/user';

    const isActive = (path) => pathname === path;

    // Desktop Navlink Class
    const getLinkClass = (path) => 
        `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform-gpu border border-transparent min-w-[90px] justify-center ${
            isActive(path)
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
        }`;

    // Mobile Navlink Class
    const getMobileLinkClass = (path) => 
        `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            isActive(path)
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`;

    return (
        <header className="w-full sticky top-0 z-50">
            <div className="max-w-7xl mx-auto bg-slate-900/75 backdrop-blur-xl border border-slate-800/60 shadow-2xl">
                <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                    
                    {/* 1. BRAND LOGO */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="p-2 bg-gradient-to-tr from-violet-500 via-indigo-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-105 transition-all duration-300 ring-2 ring-white/10">
                            <FiCompass className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                            Aura<span className="text-indigo-400 font-semibold">Life</span>
                        </span>
                    </Link>

                    {/* 2. DESKTOP NAVIGATION LINKS (CONDITIONAL BY ROLE) */}
                    <div className="hidden md:flex items-center gap-1.5 min-h-[40px]">
                        <Link href="/" className={getLinkClass('/')}>
                            <FiHome className="w-4 h-4" /> Home
                        </Link>
                        <Link href="/lessions" className={getLinkClass('/lessions')}>
                            <FiGlobe className="w-4 h-4" /> Explore 
                        </Link>

                        {/* লগইন থাকা অবস্থায় ইউজার/অ্যাডমিন ভেদে আলাদা লিংক জেনারেট */}
                        {isLoggedIn && (
                            isAdmin ? (
                                <>
                                    <Link href="/dashboard/admin/manage-users" className={getLinkClass('/dashboard/admin/manage-users')}>
                                        <FiUser className="w-4 h-4" /> Users
                                    </Link>
                                    <Link href="/dashboard/admin/manage-lessons" className={getLinkClass('/dashboard/admin/manage-lessons')}>
                                        <FiBookOpen className="w-4 h-4" /> Lessons
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/dashboard/user/add-lesson" className={getLinkClass('/dashboard/add-lesson')}>
                                        <FiPlus className="w-4 h-4" /> Add Lesson
                                    </Link>
                                    <Link href="/dashboard/user/my-lessons" className={getLinkClass('/dashboard/my-lessons')}>
                                        <FiBookOpen className="w-4 h-4" /> My Lessons
                                    </Link>
                                </>
                            )
                        )}
                    </div>

                    {/* 3. RIGHT CONTROLS */}
                    <div className="hidden md:flex items-center gap-4 min-w-[150px] justify-end">
                        
                        {/* 🛡️ Admin Badge */}
                        {isLoggedIn && isAdmin && (
                            <span className="bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-rose-500/20 animate-pulse flex items-center gap-1">
                                <FiShield className="w-3 h-3" /> Admin
                            </span>
                        )}

                        {/* ⚡ Upgrade Button (ফ্রি ইউজার এবং অ্যাডমিন না হলে দেখাবে) */}
                        {isLoggedIn && !isPremiumUser && !isAdmin && (
                            <Link
                                href="/pricing"
                                className="flex items-center gap-1.5 px-3.5 py-1.5 border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-full uppercase tracking-wider transition-all duration-300 shadow-sm"
                            >
                                <FiAward className="w-3.5 h-3.5 text-amber-400" /> Upgrade
                            </Link>
                        )}

                        {/* 👑 Premium Badge */}
                        {isLoggedIn && isPremiumUser && !isAdmin && (
                            <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-amber-500/20">
                                ⭐ Premium
                            </span>
                        )}

                        {isLoggedIn ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 p-1 pr-3 rounded-full bg-slate-950/40 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-200 focus:outline-none"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-inner text-sm overflow-hidden">
                                        {user?.image ? <img src={user.image} alt="User Avatar" className="object-cover w-full h-full" referrerPolicy='no-referrer'/> : user?.name?.charAt(0) || "U"}
                                    </div>
                                    <span className="text-sm font-medium text-slate-300 max-w-[90px] truncate">{user?.name || "User"}</span>
                                    <FiChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                                </button>

                                {isDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                                        <div className="absolute right-0 mt-2.5 w-56 rounded-xl bg-slate-900 border border-slate-800/80 shadow-2xl p-1.5 z-20">
                                            <div className="px-3 py-2.5 border-b border-slate-800/60 mb-1.5 flex flex-col gap-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs text-slate-500 font-medium">Logged in profile</p>
                                                    {isAdmin ? (
                                                        <span className="text-[9px] text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded">ADMIN</span>
                                                    ) : isPremiumUser && (
                                                        <span className="text-[9px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">PRO</span>
                                                    )}
                                                </div>
                                                <p className="text-sm font-semibold truncate text-slate-200">{user?.email}</p>
                                            </div>
                                            
                                            {/* ডাইনামিক প্রোফাইল লিংক */}
                                            <Link href={isAdmin ? "/dashboard/admin/profile" : "/dashboard/user/profile"} className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setIsDropdownOpen(false)}>
                                                <FiUser className="text-slate-400" /> Profile
                                            </Link>
                                            
                                            {/* ডাইনামিক ড্যাশবোর্ড রুট লিংক */}
                                            <Link href={dashboardHref} className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setIsDropdownOpen(false)}>
                                                <FiBookOpen className="text-slate-400" /> Dashboard
                                            </Link>
                                            
                                            <div className="h-px bg-slate-800/60 my-1.5" />
                                            <button onClick={handleLogOut} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left font-medium">
                                                <FiLogOut /> Log out
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/auth/login" className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 transition-colors">
                                    Sign In
                                </Link>
                                <Link href="/auth/register" className="text-sm font-semibold bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-600 hover:opacity-95 text-white px-5 py-2 rounded-full transition-all shadow-md">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* MOBILE HAMBURGER BUTTON */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none transition-colors"
                        >
                            {isOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                        </button>
                    </div>

                </div>
            </div>

            {/* MOBILE DRAWER LAYOUT */}
            {isOpen && (
                <div className="md:hidden mt-2 max-w-7xl mx-auto rounded-2xl border border-slate-800/80 bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-2 shadow-2xl">
                    <Link href="/" className={getMobileLinkClass('/')} onClick={() => setIsOpen(false)}>Home</Link>
                    <Link href="/lessions" className={getMobileLinkClass('/lessions')} onClick={() => setIsOpen(false)}>Public Lessons</Link>
                    
                    {isLoggedIn && (
                        isAdmin ? (
                            <>
                                <Link href="/dashboard/admin/manage-users" className={getMobileLinkClass('/dashboard/admin/manage-users')} onClick={() => setIsOpen(false)}>Manage Users</Link>
                                <Link href="/dashboard/admin/manage-lessons" className={getMobileLinkClass('/dashboard/admin/manage-lessons')} onClick={() => setIsOpen(false)}>Manage Lessons</Link>
                            </>
                        ) : (
                            <>
                                <Link href="/dashboard/user/add-lesson" className={getMobileLinkClass('/dashboard/add-lesson')} onClick={() => setIsOpen(false)}>Add Lesson</Link>
                                <Link href="/dashboard/user/my-lessons" className={getMobileLinkClass('/dashboard/my-lessons')} onClick={() => setIsOpen(false)}>My Lessons</Link>
                            </>
                        )
                    )}

                    {/* Mobile Upgrade Link */}
                    {isLoggedIn && !isPremiumUser && !isAdmin && (
                        <Link href="/pricing" className="flex items-center gap-2 px-4 py-2.5 text-amber-400 font-medium text-sm rounded-xl bg-amber-500/10" onClick={() => setIsOpen(false)}>
                            <FiAward /> Upgrade Plan
                        </Link>
                    )}

                    <div className="pt-3 border-t border-slate-800/60 mt-2">
                        {isLoggedIn ? (
                            <div className="space-y-1">
                                <div className="px-4 py-2 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm text-white">
                                        {user?.image ? <img src={user.image} alt="User Avatar" className="object-cover w-full h-full rounded-full" /> : user?.name?.charAt(0) || "U"}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-white">{user?.name || "User"}</p>
                                            {isAdmin ? (
                                                <span className="bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded">ADMIN</span>
                                            ) : isPremiumUser && (
                                                <span className="bg-amber-500 text-black text-[8px] font-black px-1.5 py-0.5 rounded">PREMIUM</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 truncate max-w-[180px]">{user?.email}</p>
                                    </div>
                                </div>
                                <Link href={isAdmin ? "/dashboard/admin/profile" : "/profile"} className="block px-4 py-2 text-sm text-slate-400 hover:text-white" onClick={() => setIsOpen(false)}>Profile</Link>
                                <Link href={dashboardHref} className="block px-4 py-2 text-sm text-slate-400 hover:text-white" onClick={() => setIsOpen(false)}>Dashboard</Link>
                                <button onClick={handleLogOut} className="w-full text-left block px-4 py-2 text-sm text-rose-400 font-medium">Log out</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 px-2 pt-1">
                                <Link href="/auth/login" className="text-center py-2 text-sm font-medium text-slate-300 border border-slate-800 rounded-full hover:bg-white/5" onClick={() => setIsOpen(false)}>Sign In</Link>
                                <Link href="/auth/register" className="text-center py-2 text-sm font-semibold bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-full" onClick={() => setIsOpen(false)}>Get Started</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;