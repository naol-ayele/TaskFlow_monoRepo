"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Select = void 0;
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("../lib/utils");
exports.Select = (0, react_1.forwardRef)(({ className, label, options, placeholder, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (<div className="w-full">
        {label && (<label htmlFor={inputId} className="text-sm font-medium text-slate-900">
            {label}
          </label>)}
        {label && <div className="mt-1.5"/>}
        <div className="relative">
          <select id={inputId} className={(0, utils_1.cn)("flex h-10 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", error && "border-red-500 focus:ring-red-500", className)} ref={ref} {...props}>
            {placeholder && (<option value="" disabled>
                {placeholder}
              </option>)}
            {options.map((option) => (<option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>))}
          </select>
          <lucide_react_1.ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-500 pointer-events-none"/>
        </div>
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      </div>);
});
exports.Select.displayName = "Select";
