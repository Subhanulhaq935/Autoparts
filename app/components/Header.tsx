"use client";

import MKSLogo from "./MKSLogo";

interface HeaderProps {
  currentView: "register" | "manager";
  onViewChange: (view: "register" | "manager") => void;
  productsCount: number;
}

export default function Header({ currentView, onViewChange, productsCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-sm dark:border-slate-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <MKSLogo size={42} />
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-950"></div>
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-zinc-900 dark:text-white">
              Shabbir Khan <span className="gradient-text">Auto Body</span> Parts
            </h1>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Band Road, Lahore · Billing System
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <nav className="flex items-center gap-1 rounded-2xl bg-slate-100/80 p-1 dark:bg-zinc-900">
          <button
            onClick={() => onViewChange("register")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              currentView === "register"
                ? "bg-white text-indigo-600 shadow-md shadow-black/5 dark:bg-zinc-800 dark:text-indigo-400"
                : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21a1.5 1.5 0 01-1.5 1.5H3.75A1.5 1.5 0 012.25 21V3.75A1.5 1.5 0 013.75 2.25h13.514M21 3h-6.75" />
            </svg>
            <span className="hidden sm:inline">Billing</span> Register
          </button>
          <button
            onClick={() => onViewChange("manager")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              currentView === "manager"
                ? "bg-white text-indigo-600 shadow-md shadow-black/5 dark:bg-zinc-800 dark:text-indigo-400"
                : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
            <span className="hidden sm:inline">Store</span> Manager
            <span className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-black transition-all ${
              currentView === "manager"
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                : "bg-slate-200 text-slate-600 dark:bg-zinc-700 dark:text-zinc-300"
            }`}>
              {productsCount}
            </span>
          </button>
        </nav>

        {/* Status Badge */}
        <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 sm:flex dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></div>
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            Auto Saved
          </span>
        </div>
      </div>
    </header>
  );
}
