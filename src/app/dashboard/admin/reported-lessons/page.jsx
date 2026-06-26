"use client";

import React, { useEffect, useState } from 'react';
import { FiAlertTriangle, FiTrash2, FiCornerDownRight, FiEye, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ReportedLessons = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null); // Custom Confirmation Modal State
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            // FIX: Changed to relative API path matching your Next.js application ecosystem
            const res = await fetch('http://localhost:8000/api/admin/reports');
            const data = await res.json();
            if (res.ok) {
                setReports(data.reportedLessons || data.reports || []);
            }
        } catch (err) {
            toast.error("Failed to fetch reports");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleIgnore = async (id) => {
        try {
            const res = await fetch(`http://localhost:8000/api/admin/reports/${id}/ignore`, { method: 'DELETE' });
            if (res.ok) {
                toast.success("Reports ignored successfully.");
                fetchReports();
            } else {
                toast.error("Failed to ignore reports");
            }
        } catch (err) {
            toast.error("Action error occurred");
        }
    };

    const handleDeleteReported = async () => {
        if (!deleteTarget) return;
        try {
            const res = await fetch(`http://localhost:8000/api/admin/lessons/${deleteTarget._id}`, { method: 'DELETE' });
            if (res.ok) {
                // FIX: Changed from toast.error to toast.success for a successful operation
                toast.success("Content deleted from database.");
                fetchReports();
                setSelectedReport(null);
                setDeleteTarget(null); // Close confirmation card
            } else {
                toast.error("Failed to delete content");
            }
        } catch (err) {
            toast.error("Execution failed");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-slate-100 tracking-wide">Reported Content Moderation</h1>
                <p className="text-sm text-slate-400">Review flagged submissions from platform members.</p>
            </div>

            {loading ? (
                <div className="text-slate-500 text-sm animate-pulse">Analyzing logs...</div>
            ) : reports.length === 0 ? (
                <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                    No content has been flagged for moderation.
                </div>
            ) : (
                <div className="overflow-x-auto bg-slate-900/30 border border-slate-800/80 rounded-2xl backdrop-blur-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-bold text-xs uppercase tracking-wider">
                                <th className="p-4">Flagged Lesson</th>
                                <th className="p-4 text-center">Report Flags</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-sm text-slate-300">
                            {reports.map((r) => (
                                <tr key={r._id} className="hover:bg-slate-900/20 transition-colors">
                                    <td className="p-4 font-semibold text-slate-200">{r.title}</td>
                                    <td className="p-4 text-center">
                                        <span className="inline-flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded text-xs animate-pulse">
                                            <FiAlertTriangle /> {r.reports?.length || 0} Flags
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => setSelectedReport(r)} className="px-3 py-1.5 bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-1">
                                                <FiEye /> View Reasons
                                            </button>
                                            <button onClick={() => handleIgnore(r._id)} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-semibold hover:bg-emerald-600 hover:text-white transition-all">
                                                Ignore
                                            </button>
                                            <button onClick={() => setDeleteTarget(r)} className="p-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* VIEW REASONS MODAL */}
            {selectedReport && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-2xl">
                        <div className="flex justify-between items-start">
                            <h3 className="font-black text-slate-100 text-base">Flag Details ({selectedReport.title})</h3>
                            <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg transition-colors">
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                            {selectedReport.reports?.map((item, idx) => (
                                <div key={idx} className="p-3 bg-slate-950/50 border border-slate-800/40 rounded-xl text-xs space-y-1">
                                    <p className="font-bold text-indigo-400">{item.reporterEmail || 'Anonymous User'}</p>
                                    <p className="text-slate-400 flex items-center gap-1 pl-1">
                                        <FiCornerDownRight className="text-slate-600"/> {item.reason}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* CUSTOM DELETE CONFIRMATION CARD MODAL */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 shadow-2xl text-center">
                        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20">
                            <FiAlertTriangle className="w-6 h-6 animate-bounce" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-black text-slate-100">Confirm Permanence</h3>
                            <p className="text-sm text-slate-400">
                                Are you sure you want to permanently delete <span className="text-slate-200 font-semibold">"{deleteTarget.title}"</span>? This process removes it entirely from the database and cannot be undone.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-700 transition-all">
                                Cancel
                            </button>
                            <button onClick={handleDeleteReported} className="flex-1 py-2.5 bg-rose-600 text-white font-semibold text-sm rounded-xl hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition-all">
                                Delete Lesson
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportedLessons;