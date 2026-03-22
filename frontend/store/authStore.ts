import { create } from 'zustand';
import { useAssignmentStore } from './assignmentStore';

interface AuthState {
  user: {
    id: string;
    name: string;
    schoolName: string;
    city: string;
    role: string;
  } | null;
  isAuthenticated: boolean;
  login: (name: string, schoolName: string, city: string) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (name, schoolName, city) => {
    // Generate a simple deterministic pseudo-ID based on name for MVP multitenancy mapping
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '') || `user-${Date.now()}`;
    const user = { id, name, schoolName, city, role: "Teacher" };
    localStorage.setItem('veda-user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('veda-user');
    set({ user: null, isAuthenticated: false });
    // Immediately clear in-memory assignments so they do not bleed into the next session visually
    useAssignmentStore.getState().clearState();
  },
  hydrate: () => {
    try {
      const stored = localStorage.getItem('veda-user');
      if (stored) {
        const user = JSON.parse(stored);
        if (user && user.name) {
          set({ user, isAuthenticated: true });
        }
      }
    } catch {
      console.warn('Failed to hydrate auth state from localStorage');
    }
  }
}));
