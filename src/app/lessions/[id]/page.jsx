"use client";

import React, { useEffect, useState, use } from 'react';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import Swal from 'sweetalert2';

const LessonDetailsPage = ({ params }) => {
    const resolvedParams = use(params);
    const lessonId = resolvedParams.id;
    
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const isPremiumUser = user?.userPlan === "Pro" || user?.isPremium || false;

    const [lesson, setLesson] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);

    // লাইক রিয়েল-টাইম স্টেট
    const [likesArray, setLikesArray] = useState([]);
    const [likesCount, setLikesCount] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [favoritesCount, setFavoritesCount] = useState(0);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${lessonId}`);
                const data = await res.json();
                setLesson(data);
                setLikesArray(data.likes || []);
                setLikesCount(data.likesCount || 0);
                setFavoritesCount(data.favoritesCount || 0);
                
                // কমেন্ট লোড করা
                const commentRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${lessonId}/comments`);
                const commentData = await commentRes.json();
                setComments(commentData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [lessonId]);

    // ❤️ লাইক বাটন লজিক
    const handleLikeToggle = async () => {
        if (!user) {
            Swal.fire({ icon: 'warning', title: 'Login Required', text: 'Please log in to like this lesson!', background: '#090d16', color: '#fff' });
            return;
        }

        const userEmail = user.email;
        const isAlreadyLiked = likesArray.includes(userEmail);
        
        const updatedLikes = isAlreadyLiked ? likesArray.filter(e => e !== userEmail) : [...likesArray, userEmail];
        setLikesArray(updatedLikes);
        setLikesCount(prev => isAlreadyLiked ? prev - 1 : prev + 1);

        try {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${lessonId}/like`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail })
            });
        } catch (err) {
            console.error(err);
        }
    };

    // 🔖 সেভ টু ফেভারিট লজিক
    const handleFavoriteToggle = async () => {
        if (!user) return;
        setIsSaved(!isSaved);
        setFavoritesCount(prev => !isSaved ? prev + 1 : prev - 1);
        Swal.fire({ icon: 'success', title: !isSaved ? 'Saved to Favorites!' : 'Removed!', toast: true, position: 'top-end', showConfirmButton: false, timer: 1500, background: '#1e293b', color: '#fff' });
        
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${lessonId}/favorite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user?.email, toggle: !isSaved })
        });
    };

    // 🚩 রিপোর্ট লেসন মডিউল
    const handleReport = async () => {
        if (!user) return;
        const { value: reason } = await Swal.fire({
            title: 'Report Inappropriate Content',
            input: 'select',
            inputOptions: {
                'Spam': 'Spam / Fake Information',
                'Harassment': 'Harassment / Hate Speech',
                'Inappropriate': 'Inappropriate content style'
            },
            inputPlaceholder: 'Select a reason',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            background: '#0f172a',
            color: '#fff'
        });

        if (reason) {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/reports`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lessonId, reporterEmail: user?.email, reason, timestamp: new Date() })
            });
            Swal.fire({ icon: 'success', title: 'Report Submitted', text: 'Thank you. Admin will review this content.', background: '#0f172a', color: '#fff' });
        }
    };

    // 💬 কমেন্ট সাবমিট লজিক
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const newCommentObj = {
            lessonId,
            userName: user?.name,
            userEmail: user?.email,
            userImage: user?.image || "https://placehold.co/100",
            commentText: newComment,
            createdAt: new Date().toISOString()
        };

        setComments([newCommentObj, ...comments]);
        setNewComment("");

        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${lessonId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCommentObj)
        });
    };

    if (loading) return <div className="min-h-screen bg-slate-950 flex justify-center items-center"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;

    {/* 🔒 ফিক্সড লজিক: কার্ড প্রিমিয়াম এবং ইউজার প্রো না হলে লক দেখাবে */}
    const isContentLocked = lesson?.accessLevel === "Premium" && !isPremiumUser;

    return (
        <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* ১. লেসন ইনফরমেশন এবং ব্লারড ব্যানার রেস্ট্রিকশন */}
                <div className="bg-gradient-to-b from-slate-900 to-black border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 relative overflow-hidden">
                    
                    <div className="flex flex-wrap justify-between items-center gap-3">
                        <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-xl text-xs font-bold">{lesson?.category}</span>
                        <span className="text-xs font-semibold text-slate-500">🎭 Emotional Tone: <strong className="text-slate-300">{lesson?.emotionalTone}</strong></span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">{lesson?.title}</h1>

                    {/* মেইন কন্টেন্ট বডি */}
                    <div className={`relative min-h-[150px] ${isContentLocked ? "blur-md select-none pointer-events-none" : ""}`}>
                        {lesson?.image && <img src={lesson?.image} alt="Featured" className="w-full h-64 object-cover rounded-2xl mb-6 border border-slate-800" />}
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">{lesson?.description}</p>
                    </div>

                    {/* প্রীমিয়াম লক ব্যানার ওভারলে */}
                    {isContentLocked && (
                        <div className="absolute inset-x-0 bottom-0 top-24 flex flex-col items-center justify-center bg-slate-950/80 p-6 text-center space-y-4">
                            <span className="text-4xl">⭐</span>
                            <h3 className="text-xl font-bold text-white">Unlock This Premium Insight</h3>
                            <p className="text-sm text-slate-400 max-w-sm">এই এক্সক্লুসিভ লাইফ লেসনটি পড়ার জন্য আপনার অ্যাকাউন্টটি প্রিমিয়ামে আপগ্রেড করুন।</p>
                            <Link href="/pricing" className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-sm px-6 py-3 rounded-xl shadow-lg">
                                Upgrade Plan Now 🚀
                            </Link>
                        </div>
                    )}

                    {/* ২. লেসন মেটাডেটা */}
                    <div className="border-t border-slate-900 pt-4 flex flex-wrap gap-4 text-xs text-slate-500 font-medium">
                        <span>📅 Created: {new Date(lesson?.createdAt).toLocaleDateString()}</span>
                        <span>🔄 Last Updated: {lesson?.updatedAt ? new Date(lesson.updatedAt).toLocaleDateString() : 'N/A'}</span>
                        <span>👁️ Views: {Math.floor(Math.random() * 10000)} (Simulated)</span>
                    </div>
                </div>

                {/* ৩. অথর/ক্রিয়েটর সেকশন এবং ৪. স্ট্যাটস অ্যান্ড এনগেজমেন্ট */}
                {!isContentLocked && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* ক্রিয়েটর কার্ড */}
                            <div className="md:col-span-2 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
                                <img 
                                    src={
                                        user?.email === lesson?.creatorEmail 
                                            ? user?.image 
                                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(lesson?.creatorName || 'Anonymous')}&background=f1f5f9&color=0f172a&bold=true`
                                    } 
                                    alt={lesson?.creatorName || "Author"} 
                                    className="w-14 h-14 rounded-full border border-slate-700 object-cover" 
                                />
                                <div className="space-y-1">
                                    <p className="text-xs text-slate-500">Shared Wisdom By</p>
                                    <h4 className="text-base font-black text-white">{lesson?.creatorName || "Anonymous"}</h4>
                                    <button className="text-[11px] font-bold text-indigo-400 hover:underline block">View all lessons by this author →</button>
                                </div>
                            </div>

                            {/* ইন্টারেকশন ও স্ট্যাটস কাউন্টার প্যানেল */}
                            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col justify-center space-y-4">
                                <div className="flex justify-around text-center text-xs text-slate-400">
                                    <div><p className="text-lg font-bold text-white">{likesCount}</p> Likes ❤️</div>
                                    <div><p className="text-lg font-bold text-white">{favoritesCount}</p> Saved 🔖</div>
                                </div>
                                <div className="flex gap-2 justify-center">
                                    <button onClick={handleLikeToggle} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all hover:cursor-pointer ${likesArray.includes(user?.email) ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-slate-950 border-slate-800 text-slate-300'}`}>❤️ Like</button>
                                    <button onClick={handleFavoriteToggle} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all hover:cursor-pointer ${isSaved ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-300'}`}>🔖 {isSaved ? "Saved" : "Save"}</button>
                                    <button onClick={handleReport} className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-950 border border-slate-800 text-rose-400 hover:cursor-pointer hover:bg-rose-500/10 transition-all">🚩 Report</button>
                                </div>
                            </div>
                        </div>

                        {/* ৬. কমেন্ট সেকশন */}
                        <div className="bg-gradient-to-b from-slate-900 to-black border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6">
                            <h3 className="text-lg font-black text-slate-100">Discussion & Comments ({comments.length})</h3>
                            
                            {user ? (
                                <form onSubmit={handleCommentSubmit} className="space-y-3">
                                    <textarea rows="3" required value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Share your reflections or ask a question about this lesson..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 resize-none" />
                                    <div className="flex justify-end"><button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-xs font-bold text-white">Post Comment</button></div>
                                </form>
                            ) : (
                                <p className="text-xs text-slate-500 bg-slate-950 p-4 rounded-xl text-center border border-slate-900">Please log in to participate in the discussion.</p>
                            )}

                            {/* কমেন্ট লিস্ট */}
                            <div className="space-y-4 divide-y divide-slate-900 pt-2">
                                {comments.map((c, i) => (
                                    <div key={i} className="flex gap-3 pt-4 first:pt-0">
                                        <img src={c.userImage} alt={c.userName} className="w-8 h-8 rounded-full border border-slate-800 object-cover" />
                                        <div>
                                            <div className="flex items-center gap-2"><span className="text-xs font-bold text-slate-200">{c.userName}</span><span className="text-[10px] text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</span></div>
                                            <p className="text-slate-400 text-xs mt-1 leading-relaxed">{c.commentText}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LessonDetailsPage;