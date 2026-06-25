"use client";

import React, { useEffect, useState } from 'react';
import { FiShield, FiTrash2, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/admin/users?search=${search}`);
            const data = await res.json();
            if (res.ok) setUsers(data.users);
        } catch (err) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search]);

    const handlePromote = async (id, name) => {
        try {
            // FIX: Corrected matching backticks here
            const res = await fetch(`/api/admin/users/${id}/promote`, { method: 'PATCH' });
            if (res.ok) {
                toast.success(`${name} promoted to Admin!`);
                fetchUsers();
            } else {
                toast.error("Action failed");
            }
        } catch (err) {
            toast.error("Something went wrong");
        }
    };

    const handleDeleteUser = async (id, name) => {
        if (!confirm(`Are you sure you want to permanently delete ${name}'s account?`)) return;
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
            if (res.ok) {
                // FIX: Changed toast.error to toast.success since it was a success case
                toast.success("User account removed.");
                fetchUsers();
            }
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-slate-100 tracking-wide">Manage Registered Users</h1>
                <p className="text-sm text-slate-400">Promote users or manage account permissions.</p>
            </div>

            <div className="relative max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><FiSearch /></span>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search user by name or email..." className="w-full bg-slate-900 border border-slate-800/80 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" />
            </div>

            {loading ? (
                <div className="text-slate-500 text-sm animate-pulse">Loading user table...</div>
            ) : (
                <div className="overflow-x-auto bg-slate-900/30 border border-slate-800/80 rounded-2xl backdrop-blur-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-bold text-xs uppercase tracking-wider">
                                <th className="p-4">User Details</th>
                                <th className="p-4">Role</th>
                                <th className="p-4 text-center">Lessons Created</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-sm text-slate-300">
                            {users.map((u) => (
                                <tr key={u._id} className="hover:bg-slate-900/20 transition-colors">
                                    <td className="p-4">
                                        <p className="font-semibold text-slate-200">{u.name}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{u.email}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md font-bold uppercase ${
                                            u.role === 'admin' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-800 text-slate-400'
                                        }`}>
                                            {u.role === 'admin' && <FiShield />} {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center font-bold text-slate-400">{u.lessonsCount || 0}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {u.role !== 'admin' && (
                                                <button onClick={() => handlePromote(u._id, u.name)} className="p-2 text-xs font-semibold bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                                                    Promote Admin
                                                </button>
                                            )}
                                            <button onClick={() => handleDeleteUser(u._id, u.name)} className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl border border-rose-500/10 transition-all">
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
        </div>
    );
};

export default ManageUsers;