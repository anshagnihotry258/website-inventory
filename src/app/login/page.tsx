'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PRESET_USERS, setCurrentUser } from '@/lib/auth';
import { ShieldCheck, Lock, User, KeyRound, Building2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'ORG' | 'AUTH'>('ORG');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const targetUser = PRESET_USERS[username.toUpperCase()];
    if (!targetUser) {
      setErrorMsg('Invalid Username abbreviation. Try IEEE, ASME, ROBOTICS, SECCY, PROF_INCHARGE, CSTS, ADSA, or DSA.');
      return;
    }

    if (targetUser.passwordHash !== password) {
      setErrorMsg('Invalid password. Check credentials provided for PEC login.');
      return;
    }

    setCurrentUser(targetUser);
    router.push(targetUser.role === 'SOCIETY' ? '/docify' : '/approvals');
  };

  const handleQuickSelect = (key: string) => {
    const user = PRESET_USERS[key];
    if (user) {
      setUsername(user.username);
      setPassword(user.passwordHash);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#003366] text-white shadow-lg">
          <Building2 className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">PEC Chandigarh Access Portal</h1>
        <p className="text-xs text-slate-500">Sign in to generate room permissions or execute digital approvals.</p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-xl space-y-6">
        {/* Tabs */}
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 text-xs font-bold">
          <button
            onClick={() => { setActiveTab('ORG'); setErrorMsg(''); }}
            className={`py-2 rounded-lg transition ${activeTab === 'ORG' ? 'bg-white text-blue-950 shadow' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Clubs & Societies
          </button>
          <button
            onClick={() => { setActiveTab('AUTH'); setErrorMsg(''); }}
            className={`py-2 rounded-lg transition ${activeTab === 'AUTH' ? 'bg-white text-blue-950 shadow' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Authority Signatories
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {errorMsg && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Username Abbreviation</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toUpperCase())}
                placeholder={activeTab === 'ORG' ? 'e.g. IEEE, ASME' : 'e.g. SECCY, CSTS, DSA'}
                className="w-full rounded-xl border border-slate-300 pl-10 pr-3 py-2.5 text-sm font-bold uppercase focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl border border-slate-300 pl-10 pr-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#003366] py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-900 transition"
          >
            Sign In to Dashboard
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="border-t pt-4 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Preset Logins for Testing</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {activeTab === 'ORG' ? (
              <>
                <button
                  onClick={() => handleQuickSelect('IEEE')}
                  className="p-2 rounded-lg bg-slate-50 border hover:bg-amber-50 text-left"
                >
                  <p className="font-bold text-slate-900">IEEE Student Branch</p>
                  <p className="text-[10px] text-slate-500 font-mono">IEEE / IEEE1974**</p>
                </button>
                <button
                  onClick={() => handleQuickSelect('ROBOTICS')}
                  className="p-2 rounded-lg bg-slate-50 border hover:bg-amber-50 text-left"
                >
                  <p className="font-bold text-slate-900">PEC Robotics Society</p>
                  <p className="text-[10px] text-slate-500 font-mono">ROBOTICS / ROBOTICS2026</p>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleQuickSelect('SECCY')}
                  className="p-2 rounded-lg bg-slate-50 border hover:bg-amber-50 text-left"
                >
                  <p className="font-bold text-slate-900">1. Seccy</p>
                  <p className="text-[10px] text-slate-500 font-mono">SECCY / SECCY2026</p>
                </button>
                <button
                  onClick={() => handleQuickSelect('PROF_INCHARGE')}
                  className="p-2 rounded-lg bg-slate-50 border hover:bg-amber-50 text-left"
                >
                  <p className="font-bold text-slate-900">2. Prof. Incharge</p>
                  <p className="text-[10px] text-slate-500 font-mono">PROF_INCHARGE / PROF2026</p>
                </button>
                <button
                  onClick={() => handleQuickSelect('CSTS')}
                  className="p-2 rounded-lg bg-slate-50 border hover:bg-amber-50 text-left"
                >
                  <p className="font-bold text-slate-900">3. CSTS / JCSTS</p>
                  <p className="text-[10px] text-slate-500 font-mono">CSTS / CSTS2026</p>
                </button>
                <button
                  onClick={() => handleQuickSelect('DSA')}
                  className="p-2 rounded-lg bg-slate-50 border hover:bg-amber-50 text-left"
                >
                  <p className="font-bold text-slate-900">5. DSA (Dean)</p>
                  <p className="text-[10px] text-slate-500 font-mono">DSA / DSA2026</p>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
