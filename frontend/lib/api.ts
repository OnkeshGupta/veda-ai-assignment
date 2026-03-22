import axios from 'axios';
import { API_BASE_URL } from './utils';
import type {
  Assignment,
  CreateAssignmentInput,
  CreateAssignmentResponse,
  AssessmentResult,
  ApiResponse,
} from '@/types';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Automatically attach user identity for Multi-Tenant isolating
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('veda-user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.id) {
          config.headers['x-user-id'] = parsed.id;
        } else if (parsed.name) {
          config.headers['x-user-id'] = parsed.name; // fallback for pre-existing local storage users
        }
      } catch (e) {
        // ignore JSON parse errors
      }
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ?? err.message ?? 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export async function getAssignments(): Promise<Assignment[]> {
  const res = await apiClient.get<ApiResponse<Assignment[]>>('/assignments');
  return res.data.data ?? [];
}

export async function getAssignment(id: string): Promise<Assignment> {
  const res = await apiClient.get<ApiResponse<Assignment>>(`/assignments/${id}`);
  return res.data.data!;
}

export async function createAssignment(
  data: CreateAssignmentInput,
  file?: File
): Promise<CreateAssignmentResponse> {
  let fileUrl: string | undefined;
  let fileName: string | undefined;

  if (file) {
    const form = new FormData();
    form.append('file', file);
    const uploadRes = await apiClient.post<ApiResponse<{ url: string; name: string }>>(
      '/upload',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    fileUrl = uploadRes.data.data?.url;
    fileName = uploadRes.data.data?.name;
  }

  const res = await apiClient.post<ApiResponse<CreateAssignmentResponse>>(
    '/assignments',
    { ...data, fileUrl, fileName }
  );
  return res.data.data!;
}

export async function deleteAssignment(id: string): Promise<void> {
  await apiClient.delete(`/assignments/${id}`);
}

export async function getResult(resultId: string): Promise<AssessmentResult> {
  const res = await apiClient.get<ApiResponse<AssessmentResult>>(
    `/results/${resultId}`
  );
  return res.data.data!;
}

export async function regenerateAssignment(
  assignmentId: string
): Promise<{ jobId: string }> {
  const res = await apiClient.post<ApiResponse<{ jobId: string }>>(
    `/assignments/${assignmentId}/regenerate`
  );
  return res.data.data!;
}

export default apiClient;