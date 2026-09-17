'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { getCurrentUser, PRESET_USERS, STAGE_ROLES } from '@/lib/auth';
import { getPermissions, signAndAdvancePermission, rejectPermission } from '@/lib/db';
import { PermissionRequest, UserAccount, Role } from '@/lib/types';
import SignatureModal from '@/components/SignatureModal';
import ApprovalTimeline from '@/components/ApprovalTimeline';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  PenTool, 
  FileText, 
  Eye, 
  UserCheck,
  AlertCircle,
  Building2
} from 'lucide-react';

export default function ApprovalsPage() {
  const [currentUser, setUserState] = useState<UserAccount | null>(null);
  const [permissions, setPermissions] = useState<PermissionRequest[]>([]);
  
  // Signature Modal state
  const [selectedRequest, setSelectedRequest] = useState<PermissionRequest | null>(null);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    setUserState(user);
    setPermissions(getPermissions());
  }, []);

  const refreshData = () => {
    setPermissions(getPermissions());
  };

  const handleOpenSignModal = (perm: PermissionRequest) => {
    setSelectedRequest(perm);
    setIsSignModalOpen(true);
  };

  const handleConfirmSign = (signatureDataUrl: string, remarks: string) => {
    if (!selectedRequest || !currentUser) return;

    const result = signAndAdvancePermission(
      selectedRequest.id,
      currentUser.role,
      currentUser.name,
      currentUser.designation,
      signatureDataUrl,
      remarks
    );

    if (result.success && result.updatedRequest) {
      setIsSignModalOpen(false);
      setSelectedRequest(null);
      refreshData();

      // Trigger Confetti if DSA signed and room is fully locked!
      if (currentUser.role === 'DSA' || result.updatedRequest.status === 'APPROVED') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleReject = (requestId: string) => {
    if (!currentUser || !rejectionReason.trim()) return;

    rejectPermission(requestId, currentUser.role, currentUser.name, rejectionReason);
    setRejectingId(null);
    setRejectionReason('');
    refreshData();
  };

  // Determine permissions waiting specifically for the current logged-in role
  const myPendingRequests = permissions.filter(p => {
    if (!currentUser) return false;
    if (currentUser.role === 'SOCIETY') return p.societyName === (currentUser.societyName || currentUser.name);

    const targetStage = Object.entries(STAGE_ROLES).find(([_, info]) => info.role === currentUser.role);
    if (!targetStage) return false;
    const stageNum = Number(targetStage[0]);
    return p.currentStage === stageNum && p.status !== 'REJECTED' && p.status !== 'APPROVED';
  });

  const otherRequests = permissions.filter(p => !myPendingRequests.includes(p));

  return (
    <div className="space-y-8">
      {/* Header & Role Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded bg-blue-900 text-amber-300 font-extrabold text-[10px] px-2 py-0.5 uppercase">
              Sequential Digital Approvals
            </span>
            <h1 className="text-2xl font-bold text-slate-900">Permission & Signature Workflow</h1>
          </div>
          <p className="text-xs text-slate-500">
            Official 5-tier signature pipeline: Seccy $\rightarrow$ Prof. In-Charge $\rightarrow$ CSTS/JCSTS $\rightarrow$ ADSA $\rightarrow$ DSA.
          </p>
        </div>

        {/* User Role Card */}
        <div className="rounded-xl border bg-white p-3 shadow-sm flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-900 font-bold text-lg">
            {currentUser?.avatar || '✍️'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 text-sm">{currentUser?.name}</span>
              <span className="rounded bg-blue-900 text-amber-300 font-mono text-[10px] font-bold px-1.5 py-0.2">
                {currentUser?.role}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">{currentUser?.designation}</p>
          </div>
        </div>
      </div>

      {/* Waiting For My Action Section */}
      {currentUser && currentUser.role !== 'SOCIETY' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-amber-200 pb-2">
            <PenTool className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Action Required: Waiting for Your Digital Signature ({myPendingRequests.length})
            </h2>
          </div>

          {myPendingRequests.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center text-xs text-slate-500 bg-white">
              No permissions currently pending at your level [{currentUser.role}].
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {myPendingRequests.map((perm) => (
                <div key={perm.id} className="rounded-2xl border-2 border-amber-300 bg-amber-50/40 p-6 shadow-md space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-3">
                    <div>
                      <span className="font-mono text-xs font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
                        {perm.trackingCode}
                      </span>
                      <h3 className="font-bold text-slate-900 text-lg mt-1">{perm.eventTitle}</h3>
                      <p className="text-xs text-slate-600">Applicant: <strong>{perm.societyName}</strong> ({perm.applicantName})</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenSignModal(perm)}
                        className="rounded-xl bg-[#003366] px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-blue-900 transition flex items-center space-x-1.5"
                      >
                        <PenTool className="h-4 w-4 text-amber-400" />
                        <span>Sign & Approve Now</span>
                      </button>

                      <button
                        onClick={() => setRejectingId(rejectingId === perm.id ? null : perm.id)}
                        className="rounded-xl bg-red-100 px-3 py-2.5 text-xs font-bold text-red-700 hover:bg-red-200 transition"
                      >
                        Reject
                      </button>

                      <Link
                        href={`/document/${perm.id}`}
                        className="rounded-xl bg-white px-3 py-2.5 text-xs font-bold text-slate-700 border hover:bg-slate-50 transition flex items-center space-x-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Letter</span>
                      </Link>
                    </div>
                  </div>

                  {/* Rejection input box */}
                  {rejectingId === perm.id && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-4 space-y-2 text-xs">
                      <label className="font-bold text-red-900">Reason for Rejection</label>
                      <input
                        type="text"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter reason for rejecting this room permission..."
                        className="w-full rounded-lg border p-2 text-xs focus:outline-none"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setRejectingId(null)}
                          className="px-3 py-1 text-slate-600 font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleReject(perm.id)}
                          className="rounded bg-red-600 px-4 py-1 font-bold text-white shadow"
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700 bg-white p-3 rounded-xl border">
                    <div>
                      <span className="text-slate-400 text-[10px] block">REQUESTED VENUE</span>
                      <strong className="text-blue-950 font-bold">{perm.venueName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">DATES</span>
                      <strong>{perm.fromDate} to {perm.toDate}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">TIMINGS</span>
                      <strong>{perm.fromTime} - {perm.toTime}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">PURPOSE</span>
                      <span className="truncate block">{perm.subject}</span>
                    </div>
                  </div>

                  <ApprovalTimeline permission={perm} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* All Pipeline Applications */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2 border-b pb-2">
          <Clock className="h-5 w-5 text-blue-900" />
          <span>All Applications in Approval Pipeline ({permissions.length})</span>
        </h2>

        <div className="space-y-4">
          {permissions.map((perm) => (
            <div key={perm.id} className="rounded-2xl border bg-white p-6 shadow-sm space-y-4 hover:shadow-md transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {perm.trackingCode}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{perm.societyName}</span>
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
                    View Official Letter
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border">
                <div>
                  <span className="text-slate-400 block text-[10px]">VENUE</span>
                  <span className="font-bold text-slate-900">{perm.venueName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">DATES</span>
                  <span className="font-semibold text-slate-900">{perm.fromDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">TIME</span>
                  <span className="font-semibold text-slate-900">{perm.fromTime} - {perm.toTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ATTENDEES</span>
                  <span className="font-semibold text-slate-900">{perm.expectedAudience} attendees</span>
                </div>
              </div>

              <ApprovalTimeline permission={perm} />
            </div>
          ))}
        </div>
      </div>

      {/* Signature Modal */}
      {selectedRequest && currentUser && (
        <SignatureModal
          isOpen={isSignModalOpen}
          onClose={() => setIsSignModalOpen(false)}
          onConfirmSign={handleConfirmSign}
          user={currentUser}
          permissionTitle={selectedRequest.eventTitle}
        />
      )}
    </div>
  );
}
