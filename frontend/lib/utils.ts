import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  } catch {
    return dateStr;
  }
}

export function calcTotalQuestions(
  types: { count: number }[]
): number {
  return types.reduce((acc, t) => acc + t.count, 0);
}

export function calcTotalMarks(
  types: { count: number; marksEach: number }[]
): number {
  return types.reduce((acc, t) => acc + t.count * t.marksEach, 0);
}

export function difficultyClass(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'badge-easy';
    case 'moderate': return 'badge-moderate';
    case 'hard':
    case 'challenging': return 'badge-hard';
    default: return 'badge-easy';
  }
}

export function difficultyLabel(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'challenging': return 'Hard';
    default: return difficulty;
  }
}

export const QUESTION_TYPE_OPTIONS = [
  'Multiple Choice Questions',
  'Short Questions',
  'Long Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'True/False',
  'Fill in the Blanks',
  'Case Study',
] as const;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

export const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:5000';

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}