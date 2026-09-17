'use client';

import React from 'react';
import { PermissionRequest, Role } from '@/lib/types';
import { Check, Clock, ShieldCheck } from 'lucide-react';

interface ApprovalTimelineProps {
  permission: PermissionRequest;
}

const STAGES = [
  { stage: 1, key: 'SECCY' as Role, title: '1. Secretary (Seccy)', label: 'Secretary / J. Secretary' },
  { stage: 2, key: 'PROF_INCHARGE' as Role, title: '2. Prof. In-Charge', label: 'Signature of P/I' },
  { stage: 3, key: 'CSTS' as Role, title: '3. CSTS / JCSTS', label: 'CCS / CSTS' },
  { stage: 4, key: 'ADSA' as Role, title: '4. ADSA', label: 'Associate Dean SA' },
  { stage: 5, key: 'DSA' as Role, title: '5. DSA', label: 'Dean Student Affairs' },
];

export default function ApprovalTimeline({ permission }: ApprovalTimelineProps) {
  const isRejected = permission.status === 'REJECTED';

  return (
    <div className="w-full space-y-3">
      {/* 5 Independent Signatory Cards (No bar) */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {STAGES.map((s) => {
          const sig = permission.signatures[s.key];
          const isDone = !!sig;
          const isCurrent = permission.currentStage === s.stage && !isRejected && !isDone;

          return (
            <div 
              key={s.stage}
              className={`rounded-xl border p-3 transition space-y-1.5 ${
                isDone 
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' 
                  : isCurrent 
                    ? 'bg-amber-50 border-amber-300 text-amber-950 ring-2 ring-amber-200 animate-pulse' 
                    : 'bg-slate-50 border-slate-200 text-slate-500 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-xs">
                <span className="truncate">{s.title}</span>
                {isDone ? (
                  <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                ) : isCurrent ? (
                  <Clock className="h-4 w-4 text-amber-600 flex-shrink-0" />
                ) : null}
              </div>

              {sig ? (
                <div className="space-y-1 pt-1 border-t border-emerald-200">
                  <p className="font-bold text-slate-900 text-xs truncate">{sig.signatoryName}</p>
                  {sig.signatureDataUrl ? (
                    <img 
                      src={sig.signatureDataUrl} 
                      alt="Digital Signature" 
                      className="h-6 max-w-full object-contain bg-white rounded border border-slate-200 px-1 py-0.5" 
                    />
                  ) : (
                    <p className="font-serif italic text-[11px] text-blue-900 font-semibold truncate">
                      {sig.signatoryName}
                    </p>
                  )}
                  <p className="text-[9px] font-mono text-emerald-700 truncate">
                    Hash: {sig.verificationHash}
                  </p>
                </div>
              ) : (
                <div className="pt-1 border-t border-slate-200">
                  <span className={`text-[10px] font-semibold ${isCurrent ? 'text-amber-700 font-bold' : 'text-slate-400'}`}>
                    {isCurrent ? 'Awaiting Signature...' : 'Pending'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
