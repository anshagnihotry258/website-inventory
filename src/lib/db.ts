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

  // Auditorium
  { id: 'Auditorium', name: 'Auditorium', type: 'Auditorium', capacity: 800, building: 'Central Campus', facilities: ['Stage', 'Sound System', 'AC'] }
];

const PERMISSIONS_STORAGE_KEY = 'pec_permission_requests_v3';

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
    eventTitle: 'HackPEC 2026 - National Hackathon',
    eventPurpose: 'Annual flagship technical competition, coding workshops, and project showcase.',
    venueId: 'Auditorium',
    venueName: 'Auditorium',
    fromDate: '2026-09-25',
    toDate: '2026-09-26',
    fromTime: '09:00',
    toTime: '18:00',
    expectedAudience: 450,
    equipmentNeeded: ['Projector & Screen', 'Microphones (4 Wireless)', 'Podium', 'Extension Boards'],
    status: 'APPROVED',
    currentStage: 6,
    signatures: {
      SECCY: {
        role: 'SECCY',
        signatoryName: 'Shashvat',
        designation: 'Secretary (Seccy)',
        signedAt: '2026-09-18T10:15:00Z',
        verificationHash: 'SIG-SEC-88219034',
        remarks: 'Recommended. Agenda verified.'
      },
      PROF_INCHARGE: {
        role: 'PROF_INCHARGE',
        signatoryName: 'Prof. Deepak Kumar',
        designation: 'Prof. In-Charge (P/I)',
        signedAt: '2026-09-18T11:30:00Z',
        verificationHash: 'SIG-PI-99410214',
        remarks: 'Approved. Event aligns with academic goals.'
      },
      CSTS: {
        role: 'CSTS',
        signatoryName: 'Daiwik',
        designation: 'Convenor JCSTS / CSTS',
        signedAt: '2026-09-18T14:00:00Z',
        verificationHash: 'SIG-CSTS-1102934',
        remarks: 'Approved. Schedule cleared.'
      },
      ADSA: {
        role: 'ADSA',
        signatoryName: 'Prof. M.P. Garg',
        designation: 'Associate Dean Student Affairs (ADSA)',
        signedAt: '2026-09-18T16:20:00Z',
        verificationHash: 'SIG-ADSA-5561023',
        remarks: 'Forwarded for final sanction.'
      },
      DSA: {
        role: 'DSA',
        signatoryName: 'Prof. Puneet Kaur',
        designation: 'Dean Student Affairs (DSA)',
        signedAt: '2026-09-18T17:45:00Z',
        verificationHash: 'SIG-DSA-0012984',
        remarks: 'Sanctioned. Auditorium locked.'
      }
    },
    history: [
      { stage: 1, actor: 'IEEE Student Branch', role: 'SOCIETY', action: 'CREATED', timestamp: '2026-09-18T09:00:00Z' },
      { stage: 1, actor: 'Shashvat', role: 'SECCY', action: 'APPROVED', timestamp: '2026-09-18T10:15:00Z' },
      { stage: 2, actor: 'Prof. Deepak Kumar', role: 'PROF_INCHARGE', action: 'APPROVED', timestamp: '2026-09-18T11:30:00Z' },
      { stage: 3, actor: 'Daiwik', role: 'CSTS', action: 'APPROVED', timestamp: '2026-09-18T14:00:00Z' },
      { stage: 4, actor: 'Prof. M.P. Garg', role: 'ADSA', action: 'APPROVED', timestamp: '2026-09-18T16:20:00Z' },
      { stage: 5, actor: 'Prof. Puneet Kaur', role: 'DSA', action: 'APPROVED', timestamp: '2026-09-18T17:45:00Z' }
    ],
    createdAt: '2026-09-18T09:00:00Z'
  },
  {
    id: 'perm_002',
    trackingCode: 'PEC-PERM-2026-102',
    societyName: 'PEC Robotics Society',
    applicantName: 'Kabir Verma',
    applicantRoll: '21102019',
    applicantPhone: '+91 9988776655',
    applicantEmail: 'robotics@pec.edu.in',
    subject: 'Request for Lecture Hall L20 for Autonomous Bot Workshop',
    eventTitle: 'RoboWars & Line Follower Hands-on Session',
    eventPurpose: 'Practical workshop on microcontrollers, sensor integration, and chassis building.',
    venueId: 'L20',
    venueName: 'L20',
    fromDate: '2026-09-28',
    toDate: '2026-09-28',
    fromTime: '14:00',
    toTime: '18:00',
    expectedAudience: 110,
    equipmentNeeded: ['Projector', 'Extra Power Sockets'],
    status: 'PENDING_PROF',
    currentStage: 2,
    signatures: {
      SECCY: {
        role: 'SECCY',
        signatoryName: 'Shashvat',
        designation: 'Secretary (Seccy)',
        signedAt: '2026-09-18T12:00:00Z',
        verificationHash: 'SIG-SEC-7728109',
        remarks: 'Approved. Forwarded to Prof. Deepak Kumar.'
      }
    },
    history: [
      { stage: 1, actor: 'PEC Robotics Society', role: 'SOCIETY', action: 'CREATED', timestamp: '2026-09-18T11:00:00Z' },
      { stage: 1, actor: 'Shashvat', role: 'SECCY', action: 'APPROVED', timestamp: '2026-09-18T12:00:00Z' }
    ],
    createdAt: '2026-09-18T11:00:00Z'
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

// Conflict / Double Booking Engine
export function checkVenueConflict(
  venueId: string,
  fromDate: string,
  toDate: string,
  fromTime: string,
  toTime: string,
  excludeRequestId?: string
): { conflict: boolean; conflictingPermission?: PermissionRequest } {
  const allPermissions = getPermissions();
  
  const activePermissions = allPermissions.filter(
    p => p.status !== 'REJECTED' && p.id !== excludeRequestId && p.venueId === venueId
  );
  
  for (const perm of activePermissions) {
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

  return { conflict: false };
}

function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function createPermissionRequest(data: Omit<PermissionRequest, 'id' | 'trackingCode' | 'status' | 'currentStage' | 'signatures' | 'history' | 'createdAt'>): { success: boolean; request?: PermissionRequest; error?: string } {
  const conflictCheck = checkVenueConflict(data.venueId, data.fromDate, data.toDate, data.fromTime, data.toTime);
  if (conflictCheck.conflict && conflictCheck.conflictingPermission) {
    return {
      success: false,
      error: `Double Booking Alert! ${data.venueName} is already locked/requested by ${conflictCheck.conflictingPermission.societyName} for ${conflictCheck.conflictingPermission.fromDate} (${conflictCheck.conflictingPermission.fromTime} - ${conflictCheck.conflictingPermission.toTime}). Please select a different venue or time slot.`
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

// Stage transition logic
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
  
  const signatureObj = {
    role,
    signatoryName,
    designation,
    signedAt: new Date().toISOString(),
    signatureDataUrl,
    verificationHash: nextVerificationHash,
    remarks
  };

  perm.signatures[role] = signatureObj;

  let nextStage: ApprovalStageNumber = perm.currentStage;
  let nextStatus: PermissionStatus = perm.status;

  if (role === 'SECCY') {
    nextStage = 2;
    nextStatus = 'PENDING_PROF';
  } else if (role === 'PROF_INCHARGE') {
    nextStage = 3;
    nextStatus = 'PENDING_CSTS';
  } else if (role === 'CSTS') {
    nextStage = 4;
    nextStatus = 'PENDING_ADSA';
  } else if (role === 'ADSA') {
    nextStage = 5;
    nextStatus = 'PENDING_DSA';
  } else if (role === 'DSA' || role === 'ADMIN') {
    nextStage = 6;
    nextStatus = 'APPROVED';
  }

  perm.currentStage = nextStage;
  perm.status = nextStatus;
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

// Admin Super-Approve Backend Function: Immediately signs all 5 stages & locks room!
export function adminSuperApprovePermission(
  requestId: string,
  adminName: string = 'Backend Administrator'
): { success: boolean; updatedRequest?: PermissionRequest; error?: string } {
  const all = getPermissions();
  const index = all.findIndex(p => p.id === requestId);
  if (index === -1) return { success: false, error: 'Request not found' };

  const perm = all[index];
  const now = new Date().toISOString();

  // Populate signatures for all 5 stages
  perm.signatures['SECCY'] = perm.signatures['SECCY'] || {
    role: 'SECCY',
    signatoryName: 'Shashvat (Admin Override)',
    designation: 'Secretary (Seccy)',
    signedAt: now,
    verificationHash: `SIG-SEC-ADMIN-${Math.floor(100000 + Math.random() * 900000)}`,
    remarks: 'Super approved by Backend Admin.'
  };

  perm.signatures['PROF_INCHARGE'] = perm.signatures['PROF_INCHARGE'] || {
    role: 'PROF_INCHARGE',
    signatoryName: 'Prof. Deepak Kumar (Admin Override)',
    designation: 'Prof. In-Charge (P/I)',
    signedAt: now,
    verificationHash: `SIG-PI-ADMIN-${Math.floor(100000 + Math.random() * 900000)}`,
    remarks: 'Super approved by Backend Admin.'
  };

  perm.signatures['CSTS'] = perm.signatures['CSTS'] || {
    role: 'CSTS',
    signatoryName: 'Daiwik (Admin Override)',
    designation: 'Convenor JCSTS / CSTS',
    signedAt: now,
    verificationHash: `SIG-CSTS-ADMIN-${Math.floor(100000 + Math.random() * 900000)}`,
    remarks: 'Super approved by Backend Admin.'
  };

  perm.signatures['ADSA'] = perm.signatures['ADSA'] || {
    role: 'ADSA',
    signatoryName: 'Prof. M.P. Garg (Admin Override)',
    designation: 'Associate Dean SA (ADSA)',
    signedAt: now,
    verificationHash: `SIG-ADSA-ADMIN-${Math.floor(100000 + Math.random() * 900000)}`,
    remarks: 'Super approved by Backend Admin.'
  };

  perm.signatures['DSA'] = perm.signatures['DSA'] || {
    role: 'DSA',
    signatoryName: 'Prof. Puneet Kaur (Admin Override)',
    designation: 'Dean Student Affairs (DSA)',
    signedAt: now,
    verificationHash: `SIG-DSA-ADMIN-${Math.floor(100000 + Math.random() * 900000)}`,
    remarks: 'Super approved by Backend Admin. Room Locked.'
  };

  perm.currentStage = 6;
  perm.status = 'APPROVED';
  perm.history.push({
    stage: 6,
    actor: adminName,
    role: 'ADMIN',
    action: 'ADMIN_SUPER_APPROVED',
    timestamp: now,
    remarks: 'Backend Super Approval applied to all stages.'
  });

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
