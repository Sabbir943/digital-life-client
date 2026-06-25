"use client";

import React, { useEffect, useState } from 'react';
import { FiSave, FiShield, FiCheckSquare } from 'react-icons/fi';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

const AdminProfile = () => {
    const { data: session, listSessions } = authClient.useSession();
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState('');
    const [moderationStats, setModerationStats] = useState({ reviewed: 0, flagsHandled: 0 });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || '');
            setPhoto(session.user.image || '');
        }
        
        // অ্যাডমিনের মডারেশন অ্যাক্টিভিটি ডেটা ফেচিং
        const fetchActivityLog = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/admin/profile-activity');
                if (res.ok) {
                    const data = await res.json();
                    setModerationStats(data.activitySummary);
                }
            } catch (err) {
                console.error("Failed to load activity logs.");
            }
        };
        fetchActivityLog();
    }, [session]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            // Better Auth ভ্যালিড ইউজার প্রোফাইল আপডেট এপিআই কল
            const { data, error } = await authClient.updateUser({
                name: name,
                image: photo,
            });

            if (error) {
                toast.error(error.message || "Update failed.");
            } else {
                toast.success("Admin core configuration updated!");
                window.location.reload(); // সেশন এবং ইন্টারফেস সিংক্রোনাইজ করার জন্য
            }
        } catch (err) {
            toast.error("Internal server configuration error");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h1 className="text-2xl font-black text-slate-100 tracking-wide">Admin Core Profile</h1>
                <p className="text-sm text-slate-400">View logs and manage profile configurations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Identity Frame Card */}
                <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-2xl text-center space-y-4 flex flex-col items-center justify-center">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-slate-800 ring-4 ring-rose-500/20 flex items-center justify-center overflow-hidden shadow-xl text-3xl font-black">
                            {photo ? <img src={photo} alt="Admin" className="w-full h-full object-cover"/> : name.charAt(0)}
                        </div>
                        <span className="absolute -bottom-2 -right-2 bg-rose-600 p-1.5 rounded-xl text-white shadow-lg"><FiShield className="w-4 h-4"/></span>
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-200">{session?.user?.name || "System Master"}</h2>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{session?.user?.email}</p>
                    </div>
                    <span className="bg-rose-500/10 text-rose-400 text-[10px] font-black px-3 py-1 rounded-full border border-rose-500/20 uppercase tracking-widest">
                        Root Access Admin
                    </span>
                </div>

                {/* Operations Insights Activity Panel */}
                <div className="md:col-span-2 bg-slate-900/40 border border-slate-800/60 p-5 rounded-2xl space-y-3 flex flex-col justify-center">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><FiCheckSquare /> Moderation Activity Log Summary</h3>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl space-y-1">
                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Lessons Moderated</span>
                            <span className="text-xl font-black text-slate-200">{moderationStats.reviewed}</span>
                        </div>
                        <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl space-y-1">
                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Flags Resolved</span>
                            <span className="text-xl font-black text-slate-200">{moderationStats.flagsHandled}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Update Settings Fields Form */}
            <form onSubmit={handleUpdate} className="bg-slate-900/20 border border-slate-800/80 p-6 rounded-2xl space-y-4 backdrop-blur-xl">
                <h3 className="text-sm font-bold text-slate-300 tracking-wide">Account Identity Customization</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs text-slate-400 font-semibold">Display Professional Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" required />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs text-slate-400 font-semibold">Profile Photo URL</label>
                        <input type="url" value={photo} onChange={(e) => setPhoto(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" required />
                    </div>
                </div>
                <button type="submit" disabled={updating} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/20 hover:opacity-95 transition-opacity disabled:opacity-50">
                    <FiSave /> {updating ? "Saving Parameters..." : "Save Profile Settings"}
                </button>
            </form>
        </div>
    );
};

export default AdminProfile;