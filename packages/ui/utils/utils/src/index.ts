const ALPHANUMERIC = "abcdefghijklmnopqrstuvwxyz0123456789";
function randomChars(length: number): string {
  let result = "";
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);
  for (let i = 0; i < length; i++) {
    const idx = values[i]! % ALPHANUMERIC.length;
    result += ALPHANUMERIC.charAt(idx);
  }
  return result;
}
export function generateId(prefix: string): string {
  return `${prefix}_${randomChars(8)}`;
}
function toDate(date: Date | string | null | undefined): Date | null {
  if (!date) return null;
  if (date instanceof Date) return date;
  const d = new Date(date as string);
  return isNaN(d.getTime()) ? null : d;
}
export function formatDate(date: Date | string | null | undefined): string {
  const d = toDate(date);
  if (!d) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
export function formatRelativeTime(
  date: Date | string | null | undefined,
): string {
  const d = toDate(date);
  if (!d) return "";
  const now = Date.now();
  const diff = now - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days >= 1) {
    if (days === 1) return "yesterday";
    return `${days} days ago`;
  }
  if (hours >= 1) {
    const h = hours === 1 ? "hour" : "hours";
    return `${hours} ${h} ago`;
  }
  if (minutes >= 1) {
    const m = minutes === 1 ? "minute" : "minutes";
    return `${minutes} ${m} ago`;
  }
  return "just now";
}
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  const ellipsis = "...";
  const available = maxLength - ellipsis.length;
  return text.slice(0, Math.max(available, 0)) + ellipsis;
}
export function msToMinutes(ms: number): number {
  return Math.floor(ms / 60000);
}
export function formatDuration(minutes: number): string {
  const mins = Math.floor(minutes);
  const secs = minutes % 1 === 0 ? 0 : Math.round((minutes % 1) * 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
export function isOverdue(dueDate: Date | string | null | undefined): boolean {
  const d = toDate(dueDate);
  if (!d) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(d);
  due.setHours(0, 0, 0, 0);
  return due < today;
}
export function getPriorityColor(priority: "low" | "medium" | "high"): string {
  const colors = {
    low: "bg-green-900 text-green-400",
    medium: "bg-yellow-900 text-yellow-400",
    high: "bg-red-900 text-red-400",
  };
  return colors[priority] || colors.medium;
}
export function getStatusColor(
  status: "todo" | "in_progress" | "done",
): string {
  const colors = {
    todo: "bg-gray-800 text-gray-400",
    in_progress: "bg-blue-900 text-blue-400",
    done: "bg-green-900 text-green-400",
  };
  return colors[status] || colors.todo;
}
