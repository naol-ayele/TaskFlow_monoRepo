"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Avatar = Avatar;
const utils_1 = require("../lib/utils");
function getInitials(name) {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0)
        return "?";
    if (parts.length === 1)
        return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
function getColorFromName(name) {
    const colors = [
        "bg-red-500",
        "bg-orange-500",
        "bg-amber-500",
        "bg-yellow-500",
        "bg-lime-500",
        "bg-green-500",
        "bg-emerald-500",
        "bg-teal-500",
        "bg-cyan-500",
        "bg-sky-500",
        "bg-blue-500",
        "bg-indigo-500",
        "bg-violet-500",
        "bg-purple-500",
        "bg-fuchsia-500",
        "bg-pink-500",
        "bg-rose-500",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}
function Avatar({ name, avatarUrl, size = "default", className, ...props }) {
    const initials = getInitials(name);
    const bgColor = getColorFromName(name);
    return (<div className={(0, utils_1.cn)("relative flex shrink-0 overflow-hidden rounded-full", {
            "h-8 w-8 text-xs": size === "sm",
            "h-10 w-10 text-sm": size === "default",
            "h-12 w-12 text-base": size === "lg",
        }, className)} {...props}>
      {avatarUrl ? (<img src={avatarUrl} alt={name} className="aspect-square h-full w-full object-cover"/>) : (<div className={(0, utils_1.cn)("flex h-full w-full items-center justify-center font-medium text-white", bgColor)}>
          {initials}
        </div>)}
    </div>);
}
