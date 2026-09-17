'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { getCurrentUser, PRESET_USERS, STAGE_ROLES } from '@/lib/auth';
import { getPermissions, signAndAdvancePermission, rejectPermission, adminSelectiveSignPermission } from '@/lib/db';
import { PermissionRequest, UserAccount, Role } from '@/lib/types';
import SignatureModal from '@/components/SignatureModal';
import ApprovalTimeline from '@/components/ApprovalTimeline';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  PenTool, 
  FileText, 
  Eye, 
  Crown,
  Zap,
  Check,
  XCircle,
  UserCheck
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
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);

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

  const handleReject = (requestId: string) => {
    if (!rejectionReason.trim()) return;

    rejectPermission(requestId, activeSigner.role, activeSigner.name, rejectionReason);
    setRejectingId(null);
    setRejectionReason('');
    refreshData();
  };

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

                  {/* Status & Dimmed Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {isFullyApproved ? (
                      <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-extrabold text-emerald-800 flex items-center space-x-1">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>✓ Fully Signed & Booked</span>
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
                      <button
                        onClick={() => handleOpenSignModal(perm)}
                        className="rounded-xl bg-[#990000] px-4 py-2 text-xs font-extrabold text-white shadow-md hover:bg-red-900 transition flex items-center space-x-1.5"
                      >
                        <PenTool className="h-4 w-4 text-amber-300" />
                        <span>Approve & Sign ({activeSigner.role})</span>
                      </button>
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

                    <Link
                      href={`/document?id=${perm.id}`}
                      className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition flex items-center space-x-1 border"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View Official Letter</span>
                    </Link>
                  </div>
                </div>

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
    </div>
  );
}
