'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { getPermissions, VENUES } from '@/lib/db';
import { PermissionRequest, UserAccount } from '@/lib/types';
import { 
  FileText, 
  CheckSquare, 
  Calendar, 
  ShieldCheck, 
  Plus, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  Users
} from 'lucide-react';
import ApprovalTimeline from '@/components/ApprovalTimeline';

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [permissions, setPermissions] = useState<PermissionRequest[]>([]);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    setPermissions(getPermissions());
  }, []);

  const totalPermissions = permissions.length;
  const approvedBooked = permissions.filter(p => p.status === 'APPROVED').length;
  const pendingInChain = permissions.filter(p => p.status.startsWith('PENDING_')).length;

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003366] via-[#002244] to-slate-900 p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 rounded-full bg-amber-500/20 px-3.5 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
            <ShieldCheck className="h-4 w-4" />
            <span>Digital Permission & Room Reservation System</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            PEC Venue Booking & Digital Approvals (Docify)
          </h1>

          <p className="text-sm text-blue-100/90 leading-relaxed">
            Generate official room permission documents using Docify, submit requests, and track digital signatures through the official 5-tier sequential approval workflow: <br className="hidden sm:inline" />
            <strong className="text-amber-300">Secretary $\rightarrow$ Prof. In-Charge $\rightarrow$ CSTS/JCSTS $\rightarrow$ ADSA $\rightarrow$ DSA</strong>. Fully signed requests automatically reserve rooms on the campus calendar, eliminating double bookings.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/docify"
              className="inline-flex items-center space-x-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-blue-950 shadow-lg hover:bg-amber-400 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Create Permission (Docify)</span>
            </Link>
            
            <Link
              href="/approvals"
              className="inline-flex items-center space-x-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white border border-white/20 hover:bg-white/20 transition"
            >
              <CheckSquare className="h-4 w-4 text-amber-300" />
              <span>Approval Workflow</span>
            </Link>

            <Link
              href="/calendar"
              className="inline-flex items-center space-x-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white border border-white/20 hover:bg-white/20 transition"
            >
              <Calendar className="h-4 w-4 text-emerald-300" />
              <span>Venue Schedule Calendar</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#003366]">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Permission Applications</p>
            <p className="text-2xl font-bold text-slate-900">{totalPermissions}</p>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Pending Approval Chain</p>
            <p className="text-2xl font-bold text-amber-600">{pendingInChain}</p>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Fully Approved & Locked Venues</p>
            <p className="text-2xl font-bold text-emerald-600">{approvedBooked}</p>
          </div>
        </div>
      </div>

      {/* Main Sections: Recent Applications & Venue Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Applications list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <CheckSquare className="h-5 w-5 text-[#003366]" />
              <span>Permission Pipeline & Digital Signatures</span>
            </h2>
            <Link href="/approvals" className="text-xs font-bold text-[#003366] hover:underline flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {permissions.map((perm) => (
              <div key={perm.id} className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {perm.trackingCode}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">{perm.societyName}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mt-1">{perm.eventTitle}</h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                      perm.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : perm.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}>
                      {perm.status === 'APPROVED' ? '✓ Fully Signed & Booked' : perm.status.replace('_', ' ')}
                    </span>
                    <Link
                      href={`/document/${perm.id}`}
                      className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                    >
                      View Letter
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border">
                  <div>
                    <span className="text-slate-400 block text-[10px]">VENUE</span>
                    <span className="font-bold text-slate-900">{perm.venueName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">DATE</span>
                    <span className="font-semibold text-slate-900">{perm.fromDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">TIME</span>
                    <span className="font-semibold text-slate-900">{perm.fromTime} - {perm.toTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">AUDIENCE</span>
                    <span className="font-semibold text-slate-900">{perm.expectedAudience} attendees</span>
                  </div>
                </div>

                {/* Progress bar */}
                <ApprovalTimeline permission={perm} />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Venue Inventory Status */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2 border-b pb-2">
              <Building2 className="h-5 w-5 text-amber-600" />
              <span>Campus Venue Inventory</span>
            </h3>

            <p className="text-xs text-slate-500">
              Double-booking prevention checks room schedule live before allowing permission submission.
            </p>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {VENUES.map((v) => (
                <div key={v.id} className="p-3 rounded-lg bg-slate-50 border flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{v.name}</p>
                    <p className="text-[10px] text-slate-500">{v.building} • Cap: {v.capacity}</p>
                  </div>
                  <span className="rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                    Available
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/calendar"
              className="w-full flex items-center justify-center space-x-1.5 rounded-lg bg-blue-50 py-2.5 text-xs font-bold text-[#003366] hover:bg-blue-100 transition border border-blue-200"
            >
              <Calendar className="h-4 w-4" />
              <span>Open Venue Schedule Calendar</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
