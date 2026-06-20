"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { FiCompass, FiPlus, FiBookOpen, FiGlobe, FiAward, FiLogOut, FiUser, FiMenu, FiX, FiChevronDown, FiHome } from 'react-icons/fi';

const Navbar = ({ session, userPlan = "Free" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const pathname = usePathname();

    // Better Auth simulated state
    const isLoggedIn = !!session; 
    const user = session?.user || { name: "Alex Dev", email: "alex@vitalic.com", image: "" };

    const isActive = (path) => pathname === path;

    // Base style classes for active/inactive links to avoid repetitions
    const getLinkClass = (path) => 
        `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            isActive(path)
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
        }`;

    return (
        <header className="  ">
            {/* Floating Glassmorphic Container */}
            <div className="  bg-slate-900/75 backdrop-blur-xl border border-slate-800/60 rounded-2xl shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                    
                    {/* 1. BRAND LOGO */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="p-2 bg-gradient-to-tr from-violet-500 via-indigo-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-105 transition-all duration-300 ring-2 ring-white/10">
                            <FiCompass className="w-5 h-5 text-white animate-spin-slow" />
                        </div>
                        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                            Aura<span className="text-indigo-400 font-semibold">Life</span>
                        </span>
                    </Link>

                    {/* 2. DESKTOP NAVIGATION LINKS */}
                    <div className="hidden md:flex items-center gap-1.5">
                        <Link href="/" className={getLinkClass('/')}>
                        <FiHome  className="w-4 h-4"></FiHome>
                            Home
                        </Link>
                        <Link href="/lessons" className={getLinkClass('/lessons')}>
                            <FiGlobe className="w-4 h-4" /> Explore 
                        </Link>


                        {/* Protected Client Routes */}
                        {isLoggedIn && (
                            <>
                                <Link href="/dashboard/add-lesson" className={getLinkClass('/dashboard/add-lesson')}>
                                    <FiPlus className="w-4 h-4" /> Add Lesson
                                </Link>
                                <Link href="/dashboard/my-lessons" className={getLinkClass('/dashboard/my-lessons')}>
                                    <FiBookOpen className="w-4 h-4" /> My Lessons
                                </Link>
                            </>
                        )}
                    </div>

                    {/* 3. RIGHT CONTROLS (Auth, Dropdown, & Pricing Context) */}
                    <div className="hidden md:flex items-center gap-4">
                        
                        {/* Pricing/Upgrade Button (Visible if Free Plan - placed dynamically near the Auth CTA) */}
                        {userPlan === "Free" && (
                            <Link
                                href="/pricing"
                                className="flex items-center gap-1.5 px-3.5 py-1.5 border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-full uppercase tracking-wider transition-all duration-300 shadow-sm"
                            >
                                <FiAward className="w-3.5 h-3.5 text-amber-400" /> Upgrade
                            </Link>
                        )}

                        {isLoggedIn ? (
                            /* Logged In User Menu */
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 p-1 pr-3 rounded-full bg-slate-950/40 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-200 focus:outline-none"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-inner text-sm overflow-hidden">
                                        {user.image ? <img src={user.image} alt="User Avatar" className="object-cover w-full h-full" /> : user.name.charAt(0)}
                                    </div>
                                    <span className="text-sm font-medium text-slate-300 max-w-[90px] truncate">{user.name}</span>
                                    <FiChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                                </button>

                                {/* Dropdown Menu overlay */}
                                {isDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                                        <div className="absolute right-0 mt-2.5 w-56 rounded-xl bg-slate-900 border border-slate-800/80 shadow-2xl p-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="px-3 py-2.5 border-b border-slate-800/60 mb-1.5">
                                                <p className="text-xs text-slate-500 font-medium">Logged in profile</p>
                                                <p className="text-sm font-semibold truncate text-slate-200">{user.email}</p>
                                            </div>
                                            <Link href="/profile" className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setIsDropdownOpen(false)}>
                                                <FiUser className="text-slate-400" /> Profile
                                            </Link>
                                            <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setIsDropdownOpen(false)}>
                                                <FiBookOpen className="text-slate-400" /> Dashboard
                                            </Link>
                                            <div className="h-px bg-slate-800/60 my-1.5" />
                                            <button onClick={() => console.log("Sign out")} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left font-medium">
                                                <FiLogOut /> Log out
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            /* Logged Out CTAs */
                            <div className="flex items-center gap-2">
                                <Link href="/auth/login" className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 transition-colors">
                                    Sign In
                                </Link>
                                <Link href="/auth/register" className="text-sm font-semibold bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-600 hover:opacity-95 text-white px-5 py-2 rounded-full transition-all shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20">
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
                <div className="md:hidden mt-2 max-w-7xl mx-auto rounded-2xl border border-slate-800/80 bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
                    <Link href="/" className={getLinkClass('/')} onClick={() => setIsOpen(false)}>Home</Link>
                    <Link href="/lessons" className={getLinkClass('/lessons')} onClick={() => setIsOpen(false)}>Public Lessons</Link>
                    
                    {isLoggedIn && (
                        <>
                            <Link href="/dashboard/add-lesson" className={getLinkClass('/dashboard/add-lesson')} onClick={() => setIsOpen(false)}>Add Lesson</Link>
                            <Link href="/dashboard/my-lessons" className={getLinkClass('/dashboard/my-lessons')} onClick={() => setIsOpen(false)}>My Lessons</Link>
                        </>
                    )}

                    {userPlan === "Free" && (
                        <Link href="/pricing" className="flex items-center gap-2 px-4 py-2 text-amber-400 font-medium text-sm rounded-full bg-amber-500/10" onClick={() => setIsOpen(false)}>
                            <FiAward /> Upgrade Plan
                        </Link>
                    )}

                    <div className="pt-3 border-t border-slate-800/60 mt-2">
                        {isLoggedIn ? (
                            <div className="space-y-1">
                                <div className="px-4 py-2 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm text-white">{user.name.charAt(0)}</div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{user.name}</p>
                                        <p className="text-xs text-slate-500 truncate max-w-[180px]">{user.email}</p>
                                    </div>
                                </div>
                                <Link href="/profile" className="block px-4 py-2 text-sm text-slate-400 hover:text-white" onClick={() => setIsOpen(false)}>Profile</Link>
                                <Link href="/dashboard" className="block px-4 py-2 text-sm text-slate-400 hover:text-white" onClick={() => setIsOpen(false)}>Dashboard</Link>
                                <button onClick={() => console.log("Sign out")} className="w-full text-left block px-4 py-2 text-sm text-rose-400 font-medium">Log out</button>
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