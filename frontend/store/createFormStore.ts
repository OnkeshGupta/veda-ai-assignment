import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { QuestionTypeEntry } from '@/types';
import { generateId, calcTotalQuestions, calcTotalMarks } from '@/lib/utils';

interface CreateFormState {
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  questionTypes: QuestionTypeEntry[];
  additionalInstructions: string;
  uploadedFile: File | null;
  uploadedFileUrl: string | null;

  step: number;   
  isSubmitting: boolean;

  setTitle: (v: string) => void;
  setSubject: (v: string) => void;
  setClassName: (v: string) => void;
  setDueDate: (v: string) => void;
  setAdditionalInstructions: (v: string) => void;
  setUploadedFile: (f: File | null) => void;
  setUploadedFileUrl: (url: string | null) => void;
  setIsSubmitting: (v: boolean) => void;

  addQuestionType: () => void;
  removeQuestionType: (id: string) => void;
  updateQuestionType: (id: string, updates: Partial<QuestionTypeEntry>) => void;

  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;

  totalQuestions: () => number;
  totalMarks: () => number;
}

const defaultQuestionTypes = (): QuestionTypeEntry[] => [
  { id: generateId(), type: 'Multiple Choice Questions', count: 4, marksEach: 1 },
  { id: generateId(), type: 'Short Questions', count: 3, marksEach: 2 },
];

export const useCreateFormStore = create<CreateFormState>()(
  devtools(
    (set, get) => ({
      title: '',
      subject: '',
      className: '',
      dueDate: '',
      questionTypes: defaultQuestionTypes(),
      additionalInstructions: '',
      uploadedFile: null,
      uploadedFileUrl: null,
      step: 1,
      isSubmitting: false,

      setTitle: (v) => set({ title: v }),
      setSubject: (v) => set({ subject: v }),
      setClassName: (v) => set({ className: v }),
      setDueDate: (v) => set({ dueDate: v }),
      setAdditionalInstructions: (v) => set({ additionalInstructions: v }),
      setUploadedFile: (f) => set({ uploadedFile: f }),
      setUploadedFileUrl: (url) => set({ uploadedFileUrl: url }),
      setIsSubmitting: (v) => set({ isSubmitting: v }),

      addQuestionType: () =>
        set((s) => ({
          questionTypes: [
            ...s.questionTypes,
            {
              id: generateId(),
              type: 'Short Questions',
              count: 2,
              marksEach: 2,
            },
          ],
        })),

      removeQuestionType: (id) =>
        set((s) => ({
          questionTypes: s.questionTypes.filter((q) => q.id !== id),
        })),

      updateQuestionType: (id, updates) =>
        set((s) => ({
          questionTypes: s.questionTypes.map((q) =>
            q.id === id ? { ...q, ...updates } : q
          ),
        })),

      nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 2) })),
      prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),

      reset: () =>
        set({
          title: '',
          subject: '',
          className: '',
          dueDate: '',
          questionTypes: defaultQuestionTypes(),
          additionalInstructions: '',
          uploadedFile: null,
          uploadedFileUrl: null,
          step: 1,
          isSubmitting: false,
        }),

      totalQuestions: () => calcTotalQuestions(get().questionTypes),
      totalMarks: () => calcTotalMarks(get().questionTypes),
    }),
    { name: 'CreateFormStore' }
  )
);