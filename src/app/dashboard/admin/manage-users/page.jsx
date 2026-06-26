"use client";

import React, { useEffect, useState } from 'react';
import { FiShield, FiTrash2, FiSearch, FiAlertTriangle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    
    // Custom Modal State Management
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null, userName: '' });

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/users?search=${search}`);
            const data = await res.json();
            if (res.ok) {
                setUsers(data.users || []);
            }
        } catch (err) {
            toast.error("Failed to sync user database.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search]);

    const handlePromote = async (id, name) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}/promote`, { 
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                toast.success(`${name} promoted to Admin successfully!`);
                fetchUsers();
            } else {
                toast.error("Failed to alter role state.");
            }
        } catch (err) {
            toast.error("Something went wrong");
        }
    };

    // Open Confirmation Modal Instead of Native Prompt
    const openDeleteConfirmation = (id, name) => {
        setDeleteModal({ isOpen: true, userId: id, userName: name });
    };

    // Actual API Delete Execution Sequence
    const confirmAndExecuteDelete = async () => {
        const { userId } = deleteModal;
        if (!userId) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, { 
                method: 'DELETE' 
            });
            if (res.ok) {
                toast.success("User account removed from database.");
                fetchUsers();
            } else {
                toast.error("Failed to remove target record.");
            }
        } catch (err) {
            toast.error("Delete sequence failed.");
        } finally {
            // Close modal context
            setDeleteModal({ isOpen: false, userId: null, userName: '' });
        }
    };

    return (
        <div className="space-y-6 relative">
            <div>
                <h1 className="text-2xl font-black text-slate-100 tracking-wide">Manage Registered Users</h1>
                <p className="text-sm text-slate-400">Promote users or manage account permissions.</p>
            </div>

            <div className="relative max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><FiSearch /></span>
                <input 
                    type="text" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    placeholder="Search user by name or email..." 
                    className="w-full bg-slate-900 border border-slate-800/80 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors" 
                />
            </div>

            {loading ? (
                <div className="text-slate-500 text-sm animate-pulse">Loading system workspace indexes...</div>
            ) : (
                <div className="overflow-x-auto bg-slate-900/30 border border-slate-800/80 rounded-2xl backdrop-blur-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-bold text-xs uppercase tracking-wider">
                                <th className="p-4">User Details</th>
                                <th className="p-4">Role Matrix</th>
                                <th className="p-4 text-center">Lessons Created</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-sm text-slate-300">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-slate-500 text-xs">
                                        No users match your current search constraints.
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => {
                                    const lessonsCount = 
                                        u.lessonsCount !== undefined ? u.lessonsCount : 
                                        u.totalLessons !== undefined ? u.totalLessons :
                                        Array.isArray(u.lessons) ? u.lessons.length : 0;

                                    return (
                                        <tr key={u._id} className="hover:bg-slate-900/20 transition-colors">
                                            <td className="p-4">
                                                <p className="font-semibold text-slate-200">{u.name || "Anonymous Learner"}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{u.email}</p>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md font-bold uppercase ${
                                                    u.role?.toLowerCase() === 'admin' 
                                                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                                                        : 'bg-slate-800 text-slate-400 border border-transparent'
                                                }`}>
                                                    {u.role?.toLowerCase() === 'admin' && <FiShield className="w-3.5 h-3.5" />} {u.role || 'user'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center font-bold text-slate-400">
                                                {lessonsCount}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {u.role?.toLowerCase() !== 'admin' && (
                                                        <button 
                                                            onClick={() => handlePromote(u._id, u.name)} 
                                                            className="p-2 px-3 text-xs font-bold bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 active:scale-95 transition-all cursor-pointer"
                                                        >
                                                            Promote Admin
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => openDeleteConfirmation(u._id, u.name)} 
                                                        className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl border border-rose-500/20 hover:border-rose-500 active:scale-95 transition-all cursor-pointer"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODERN CUSTOM MODAL OVERLAY */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center gap-3 text-rose-400">
                            <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
                                <FiAlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-black text-slate-100 tracking-wide">Confirm Account Dropping</h3>
                                <p className="text-xs text-slate-400">This routine is irreversible.</p>
                            </div>
                        </div>

                        <p className="text-sm text-slate-300 leading-relaxed">
                            Are you certain you want to permanently delete the profile index belonging to <span className="font-bold text-white text-indigo-300">"{deleteModal.userName}"</span>?
                        </p>

                        <div className="flex items-center justify-end gap-3 pt-2 text-xs font-bold">
                            <button 
                                onClick={() => setDeleteModal({ isOpen: false, userId: null, userName: '' })}
                                className="px-4 py-2.5 bg-slate-900 text-slate-400 hover:text-white border border-slate-800 rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmAndExecuteDelete}
                                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl active:scale-95 transition-all cursor-pointer"
                            >
                                Delete Permanently
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;