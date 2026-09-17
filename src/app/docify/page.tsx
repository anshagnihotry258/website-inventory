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
  Send, 
  Eye,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function DocifyPage() {
  const router = useRouter();
  const [currentUser, setUserState] = useState<UserAccount | null>(null);

  // Form State matching screenshot
  const [societyName, setSocietyName] = useState('IEEE Student Branch');
  const [applicantName, setApplicantName] = useState('Ansh Agnihotry');
  const [applicantRoll, setApplicantRoll] = useState('21103045');
  const [applicantPhone, setApplicantPhone] = useState('+91 9876543210');
  const [applicantEmail, setApplicantEmail] = useState('ieee@pec.edu.in');

  const [subject, setSubject] = useState('Request for Venue Permission for Technical Workshop');
  const [eventTitle, setEventTitle] = useState('AI & Robotics Innovation Hackathon');
  const [eventPurpose, setEventPurpose] = useState('Enter the exact purpose for which the room is required');
  
  const [selectedVenueId, setSelectedVenueId] = useState<string>('L20');
  const [fromDate, setFromDate] = useState('2026-09-18');
  const [toDate, setToDate] = useState('2026-09-18');
  const [fromTime, setFromTime] = useState('10:00');
  const [toTime, setToTime] = useState('12:00');

  const [expectedAudience, setExpectedAudience] = useState(120);
  const [equipmentInput, setEquipmentInput] = useState('Projector, AC, Microphones (2)');

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
      {/* Page Heading Matching Screenshot */}
      <div className="space-y-1 border-b pb-4">
        <h1 className="text-3xl font-serif font-bold text-slate-900">Book a venue</h1>
        <p className="text-xs text-slate-500 font-sans">
          Times are free-form — any hour of the day, including early morning and late night, may be requested.
        </p>
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
          
          <div className="pt-4 flex justify-center space-x-3">
            <button
              onClick={() => router.push(`/document/${submitSuccess.id}`)}
              className="rounded-xl bg-[#003366] px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-900 transition flex items-center space-x-1.5"
            >
              <Eye className="h-4 w-4 text-amber-400" />
              <span>View Permission Letter</span>
            </button>
            <button
              onClick={() => router.push('/approvals')}
              className="rounded-xl bg-slate-100 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
            >
              View Application Status
            </button>
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

          {/* Event Title & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Event Title</label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Applicant Lead Name & Roll</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="Applicant Name"
                  className="rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                  required
                />
                <input
                  type="text"
                  value={applicantRoll}
                  onChange={(e) => setApplicantRoll(e.target.value)}
                  placeholder="Roll No"
                  className="rounded-lg border border-slate-300 p-2.5 text-xs focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Date Range Inputs Matching Screenshot */}
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

          {/* Time Inputs Matching Screenshot */}
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

          {/* Venue(s) Pill Buttons Selection EXACTLY matching user's uploaded screenshot */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">Venue(s)</label>
              <span className="text-[11px] font-bold text-slate-500 font-mono">
                1 selected ({selectedVenueObj.name})
              </span>
            </div>

            {/* Pill Buttons Container */}
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
