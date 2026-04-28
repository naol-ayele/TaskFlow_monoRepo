# ============================================================
# TaskFlow Setup - Part 2: Patch Member App Configs
# Run AFTER you have created all 4 apps with create-next-app
# ============================================================

Write-Host "TaskFlow Setup - Part 2: Patching member apps" -ForegroundColor Cyan

$members = @("member-1", "member-2", "member-3", "member-4")

foreach ($member in $members) {

  $appPath = "apps/$member"

  if (-not (Test-Path $appPath)) {
    Write-Host "  SKIP: $appPath not found. Create it first with create-next-app." -ForegroundColor DarkYellow
    continue
  }

  Write-Host "  Patching $member..." -ForegroundColor Yellow

  Set-Content "$appPath/next.config.ts" @'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@taskflow/ui",
    "@taskflow/feature-x",
    "@taskflow/feature-y",
  ],
};

export default nextConfig;
'@

  Set-Content "$appPath/tsconfig.json" @'
{
  "extends": "@taskflow/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@taskflow/ui/*": ["../../packages/ui/src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
'@

  Set-Content "$appPath/postcss.config.mjs" @'
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
'@

  Set-Content "$appPath/app/layout.tsx" @'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@taskflow/ui/globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Productivity app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
'@

  Set-Content "$appPath/app/page.tsx" @'
export default function Page() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">TaskFlow</h1>
      <p className="text-gray-500 mt-2">Import your feature components here.</p>
    </main>
  );
}
'@

  Write-Host "    $member patched." -ForegroundColor Green
}

Write-Host "`nPart 2 complete!" -ForegroundColor Cyan
Write-Host "Next steps:"
Write-Host "  1. pnpm install"
Write-Host "  2. pnpm dev"