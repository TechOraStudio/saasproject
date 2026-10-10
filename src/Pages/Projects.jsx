import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  CheckCircle2,
  Clock3,
  X,
  AlertCircle,
  Pencil,
  Trash2,
  FolderKanban,
  RefreshCw,
  LayoutGrid,
  List,
  ArrowUpDown,
  MoreHorizontal,
  TrendingUp,
  BriefcaseBusiness,
  Loader2,
  Check,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000/api/projects/";

const EMPTY_FORM = {
  name: "",
  client: "",
  status: "In Progress",
  progress: 0,
};

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [deleteProject, setDeleteProject] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  // =====================================================
  // FETCH PROJECTS
  // =====================================================

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setApiError("");

      const response = await axios.get(API_URL);

      if (Array.isArray(response.data)) {
        setProjects(response.data);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("API Fetch Error:", error);

      setApiError(
        "Unable to connect to TaskFlow API. Make sure FastAPI is running on port 8000."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // =====================================================
  // NOTIFICATION
  // =====================================================

  const showNotification = (type, message) => {
    setNotification({
      type,
      message,
    });

    setTimeout(() => {
      setNotification({
        type: "",
        message: "",
      });
    }, 3000);
  };

  // =====================================================
  // FORM
  // =====================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "progress" ? Number(value) : value,
    }));

    setFormError("");
  };

  const openAddModal = () => {
    setEditingProject(null);
    setFormData(EMPTY_FORM);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);

    setFormData({
      name: project.name || "",
      client: project.client || "",
      status: project.status || "In Progress",
      progress: Number(project.progress || 0),
    });

    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;

    setIsModalOpen(false);
    setEditingProject(null);
    setFormData(EMPTY_FORM);
    setFormError("");
  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setFormError("Project title is required.");
      return;
    }

    if (!formData.client.trim()) {
      setFormError("Client name is required.");
      return;
    }

    if (formData.progress < 0 || formData.progress > 100) {
      setFormError("Progress must be between 0 and 100.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      client: formData.client.trim(),
      status: formData.status,
      progress: Number(formData.progress),
    };

    try {
      setIsSaving(true);

      if (editingProject) {
        const response = await axios.put(
          `${API_URL}${editingProject.id}/`,
          payload
        );

        setProjects((prev) =>
          prev.map((project) =>
            project.id === editingProject.id
              ? response.data
              : project
          )
        );

        showNotification(
          "success",
          "Project updated successfully."
        );
      } else {
        const response = await axios.post(API_URL, payload);

        setProjects((prev) => [
          response.data,
          ...prev,
        ]);

        showNotification(
          "success",
          "New project created successfully."
        );
      }

      setIsModalOpen(false);
      setEditingProject(null);
      setFormData(EMPTY_FORM);
    } catch (error) {
      console.error("API Submit Error:", error);

      setFormError(
        editingProject
          ? "Failed to update project. Please try again."
          : "Failed to create project. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const confirmDelete = (project) => {
    setDeleteProject(project);
  };

  const cancelDelete = () => {
    if (isDeleting) return;
    setDeleteProject(null);
  };

  const handleDeleteProject = async () => {
    if (!deleteProject) return;

    try {
      setIsDeleting(true);

      await axios.delete(
        `${API_URL}${deleteProject.id}/`
      );

      setProjects((prev) =>
        prev.filter(
          (project) =>
            project.id !== deleteProject.id
        )
      );

      showNotification(
        "success",
        "Project deleted successfully."
      );

      setDeleteProject(null);
    } catch (error) {
      console.error("API Delete Error:", error);

      showNotification(
        "error",
        "Failed to delete project."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // =====================================================
  // FILTER + SORT
  // =====================================================

  const filteredProjects = useMemo(() => {
    const result = projects.filter((project) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        (project.name || "")
          .toLowerCase()
          .includes(search) ||
        (project.client || "")
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        filterStatus === "All" ||
        project.status === filterStatus;

      return matchesSearch && matchesStatus;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "progress-high") {
        return Number(b.progress) - Number(a.progress);
      }

      if (sortBy === "progress-low") {
        return Number(a.progress) - Number(b.progress);
      }

      return Number(b.id) - Number(a.id);
    });
  }, [
    projects,
    searchTerm,
    filterStatus,
    sortBy,
  ]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalProjects = projects.length;

  const activeProjects = projects.filter(
    (project) =>
      project.status === "In Progress"
  ).length;

  const completedProjects = projects.filter(
    (project) =>
      project.status === "Completed"
  ).length;

  const averageProgress =
    totalProjects > 0
      ? Math.round(
          projects.reduce(
            (sum, project) =>
              sum + Number(project.progress || 0),
            0
          ) / totalProjects
        )
      : 0;

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    if (status === "Completed") {
      return {
        wrapper:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        icon: CheckCircle2,
      };
    }

    return {
      wrapper:
        "border-blue-500/20 bg-blue-500/10 text-blue-400",
      icon: Clock3,
    };
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">

      {/* =================================================
          NOTIFICATION
      ================================================= */}

      {notification.message && (
        <div
          className={`fixed right-5 top-5 z-[100] flex max-w-sm items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${
            notification.type === "success"
              ? "border-emerald-500/20 bg-slate-900 text-emerald-400"
              : "border-red-500/20 bg-slate-900 text-red-400"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}

          <p className="text-sm font-medium text-slate-200">
            {notification.message}
          </p>
        </div>
      )}

      <div className="space-y-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-lg shadow-blue-500/50" />
              Workspace
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              Projects
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Manage, monitor and organize all projects
              across your TaskFlow workspace.
            </p>
          </div>

          <div className="flex gap-3">

            <button
              type="button"
              onClick={fetchProjects}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-300 transition-all hover:border-slate-700 hover:bg-slate-800 hover:text-white disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  loading ? "animate-spin" : ""
                }
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={openAddModal}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-500/30"
            >
              <Plus size={18} />

              New Project

              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </button>

          </div>
        </div>

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {[
            {
              label: "Total Projects",
              value: totalProjects,
              description: "All workspace projects",
              icon: FolderKanban,
              color: "text-blue-400",
              bg: "bg-blue-500/10",
            },
            {
              label: "In Progress",
              value: activeProjects,
              description: "Currently active",
              icon: Clock3,
              color: "text-cyan-400",
              bg: "bg-cyan-500/10",
            },
            {
              label: "Completed",
              value: completedProjects,
              description: "Successfully delivered",
              icon: CheckCircle2,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
            {
              label: "Average Progress",
              value: `${averageProgress}%`,
              description: "Across all projects",
              icon: TrendingUp,
              color: "text-violet-400",
              bg: "bg-violet-500/10",
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700"
              >
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/5 blur-3xl transition group-hover:bg-blue-500/10" />

                <div className="relative flex items-start justify-between">

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      {stat.label}
                    </p>

                    <h2 className="mt-3 text-3xl font-bold text-white">
                      {stat.value}
                    </h2>

                    <p className="mt-1 text-xs text-slate-600">
                      {stat.description}
                    </p>
                  </div>

                  <div
                    className={`rounded-xl border border-white/5 p-3 ${stat.bg}`}
                  >
                    <Icon
                      size={20}
                      className={stat.color}
                    />
                  </div>

                </div>
              </div>
            );
          })}

        </div>

        {/* =================================================
            TOOLBAR
        ================================================= */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-black/10">

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

            {/* SEARCH */}

            <div className="relative w-full xl:max-w-md">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                type="text"
                placeholder="Search by project or client..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
              />

            </div>

            <div className="flex flex-wrap items-center gap-2">

              {/* STATUS */}

              {[
                "All",
                "In Progress",
                "Completed",
              ].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setFilterStatus(status)
                  }
                  className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
                    filterStatus === status
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "bg-slate-950 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                  }`}
                >
                  {status}
                </button>
              ))}

              {/* SORT */}

              <div className="relative">

                <ArrowUpDown
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                />

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value)
                  }
                  className="appearance-none rounded-lg border border-slate-800 bg-slate-950 py-2 pl-9 pr-8 text-xs font-medium text-slate-400 outline-none hover:border-slate-700 focus:border-blue-500/50"
                >
                  <option value="newest">
                    Newest
                  </option>

                  <option value="name">
                    Name
                  </option>

                  <option value="progress-high">
                    Progress: High
                  </option>

                  <option value="progress-low">
                    Progress: Low
                  </option>
                </select>

              </div>

              {/* VIEW */}

              <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-1">

                <button
                  type="button"
                  onClick={() =>
                    setViewMode("grid")
                  }
                  className={`rounded-md p-1.5 ${
                    viewMode === "grid"
                      ? "bg-slate-800 text-blue-400"
                      : "text-slate-600 hover:text-slate-300"
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid size={16} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setViewMode("list")
                  }
                  className={`rounded-md p-1.5 ${
                    viewMode === "list"
                      ? "bg-slate-800 text-blue-400"
                      : "text-slate-600 hover:text-slate-300"
                  }`}
                  title="List view"
                >
                  <List size={16} />
                </button>

              </div>

            </div>

          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {apiError && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            <AlertCircle
              size={19}
              className="shrink-0 text-red-400"
            />

            <p className="text-sm text-red-300">
              {apiError}
            </p>
          </div>
        )}

        {/* =================================================
            PROJECTS
        ================================================= */}

        {loading ? (

          <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60">

            <div className="flex flex-col items-center">

              <Loader2
                size={30}
                className="animate-spin text-blue-400"
              />

              <p className="mt-4 text-sm font-medium text-slate-400">
                Loading projects...
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Connecting to TaskFlow API
              </p>

            </div>

          </div>

        ) : filteredProjects.length === 0 ? (

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-500">
              <FolderKanban size={25} />
            </div>

            <h3 className="mt-5 text-sm font-semibold text-white">
              No projects found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-600">
              No projects match your current search
              or filter.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("All");
              }}
              className="mt-5 text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              Clear filters
            </button>

          </div>

        ) : viewMode === "grid" ? (

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredProjects.map((project) => {

              const status =
                getStatusStyle(project.status);

              const StatusIcon = status.icon;

              return (
                <div
                  key={project.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl hover:shadow-black/20"
                >

                  {/* TOP GLOW */}

                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="p-5">

                    {/* HEADER */}

                    <div className="flex items-start justify-between">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-blue-400">
                          <FolderKanban size={19} />
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-600">
                            Project #{project.id}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {project.client}
                          </p>
                        </div>

                      </div>

                      <button
                        type="button"
                        className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-800 hover:text-slate-300"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                    </div>

                    {/* TITLE */}

                    <h3 className="mt-5 line-clamp-2 min-h-[48px] text-lg font-semibold leading-6 text-white">
                      {project.name}
                    </h3>

                    {/* STATUS */}

                    <div className="mt-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.wrapper}`}
                      >
                        <StatusIcon size={13} />
                        {project.status}
                      </span>
                    </div>

                    {/* PROGRESS */}

                    <div className="mt-6">

                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">
                          Project Progress
                        </span>

                        <span className="text-sm font-bold text-white">
                          {project.progress}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            project.status ===
                            "Completed"
                              ? "bg-gradient-to-r from-emerald-500 to-green-400"
                              : "bg-gradient-to-r from-blue-600 to-cyan-400"
                          }`}
                          style={{
                            width: `${project.progress}%`,
                          }}
                        />

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="mt-6 flex items-center gap-2 border-t border-slate-800 pt-4">

                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(project)
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs font-semibold text-slate-400 transition hover:border-blue-500/30 hover:text-blue-400"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          confirmDelete(project)
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs font-semibold text-slate-500 transition hover:border-red-500/30 hover:text-red-400"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>

                    </div>

                  </div>
                </div>
              );
            })}

          </div>

        ) : (

          /* =================================================
             LIST VIEW
          ================================================= */

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/10">

            <div className="hidden border-b border-slate-800 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-600 md:grid md:grid-cols-[2fr_1fr_1fr_1.5fr_auto] md:gap-5">
              <span>Project</span>
              <span>Client</span>
              <span>Status</span>
              <span>Progress</span>
              <span>Actions</span>
            </div>

            {filteredProjects.map((project) => {

              const status =
                getStatusStyle(project.status);

              const StatusIcon = status.icon;

              return (
                <div
                  key={project.id}
                  className="grid gap-4 border-b border-slate-800 p-5 last:border-b-0 hover:bg-slate-950/50 md:grid-cols-[2fr_1fr_1fr_1.5fr_auto] md:items-center md:gap-5"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-blue-400">
                      <FolderKanban size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        {project.name}
                      </p>

                      <p className="text-xs text-slate-600">
                        Project #{project.id}
                      </p>
                    </div>

                  </div>

                  <span className="text-xs text-slate-400">
                    {project.client}
                  </span>

                  <span
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${status.wrapper}`}
                  >
                    <StatusIcon size={12} />
                    {project.status}
                  </span>

                  <div>

                    <div className="mb-1.5 flex justify-between text-[11px]">
                      <span className="text-slate-600">
                        Progress
                      </span>

                      <span className="font-semibold text-slate-300">
                        {project.progress}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                        style={{
                          width: `${project.progress}%`,
                        }}
                      />
                    </div>

                  </div>

                  <div className="flex gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(project)
                      }
                      className="rounded-lg p-2 text-slate-600 hover:bg-slate-800 hover:text-blue-400"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        confirmDelete(project)
                      }
                      className="rounded-lg p-2 text-slate-600 hover:bg-slate-800 hover:text-red-400"
                    >
                      <Trash2 size={15} />
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

        {/* =================================================
            FOOTER SUMMARY
        ================================================= */}

        {!loading && projects.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-slate-800 pt-5 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">

            <span>
              Showing{" "}
              <strong className="text-slate-400">
                {filteredProjects.length}
              </strong>{" "}
              of{" "}
              <strong className="text-slate-400">
                {projects.length}
              </strong>{" "}
              projects
            </span>

            <span className="flex items-center gap-2">
              <BriefcaseBusiness size={14} />
              TaskFlow Workspace
            </span>

          </div>
        )}

      </div>

      {/* ===================================================
          ADD / EDIT MODAL
      =================================================== */}

      {isModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/40">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Project Workspace
                </p>

                <h2 className="mt-1 text-lg font-semibold text-white">
                  {editingProject
                    ? "Edit Project"
                    : "Create New Project"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-800 hover:text-white"
              >
                <X size={19} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {formError && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-300">
                  <AlertCircle size={15} />
                  {formError}
                </div>
              )}

              {/* PROJECT NAME */}

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-400">
                  Project Title
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="E-Commerce Analytics"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              {/* CLIENT */}

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-400">
                  Client / Team
                </label>

                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  placeholder="Retail Corp"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              {/* STATUS + PROGRESS */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-400">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-blue-500/50"
                  >
                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Completed">
                      Completed
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-400">
                    Progress
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      name="progress"
                      min="0"
                      max="100"
                      value={formData.progress}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 pr-12 text-sm text-white outline-none focus:border-blue-500/50"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-600">
                      %
                    </span>
                  </div>
                </div>

              </div>

              {/* PROGRESS PREVIEW */}

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                <div className="mb-2 flex justify-between">
                  <span className="text-xs text-slate-500">
                    Progress Preview
                  </span>

                  <span className="text-xs font-semibold text-blue-400">
                    {formData.progress}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300"
                    style={{
                      width: `${formData.progress}%`,
                    }}
                  />
                </div>

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-5">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-800 hover:text-slate-300 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />

                      Saving...
                    </>
                  ) : (
                    <>
                      {editingProject
                        ? "Update Project"
                        : "Create Project"}
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* ===================================================
          DELETE MODAL
      =================================================== */}

      {deleteProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">

          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/40">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <Trash2 size={21} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-white">
              Delete Project?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-300">
                "{deleteProject.name}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={cancelDelete}
                disabled={isDeleting}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-800 hover:text-slate-300"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteProject}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500 disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Project
                  </>
                )}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Projects;