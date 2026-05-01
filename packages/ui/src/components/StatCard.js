"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatCard = StatCard;
const lucide_react_1 = require("lucide-react");
const utils_1 = require("../lib/utils");
function StatCard({ value, label, trend, accent = false, className, ...props }) {
    return (<div className={(0, utils_1.cn)("flex flex-col rounded-lg border border-[var(--border)] p-4", accent
            ? "bg-[var(--accent)] border-transparent"
            : "bg-[var(--surface)]", className)} {...props}>
      <span className={(0, utils_1.cn)("text-3xl font-bold", accent ? "text-black" : "text-[var(--text-primary)]")}>
        {value}
      </span>
      <div className="mt-1 flex items-center justify-between">
        <span className={(0, utils_1.cn)("text-sm", accent ? "text-black/70" : "text-[var(--text-muted)]")}>
          {label}
        </span>
        {trend && (<div className={(0, utils_1.cn)("flex items-center gap-1 text-sm", trend.isPositive
                ? accent
                    ? "text-black"
                    : "text-green-500"
                : accent
                    ? "text-black"
                    : "text-red-500")}>
            {trend.isPositive ? (<lucide_react_1.TrendingUp className="h-4 w-4"/>) : (<lucide_react_1.TrendingDown className="h-4 w-4"/>)}
            <span>{Math.abs(trend.value)}%</span>
          </div>)}
      </div>
    </div>);
}
