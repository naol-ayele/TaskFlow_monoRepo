"use client";

import "@taskflow/ui/globals.css";
import Link from "next/link";
import { useState } from "react";
import {
  Home,
  CheckSquare,
  FileText,
  Timer,
  MessageCircle,
  PanelLeft,
} from "lucide-react";
import { TimerProvider } from "./timer-context";

export const CURRENT_USER_ID = "user_member5";
export const CURRENT_USER_NAME = "Member 5";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/timer", label: "Timer", icon: Timer },
  { href: "/chat", label: "Chat", icon: MessageCircle },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <html lang="en">
      <body>
        <div className="h-screen overflow-hidden bg-[var(--background)]">
          <nav
            className="fixed left-0 top-0 h-screen w-60 border-r border-[var(--border)] bg-[var(--surface)] p-4"
            style={{ display: sidebarOpen ? "block" : "none" }}
          >
            <div className="mb-6 text-xl font-bold text-[var(--accent)]">
              TaskFlow
            </div>
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
          <main
            className="ml-60 h-screen flex flex-col"
            style={{ marginLeft: sidebarOpen ? "240px" : "0" }}
          >
            <header className="flex-shrink-0 px-6 pt-6 pb-4 flex items-center justify-between">
              <h1 className="text-lg font-semibold text-[var(--text-primary)]">
                {CURRENT_USER_NAME}'s Dashboard
              </h1>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded hover:bg-[var(--surface-raised)]"
              >
                <PanelLeft className="h-5 w-5" />
              </button>
            </header>
            <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6">
              <TimerProvider>{children}</TimerProvider>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}