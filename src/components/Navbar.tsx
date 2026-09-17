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
  User,
  LayoutDashboard,
  Clock,
  KeyRound
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setUserState] = useState<UserAccount | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setUserState(getCurrentUser());

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

  // Nav Items matching Screenshot 3
  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Book a Venue', href: '/docify', icon: FileText },
    { name: 'Availability', href: '/availability', icon: Clock },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'My Bookings', href: '/approvals', icon: CheckSquare },
    { name: 'Account', href: '/account', icon: KeyRound },
  ];

  return (
    <header className="no-print sticky top-0 z-40 bg-[#990000] text-white shadow-md">
      {/* Top Gold Banner */}
      <div className="border-b border-red-950 bg-[#800000] px-4 py-2 text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="rounded bg-amber-400 px-2 py-0.5 font-black text-red-950 uppercase text-[10px]">
              PUNJAB ENGINEERING COLLEGE
            </span>
            <span className="hidden text-amber-100 md:inline">Institute of Electrical and Electronics Engineers</span>
          </div>
          
          {/* User Account Dropdown */}
          <div className="relative flex items-center space-x-2">
            {currentUser?.isAdmin && (
              <span className="rounded bg-amber-400 text-red-950 font-extrabold text-[10px] px-2 py-0.5 flex items-center space-x-1 shadow">
                <Crown className="h-3 w-3" />
                <span>ADMIN</span>
              </span>
            )}

            {currentUser ? (
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-1.5 rounded-md bg-red-950/80 px-2.5 py-1 text-xs font-medium text-amber-300 transition hover:bg-red-900 border border-red-700/50"
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
                className="flex items-center space-x-1 rounded bg-amber-400 px-2.5 py-1 text-xs font-bold text-red-950 hover:bg-amber-300 transition"
              >
                <User className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            {dropdownOpen && currentUser && (
              <div className="absolute right-0 mt-40 w-80 rounded-xl bg-white p-2 text-slate-800 shadow-2xl ring-1 ring-black/10 z-50">
                <div className="px-3 py-2 text-xs font-bold border-b flex justify-between items-center bg-slate-50 rounded-t-lg">
                  <div>
                    <span className="font-extrabold text-red-950 text-sm block">{currentUser.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{currentUser.designation}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 hover:bg-red-50 px-2 py-1 rounded text-xs font-bold transition"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
                
                <div className="my-1 max-h-64 overflow-y-auto space-y-1">
                  <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pt-2">Switch User Profile</p>

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
                          currentUser?.username === u?.username ? 'bg-red-50 text-red-900 font-bold' : 'hover:bg-slate-100'
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <span>{u?.avatar}</span>
                          <span>{u?.name}</span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 font-mono">{u?.role}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Red Navigation Bar matching Screenshot 3 */}
      <div className="bg-[#990000] border-t border-red-800 shadow">
        <div className="mx-auto flex max-w-7xl items-center px-4 py-1">
          <nav className="flex flex-wrap items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 rounded-md px-4 py-2 text-xs font-bold transition ${
                    active
                      ? 'bg-[#800000] text-amber-300 shadow font-black border-b-2 border-amber-400'
                      : 'text-white hover:bg-[#800000]/60 hover:text-amber-200'
                  }`}
                >
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
