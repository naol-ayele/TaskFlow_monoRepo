import { HTMLAttributes } from "react";
export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
    name: string;
    avatarUrl?: string;
    size?: "sm" | "default" | "lg";
}
export declare function Avatar({ name, avatarUrl, size, className, ...props }: AvatarProps): import("react").JSX.Element;
//# sourceMappingURL=Avatar.d.ts.map