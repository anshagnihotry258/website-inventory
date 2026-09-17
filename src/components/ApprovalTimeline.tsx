'use client';

import React from 'react';
import { PermissionRequest, Role } from '@/lib/types';
import { Check, Clock, AlertCircle, ShieldCheck } from 'lucide-react';

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
  const currentStage = permission.currentStage;

  return (
    <div className="w-full space-y-4">
      {/* Horizontal Step Bar */}
      <div className="relative flex items-center justify-between">
        {/* Connecting Line */}
        <div className="absolute left-0 top-1/2 -z-0 h-1 w-full bg-slate-200 -translate-y-1/2" />
        <div 
          className="absolute left-0 top-1/2 -z-0 h-1 bg-emerald-600 -translate-y-1/2 transition-all duration-500" 
          style={{ width: `${Math.min(100, ((currentStage - 1) / 4) * 100)}%` }}
        />

        {STAGES.map((s) => {
          const sig = permission.signatures[s.key];
          const isDone = !!sig;
          const isCurrent = permission.currentStage === s.stage && !isRejected && !isDone;
          
          return (
            <div key={s.stage} className="relative z-10 flex flex-col items-center group">
              <div 
                className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all shadow-md ${
                  isDone 
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' 
                    : isCurrent 
                      ? 'bg-amber-500 text-blue-950 ring-4 ring-amber-100 animate-pulse' 
                      : isRejected && permission.currentStage === s.stage
                        ? 'bg-red-600 text-white'
                        : 'bg-white text-slate-400 border-2 border-slate-300'
                }`}
              >
                {isDone ? (
                  <Check className="h-5 w-5" />
                ) : isCurrent ? (
                  <Clock className="h-5 w-5" />
                ) : (
                  <span>{s.stage}</span>
                )}
              </div>

              <div className="mt-2 text-center">
                <p className={`text-xs font-bold ${isDone ? 'text-emerald-700' : isCurrent ? 'text-amber-600 font-extrabold' : 'text-slate-500'}`}>
                  {s.title}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {isDone ? 'Signed ✓' : isCurrent ? 'Pending...' : 'Waiting'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Signature Verification Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 pt-2">
        {STAGES.map((s) => {
          const sig = permission.signatures[s.key];
          return (
            <div 
              key={s.stage}
              className={`rounded-lg border p-2.5 text-xs transition ${
                sig ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-50 border-slate-200 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between font-semibold text-slate-700">
                <span className="truncate">{s.label}</span>
                {sig && <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />}
              </div>

              {sig ? (
                <div className="mt-1.5 space-y-1">
                  <p className="font-bold text-slate-900 truncate">{sig.signatoryName}</p>
                  {sig.signatureDataUrl ? (
                    <img 
                      src={sig.signatureDataUrl} 
                      alt="Digital Signature" 
                      className="h-7 max-w-full object-contain bg-white rounded border border-slate-200 px-1 py-0.5" 
                    />
                  ) : (
                    <div className="font-serif italic text-[11px] text-blue-900 font-semibold border-b border-blue-200 pb-0.5">
                      {sig.signatoryName}
                    </div>
                  )}
                  <p className="text-[9px] font-mono text-emerald-700 truncate">
                    Hash: {sig.verificationHash}
                  </p>
                  <p className="text-[9px] text-slate-400">
                    {new Date(sig.signedAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-[10px] italic text-slate-400">Awaiting signature</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
