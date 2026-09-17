import { PermissionRequest, Venue, PermissionStatus, Role, ApprovalStageNumber, SignatureRecord } from './types';

export const VENUES: Venue[] = [
  // Lecture Halls (L20 - L31 from screenshot)
  { id: 'L20', name: 'L20', type: 'Lecture Hall', capacity: 120, building: 'Academic Block', facilities: ['Projector', 'AC'] },
  { id: 'L21', name: 'L21', type: 'Lecture Hall', capacity: 120, building: 'Academic Block', facilities: ['Projector', 'AC'] },
  { id: 'L22', name: 'L22', type: 'Lecture Hall', capacity: 120, building: 'Academic Block', facilities: ['Projector', 'AC'] },
  { id: 'L23', name: 'L23', type: 'Lecture Hall', capacity: 120, building: 'Academic Block', facilities: ['Projector', 'AC'] },
  { id: 'L24', name: 'L24', type: 'Lecture Hall', capacity: 120, building: 'Academic Block', facilities: ['Projector', 'AC'] },
  { id: 'L25', name: 'L25', type: 'Lecture Hall', capacity: 120, building: 'Academic Block', facilities: ['Projector', 'AC'] },
  { id: 'L26', name: 'L26', type: 'Lecture Hall', capacity: 120, building: 'Academic Block', facilities: ['Projector', 'AC'] },
  { id: 'L27', name: 'L27', type: 'Lecture Hall', capacity: 120, building: 'Academic Block', facilities: ['Projector', 'AC'] },
  { id: 'L28', name: 'L28', type: 'Lecture Hall', capacity: 120, building: 'Academic Block', facilities: ['Projector', 'AC'] },
  { id: 'L29', name: 'L29', type: 'Lecture Hall', capacity: 120, building: 'Academic Block', facilities: ['Projector', 'AC'] },
  { id: 'L30', name: 'L30', type: 'Lecture Hall', capacity: 120, building: 'Academic Block', facilities: ['Projector', 'AC'] },
  { id: 'L31', name: 'L31', type: 'Lecture Hall', capacity: 120, building: 'Academic Block', facilities: ['Projector', 'AC'] },

  // Tutorial Rooms (T1 - T8 from screenshot)
  { id: 'T1', name: 'T1', type: 'Tutorial Room', capacity: 60, building: 'Academic Block', facilities: ['Whiteboard', 'AC'] },
  { id: 'T2', name: 'T2', type: 'Tutorial Room', capacity: 60, building: 'Academic Block', facilities: ['Whiteboard'] },
  { id: 'T3', name: 'T3', type: 'Tutorial Room', capacity: 60, building: 'Academic Block', facilities: ['Whiteboard'] },
  { id: 'T4', name: 'T4', type: 'Tutorial Room', capacity: 60, building: 'Academic Block', facilities: ['Whiteboard'] },
  { id: 'T5', name: 'T5', type: 'Tutorial Room', capacity: 60, building: 'Academic Block', facilities: ['Whiteboard'] },
  { id: 'T6', name: 'T6', type: 'Tutorial Room', capacity: 60, building: 'Academic Block', facilities: ['Whiteboard'] },
  { id: 'T7', name: 'T7', type: 'Tutorial Room', capacity: 60, building: 'Academic Block', facilities: ['Whiteboard'] },
  { id: 'T8', name: 'T8', type: 'Tutorial Room', capacity: 60, building: 'Academic Block', facilities: ['Whiteboard'] },

  // Auditorium & Special Rooms
  { id: 'L1', name: 'L1', type: 'Lecture Hall', capacity: 150, building: 'Academic Block A', facilities: ['Projector', 'AC'] },
  { id: 'L2', name: 'L2', type: 'Lecture Hall', capacity: 150, building: 'Academic Block A', facilities: ['Projector'] },
  { id: 'L3', name: 'L3', type: 'Lecture Hall', capacity: 150, building: 'Academic Block A', facilities: ['Projector'] },
  { id: 'L8', name: 'L8', type: 'Lecture Hall', capacity: 200, building: 'Academic Block B', facilities: ['Smart Board'] },
  { id: 'L9', name: 'L9', type: 'Lecture Hall', capacity: 200, building: 'Academic Block B', facilities: ['Smart Board'] },
  { id: 'Auditorium', name: 'Auditorium', type: 'Auditorium', capacity: 800, building: 'Central Campus', facilities: ['Stage', 'Sound System', 'AC'] }
];

