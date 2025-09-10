// src/lib/api.ts
export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";


export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";


type Json = Record<string, unknown> | undefined;


async function request<T>(path: string, opts: { method?: HttpMethod; body?: Json; headers?: Record<string, string> } = {}): Promise<T> {
    const { method = "GET", body, headers } = opts;
    const res = await fetch(API_BASE + path, {
        method,
        credentials: "include",
        headers: {
            ...(body ? { "Content-Type": "application/json" } : {}),
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    });


    if (!res.ok) {
        // Try to extract JSON error; fall back to text
        let err: any = { status: res.status, statusText: res.statusText };
        try { err = { ...err, ...(await res.json()) }; } catch { /* ignore */ }
        throw err;
    }


    // 204 No Content case
    if (res.status === 204) return undefined as unknown as T;


    try { return (await res.json()) as T; } catch {
        return undefined as unknown as T;
    }
}


export const api = {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body?: Json) => request<T>(path, { method: "POST", body }),
    put: <T>(path: string, body?: Json) => request<T>(path, { method: "PUT", body }),
    patch: <T>(path: string, body?: Json) => request<T>(path, { method: "PATCH", body }),
    delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};