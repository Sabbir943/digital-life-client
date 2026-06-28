"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiHeart, FiAward, FiBookmark, FiShield, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';
import Banner from '@/components/Banner';
import { authClient } from '@/lib/auth-client';




const HomePage = () => {

   const { 
        data: session, 
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession() 

    const user=session?.user;
    const [featured, setFeatured] = useState([]);
    const [topContributors, setTopContributors] = useState([]);
    const [mostSaved, setMostSaved] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ;

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                // Featured Lessons Fetch
               const resFeatured = await fetch(`${API_BASE_URL}/api/admin/lessons`, {
    cache: 'no-store' // ⚡ Forces Next.js to bypass cache and fetch raw data
});
                if (resFeatured.ok) {
                    const dataFeatured = await resFeatured.json();
                    console.log(dataFeatured)
                    if (dataFeatured && Array.isArray(dataFeatured.lessons)) {
                        const onlyFeatured = dataFeatured.lessons.filter(l => l && l.isFeatured === true);
                        setFeatured(onlyFeatured.slice(0, 6));
                    }
                }

                // Top Contributors Fetch
                const resOverview = await fetch(`${API_BASE_URL}/api/admin/overview-stats`);
                if (resOverview.ok) {
                    const dataOverview = await resOverview.json();
                    console.log(dataOverview)
                    setTopContributors(dataOverview.topContributors || []);
                }

                // Most Saved Lessons Fetch
                const resPublic = await fetch(`${API_BASE_URL}/api/public-lessons`);
                if (resPublic.ok) {
                    const dataPublic = await resPublic.json();
                    const publicLessonsArray = Array.isArray(dataPublic) ? dataPublic : [];
                    const sortedBySaved = [...publicLessonsArray].sort((a, b) => (b.favoritesCount || 0) - (a.favoritesCount || 0));
                    setMostSaved(sortedBySaved.slice(0, 3));
                }

            } catch (err) {
                console.error("Error loading homepage dynamic sections:", err);
            } finally {
                setLoading(false);
            }
        };


        fetchHomeData();
    }, [API_BASE_URL]);

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    return (
        // এখানে ব্যাকগ্রাউন্ড #525252 এবং টেক্সট হোয়াইট ও মিডিয়াম করা হয়েছে
        <div className="space-y-24 pb-24 bg-[#0D0D0D] text-white text-lg font-medium overflow-hidden">
            <Banner/>
           
           

            {/* ─── COMPONENT 2: FEATURED LIFE LESSONS (DYNAMIC) ─────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-2 mb-12">
                    <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30 uppercase tracking-widest">Curated Insights</span>
                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-white">Featured Life Lessons</h2>
                    <p className="text-neutral-200 max-w-xl mx-auto">Handpicked wisdom highlighted continuously from the admin server workspace.</p>
                </div>

                {loading ? (
                    <div className="text-center text-sm text-neutral-300 animate-pulse py-6">Connecting to database pipeline...</div>
                ) : featured.length === 0 ? (
                    <p className="text-center text-sm text-neutral-300">No featured lessons marked on dashboard yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {featured.map((lesson) => (
                            <div key={lesson._id} className="bg-white/10 border border-white/20 p-6 rounded-2xl flex flex-col justify-between backdrop-blur-xl hover:border-white/40 transition-all group relative">
                                <span className="absolute top-4 right-4 text-amber-300"><FiStar className="fill-amber-300 w-5 h-5" /></span>
                                <div className="space-y-3">
                                    <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-200 px-2.5 py-1 rounded-md uppercase">{lesson.category}</span>
                                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors line-clamp-1">{lesson.title}</h3>
                                    <p className="text-neutral-200 line-clamp-3 leading-relaxed">{lesson.description || lesson.content}</p>
                                </div>
                                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-sm text-neutral-300">
                                    <span>By {lesson.creatorName || "Anonymous"}</span>
                                    <Link href={`/lessons/${lesson._id}`} className="font-bold text-indigo-300 hover:underline">Read Intel →</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ─── COMPONENT 3: WHY LEARNING MATTERS (STATIC + ANIMATION) ─ */}
            <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white/5 to-transparent py-12 rounded-3xl border border-white/5"
            >
                <div className="text-center mx-auto space-y-2 mb-12">
                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-white">Why Learning From Life Matters</h2>
                    <p className="text-neutral-200 max-w-xl mx-auto">Preserving subjective blueprints to safely guide upcoming personal and career decisions.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 mx-auto lg:grid-cols-4 gap-6">
                    {/* Card 1 */}
                    <motion.div variants={fadeInUp} className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4 hover:bg-white/10 transition-colors">
                        <div className="p-3 bg-indigo-600/20 text-indigo-200 w-fit rounded-xl border border-white/10"><FiShield className="w-5 h-5"/></div>
                        <h3 className="font-bold text-white text-base">Avoid Repeated Mistakes</h3>
                        <p className="text-neutral-200 text-sm leading-relaxed">Documenting roadblocks acts as clear validation protocols so you never repeat past slip-ups.</p>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div variants={fadeInUp} className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4 hover:bg-white/10 transition-colors">
                        <div className="p-3 bg-emerald-600/20 text-emerald-200 w-fit rounded-xl border border-white/10"><FiCheckCircle className="w-5 h-5"/></div>
                        <h3 className="font-bold text-white text-base">Actionable Micro-Insights</h3>
                        <p className="text-neutral-200 text-sm leading-relaxed">No generic templates—only practical situation logs contextually built from genuine workflows.</p>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div variants={fadeInUp} className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4 hover:bg-white/10 transition-colors">
                        <div className="p-3 bg-amber-600/20 text-amber-200 w-fit rounded-xl border border-white/10"><FiTrendingUp className="w-5 h-5"/></div>
                        <h3 className="font-bold text-white text-base">Accelerated Maturity</h3>
                        <p className="text-neutral-200 text-sm leading-relaxed">Absorb structural field perspectives swiftly to cross highly complex socio-technical barriers.</p>
                    </motion.div>

                    {/* Card 4 */}
                    <motion.div variants={fadeInUp} className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4 hover:bg-white/10 transition-colors">
                        <div className="p-3 bg-rose-600/20 text-rose-200 w-fit rounded-xl border border-white/10"><FiAward className="w-5 h-5"/></div>
                        <h3 className="font-bold text-white text-base">Legacy Preservation</h3>
                        <p className="text-neutral-200 text-sm leading-relaxed">Your professional and psychological breakthroughs remain encrypted for long-term reference.</p>
                    </motion.div>
                </div>
            </motion.section>

            {/* ─── COMPONENT 4: TWO EXTRA DYNAMIC SECTIONS ─────────────────── */}
            
            {/* PART A: Top Contributors of the Week */}
            <section className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8">
                <div className="space-y-2 mb-10">
                    <h2 className="text-2xl font-black text-white tracking-wide text-center flex items-center gap-2">
                        <FiAward className="text-indigo-300" /> Top Contributors of the Week
                    </h2>
                    <p className="text-neutral-200">Profiles with the most shared technical and mental models recently.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {loading ? (
                        <div className="text-sm text-neutral-300 animate-pulse">Syncing active indexes...</div>
                    ) : topContributors.length === 0 ? (
                        <p className="text-sm text-neutral-300">No recent contributors registered.</p>
                    ) : (
                        topContributors.map((user, index) => (
                            <div key={index} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4 hover:bg-white/10 transition-all">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center font-black text-sm uppercase text-indigo-200 border border-white/20 overflow-hidden shrink-0">
                                    {user.image ? (
                                        <img src={user.image} alt={`${user.name || 'Contributor'}'s profile`} className="w-full h-full object-cover"/>
                                    ) : (
                                        user.name?.charAt(0) || "U"
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-base font-bold text-white truncate">{user.name || "Unknown User"}</p>
                                    <p className="text-sm text-indigo-200 font-medium mt-0.5">{user.lessonsCount || 0} Insights Created</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* PART B: Most Saved Lessons */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="space-y-2 mb-10">
                    <h2 className="text-2xl font-black text-white tracking-wide flex items-center gap-2">
                        <FiBookmark className="text-emerald-300" /> Most Saved Lessons
                    </h2>
                    <p className="text-neutral-200">Highly bookmarked structural frameworks by community consensus.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="text-sm text-neutral-300 animate-pulse">Filtering favorite streams...</div>
                    ) : mostSaved.length === 0 ? (
                        <p className="text-sm text-neutral-300">No bookmarks recorded by members yet.</p>
                    ) : (
                        mostSaved.map((lesson) => (
                            <div key={lesson._id} className="bg-white/5 border border-white/10 p-5 rounded-xl flex flex-col justify-between hover:scale-[1.01] transition-transform">
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono tracking-wider bg-black/20 border border-white/10 text-neutral-200 px-2 py-0.5 rounded">
                                            {lesson?.category}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-xs text-rose-300 bg-rose-500/20 px-2 py-1 rounded-lg border border-rose-500/30 font-bold">
                                            <FiHeart className="fill-rose-300 w-3 h-3"/> {lesson?.favoritesCount || 0} Saves
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white line-clamp-1">{lesson?.title}</h3>
                                    <p className="text-neutral-200 text-sm line-clamp-2 leading-relaxed">{lesson?.description || lesson.content}</p>
                                </div>
                                <div className="pt-4 mt-4 border-t border-white/10 text-right">
                                    <Link href={`/lessions/${lesson._id}`} className="text-sm font-bold text-emerald-300 hover:underline">
                                        Open Log →
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>


        </div>
    );
};

export default HomePage;