const PERMISSIONS_STORAGE_KEY = 'pec_permission_requests_v6';

const SEED_REQUESTS: PermissionRequest[] = [
  {
    id: 'perm_001',
    trackingCode: 'PEC-PERM-2026-101',
    societyName: 'IEEE Student Branch',
    applicantName: 'Ansh Agnihotry',
    applicantRoll: '21103045',
    applicantPhone: '+91 9876543210',
    applicantEmail: 'ieee@pec.edu.in',
    subject: 'Permission for Annual Tech Symposium & Hackathon 2026',
    eventTitle: 'RC car workshop',
    eventPurpose: '2-day hands-on RC Car Building Workshop on. Students will learn basic electronics and build their own acrylic RC car from scratch using Arduino/ESP32 and Bluetooth modules.',
    department: 'ECE dept (CSRC)',
    financialAssistance: 'No',
    isMultiDay: true,
    isDiffTimePerDay: true,
    fromDate: '2026-09-19',
    toDate: '2026-09-20',
    fromTime: '17:00',
    toTime: '20:00',
    day2FromDate: '2026-09-20',
    day2FromTime: '09:00',
    day2ToTime: '20:00',
    venueId: 'L20',
    venueName: 'L20,21,22,23',
    venueIds: ['L20', 'L21', 'L22', 'L23'],
    expectedAudience: 150,
    equipmentNeeded: ['Projector & Screen', 'Power Extensions', 'Soldering Stations'],
    status: 'APPROVED',
    currentStage: 6,
    signatures: {
      SECCY: {
        role: 'SECCY',
        signatoryName: 'Shashvat',
        designation: 'Secretary (Seccy)',
        signedAt: '2026-09-18T10:15:30Z',
        verificationHash: 'SIG-SEC-88219034',
        remarks: 'Recommended. Agenda verified.'
      },
      PROF_INCHARGE: {
        role: 'PROF_INCHARGE',
        signatoryName: 'Prof. Deepak Kumar',
        designation: 'Prof. In-Charge (P/I)',
        signedAt: '2026-09-18T11:30:45Z',
        verificationHash: 'SIG-PI-99410214',
        remarks: 'Approved.'
      },
      CSTS: {
        role: 'CSTS',
        signatoryName: 'Daiwik',
        designation: 'Convenor JCSTS / CSTS',
        signedAt: '2026-09-18T14:00:12Z',
        verificationHash: 'SIG-CSTS-1102934',
        remarks: 'Approved.'
      },
      ADSA: {
        role: 'ADSA',
        signatoryName: 'Prof. M.P. Garg',
        designation: 'Associate Dean Student Affairs (ADSA)',
        signedAt: '2026-09-18T16:20:00Z',
        verificationHash: 'SIG-ADSA-5561023',
        remarks: 'Forwarded for sanction.'
      },
      DSA: {
        role: 'DSA',
        signatoryName: 'Prof. Puneet Kaur',
        designation: 'Dean Student Affairs (DSA)',
        signedAt: '2026-09-18T17:45:10Z',
        verificationHash: 'SIG-DSA-0012984',
        remarks: 'Sanctioned. Rooms locked.'
      }
    },
    history: [
      { stage: 1, actor: 'IEEE Student Branch', role: 'SOCIETY', action: 'CREATED', timestamp: '2026-09-18T09:00:00Z' },
      { stage: 1, actor: 'Shashvat', role: 'SECCY', action: 'APPROVED', timestamp: '2026-09-18T10:15:30Z' },
      { stage: 2, actor: 'Prof. Deepak Kumar', role: 'PROF_INCHARGE', action: 'APPROVED', timestamp: '2026-09-18T11:30:45Z' },
      { stage: 3, actor: 'Daiwik', role: 'CSTS', action: 'APPROVED', timestamp: '2026-09-18T14:00:12Z' },
      { stage: 4, actor: 'Prof. M.P. Garg', role: 'ADSA', action: 'APPROVED', timestamp: '2026-09-18T16:20:00Z' },
      { stage: 5, actor: 'Prof. Puneet Kaur', role: 'DSA', action: 'APPROVED', timestamp: '2026-09-18T17:45:10Z' }
    ],
    createdAt: '2026-09-18T09:00:00Z'
  }
];

