"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
const react_1 = require("react");
const utils_1 = require("../lib/utils");
exports.Input = (0, react_1.forwardRef)(({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (<div className="w-full">
        {label && (<label htmlFor={inputId} className="text-sm font-medium text-slate-900">
            {label}
          </label>)}
        {label && <div className="mt-1.5"/>}
        <input id={inputId} className={(0, utils_1.cn)("flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", error && "border-red-500 focus:ring-red-500", className)} ref={ref} {...props}/>
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      </div>);
});
exports.Input.displayName = "Input";
