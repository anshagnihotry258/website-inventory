export type Role = 
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
  username: string; // e.g. IEEE, SECCY, PROF_SMITH, CSTS_PEC, ADSA_PEC, DSA_PEC
  name: string;
  role: Role;
  designation: string;
  department?: string;
  societyName?: string;
  avatar?: string;
}

export interface Venue {
  id: string;
  name: string;
  type: 'Lecture Hall' | 'Tutorial Room' | 'Auditorium' | 'Open Air' | 'Conference Room';
  capacity: number;
  building: string;
  facilities: string[];
}

export interface SignatureRecord {
  role: Role;
  signatoryName: string;
  designation: string;
  signedAt: string;
  signatureDataUrl?: string; // base64 canvas image data URL
  verificationHash: string;
  remarks?: string;
}

export interface PermissionRequest {
  id: string;
  trackingCode: string; // e.g. PEC-PERM-2026-0891
  societyName: string;
  applicantName: string;
  applicantRoll: string;
  applicantPhone: string;
  applicantEmail: string;
  
  subject: string;
  eventTitle: string;
  eventPurpose: string;
  
  venueId: string;
  venueName: string;
  
  fromDate: string; // YYYY-MM-DD
  toDate: string;   // YYYY-MM-DD
  fromTime: string; // HH:mm
  toTime: string;   // HH:mm
  
  expectedAudience: number;
  equipmentNeeded: string[];
  
  status: PermissionStatus;
  currentStage: ApprovalStageNumber;
  
  signatures: Partial<Record<Role, SignatureRecord>>;
  history: {
    stage: ApprovalStageNumber;
    actor: string;
    role: Role;
    action: 'CREATED' | 'APPROVED' | 'REJECTED' | 'MODIFIED';
    timestamp: string;
    remarks?: string;
  }[];
  
  createdAt: string;
  rejectionReason?: string;
}
