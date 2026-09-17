import { PermissionRequest, Venue, PermissionStatus, Role, ApprovalStageNumber } from './types';

export const VENUES: Venue[] = [
  { id: 'L1', name: 'Lecture Hall L1', type: 'Lecture Hall', capacity: 150, building: 'Academic Block A', facilities: ['Projector', 'AC', 'PA System', 'Podium'] },
  { id: 'L2', name: 'Lecture Hall L2', type: 'Lecture Hall', capacity: 150, building: 'Academic Block A', facilities: ['Projector', 'AC', 'PA System'] },
  { id: 'L3', name: 'Lecture Hall L3', type: 'Lecture Hall', capacity: 150, building: 'Academic Block A', facilities: ['Projector', 'AC'] },
  { id: 'L8', name: 'Lecture Hall L8', type: 'Lecture Hall', capacity: 200, building: 'Academic Block B', facilities: ['Smart Board', 'AC', 'Audio System'] },
  { id: 'L9', name: 'Lecture Hall L9', type: 'Lecture Hall', capacity: 200, building: 'Academic Block B', facilities: ['Smart Board', 'AC', 'Audio System'] },
  { id: 'L20', name: 'Lecture Hall L20', type: 'Lecture Hall', capacity: 120, building: 'New Academic Block', facilities: ['Projector', 'AC'] },
  { id: 'L21', name: 'Lecture Hall L21', type: 'Lecture Hall', capacity: 120, building: 'New Academic Block', facilities: ['Projector', 'AC'] },
  { id: 'T1', name: 'Tutorial Room T1', type: 'Tutorial Room', capacity: 60, building: 'Academic Block A', facilities: ['Whiteboard', 'AC'] },
  { id: 'T2', name: 'Tutorial Room T2', type: 'Tutorial Room', capacity: 60, building: 'Academic Block A', facilities: ['Whiteboard'] },
  { id: 'AUDITORIUM', name: 'Main Auditorium', type: 'Auditorium', capacity: 800, building: 'Central Campus', facilities: ['Stage Lighting', 'Pro Sound System', 'Central AC', 'Green Rooms'] },
  { id: 'OAT', name: 'Open Air Theatre (OAT)', type: 'Open Air', capacity: 1200, building: 'Student Center Area', facilities: ['Stage', 'Open Seating'] },
  { id: 'CONF_HALL', name: 'Senate Conference Hall', type: 'Conference Room', capacity: 80, building: 'Administrative Block', facilities: ['VC System', 'Mic System', 'AC'] }
];

const PERMISSIONS_STORAGE_KEY = 'pec_permission_requests_v2';

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
    venueId: 'AUDITORIUM',
    venueName: 'Main Auditorium',
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
        signatoryName: 'Aarav Sharma',
        designation: 'Secretary, Technical Societies',
        signedAt: '2026-09-18T10:15:00Z',
        verificationHash: 'SIG-SEC-88219034',
        remarks: 'Recommended. Agenda verified.'
      },
      PROF_INCHARGE: {
        role: 'PROF_INCHARGE',
        signatoryName: 'Dr. Rajesh Verma',
        designation: 'Professor In-Charge (Robotics/Technical)',
        signedAt: '2026-09-18T11:30:00Z',
        verificationHash: 'SIG-PI-99410214',
        remarks: 'Approved. Event aligns with academic goals.'
      },
      CSTS: {
        role: 'CSTS',
        signatoryName: 'Dr. Neha Gupta',
        designation: 'Convenor CSTS',
        signedAt: '2026-09-18T14:00:00Z',
        verificationHash: 'SIG-CSTS-1102934',
        remarks: 'Approved. Schedule cleared.'
      },
      ADSA: {
        role: 'ADSA',
        signatoryName: 'Dr. Vikram Malhotra',
        designation: 'Associate Dean Student Affairs',
        signedAt: '2026-09-18T16:20:00Z',
        verificationHash: 'SIG-ADSA-5561023',
        remarks: 'Forwarded for final sanction.'
      },
      DSA: {
        role: 'DSA',
        signatoryName: 'Prof. (Dr.) Sanjeev Kumar',
        designation: 'Dean Student Affairs',
        signedAt: '2026-09-18T17:45:00Z',
        verificationHash: 'SIG-DSA-0012984',
        remarks: 'Sanctioned. Auditorium booked.'
      }
    },
    history: [
      { stage: 1, actor: 'IEEE Student Branch', role: 'SOCIETY', action: 'CREATED', timestamp: '2026-09-18T09:00:00Z' },
      { stage: 1, actor: 'Aarav Sharma', role: 'SECCY', action: 'APPROVED', timestamp: '2026-09-18T10:15:00Z' },
      { stage: 2, actor: 'Dr. Rajesh Verma', role: 'PROF_INCHARGE', action: 'APPROVED', timestamp: '2026-09-18T11:30:00Z' },
      { stage: 3, actor: 'Dr. Neha Gupta', role: 'CSTS', action: 'APPROVED', timestamp: '2026-09-18T14:00:00Z' },
      { stage: 4, actor: 'Dr. Vikram Malhotra', role: 'ADSA', action: 'APPROVED', timestamp: '2026-09-18T16:20:00Z' },
      { stage: 5, actor: 'Prof. (Dr.) Sanjeev Kumar', role: 'DSA', action: 'APPROVED', timestamp: '2026-09-18T17:45:00Z' }
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
    subject: 'Request for Lecture Hall L1 for Autonomous Bot Workshop',
    eventTitle: 'RoboWars & Line Follower Hands-on Session',
    eventPurpose: 'Practical workshop on microcontrollers, sensor integration, and chassis building.',
    venueId: 'L1',
    venueName: 'Lecture Hall L1',
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
        signatoryName: 'Aarav Sharma',
        designation: 'Secretary, Technical Societies',
        signedAt: '2026-09-18T12:00:00Z',
        verificationHash: 'SIG-SEC-7728109',
        remarks: 'Approved. Forwarded to Prof In-charge.'
      }
    },
    history: [
      { stage: 1, actor: 'PEC Robotics Society', role: 'SOCIETY', action: 'CREATED', timestamp: '2026-09-18T11:00:00Z' },
      { stage: 1, actor: 'Aarav Sharma', role: 'SECCY', action: 'APPROVED', timestamp: '2026-09-18T12:00:00Z' }
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
  
  // Conflicting requests are those that are either APPROVED or currently in active approval workflow
  const activePermissions = allPermissions.filter(
    p => p.status !== 'REJECTED' && p.id !== excludeRequestId && p.venueId === venueId
  );
  
  for (const perm of activePermissions) {
    // Check date overlap: (start1 <= end2) && (end1 >= start1)
    const d1Start = new Date(fromDate).getTime();
    const d1End = new Date(toDate).getTime();
    const d2Start = new Date(perm.fromDate).getTime();
    const d2End = new Date(perm.toDate).getTime();

    const dateOverlap = d1Start <= d2End && d1End >= d2Start;
    
    if (dateOverlap) {
      // Check time overlap on overlapping dates
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
  // Check double booking conflict first!
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
  } else if (role === 'DSA') {
    nextStage = 6;
    nextStatus = 'APPROVED'; // Fully Signed & Room Locked!
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
