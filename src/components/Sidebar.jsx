import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  LogOut,
  X,
  Plus,
  ChevronRight,
  Sparkles,
  CircleUserRound,
} from "lucide-react";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const [showLogout, setShowLogout] = useState(false);

  const mainNavItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
    },
    {
      name: "Projects",
      icon: FolderKanban,
      path: "/projects",
      badge: "3",
    },
    {
      name: "Tasks",
      icon: CheckSquare,
      path: "/tasks",
    },
    {
      name: "Teams",
      icon: Users,
      path: "/teams",
      badge: "4",
    },
  ];

  const systemNavItems = [
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-slate-800/80 bg-slate-950 text-white shadow-2xl shadow-black/30 transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Background Glow */}
        <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-600/5 blur-3xl" />

        {/* Content */}
        <div className="relative flex min-h-0 flex-1 flex-col">

          {/* Brand */}
          <div className="flex items-center justify-between border-b border-slate-800/70 px-5 py-5">

            <NavLink
              to="/"
              onClick={() => setSidebarOpen(false)}
              className="group flex items-center gap-3"
            >
              {/* Logo */}
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">

                <span className="text-sm font-black text-white">
                  TF
                </span>

                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-emerald-400" />
              </div>

              <div>
                <h1 className="text-lg font-bold tracking-tight text-white">
                  TaskFlow
                </h1>

                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Workspace
                </p>
              </div>
            </NavLink>

            {/* Mobile Close */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 text-slate-500 transition-all hover:border-slate-700 hover:bg-slate-900 hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Workspace */}
          <div className="px-4 pt-5">

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">

              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                  Workspace
                </span>

                <Sparkles
                  size={14}
                  className="text-blue-400"
                />
              </div>

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-bold text-blue-400">
                  MM
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-200">
                    Muhadis Workspace
                  </p>

                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                    <span className="text-[11px] text-slate-500">
                      Personal workspace
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Navigation */}
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">

            {/* Main */}
            <div className="mb-6">

              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                Main Menu
              </p>

              <nav className="space-y-1">

                {mainNavItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/"}
                      onClick={() =>
                        setSidebarOpen(false)
                      }
                      className={({ isActive }) =>
                        `group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300 ${
                          isActive
                            ? "bg-blue-500/10 text-blue-400"
                            : "text-slate-500 hover:bg-slate-900 hover:text-slate-200"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {/* Active Indicator */}
                          {isActive && (
                            <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
                          )}

                          {/* Icon */}
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 ${
                              isActive
                                ? "bg-blue-500/10 text-blue-400"
                                : "bg-transparent text-slate-500 group-hover:bg-slate-800 group-hover:text-slate-300"
                            }`}
                          >
                            <Icon size={18} />
                          </div>

                          <span className="flex-1">
                            {item.name}
                          </span>

                          {/* Badge */}
                          {item.badge && (
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                                isActive
                                  ? "bg-blue-500/15 text-blue-400"
                                  : "bg-slate-800 text-slate-500"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}

                          {/* Arrow */}
                          <ChevronRight
                            size={14}
                            className={`transition-all duration-300 ${
                              isActive
                                ? "translate-x-0 text-blue-400"
                                : "-translate-x-1 text-transparent group-hover:translate-x-0 group-hover:text-slate-600"
                            }`}
                          />
                        </>
                      )}
                    </NavLink>
                  );
                })}

              </nav>
            </div>

            {/* Quick Action */}
            <div className="mb-6">

              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                Quick Action
              </p>

              <button
                onClick={() => {
                  window.location.href = "/projects";
                }}
                className="group flex w-full items-center gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 px-3 py-3 text-left transition-all duration-300 hover:border-blue-500/40 hover:bg-blue-500/10"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 transition-transform duration-300 group-hover:scale-105">
                  <Plus size={18} />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-300">
                    New Project
                  </p>

                  <p className="text-[11px] text-slate-600">
                    Start something new
                  </p>
                </div>

                <ChevronRight
                  size={15}
                  className="text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-blue-400"
                />
              </button>

            </div>

            {/* System */}
            <div>

              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                System
              </p>

              <nav className="space-y-1">

                {systemNavItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() =>
                        setSidebarOpen(false)
                      }
                      className={({ isActive }) =>
                        `group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300 ${
                          isActive
                            ? "bg-blue-500/10 text-blue-400"
                            : "text-slate-500 hover:bg-slate-900 hover:text-slate-200"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-blue-500" />
                          )}

                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                              isActive
                                ? "bg-blue-500/10 text-blue-400"
                                : "text-slate-500 group-hover:bg-slate-800 group-hover:text-slate-300"
                            }`}
                          >
                            <Icon size={18} />
                          </div>

                          <span>{item.name}</span>
                        </>
                      )}
                    </NavLink>
                  );
                })}

              </nav>
            </div>
          </div>

          {/* Bottom User Area */}
          <div className="border-t border-slate-800/70 p-4">

            <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-900/60 p-3">

              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-bold text-white">
                MM

                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-emerald-400" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-200">
                  Muhammad Muhadis
                </p>

                <p className="truncate text-[11px] text-slate-600">
                  Full Stack Developer
                </p>
              </div>

              <CircleUserRound
                size={16}
                className="text-slate-600"
              />

            </div>

            {/* Logout */}
            <button
              onClick={() => setShowLogout(true)}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 transition-all duration-300 hover:bg-red-500/5 hover:text-red-400"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg transition group-hover:bg-red-500/10">
                <LogOut size={18} />
              </div>

              <span>Logout</span>
            </button>

          </div>
        </div>
      </aside>

      {/* Logout Confirmation */}
      {showLogout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50">

            <div className="p-6 text-center">

              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                <LogOut size={24} />
              </div>

              <h2 className="text-lg font-bold text-white">
                Logout from TaskFlow?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                You can sign in again whenever you want.
              </p>

              <div className="mt-6 flex gap-3">

                <button
                  onClick={() => setShowLogout(false)}
                  className="flex-1 rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-400 transition hover:border-slate-600 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    setShowLogout(false);
                    // Add real logout logic here later
                  }}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                >
                  Logout
                </button>

              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;