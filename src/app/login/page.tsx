'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PRESET_USERS, setCurrentUser } from '@/lib/auth';
import { ShieldCheck, Lock, User, KeyRound, Building2, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const key = usernameInput.trim().toLowerCase();
    const targetUser = PRESET_USERS[key];

    if (!targetUser) {
      setErrorMsg(`User "${usernameInput}" not found. For authority roles try: shashvat, prof deepak kumar, daiwik, prof mp garg, prof puneet kaur. For Admin try: admin. For Clubs try: ieee, asme, robotics.`);
      return;
    }

    if (targetUser.passwordHash !== password) {
      setErrorMsg('Invalid password. Password for users is 1 (or admin for Admin account).');
      return;
    }

    setCurrentUser(targetUser);
    
    if (targetUser.role === 'ADMIN') {
      router.push('/approvals');
    } else if (targetUser.role === 'SOCIETY') {
      router.push('/docify');
    } else {
      router.push('/approvals');
    }
  };

  const handleQuickFill = (key: string) => {
    const user = PRESET_USERS[key];
    if (user) {
      setUsernameInput(user.username);
      setPassword(user.passwordHash);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#003366] text-amber-400 shadow-lg">
          <Building2 className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">PEC Chandigarh Access Portal</h1>
        <p className="text-xs text-slate-500">Sign in to book venues, view calendar, or execute digital approvals.</p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-xl space-y-6">
        <form onSubmit={handleLogin} className="space-y-4">
          {errorMsg && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Username / Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="e.g. shashvat, prof deepak kumar, daiwik, admin, ieee"
                className="w-full rounded-xl border border-slate-300 pl-10 pr-3 py-2.5 text-sm font-medium focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (1 for users, admin for admin)"
                className="w-full rounded-xl border border-slate-300 pl-10 pr-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#003366] py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-900 transition flex items-center justify-center space-x-2"
          >
            <span>Sign In</span>
          </button>
        </form>

        {/* Quick Credentials Legend */}
        <div className="border-t pt-4 space-y-3">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Click Any Account below to Auto-Fill Credentials:</span>
          </p>

          {/* Admin Button */}
          <button
            onClick={() => handleQuickFill('admin')}
            className="w-full p-2.5 rounded-xl bg-amber-50 border border-amber-300 hover:bg-amber-100 transition text-left flex items-center justify-between"
          >
            <div>
              <span className="font-bold text-amber-900 text-xs flex items-center space-x-1">
                <span>👑 Super Admin (Full Backend Access)</span>
              </span>
              <span className="text-[10px] text-amber-700 font-mono block">Username: admin • Password: admin</span>
            </div>
            <span className="text-xs font-extrabold text-amber-800 bg-amber-200 px-2 py-0.5 rounded">ADMIN</span>
          </button>

          {/* Authority Accounts */}
          <div className="space-y-1 text-xs">
            <p className="font-bold text-slate-700 text-[11px] pt-1">Authority Approval Signatories (Password: 1):</p>
            <div className="grid grid-cols-2 gap-1.5">
              <button onClick={() => handleQuickFill('shashvat')} className="p-2 rounded-lg bg-slate-50 border text-left hover:bg-blue-50">
                <span className="font-bold text-slate-900 block text-[11px]">1. Shashvat</span>
                <span className="text-[9px] text-slate-500 font-mono">shashvat / 1</span>
              </button>
              <button onClick={() => handleQuickFill('prof deepak kumar')} className="p-2 rounded-lg bg-slate-50 border text-left hover:bg-blue-50">
                <span className="font-bold text-slate-900 block text-[11px]">2. Prof. Deepak Kumar</span>
                <span className="text-[9px] text-slate-500 font-mono">prof deepak kumar / 1</span>
              </button>
              <button onClick={() => handleQuickFill('daiwik')} className="p-2 rounded-lg bg-slate-50 border text-left hover:bg-blue-50">
                <span className="font-bold text-slate-900 block text-[11px]">3. Daiwik</span>
                <span className="text-[9px] text-slate-500 font-mono">daiwik / 1</span>
              </button>
              <button onClick={() => handleQuickFill('prof mp garg')} className="p-2 rounded-lg bg-slate-50 border text-left hover:bg-blue-50">
                <span className="font-bold text-slate-900 block text-[11px]">4. Prof. M.P. Garg</span>
                <span className="text-[9px] text-slate-500 font-mono">prof mp garg / 1</span>
              </button>
              <button onClick={() => handleQuickFill('prof puneet kaur')} className="p-2 rounded-lg bg-slate-50 border text-left hover:bg-blue-50 col-span-2">
                <span className="font-bold text-slate-900 block text-[11px]">5. Prof. Puneet Kaur (DSA)</span>
                <span className="text-[9px] text-slate-500 font-mono">prof puneet kaur / 1</span>
              </button>
            </div>
          </div>

          {/* Club Accounts */}
          <div className="space-y-1 text-xs pt-1">
            <p className="font-bold text-slate-700 text-[11px]">Clubs / Societies (Password: 1):</p>
            <div className="grid grid-cols-3 gap-1.5">
              <button onClick={() => handleQuickFill('ieee')} className="p-1.5 rounded-lg bg-slate-50 border text-center hover:bg-amber-50">
                <span className="font-bold text-slate-900 block text-[11px]">IEEE</span>
                <span className="text-[9px] text-slate-400 font-mono">ieee / 1</span>
              </button>
              <button onClick={() => handleQuickFill('asme')} className="p-1.5 rounded-lg bg-slate-50 border text-center hover:bg-amber-50">
                <span className="font-bold text-slate-900 block text-[11px]">ASME</span>
                <span className="text-[9px] text-slate-400 font-mono">asme / 1</span>
              </button>
              <button onClick={() => handleQuickFill('robotics')} className="p-1.5 rounded-lg bg-slate-50 border text-center hover:bg-amber-50">
                <span className="font-bold text-slate-900 block text-[11px]">Robotics</span>
                <span className="text-[9px] text-slate-400 font-mono">robotics / 1</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
