"use client";

import React, { useState } from 'react';
import Link from 'next/link';
// import { redirect, useRouter } from 'next/navigation'; 
import toast from 'react-hot-toast';
import { FiCompass, FiUser, FiMail, FiLock, FiImage, FiCheck, FiX } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const ADMIN_EMAIL = "admin@gmail.com";

const SignupPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        photoUrl: '',
        password: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Live password criteria validation flags
    const passChecks = {
        length: formData.password.length >= 6,
        upper: /[A-Z]/.test(formData.password),
        lower: /[a-z]/.test(formData.password)
    };

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
        
        const { name, email, password, photoUrl } = formData;
        
        // Validation check before submitting
        if (!name || !email || !password) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (!passChecks.length || !passChecks.upper || !passChecks.lower) {
            toast.error("Password criteria has not been satisfied!");
            return;
        }

        setIsSubmitting(true);
        const loadToastId = toast.loading("Creating your account...");
        
        try {
            // Better Auth Integration execution
            const { data, error } = await authClient.signUp.email({
                email, 
                password, 
                name, 
                image: photoUrl || undefined, 
            });

            if (error) {
                toast.error(error.message || "Registration failed.", { id: loadToastId });
                return;
            }

            if (data) {
                toast.success("Welcome aboard! Account built successfully.", { id: loadToastId });
                router.push('/auth/login')
                // Form Reset
                setFormData({ name: '', email: '', photoUrl: '', password: '' });
                
                // 🛡️ 🟢 ফিক্সড রিডাইরেকশন গেটকিপার লজিক (সফলভাবে রেজিস্ট্রেশনের পর চেক করবে)
                if (email === ADMIN_EMAIL) {
                    router.replace('/dashboard/admin'); // ফিক্সড ইমেইল হলে সরাসরি অ্যাডমিন ড্যাশবোর্ড
                } 
            }
        } catch (err) {
            toast.error("An unexpected registration error occurred.", { id: loadToastId });
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[90vh] bg-slate-950 text-slate-100 flex items-center justify-center px-4 relative overflow-hidden py-12">
            {/* Ambient Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Form Main Layout Card Container */}
            <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl z-10">
                
                {/* Branding Block */}
                <div className="text-center space-y-2 mb-8">
                    <div className="inline-flex p-3 bg-gradient-to-tr from-violet-500 to-indigo-600 rounded-xl shadow-md mb-1">
                        <FiCompass className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">Create your account</h2>
                    <p className="text-sm text-slate-400">Start documenting your digital life lessons</p>
                </div>

                {/* Third-Party Provider OAuth */}
                <button
                    onClick={handleGoogleLogin}
                    type="button"
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 rounded-xl font-medium text-sm text-slate-200 transition-all duration-200 mb-6 group hover:border-slate-700"
                >
                    <FcGoogle className="w-5 h-5" />
                    <span>Continue with Google</span>
                </button>

                <div className="relative flex py-2 items-center mb-6">
                    <div className="flex-grow border-t border-slate-800/80"></div>
                    <span className="flex-shrink mx-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Or register with email</span>
                    <div className="flex-grow border-t border-slate-800/80"></div>
                </div>

                {/* Core Signup Fields */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Input Name field */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Full Name *</label>
                        <div className="relative">
                            <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                                required
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/40 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    {/* Input Email field */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Email Address *</label>
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

                    {/* Input Photo URL field */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Photo URL</label>
                        <div className="relative">
                            <FiImage className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                            <input
                                type="url"
                                name="photoUrl"
                                value={formData.photoUrl}
                                onChange={handleInputChange}
                                placeholder="https://example.com/avatar.jpg"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/40 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    {/* Input Password field with Interactive Realtime Rules */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Secure Password *</label>
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

                        {/* Visual Rules Evaluation Box Layout */}
                        <div className="mt-2.5 bg-slate-950/40 border border-slate-800/60 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs">
                            <div className={`flex items-center gap-1.5 font-medium ${passChecks.length ? 'text-emerald-400' : 'text-slate-500'}`}>
                                {passChecks.length ? <FiCheck className="w-3.5 h-3.5" /> : <FiX className="w-3.5 h-3.5" />}
                                <span>Min 6 Chars</span>
                            </div>
                            <div className={`flex items-center gap-1.5 font-medium ${passChecks.upper ? 'text-emerald-400' : 'text-slate-500'}`}>
                                {passChecks.upper ? <FiCheck className="w-3.5 h-3.5" /> : <FiX className="w-3.5 h-3.5" />}
                                <span>1 Uppercase</span>
                            </div>
                            <div className={`flex items-center gap-1.5 font-medium ${passChecks.lower ? 'text-emerald-400' : 'text-slate-500'}`}>
                                {passChecks.lower ? <FiCheck className="w-3.5 h-3.5" /> : <FiX className="w-3.5 h-3.5" />}
                                <span>1 Lowercase</span>
                            </div>
                        </div>
                    </div>

                    {/* Submission Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-gradient-to-r from-violet-500 to-indigo-600 hover:opacity-95 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/10 mt-2"
                    >
                        {isSubmitting ? "Creating Account..." : "Create AuraLife Account"}
                    </button>
                </form>

                {/* Redirection link */}
                <p className="text-center text-sm text-slate-400 mt-6">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-indigo-400 font-semibold hover:text-indigo-300 underline underline-offset-4 decoration-indigo-500/40">
                        Sign In here
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default SignupPage;