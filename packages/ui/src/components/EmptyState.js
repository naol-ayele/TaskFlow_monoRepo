"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyState = EmptyState;
const utils_1 = require("../lib/utils");
const Button_1 = require("./Button");
function EmptyState({ icon, title, description, action, className, }) {
    return (<div className={(0, utils_1.cn)("flex flex-col items-center justify-center py-12 text-center", className)}>
      {icon && (<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          {icon}
        </div>)}
      <h3 className="mb-1 text-lg font-semibold text-slate-900">{title}</h3>
      {description && (<p className="mb-4 max-w-sm text-sm text-slate-500">{description}</p>)}
      {action && <Button_1.Button onClick={action.onClick}>{action.label}</Button_1.Button>}
    </div>);
}
