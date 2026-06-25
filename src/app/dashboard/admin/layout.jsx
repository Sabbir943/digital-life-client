"use client";

import React, { useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const ADMIN_EMAIL = "admin@platform.com"; // 🔒 আপনার ফিক্সড অ্যাডমিন ইমেইল

const AdminLayout = ({ children }) => {
    const { data: session, isPending: authPending } = authClient.useSession();
    const user = session?.user;
    const router = useRouter();
    const pathname = usePathname();

    // 🛡️ গ্লোবাল অ্যাডমিন প্রোটেকশন চেক
    useEffect(() => {
        if (!authPending) {
            if (!user || user.email !== ADMIN_EMAIL) {
                router.push('/'); // অ্যাডমিন না হলে সাথে সাথে মেইন হোমপেজে রিডাইরেক্ট
            }
        }
    }, [user, authPending, router]);

    if (authPending) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-slate-950 gap-3">
                <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400 tracking-wider animate-pulse">Authenticating Admin Privileges...</p>
            </div>
        );
    }

    // মেইন গার্ড সিকিউরিটি ট্রিপল চেক
    if (!user || user.email !== ADMIN_EMAIL) return null;

    // সাইডবার নেভিগেশন লিংক ডেটা অ্যারে
    const navLinks = [
        { name: '📊 Dashboard Overview', path: '/dashboard/admin' },
        { name: '👥 Manage Users', path: '/dashboard/admin/manage-users' },
        { name: '📝 Manage Lessons', path: '/dashboard/admin/manage-lessons' },
        { name: '🚨 Flagged Content', path: '/dashboard/admin/reported-lessons' },
        { name: '⚙️ Admin Profile', path: '/dashboard/admin/profile' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased selection:bg-red-500/30">
            
            {/* ─── বাম পাশের অ্যাডমিন সাইডবার ─── */}
            <aside className="w-full md:w-64 bg-slate-950/80 md:min-h-screen p-6 border-b md:border-b-0 md:border-r border-slate-900 backdrop-blur-xl flex flex-col justify-between sticky top-0 z-40">
                <div className="space-y-8">
                    {/* লোগো/ব্র্যান্ডিং এরিয়া */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center font-black text-black text-sm shadow-lg shadow-red-600/20">
                            Ω
                        </div>
                        <div>
                            <h2 className="text-xs font-black text-white tracking-widest uppercase">Admin Terminal</h2>
                            <p className="text-[10px] text-red-400 font-bold tracking-tight mt-0.5">Platform Controller</p>
                        </div>
                    </div>

                    {/* ডাইনামিক সাইডবার লিংকসমূহ */}
                    <nav className="space-y-1.5">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    href={link.path}
                                    className={`w-full flex items-center px-4 py-3 rounded-xl font-bold text-xs transition-all duration-200 group ${
                                        isActive 
                                        ? 'bg-gradient-to-r from-red-950/40 via-slate-900/40 to-slate-900/10 text-red-400 border border-red-500/20 shadow-md shadow-red-500/5' 
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* সাইডবার বটম প্রোফাইল বা ব্যাক অ্যাকশন */}
                <div className="mt-8 pt-4 border-t border-slate-900/60 hidden md:block">
                    <Link href="/dashboard" className="w-full flex items-center justify-center p-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-850 rounded-xl font-bold text-[11px] text-slate-400 hover:text-slate-200 transition-all gap-1.5">
                        ➔ Standard Dashboard
                    </Link>
                </div>
            </aside>

            {/* ─── ডান পাশের ডাইনামিক কন্টেন্ট এরিয়া ─── */}
            <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto space-y-6">
                {/* টপ গ্লোবাল স্ট্যাটাস ইনডিকেটর বার */}
                <header className="flex justify-between items-center pb-4 border-b border-slate-900">
                    <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Secure Server Channel Active
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-black uppercase border border-red-500/20">
                            {user?.name || 'SuperAdmin'}
                        </span>
                    </div>
                </header>

                {/* সাব-পেজের মেইন কন্টেন্ট ইনজেকশন এরিয়া */}
                <div className="pt-2 animate-fade-in">
                    {children}
                </div>
            </main>
            
        </div>
    );
};

export default AdminLayout;