import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Assignment, JobProgressEvent } from '@/types';
import { getAssignments, deleteAssignment as apiDelete } from '@/lib/api'; // alias import to avoid conflict with store action

interface AssignmentState {
  assignments: Assignment[];
  currentJob: JobProgressEvent | null;
  isLoading: boolean;
  error: string | null;

  fetchAssignments: () => Promise<void>;
  addAssignment: (a: Assignment) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => Promise<void>;
  setCurrentJob: (job: JobProgressEvent | null) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  clearState: () => void;
}

export const useAssignmentStore = create<AssignmentState>()(
  devtools(
    (set, get) => ({
      assignments: [],
      currentJob: null,
      isLoading: false,
      error: null,

      fetchAssignments: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await getAssignments();
          set({ assignments: data, isLoading: false });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Failed to fetch';
          set({ error: message, isLoading: false });
        }
      },

      addAssignment: (a) =>
        set((s) => ({ assignments: [a, ...s.assignments] })),

      updateAssignment: (id, updates) =>
        set((s) => ({
          assignments: s.assignments.map((a) =>
            a._id === id ? { ...a, ...updates } : a
          ),
        })),

      deleteAssignment: async (id) => {
        try {
          await apiDelete(id);
          set((s) => ({
            assignments: s.assignments.filter((a) => a._id !== id),
          }));
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Failed to delete';
          set({ error: message });
        }
      },

      setCurrentJob: (job) => set({ currentJob: job }),
      setLoading: (v) => set({ isLoading: v }),
      setError: (e) => set({ error: e }),
      clearState: () => set({ assignments: [], currentJob: null, error: null }),
    }),
    { name: 'AssignmentStore' }
  )
);