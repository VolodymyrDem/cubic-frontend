// src/lib/adminApi.ts
import { api } from "./api";

export interface RegistrationRequest {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  patronymic?: string;
  role: "student" | "teacher";
  created_at: string;
  status: "pending_approval";
}

/**
 * Fetch all pending registration requests
 */
export async function getRegistrationRequests(): Promise<RegistrationRequest[]> {
  return api.get<RegistrationRequest[]>("/api/admin/registration-requests");
}

/**
 * Approve a registration request
 */
export async function approveRegistrationRequest(userId: string): Promise<void> {
  return api.post<void>(`/api/admin/registration-requests/${userId}/approve`);
}

/**
 * Decline a registration request
 */
export async function declineRegistrationRequest(userId: string): Promise<void> {
  return api.post<void>(`/api/admin/registration-requests/${userId}/decline`);
}

