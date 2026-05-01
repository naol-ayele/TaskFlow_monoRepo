import { ReactNode } from "react";
export interface SidebarItem {
    href: string;
    label: string;
    icon: ReactNode;
}
export interface SidebarProps {
    items: SidebarItem[];
    activeHref: string;
    logo?: ReactNode;
}
export declare function Sidebar({ items, activeHref, logo }: SidebarProps): import("react").JSX.Element;
//# sourceMappingURL=Sidebar.d.ts.map