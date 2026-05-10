"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Badge = void 0;
const react_1 = require("react");
const utils_1 = require("../lib/utils");
exports.Badge = (0, react_1.forwardRef)(({ className, variant = "default", ...props }, ref) => {
    return (<div className={(0, utils_1.cn)("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2", {
            "border-transparent bg-slate-900 text-white": variant === "default",
            "border-transparent bg-slate-100 text-slate-900": variant === "secondary",
            "border-transparent bg-green-500 text-white": variant === "success",
            "border-transparent bg-yellow-500 text-white": variant === "warning",
            "border-transparent bg-red-500 text-white": variant === "danger",
            "border-slate-200 text-slate-900": variant === "outline",
        }, className)} ref={ref} {...props}/>);
});
exports.Badge.displayName = "Badge";
