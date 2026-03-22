'use client';

import type { AssessmentResult, Assignment } from '@/types';
import { difficultyClass, difficultyLabel } from '@/lib/utils';
import dynamic from 'next/dynamic';

const PDFDownloadButton = dynamic(
  () => import('./PDFDownloadButton'),
  {
    ssr: false,
    loading: () => (
      <button style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '8px 16px', background: '#FFFFFF', color: '#181818',
        border: 'none', borderRadius: '8px', fontSize: '13px',
        fontWeight: '500', cursor: 'not-allowed', opacity: 0.6,
        fontFamily: 'var(--font-primary)',
      }}>
        Loading...
      </button>
    ),
  }
);

interface Props {
  result: AssessmentResult;
  assignment: Assignment;
}

export default function QuestionPaperView({ result, assignment }: Props) {
  const { paper } = result;

  const aiMessage = [
    'Certainly! Here is your customized Question Paper',
    assignment.subject ? ` for ${assignment.subject}` : '',
    assignment.className ? ` — ${assignment.className}` : '',
    assignment.title ? ` on "${assignment.title}"` : '',
    '.',
  ].join('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      <div style={{
        background: '#1E1E1E',
        borderRadius: '16px',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        <p style={{
          fontFamily: 'var(--font-primary)',
          fontSize: '14px',
          color: '#FFFFFF',
          lineHeight: '1.6',
          fontWeight: '400',
        }}>
          {aiMessage}
        </p>

        <PDFDownloadButton result={result} assignment={assignment} />
      </div>

      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '40px 48px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        fontFamily: 'var(--font-primary)',
      }}>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{
            fontSize: '24px', fontWeight: '700',
            color: '#181818', letterSpacing: '-0.02em',
            marginBottom: '6px',
          }}>
            {paper.schoolName}
          </h1>
          <p style={{ fontSize: '15px', color: '#181818', fontWeight: '600', marginBottom: '4px' }}>
            Subject: {paper.subject}
          </p>
          <p style={{ fontSize: '15px', color: '#181818', fontWeight: '600' }}>
            Class: {paper.className}
          </p>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginBottom: '10px', fontSize: '14px', color: '#181818', fontWeight: '600'
        }}>
          <span>Time Allowed: {paper.timeAllowed}</span>
          <span>Maximum Marks: {paper.maximumMarks}</span>
        </div>

        {paper.generalInstructions && paper.generalInstructions.length > 0
          ? (
            <div style={{ marginBottom: '20px', marginTop: '16px' }}>
              <p style={{ fontSize: '14px', color: '#181818', fontWeight: '600', marginBottom: '8px' }}>
                All questions are compulsory unless stated otherwise.
              </p>
              {paper.generalInstructions.map((inst, i) => {
                if (inst.toLowerCase().includes('compulsory')) return null;
                return (
                  <p key={i} style={{ fontSize: '14px', color: '#181818', marginBottom: '4px' }}>
                    {inst}
                  </p>
                );
              })}
            </div>
          )
          : null}

        <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', marginBottom: '16px' }} />

        <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['Name', 'Roll Number', `Class: ${paper.className} Section`].map((label) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#181818', fontWeight: '600', flexShrink: 0 }}>{label}:</span>
              <div style={{ flex: 1, maxWidth: '200px', height: '1px', background: '#181818', marginTop: '12px' }} />
            </div>
          ))}
        </div>

        {paper.sections.map((section, sIdx) => (
          <div key={sIdx} style={{ marginBottom: '28px' }}>

            <h2 style={{
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: '700',
              color: '#181818',
              marginBottom: '16px',
              marginTop: '16px',
              letterSpacing: '-0.01em',
            }}>
              {section.title}
            </h2>

            <p style={{
              fontSize: '13px',
              color: '#181818',
              fontStyle: 'italic',
              marginBottom: '16px',
            }}>
              {section.instruction}
            </p>

            <ol style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {section.questions.map((q) => (
                <li
                  key={q.number}
                  style={{ display: 'flex', gap: '6px', fontSize: '14px', color: '#181818', lineHeight: '1.7' }}
                >
                  <span style={{ flexShrink: 0, minWidth: '20px' }}>
                    {q.number}.
                  </span>

                  <span style={{ flex: 1 }}>
                    <span style={{ color: '#4B5563', marginRight: '4px' }}>
                      [{q.difficulty}]
                    </span>
                    {q.text}
                    {q.marks > 0 && (
                      <span style={{ color: '#4B5563', marginLeft: '4px' }}>
                        [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ))}

        <p style={{
          fontSize: '14px', fontWeight: '700',
          color: '#181818', marginBottom: '24px',
        }}>
          End of Question Paper
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', marginBottom: '20px' }} />

        {paper.answerKey && paper.answerKey.length > 0 && (
          <div>
            <h3 style={{
              fontSize: '18px', fontWeight: '700',
              color: '#181818', marginBottom: '16px',
              letterSpacing: '-0.01em',
            }}>
              Answer Key:
            </h3>
            <ol style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {paper.answerKey.map((a, i) => (
                <li key={i} style={{ display: 'flex', gap: '6px', fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
                  <span style={{ flexShrink: 0, minWidth: '20px' }}>
                    {a.questionNumber}.
                  </span>
                  <span>{a.answer}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}