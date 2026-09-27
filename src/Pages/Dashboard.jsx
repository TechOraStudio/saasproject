import React, { useEffect, useMemo, useState } from "react";
import {
  FolderKanban,
  CheckSquare,
  Clock3,
  Users,
  Search,
  ArrowUpRight,
  Plus,
  Activity,
  TrendingUp,
  MoreHorizontal,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://127.0.0.1:8000/api/projects");

      if (!response.ok) {
        throw new Error("Unable to load projects.");
      }

      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.client.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  const totalProjects = projects.length;

  const activeProjects = projects.filter(
    (project) => project.status === "In Progress"
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const averageProgress =
    totalProjects > 0
      ? Math.round(
          projects.reduce(
            (total, project) => total + Number(project.progress || 0),
            0
          ) / totalProjects
        )
      : 0;

  const stats = [
    {
      title: "Total Projects",
      value: totalProjects,
      description: "Across your workspace",
      icon: FolderKanban,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
    {
      title: "Active Projects",
      value: activeProjects,
      description: "Currently in progress",
      icon: Activity,
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-400",
    },
    {
      title: "Completed",
      value: completedProjects,
      description: "Successfully delivered",
      icon: CheckSquare,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
    },
    {
      title: "Avg. Progress",
      value: `${averageProgress}%`,
      description: "Overall project progress",
      icon: TrendingUp,
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-400",
    },
  ];

  const getStatusStyle = (status) => {
    if (status === "Completed") {
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    }

    if (status === "In Progress") {
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";
    }

    return "border-slate-700 bg-slate-800 text-slate-400";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="space-y-8">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-blue-400">
              <span className="h-2 w-2 rounded-full bg-blue-400 shadow-lg shadow-blue-500/50" />
              Workspace Overview
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome back, Muhadis
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Here's what's happening with your projects today.
            </p>
          </div>

          <button
            type="button"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-500/30"
          >
            <Plus size={18} />
            New Project
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </div>

        {/* ================= STATS ================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/5 blur-2xl transition-all duration-500 group-hover:bg-blue-500/10" />

                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">
                      {stat.title}
                    </p>

                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
                      {stat.value}
                    </h2>

                    <p className="mt-2 text-xs text-slate-500">
                      {stat.description}
                    </p>
                  </div>

                  <div
                    className={`rounded-xl border border-white/5 p-3 ${stat.iconBg}`}
                  >
                    <Icon size={21} className={stat.iconColor} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= MAIN GRID ================= */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">

          {/* ================= PROJECTS ================= */}

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/10">

            {/* Project Header */}

            <div className="border-b border-slate-800 p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Recent Projects
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Monitor your active workspace projects.
                  </p>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 self-start text-sm font-medium text-blue-400 transition hover:text-blue-300"
                >
                  View all
                  <ArrowUpRight size={15} />
                </button>
              </div>

              {/* Search + Filter */}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                <div className="relative flex-1">
                  <Search
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-blue-500/50"
                >
                  <option value="All">All Status</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>

                <button
                  type="button"
                  onClick={fetchProjects}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-400 transition hover:border-slate-700 hover:text-white"
                  title="Refresh projects"
                >
                  <RefreshCw
                    size={17}
                    className={loading ? "animate-spin" : ""}
                  />
                </button>
              </div>
            </div>

            {/* Project List */}

            <div className="divide-y divide-slate-800">

              {loading ? (
                <div className="flex min-h-[260px] items-center justify-center">
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <Loader2 size={20} className="animate-spin text-blue-400" />
                    Loading projects...
                  </div>
                </div>
              ) : error ? (
                <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
                  <AlertCircle size={28} className="text-red-400" />

                  <p className="mt-3 text-sm font-medium text-white">
                    Unable to load projects
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={fetchProjects}
                    className="mt-4 rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-blue-500 hover:text-blue-400"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="flex min-h-[220px] items-center justify-center px-6 text-center">
                  <div>
                    <FolderKanban
                      size={30}
                      className="mx-auto text-slate-600"
                    />

                    <p className="mt-3 text-sm font-medium text-slate-300">
                      No projects found
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Try another search or filter.
                    </p>
                  </div>
                </div>
              ) : (
                filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="group p-5 transition-colors duration-300 hover:bg-slate-950/60 sm:p-6"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex min-w-0 items-start gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-blue-400">
                          <FolderKanban size={19} />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-sm font-semibold text-white">
                              {project.name}
                            </h3>

                            <span
                              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getStatusStyle(
                                project.status
                              )}`}
                            >
                              {project.status}
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-slate-500">
                            Client · {project.client}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:min-w-[220px] sm:justify-end">

                        <div className="w-full sm:w-40">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-[11px] text-slate-500">
                              Progress
                            </span>

                            <span className="text-xs font-semibold text-slate-300">
                              {project.progress}%
                            </span>
                          </div>

                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-700"
                              style={{
                                width: `${project.progress}%`,
                              }}
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          className="hidden rounded-lg p-2 text-slate-600 transition hover:bg-slate-800 hover:text-white sm:block"
                        >
                          <MoreHorizontal size={18} />
                        </button>

                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ================= SIDE PANEL ================= */}

          <div className="space-y-6">

            {/* Quick Actions */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/10">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-white">
                  Quick Actions
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Manage your workspace faster.
                </p>
              </div>

              <div className="space-y-3">

                <button
                  type="button"
                  className="group flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-left transition-all hover:border-blue-500/30 hover:bg-blue-500/5"
                >
                  <span className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
                    <Plus size={17} />
                  </span>

                  <span>
                    <span className="block text-sm font-medium text-slate-200">
                      Create Project
                    </span>

                    <span className="block text-xs text-slate-600">
                      Start a new workspace project
                    </span>
                  </span>

                  <ArrowUpRight
                    size={15}
                    className="ml-auto text-slate-600 transition group-hover:text-blue-400"
                  />
                </button>

                <button
                  type="button"
                  className="group flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-left transition-all hover:border-cyan-500/30 hover:bg-cyan-500/5"
                >
                  <span className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400">
                    <CheckSquare size={17} />
                  </span>

                  <span>
                    <span className="block text-sm font-medium text-slate-200">
                      Manage Tasks
                    </span>

                    <span className="block text-xs text-slate-600">
                      Review and organize tasks
                    </span>
                  </span>

                  <ArrowUpRight
                    size={15}
                    className="ml-auto text-slate-600 transition group-hover:text-cyan-400"
                  />
                </button>

                <button
                  type="button"
                  className="group flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-left transition-all hover:border-violet-500/30 hover:bg-violet-500/5"
                >
                  <span className="rounded-lg bg-violet-500/10 p-2 text-violet-400">
                    <Users size={17} />
                  </span>

                  <span>
                    <span className="block text-sm font-medium text-slate-200">
                      Team Members
                    </span>

                    <span className="block text-xs text-slate-600">
                      Manage your project team
                    </span>
                  </span>

                  <ArrowUpRight
                    size={15}
                    className="ml-auto text-slate-600 transition group-hover:text-violet-400"
                  />
                </button>

              </div>
            </div>

            {/* Workspace Health */}

            <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-slate-900 to-slate-950 p-5 shadow-xl shadow-black/10">

              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/10 blur-3xl" />

              <div className="relative">
                <div className="flex items-center gap-2">
                  <TrendingUp size={17} className="text-blue-400" />

                  <span className="text-sm font-semibold text-white">
                    Workspace Health
                  </span>
                </div>

                <div className="mt-5">
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold text-white">
                      {averageProgress}%
                    </span>

                    <span className="text-xs text-emerald-400">
                      Overall progress
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-700"
                      style={{
                        width: `${averageProgress}%`,
                      }}
                    />
                  </div>
                </div>

                <p className="mt-4 text-xs leading-5 text-slate-500">
                  Project progress is calculated from the data currently
                  available in your TaskFlow workspace.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ================= BOTTOM INFO ================= */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center gap-3">
              <Clock3 size={18} className="text-blue-400" />

              <div>
                <p className="text-xs text-slate-500">
                  Workspace Status
                </p>

                <p className="mt-1 text-sm font-semibold text-emerald-400">
                  Operational
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center gap-3">
              <Users size={18} className="text-cyan-400" />

              <div>
                <p className="text-xs text-slate-500">
                  Team Members
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  8 Members
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center gap-3">
              <Activity size={18} className="text-violet-400" />

              <div>
                <p className="text-xs text-slate-500">
                  Last Sync
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  Live API
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;