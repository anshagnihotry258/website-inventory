'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser, setCurrentUser, logoutUser, PRESET_USERS } from '@/lib/auth';
import { UserAccount, Role } from '@/lib/types';
import { 
  FileText, 
  CheckSquare, 
  Calendar, 
  UserCheck, 
  LogOut, 
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Building2,
  Crown,
  User
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setUserState] = useState<UserAccount | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Initial fetch
    setUserState(getCurrentUser());

    // Listen to auth changes & storage events
    const handleAuthChange = () => {
      setUserState(getCurrentUser());
    };

    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const handleSwitchUser = (username: string) => {
    const selected = PRESET_USERS[username];
    if (selected) {
      setCurrentUser(selected);
      setUserState(selected);
      setDropdownOpen(false);
      router.refresh();
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUserState(null);
    setDropdownOpen(false);
    router.push('/login');
  };

  const navItems = [
    { name: 'Book a Venue', href: '/docify', icon: FileText },
    { name: 'Approval Pipeline', href: '/approvals', icon: CheckSquare },
    { name: 'Venue Schedule Calendar', href: '/calendar', icon: Calendar },
  ];

  return (
    <header className="no-print sticky top-0 z-40 bg-[#003366] text-white shadow-md">
      {/* Institution Banner */}
      <div className="border-b border-blue-900 bg-[#002244] px-4 py-2 text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="rounded bg-amber-500/20 px-2 py-0.5 font-bold text-amber-400">PEC CHANDIGARH</span>
            <span className="hidden text-slate-300 md:inline">Office of Dean Student Affairs • Room Permission & Venue Inventory</span>
          </div>
          
          {/* Quick Role & User Header Status */}
          <div className="relative flex items-center space-x-2">
            {currentUser?.isAdmin && (
              <span className="rounded bg-amber-400 text-blue-950 font-extrabold text-[10px] px-2 py-0.5 flex items-center space-x-1 shadow">
                <Crown className="h-3 w-3" />
                <span>SUPER ADMIN</span>
              </span>
            )}

            {currentUser ? (
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-1.5 rounded-md bg-blue-950/80 px-2.5 py-1 text-xs font-medium text-amber-300 transition hover:bg-blue-900 border border-blue-700/50"
              >
                <span>{currentUser.avatar || '👤'}</span>
                <span className="font-bold text-white">{currentUser.name}</span>
                <span className="text-amber-400 font-mono text-[10px] bg-amber-500/20 px-1.5 py-0.2 rounded font-bold">
                  [{currentUser.role}]
                </span>
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1 rounded bg-amber-500 px-2.5 py-1 text-xs font-bold text-blue-950 hover:bg-amber-400 transition"
              >
                <User className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            {dropdownOpen && currentUser && (
              <div className="absolute right-0 mt-40 w-80 rounded-xl bg-white p-2 text-slate-800 shadow-2xl ring-1 ring-black/10 z-50">
                <div className="px-3 py-2 text-xs font-bold border-b flex justify-between items-center bg-slate-50 rounded-t-lg">
                  <div>
                    <span className="font-extrabold text-blue-950 text-sm block">{currentUser.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{currentUser.designation}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 hover:bg-red-50 px-2 py-1 rounded text-xs font-bold transition"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
                
                <div className="my-1 max-h-64 overflow-y-auto space-y-1">
                  <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pt-2">Switch Role Profile</p>

                  {/* Admin Option */}
                  <button
                    onClick={() => handleSwitchUser('admin')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition ${
                      currentUser?.username === 'admin' ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300' : 'hover:bg-amber-50'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span>👑</span>
                      <span>Administrator (Backend)</span>
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-800 font-mono">ADMIN</span>
                  </button>

                  {/* Authority Roles */}
                  <div className="border-t my-1"></div>
                  {[
                    { key: 'shashvat', label: '1. Shashvat (Seccy)' },
                    { key: 'prof deepak kumar', label: '2. Prof. Deepak Kumar (P/I)' },
                    { key: 'daiwik', label: '3. Daiwik (JCSTS)' },
                    { key: 'prof mp garg', label: '4. Prof. M.P. Garg (ADSA)' },
                    { key: 'prof puneet kaur', label: '5. Prof. Puneet Kaur (DSA)' }
                  ].map((item) => {
                    const u = PRESET_USERS[item.key];
                    return (
                      <button
                        key={item.key}
                        onClick={() => handleSwitchUser(item.key)}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-xs flex items-center justify-between transition ${
                          currentUser?.username === u.username ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-100'
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <span>{u.avatar}</span>
                          <span>{u.name}</span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 font-mono">{u.role}</span>
                      </button>
                    );
                  })}

                  {/* Clubs */}
                  <div className="border-t my-1"></div>
                  {['ieee', 'asme', 'robotics'].map((key) => {
                    const u = PRESET_USERS[key];
                    return (
                      <button
                        key={key}
                        onClick={() => handleSwitchUser(key)}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-xs flex items-center justify-between transition ${
                          currentUser?.username === u.username ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:bg-slate-100'
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <span>{u.avatar}</span>
                          <span>{u.name}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">CLUB</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="tricolor-rule"></div>

      {/* Main Navigation Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white shadow ring-1 ring-white/20 transition group-hover:bg-amber-500 group-hover:text-blue-950">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white">PEC Venue & Permissions</span>
            </div>
            <p className="text-xs text-blue-200">Punjab Engineering College (Deemed to be University)</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-white text-[#003366] shadow font-semibold'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Account Display or Login Button */}
        <div className="flex items-center space-x-2">
          {currentUser ? (
            <div className="flex items-center space-x-2 bg-blue-950/60 px-3 py-1.5 rounded-lg border border-blue-700/50 text-xs">
              <span className="font-bold text-amber-300">{currentUser.name}</span>
              <button
                onClick={handleLogout}
                className="text-slate-300 hover:text-red-400 font-semibold border-l border-blue-800 pl-2 transition"
                title="Log Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded bg-amber-500 px-3 py-1.5 text-xs font-bold text-blue-950 shadow hover:bg-amber-400 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
