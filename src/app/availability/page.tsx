'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { VENUES, checkVenueConflict, getPermissions } from '@/lib/db';
import { Venue, PermissionRequest } from '@/lib/types';
import { Clock, Calendar, CheckCircle2, AlertTriangle, ArrowRight, Building2 } from 'lucide-react';

export default function AvailabilityPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('2026-09-18');
  const [fromTime, setFromTime] = useState('10:00');
  const [toTime, setToTime] = useState('12:00');
  const [permissions, setPermissions] = useState<PermissionRequest[]>([]);

  useEffect(() => {
    setPermissions(getPermissions());
  }, []);

  const handleBookRoom = (venueId: string) => {
    router.push(`/docify?venue=${venueId}&date=${selectedDate}&from=${fromTime}&to=${toTime}`);
  };

  // Calculate free venues
  const venueStatuses = VENUES.map((v) => {
    const conflict = checkVenueConflict(v.id, selectedDate, selectedDate, fromTime, toTime);
    return {
      venue: v,
      isFree: !conflict.conflict,
      conflictingPermission: conflict.conflictingPermission
    };
  });

  const freeCount = venueStatuses.filter(v => v.isFree).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Heading matching Screenshot 3 */}
      <div className="space-y-1 border-b pb-4">
        <h1 className="text-3xl font-serif font-bold text-slate-900">Venue availability</h1>
        <p className="text-xs text-slate-500 font-sans">
          Pick a date and a time slot to see every venue that is free right now.
        </p>
      </div>

      {/* Date & Time Picker Controls Box matching Screenshot 3 */}
      <div className="rounded-2xl border bg-white p-6 shadow-md space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">From</label>
            <input
              type="time"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">To</label>
            <input
              type="time"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Status Summary & Venue Grid matching Screenshot 3 */}
      <div className="rounded-2xl border bg-white p-6 shadow-xl space-y-6">
        <div className="border-b pb-3 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm">
            {fromTime} – {toTime} • {freeCount} of {VENUES.length} venues free
          </h2>
          <span className="text-xs text-slate-400 font-mono">Date: {selectedDate}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {venueStatuses.map(({ venue, isFree, conflictingPermission }) => (
            <div
              key={venue.id}
              className={`group relative rounded-xl border p-4 shadow-sm transition space-y-2 ${
                isFree
                  ? 'bg-slate-50 hover:bg-amber-50/60 border-slate-200 hover:border-amber-300'
                  : 'bg-red-50/60 border-red-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{venue.name}</h3>
                  <p className="text-[11px] text-slate-500">{venue.type} {venue.capacity ? `• Cap: ${venue.capacity}` : ''}</p>
                </div>

                <span className={`rounded-lg px-2.5 py-1 text-[11px] font-bold flex items-center space-x-1 ${
                  isFree ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isFree ? '✓ Free' : 'Locked'}
                </span>
              </div>

              <div className="text-[10px] text-slate-400 font-mono pt-1">
                {isFree ? (
                  'No bookings on this date & time.'
                ) : (
                  <span className="text-red-700 font-bold">
                    Booked by {conflictingPermission?.societyName} ({conflictingPermission?.fromTime} - {conflictingPermission?.toTime})
                  </span>
                )}
              </div>

              {/* Hover Button matching user request */}
              {isFree && (
                <div className="pt-2 opacity-90 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleBookRoom(venue.id)}
                    className="w-full rounded-lg bg-[#990000] py-2 px-3 text-xs font-bold text-white shadow hover:bg-red-900 transition flex items-center justify-center space-x-1"
                  >
                    <span>Get Permission for {venue.name} ({fromTime}–{toTime})</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
