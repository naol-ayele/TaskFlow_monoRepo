"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Textarea = void 0;
const react_1 = require("react");
const utils_1 = require("../lib/utils");
exports.Textarea = (0, react_1.forwardRef)(({ className, label, error, maxLength, showCount, id, value, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const charCount = typeof value === "string" ? value.length : 0;
    return (<div className="w-full">
        {label && (<label htmlFor={inputId} className="text-sm font-medium text-slate-900">
            {label}
          </label>)}
        {label && <div className="mt-1.5"/>}
        <div className="relative">
          <textarea id={inputId} className={(0, utils_1.cn)("flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", error && "border-red-500 focus:ring-red-500", maxLength && showCount && "pb-6", className)} ref={ref} {...props}/>
          {maxLength && showCount && (<span className={(0, utils_1.cn)("absolute bottom-2 right-2 text-xs text-slate-500", charCount >= maxLength && "text-red-500")}>
              {charCount}/{maxLength}
            </span>)}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      </div>);
});
exports.Textarea.displayName = "Textarea";
