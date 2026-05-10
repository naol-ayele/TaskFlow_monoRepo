"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CURRENT_USER_NAME = exports.CURRENT_USER_ID = void 0;
exports.default = RootLayout;
require("@taskflow/ui/globals.css");
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
exports.CURRENT_USER_ID = "user_member5";
exports.CURRENT_USER_NAME = "Member 5";
const navItems = [
    { href: "/", label: "Dashboard", icon: lucide_react_1.Home },
    { href: "/tasks", label: "Tasks", icon: lucide_react_1.CheckSquare },
    { href: "/notes", label: "Notes", icon: lucide_react_1.FileText },
    { href: "/timer", label: "Timer", icon: lucide_react_1.Timer },
    { href: "/chat", label: "Chat", icon: lucide_react_1.MessageCircle },
];
function RootLayout({ children, }) {
    return (<div className="min-h-screen bg-[var(--background)]">
      <nav className="fixed left-0 top-0 h-screen w-60 border-r border-[var(--border)] bg-[var(--surface)] p-4" id="sidebar">
        <div className="mb-6 text-xl font-bold text-[var(--accent)]">
          TaskFlow
        </div>
        <div className="flex flex-col gap-2">
          {navItems.map((item) => (<link_1.default key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]">
              <item.icon className="h-5 w-5"/>
              {item.label}
            </link_1.default>))}
        </div>
      </nav>
      <main className="ml-60 p-6" id="main-content">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">
            {exports.CURRENT_USER_NAME}'s Dashboard
          </h1>
          <button id="toggle-sidebar" className="p-2 rounded hover:bg-[var(--surface-raised)]">
            <lucide_react_1.PanelLeft className="h-5 w-5"/>
          </button>
        </header>
        {children}
      </main>
      <script dangerouslySetInnerHTML={{
            __html: `
        document.getElementById('toggle-sidebar').onclick = function() {
          var sidebar = document.getElementById('sidebar');
          var main = document.getElementById('main-content');
          if (sidebar.style.display === 'none') {
            sidebar.style.display = 'block';
            main.style.marginLeft = '240px';
          } else {
            sidebar.style.display = 'none';
            main.style.marginLeft = '0';
          }
        };
      `,
        }}/>
    </div>);
}
