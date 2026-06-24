"use client";

import React, { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { loadStripe } from '@stripe/stripe-js';
import Swal from 'sweetalert2';

// Stripe Initialize
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_your_key");

const PricingPage = () => {
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
    const isPremiumUser = user?.plan === "premium" || user?.isPremium;

    const [checkoutLoading, setCheckoutLoading] = useState(false);

    // পেমেন্ট গেটওয়ে হ্যান্ডলার
    const handleUpgrade = async () => {
        if (!user) {
            Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'Please log in first to upgrade your account!',
                background: '#090d16',
                color: '#fff',
                confirmButtonColor: '#6366f1'
            });
            return;
        }

        setCheckoutLoading(true);
        try {
            // Next.js Local API Route-এ হিট করা হচ্ছে
            const res = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id || user._id,
                    email: user.email
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Checkout session generation failed");

            // রিডাইরেক্ট টু স্ট্রাইপ
            if (data.url) {
                window.location.href = data.url;
            } else if (data.id) {
                const stripe = await stripePromise;
                await stripe.redirectToCheckout({ sessionId: data.id });
            } else {
                throw new Error("No checkout URL or Session ID returned from server.");
            }

        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Payment Error',
                text: err.message || 'Something went wrong with Stripe configuration!',
                background: '#090d16',
                color: '#fff',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setCheckoutLoading(false);
        }
    };

    // লোডিং স্টেট
    if (isPending) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-indigo-500/20"></div>
                <p className="text-slate-400 font-medium text-sm animate-pulse tracking-wide">Loading Premium Environment...</p>
            </div>
        );
    }

    // ১. ইউজার অলরেডি প্রিমিয়াম মেম্বার হলে এই কার্ডটি রেন্ডার হবে
    if (isPremiumUser) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-4">
                <div className="relative overflow-hidden w-full max-w-xl bg-gradient-to-b from-slate-900 to-black border border-amber-500/30 p-10 rounded-3xl text-center shadow-2xl shadow-amber-500/5">
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>
                    
                    <div className="text-6xl mb-6 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse">⭐</div>
                    <h1 className="text-3xl font-black text-white tracking-tight">You are a Premium Member!</h1>
                    <p className="text-slate-400 text-sm max-w-md mx-auto mt-3 leading-relaxed">
                        ধন্যবাদ! আপনি অলরেডি আমাদের লাইফটাইম মেম্বারশিপ আনলক করেছেন। সমস্ত এক্সক্লুসিভ ফিচার এবং প্রিমিয়াম কন্টেন্ট আপনার জন্য উন্মুক্ত।
                    </p>
                    <div className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-black font-black px-6 py-3 rounded-full text-xs uppercase tracking-widest shadow-xl shadow-amber-500/20 border border-amber-400/50">
                        Premium Member Badge ⭐
                    </div>
                </div>
            </div>
        );
    }

    const comparisonFeatures = [
        { name: "Number of lessons you can create", free: "Max 5 Lessons", premium: "🔥 Unlimited Lessons", highlight: false },
        { name: "Premium lesson creation access", free: "❌ Blocked", premium: "⚡ Full Access", highlight: true },
        { name: "Ad-free platform experience", free: "❌ Contains Ads", premium: "✨ 100% Ad-Free", highlight: false },
        { name: "Priority listing in public feed", free: "❌ Standard", premium: "🚀 Top Priority", highlight: false },
        { name: "Access to other users' premium content", free: "❌ Locked", premium: "🔓 Unlimited Unlock", highlight: true },
        { name: "Community badge / verified status", free: "❌ Plain Account", premium: "⭐ Premium Badge", highlight: false },
        { name: "Global analytics graph inside dashboard", free: "❌ Disabled", premium: "📊 Live Analytics", highlight: false },
        { name: "Dedicated customer support", free: "Standard Support", premium: "👑 24/7 Priority Support", highlight: false }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white antialiased">
            <div className="max-w-4xl mx-auto text-center space-y-4 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                
                <span className="inline-block text-xs font-black bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-4 py-1.5 rounded-full uppercase tracking-widest">
                    Elevate Your Wisdom Repository
                </span>
                <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white">
                    One-Time Investment, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.2)]">Lifetime Value ⭐</span>
                </h1>
                <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                    কোনো মাসিক সাবস্ক্রিপশন ফি বা হিডেন চার্জ নেই। একবার পেমেন্ট করে সারাজীবনের জন্য হয়ে যান আমাদের এক্সক্লুসিভ মেম্বার।
                </p>

                <div className="inline-block w-full max-w-md bg-gradient-to-b from-slate-900 to-black border border-slate-800 p-8 rounded-3xl shadow-2xl relative mt-8 z-10 hover:border-indigo-500/30 transition-all duration-300">
                    <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-400">
                        Most Popular
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Lifetime Pass</span>
                    <div className="text-5xl font-black text-white tracking-tight my-2">
                        ৳১৫০০ <span className="text-sm font-normal text-slate-500 tracking-normal">/ One-time</span>
                    </div>
                    
                    <button 
                        onClick={handleUpgrade}
                        disabled={checkoutLoading}
                        className="w-full mt-6 relative group overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-sm py-4 px-6 rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-600/20 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
                    >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <span className="relative flex items-center justify-center gap-2">
                            {checkoutLoading ? "SECURELY REDIRECTING..." : "Upgrade to Premium 🚀"}
                        </span>
                    </button>
                    <p className="text-[11px] text-slate-500 mt-3">🔒 Secured & Encrypted by Stripe Checkout.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto mt-20 space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-2.5 h-6 bg-indigo-500 rounded-full"></div>
                    <h2 className="text-xl font-black tracking-tight text-white">Compare Plans & Core Features</h2>
                </div>
                
                <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-black/40 backdrop-blur-md shadow-2xl">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-slate-900/60 text-slate-400 font-bold border-b border-slate-800">
                                <th className="p-4 sm:p-5 text-xs uppercase tracking-wider font-extrabold">Features</th>
                                <th className="p-4 sm:p-5 text-xs uppercase tracking-wider font-extrabold text-slate-400">Free Plan</th>
                                <th className="p-4 sm:p-5 text-xs uppercase tracking-wider font-extrabold text-amber-400 bg-amber-500/5">Premium ⭐</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900 text-slate-300">
                            {comparisonFeatures.map((feature, idx) => (
                                <tr key={idx} className="hover:bg-slate-900/20 transition-all">
                                    <td className="p-4 sm:p-5 font-medium text-slate-200">{feature.name}</td>
                                    <td className="p-4 sm:p-5 text-slate-500 font-medium">{feature.free}</td>
                                    <td className={`p-4 sm:p-5 font-semibold bg-amber-500/[0.02] ${feature.highlight ? 'text-amber-400' : 'text-slate-100'}`}>
                                        {feature.premium}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;