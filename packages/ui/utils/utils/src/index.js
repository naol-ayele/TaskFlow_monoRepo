"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = generateId;
exports.formatDate = formatDate;
exports.formatRelativeTime = formatRelativeTime;
exports.truncateText = truncateText;
exports.msToMinutes = msToMinutes;
exports.formatDuration = formatDuration;
exports.isOverdue = isOverdue;
exports.getPriorityColor = getPriorityColor;
exports.getStatusColor = getStatusColor;
const ALPHANUMERIC = "abcdefghijklmnopqrstuvwxyz0123456789";
function randomChars(length) {
    let result = "";
    const values = new Uint32Array(length);
    crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
        const idx = values[i] % ALPHANUMERIC.length;
        result += ALPHANUMERIC.charAt(idx);
    }
    return result;
}
function generateId(prefix) {
    return `${prefix}_${randomChars(8)}`;
}
function formatDate(date) {
    if (!date)
        return "";
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}
function formatRelativeTime(date) {
    if (!date)
        return "";
    const now = Date.now();
    const diff = now - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days >= 1) {
        if (days === 1)
            return "yesterday";
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
function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength)
        return text;
    const ellipsis = "...";
    const available = maxLength - ellipsis.length;
    return text.slice(0, Math.max(available, 0)) + ellipsis;
}
function msToMinutes(ms) {
    return Math.floor(ms / 60000);
}
function formatDuration(minutes) {
    const mins = Math.floor(minutes);
    const secs = minutes % 1 === 0 ? 0 : Math.round((minutes % 1) * 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
function isOverdue(dueDate) {
    if (!dueDate)
        return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
}
function getPriorityColor(priority) {
    const colors = {
        low: "text-green-500",
        medium: "text-yellow-500",
        high: "text-red-500",
    };
    return colors[priority] || colors.medium;
}
function getStatusColor(status) {
    const colors = {
        todo: "text-gray-500",
        in_progress: "text-blue-500",
        done: "text-green-500",
    };
    return colors[status] || colors.todo;
}