export function getPermissions(): PermissionRequest[] {
  if (typeof window === 'undefined') return SEED_REQUESTS;
  const stored = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(SEED_REQUESTS));
    return SEED_REQUESTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return SEED_REQUESTS;
  }
}

export function savePermissions(requests: PermissionRequest[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(requests));
}

export function checkVenueConflict(
  venueIdOrIds: string | string[],
  fromDate: string,
  toDate: string,
  fromTime: string,
  toTime: string,
  excludeRequestId?: string
): { conflict: boolean; conflictingPermission?: PermissionRequest } {
  const allPermissions = getPermissions();
  const checkIds = Array.isArray(venueIdOrIds) ? venueIdOrIds : [venueIdOrIds];

  const activePermissions = allPermissions.filter(
    p => p.status !== 'REJECTED' && p.id !== excludeRequestId
  );

  for (const perm of activePermissions) {
    const permIds = perm.venueIds || [perm.venueId];
    const hasVenueOverlap = checkIds.some(id => permIds.includes(id));

    if (hasVenueOverlap) {
      const d1Start = new Date(fromDate).getTime();
      const d1End = new Date(toDate || fromDate).getTime();
      const d2Start = new Date(perm.fromDate).getTime();
      const d2End = new Date(perm.toDate || perm.fromDate).getTime();

      const dateOverlap = d1Start <= d2End && d1End >= d2Start;

      if (dateOverlap) {
        const t1Start = parseTimeToMinutes(fromTime);
        const t1End = parseTimeToMinutes(toTime);
        const t2Start = parseTimeToMinutes(perm.fromTime);
        const t2End = parseTimeToMinutes(perm.toTime);

        const timeOverlap = t1Start < t2End && t1End > t2Start;

        if (timeOverlap) {
          return { conflict: true, conflictingPermission: perm };
        }
      }
    }
  }

  return { conflict: false };
}

