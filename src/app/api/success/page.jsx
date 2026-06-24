"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 antialiased text-white">
            <div className="relative overflow-hidden w-full max-w-xl bg-gradient-to-b from-slate-900 to-black border border-emerald-500/30 p-10 rounded-3xl text-center shadow-2xl shadow-emerald-500/5">
                {/* Glow Background Effect */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
                
                {/* Success Icon */}
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl shadow-emerald-500/10 animate-bounce">
                    ✓
                </div>
                
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                    Payment Successful! 🎉
                </h1>
                <p className="text-slate-400 text-sm max-w-md mx-auto mt-4 leading-relaxed">
                    ধন্যবাদ! আপনার পেমেন্টটি সফলভাবে সম্পন্ন হয়েছে। আপনার অ্যাকাউন্টটি এখন প্রিমিয়াম মেম্বারশিপে আপগ্রেড করা হয়েছে। 
                </p>

                {sessionId && (
                    <div className="mt-4 p-3 bg-slate-900/50 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-500 break-all max-w-xs mx-auto">
                        ID: {sessionId}
                    </div>
                )}

                <div className="mt-8">
                    <Link 
                        href="/dashboard" 
                        className="inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-sm px-8 py-3.5 rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-600/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Go to Dashboard 🚀
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        // Next.js-এ useSearchParams ব্যবহার করার জন্য Suspense বাউন্ডারি ব্যবহার করা আবশ্যক
        <Suspense fallback={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                Loading success details...
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}