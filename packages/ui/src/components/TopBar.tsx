import { Bell, Search } from "lucide-react";
import { cn } from "../lib/utils";
import { Avatar } from "./Avatar";

export interface TopBarProps {
  searchPlaceholder?: string;
  userName: string;
  userAvatarUrl?: string;
  notificationCount?: number;
  onSearch?: (query: string) => void;
}

export function TopBar({
  searchPlaceholder = "Search...",
  userName,
  userAvatarUrl,
  notificationCount = 0,
  onSearch,
}: TopBarProps) {
  return (
    <header className="fixed right-0 top-0 z-30 flex h-16 w-[calc(100%-240px)] items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-6">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative flex flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch?.(e.target.value)}
            className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-black">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>
        <div className="flex items-center gap-3">
          <Avatar name={userName} avatarUrl={userAvatarUrl} size="sm" />
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
}
