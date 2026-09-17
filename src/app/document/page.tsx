'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { getPermissions } from '@/lib/db';
import { PermissionRequest, Role } from '@/lib/types';
import { 
  Printer, 
  ArrowLeft, 
  ShieldCheck
} from 'lucide-react';

const SIGNATORY_BOXES: { key: Role; label: string; roleName: string }[] = [
  { key: 'SECCY', label: '(Name & Signature of Secretary / J. Secretary)', roleName: '1. Secretary (Seccy)' },
  { key: 'PROF_INCHARGE', label: '(Signature of Prof. In-Charge P/I)', roleName: '2. Prof. In-Charge (P/I)' },
  { key: 'CSTS', label: '(Name & Signature of Convenor CCS/CSTS)', roleName: '3. Convenor CSTS / JCSTS' },
  { key: 'ADSA', label: '(Signature of Associate Dean SA - ADSA)', roleName: '4. ADSA' },
  { key: 'DSA', label: '(Signature & Sanction Stamp of DSA)', roleName: '5. Dean Student Affairs (DSA)' },
];

function DocumentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  const [permission, setPermission] = useState<PermissionRequest | null>(null);

  useEffect(() => {
    if (id) {
      const all = getPermissions();
      const found = all.find(p => p.id === id);
      if (found) {
        setPermission(found);
      }
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (!permission) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-slate-500 font-semibold">Permission document not found.</p>
        <Link href="/approvals" className="text-xs font-bold text-blue-900 underline">
          Return to Approvals Pipeline
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Control Bar (No Print) */}
      <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
        <Link
          href="/approvals"
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>← Back to Approvals Dashboard</span>
        </Link>

        <div className="flex items-center space-x-3">
          <span className="font-mono text-xs font-bold bg-blue-50 text-blue-950 px-3 py-1 rounded-lg border border-blue-200">
            Tracking: {permission.trackingCode}
          </span>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 rounded-xl bg-[#003366] px-5 py-2 text-xs font-bold text-white shadow hover:bg-blue-900 transition"
          >
            <Printer className="h-4 w-4 text-amber-400" />
            <span>Print Official Letter / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Official PEC Permission Document Container */}
      <div className="rounded-2xl border bg-white p-8 md:p-12 shadow-2xl space-y-8 font-serif text-slate-900 border-t-8 border-t-[#003366] relative">
        {/* Verification Stamp Background */}
        {permission.status === 'APPROVED' && (
          <div className="absolute top-12 right-12 border-4 border-emerald-600 rounded-full p-4 opacity-20 pointer-events-none transform rotate-12 text-center font-sans font-black text-emerald-800 uppercase tracking-widest text-sm">
            SANCTIONED & LOCKED<br />DSA PEC CHANDIGARH
          </div>
        )}

        {/* Header Logo & Institution Title */}
        <div className="text-center space-y-2 border-b-2 border-slate-800 pb-4 font-sans">
          <div className="flex items-center justify-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#003366] text-amber-400 font-extrabold text-xl">
              PEC
            </div>
            <div className="text-left">
              <h1 className="text-xl font-black text-[#003366] tracking-tight uppercase">
                PUNJAB ENGINEERING COLLEGE
              </h1>
              <p className="text-xs font-bold text-slate-600">
                (Deemed to be University), Sector 12, Chandigarh - 160012
              </p>
              <p className="text-[11px] font-semibold text-amber-800">
                OFFICE OF DEAN STUDENT AFFAIRS (DSA)
              </p>
            </div>
          </div>
        </div>

        {/* Tracking & Date Meta */}
        <div className="flex items-center justify-between text-xs font-sans font-semibold text-slate-700">
          <p>Ref No: <strong className="font-mono text-slate-900">{permission.trackingCode}</strong></p>
          <p>Date Generated: <strong>{new Date(permission.createdAt).toLocaleDateString()}</strong></p>
        </div>

        {/* Salutation & Body */}
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            <strong>To,</strong><br />
            The Dean Student Affairs,<br />
            Punjab Engineering College, Chandigarh.
          </p>

          <p className="pt-2 font-bold text-base border-l-4 border-[#003366] pl-3 py-1 bg-slate-50">
            Subject: {permission.subject}
          </p>

          <p className="pt-2">Respected Sir,</p>

          <p className="text-justify font-sans text-xs sm:text-sm">
            We, <strong>{permission.societyName}</strong>, request your official sanction and permission for reserving <strong>{permission.venueName}</strong> to organize <strong>&quot;{permission.eventTitle}&quot;</strong> from <strong>{permission.fromDate}</strong> to <strong>{permission.toDate}</strong> during <strong>{permission.fromTime} to {permission.toTime}</strong>.
          </p>

          <p className="text-justify font-sans text-xs sm:text-sm">
            <strong>Event Purpose & Brief Description:</strong><br />
            {permission.eventPurpose}
          </p>
        </div>

        {/* Logistics Breakdown Table */}
        <div className="rounded-xl border bg-slate-50/80 p-4 space-y-2 font-sans text-xs">
          <h3 className="font-bold text-[#003366] text-xs uppercase tracking-wider border-b pb-1">
            Logistics & Applicant Details
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
            <div>
              <span className="text-slate-400 block text-[10px]">APPLICANT LEAD</span>
              <strong className="text-slate-900">{permission.applicantName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">ROLL NUMBER</span>
              <strong className="text-slate-900">{permission.applicantRoll}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">PHONE / EMAIL</span>
              <strong className="text-slate-900">{permission.applicantPhone}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">EXPECTED ATTENDEES</span>
              <strong className="text-slate-900">{permission.expectedAudience} attendees</strong>
            </div>
          </div>

          <div className="pt-1 text-[11px] text-slate-600">
            <strong>Equipment Requested:</strong> {permission.equipmentNeeded.join(', ') || 'Standard Hall Equipment'}
          </div>
        </div>

        {/* Official 5-Tier Signature Grid */}
        <div className="pt-6 font-sans space-y-3">
          <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider border-b pb-1">
            Official Endorsements & Digital Signatures (Order: Secretary → Prof. In-Charge → CSTS → ADSA → DSA)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {SIGNATORY_BOXES.map((box) => {
              const sig = permission.signatures[box.key];
              return (
                <div key={box.key} className="rounded-xl border p-3 flex flex-col justify-between h-36 bg-slate-50/50">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-blue-900">{box.roleName}</p>
                    <p className="text-[9px] text-slate-400 italic">{box.label}</p>
                  </div>

                  {sig ? (
                    <div className="space-y-1 border-t pt-1">
                      {sig.signatureDataUrl ? (
                        <img 
                          src={sig.signatureDataUrl} 
                          alt="Signature" 
                          className="h-8 object-contain bg-white rounded border px-1" 
                        />
                      ) : (
                        <p className="font-serif italic font-bold text-blue-950 text-xs truncate">
                          {sig.signatoryName}
                        </p>
                      )}
                      <p className="text-[8px] font-bold text-emerald-700 truncate">
                        ✓ {sig.signatoryName}
                      </p>
                      <p className="text-[7px] font-mono text-slate-500 truncate">
                        Hash: {sig.verificationHash}
                      </p>
                    </div>
                  ) : (
                    <div className="border-t border-dashed pt-2 text-[9px] text-slate-400 italic text-center">
                      Pending Signature
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Verification Footer */}
        <div className="pt-6 border-t font-sans flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-2">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Digitally Verified & Locked by Punjab Engineering College Permission System</span>
          </div>
          <p className="font-mono">Document ID: {permission.id}</p>
        </div>
      </div>
    </div>
  );
}

export default function DocumentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading document...</div>}>
      <DocumentContent />
    </Suspense>
  );
}
