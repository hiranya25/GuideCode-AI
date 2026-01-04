
import { User } from '../types';

/**
 * SIMULATED AUTH PROVIDER
 * This service mimics the Firebase Auth SDK behavior to ensure the app is 
 * functional and data-isolated without requiring real API keys.
 * It uses localStorage to persist a "Users Database" and "Session State".
 */

const USERS_DB_KEY = 'guidecode_mock_users_db';
const SESSION_KEY = 'guidecode_mock_session';

// In-memory listeners for auth changes (mimics onAuthStateChanged)
type AuthCallback = (user: User | null) => void;
const listeners: Set<AuthCallback> = new Set();

const notifyListeners = (user: User | null) => {
  listeners.forEach(callback => callback(user));
};

// Helper: Get users from local storage "DB"
const getUsersDB = (): Record<string, any> => {
  const db = localStorage.getItem(USERS_DB_KEY);
  return db ? JSON.parse(db) : {};
};

// Helper: Save users to local storage "DB"
const saveUsersDB = (db: Record<string, any>) => {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
};

export const signUp = async (email: string, password: string, displayName: string): Promise<User> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  const db = getUsersDB();
  const normalizedEmail = email.toLowerCase().trim();

  if (db[normalizedEmail]) {
    const error: any = new Error('Email already in use');
    error.code = 'auth/email-already-in-use';
    throw error;
  }

  const uid = `uid_${Math.random().toString(36).substr(2, 9)}`;
  const newUser: User = {
    uid,
    name: displayName.trim(),
    email: normalizedEmail,
    avatarColor: ['bg-indigo-500', 'bg-emerald-500', 'bg-blue-500', 'bg-rose-500'][Math.floor(Math.random() * 4)]
  };

  // Save to "DB"
  db[normalizedEmail] = { ...newUser, password };
  saveUsersDB(db);

  // Set session
  localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  notifyListeners(newUser);

  return newUser;
};

export const signIn = async (email: string, password: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const db = getUsersDB();
  const normalizedEmail = email.toLowerCase().trim();
  const userRecord = db[normalizedEmail];

  if (!userRecord || userRecord.password !== password) {
    const error: any = new Error('Invalid credentials');
    error.code = 'auth/invalid-credential';
    throw error;
  }

  const { password: _, ...user } = userRecord;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  notifyListeners(user as User);

  return user as User;
};

export const signOut = async () => {
  localStorage.removeItem(SESSION_KEY);
  notifyListeners(null);
};

export const listenToAuthChanges = (callback: AuthCallback) => {
  listeners.add(callback);
  
  // Initial trigger: check if session exists
  const savedSession = localStorage.getItem(SESSION_KEY);
  if (savedSession) {
    try {
      callback(JSON.parse(savedSession));
    } catch {
      callback(null);
    }
  } else {
    callback(null);
  }

  // Return unsubscribe function
  return () => listeners.delete(callback);
};
