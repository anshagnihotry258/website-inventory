import { UserAccount, Role } from './types';

export const INITIAL_PRESET_USERS: Record<string, UserAccount & { passwordHash: string }> = {
  // Admin Account
  'admin': {
    id: 'usr_admin',
    username: 'admin',
    passwordHash: 'admin',
    name: 'Administrator',
    role: 'ADMIN',
    designation: 'System Super Administrator',
    department: 'Dean Student Affairs Secretariat',
    avatar: '👑',
    isAdmin: true
  },

  // Authority Officers (Username = Given Name, Password = 1)
  'shashvat': {
    id: 'usr_shashvat',
    username: 'shashvat',
    passwordHash: '1',
    name: 'Shashvat',
    role: 'SECCY',
    designation: 'Secretary (Seccy)',
    department: 'Student Council',
    avatar: '✍️'
  },

  'prof deepak kumar': {
    id: 'usr_deepak',
    username: 'prof deepak kumar',
    passwordHash: '1',
    name: 'Prof. Deepak Kumar',
    role: 'PROF_INCHARGE',
    designation: 'Prof. In-Charge (P/I)',
    department: 'Faculty Affairs',
    avatar: '👨‍🏫'
  },

  'daiwik': {
    id: 'usr_daiwik',
    username: 'daiwik',
    passwordHash: '1',
    name: 'Daiwik',
    role: 'CSTS',
    designation: 'Convenor JCSTS / CSTS',
    department: 'Cultural & Technical Societies',
    avatar: '🏛️'
  },

  'prof mp garg': {
    id: 'usr_mpgarg',
    username: 'prof mp garg',
    passwordHash: '1',
    name: 'Prof. M.P. Garg',
    role: 'ADSA',
    designation: 'Associate Dean Student Affairs (ADSA)',
    department: 'Dean Student Affairs Secretariat',
    avatar: '⚖️'
  },

  'prof puneet kaur': {
    id: 'usr_puneet',
    username: 'prof puneet kaur',
    passwordHash: '1',
    name: 'Prof. Puneet Kaur',
    role: 'DSA',
    designation: 'Dean Student Affairs (DSA)',
    department: 'Office of Dean Student Affairs',
    avatar: '🎓'
  },

  // Clubs / Societies (Username = Name, Password = 1)
  'ieee': {
    id: 'usr_ieee',
    username: 'ieee',
    passwordHash: '1',
    name: 'IEEE Student Branch',
    role: 'SOCIETY',
    designation: 'Technical Society',
    societyName: 'IEEE Student Branch',
    avatar: '⚡'
  },
  'asme': {
    id: 'usr_asme',
    username: 'asme',
    passwordHash: '1',
    name: 'ASME PEC Chapter',
    role: 'SOCIETY',
    designation: 'Technical Society',
    societyName: 'ASME',
    avatar: '⚙️'
  },
  'robotics': {
    id: 'usr_robotics',
    username: 'robotics',
    passwordHash: '1',
    name: 'PEC Robotics Society',
    role: 'SOCIETY',
    designation: 'Technical Society',
    societyName: 'Robotics Society',
    avatar: '🤖'
  }
};

export const STAGE_ROLES: Record<number, { role: Role; label: string; username: string; name: string }> = {
  1: { role: 'SECCY', label: '1. Secretary (Seccy)', username: 'shashvat', name: 'Shashvat' },
  2: { role: 'PROF_INCHARGE', label: '2. Prof. In-Charge (P/I)', username: 'prof deepak kumar', name: 'Prof. Deepak Kumar' },
  3: { role: 'CSTS', label: '3. Convenor JCSTS / CSTS', username: 'daiwik', name: 'Daiwik' },
  4: { role: 'ADSA', label: '4. ADSA (Associate Dean)', username: 'prof mp garg', name: 'Prof. M.P. Garg' },
  5: { role: 'DSA', label: '5. DSA (Dean Student Affairs)', username: 'prof puneet kaur', name: 'Prof. Puneet Kaur' }
};

const USERS_STORAGE_KEY = 'pec_users_store_v5';
const SESSION_STORAGE_KEY = 'pec_auth_session_v5';

export function getUsersStore(): Record<string, UserAccount & { passwordHash: string }> {
  if (typeof window === 'undefined') return INITIAL_PRESET_USERS;
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_PRESET_USERS));
    return INITIAL_PRESET_USERS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_PRESET_USERS;
  }
}

export function saveUsersStore(store: Record<string, UserAccount & { passwordHash: string }>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(store));
}

export const PRESET_USERS = getUsersStore();

export function getCurrentUser(): UserAccount | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserAccount | null) {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } else {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  }
  window.dispatchEvent(new Event('auth-change'));
}

export function logoutUser() {
  setCurrentUser(null);
}

export function updateUserPassword(username: string, newPassword: string): { success: boolean; error?: string } {
  const store = getUsersStore();
  const key = username.toLowerCase();
  
  if (!store[key]) {
    return { success: false, error: 'User not found' };
  }

  store[key].passwordHash = newPassword;
  saveUsersStore(store);

  // Update current session if matching
  const current = getCurrentUser();
  if (current && current.username.toLowerCase() === key) {
    setCurrentUser({ ...current });
  }

  return { success: true };
}
