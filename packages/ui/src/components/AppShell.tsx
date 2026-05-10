import { ReactNode } from "react";
import { Sidebar, SidebarItem } from "./Sidebar";
import { TopBar } from "./TopBar";
import { cn } from "../lib/utils";

export interface AppShellProps {
  children: ReactNode;
  sidebarItems: SidebarItem[];
  activeHref: string;
  logo?: ReactNode;
  userName: string;
  userAvatarUrl?: string;
  notificationCount?: number;
}

export function AppShell({
  children,
  sidebarItems,
  activeHref,
  logo,
  userName,
  userAvatarUrl,
  notificationCount = 0,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar items={sidebarItems} activeHref={activeHref} logo={logo} />
      <TopBar
        userName={userName}
        userAvatarUrl={userAvatarUrl}
        notificationCount={notificationCount}
      />
      <main className="ml-60 mt-16 flex-1 p-6">{children}</main>
    </div>
  );
}