function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function createPermissionRequest(data: Omit<PermissionRequest, 'id' | 'trackingCode' | 'status' | 'currentStage' | 'signatures' | 'history' | 'createdAt'>): { success: boolean; request?: PermissionRequest; error?: string } {
  const conflictCheck = checkVenueConflict(data.venueIds || data.venueId, data.fromDate, data.toDate, data.fromTime, data.toTime);
  if (conflictCheck.conflict && conflictCheck.conflictingPermission) {
    return {
      success: false,
      error: `Double Booking Conflict Alert! Room ${data.venueName} is already booked/requested by ${conflictCheck.conflictingPermission.societyName} on ${conflictCheck.conflictingPermission.fromDate} (${conflictCheck.conflictingPermission.fromTime} - ${conflictCheck.conflictingPermission.toTime}). Please choose another room or time slot.`
    };
  }

  const all = getPermissions();
  const trackingNumber = Math.floor(100 + Math.random() * 900);
  const newRequest: PermissionRequest = {
    ...data,
    id: `perm_${Date.now()}`,
    trackingCode: `PEC-PERM-2026-${trackingNumber}`,
    status: 'PENDING_SECCY',
    currentStage: 1,
    signatures: {},
    history: [
      {
        stage: 1,
        actor: data.societyName,
        role: 'SOCIETY',
        action: 'CREATED',
        timestamp: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString()
  };

  all.unshift(newRequest);
  savePermissions(all);
  return { success: true, request: newRequest };
}

export function signAndAdvancePermission(
  requestId: string,
  role: Role,
  signatoryName: string,
  designation: string,
  signatureDataUrl?: string,
  remarks?: string
): { success: boolean; updatedRequest?: PermissionRequest; error?: string } {
  const all = getPermissions();
  const index = all.findIndex(p => p.id === requestId);
  if (index === -1) return { success: false, error: 'Request not found' };

  const perm = all[index];
  const nextVerificationHash = `SIG-${role}-${Math.floor(1000000 + Math.random() * 9000000)}`;
  
  const signatureObj: SignatureRecord = {
    role,
    signatoryName,
    designation,
    signedAt: new Date().toISOString(),
    signatureDataUrl,
    verificationHash: nextVerificationHash,
    remarks
  };

  perm.signatures[role] = signatureObj;

  const hasDSA = !!perm.signatures['DSA'];
  if (hasDSA) {
    perm.status = 'APPROVED';
    perm.currentStage = 6;
  }

  perm.history.push({
    stage: perm.currentStage,
    actor: signatoryName,
    role,
    action: 'APPROVED',
    timestamp: new Date().toISOString(),
    remarks
  });

  all[index] = perm;
  savePermissions(all);

  return { success: true, updatedRequest: perm };
}

export function requestEditPermission(
  requestId: string,
  role: Role,
  actorName: string,
  remarks: string
): { success: boolean; updatedRequest?: PermissionRequest; error?: string } {
  const all = getPermissions();
  const index = all.findIndex(p => p.id === requestId);
  if (index === -1) return { success: false, error: 'Request not found' };

  const perm = all[index];
  perm.status = 'MODIFICATION_REQUESTED';
  perm.editRequestRemarks = remarks;
  perm.history.push({
    stage: perm.currentStage,
    actor: actorName,
    role,
    action: 'REQUEST_EDIT',
    timestamp: new Date().toISOString(),
    remarks
  });

  all[index] = perm;
  savePermissions(all);
  return { success: true, updatedRequest: perm };
}

export function adminSelectiveSignPermission(
  requestId: string,
  rolesToSign: Role[]
): { success: boolean; updatedRequest?: PermissionRequest; error?: string } {
  const all = getPermissions();
  const index = all.findIndex(p => p.id === requestId);
  if (index === -1) return { success: false, error: 'Request not found' };

  const perm = all[index];
  const now = new Date().toISOString();

  const roleNameMap: Record<Role, { name: string; desig: string }> = {
    'SECCY': { name: 'Shashvat (Admin Override)', desig: 'Secretary (Seccy)' },
    'PROF_INCHARGE': { name: 'Prof. Deepak Kumar (Admin Override)', desig: 'Prof. In-Charge (P/I)' },
    'CSTS': { name: 'Daiwik (Admin Override)', desig: 'Convenor JCSTS / CSTS' },
    'ADSA': { name: 'Prof. M.P. Garg (Admin Override)', desig: 'Associate Dean SA (ADSA)' },
    'DSA': { name: 'Prof. Puneet Kaur (Admin Override)', desig: 'Dean Student Affairs (DSA)' },
    'ADMIN': { name: 'Administrator', desig: 'System Super Admin' },
    'SOCIETY': { name: 'Club Lead', desig: 'Society Lead' }
  };

  for (const r of rolesToSign) {
    const meta = roleNameMap[r] || { name: 'Admin Officer', desig: r };
    perm.signatures[r] = perm.signatures[r] || {
      role: r,
      signatoryName: meta.name,
      designation: meta.desig,
      signedAt: now,
      verificationHash: `SIG-${r}-ADMIN-${Math.floor(100000 + Math.random() * 900000)}`,
      remarks: 'Signed via Admin Selective Panel.'
    };
  }

  if (perm.signatures['DSA']) {
    perm.status = 'APPROVED';
    perm.currentStage = 6;
  }

  all[index] = perm;
  savePermissions(all);
  return { success: true, updatedRequest: perm };
}

export function rejectPermission(
  requestId: string,
  role: Role,
  actorName: string,
  reason: string
): { success: boolean; updatedRequest?: PermissionRequest; error?: string } {
  const all = getPermissions();
  const index = all.findIndex(p => p.id === requestId);
  if (index === -1) return { success: false, error: 'Request not found' };

  const perm = all[index];
  perm.status = 'REJECTED';
  perm.rejectionReason = reason;
  perm.history.push({
    stage: perm.currentStage,
    actor: actorName,
    role,
    action: 'REJECTED',
    timestamp: new Date().toISOString(),
    remarks: reason
  });

  all[index] = perm;
  savePermissions(all);
  return { success: true, updatedRequest: perm };
}

export function updatePermissionRequest(
  id: string,
  data: Partial<PermissionRequest>
): { success: boolean; request?: PermissionRequest; error?: string } {
  const all = getPermissions();
  const index = all.findIndex(p => p.id === id);
  if (index === -1) return { success: false, error: 'Request not found' };

  const perm: PermissionRequest = {
    ...all[index],
    ...data,
    status: 'PENDING_SECCY',
    currentStage: 1,
  };

  perm.history.push({
    stage: 1,
    actor: data.applicantName || perm.applicantName,
    role: 'SOCIETY',
    action: 'MODIFIED',
    timestamp: new Date().toISOString(),
    remarks: 'Application modified and resubmitted by applicant.'
  });

  all[index] = perm;
  savePermissions(all);
  return { success: true, request: perm };
}

