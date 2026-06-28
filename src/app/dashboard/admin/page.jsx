"use client";

import React, { useEffect, useState } from 'react';
import { FiUsers, FiBookOpen, FiAlertTriangle, FiTrendingUp, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminHome = () => {
    const [stats, setStats] = useState(null);
    const [contributors, setContributors] = useState([]);
    const [growthData, setGrowthData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // আপনার ব্যাকএন্ড এপিআই থেকে রিয়েল-টাইম ডাটা ফেচিং
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/overview-stats`);
                const data = await res.json();
                
                if (res.ok) {
                    setStats(data.stats);
                    setContributors(data.topContributors);
                    setGrowthData(data.growthTrends);
                } else {
                    toast.error(data.message || "Failed to load stats");
                }
            } catch (err) {
                toast.error("Network error! Could not connect to server.");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="text-center py-20 text-slate-400 font-medium animate-pulse">Loading platform analytics...</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-black text-slate-100 tracking-wide">Admin Overview</h1>
                <p className="text-sm text-slate-400">Platform-wide activity and metrics.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex items-start justify-between backdrop-blur-xl">
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Users</p>
                        <h3 className="text-3xl font-black text-slate-100">{stats?.totalUsers || 0}</h3>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/40"><FiUsers className="w-6 h-6 text-indigo-400" /></div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex items-start justify-between backdrop-blur-xl">
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Public Lessons</p>
                        <h3 className="text-3xl font-black text-slate-100">{stats?.totalPublicLessons || 0}</h3>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/40"><FiBookOpen className="w-6 h-6 text-emerald-400" /></div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex items-start justify-between backdrop-blur-xl">
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reported Content</p>
                        <h3 className="text-3xl font-black text-slate-100">{stats?.totalReportedLessons || 0}</h3>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/40">
                        <FiAlertTriangle className={`w-6 h-6 ${(stats?.totalReportedLessons || 0) > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`} />
                    </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex items-start justify-between backdrop-blur-xl">
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's New Lessons</p>
                        <h3 className="text-3xl font-black text-slate-100">{stats?.todaysLessons || 0}</h3>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/40"><FiTrendingUp className="w-6 h-6 text-amber-400" /></div>
                </div>
            </div>

            {/* Graphs & Top Contributors Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Dynamic Graph Area */}
                <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 flex flex-col justify-between min-h-[300px]">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-300 tracking-wide">Lesson Growth Trends</h2>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-md">Last 12 Submissions</span>
                    </div>
                    <div className="flex items-end justify-between gap-2 h-44 pt-6">
                        {growthData?.map((item, i) => (
                            <div key={i} className="flex-1 bg-gradient-to-t from-indigo-600/20 to-indigo-500 rounded-t-md transition-all duration-300 hover:to-violet-400" style={{ height: `${Math.min(item.count * 10, 100)}%` }} title={`Lessons: ${item.count}`} />
                        ))}
                    </div>
                </div>

                {/* Most Active Contributors */}
                <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6">
                    <h2 className="text-sm font-bold text-slate-300 tracking-wide mb-4">Most Active Contributors</h2>
                    <div className="space-y-4">
                        {contributors.length === 0 ? (
                            <p className="text-xs text-slate-500">No active contributors found.</p>
                        ) : (
                            contributors.map((contributor, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-900">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-xs text-white uppercase overflow-hidden">
                                            {contributor.image ? <img src={contributor.image} alt="" className="object-cover w-full h-full"/> : contributor.name?.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-200 truncate">{contributor.name}</p>
                                            <p className="text-[11px] text-slate-500 truncate">{contributor.email}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-lg border border-indigo-500/10">
                                        {contributor.lessonsCount}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;