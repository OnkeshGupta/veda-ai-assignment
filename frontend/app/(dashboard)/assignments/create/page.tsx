'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { useCreateFormStore } from '@/store/createFormStore';
import { useAssignmentStore } from '@/store/assignmentStore';
import { createAssignment } from '@/lib/api';
import { QUESTION_TYPE_OPTIONS } from '@/lib/utils';
import { useSocketJob } from '@/hooks/useSocketJob';

function IconUpload() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 16V8M12 8L9 11M12 8L15 11" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 16.7C21.2 15.8 22 14.5 22 13C22 10.2 19.8 8 17 8C16.7 8 16.4 8 16.1 8.1C15.2 5.7 12.8 4 10 4C6.7 4 4 6.7 4 10C4 10.4 4 10.8 4.1 11.1C2.3 11.6 1 13.2 1 15C1 17.2 2.8 19 5 19H18C19.1 19 20 18.1 20 17C20 16.9 20 16.8 20 16.7Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="11" rx="2" stroke="#9CA3AF" strokeWidth="1.2" />
      <path d="M2 7H14" stroke="#9CA3AF" strokeWidth="1.2" />
      <path d="M5 1V4M11 1V4" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 2V12M2 7H12" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconMinus() {
  return (
    <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
      <path d="M1 1H9" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconPlusSmall() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M5 1V9M1 5H9" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconX() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 2L10 10M10 2L2 10" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconMic() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="5.5" y="1" width="5" height="8" rx="2.5" stroke="#9CA3AF" strokeWidth="1.2" />
      <path d="M3 7.5C3 10.2614 5.23858 12.5 8 12.5C10.7614 12.5 13 10.2614 13 7.5" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8 12.5V15" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function IconArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconSpinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-spin">
      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      <path d="M8 2C8 2 12 2 14 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '500',
  color: '#374151',
  marginBottom: '6px',
  fontFamily: 'var(--font-primary)',
};

function Stepper({ value, onChange, min = 1 }: { value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <button className="stepper-btn" onClick={() => onChange(Math.max(min, value - 1))} type="button">
        <IconMinus />
      </button>
      <span style={{
        minWidth: '24px', textAlign: 'center',
        fontFamily: 'var(--font-primary)', fontSize: '14px',
        fontWeight: '500', color: '#181818',
      }}>
        {value}
      </span>
      <button className="stepper-btn" onClick={() => onChange(value + 1)} type="button">
        <IconPlusSmall />
      </button>
    </div>
  );
}

