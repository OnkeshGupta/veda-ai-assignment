export type QuestionType =
  | 'Multiple Choice Questions'
  | 'Short Questions'
  | 'Long Questions'
  | 'Diagram/Graph-Based Questions'
  | 'Numerical Problems'
  | 'True/False'
  | 'Fill in the Blanks'
  | 'Case Study';

export interface QuestionTypeEntry {
  id: string;
  type: QuestionType | string;
  count: number;
  marksEach: number;
}

export interface CreateAssignmentInput {
  title: string;
  subject?: string;
  className?: string;
  dueDate: string;         
  questionTypes: QuestionTypeEntry[];
  additionalInstructions?: string;
  fileUrl?: string;         
  fileName?: string;
}

export type AssignmentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Assignment {
  _id: string;
  title: string;
  subject?: string;
  className?: string;
  dueDate: string;
  createdAt: string;
  status: AssignmentStatus;
  questionTypes: QuestionTypeEntry[];
  additionalInstructions?: string;
  fileUrl?: string;
  fileName?: string;
  resultId?: string;              
}

export type Difficulty = 'Easy' | 'Moderate' | 'Hard';

export interface Question {
  number: number;
  text: string;
  difficulty: Difficulty;
  marks: number;
  answer?: string;             
}

export interface Section {
  title: string;            
  instruction: string;           
  questions: Question[];
}

export interface QuestionPaper {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;         
  maximumMarks: number;
  generalInstructions: string[];
  sections: Section[];
  answerKey?: AnswerKeyEntry[];
}

export interface AnswerKeyEntry {
  sectionTitle: string;
  questionNumber: number;
  answer: string;
}

export interface AssessmentResult {
  _id: string;
  assignmentId: string;
  paper: QuestionPaper;
  createdAt: string;
  jobId: string;
}

export type JobStatus =
  | 'queued'
  | 'processing'
  | 'generating'
  | 'structuring'
  | 'saving'
  | 'completed'
  | 'failed';

export interface JobProgressEvent {
  jobId: string;
  assignmentId: string;
  status: JobStatus;
  progress: number;           
  message: string;
  resultId?: string;           
  error?: string;           
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CreateAssignmentResponse {
  assignment: Assignment;
  jobId: string;
}

export interface AssignmentStore {
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
}

export interface CreateFormStore {
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

  setField: <K extends keyof CreateFormStore>(key: K, value: CreateFormStore[K]) => void;
  addQuestionType: () => void;
  removeQuestionType: (id: string) => void;
  updateQuestionType: (id: string, updates: Partial<QuestionTypeEntry>) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  totalQuestions: () => number;
  totalMarks: () => number;
}