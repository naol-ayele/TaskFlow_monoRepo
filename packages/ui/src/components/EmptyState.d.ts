import { ReactNode } from "react";
export interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}
export declare function EmptyState({ icon, title, description, action, className, }: EmptyStateProps): import("react").JSX.Element;
//# sourceMappingURL=EmptyState.d.ts.map