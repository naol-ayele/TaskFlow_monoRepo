const USER_ID = "user_member4";
const API_BASE = "http://localhost:3005/api";

export function apiFetch(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-user-id": USER_ID,
    ...((options.headers as Record<string, string>) ?? {}),
  };
  return fetch(API_BASE + path, { ...options, headers });
}
