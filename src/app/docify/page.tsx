'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { VENUES, checkVenueConflict, createPermissionRequest } from '@/lib/db';
import { UserAccount, PermissionRequest } from '@/lib/types';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  Clock, 
  Building2, 
  User, 
  Send, 
  Sparkles,
  Eye,
  ShieldCheck
} from 'lucide-react';

export default function DocifyPage() {
  const router = useRouter();
  const [currentUser, setUserState] = useState<UserAccount | null>(null);

  // Form State
  const [societyName, setSocietyName] = useState('IEEE Student Branch');
  const [applicantName, setApplicantName] = useState('Ansh Agnihotry');
  const [applicantRoll, setApplicantRoll] = useState('21103045');
  const [applicantPhone, setApplicantPhone] = useState('+91 9876543210');
  const [applicantEmail, setApplicantEmail] = useState('ieee@pec.edu.in');

  const [subject, setSubject] = useState('Request for Venue Permission for Technical Workshop');
  const [eventTitle, setEventTitle] = useState('AI & Robotics Innovation Hackathon');
  const [eventPurpose, setEventPurpose] = useState('Hands-on technical development session and student project demonstration.');
  
  const [venueId, setVenueId] = useState('L1');
  const [fromDate, setFromDate] = useState('2026-09-30');
  const [toDate, setToDate] = useState('2026-09-30');
  const [fromTime, setFromTime] = useState('10:00');
  const [toTime, setToTime] = useState('14:00');

  const [expectedAudience, setExpectedAudience] = useState(120);
  const [equipmentInput, setEquipmentInput] = useState('Projector, AC, Microphones (2)');

  // Validation / Conflict state
  const [conflict, setConflict] = useState<{ conflict: boolean; conflictingPermission?: PermissionRequest }>({ conflict: false });
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState<PermissionRequest | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    setUserState(user);
    if (user && user.role === 'SOCIETY') {
      setSocietyName(user.societyName || user.name);
    }
  }, []);

  // Real-time conflict check whenever venue, date, or time changes!
  useEffect(() => {
    if (venueId && fromDate && toDate && fromTime && toTime) {
      const result = checkVenueConflict(venueId, fromDate, toDate, fromTime, toTime);
      setConflict(result);
    }
  }, [venueId, fromDate, toDate, fromTime, toTime]);

  const selectedVenueObj = VENUES.find(v => v.id === venueId) || VENUES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (conflict.conflict && conflict.conflictingPermission) {
      setSubmitError(`Double Booking Error: ${selectedVenueObj.name} is already locked/booked by ${conflict.conflictingPermission.societyName} on ${conflict.conflictingPermission.fromDate} (${conflict.conflictingPermission.fromTime} - ${conflict.conflictingPermission.toTime}). Please choose another venue or time.`);
      return;
    }

    const equipmentList = equipmentInput.split(',').map(s => s.trim()).filter(Boolean);

    const result = createPermissionRequest({
      societyName,
      applicantName,
      applicantRoll,
      applicantPhone,
      applicantEmail,
      subject,
      eventTitle,
      eventPurpose,
      venueId: selectedVenueObj.id,
      venueName: selectedVenueObj.name,
      fromDate,
      toDate,
      fromTime,
      toTime,
      expectedAudience: Number(expectedAudience),
      equipmentNeeded: equipmentList
    });

    if (!result.success || !result.request) {
      setSubmitError(result.error || 'Failed to generate permission request');
    } else {
      setSubmitSuccess(result.request);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded bg-amber-500 text-blue-950 font-extrabold text-[10px] px-2 py-0.5 uppercase">
              Docify Generator
            </span>
            <h1 className="text-2xl font-bold text-slate-900">Room Permission Software</h1>
          </div>
          <p className="text-xs text-slate-500">
            Generate official PEC permission letters and send into the 5-stage sequential approval workflow.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-600 bg-white p-2.5 rounded-xl border shadow-sm">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <div>
            <span className="font-bold text-slate-900 block">Logged in as: {societyName}</span>
            <span className="text-[10px] text-slate-400">Can generate and submit permission forms</span>
          </div>
        </div>
      </div>

      {submitSuccess ? (
        <div className="rounded-2xl border bg-white p-8 shadow-xl text-center space-y-4 max-w-2xl mx-auto">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Permission Generated & Submitted!</h2>
          <p className="text-sm text-slate-600">
            Tracking Code: <strong className="font-mono text-blue-900 bg-blue-50 px-2 py-1 rounded">{submitSuccess.trackingCode}</strong>
          </p>
          <p className="text-xs text-slate-500">
            Your permission document has been generated via Docify and forwarded to <strong>1. Secretary (Seccy)</strong> for initial digital signature verification.
          </p>
          
          <div className="pt-4 flex justify-center space-x-3">
            <button
              onClick={() => router.push(`/document/${submitSuccess.id}`)}
              className="rounded-xl bg-[#003366] px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-900 transition flex items-center space-x-1.5"
            >
              <Eye className="h-4 w-4 text-amber-400" />
              <span>View Generated Letter</span>
            </button>
            <button
              onClick={() => router.push('/approvals')}
              className="rounded-xl bg-slate-100 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
            >
              Go to Approval Workflow
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6 shadow-xl space-y-6">
              <h2 className="font-bold text-slate-900 text-base flex items-center space-x-2 border-b pb-3">
                <FileText className="h-5 w-5 text-[#003366]" />
                <span>Permission Letter Details</span>
              </h2>

              {/* Conflict / Error Banner */}
              {conflict.conflict && (
                <div className="rounded-xl bg-red-50 border-2 border-red-300 p-4 text-xs text-red-800 space-y-1 animate-pulse">
                  <div className="flex items-center space-x-2 font-bold text-red-900 text-sm">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span>DOUBLE BOOKING CONFLICT DETECTED!</span>
                  </div>
                  <p>
                    <strong>{selectedVenueObj.name}</strong> is already booked/requested by{' '}
                    <strong>{conflict.conflictingPermission?.societyName}</strong> for{' '}
                    <strong>{conflict.conflictingPermission?.fromDate} ({conflict.conflictingPermission?.fromTime} - {conflict.conflictingPermission?.toTime})</strong>.
                  </p>
                  <p className="text-[11px] text-red-700 italic">
                    Please select a different venue, date, or time slot to prevent double-booking conflicts.
                  </p>
                </div>
              )}

              {submitError && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 font-bold">
                  {submitError}
                </div>
              )}

              {/* Subject & Purpose */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Official Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full mt-1 rounded-xl border border-slate-300 p-2.5 text-xs font-semibold focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Event Title</label>
                    <input
                      type="text"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="w-full mt-1 rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Society / Club Name</label>
                    <input
                      type="text"
                      value={societyName}
                      onChange={(e) => setSocietyName(e.target.value)}
                      className="w-full mt-1 rounded-xl border border-slate-300 p-2.5 text-xs font-semibold bg-slate-50 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Event Purpose & Agenda Description</label>
                  <textarea
                    value={eventPurpose}
                    onChange={(e) => setEventPurpose(e.target.value)}
                    rows={2}
                    className="w-full mt-1 rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Venue & Date Selection */}
              <div className="space-y-3 border-t pt-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Venue & Schedule Selection</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Select Room / Venue</label>
                    <select
                      value={venueId}
                      onChange={(e) => setVenueId(e.target.value)}
                      className="w-full mt-1 rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-blue-950 focus:border-blue-500 focus:outline-none"
                    >
                      {VENUES.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.type}, Cap: {v.capacity})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Expected Audience</label>
                    <input
                      type="number"
                      value={expectedAudience}
                      onChange={(e) => setExpectedAudience(Number(e.target.value))}
                      className="w-full mt-1 rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700">From Date</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full mt-1 rounded-xl border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">To Date</label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full mt-1 rounded-xl border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Start Time</label>
                    <input
                      type="time"
                      value={fromTime}
                      onChange={(e) => setFromTime(e.target.value)}
                      className="w-full mt-1 rounded-xl border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">End Time</label>
                    <input
                      type="time"
                      value={toTime}
                      onChange={(e) => setToTime(e.target.value)}
                      className="w-full mt-1 rounded-xl border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Applicant Info */}
              <div className="space-y-3 border-t pt-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Applicant Student Lead Info</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Applicant Name</label>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full mt-1 rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Roll Number</label>
                    <input
                      type="text"
                      value={applicantRoll}
                      onChange={(e) => setApplicantRoll(e.target.value)}
                      className="w-full mt-1 rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Phone Number</label>
                    <input
                      type="text"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full mt-1 rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Required Equipment (Comma Separated)</label>
                  <input
                    type="text"
                    value={equipmentInput}
                    onChange={(e) => setEquipmentInput(e.target.value)}
                    placeholder="Projector, Microphones, Extra Chairs"
                    className="w-full mt-1 rounded-xl border border-slate-300 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={conflict.conflict}
                className={`w-full rounded-xl py-3.5 text-sm font-extrabold text-white shadow-lg transition flex items-center justify-center space-x-2 ${
                  conflict.conflict
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-[#003366] hover:bg-blue-900'
                }`}
              >
                <Send className="h-4 w-4 text-amber-400" />
                <span>Generate Docify Permission & Submit for Approval</span>
              </button>
            </form>
          </div>

          {/* Live Preview Side */}
          <div className="lg:col-span-5 space-y-4">
            <div className="sticky top-20 rounded-2xl border bg-white p-6 shadow-xl space-y-4 font-serif text-slate-900 border-t-8 border-t-[#003366]">
              <div className="flex items-center justify-between border-b pb-3 font-sans">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>Docify Real-time Letter Preview</span>
                </span>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  PEC Official Format
                </span>
              </div>

              {/* Official Letter Head Preview */}
              <div className="text-center space-y-1">
                <h3 className="font-extrabold text-sm uppercase tracking-wide">PUNJAB ENGINEERING COLLEGE</h3>
                <p className="text-[11px] text-slate-600 font-sans">Office of Dean Student Affairs, Chandigarh</p>
                <div className="h-0.5 bg-blue-900 w-full my-2"></div>
              </div>

              <div className="text-xs space-y-2 leading-relaxed">
                <p><strong>To,</strong><br />Dean Student Affairs,<br />Punjab Engineering College, Chandigarh.</p>

                <p className="pt-2"><strong>Subject:</strong> {subject}</p>

                <p className="pt-2"><strong>Respected Sir,</strong></p>

                <p className="text-[11px] text-justify font-sans">
                  We, <strong>{societyName}</strong>, request permission to book <strong>{selectedVenueObj.name}</strong> for conducting <strong>&quot;{eventTitle}&quot;</strong> on <strong>{fromDate}</strong> from <strong>{fromTime} to {toTime}</strong>.
                </p>

                <div className="rounded border bg-slate-50 p-2 font-sans text-[10px] space-y-1">
                  <p>• <strong>Expected Attendees:</strong> {expectedAudience}</p>
                  <p>• <strong>Applicant:</strong> {applicantName} ({applicantRoll})</p>
                  <p>• <strong>Equipment:</strong> {equipmentInput || 'None'}</p>
                </div>
              </div>

              {/* 5-Tier Signatory Boxes Preview */}
              <div className="pt-4 border-t font-sans">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Required Approval Signatures Chain:</p>
                
                <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-600">
                  <div className="border p-1.5 rounded bg-slate-50">
                    <p className="font-bold">1. Secretary (Seccy)</p>
                    <p className="italic text-slate-400">Name & Signature</p>
                  </div>
                  <div className="border p-1.5 rounded bg-slate-50">
                    <p className="font-bold">2. Prof. In-Charge (P/I)</p>
                    <p className="italic text-slate-400">Signature of P/I</p>
                  </div>
                  <div className="border p-1.5 rounded bg-slate-50">
                    <p className="font-bold">3. CSTS / JCSTS</p>
                    <p className="italic text-slate-400">CCS / CSTS</p>
                  </div>
                  <div className="border p-1.5 rounded bg-slate-50">
                    <p className="font-bold">4. ADSA</p>
                    <p className="italic text-slate-400">ADSA</p>
                  </div>
                </div>

                <div className="mt-2 border p-2 rounded bg-amber-50/50 border-amber-200 text-[10px]">
                  <p className="font-bold text-amber-900">5. Dean Student Affairs (DSA)</p>
                  <p className="italic text-amber-700">Final Sanctioning Authority & Room Locking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
