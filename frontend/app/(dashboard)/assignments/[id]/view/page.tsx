"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getAssignment, getResult, regenerateAssignment } from "@/lib/api";
import { useAssignmentSocket } from "@/hooks/useSocketJob";
import { useAssignmentStore } from "@/store/assignmentStore";
import type { Assignment, AssessmentResult, JobProgressEvent } from "@/types";
import ProcessingState from "@/components/output/ProcessingState";
import QuestionPaperView from "@/components/output/QuestionPaperView";

function IconRefresh() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M12 7C12 9.76142 9.76142 12 7 12C4.23858 12 2 9.76142 2 7C2 4.23858 4.23858 2 7 2C8.66 2 10.13 2.8 11.05 4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M11 1V4H8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconSpinner() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="animate-spin"
    >
      <circle
        cx="7"
        cy="7"
        r="5.5"
        stroke="rgba(24,24,24,0.2)"
        strokeWidth="1.5"
      />
      <path
        d="M7 1.5C7 1.5 10.5 1.5 12.5 5"
        stroke="#181818"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AssignmentViewPage() {
  const params = useParams();
  const id = params.id as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [jobProgress, setJobProgress] = useState<JobProgressEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const updateAssignment = useAssignmentStore((s) => s.updateAssignment);

  useEffect(() => {
    async function load() {
      try {
        const a = await getAssignment(id);
        setAssignment(a);
        if (a.status === "completed" && a.resultId) {
          const r = await getResult(a.resultId);
          setResult(r);
        }
      } catch (err) {
        console.error('Failed to load assignment:', err);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  useAssignmentSocket(id, async (event) => {
    setJobProgress(event);
    if (event.status === "completed" && event.resultId) {
      try {
        const r = await getResult(event.resultId);
        setResult(r);
        setAssignment((prev) =>
          prev
            ? { ...prev, status: "completed", resultId: event.resultId }
            : prev,
        );
        updateAssignment(id, { status: "completed", resultId: event.resultId });
      } catch (err) {
        console.error('Failed to fetch result after completion:', err);
      }
    }
    if (event.status === "failed") {
      setAssignment((prev) => (prev ? { ...prev, status: "failed" } : prev));
      updateAssignment(id, { status: "failed" });
    }
  });

  async function handleRegenerate() {
    if (!assignment || isRegenerating) return;
    setIsRegenerating(true);
    setResult(null);
    setJobProgress(null);
    try {
      await regenerateAssignment(id);
      setAssignment((prev) => (prev ? { ...prev, status: "pending" } : prev));
      updateAssignment(id, { status: "pending" });
    } catch {
      alert("Failed to regenerate. Please try again.");
    } finally {
      setIsRegenerating(false);
    }
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
        }}
      >
        <IconSpinner />
      </div>
    );
  }

  if (loadError) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <p style={{ fontFamily: 'var(--font-primary)', fontSize: '16px', color: '#6B7280' }}>
        Assignment not found or could not be loaded.
      </p>
      <Link href="/assignments">
        <button className="btn-primary" style={{ marginTop: '16px' }}>Back to Assignments</button>
      </Link>
    </div>
  );

  const isProcessing =
    assignment?.status === "pending" || assignment?.status === "processing";

  return (
    <div className="animate-fade-in" style={{ width: "100%", margin: "0 auto" }}>
      {isProcessing && (
        <ProcessingState
          progress={jobProgress}
          title={assignment?.title ?? ""}
        />
      )}

      {result && assignment?.status === "completed" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "16px",
            }}
          >
            <button
              className="btn-outline"
              onClick={handleRegenerate}
              disabled={isRegenerating}
            >
              {isRegenerating ? <IconSpinner /> : <IconRefresh />}
              Regenerate
            </button>
          </div>

          <QuestionPaperView result={result} assignment={assignment} />
        </div>
      )}

      {assignment?.status === "failed" && !result && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "9999px",
              background: "#FEE2E2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 8V12M12 16H12.01"
                stroke="#EF4444"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="12" r="9" stroke="#EF4444" strokeWidth="2" />
            </svg>
          </div>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: "var(--font-primary)",
                fontSize: "18px",
                fontWeight: "600",
                color: "#181818",
                marginBottom: "6px",
              }}
            >
              Generation Failed
            </p>
            <p
              style={{
                fontFamily: "var(--font-primary)",
                fontSize: "14px",
                color: "#6B7280",
              }}
            >
              Something went wrong. Please try again.
            </p>
          </div>
          <button className="btn-primary" onClick={handleRegenerate}>
            <IconRefresh />
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}