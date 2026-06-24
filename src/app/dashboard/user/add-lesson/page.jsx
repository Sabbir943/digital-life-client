"use client";

import React, { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import Swal from 'sweetalert2';

const AddLesson = () => {
    const { data: session } = authClient.useSession();
    const user = session?.user;
    
    const isPremiumUser = user?.plan === "premium" || user?.isPremium || false;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Personal Growth',
        emotionalTone: 'Motivational',
        image: '',
        accessLevel: 'Free'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const finalAccessLevel = isPremiumUser ? formData.accessLevel : "Free";

        const finalLessonData = {
            ...formData,
            accessLevel: finalAccessLevel,
            creatorName: user?.name || "Anonymous",
            creatorEmail: user?.email,
            creatorAvatar: user?.photoURL,
            createdAt: new Date().toISOString(),
            likesCount: 0,
            favoritesCount: 0,
            visibility: "Public"
        };

        try {
            const response = await fetch(`http://localhost:8000/api/lessons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalLessonData)
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Lesson Shared Successfully! ✨',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    background: '#1e293b',
                    color: '#fff',
                    iconColor: '#6366f1'
                });

                setFormData({
                    title: '',
                    description: '',
                    category: 'Personal Growth',
                    emotionalTone: 'Motivational',
                    image: '',
                    accessLevel: 'Free'
                });
            } else {
                throw new Error("Failed to store lesson");
            }
        } catch (error) {
            console.error("Submission error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Something went wrong!',
                text: 'Could not connect to the database.',
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-[80vh] flex items-center justify-center relative rounded-3xl border border-slate-800/80 bg-slate-900/40 p-4 sm:p-8 md:p-12 shadow-2xl overflow-hidden backdrop-blur-md">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-25%] left-[-15%] w-[400px] h-[400px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-25%] right-[-15%] w-[400px] h-[400px] bg-violet-500/10 blur-[130px] rounded-full pointer-events-none" />

            <div className="w-full max-w-3xl bg-slate-950/80 border border-slate-800/80 p-6 sm:p-10 rounded-2xl shadow-2xl relative z-10">
                
                {/* Section Header */}
                <div className="mb-10 border-b border-slate-800/60 pb-6">
                    <div className="flex items-center gap-3.5 mb-2">
                        <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center text-xl text-indigo-400 border border-indigo-500/20">
                            ✨
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">Share a New Life Lesson</h2>
                            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">আপনার অর্জিত অভিজ্ঞতা ও মূল্যবান দর্শন ড্যাশবোর্ডে যোগ করুন।</p>
                        </div>
                    </div>
                </div>

                {/* Form Input Container */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* 1. Lesson Title */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Lesson Title</label>
                        <input 
                            type="text" 
                            name="title" 
                            required 
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 text-sm" 
                            placeholder="E.g., Embracing failure as a roadmap to mastery" 
                        />
                    </div>

                    {/* 2. Full Description */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Full Description / Story / Insight</label>
                        <textarea 
                            name="description" 
                            rows="6" 
                            required 
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 text-sm resize-none" 
                            placeholder="আপনার জীবনের এই শিক্ষার পেছনের গল্প অথবা বাস্তব অভিজ্ঞতাটি সুন্দরভাবে ফুটিয়ে তুলুন..."
                        ></textarea>
                    </div>

                    {/* 3. Category & Emotional Tone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Category</label>
                            <select 
                                name="category" 
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-3.5 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer text-sm"
                            >
                                <option value="Personal Growth" className="bg-slate-950">Personal Growth</option>
                                <option value="Career" className="bg-slate-950">Career</option>
                                <option value="Relationships" className="bg-slate-950">Relationships</option>
                                <option value="Mindset" className="bg-slate-950">Mindset</option>
                                <option value="Mistakes Learned" className="bg-slate-950">Mistakes Learned</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Emotional Tone</label>
                            <select 
                                name="emotionalTone" 
                                value={formData.emotionalTone}
                                onChange={handleChange}
                                className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-3.5 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer text-sm"
                            >
                                <option value="Motivational" className="bg-slate-950">Motivational</option>
                                <option value="Sad" className="bg-slate-950">Sad</option>
                                <option value="Realization" className="bg-slate-950">Realization</option>
                                <option value="Gratitude" className="bg-slate-950">Gratitude</option>
                            </select>
                        </div>
                    </div>

                    {/* 4. Cover Image URL */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Cover Image URL (Optional)</label>
                        <input 
                            type="url" 
                            name="image" 
                            value={formData.image}
                            onChange={handleChange}
                            className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 text-sm" 
                            placeholder="https://images.unsplash.com/photo-example.jpg" 
                        />
                    </div>

                    {/* 5. Access Level Logic */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Access Level</label>
                        <div className="relative group">
                            <select 
                                name="accessLevel" 
                                value={isPremiumUser ? formData.accessLevel : "Free"}
                                onChange={handleChange}
                                disabled={!isPremiumUser} 
                                className={`w-full bg-slate-900/60 border rounded-xl px-4 py-3.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-all text-sm ${
                                    !isPremiumUser 
                                        ? 'border-slate-800/40 bg-slate-950/60 opacity-50 cursor-not-allowed text-slate-500' 
                                        : 'border-slate-800 cursor-pointer focus:ring-4 focus:ring-indigo-500/10'
                                }`}
                            >
                                <option value="Free" className="bg-slate-950 text-slate-100">Free Access</option>
                                <option value="Premium" className="bg-slate-950 text-slate-100">Premium ⭐ (Paid Content)</option>
                            </select>
                            
                            {!isPremiumUser && (
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:flex items-center justify-center w-full transition-all duration-300">
                                    <div className="bg-indigo-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl border border-indigo-400/30">
                                        🔒 Upgrade to Premium to create paid lessons.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-violet-500 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Publishing Wisdom...</span>
                                </>
                            ) : (
                                <span>🚀 Publish Lesson</span>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddLesson;