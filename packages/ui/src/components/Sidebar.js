"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = Sidebar;
const react_router_dom_1 = require("react-router-dom");
const utils_1 = require("../lib/utils");
function Sidebar({ items, activeHref, logo }) {
    return (<aside className="fixed left-0 top-0 z-40 h-screen w-60 border-r border-[var(--border)] bg-[var(--surface)]">
      <div className="flex h-16 items-center border-b border-[var(--border)] px-4">
        {logo && (<div className="text-lg font-bold text-[var(--accent)]">{logo}</div>)}
      </div>
      <nav className="p-2">
        {items.map((item) => {
            const isActive = item.href === activeHref ||
                (item.href !== "/" && activeHref.startsWith(item.href));
            return (<react_router_dom_1.Link key={item.href} to={item.href} className={(0, utils_1.cn)("flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors", isActive
                    ? "bg-[var(--accent)] text-black"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]")}>
              <div className={(0, utils_1.cn)(isActive && "text-black")}>{item.icon}</div>
              <span>{item.label}</span>
            </react_router_dom_1.Link>);
        })}
      </nav>
    </aside>);
}
