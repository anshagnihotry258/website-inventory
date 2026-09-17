import { UserAccount, Role } from './types';

export const PRESET_USERS: Record<string, UserAccount & { passwordHash: string }> = {
  // Societies
  'IEEE': {
    id: 'usr_ieee',
    username: 'IEEE',
    passwordHash: 'IEEE1974**',
    name: 'IEEE PEC Student Branch',
    role: 'SOCIETY',
    designation: 'Technical Society',
    societyName: 'IEEE Student Branch',
    avatar: '⚡'
  },
  'ASME': {
    id: 'usr_asme',
    username: 'ASME',
    passwordHash: 'ASME1974**',
    name: 'ASME PEC Chapter',
    role: 'SOCIETY',
    designation: 'Technical Society',
    societyName: 'ASME',
    avatar: '⚙️'
  },
  'ROBOTICS': {
    id: 'usr_robotics',
    username: 'ROBOTICS',
    passwordHash: 'ROBOTICS2026',
    name: 'PEC Robotics Society',
    role: 'SOCIETY',
    designation: 'Technical Society',
    societyName: 'Robotics Society',
    avatar: '🤖'
  },
  
  // Authorities in approval order:
  'SECCY': {
    id: 'usr_seccy',
    username: 'SECCY',
    passwordHash: 'SECCY2026',
    name: 'Aarav Sharma',
    role: 'SECCY',
    designation: 'Secretary, Technical Societies',
    department: 'Student Council',
    avatar: '✍️'
  },
  'PROF_INCHARGE': {
    id: 'usr_prof',
    username: 'PROF_INCHARGE',
    passwordHash: 'PROF2026',
    name: 'Dr. Rajesh Verma',
    role: 'PROF_INCHARGE',
    designation: 'Professor In-Charge (Robotics/Technical)',
    department: 'Computer Science & Engineering',
    avatar: '👨‍🏫'
  },
  'CSTS': {
    id: 'usr_csts',
    username: 'CSTS',
    passwordHash: 'CSTS2026',
    name: 'Dr. Neha Gupta',
    role: 'CSTS',
    designation: 'Convenor, Technical & Cultural Societies (CSTS)',
    department: 'Dean Student Affairs Office',
    avatar: '🏛️'
  },
  'ADSA': {
    id: 'usr_adsa',
    username: 'ADSA',
    passwordHash: 'ADSA2026',
    name: 'Dr. Vikram Malhotra',
    role: 'ADSA',
    designation: 'Associate Dean Student Affairs (ADSA)',
    department: 'Dean Student Affairs Secretariat',
    avatar: '⚖️'
  },
  'DSA': {
    id: 'usr_dsa',
    username: 'DSA',
    passwordHash: 'DSA2026',
    name: 'Prof. (Dr.) Sanjeev Kumar',
    role: 'DSA',
    designation: 'Dean Student Affairs (DSA)',
    department: 'Office of Dean Student Affairs',
    avatar: '🎓'
  }
};

export const STAGE_ROLES: Record<number, { role: Role; label: string; username: string }> = {
  1: { role: 'SECCY', label: '1. Secretary (Seccy)', username: 'SECCY' },
  2: { role: 'PROF_INCHARGE', label: '2. Prof. In-Charge (P/I)', username: 'PROF_INCHARGE' },
  3: { role: 'CSTS', label: '3. Convenor CSTS / JCSTS', username: 'CSTS' },
  4: { role: 'ADSA', label: '4. ADSA (Associate Dean)', username: 'ADSA' },
  5: { role: 'DSA', label: '5. DSA (Dean Student Affairs)', username: 'DSA' }
};

const STORAGE_KEY = 'pec_current_user';

export function getCurrentUser(): UserAccount | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Default to IEEE for quick convenience
    return PRESET_USERS['IEEE'];
  }
  try {
    return JSON.parse(stored);
  } catch {
    return PRESET_USERS['IEEE'];
  }
}

export function setCurrentUser(user: UserAccount | null) {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
}
