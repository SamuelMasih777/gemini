import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  phoneNumber: string;
  countryCode: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  pendingPhone: string;
  pendingCountryCode: string;
  isOtpSent: boolean;
  login: (user: User) => void;
  logout: () => void;
  setPendingAuth: (phone: string, countryCode: string) => void;
  setOtpSent: (sent: boolean) => void;
  clearPendingAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      pendingPhone: '',
      pendingCountryCode: '',
      isOtpSent: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setPendingAuth: (phone, countryCode) => 
        set({ pendingPhone: phone, pendingCountryCode: countryCode }),
      setOtpSent: (sent) => set({ isOtpSent: sent }),
      clearPendingAuth: () => 
        set({ pendingPhone: '', pendingCountryCode: '', isOtpSent: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
