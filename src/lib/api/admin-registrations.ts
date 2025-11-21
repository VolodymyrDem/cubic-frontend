// src/lib/api/admin-registrations.ts

import { api } from "@/lib/api";
import type {
  RegistrationRequest,
  RegistrationUpdateRequest,
  RegistrationActionResponse,
} from "@/types/registrations";

// DTO з бекенду (app/schemas/registration.py -> RegistrationRequestOut)
type RegistrationStatusDto = "pending" | "approved" | "rejected";

interface RegistrationRequestOutDto {
  request_id: string;
  email: string;
  first_name: string;
  last_name: string;
  requested_role: "student" | "teacher";
  status: RegistrationStatusDto;
  created_at: string;

  // можливі додаткові поля
  group_id?: string | null;
  group_name?: string | null;
  subjects?: string[] | null;
}

// Мапінг backend DTO -> frontend RegistrationRequest
function mapDtoToRegistration(dto: RegistrationRequestOutDto): RegistrationRequest {
  const fullName = `${dto.first_name} ${dto.last_name}`.trim();

  return {
    id: dto.request_id,
    email: dto.email,
    fullName,
    role: dto.requested_role,
    status: dto.status,
    submittedAt: dto.created_at,
    groupId: dto.group_id ?? undefined,
    groupName: dto.group_name ?? undefined,
    subjects: dto.subjects ?? undefined,
  };
}

// ---- API-функції ----

// Список заявок
export async function fetchAdminRegistrations(): Promise<RegistrationRequest[]> {
  const data = await api.get<RegistrationRequestOutDto[]>("/api/admin/registrations/");
  return data.map(mapDtoToRegistration);
}

// Оновлення заявки (якщо використовується редагування полів)
export async function updateRegistration(
  id: string,
  payload: RegistrationUpdateRequest,
): Promise<RegistrationRequest> {
  const dto = await api.put<RegistrationRequestOutDto>(
    `/api/admin/registrations/${id}`,
    payload as unknown as Record<string, unknown>,
  );
  return mapDtoToRegistration(dto);
}

// Схвалити заявку
export async function approveRegistration(id: string): Promise<RegistrationActionResponse> {
  const dto = await api.patch<RegistrationRequestOutDto>(
    `/api/admin/registrations/${id}/approve`,
    {},
  );
  const reg = mapDtoToRegistration(dto);
  return {
    success: true,
    message: `Заявку ${reg.fullName} схвалено`,
  };
}

// Відхилити заявку
export async function rejectRegistration(id: string): Promise<RegistrationActionResponse> {
  const dto = await api.patch<RegistrationRequestOutDto>(
    `/api/admin/registrations/${id}/reject`,
    {},
  );
  const reg = mapDtoToRegistration(dto);
  return {
    success: true,
    message: `Заявку ${reg.fullName} відхилено`,
  };
}
