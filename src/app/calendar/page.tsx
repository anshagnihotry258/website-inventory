'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { VENUES, getPermissions } from '@/lib/db';
import { PermissionRequest, Venue } from '@/lib/types';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Clock, 
  Building2, 
  Lock, 
  CheckCircle2, 
  Info,
  ShieldCheck,
  Plus
} from 'lucide-react';

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState('2026-09-25');
  const [selectedBuildingFilter, setSelectedBuildingFilter] = useState<string>('ALL');
  const [permissions, setPermissions] = useState<PermissionRequest[]>([]);
  const [selectedEventModal, setSelectedEventModal] = useState<PermissionRequest | null>(null);

  useEffect(() => {
    setPermissions(getPermissions());
  }, []);

  const changeDate = (days: number) => {
    const curr = new Date(selectedDate);
    curr.setDate(curr.getDate() + days);
    setSelectedDate(curr.toISOString().split('T')[0]);
  };

  const filteredVenues = VENUES.filter(v => {
    if (selectedBuildingFilter === 'ALL') return true;
    return v.type === selectedBuildingFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded bg-emerald-600 text-white font-extrabold text-[10px] px-2 py-0.5 uppercase">
              Central Campus Calendar
            </span>
            <h1 className="text-2xl font-bold text-slate-900">PEC Venue Inventory Schedule</h1>
          </div>
          <p className="text-xs text-slate-500">
            Real-time campus venue availability grid. Approved permissions lock slots so double bookings cannot occur.
          </p>
        </div>

        <Link
          href="/docify"
          className="rounded-xl bg-[#003366] px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-900 transition flex items-center space-x-1.5"
        >
          <Plus className="h-4 w-4 text-amber-400" />
          <span>Book Venue (Docify Form)</span>
        </Link>
      </div>

      {/* Date Controls & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border bg-white p-4 shadow-sm">
        {/* Date Selector */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => changeDate(-1)}
            className="rounded-lg border p-2 text-slate-600 hover:bg-slate-100 transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-[#003366]" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border border-slate-300 p-2 text-sm font-bold text-slate-900 focus:outline-none"
            />
          </div>

          <button
            onClick={() => changeDate(1)}
            className="rounded-lg border p-2 text-slate-600 hover:bg-slate-100 transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => setSelectedDate('2026-09-25')}
            className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
          >
            Go to Sep 25 (Symposium)
          </button>
        </div>

        {/* Venue Filter Tabs */}
        <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          {[
            { id: 'ALL', label: 'All Venues' },
            { id: 'Lecture Hall', label: 'Lecture Halls (L1-L31)' },
            { id: 'Tutorial Room', label: 'Tutorial Rooms (T1-T8)' },
            { id: 'Auditorium', label: 'Main Auditorium' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedBuildingFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedBuildingFilter === tab.id
                  ? 'bg-white text-blue-950 font-bold shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Schedule Grid */}
      <div className="rounded-2xl border bg-white shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-[#003366] text-white">
                <th className="p-3 font-bold border-r border-blue-900 min-w-[160px] sticky left-0 bg-[#003366] z-10">
                  Venue / Room
                </th>
                {TIME_SLOTS.map((time) => (
                  <th key={time} className="p-2 font-mono text-center border-r border-blue-900 min-w-[90px]">
                    {time}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredVenues.map((venue) => {
                // Find bookings for this venue on selectedDate
                const dayBookings = permissions.filter(p => {
                  if (p.venueId !== venue.id || p.status === 'REJECTED') return false;
                  // check if selectedDate falls within fromDate -> toDate
                  return selectedDate >= p.fromDate && selectedDate <= p.toDate;
                });

                return (
                  <tr key={venue.id} className="hover:bg-slate-50/80 transition">
                    {/* Room Info Sticky Column */}
                    <td className="p-3 font-bold border-r bg-slate-50 sticky left-0 z-10 border-b">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-[#003366]" />
                        <div>
                          <span className="text-slate-900 font-bold">{venue.name}</span>
                          <span className="block text-[10px] text-slate-400 font-normal">
                            Cap: {venue.capacity} • {venue.building}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Time Slot Cells */}
                    {TIME_SLOTS.map((timeStr) => {
                      const hourNum = parseInt(timeStr.split(':')[0], 10);
                      
                      // Check if any booking covers this hour
                      const booking = dayBookings.find(p => {
                        const startHour = parseInt(p.fromTime.split(':')[0], 10);
                        const endHour = parseInt(p.toTime.split(':')[0], 10);
                        return hourNum >= startHour && hourNum < endHour;
                      });

                      return (
                        <td key={timeStr} className="p-1 border-r text-center align-middle h-16">
                          {booking ? (
                            <button
                              onClick={() => setSelectedEventModal(booking)}
                              className={`w-full h-full rounded-lg p-1 text-left flex flex-col justify-between shadow-sm transition transform hover:scale-[1.02] ${
                                booking.status === 'APPROVED'
                                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                                  : 'bg-amber-500 text-blue-950 font-bold'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-[10px] truncate max-w-[70px]">
                                  {booking.societyName}
                                </span>
                                <Lock className="h-3 w-3 opacity-80" />
                              </div>
                              <span className="text-[9px] font-semibold truncate block">
                                {booking.eventTitle}
                              </span>
                              <span className="text-[8px] opacity-80 font-mono">
                                {booking.status === 'APPROVED' ? 'LOCKED ✓' : 'PENDING'}
                              </span>
                            </button>
                          ) : (
                            <div className="h-full w-full rounded flex items-center justify-center text-[10px] text-slate-300 font-mono hover:bg-slate-100 hover:text-slate-500 transition cursor-pointer">
                              Free
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="bg-[#003366] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-base">{selectedEventModal.eventTitle}</h3>
                  <p className="text-xs text-blue-200">Tracking Code: {selectedEventModal.trackingCode}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEventModal(null)}
                className="rounded-full p-1 hover:bg-white/10 text-white/80"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border">
                <div>
                  <span className="text-slate-400 block text-[10px]">HOLDING ORGANIZATION</span>
                  <strong className="text-blue-950 font-bold text-sm">{selectedEventModal.societyName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">BOOKED VENUE</span>
                  <strong className="text-blue-950 font-bold text-sm">{selectedEventModal.venueName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">TIMING</span>
                  <strong>{selectedEventModal.fromDate} ({selectedEventModal.fromTime} - {selectedEventModal.toTime})</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">APPROVAL STATUS</span>
                  <strong className="text-emerald-700">{selectedEventModal.status}</strong>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">Event Purpose</span>
                <p className="p-2.5 rounded-lg bg-slate-50 border text-slate-600">{selectedEventModal.eventPurpose}</p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">Applicant Contact</span>
                <p>{selectedEventModal.applicantName} ({selectedEventModal.applicantRoll}) • {selectedEventModal.applicantPhone}</p>
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t">
                <Link
                  href={`/document/${selectedEventModal.id}`}
                  className="rounded-lg bg-[#003366] px-4 py-2 text-xs font-bold text-white hover:bg-blue-900"
                >
                  View Full Signed Letter
                </Link>
                <button
                  onClick={() => setSelectedEventModal(null)}
                  className="rounded-lg border px-4 py-2 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
