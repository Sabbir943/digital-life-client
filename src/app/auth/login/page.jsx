"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiCompass, FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const ADMIN_EMAIL = "admin@gamil.com";

const LoginPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGoogleLogin = async () => {
          const data = await authClient.signIn.social({
     provider: "google",
  });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password } = formData;

        if (!email || !password) {
            toast.error("Please enter both email and password.");
            return;
        }

        setIsSubmitting(true);
        const loadToastId = toast.loading("Authenticating credentials...");

        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error) {
                toast.error(error.message || "Invalid credentials. Please try again.", { id: loadToastId });
                return;
            }

            if (data) {
                toast.success("Welcome back to AuraLife!", { id: loadToastId });
                
                // 🛡️ 🟢 অ্যাডমিন গেটকিপার রিডাইরেকশন লজিক
                if (email === ADMIN_EMAIL) {
                    router.push('/dashboard/admin'); // সোজা অ্যাডমিন প্যানেলে পাঠাবে
                } else {
                    router.push('/'); // সাধারণ ইউজারদের রেগুলার ড্যাশবোর্ডে পাঠাবে
                }
                
                router.refresh();
            }
        } catch (err) {
            toast.error("An unexpected error occurred during login.", { id: loadToastId });
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[90vh] bg-slate-950 text-slate-100 flex items-center justify-center px-4 relative overflow-hidden py-12">
            
            {/* Ambient Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Core Card Container */}
            <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl z-10">
                
                {/* Brand Identity Header */}
                <div className="text-center space-y-2 mb-8">
                    <div className="inline-flex p-3 bg-gradient-to-tr from-violet-500 to-indigo-600 rounded-xl shadow-md mb-1">
                        <FiCompass className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h2>
                    <p className="text-sm text-slate-400">Continue your life reflection journey</p>
                </div>

                {/* Third-Party Provider OAuth */}
                <button
                    onClick={handleGoogleLogin}
                    type="button"
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 rounded-xl font-medium text-sm text-slate-200 transition-all duration-200 mb-6 group hover:border-slate-700"
                >
                    <FcGoogle className="w-5 h-5" />
                    <span>Sign in with Google</span>
                </button>

                <div className="relative flex py-2 items-center mb-6">
                    <div className="flex-grow border-t border-slate-800/80"></div>
                    <span className="flex-shrink mx-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Or secure email login</span>
                    <div className="flex-grow border-t border-slate-800/80"></div>
                </div>

                {/* Login Inputs Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Email Field */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                        <div className="relative">
                            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="name@domain.com"
                                required
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/40 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
                          
                        </div>
                        <div className="relative">
                            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                required
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/40 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    {/* Submit Login action trigger */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-600 hover:opacity-95 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/10 mt-2 group"
                    >
                        <FiLogIn className="w-4 h-4 text-indigo-200 group-hover:translate-x-0.5 transition-transform" />
                        <span>{isSubmitting ? "Signing in..." : "Sign Into AuraLife"}</span>
                    </button>
                </form>

                {/* Footer redirection link */}
                <p className="text-center text-sm text-slate-400 mt-6">
                    New to the platform?{' '}
                    <Link href="/auth/register" className="text-indigo-400 font-semibold hover:text-indigo-300 underline underline-offset-4 decoration-indigo-500/40">
                        Register an account here
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default LoginPage;