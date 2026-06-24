"use client";

import Link from 'next/link';

export default function CancelPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 antialiased text-white">
            <div className="relative overflow-hidden w-full max-w-xl bg-gradient-to-b from-slate-900 to-black border border-rose-500/30 p-10 rounded-3xl text-center shadow-2xl shadow-rose-500/5">
                {/* Glow Background Effect */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl"></div>
                
                {/* Cancel Icon */}
                <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl shadow-rose-500/10">
                    ✕
                </div>
                
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                    Payment Cancelled
                </h1>
                <p className="text-slate-400 text-sm max-w-md mx-auto mt-4 leading-relaxed">
                    আপনার পেমেন্ট প্রসেসটি বাতিল করা হয়েছে। আপনার অ্যাকাউন্ট থেকে কোনো টাকা কাটা হয়নি। আপনি চাইলে আবার চেষ্টা করতে পারেন।
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link 
                        href="/pricing" 
                        className="w-full sm:w-auto inline-flex items-center justify-center bg-slate-900 border border-slate-800 text-slate-300 font-bold text-sm px-6 py-3.5 rounded-2xl transition-all hover:bg-slate-800 hover:text-white"
                    >
                        Try Again 🔄
                    </Link>
                    <Link 
                        href="/" 
                        className="w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-sm px-6 py-3.5 rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-600/20 hover:shadow-indigo-500/40"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}