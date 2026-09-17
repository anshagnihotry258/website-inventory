'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Send, 
  Eye,
  ShieldCheck,
  Sparkles,
  Wand2,
  ArrowLeft
} from 'lucide-react';

export default function DocifyPage() {
  const router = useRouter();
  const [currentUser, setUserState] = useState<UserAccount | null>(null);

  // Form State
  const [societyName, setSocietyName] = useState('IEEE Student Branch');
  const [applicantName, setApplicantName] = useState('');
  const [applicantRoll, setApplicantRoll] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');

  const [subject, setSubject] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventPurpose, setEventPurpose] = useState('');
  
  const [selectedVenueId, setSelectedVenueId] = useState<string>('L20');
  const [fromDate, setFromDate] = useState('2026-09-30');
  const [toDate, setToDate] = useState('2026-09-30');
  const [fromTime, setFromTime] = useState('10:00');
  const [toTime, setToTime] = useState('12:00');

  const [expectedAudience, setExpectedAudience] = useState(120);
  const [equipmentInput, setEquipmentInput] = useState('');

  // Conflict state
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

  // Real-time conflict check
  useEffect(() => {
    if (selectedVenueId && fromDate && fromTime && toTime) {
      const result = checkVenueConflict(selectedVenueId, fromDate, toDate || fromDate, fromTime, toTime);
      setConflict(result);
    }
  }, [selectedVenueId, fromDate, toDate, fromTime, toTime]);

  // Button 1 Auto-Fill: Sample 1 (L20 - Hackathon)
  const handleAutoFillSample1 = () => {
    const randNum = Math.floor(10 + Math.random() * 89);
    setSocietyName(currentUser?.societyName || 'IEEE Student Branch');
    setApplicantName('Ansh Agnihotry');
    setApplicantRoll('21103045');
    setApplicantPhone('+91 9876543210');
    setApplicantEmail('ieee@pec.edu.in');
    setSubject('Permission for Annual Technical Hackathon & Coding Sprint');
    setEventTitle(`HackPEC 2026 (Sprint #${randNum})`);
    setEventPurpose('Annual flagship coding competition and project showcase for students.');
    setSelectedVenueId('L20');
    setFromDate('2026-09-30');
    setToDate('2026-09-30');
    setFromTime('10:00');
    setToTime('12:00');
    setExpectedAudience(120);
    setEquipmentInput('Projector, AC, Microphones (2), Power Sockets');
  };

  // Button 2 Auto-Fill: Sample 2 (L21 - Robotics Workshop)
  const handleAutoFillSample2 = () => {
    const randNum = Math.floor(10 + Math.random() * 89);
    setSocietyName('PEC Robotics Society');
    setApplicantName('Kabir Verma');
    setApplicantRoll('21102019');
    setApplicantPhone('+91 9988776655');
    setApplicantEmail('robotics@pec.edu.in');
    setSubject('Request for Venue Permission for Autonomous Bot Hands-on Workshop');
    setEventTitle(`RoboWars & Circuit Building #${randNum}`);
    setEventPurpose('Practical hands-on training session on microcontrollers and chassis assembly.');
    setSelectedVenueId('L21');
    setFromDate('2026-10-02');
    setToDate('2026-10-02');
    setFromTime('14:00');
    setToTime('17:00');
    setExpectedAudience(90);
    setEquipmentInput('Projector, Extra Power Boards, Soldering Kits');
  };

  const selectedVenueObj = VENUES.find(v => v.id === selectedVenueId) || VENUES[0];

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
      applicantName: applicantName || 'Student Applicant',
      applicantRoll: applicantRoll || '21100000',
      applicantPhone: applicantPhone || '+91 9999999999',
      applicantEmail: applicantEmail || 'society@pec.edu.in',
      subject: subject || 'Permission Request for Venue Booking',
      eventTitle: eventTitle || 'Society Technical Event',
      eventPurpose: eventPurpose || 'Technical session and student development workshop',
      venueId: selectedVenueObj.id,
      venueName: selectedVenueObj.name,
      fromDate,
      toDate: toDate || fromDate,
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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back Button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <Link
            href="/approvals"
            className="inline-flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>← Back to Approvals Dashboard</span>
          </Link>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Book a venue</h1>
          <p className="text-xs text-slate-500 font-sans">
            Times are free-form — any hour of the day, including early morning and late night, may be requested.
          </p>
        </div>

        {/* 2 Separate Auto-Fill Dummy Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleAutoFillSample1}
            className="rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-extrabold text-blue-950 shadow hover:bg-amber-400 transition flex items-center space-x-1.5 border border-amber-300"
          >
            <Wand2 className="h-3.5 w-3.5 text-blue-950" />
            <span>✨ Auto-Fill Sample 1 (L20)</span>
          </button>

          <button
            type="button"
            onClick={handleAutoFillSample2}
            className="rounded-xl bg-blue-900 px-3.5 py-2 text-xs font-extrabold text-amber-300 shadow hover:bg-blue-950 transition flex items-center space-x-1.5 border border-blue-700"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>✨ Auto-Fill Sample 2 (L21)</span>
          </button>
        </div>
      </div>

      {submitSuccess ? (
        <div className="rounded-2xl border bg-white p-8 shadow-xl text-center space-y-4 max-w-2xl mx-auto">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Booking Request Created!</h2>
          <p className="text-sm text-slate-600">
            Tracking Code: <strong className="font-mono text-blue-900 bg-blue-50 px-2 py-1 rounded">{submitSuccess.trackingCode}</strong>
          </p>
          <p className="text-xs text-slate-500">
            Your booking request for <strong>{submitSuccess.venueName}</strong> has been submitted to the approval pipeline starting with <strong>1. Shashvat (Seccy)</strong>.
          </p>
          
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link
              href={`/document?id=${submitSuccess.id}`}
              className="rounded-xl bg-[#003366] px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-900 transition flex items-center space-x-1.5"
            >
              <Eye className="h-4 w-4 text-amber-400" />
              <span>View Permission Letter</span>
            </Link>
            <Link
              href="/approvals"
              className="rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-extrabold text-blue-950 shadow hover:bg-amber-400 transition"
            >
              View Application Status & Approvals
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="font-bold text-slate-900 text-base">Booking request</h2>
            <span className="text-xs font-semibold text-slate-500">Applying as: <strong>{societyName}</strong></span>
          </div>

          {/* Conflict Banner */}
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
                Please select another venue or time slot below to prevent double booking.
              </p>
            </div>
          )}

          {submitError && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 font-bold">
              {submitError}
            </div>
          )}

          {/* Purpose of Booking */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">Purpose of booking</label>
            <input
              type="text"
              value={eventPurpose}
              onChange={(e) => setEventPurpose(e.target.value)}
              placeholder="Enter the exact purpose for which the room is required"
              className="w-full rounded-lg border border-slate-300 p-3 text-xs focus:border-slate-500 focus:outline-none placeholder:text-slate-400"
              required
            />
          </div>

          {/* Subject & Event Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Official Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Permission Request Subject"
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Event Title</label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Title of Event"
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Applicant Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Applicant Student Name</label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="Student Name"
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Roll Number</label>
              <input
                type="text"
                value={applicantRoll}
                onChange={(e) => setApplicantRoll(e.target.value)}
                placeholder="Roll No"
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Phone Number</label>
              <input
                type="text"
                value={applicantPhone}
                onChange={(e) => setApplicantPhone(e.target.value)}
                placeholder="+91 Phone"
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Date Range Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Start date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-medium focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">End date (optional)</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-medium focus:outline-none"
              />
            </div>
          </div>

          {/* Time Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Start time</label>
              <input
                type="time"
                value={fromTime}
                onChange={(e) => setFromTime(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-medium focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">End time</label>
              <input
                type="time"
                value={toTime}
                onChange={(e) => setToTime(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-medium focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Venue Pills */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">Venue(s)</label>
              <span className="text-[11px] font-bold text-slate-500 font-mono">
                1 selected ({selectedVenueObj.name})
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <p className="text-[10px] font-bold uppercase text-slate-400">Lecture Halls & Tutorial Rooms</p>
              
              <div className="flex flex-wrap gap-2">
                {VENUES.map((v) => {
                  const isSelected = selectedVenueId === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVenueId(v.id)}
                      className={`min-w-[50px] px-3.5 py-2 rounded-lg text-xs font-bold transition shadow-sm border ${
                        isSelected
                          ? 'bg-[#003366] text-white border-[#003366] ring-2 ring-blue-300 scale-105'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {v.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Equipment Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">Equipment Needed (Comma Separated)</label>
            <input
              type="text"
              value={equipmentInput}
              onChange={(e) => setEquipmentInput(e.target.value)}
              placeholder="Projector, Microphones, Power Sockets"
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={conflict.conflict}
            className={`w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-lg transition flex items-center justify-center space-x-2 ${
              conflict.conflict
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-[#003366] hover:bg-blue-900'
            }`}
          >
            <Send className="h-4 w-4 text-amber-400" />
            <span>Submit Booking Request for Approval</span>
          </button>
        </form>
      )}
    </div>
  );
}
