"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiZap, FiLayers, FiAward, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const sliderSlides = [
    {
        id: 1,
        badge: "Preserve Wisdom",
        icon: <FiZap className="w-4 h-4 text-amber-400" />,
        title: "Your Life Lessons, Permanently Documented.",
        description: "Don't let valuable life teachings and personal growth insights fade away over time. Build your own secure safekeeping handbook of wisdom today.",
        image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop", // A premium notebook/reflection image
        bgGradient: "from-slate-950 via-indigo-950/50 to-slate-950",
        borderColor: "border-indigo-500/30",
        badgeBg: "bg-indigo-500/10 text-indigo-300",
        ctaText: "Start Documenting",
        link: "/dashboard/add-lesson"
    },
    {
        id: 2,
        badge: "Mindful Community",
        icon: <FiLayers className="w-4 h-4 text-violet-400" />,
        title: "Explore Shared Wisdom From Thinkers Worldwide.",
        description: "Accelerate your personal growth by browsing curated public lessons. Learn from real-life case studies and meaningful reflections shared by others.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop", // A collaborative/community growth image
        bgGradient: "from-slate-950 via-violet-950/50 to-slate-950",
        borderColor: "border-violet-500/30",
        badgeBg: "bg-violet-500/10 text-violet-300",
        ctaText: "Explore Public Lessons",
        link: "/lessons"
    },
    {
        id: 3,
        badge: "Premium Access",
        icon: <FiAward className="w-4 h-4 text-amber-400" />,
        title: "Unlock Exclusive Deep-Dives & Life Frameworks.",
        description: "Upgrade to our Premium plan to gain instant access to high-value premium insights, deep mental models, and specialized wisdom content.",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop", // A premium success/growth framework image
        bgGradient: "from-slate-950 via-fuchsia-950/40 to-slate-950",
        borderColor: "border-amber-500/30",
        badgeBg: "bg-amber-500/10 text-amber-300",
        ctaText: "Upgrade To Premium",
        link: "/pricing"
    }
];

const Banner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance slides every 6 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 6000);
        return () => clearInterval(timer);
    }, [currentSlide]);

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev === 0 ? sliderSlides.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentSlide((prev) => (prev + 1) % sliderSlides.length);
    };

    return (
        <div className="relative max-w-7xl mx-auto px-4 pt-4 pb-8 sm:px-6 group/banner">
            {/* Main Wrapper with Glassmorphic styling */}
            <div className="relative min-h-[520px] md:h-[480px] w-full rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-950">
                
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.01 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.99 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className={`absolute inset-0 bg-gradient-to-br ${sliderSlides[currentSlide].bgGradient} flex items-center`}
                    >
                        {/* Ambient Grid Background Overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-25" />
                        
                        {/* 2-Column Responsive Layout */}
                        <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-8 md:px-16 py-12 md:py-0">
                            
                            {/* Left Side: Content Area */}
                            <div className="space-y-5 text-left order-2 md:order-1">
                                {/* Dynamic Badge */}
                                <motion.span 
                                    initial={{ y: -15, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className={`inline-flex items-center gap-2 px-3 py-1 border ${sliderSlides[currentSlide].borderColor} ${sliderSlides[currentSlide].badgeBg} text-xs font-bold rounded-full uppercase tracking-widest`}
                                >
                                    {sliderSlides[currentSlide].icon}
                                    {sliderSlides[currentSlide].badge}
                                </motion.span>

                                {/* Main Title */}
                                <motion.h1 
                                    initial={{ y: 15, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.2]"
                                >
                                    {sliderSlides[currentSlide].title}
                                </motion.h1>

                                {/* Description */}
                                <motion.p 
                                    initial={{ y: 15, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-slate-400 text-sm sm:text-base leading-relaxed font-normal line-clamp-3 md:line-clamp-none"
                                >
                                    {sliderSlides[currentSlide].description}
                                </motion.p>

                                {/* Dynamic CTA Button */}
                                <motion.div 
                                    initial={{ y: 15, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="pt-2"
                                >
                                    <Link 
                                        href={sliderSlides[currentSlide].link} 
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-full shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5 duration-200 transform-gpu"
                                    >
                                        {sliderSlides[currentSlide].ctaText} <FiArrowRight className="w-4 h-4" />
                                    </Link>
                                </motion.div>
                            </div>

                            {/* Right Side: Relevant Image Area */}
                            <div className="order-1 md:order-2 flex justify-center md:justify-end">
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
                                    className="relative w-full max-w-[400px] h-[200px] sm:h-[260px] md:h-[320px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group"
                                >
                                    <img 
                                        src={sliderSlides[currentSlide].image} 
                                        alt={sliderSlides[currentSlide].badge}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {/* Glassmorphic inner gradient vignette */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                                </motion.div>
                            </div>

                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Left/Right Manual Navigation Buttons (visible on hover) */}
                <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 opacity-0 group-hover/banner:opacity-100 transition-all duration-300 backdrop-blur-md focus:outline-none"
                    aria-label="Previous slide"
                >
                    <FiChevronLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 opacity-0 group-hover/banner:opacity-100 transition-all duration-300 backdrop-blur-md focus:outline-none"
                    aria-label="Next slide"
                >
                    <FiChevronRight className="w-5 h-5" />
                </button>

                {/* Bottom Navigation Indicator Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-3 bg-slate-900/40 backdrop-blur-md px-4 py-2 rounded-full border border-slate-800/50">
                    {sliderSlides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                idx === currentSlide 
                                    ? 'w-8 bg-gradient-to-r from-violet-500 to-indigo-500' 
                                    : 'w-2 bg-slate-700 hover:bg-slate-500'
                            }`}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Banner;