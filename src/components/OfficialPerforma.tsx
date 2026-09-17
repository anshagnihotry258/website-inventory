'use client';

import React from 'react';
import Link from 'next/link';
import { PermissionRequest, Role } from '@/lib/types';
import { PEC_LOGO_BASE64, PEC_SEAL_BASE64 } from '@/lib/logos';
import { Printer, ArrowLeft, ShieldCheck } from 'lucide-react';

interface OfficialPerformaProps {
  permission: PermissionRequest;
}

// Helper to format date with day name: DD/MM/YYYY (Dayname)
function formatDateWithDay(dateStr?: string): string {
  if (!dateStr || dateStr === 'N/A') return 'N/A';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      const dayName = d.toLocaleDateString('en-GB', { weekday: 'long' });
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year} (${dayName})`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

// Helper to format 24h time string to 12h AM/PM
function formatTime12h(timeStr?: string): string {
  if (!timeStr || timeStr === 'N/A') return 'N/A';
  try {
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${String(m || 0).padStart(2, '0')} ${period}`;
  } catch {
    return timeStr;
  }
}

// Helper to format exact signature timestamp cleanly
function formatSigTimestamp(isoString?: string): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  } catch {
    return isoString;
  }
}

export default function OfficialPerforma({ permission }: OfficialPerformaProps) {
  const handlePrint = () => {
    window.print();
  };

  // Compute formatted date string
  const formattedDate = permission.isMultiDay && permission.toDate && permission.toDate !== permission.fromDate
    ? `${formatDateWithDay(permission.fromDate)} and ${formatDateWithDay(permission.toDate)}`
    : formatDateWithDay(permission.fromDate);

  // Compute formatted time string
  const formattedTime = permission.isDiffTimePerDay && permission.day2FromTime
    ? `Saturday : ${formatTime12h(permission.fromTime)} - ${formatTime12h(permission.toTime)}\nSunday : ${formatTime12h(permission.day2FromTime)} – ${formatTime12h(permission.day2ToTime)}`
    : `${formatTime12h(permission.fromTime)} - ${formatTime12h(permission.toTime)}`;

  const secSig = permission.signatures['SECCY'];
  const cstsSig = permission.signatures['CSTS'];
  const piSig = permission.signatures['PROF_INCHARGE'];
  const adsaSig = permission.signatures['ADSA'];
  const dsaSig = permission.signatures['DSA'];

  return (
    <div className="space-y-6 max-w-3xl mx-auto font-serif">
      {/* Control Bar (No Print) */}
      <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
        <Link
          href="/approvals"
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-black transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>← Back to Approvals Dashboard</span>
        </Link>

        <div className="flex items-center space-x-3">
          <span className="font-mono text-xs font-bold bg-slate-100 text-black px-3 py-1 rounded-lg border border-slate-300">
            Tracking: {permission.trackingCode}
          </span>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 rounded-xl bg-black px-5 py-2 text-xs font-bold text-white shadow hover:bg-slate-800 transition"
          >
            <Printer className="h-4 w-4 text-amber-400" />
            <span>Print Official Letter / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Official Performa Sheet matching Exact Reference Picture */}
      <div className="bg-white p-8 sm:p-12 shadow-2xl border border-slate-200 text-black space-y-4 printable-sheet">
        {/* Header with PEC Logo and PEC Seal */}
        <div className="flex items-center justify-between gap-3">
          {/* Left: PEC Explore Innovate Excel Logo */}
          <div className="w-20 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PEC_LOGO_BASE64}
              alt="PEC Logo"
              className="h-16 w-auto object-contain mx-auto"
            />
          </div>

          {/* Center: College Name */}
          <div className="text-center font-bold text-black font-serif uppercase tracking-wide leading-tight flex-1">
            <h1 className="text-sm sm:text-base font-extrabold">PUNJAB ENGINEERING COLLEGE (DEEMED TO</h1>
            <h1 className="text-sm sm:text-base font-extrabold">BE UNIVERSITY) CHANDIGARH</h1>
          </div>

          {/* Right: PEC Official Round Seal */}
          <div className="w-20 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PEC_SEAL_BASE64}
              alt="PEC Seal"
              className="h-16 w-auto object-contain mx-auto"
            />
          </div>
        </div>

        {/* Performa Title */}
        <div className="text-center pt-3 pb-1">
          <h2 className="text-xs sm:text-[13px] font-bold text-black underline font-serif">
            Performa for Booking OF Lecture Rooms by Clubs/ Society/NSS/Sports &amp; departments
          </h2>
        </div>

        {/* P/I Security */}
        <div className="text-left font-serif text-xs font-bold text-black underline pb-1">
          P/I Security
        </div>

        {/* Official 8-Row Bordered Table matching Exact Picture Color Scheme */}
        <div className="border-2 border-black font-serif">
          <table className="w-full border-collapse text-xs text-black">
            <tbody>
              <tr className="border-b-2 border-black">
                <td className="p-2 font-bold border-r-2 border-black w-2/5">Name of Club/Society:</td>
                <td className="p-2 font-normal">{permission.societyName}</td>
              </tr>
              <tr className="border-b-2 border-black">
                <td className="p-2 font-bold border-r-2 border-black">Event Name:</td>
                <td className="p-2 font-normal">{permission.eventTitle}</td>
              </tr>
              <tr className="border-b-2 border-black">
                <td className="p-2 font-bold border-r-2 border-black align-top">Brief Event Description:</td>
                <td className="p-2 font-normal leading-relaxed whitespace-pre-wrap">{permission.eventPurpose}</td>
              </tr>
              <tr className="border-b-2 border-black">
                <td className="p-2 font-bold border-r-2 border-black">Date:</td>
                <td className="p-2 font-normal">{formattedDate}</td>
              </tr>
              <tr className="border-b-2 border-black">
                <td className="p-2 font-bold border-r-2 border-black align-top">Time:</td>
                <td className="p-2 font-normal whitespace-pre-wrap leading-relaxed">{formattedTime}</td>
              </tr>
              <tr className="border-b-2 border-black">
                <td className="p-2 font-bold border-r-2 border-black">Room Number:</td>
                <td className="p-2 font-normal">{permission.venueName}</td>
              </tr>
              <tr className="border-b-2 border-black">
                <td className="p-2 font-bold border-r-2 border-black">Department:</td>
                <td className="p-2 font-normal">{permission.department || 'ECE dept (CSRC)'}</td>
              </tr>
              <tr>
                <td className="p-2 font-bold border-r-2 border-black">Expected participation &amp; Audience:</td>
                <td className="p-2 font-normal">{permission.expectedAudience}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Disclaimers & Notes matching Exact Picture */}
        <div className="space-y-2 text-[11px] font-serif leading-relaxed text-black pt-3">
          <p>
            Note: The undersigned takes full responsibility for any damage to the institute&apos;s property in the above-mentioned rooms during the specified time.
          </p>
          <p className="font-semibold">
            NOTE: Proper disciplined will be maintained during practices/activity by everyone and secretary/ joint secretary are responsible for it.
          </p>
          <p className="pt-1">
            Any financial assistance required? ({permission.financialAssistance || 'Yes/No'})
          </p>
        </div>

        {/* 5-Signatory Layout matching Exact Reference Picture */}
        <div className="pt-10 font-serif space-y-12">
          {/* Row 1: (Secretary/J. Secretary) and (CCS/CSTS) */}
          <div className="grid grid-cols-2 gap-8 items-end">
            {/* Secretary Box */}
            <div className="flex flex-col items-center justify-end text-center min-h-[70px]">
              {secSig ? (
                <div className="mb-1 space-y-0.5">
                  {secSig.signatureDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={secSig.signatureDataUrl} alt="Secretary Signature" className="h-10 object-contain mx-auto" />
                  ) : (
                    <span className="font-serif italic font-bold text-black text-sm">{secSig.signatoryName}</span>
                  )}
                  <p className="text-[9px] font-bold text-black font-mono">✓ {secSig.signatoryName}</p>
                  <p className="text-[8px] text-black font-mono">Signed: {formatSigTimestamp(secSig.signedAt)}</p>
                  <p className="text-[7px] text-slate-500 font-mono">Hash: {secSig.verificationHash}</p>
                </div>
              ) : (
                <div className="h-10" />
              )}
              <p className="font-bold text-xs text-black w-full">(Secretary/J. Secretary)</p>
            </div>

            {/* CSTS Box */}
            <div className="flex flex-col items-center justify-end text-center min-h-[70px]">
              {cstsSig ? (
                <div className="mb-1 space-y-0.5">
                  {cstsSig.signatureDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cstsSig.signatureDataUrl} alt="CSTS Signature" className="h-10 object-contain mx-auto" />
                  ) : (
                    <span className="font-serif italic font-bold text-black text-sm">{cstsSig.signatoryName}</span>
                  )}
                  <p className="text-[9px] font-bold text-black font-mono">✓ {cstsSig.signatoryName}</p>
                  <p className="text-[8px] text-black font-mono">Signed: {formatSigTimestamp(cstsSig.signedAt)}</p>
                  <p className="text-[7px] text-slate-500 font-mono">Hash: {cstsSig.verificationHash}</p>
                </div>
              ) : (
                <div className="h-10" />
              )}
              <p className="font-bold text-xs text-black w-full">(CCS/CSTS)</p>
            </div>
          </div>

          {/* Row 2: (Officer Incharge), (ADSA), (DSA) */}
          <div className="grid grid-cols-3 gap-4 items-end pt-2">
            {/* Officer Incharge P/I */}
            <div className="flex flex-col items-center justify-end text-center min-h-[70px]">
              {piSig ? (
                <div className="mb-1 space-y-0.5">
                  {piSig.signatureDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={piSig.signatureDataUrl} alt="P/I Signature" className="h-10 object-contain mx-auto" />
                  ) : (
                    <span className="font-serif italic font-bold text-black text-sm">{piSig.signatoryName}</span>
                  )}
                  <p className="text-[9px] font-bold text-black font-mono">✓ {piSig.signatoryName}</p>
                  <p className="text-[8px] text-black font-mono">Signed: {formatSigTimestamp(piSig.signedAt)}</p>
                  <p className="text-[7px] text-slate-500 font-mono">Hash: {piSig.verificationHash}</p>
                </div>
              ) : (
                <div className="h-10" />
              )}
              <p className="font-bold text-xs text-black w-full">(Officer Incharge)</p>
            </div>

            {/* ADSA Box */}
            <div className="flex flex-col items-center justify-end text-center min-h-[70px]">
              {adsaSig ? (
                <div className="mb-1 space-y-0.5">
                  {adsaSig.signatureDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={adsaSig.signatureDataUrl} alt="ADSA Signature" className="h-10 object-contain mx-auto" />
                  ) : (
                    <span className="font-serif italic font-bold text-black text-sm">{adsaSig.signatoryName}</span>
                  )}
                  <p className="text-[9px] font-bold text-black font-mono">✓ {adsaSig.signatoryName}</p>
                  <p className="text-[8px] text-black font-mono">Signed: {formatSigTimestamp(adsaSig.signedAt)}</p>
                  <p className="text-[7px] text-slate-500 font-mono">Hash: {adsaSig.verificationHash}</p>
                </div>
              ) : (
                <div className="h-10" />
              )}
              <p className="font-bold text-xs text-black w-full">(ADSA)</p>
            </div>

            {/* DSA Box */}
            <div className="flex flex-col items-center justify-end text-center min-h-[70px]">
              {dsaSig ? (
                <div className="mb-1 space-y-0.5">
                  {dsaSig.signatureDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={dsaSig.signatureDataUrl} alt="DSA Signature" className="h-10 object-contain mx-auto" />
                  ) : (
                    <span className="font-serif italic font-bold text-black text-sm">{dsaSig.signatoryName}</span>
                  )}
                  <p className="text-[9px] font-bold text-black font-mono">✓ {dsaSig.signatoryName}</p>
                  <p className="text-[8px] text-black font-mono">Signed: {formatSigTimestamp(dsaSig.signedAt)}</p>
                  <p className="text-[7px] text-slate-500 font-mono">Hash: {dsaSig.verificationHash}</p>
                </div>
              ) : (
                <div className="h-10" />
              )}
              <p className="font-bold text-xs text-black w-full">(DSA)</p>
            </div>
          </div>
        </div>

        {/* Bottom verification badge */}
        <div className="pt-6 border-t font-sans flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-2">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="h-4 w-4 text-black" />
            <span>Official PEC Digital Permission Performa</span>
          </div>
          <p className="font-mono text-[9px]">ID: {permission.id}</p>
        </div>
      </div>
    </div>
  );
}
