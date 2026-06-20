"use client";

import React from 'react';
import Link from 'next/link';
import { Compass, MoveLeft, Home, HelpCircle } from 'lucide-react'; // Replace with Gravity UI / React Icons if needed

const NotFoundPage = () => {
    return (
        <div className="min-h-[85vh] bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-4 relative overflow-hidden">
            
            {/* Subtle Decorative Background Gradients */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/3 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center max-w-xl mx-auto z-10 space-y-6">
                
                {/* Visual Icon Alert */}
                <div className="inline-flex p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl mb-2 animate-bounce duration-1000">
                    <Compass className="w-12 h-12 text-indigo-400 rotate-45" />
                </div>

                {/* Main Error Headers */}
                <h1 className="text-8xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    404
                </h1>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-200">
                    Lesson Not Found.
                </h2>

                {/* The Funny/On-Brand Twist */}
                <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-md mx-auto">
                    It looks like this page took a wrong turn on the road of life. Either this digital lesson hasn't been lived yet, or the URL has experienced an existential crisis.
                </p>

                {/* Quick Dev/User Humorous Checklist */}
                <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 text-left text-sm text-slate-400 max-w-sm mx-auto space-y-2">
                    <p className="font-semibold text-slate-300 border-b border-slate-800 pb-1 mb-2">Possible diagnosis:</p>
                    <div className="flex items-start gap-2">
                        <span className="text-indigo-400">⚡</span>
                        <span>Typo in the browser address bar.</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-purple-400">🔮</span>
                        <span>The lesson was too profound for this dimension.</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-pink-400">☕</span>
                        <span>The developer ran out of coffee.</span>
                    </div>
                </div>

                {/* Interactive Navigation Actions */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sm font-medium rounded-xl transition-all"
                    >
                        <MoveLeft className="w-4 h-4" />
                        Go Back
                    </button>
                    
                    <Link 
                        href="/" 
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
                    >
                        <Home className="w-4 h-4" />
                        Return Home
                    </Link>
                </div>

            </div>

            {/* Micro Footer Note */}
            <div className="absolute bottom-6 text-xs text-slate-600 flex items-center gap-1">
                <HelpCircle className="w-3 h-3" /> AuraLife Existential Error Framework v4.0.4
            </div>
        </div>
    );
};

export default NotFoundPage;