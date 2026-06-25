"use client";

import React, { useEffect, useState } from 'react';
import { FiStar, FiCheck, FiTrash2, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ManageLessons = () => {
    const [lessons, setLessons] = useState([]);
    const [stats, setStats] = useState({ public: 0, private: 0, flagged: 0 });
    const [category, setCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    const fetchAllLessons = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/admin/lessons?category=${category}`);
            const data = await res.json();
            if (res.ok) {
                setLessons(data.lessons);
                setStats(data.counts);
            }
        } catch (err) {
            toast.error("Failed to load lessons database");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllLessons();
    }, [category]);

    const handleFeature = async (id, currentStatus) => {
        try {
            const res = await fetch(`/api/admin/lessons/${id}/feature`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isFeatured: !currentStatus })
            });
            if (res.ok) {
                toast.success("Featured status toggled.");
                fetchAllLessons();
            }
        } catch (err) {
            toast.error("Action failed");
        }
    };

    const handleReview = async (id) => {
        try {
            const res = await fetch(`/api/admin/lessons/${id}/review`, { method: 'PATCH' });
            if (res.ok) {
                toast.success("Content marked as Reviewed.");
                fetchAllLessons();
            }
        } catch (err) {
            toast.error("Action failed");
        }
    };

    const handleDeleteLesson = async (id) => {
        if (!confirm("Are you sure you want to permanently delete this lesson?")) return;
        try {
            const res = await fetch(`/api/admin/lessons/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.error("Lesson has been permanently removed.");
                fetchAllLessons();
            }
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-100 tracking-wide">Manage All Lessons</h1>
                    <p className="text-sm text-slate-400">Review, Feature, or Delete platform content.</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-400">
                    <span className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">Public: {stats.public}</span>
                    <span className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">Private: {stats.private}</span>
                    <span className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-rose-400">Flagged: {stats.flagged}</span>
                </div>
            </div>

            <div className="flex gap-2 p-1.5 bg-slate-900/50 border border-slate-800/80 rounded-xl max-w-xs items-center text-xs text-slate-400">
                <span className="pl-2"><FiFilter /></span>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-transparent border-none text-slate-300 focus:outline-none w-full cursor-pointer font-medium">
                    <option value="All" className="bg-slate-950">All Categories</option>
                    <option value="Tech" className="bg-slate-950">Tech</option>
                    <option value="Career" className="bg-slate-950">Career</option>
                    <option value="Mindset" className="bg-slate-950">Mindset</option>
                </select>
            </div>

            {loading ? (
                <div className="text-slate-500 text-sm animate-pulse">Loading engine...</div>
            ) : (
                <div className="overflow-x-auto bg-slate-900/30 border border-slate-800/80 rounded-2xl backdrop-blur-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-bold text-xs uppercase tracking-wider">
                                <th className="p-4">Lesson Title & Creator</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Visibility</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-sm text-slate-300">
                            {lessons.map((l) => (
                                <tr key={l._id} className="hover:bg-slate-900/20 transition-colors">
                                    <td className="p-4">
                                        <p className="font-semibold text-slate-200">{l.title}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">By {l.user?.name || "Unknown"}</p>
                                    </td>
                                    <td className="p-4 text-xs font-medium text-slate-400">{l.category}</td>
                                    <td className="p-4">
                                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${l.visibility === 'Public' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                                            {l.visibility}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleFeature(l._id, l.isFeatured)} className={`p-2 border rounded-xl transition-all ${l.isFeatured ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-slate-950/40 text-slate-500 border-slate-800'}`}>
                                                <FiStar className={l.isFeatured ? "fill-amber-400" : ""} />
                                            </button>
                                            {!l.isReviewed && (
                                                <button onClick={() => handleReview(l._id)} className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-600 hover:text-white transition-all">
                                                    <FiCheck />
                                                </button>
                                            )}
                                            <button onClick={() => handleDeleteLesson(l._id)} className="p-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                                                <FiTrash2 />
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

export default ManageLessons;