'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPermissions } from '@/lib/db';
import { PermissionRequest, Role } from '@/lib/types';
import { 
  Printer, 
  ArrowLeft, 
  ShieldCheck
} from 'lucide-react';

export default function DocumentClient({ id }: { id: string }) {
  const router = useRouter();
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
          Return to Approvals Dashboard
        </Link>
      </div>
    );
  }

  // Format Date string matching Screenshot 2
  const formattedDate = permission.isMultiDay
    ? `${permission.fromDate} to ${permission.toDate}`
    : permission.fromDate;

  // Format Time string matching Screenshot 2
  const formattedTime = permission.isDiffTimePerDay && permission.day2FromTime
    ? `${permission.fromDate} : ${permission.fromTime} - ${permission.toTime} | ${permission.day2FromDate || permission.toDate} : ${permission.day2FromTime} - ${permission.day2ToTime}`
    : `${permission.fromTime} - ${permission.toTime}`;

  const secSig = permission.signatures['SECCY'];
  const cstsSig = permission.signatures['CSTS'];
  const piSig = permission.signatures['PROF_INCHARGE'];
  const adsaSig = permission.signatures['ADSA'];
  const dsaSig = permission.signatures['DSA'];

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
          <span className="font-mono text-xs font-bold bg-red-50 text-red-950 px-3 py-1 rounded-lg border border-red-200">
            Tracking: {permission.trackingCode}
          </span>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 rounded-xl bg-[#990000] px-5 py-2 text-xs font-bold text-white shadow hover:bg-red-900 transition"
          >
            <Printer className="h-4 w-4 text-amber-300" />
            <span>Print Official Letter / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Official PEC Performa Container matching Screenshots 1 & 2 EXACTLY */}
      <div className="rounded-2xl border bg-white p-8 md:p-12 shadow-2xl space-y-6 font-serif text-slate-900 border-t-8 border-t-[#990000] relative">
        {/* Verification Stamp Background */}
        {permission.status === 'APPROVED' && (
          <div className="absolute top-16 right-12 border-4 border-emerald-600 rounded-full p-4 opacity-20 pointer-events-none transform rotate-12 text-center font-sans font-black text-emerald-800 uppercase tracking-widest text-sm">
            SANCTIONED & LOCKED<br />DSA PEC CHANDIGARH
          </div>
        )}

        {/* Official Header matching Screenshot 1 */}
        <div className="text-center space-y-1 font-serif text-slate-900">
          <h1 className="text-lg font-black tracking-wide uppercase">PUNJAB ENGINEERING COLLEGE</h1>
          <h2 className="text-sm font-bold tracking-wide uppercase">(DEEMED TO BE UNIVERSITY)</h2>
          <h3 className="text-sm font-bold tracking-wide uppercase">CHANDIGARH</h3>

          <div className="pt-4 pb-2">
            <p className="text-sm font-bold underline font-sans">
              Performa for Booking OF Lecture Rooms by Clubs/ Society/NSS/Sports & departments
            </p>
          </div>

          <div className="text-left font-sans text-xs font-bold pt-2 underline">
            P/I Security
          </div>
        </div>

        {/* Official Bordered Table matching Screenshot 1 & 2 */}
        <div className="border-2 border-slate-900 font-sans">
          <table className="w-full border-collapse text-xs">
            <tbody>
              <tr className="border-b border-slate-900">
                <td className="p-3 font-bold border-r border-slate-900 w-2/5 bg-slate-50">Name of Club/Society:</td>
                <td className="p-3 font-semibold">{permission.societyName}</td>
              </tr>
              <tr className="border-b border-slate-900">
                <td className="p-3 font-bold border-r border-slate-900 bg-slate-50">Event Name:</td>
                <td className="p-3 font-semibold">{permission.eventTitle}</td>
              </tr>
              <tr className="border-b border-slate-900">
                <td className="p-3 font-bold border-r border-slate-900 bg-slate-50">Brief Event Description:</td>
                <td className="p-3 leading-relaxed whitespace-pre-wrap">{permission.eventPurpose}</td>
              </tr>
              <tr className="border-b border-slate-900">
                <td className="p-3 font-bold border-r border-slate-900 bg-slate-50">Date:</td>
                <td className="p-3 font-semibold">{formattedDate}</td>
              </tr>
              <tr className="border-b border-slate-900">
                <td className="p-3 font-bold border-r border-slate-900 bg-slate-50">Time:</td>
                <td className="p-3 font-semibold whitespace-pre-wrap">{formattedTime}</td>
              </tr>
              <tr className="border-b border-slate-900">
                <td className="p-3 font-bold border-r border-slate-900 bg-slate-50">Room Number:</td>
                <td className="p-3 font-bold text-[#990000]">{permission.venueName}</td>
              </tr>
              <tr className="border-b border-slate-900">
                <td className="p-3 font-bold border-r border-slate-900 bg-slate-50">Department:</td>
                <td className="p-3 font-semibold">{permission.department || 'Student Affairs'}</td>
              </tr>
              <tr>
                <td className="p-3 font-bold border-r border-slate-900 bg-slate-50">Expected participation & Audience:</td>
                <td className="p-3 font-semibold">{permission.expectedAudience}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Standard Disclaimers matching Screenshot 1 */}
        <div className="space-y-2 text-xs font-sans leading-relaxed text-slate-800 pt-2">
          <p>
            Note: The undersigned takes full responsibility for any damage to the institute&apos;s property in the above-mentioned rooms during the specified time.
          </p>
          <p className="font-semibold">
            NOTE: Proper disciplined will be maintained during practices/activity by everyone and secretary/ joint secretary are responsible for it.
          </p>
          <p className="pt-2 font-bold">
            Any financial assistance required? ({permission.financialAssistance || 'No'})
          </p>
        </div>

        {/* Official 5 Signatory Titles matching Screenshot 1 with Signatures Drawn DIRECTLY ABOVE Titles */}
        <div className="pt-12 font-sans space-y-12">
          {/* Top Row: Secretary & CSTS */}
          <div className="grid grid-cols-2 gap-8 items-end">
            {/* Secretary Box */}
            <div className="flex flex-col items-center justify-end text-center min-h-[90px]">
              {secSig && (
                <div className="mb-1 space-y-0.5">
                  {secSig.signatureDataUrl ? (
                    <img src={secSig.signatureDataUrl} alt="Secretary Signature" className="h-10 object-contain mx-auto" />
                  ) : (
                    <span className="font-serif italic font-bold text-blue-900 text-sm">{secSig.signatoryName}</span>
                  )}
                  <p className="text-[9px] font-mono text-emerald-700">✓ {secSig.signatoryName} ({secSig.verificationHash})</p>
                </div>
              )}
              <p className="font-bold text-xs text-slate-900">(Secretary/J. Secretary)</p>
            </div>

            {/* CSTS Box */}
            <div className="flex flex-col items-center justify-end text-center min-h-[90px]">
              {cstsSig && (
                <div className="mb-1 space-y-0.5">
                  {cstsSig.signatureDataUrl ? (
                    <img src={cstsSig.signatureDataUrl} alt="CSTS Signature" className="h-10 object-contain mx-auto" />
                  ) : (
                    <span className="font-serif italic font-bold text-blue-900 text-sm">{cstsSig.signatoryName}</span>
                  )}
                  <p className="text-[9px] font-mono text-emerald-700">✓ {cstsSig.signatoryName} ({cstsSig.verificationHash})</p>
                </div>
              )}
              <p className="font-bold text-xs text-slate-900">(CCS/CSTS)</p>
            </div>
          </div>

          {/* Bottom Row: P/I Security, ADSA, DSA */}
          <div className="grid grid-cols-3 gap-4 items-end pt-4">
            {/* Officer Incharge P/I Box */}
            <div className="flex flex-col items-center justify-end text-center min-h-[90px]">
              {piSig && (
                <div className="mb-1 space-y-0.5">
                  {piSig.signatureDataUrl ? (
                    <img src={piSig.signatureDataUrl} alt="P/I Signature" className="h-10 object-contain mx-auto" />
                  ) : (
                    <span className="font-serif italic font-bold text-blue-900 text-sm">{piSig.signatoryName}</span>
                  )}
                  <p className="text-[9px] font-mono text-emerald-700">✓ {piSig.signatoryName} ({piSig.verificationHash})</p>
                </div>
              )}
              <p className="font-bold text-xs text-slate-900">(Officer Incharge)</p>
            </div>

            {/* ADSA Box */}
            <div className="flex flex-col items-center justify-end text-center min-h-[90px]">
              {adsaSig && (
                <div className="mb-1 space-y-0.5">
                  {adsaSig.signatureDataUrl ? (
                    <img src={adsaSig.signatureDataUrl} alt="ADSA Signature" className="h-10 object-contain mx-auto" />
                  ) : (
                    <span className="font-serif italic font-bold text-blue-900 text-sm">{adsaSig.signatoryName}</span>
                  )}
                  <p className="text-[9px] font-mono text-emerald-700">✓ {adsaSig.signatoryName} ({adsaSig.verificationHash})</p>
                </div>
              )}
              <p className="font-bold text-xs text-slate-900">(ADSA)</p>
            </div>

            {/* DSA Box */}
            <div className="flex flex-col items-center justify-end text-center min-h-[90px]">
              {dsaSig && (
                <div className="mb-1 space-y-0.5">
                  {dsaSig.signatureDataUrl ? (
                    <img src={dsaSig.signatureDataUrl} alt="DSA Signature" className="h-10 object-contain mx-auto" />
                  ) : (
                    <span className="font-serif italic font-bold text-blue-900 text-sm">{dsaSig.signatoryName}</span>
                  )}
                  <p className="text-[9px] font-mono text-emerald-700">✓ {dsaSig.signatoryName} ({dsaSig.verificationHash})</p>
                </div>
              )}
              <p className="font-bold text-xs text-slate-900">(DSA)</p>
            </div>
          </div>
        </div>

        {/* Verification Footer */}
        <div className="pt-8 border-t font-sans flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-2">
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
