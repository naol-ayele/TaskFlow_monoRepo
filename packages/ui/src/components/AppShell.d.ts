import { ReactNode } from "react";
import { SidebarItem } from "./Sidebar";
export interface AppShellProps {
    children: ReactNode;
    sidebarItems: SidebarItem[];
    activeHref: string;
    logo?: ReactNode;
    userName: string;
    userAvatarUrl?: string;
    notificationCount?: number;
}
export declare function AppShell({ children, sidebarItems, activeHref, logo, userName, userAvatarUrl, notificationCount, }: AppShellProps): import("react").JSX.Element;
//# sourceMappingURL=AppShell.d.ts.map