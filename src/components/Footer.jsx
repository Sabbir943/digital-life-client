"use client";

import React from 'react';
import Link from 'next/link';
import { FiCompass, FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiFacebook } from 'react-icons/fi';
import { RiTwitterXFill } from 'react-icons/ri'; // New X logo

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-slate-950 border-t border-slate-900 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-900">
                    
                    {/* Column 1: Logo & Branding (5 Columns wide on desktop) */}
                    <div className="md:col-span-5 space-y-5">
                        <Link href="/" className="flex items-center gap-2.5 group w-fit">
                            <div className="p-2 bg-gradient-to-tr from-violet-500 via-indigo-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-105 transition-all duration-300 ring-2 ring-white/10">
                                <FiCompass className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                                Aura<span className="text-indigo-400 font-semibold">Life</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                            A specialized personal development safe-haven where developers, creators, and thinkers archive, organize, and pass down their hardest-learned life insights.
                        </p>
                        
                        {/* Social Media Links with the New X Icon */}
                        <div className="flex items-center gap-3 pt-2">
                            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80 hover:border-slate-700/80 transition-all duration-200" aria-label="X (formerly Twitter)">
                                <RiTwitterXFill className="w-4 h-4" />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80 hover:border-slate-700/80 transition-all duration-200" aria-label="GitHub">
                                <FiGithub className="w-4 h-4" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80 hover:border-slate-700/80 transition-all duration-200" aria-label="LinkedIn">
                                <FiLinkedin className="w-4 h-4" />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80 hover:border-slate-700/80 transition-all duration-200" aria-label="Facebook">
                                <FiFacebook className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Navigation Links (3 Columns wide on desktop) */}
                    <div className="md:col-span-3 space-y-4">
                        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Navigation</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link href="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link href="/lessons" className="text-slate-400 hover:text-white transition-colors">Public Lessons</Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="text-slate-400 hover:text-white transition-colors">Pricing Plans</Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">User Dashboard</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Contact Info & Support (4 Columns wide on desktop) */}
                    <div className="md:col-span-4 space-y-4">
                        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Contact Info</h3>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex items-start gap-3">
                                <FiMapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                                <span>Northern University Bangladesh Campus,<br />Dhaka, Bangladesh</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FiMail className="w-4 h-4 text-indigo-400 shrink-0" />
                                <a href="mailto:support@auralife.com" className="hover:text-white transition-colors">support@auralife.com</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <FiPhone className="w-4 h-4 text-indigo-400 shrink-0" />
                                <a href="tel:+880123456789" className="hover:text-white transition-colors">+880 1234-56789</a>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Footer Credits & Legal Policies */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500 text-center sm:text-left">
                        &copy; {currentYear} AuraLife Platform. Built for developers & thinkers. All rights reserved.
                    </p>
                    
                    {/* Terms & Conditions / Privacy Policy Links */}
                    <div className="flex items-center gap-6 text-xs text-slate-500">
                        <Link href="/terms" className="hover:text-slate-300 transition-colors">
                            Terms & Conditions
                        </Link>
                        <span className="w-1 h-1 bg-slate-800 rounded-full" />
                        <Link href="/privacy" className="hover:text-slate-300 transition-colors">
                            Privacy Policy
                        </Link>
                        <span className="w-1 h-1 bg-slate-800 rounded-full" />
                        <Link href="/cookies" className="hover:text-slate-300 transition-colors">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;