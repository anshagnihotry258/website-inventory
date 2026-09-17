export type Role = 
  | 'ADMIN'
  | 'SOCIETY'
  | 'SECCY'
  | 'PROF_INCHARGE'
  | 'CSTS'
  | 'ADSA'
  | 'DSA';

export type ApprovalStageNumber = 1 | 2 | 3 | 4 | 5 | 6;

export type PermissionStatus = 
  | 'PENDING_SECCY'
  | 'PENDING_PROF'
  | 'PENDING_CSTS'
  | 'PENDING_ADSA'
  | 'PENDING_DSA'
  | 'APPROVED'
  | 'REJECTED';

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  role: Role;
  designation: string;
  department?: string;
  societyName?: string;
  avatar?: string;
  isAdmin?: boolean;
}

export interface Venue {
  id: string;
  name: string;
  type: 'Lecture Hall' | 'Tutorial Room' | 'Auditorium';
  capacity: number;
  building: string;
  facilities: string[];
}

export interface SignatureRecord {
  role: Role;
  signatoryName: string;
  designation: string;
  signedAt: string;
  signatureDataUrl?: string;
  verificationHash: string;
  remarks?: string;
}

export interface PermissionRequest {
  id: string;
  trackingCode: string;
  societyName: string;
  applicantName: string;
  applicantRoll: string;
  applicantPhone: string;
  applicantEmail: string;
  
  subject: string;
  eventTitle: string;
  eventPurpose: string;
  department?: string;
  financialAssistance?: string; // 'Yes' | 'No'
  
  // Multi-day & Multi-room options
  isMultiDay?: boolean;
  isDiffTimePerDay?: boolean;
  
  fromDate: string;
  toDate: string;
  fromTime: string;
  toTime: string;
  
  // Multi-day second day timings
  day2FromDate?: string;
  day2FromTime?: string;
  day2ToTime?: string;
  
  venueId: string;
  venueName: string; // e.g. "L20, L21, L22"
  venueIds?: string[];
  
  expectedAudience: number;
  equipmentNeeded: string[];
  
  status: PermissionStatus;
  currentStage: ApprovalStageNumber;
  
  signatures: Partial<Record<Role, SignatureRecord>>;
  history: {
    stage: ApprovalStageNumber;
    actor: string;
    role: Role;
    action: 'CREATED' | 'APPROVED' | 'REJECTED' | 'MODIFIED' | 'ADMIN_SUPER_APPROVED';
    timestamp: string;
    remarks?: string;
  }[];
  
  createdAt: string;
  rejectionReason?: string;
}
