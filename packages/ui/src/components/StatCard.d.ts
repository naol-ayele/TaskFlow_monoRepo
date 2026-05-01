import { HTMLAttributes } from "react";
export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
    value: string | number;
    label: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    accent?: boolean;
}
export declare function StatCard({ value, label, trend, accent, className, ...props }: StatCardProps): import("react").JSX.Element;
//# sourceMappingURL=StatCard.d.ts.map