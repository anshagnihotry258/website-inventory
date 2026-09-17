'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { getCurrentUser, PRESET_USERS } from '@/lib/auth';
import { getPermissions, signAndAdvancePermission, rejectPermission, adminSelectiveSignPermission, requestEditPermission } from '@/lib/db';
import { PermissionRequest, UserAccount, Role } from '@/lib/types';
import SignatureModal from '@/components/SignatureModal';
import ApprovalTimeline from '@/components/ApprovalTimeline';
import { 
  Clock, 
  CheckCircle2, 
  PenTool, 
  Eye, 
  Crown,
  Zap,
  Check,
  BarChart3,
  Building,
  Users,
  AlertCircle,
  FileEdit,
  Edit3
} from 'lucide-react';

export default function ApprovalsPage() {
  const [currentUser, setUserState] = useState<UserAccount | null>(null);
  const [permissions, setPermissions] = useState<PermissionRequest[]>([]);
  
  // Admin role selection state
  const [adminActAsRole, setAdminActAsRole] = useState<Role>('SECCY');

  // Admin selective checkboxes (1, 2, 3, 4, 5)
  const [selectedAdminRoles, setSelectedAdminRoles] = useState<Record<Role, boolean>>({
    'SECCY': true,
    'PROF_INCHARGE': false,
    'CSTS': false,
    'ADSA': false,
    'DSA': false,
    'ADMIN': false,
    'SOCIETY': false
  });

  // Signature Modal state
  const [selectedRequest, setSelectedRequest] = useState<PermissionRequest | null>(null);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  
  // Request Edit Modal state
  const [requestEditId, setRequestEditId] = useState<string | null>(null);
  const [editRemarksInput, setEditRemarksInput] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    setUserState(user);
    setPermissions(getPermissions());

    const handleAuthChange = () => {
      setUserState(getCurrentUser());
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const refreshData = () => {
    setPermissions(getPermissions());
  };

  const handleOpenSignModal = (perm: PermissionRequest) => {
    setSelectedRequest(perm);
    setIsSignModalOpen(true);
  };

  // Determine active signing user account
  const getActiveSignerAccount = (): UserAccount => {
    if (!currentUser) return PRESET_USERS['shashvat'];
    if (currentUser.role === 'ADMIN') {
      const roleMap: Record<Role, string> = {
        'SECCY': 'shashvat',
        'PROF_INCHARGE': 'prof deepak kumar',
        'CSTS': 'daiwik',
        'ADSA': 'prof mp garg',
        'DSA': 'prof puneet kaur',
        'ADMIN': 'admin',
        'SOCIETY': 'ieee'
      };
      const key = roleMap[adminActAsRole] || 'shashvat';
      return PRESET_USERS[key] || currentUser;
    }
    return currentUser;
  };

  const activeSigner = getActiveSignerAccount();

  const handleConfirmSign = (signatureDataUrl: string, remarks: string) => {
    if (!selectedRequest) return;

    const result = signAndAdvancePermission(
      selectedRequest.id,
      activeSigner.role,
      activeSigner.name,
      activeSigner.designation,
      signatureDataUrl,
      remarks
    );

    if (result.success && result.updatedRequest) {
      setIsSignModalOpen(false);
      setSelectedRequest(null);
      refreshData();

      if (activeSigner.role === 'DSA' || result.updatedRequest.status === 'APPROVED') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  // Admin Selective Signing Callback
  const handleAdminSelectiveSign = (requestId: string) => {
    const roles: Role[] = (['SECCY', 'PROF_INCHARGE', 'CSTS', 'ADSA', 'DSA'] as Role[]).filter(
      r => selectedAdminRoles[r]
    );

    if (roles.length === 0) return;

    const result = adminSelectiveSignPermission(requestId, roles);
    if (result.success) {
      refreshData();
      if (roles.includes('DSA')) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const toggleAllAdminRoles = (select: boolean) => {
    setSelectedAdminRoles({
      'SECCY': select,
      'PROF_INCHARGE': select,
      'CSTS': select,
      'ADSA': select,
      'DSA': select,
      'ADMIN': select,
      'SOCIETY': select
    });
  };

  const handleConfirmRequestEdit = () => {
    if (!requestEditId || !editRemarksInput.trim()) return;
    requestEditPermission(requestEditId, activeSigner.role, activeSigner.name, editRemarksInput);
    setRequestEditId(null);
    setEditRemarksInput('');
    refreshData();
  };

  // Analytics Computation
  const totalRequests = permissions.length;
  const approvedRequests = permissions.filter(p => p.status === 'APPROVED').length;
  const pendingRequests = permissions.filter(p => p.status.startsWith('PENDING')).length;
  const modRequested = permissions.filter(p => p.status === 'MODIFICATION_REQUESTED').length;

  const venueStats: Record<string, number> = {};
  const societyStats: Record<string, number> = {};

  permissions.forEach(p => {
    const vName = p.venueName || 'Unknown';
    venueStats[vName] = (venueStats[vName] || 0) + 1;
    const sName = p.societyName || 'Unknown';
    societyStats[sName] = (societyStats[sName] || 0) + 1;
  });

  const sortedVenues = Object.entries(venueStats).sort((a, b) => b[1] - a[1]);
  const sortedSocieties = Object.entries(societyStats).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-8">
      {/* Header & Role Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded bg-[#990000] text-amber-300 font-extrabold text-[10px] px-2 py-0.5 uppercase">
              Sequential Digital Approvals
            </span>
            <h1 className="text-2xl font-bold text-slate-900">Permission & Signature Workflow</h1>
          </div>
          <p className="text-xs text-slate-500">
            Sequential signing chain: Shashvat (Seccy) → Prof. Deepak Kumar (P/I) → Daiwik (JCSTS) → Prof. M.P. Garg (ADSA) → Prof. Puneet Kaur (DSA).
          </p>
        </div>

        {/* User Role Card */}
        <div className="rounded-xl border bg-white p-3 shadow-md space-y-2 min-w-[280px]">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-900 font-bold text-lg">
              {currentUser?.avatar || '👤'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-sm">{currentUser?.name || 'Guest User'}</span>
                <span className="rounded bg-[#990000] text-amber-300 font-mono text-[10px] font-bold px-1.5 py-0.2">
                  {currentUser?.role || 'LOGIN'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{currentUser?.designation || 'Sign in to approve'}</p>
            </div>
          </div>

          {/* Admin Role Impersonation Dropdown */}
          {currentUser?.isAdmin && (
            <div className="border-t pt-2 space-y-1">
              <label className="text-[10px] font-extrabold text-amber-900 uppercase flex items-center space-x-1">
                <Crown className="h-3 w-3 text-amber-600" />
                <span>Admin Role Selector:</span>
              </label>
              <select
                value={adminActAsRole}
                onChange={(e) => setAdminActAsRole(e.target.value as Role)}
                className="w-full rounded-lg border border-amber-300 bg-amber-50 p-1.5 text-xs font-bold text-slate-950 focus:outline-none"
              >
                <option value="SECCY">Act as: 1. Shashvat (Secretary)</option>
                <option value="PROF_INCHARGE">Act as: 2. Prof. Deepak Kumar (P/I)</option>
                <option value="CSTS">Act as: 3. Daiwik (JCSTS / CSTS)</option>
                <option value="ADSA">Act as: 4. Prof. M.P. Garg (ADSA)</option>
                <option value="DSA">Act as: 5. Prof. Puneet Kaur (DSA)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Admin Selective Signing Control Panel */}
      {currentUser?.isAdmin && (
        <div className="rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 p-5 text-blue-950 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-white" />
              <h3 className="font-extrabold text-sm text-white">Admin Selective Signature Panel</h3>
            </div>
            <div className="space-x-2 text-xs">
              <button
                type="button"
                onClick={() => toggleAllAdminRoles(true)}
                className="px-2.5 py-1 rounded bg-amber-100 font-bold text-amber-950 hover:bg-white"
              >
                Select All 5
              </button>
              <button
                type="button"
                onClick={() => toggleAllAdminRoles(false)}
                className="px-2.5 py-1 rounded bg-amber-800 text-white font-bold hover:bg-amber-900"
              >
                Clear
              </button>
            </div>
          </div>

          <p className="text-xs text-amber-100">
            Check any stage below to selectively sign on behalf of officers 1, 2, 3, 4, or all 5:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-bold text-white pt-1">
            {[
              { role: 'SECCY' as Role, label: '1. Shashvat (Seccy)' },
              { role: 'PROF_INCHARGE' as Role, label: '2. Prof. Deepak (P/I)' },
              { role: 'CSTS' as Role, label: '3. Daiwik (CSTS)' },
              { role: 'ADSA' as Role, label: '4. Prof. M.P. Garg (ADSA)' },
              { role: 'DSA' as Role, label: '5. Prof. Puneet (DSA)' },
            ].map((item) => (
              <label key={item.role} className="flex items-center space-x-2 bg-black/20 p-2 rounded-lg cursor-pointer hover:bg-black/30">
                <input
                  type="checkbox"
                  checked={!!selectedAdminRoles[item.role]}
                  onChange={(e) => setSelectedAdminRoles({ ...selectedAdminRoles, [item.role]: e.target.checked })}
                  className="rounded text-amber-500 h-4 w-4"
                />
                <span className="truncate">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Dashboard (Admin & DSA Overview) */}
      {(currentUser?.isAdmin || currentUser?.role === 'DSA' || currentUser?.role === 'ADSA') && (
        <div className="rounded-2xl border bg-white p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-[#990000]" />
              <h2 className="text-base font-extrabold text-slate-900">Administrative Analytics & Venue Utilization</h2>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full uppercase font-mono">
              Real-Time Statistics
            </span>
          </div>

          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border bg-gradient-to-br from-slate-50 to-slate-100 p-4 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Applications</span>
              <p className="text-2xl font-black text-slate-900">{totalRequests}</p>
              <span className="text-[11px] text-slate-500 block">Submitted via Docify</span>
            </div>
            <div className="rounded-xl border bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 space-y-1 border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Fully Sanctioned</span>
              <p className="text-2xl font-black text-emerald-800">{approvedRequests}</p>
              <span className="text-[11px] text-emerald-600 block">Rooms locked on calendar</span>
            </div>
            <div className="rounded-xl border bg-gradient-to-br from-amber-50 to-amber-100/50 p-4 space-y-1 border-amber-200">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Pending Signatures</span>
              <p className="text-2xl font-black text-amber-900">{pendingRequests}</p>
              <span className="text-[11px] text-amber-700 block">In approval pipeline</span>
            </div>
            <div className="rounded-xl border bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 space-y-1 border-blue-200">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Modifications Requested</span>
              <p className="text-2xl font-black text-blue-900">{modRequested}</p>
              <span className="text-[11px] text-blue-700 block">Sent back with remarks</span>
            </div>
          </div>

          {/* Detailed Breakdown: Top Venues & Top Societies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-2 border-b pb-2">
                <Building className="h-4 w-4 text-[#990000]" />
                <h3 className="font-bold text-xs text-slate-900 uppercase">Top Requested Venues</h3>
              </div>
              <div className="space-y-2 text-xs">
                {sortedVenues.slice(0, 5).map(([vName, count]) => {
                  const percent = totalRequests > 0 ? Math.round((count / totalRequests) * 100) : 0;
                  return (
                    <div key={vName} className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>{vName}</span>
                        <span className="font-mono text-slate-500">{count} bookings ({percent}%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-[#990000] rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-2 border-b pb-2">
                <Users className="h-4 w-4 text-blue-900" />
                <h3 className="font-bold text-xs text-slate-900 uppercase">Active Societies Leaderboard</h3>
              </div>
              <div className="space-y-2 text-xs">
                {sortedSocieties.slice(0, 5).map(([sName, count]) => {
                  const percent = totalRequests > 0 ? Math.round((count / totalRequests) * 100) : 0;
                  return (
                    <div key={sName} className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span className="truncate max-w-[200px]">{sName}</span>
                        <span className="font-mono text-slate-500">{count} requests</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-blue-900 rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Applications Pipeline */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2 border-b pb-2">
          <Clock className="h-5 w-5 text-[#990000]" />
          <span>Applications Pipeline & Digital Signatures</span>
        </h2>

        <div className="space-y-6">
          {permissions.map((perm) => {
            const hasSignedThisLevel = !!perm.signatures[activeSigner.role];
            const isFullyApproved = perm.status === 'APPROVED';
            const isModRequested = perm.status === 'MODIFICATION_REQUESTED';

            return (
              <div 
                key={perm.id} 
                className="rounded-2xl border bg-white p-6 shadow-sm space-y-4 hover:shadow-xl transition group relative border-l-4 border-l-[#990000]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-red-950 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        {perm.trackingCode}
                      </span>
                      <span className="text-xs font-bold text-slate-700">{perm.societyName}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mt-1">{perm.eventTitle}</h3>
                  </div>

                  {/* Status & Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {isFullyApproved ? (
                      <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-extrabold text-emerald-800 flex items-center space-x-1">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>✓ Fully Signed & Booked</span>
                      </span>
                    ) : isModRequested ? (
                      <span className="rounded-full bg-amber-100 px-3.5 py-1 text-xs font-extrabold text-amber-900 flex items-center space-x-1 border border-amber-300">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <span>Modification Requested</span>
                      </span>
                    ) : hasSignedThisLevel ? (
                      <button
                        disabled
                        className="rounded-xl bg-emerald-50 border border-emerald-300 px-4 py-2 text-xs font-extrabold text-emerald-800 cursor-not-allowed opacity-80 flex items-center space-x-1.5"
                      >
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span>Signed at {activeSigner.role} Level ✓</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleOpenSignModal(perm)}
                          className="rounded-xl bg-[#990000] px-4 py-2 text-xs font-extrabold text-white shadow-md hover:bg-red-900 transition flex items-center space-x-1.5"
                        >
                          <PenTool className="h-4 w-4 text-amber-300" />
                          <span>Approve & Sign ({activeSigner.role})</span>
                        </button>

                        <button
                          onClick={() => setRequestEditId(perm.id)}
                          className="rounded-xl bg-amber-100 border border-amber-300 px-3 py-2 text-xs font-bold text-amber-900 hover:bg-amber-200 transition flex items-center space-x-1"
                        >
                          <FileEdit className="h-3.5 w-3.5 text-amber-700" />
                          <span>Request Edit</span>
                        </button>
                      </>
                    )}

                    {/* Admin Selective Sign Button */}
                    {currentUser?.isAdmin && !isFullyApproved && (
                      <button
                        onClick={() => handleAdminSelectiveSign(perm.id)}
                        className="rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-extrabold text-blue-950 shadow-md hover:bg-amber-400 transition flex items-center space-x-1"
                      >
                        <Zap className="h-4 w-4" />
                        <span>Sign Selected Stages</span>
                      </button>
                    )}

                    {/* Resubmit button if modification requested */}
                    {isModRequested && (
                      <Link
                        href={`/docify?editId=${perm.id}`}
                        className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-extrabold text-blue-950 shadow hover:bg-amber-400 transition flex items-center space-x-1.5 animate-pulse"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Edit & Resubmit</span>
                      </Link>
                    )}

                    <Link
                      href={`/document?id=${perm.id}`}
                      className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition flex items-center space-x-1 border"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View Official Letter</span>
                    </Link>
                  </div>
                </div>

                {/* Edit Request Remarks Banner */}
                {isModRequested && perm.editRequestRemarks && (
                  <div className="rounded-xl bg-amber-50 border border-amber-300 p-3 text-xs text-amber-900 space-y-1">
                    <span className="font-extrabold flex items-center space-x-1 text-amber-800 uppercase text-[10px]">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                      <span>Officer Remarks for Edit:</span>
                    </span>
                    <p className="font-medium italic text-slate-800">&quot;{perm.editRequestRemarks}&quot;</p>
                  </div>
                )}

                {/* Application Details Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border">
                  <div>
                    <span className="text-slate-400 block text-[10px]">BOOKED VENUE</span>
                    <span className="font-bold text-slate-900">{perm.venueName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">DATES</span>
                    <span className="font-semibold text-slate-900">{perm.fromDate} to {perm.toDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">TIMING</span>
                    <span className="font-semibold text-slate-900">{perm.fromTime} - {perm.toTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">APPLICANT</span>
                    <span className="font-semibold text-slate-900">{perm.applicantName} ({perm.applicantRoll})</span>
                  </div>
                </div>

                {/* 5-Stage Approval Progress Timeline */}
                <ApprovalTimeline permission={perm} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Signature Modal */}
      {selectedRequest && (
        <SignatureModal
          isOpen={isSignModalOpen}
          onClose={() => setIsSignModalOpen(false)}
          onConfirmSign={handleConfirmSign}
          user={activeSigner}
          permissionTitle={selectedRequest.eventTitle}
        />
      )}

      {/* Request Edit Remarks Modal */}
      {requestEditId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 border-b pb-3">
              <FileEdit className="h-5 w-5 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-base">Request Application Modification</h3>
            </div>
            <p className="text-xs text-slate-600">
              Specify what changes or corrections the applicant needs to make (e.g. date change, venue availability issue, missing details):
            </p>
            <textarea
              value={editRemarksInput}
              onChange={(e) => setEditRemarksInput(e.target.value)}
              placeholder="Enter remarks for student..."
              className="w-full h-28 rounded-xl border border-slate-300 p-3 text-xs focus:border-amber-500 focus:outline-none"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setRequestEditId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRequestEdit}
                disabled={!editRemarksInput.trim()}
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-500 text-blue-950 hover:bg-amber-400 disabled:opacity-50"
              >
                Send Request to Applicant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
