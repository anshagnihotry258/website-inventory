'use client';

import React, { useState, useEffect } from 'react';
import { getCurrentUser, updateUserPassword } from '@/lib/auth';
import { UserAccount } from '@/lib/types';
import { KeyRound, ShieldCheck, CheckCircle2, Lock, User } from 'lucide-react';

export default function AccountPage() {
  const [currentUser, setUserState] = useState<UserAccount | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [msg, setMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  useEffect(() => {
    setUserState(getCurrentUser());
  }, []);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!currentUser) {
      setMsg({ type: 'error', text: 'You must be logged in to change your password.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMsg({ type: 'error', text: 'New password and Confirm password do not match!' });
      return;
    }

    if (newPassword.length < 1) {
      setMsg({ type: 'error', text: 'Password cannot be empty.' });
      return;
    }

    const res = updateUserPassword(currentUser.username, newPassword);
    if (res.success) {
      setMsg({ type: 'success', text: 'Password updated successfully and saved in backend store!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setMsg({ type: 'error', text: res.error || 'Failed to update password.' });
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1 border-b pb-4">
        <h1 className="text-3xl font-serif font-bold text-slate-900">Manage Account</h1>
        <p className="text-xs text-slate-500 font-sans">
          Update account settings and change password stored securely in your browser backend.
        </p>
      </div>

      {currentUser ? (
        <div className="space-y-6">
          {/* User Info Profile Box */}
          <div className="rounded-2xl border bg-white p-6 shadow-md space-y-3">
            <div className="flex items-center space-x-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#990000] text-amber-300 font-bold text-2xl shadow">
                {currentUser.avatar || '👤'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
                <p className="text-xs text-slate-500 font-semibold">{currentUser.designation}</p>
                <span className="inline-block mt-1 font-mono text-[10px] bg-red-50 text-red-950 font-extrabold px-2 py-0.5 rounded border border-red-200">
                  Username: {currentUser.username} • Role: {currentUser.role}
                </span>
              </div>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="rounded-2xl border bg-white p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2 border-b pb-2">
              <KeyRound className="h-4 w-4 text-[#990000]" />
              <span>Change Password</span>
            </h3>

            {msg && (
              <div className={`p-3 rounded-xl text-xs font-semibold ${
                msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {msg.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full rounded-xl border border-slate-300 pl-10 pr-3 py-2.5 text-xs focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full rounded-xl border border-slate-300 pl-10 pr-3 py-2.5 text-xs focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#990000] py-3 text-xs font-extrabold text-white shadow hover:bg-red-900 transition flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="h-4 w-4 text-amber-300" />
                <span>Save & Confirm New Password</span>
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border bg-white p-8 text-center space-y-3">
          <p className="text-slate-500 font-semibold text-sm">Please sign in to manage your account and change password.</p>
        </div>
      )}
    </div>
  );
}
