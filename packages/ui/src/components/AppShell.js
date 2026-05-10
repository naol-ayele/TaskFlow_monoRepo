"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppShell = AppShell;
const Sidebar_1 = require("./Sidebar");
const TopBar_1 = require("./TopBar");
function AppShell({ children, sidebarItems, activeHref, logo, userName, userAvatarUrl, notificationCount = 0, }) {
    return (<div className="min-h-screen bg-[var(--background)]">
      <Sidebar_1.Sidebar items={sidebarItems} activeHref={activeHref} logo={logo}/>
      <TopBar_1.TopBar userName={userName} userAvatarUrl={userAvatarUrl} notificationCount={notificationCount}/>
      <main className="ml-60 mt-16 flex-1 p-6">{children}</main>
    </div>);
}
