"use client";

import React, { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import Swal from 'sweetalert2';

const MyLessons = () => {
    const { data: session, isPending: authPending } = authClient.useSession();
    const user = session?.user;
    const isPremiumUser = user?.userPlan === "Pro" || user?.isPremium || false;

    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // মোডাল এবং এডিটিং স্টেট
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);

    // ১. শুধুমাত্র লগইন করা ইউজারের লেসন ডাটা ফেচ করা
    const fetchMyLessons = async () => {
        if (!user?.email) return;
        try {
            setLoading(true);
            // ব্যাকএন্ডে কুয়েরি প্যারাম হিসেবে ইমেইল পাঠানো হচ্ছে যাতে ফিল্টারড ডাটা আসে
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons?email=${user.email}`);
            const data = await res.json();
            setLessons(data);
        } catch (error) {
            console.error("Error fetching lessons:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.email) {
            fetchMyLessons();
        }
    }, [user?.email]);

    // ২. টগল ভিজিবিলিটি (Public / Private) সরাসরি টেবিল থেকে
    const handleToggleVisibility = async (id, currentVisibility) => {
        const newVisibility = currentVisibility === "Public" ? "Private" : "Public";
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ visibility: newVisibility })
            });
            if (res.ok) {
                setLessons(prev => prev.map(l => l._id === id ? { ...l, visibility: newVisibility } : l));
                Swal.fire({ title: `Visibility updated to ${newVisibility}`, icon: 'success', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false, background: '#1e293b', color: '#fff' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    // ৩. টগল অ্যাক্সেস লেভেল (Free / Premium) — প্রিমিয়াম ইউজারদের জন্য
    const handleToggleAccess = async (id, currentAccess) => {
        if (!isPremiumUser) {
            Swal.fire({ icon: 'error', title: 'Access Denied', text: 'You need an active Premium Subscription to change Access Levels!', background: '#1e293b', color: '#fff' });
            return;
        }
        const newAccess = currentAccess === "Free" ? "Premium" : "Free";
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessLevel: newAccess })
            });
            if (res.ok) {
                setLessons(prev => prev.map(l => l._id === id ? { ...l, accessLevel: newAccess } : l));
                Swal.fire({ title: `Access updated to ${newAccess}`, icon: 'success', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false, background: '#1e293b', color: '#fff' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    // ৪. লেসন ডিলিট উইথ কনফার্মেশন পপআপ
    const handleDeleteLesson = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This lesson will be permanently removed!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#f43f5e',
            confirmButtonText: 'Yes, delete it!',
            background: '#0f172a',
            color: '#fff'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${id}`, { method: 'DELETE' });
                    if (res.ok) {
                        setLessons(prev => prev.filter(l => l._id !== id));
                        Swal.fire({ title: 'Deleted!', text: 'Your lesson has been deleted.', icon: 'success', background: '#1e293b', color: '#fff' });
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        });
    };

    // ৫. এডিট বোতামে ক্লিক করলে মোডাল ওপেন হবে এবং ডাটা প্রি-ফিল হবে
    const openEditModal = (lesson) => {
        setEditingLesson({ ...lesson });
        setIsEditModalOpen(true);
    };

    // ৬. মোডাল থেকে ডাটা আপডেট সাবমিট করা
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${editingLesson._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingLesson)
            });
            if (res.ok) {
                setLessons(prev => prev.map(l => l._id === editingLesson._id ? editingLesson : l));
                setIsEditModalOpen(false);
                Swal.fire({ icon: 'success', title: 'Lesson updated successfully! ✨', background: '#1e293b', color: '#fff', timer: 2000, showConfirmButton: false });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdateLoading(false);
        }
    };

    if (authPending || loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-slate-400 animate-pulse">Loading your wisdom repository...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* হেডার পার্ট */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                        📝 My Wisdom Vault
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">আপনার শেয়ার করা সমস্ত লাইফ লেসন এখান থেকে ম্যানেজ করুন।</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Total Lessons: {lessons.length}
                </div>
            </div>

            {/* ডাটা টেবিল কন্টেইনার */}
            {lessons.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
                    <p className="text-slate-400 font-medium">You haven't added any lessons yet.</p>
                </div>
            ) : (
                <div className="w-full overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-950/60 backdrop-blur-md shadow-xl">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800/80">
                                <th className="p-4">Lesson Title</th>
                                <th className="p-4">Stats</th>
                                <th className="p-4">Visibility</th>
                                <th className="p-4">Access Level</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                            {lessons.map((lesson) => (
                                <tr key={lesson._id} className="hover:bg-slate-900/40 transition-colors">
                                    {/* টাইটেল এবং ডেট */}
                                    <td className="p-4 max-w-xs truncate">
                                        <p className="font-semibold text-slate-100 truncate">{lesson.title}</p>
                                        <span className="text-[11px] text-slate-500 font-medium block mt-1">
                                            📅 {lesson.createdAt ? new Date(lesson.createdAt).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </td>
                                    {/* স্ট্যাটস কাউন্টার */}
                                    <td className="p-4 space-y-1">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                            <span>❤️</span> {lesson.likesCount || 0} Likes
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                            <span>🔖</span> {lesson.favoritesCount || 0} Saved
                                        </div>
                                    </td>
                                    {/* ভিজিবিলিটি টগল বাটন */}
                                    <td className="p-4">
                                        <button 
                                            onClick={() => handleToggleVisibility(lesson._id, lesson.visibility || "Public")}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                                lesson.visibility === "Private"
                                                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            }`}
                                        >
                                            {lesson.visibility || "Public"}
                                        </button>
                                    </td>
                                    {/* অ্যাক্সেস লেভেল টগল বাটন */}
                                    <td className="p-4">
                                        <button 
                                            onClick={() => handleToggleAccess(lesson._id, lesson.accessLevel || "Free")}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 ${
                                                lesson.accessLevel === "Premium"
                                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                    : 'bg-slate-800 text-slate-300 border-slate-700'
                                            }`}
                                        >
                                            {lesson.accessLevel === "Premium" ? "Premium ⭐" : "Free"}
                                        </button>
                                    </td>
                                    {/* অ্যাকশন বাটনস */}
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => openEditModal(lesson)}
                                                className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg border border-transparent hover:border-indigo-500/20 transition-all"
                                                title="Update Lesson"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteLesson(lesson._id)}
                                                className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg border border-transparent hover:border-rose-500/20 transition-all"
                                                title="Delete Permanently"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- ৬. আপডেট লেসন মোডাল (PRIVATE ROUTE LOGIC) --- */}
            {isEditModalOpen && editingLesson && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">🛠️ Edit Lesson Details</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-slate-300 text-lg">✕</button>
                        </div>
                        
                        <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                            {/* টাইটেল */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Lesson Title</label>
                                <input 
                                    type="text" 
                                    required
                                    value={editingLesson.title}
                                    onChange={(e) => setEditingLesson({...editingLesson, title: e.target.value})}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500" 
                                />
                            </div>

                            {/* ডেসক্রিপশন */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                                <textarea 
                                    rows="5" 
                                    required
                                    value={editingLesson.description}
                                    onChange={(e) => setEditingLesson({...editingLesson, description: e.target.value})}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 resize-none" 
                                />
                            </div>

                            {/* ক্যাটাগরি ও ইমোশনাল টোন */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                                    <select 
                                        value={editingLesson.category}
                                        onChange={(e) => setEditingLesson({...editingLesson, category: e.target.value})}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none"
                                    >
                                        <option value="Personal Growth">Personal Growth</option>
                                        <option value="Career">Hex Career</option>
                                        <option value="Relationships">Relationships</option>
                                        <option value="Mindset">Mindset</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Access Level</label>
                                    <select 
                                        disabled={!isPremiumUser}
                                        value={isPremiumUser ? editingLesson.accessLevel : "Free"}
                                        onChange={(e) => setEditingLesson({...editingLesson, accessLevel: e.target.value})}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none disabled:opacity-40"
                                    >
                                        <option value="Free">Free</option>
                                        <option value="Premium">Premium ⭐</option>
                                    </select>
                                </div>
                            </div>

                            {/* ইমেজ ইউআরএল */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cover Image URL (Optional)</label>
                                <input 
                                    type="url" 
                                    value={editingLesson.image || ''}
                                    onChange={(e) => setEditingLesson({...editingLesson, image: e.target.value})}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500" 
                                />
                            </div>

                            {/* সাবমিট বাটন */}
                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-sm font-semibold hover:text-slate-200">Cancel</button>
                                <button type="submit" disabled={updateLoading} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 flex items-center gap-2">
                                    {updateLoading ? "Saving Changes..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyLessons;