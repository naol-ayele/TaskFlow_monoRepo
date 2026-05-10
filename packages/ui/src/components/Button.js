"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const react_1 = require("react");
const utils_1 = require("../lib/utils");
exports.Button = (0, react_1.forwardRef)(({ className, variant = "default", size = "default", ...props }, ref) => {
    return (<button className={(0, utils_1.cn)("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", {
            "bg-slate-900 text-white hover:bg-slate-900/90": variant === "default",
            "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900": variant === "outline",
            "hover:bg-slate-100 hover:text-slate-900": variant === "ghost",
            "text-slate-900 underline-offset-4 hover:underline": variant === "link",
            "bg-red-500 text-white hover:bg-red-500/90": variant === "destructive",
        }, {
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8": size === "lg",
            "h-10 w-10": size === "icon",
        }, className)} ref={ref} {...props}/>);
});
exports.Button.displayName = "Button";
