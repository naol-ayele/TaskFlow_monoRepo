"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spinner = Spinner;
const lucide_react_1 = require("lucide-react");
const utils_1 = require("../lib/utils");
function Spinner({ size = "default", className }) {
    return (<lucide_react_1.Loader2 className={(0, utils_1.cn)("animate-spin text-slate-600", {
            "h-4 w-4": size === "sm",
            "h-6 w-6": size === "default",
            "h-8 w-8": size === "lg",
        }, className)}/>);
}
