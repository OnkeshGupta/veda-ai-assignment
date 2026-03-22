import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';
import type { IQuestionPaper, ISection, IQuestion, IAnswerKeyEntry } from '../models/Result';
import type { IQuestionTypeEntry } from '../models/Assignment';

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

interface GenerateInput {
  title: string;
  subject?: string;
  className?: string;
  questionTypes: IQuestionTypeEntry[];
  additionalInstructions?: string;
  fileContent?: string;
}

interface RawQuestion {
  number: number;
  text: string;
  difficulty: string;
  marks: number;
  answer?: string;
}

interface RawSection {
  title: string;
  instruction: string;
  questions: RawQuestion[];
}

interface RawPaper {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maximumMarks: number;
  generalInstructions: string[];
  sections: RawSection[];
  answerKey: IAnswerKeyEntry[];
}

function buildPrompt(input: GenerateInput): string {
  const totalQuestions = input.questionTypes.reduce((s, q) => s + q.count, 0);
  const totalMarks = input.questionTypes.reduce((s, q) => s + q.count * q.marksEach, 0);

  const questionBreakdown = input.questionTypes
    .map(
      (qt, i) =>
        `Section ${String.fromCharCode(65 + i)} — ${qt.type}: ${qt.count} question(s), ${qt.marksEach} mark(s) each`
    )
    .join('\n');

  return `You are an expert teacher creating a formal examination question paper.

ASSIGNMENT DETAILS:
- Title: ${input.title}
- Subject: ${input.subject ?? 'General'}
- Class/Grade: ${input.className ?? 'Standard'}
- Total Questions: ${totalQuestions}
- Total Marks: ${totalMarks}

QUESTION BREAKDOWN:
${questionBreakdown}

${input.additionalInstructions ? `ADDITIONAL INSTRUCTIONS:\n${input.additionalInstructions}` : ''}

${input.fileContent ? `REFERENCE MATERIAL:\n${input.fileContent}` : ''}

TASK:
Generate a complete, well-structured examination question paper.

STRICT OUTPUT FORMAT — Respond with ONLY valid JSON, no markdown, no explanation, no code fences.
The JSON must match this exact structure:

{
  "schoolName": "Delhi Public School",
  "subject": "${input.subject ?? 'General'}",
  "className": "${input.className ?? 'Standard'}",
  "timeAllowed": "<calculated based on total marks, e.g. '3 Hours'>",
  "maximumMarks": ${totalMarks},
  "generalInstructions": [
    "All questions are compulsory unless stated otherwise.",
    "Write neatly and clearly.",
    "Marks are indicated against each question."
  ],
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions. Each question carries X marks.",
      "questions": [
        {
          "number": 1,
          "text": "<full question text>",
          "difficulty": "Easy",
          "marks": <number>,
          "answer": "<detailed answer for answer key>"
        }
      ]
    }
  ],
  "answerKey": [
    {
      "sectionTitle": "Section A",
      "questionNumber": 1,
      "answer": "<detailed answer>"
    }
  ]
}

RULES:
1. difficulty must be exactly one of: "Easy", "Moderate", "Hard"
2. Distribute difficulty: ~40% Easy, ~40% Moderate, ~20% Hard
3. Each section corresponds to one question type from the breakdown
4. Question numbers are continuous across sections (1, 2, 3... not restarting per section)
5. timeAllowed: use "1 Hour" for ≤30 marks, "2 Hours" for 31–60, "3 Hours" for 61+
6. Generate realistic, subject-appropriate questions
7. answerKey must have an entry for every question
8. Return ONLY the JSON object — no other text`;
}

function normalizeDifficulty(raw: string): 'Easy' | 'Moderate' | 'Hard' {
  const s = raw.toLowerCase();
  if (s === 'easy') return 'Easy';
  if (s === 'moderate' || s === 'medium') return 'Moderate';
  if (s === 'hard' || s === 'challenging') return 'Hard';
  return 'Moderate';
}

function parseAndValidate(rawJson: string): IQuestionPaper {
  const cleaned = rawJson
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  let raw: RawPaper;
  try {
    raw = JSON.parse(cleaned) as RawPaper;
  } catch {
    throw new Error('AI returned invalid JSON. Please try again.');
  }

  if (!raw.sections || !Array.isArray(raw.sections) || raw.sections.length === 0) {
    throw new Error('AI response missing sections');
  }

  const sections: ISection[] = raw.sections.map((sec, sIdx) => {
    if (!sec.title) sec.title = `Section ${String.fromCharCode(65 + sIdx)}`;
    if (!sec.instruction) sec.instruction = 'Attempt all questions.';

    const questions: IQuestion[] = (sec.questions ?? []).map((q, qIdx) => ({
      number: typeof q.number === 'number' ? q.number : qIdx + 1,
      text: typeof q.text === 'string' ? q.text.trim() : `Question ${qIdx + 1}`,
      difficulty: normalizeDifficulty(q.difficulty ?? 'Moderate'),
      marks: typeof q.marks === 'number' && q.marks > 0 ? q.marks : 1,
      answer: typeof q.answer === 'string' ? q.answer.trim() : undefined,
    }));

    return { title: sec.title, instruction: sec.instruction, questions };
  });

  const answerKey: IAnswerKeyEntry[] = Array.isArray(raw.answerKey)
    ? raw.answerKey.map((a) => ({
      sectionTitle: a.sectionTitle ?? '',
      questionNumber: a.questionNumber ?? 0,
      answer: a.answer ?? '',
    }))
    : [];

  return {
    schoolName: typeof raw.schoolName === 'string' ? raw.schoolName : 'Delhi Public School',
    subject: typeof raw.subject === 'string' ? raw.subject : 'General',
    className: typeof raw.className === 'string' ? raw.className : 'Standard',
    timeAllowed: typeof raw.timeAllowed === 'string' ? raw.timeAllowed : '3 Hours',
    maximumMarks: typeof raw.maximumMarks === 'number' ? raw.maximumMarks : 0,
    generalInstructions: Array.isArray(raw.generalInstructions) ? raw.generalInstructions : [],
    sections,
    answerKey,
  };
}

export async function generateQuestionPaper(
  input: GenerateInput
): Promise<IQuestionPaper> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const prompt = buildPrompt(input);

  let rawText: string;
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    rawText = response.text();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gemini API error';
    throw new Error(`AI generation failed: ${message}`);
  }

  if (!rawText || rawText.trim().length === 0) {
    throw new Error('AI returned empty response');
  }

  return parseAndValidate(rawText);
}