export default function CreateAssignmentPage() {
  const router = useRouter();
  const store = useCreateFormStore();
  const { addAssignment, setCurrentJob } = useAssignmentStore();
  const { listenToJob } = useSocketJob();

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) store.setUploadedFile(accepted[0]);
  }, [store]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'], 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  async function handleSubmit() {
    if (store.isSubmitting) return;
    if (!store.title.trim()) return alert('Please enter an assignment title');
    if (!store.dueDate) return alert('Please select a due date');
    if (store.questionTypes.length === 0) return alert('Please add at least one question type');

    store.setIsSubmitting(true);
    
    // Yield to the browser so the "Generating..." UI can paint immediately!
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      const { assignment, jobId } = await createAssignment({
        title: store.title,
        subject: store.subject,
        className: store.className,
        dueDate: store.dueDate,
        questionTypes: store.questionTypes,
        additionalInstructions: store.additionalInstructions,
      }, store.uploadedFile ?? undefined);

      addAssignment(assignment);
      listenToJob(assignment._id, jobId, (event) => {
        setCurrentJob(event);
      });
      store.reset();
      router.push(`/assignments/${assignment._id}/view`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong');
      store.setIsSubmitting(false);
    }
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '9999px',
            background: '#22C55E', display: 'inline-block',
          }} className="animate-pulse-dot" />
          <h1 style={{
            fontFamily: 'var(--font-primary)', fontSize: '20px',
            fontWeight: '600', color: '#181818', letterSpacing: '-0.03em',
          }}>
            Create Assignment
          </h1>
        </div>
        <p style={{ fontFamily: 'var(--font-primary)', fontSize: '13px', color: '#6B7280', marginLeft: '16px' }}>
          Set up a new assignment for your students
        </p>
      </div>

      <div style={{ maxWidth: '740px', width: '100%', margin: '0 auto' }}>

      <div style={{ marginBottom: '20px' }}>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${store.isSubmitting ? 100 : (store.title && store.dueDate ? 50 : 0)}%`, transition: 'width 300ms ease-out' }} />
        </div>
      </div>

      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '28px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-primary)', fontSize: '16px',
          fontWeight: '600', color: '#181818',
          letterSpacing: '-0.02em', marginBottom: '4px',
        }}>
          Assignment Details
        </h2>
        <p style={{ fontFamily: 'var(--font-primary)', fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>
          Basic information about your assignment
        </p>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>
            Assignment Title <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Quiz on Electricity"
            value={store.title}
            onChange={e => store.setTitle(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Subject</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Science"
              value={store.subject}
              onChange={e => store.setSubject(e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Class / Grade</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Grade 8"
              value={store.className}
              onChange={e => store.setClassName(e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          {store.uploadedFile ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 16px',
              border: '1px solid #E5E7EB', borderRadius: '14px',
              background: '#F9F9F9',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: '500', color: '#181818', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {store.uploadedFile.name}
                </p>
                <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>
                  {(store.uploadedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={() => store.setUploadedFile(null)}
                style={{
                  width: '24px', height: '24px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  borderRadius: '9999px', border: 'none',
                  background: '#F0F0F0', cursor: 'pointer',
                }}
              >
                <IconX />
              </button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              style={{
                border: `2px dashed ${isDragActive ? '#E8500A' : '#E5E7EB'}`,
                borderRadius: '14px',
                padding: '28px 20px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '10px',
                cursor: 'pointer', textAlign: 'center',
                background: isDragActive ? '#FFF8F5' : '#FAFAFA',
                transition: 'all 150ms',
              }}
            >
              <input {...getInputProps()} />
              <IconUpload />
              <div>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '14px', color: '#374151' }}>
                  Choose a file or drag & drop it here
                </p>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>
                  JPEG, PNG, upto 10MB
                </p>
              </div>
              <button type="button" style={{
                padding: '6px 18px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                background: '#FFFFFF',
                fontFamily: 'var(--font-primary)',
                fontSize: '13px', color: '#374151',
                cursor: 'pointer',
              }}>
                Browse Files
              </button>
            </div>
          )}
          <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '6px', fontFamily: 'var(--font-primary)' }}>
            Upload images of your preferred document/image
          </p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>
            Due Date <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="date"
              className="form-input"
              value={store.dueDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => store.setDueDate(e.target.value)}
              style={{ paddingRight: '40px', color: store.dueDate ? '#181818' : '#9CA3AF' }}
            />
            <div style={{
              position: 'absolute', right: '12px', top: '50%',
              transform: 'translateY(-50%)', pointerEvents: 'none',
            }}>
              <IconCalendar />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto auto auto',
            gap: '12px',
            alignItems: 'center',
            marginBottom: '10px',
          }}>
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#374151', fontFamily: 'var(--font-primary)' }}>
              Question Type
            </span>
            <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'var(--font-primary)', textAlign: 'center', minWidth: '100px' }}>
              No. of Questions
            </span>
            <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'var(--font-primary)', textAlign: 'center', minWidth: '80px' }}>
              Marks
            </span>
            <span style={{ width: '20px' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {store.questionTypes.map(qt => (
              <div key={qt.id} style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto auto',
                gap: '12px',
                alignItems: 'center',
              }}>
                <select
                  className="form-input"
                  value={qt.type}
                  onChange={e => store.updateQuestionType(qt.id, { type: e.target.value })}
                  style={{ cursor: 'pointer' }}
                >
                  {QUESTION_TYPE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                <div style={{ minWidth: '100px', display: 'flex', justifyContent: 'center' }}>
                  <Stepper value={qt.count} onChange={v => store.updateQuestionType(qt.id, { count: v })} />
                </div>

                <div style={{ minWidth: '80px', display: 'flex', justifyContent: 'center' }}>
                  <Stepper value={qt.marksEach} onChange={v => store.updateQuestionType(qt.id, { marksEach: v })} />
                </div>

                <button
                  onClick={() => store.removeQuestionType(qt.id)}
                  disabled={store.questionTypes.length === 1}
                  style={{
                    width: '20px', height: '20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: 'none', background: 'none', cursor: 'pointer',
                    opacity: store.questionTypes.length === 1 ? 0.3 : 1,
                  }}
                >
                  <IconX />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={store.addQuestionType}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              marginTop: '12px', border: 'none', background: 'none',
              cursor: 'pointer', fontFamily: 'var(--font-primary)',
              fontSize: '14px', fontWeight: '500', color: '#181818',
            }}
          >
            <div style={{
              width: '24px', height: '24px', borderRadius: '9999px',
              background: '#181818', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <IconPlus />
            </div>
            Add Question Type
          </button>

          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: '24px',
            marginTop: '16px', paddingTop: '12px',
            borderTop: '1px solid #F0F0F0',
            fontFamily: 'var(--font-primary)', fontSize: '13px',
          }}>
            <span style={{ color: '#6B7280' }}>
              Total Questions : <strong style={{ color: '#181818' }}>{store.totalQuestions()}</strong>
            </span>
            <span style={{ color: '#6B7280' }}>
              Total Marks : <strong style={{ color: '#181818' }}>{store.totalMarks()}</strong>
            </span>
          </div>
        </div>

        <div>
          <label style={labelStyle}>
            Additional Information <span style={{ color: '#9CA3AF', fontWeight: '400' }}>(For better output)</span>
          </label>
          <div style={{ position: 'relative' }}>
            <textarea
              className="form-input"
              rows={3}
              placeholder="e.g Generate a question paper for 3 hour exam duration.."
              value={store.additionalInstructions}
              onChange={e => store.setAdditionalInstructions(e.target.value)}
              style={{ height: 'auto', minHeight: '88px', padding: '12px 40px 12px 14px', resize: 'none', lineHeight: '1.5' }}
            />
            <div style={{ position: 'absolute', right: '12px', bottom: '12px' }}>
              <IconMic />
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginTop: '24px',
      }}>
        <button className="btn-outline" onClick={() => router.back()}>
          <IconArrowLeft />
          Previous
        </button>

        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={store.isSubmitting}
        >
          {store.isSubmitting ? (
            <><IconSpinner />Generating...</>
          ) : (
            <>Generate Paper<IconArrowRight /></>
          )}
        </button>
      </div>
      </div>
    </div>
  );
}