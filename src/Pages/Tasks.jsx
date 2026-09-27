import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Clock3,
  CalendarDays,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  List,
  LayoutGrid,
  Check,
  ClipboardList,
  AlertTriangle,
  CircleDot,
  ChevronDown,
} from "lucide-react";

const STORAGE_KEY = "taskflow_tasks";

const INITIAL_TASKS = [
  {
    id: 1,
    title: "Build dashboard UI",
    description: "Create the main TaskFlow dashboard interface.",
    project: "TaskFlow",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-09-25",
    createdAt: "2026-09-19",
  },
  {
    id: 2,
    title: "Create project API integration",
    description: "Connect the projects page with FastAPI endpoints.",
    project: "TaskFlow",
    priority: "High",
    status: "Completed",
    dueDate: "2026-09-20",
    createdAt: "2026-09-18",
  },
  {
    id: 3,
    title: "Design weather search",
    description: "Implement city search and weather result interface.",
    project: "SkyPulse",
    priority: "Medium",
    status: "Todo",
    dueDate: "2026-09-28",
    createdAt: "2026-09-19",
  },
];

const EMPTY_FORM = {
  title: "",
  description: "",
  project: "TaskFlow",
  priority: "Medium",
  status: "Todo",
  dueDate: "",
};

function Tasks() {
  const [tasks, setTasks] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTask, setDeleteTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  // =====================================================
  // LOAD TASKS
  // =====================================================

  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch {
        setTasks(INITIAL_TASKS);
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(INITIAL_TASKS)
        );
      }
    } else {
      setTasks(INITIAL_TASKS);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(INITIAL_TASKS)
      );
    }
  }, []);

  // =====================================================
  // SAVE TASKS
  // =====================================================

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
      );
    }
  }, [tasks]);

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
      [name]: value,
    }));

    setFormError("");
  };

  const openAddModal = () => {
    setEditingTask(null);

    setFormData({
      ...EMPTY_FORM,
      dueDate: "",
    });

    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);

    setFormData({
      title: task.title || "",
      description: task.description || "",
      project: task.project || "TaskFlow",
      priority: task.priority || "Medium",
      status: task.status || "Todo",
      dueDate: task.dueDate || "",
    });

    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;

    setIsModalOpen(false);
    setEditingTask(null);
    setFormData(EMPTY_FORM);
    setFormError("");
  };

  // =====================================================
  // ADD / UPDATE TASK
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setFormError("Task title is required.");
      return;
    }

    if (!formData.project.trim()) {
      setFormError("Project name is required.");
      return;
    }

    try {
      setIsSaving(true);

      const taskData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
      };

      if (editingTask) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === editingTask.id
              ? {
                  ...task,
                  ...taskData,
                }
              : task
          )
        );

        showNotification(
          "success",
          "Task updated successfully."
        );
      } else {
        const newTask = {
          id: Date.now(),
          ...taskData,
          createdAt: new Date()
            .toISOString()
            .split("T")[0],
        };

        setTasks((prev) => [
          newTask,
          ...prev,
        ]);

        showNotification(
          "success",
          "New task added successfully."
        );
      }

      setIsModalOpen(false);
      setEditingTask(null);
      setFormData(EMPTY_FORM);
    } catch {
      setFormError(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // =====================================================
  // COMPLETE / TOGGLE TASK
  // =====================================================

  const toggleTaskComplete = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status:
                task.status === "Completed"
                  ? "Todo"
                  : "Completed",
            }
          : task
      )
    );

    showNotification(
      "success",
      "Task status updated."
    );
  };

  // =====================================================
  // DELETE
  // =====================================================

  const confirmDelete = (task) => {
    setDeleteTask(task);
  };

  const cancelDelete = () => {
    if (isDeleting) return;

    setDeleteTask(null);
  };

  const handleDelete = async () => {
    if (!deleteTask) return;

    try {
      setIsDeleting(true);

      setTasks((prev) =>
        prev.filter(
          (task) => task.id !== deleteTask.id
        )
      );

      showNotification(
        "success",
        "Task deleted successfully."
      );

      setDeleteTask(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        task.title
          .toLowerCase()
          .includes(search) ||
        task.description
          .toLowerCase()
          .includes(search) ||
        task.project
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        task.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    tasks,
    searchTerm,
    statusFilter,
    priorityFilter,
  ]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const todoTasks = tasks.filter(
    (task) => task.status === "Todo"
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "High"
  ).length;

  // =====================================================
  // OVERDUE
  // =====================================================

  const isOverdue = (task) => {
    if (!task.dueDate || task.status === "Completed") {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  };

  // =====================================================
  // STYLES
  // =====================================================

  const getPriorityStyle = (priority) => {
    if (priority === "High") {
      return "border-red-500/20 bg-red-500/10 text-red-400";
    }

    if (priority === "Medium") {
      return "border-amber-500/20 bg-amber-500/10 text-amber-400";
    }

    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
  };

  const getStatusStyle = (status) => {
    if (status === "Completed") {
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    }

    if (status === "In Progress") {
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";
    }

    return "border-slate-700 bg-slate-800 text-slate-400";
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
          className={`fixed right-5 top-5 z-[100] flex items-center gap-3 rounded-xl border bg-slate-900 px-4 py-3 shadow-2xl ${
            notification.type === "success"
              ? "border-emerald-500/20"
              : "border-red-500/20"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2
              size={18}
              className="text-emerald-400"
            />
          ) : (
            <AlertCircle
              size={18}
              className="text-red-400"
            />
          )}

          <span className="text-sm text-slate-300">
            {notification.message}
          </span>
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
              Task Management
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              Tasks
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Create, organize and track your work
              across every TaskFlow project.
            </p>

          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-500/30"
          >
            <Plus size={18} />
            Add Task
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </button>

        </div>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {[
            {
              title: "Total Tasks",
              value: totalTasks,
              description: "All workspace tasks",
              icon: ClipboardList,
              color: "text-blue-400",
              bg: "bg-blue-500/10",
            },
            {
              title: "To Do",
              value: todoTasks,
              description: "Waiting to start",
              icon: CircleDot,
              color: "text-slate-400",
              bg: "bg-slate-800",
            },
            {
              title: "In Progress",
              value: inProgressTasks,
              description: "Currently working",
              icon: Clock3,
              color: "text-cyan-400",
              bg: "bg-cyan-500/10",
            },
            {
              title: "Completed",
              value: completedTasks,
              description: `${highPriorityTasks} high priority`,
              icon: CheckCircle2,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700"
              >

                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/5 blur-3xl" />

                <div className="relative flex items-start justify-between">

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      {stat.title}
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
                placeholder="Search tasks, projects..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
              />

            </div>

            {/* FILTERS */}

            <div className="flex flex-wrap items-center gap-2">

              {[
                "All",
                "Todo",
                "In Progress",
                "Completed",
              ].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setStatusFilter(status)
                  }
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                    statusFilter === status
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "bg-slate-950 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                  }`}
                >
                  {status}
                </button>
              ))}

              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value)
                }
                className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-400 outline-none focus:border-blue-500/50"
              >
                <option value="All">
                  All Priority
                </option>

                <option value="High">
                  High
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Low">
                  Low
                </option>
              </select>

              {/* VIEW SWITCH */}

              <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-1">

                <button
                  type="button"
                  onClick={() =>
                    setViewMode("grid")
                  }
                  className={`rounded-md p-1.5 ${
                    viewMode === "grid"
                      ? "bg-slate-800 text-blue-400"
                      : "text-slate-600"
                  }`}
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
                      : "text-slate-600"
                  }`}
                >
                  <List size={16} />
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            TASKS
        ================================================= */}

        {filteredTasks.length === 0 ? (

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-500">
              <ClipboardList size={25} />
            </div>

            <h3 className="mt-5 text-sm font-semibold text-white">
              No tasks found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-600">
              Create a new task or clear your current
              filters.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
                setPriorityFilter("All");
              }}
              className="mt-5 text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              Clear filters
            </button>

          </div>

        ) : viewMode === "grid" ? (

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredTasks.map((task) => (

              <div
                key={task.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700"
              >

                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 transition group-hover:opacity-100" />

                {/* TASK HEADER */}

                <div className="flex items-start gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      toggleTaskComplete(task.id)
                    }
                    className="mt-0.5 shrink-0 text-slate-600 transition hover:text-emerald-400"
                  >
                    {task.status === "Completed" ? (
                      <CheckCircle2
                        size={21}
                        className="text-emerald-400"
                      />
                    ) : (
                      <Circle size={21} />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">

                    <h3
                      className={`text-sm font-semibold ${
                        task.status === "Completed"
                          ? "text-slate-500 line-through"
                          : "text-white"
                      }`}
                    >
                      {task.title}
                    </h3>

                    <p className="mt-1 text-xs text-slate-600">
                      {task.project}
                    </p>

                  </div>

                </div>

                {/* DESCRIPTION */}

                <p className="mt-4 line-clamp-2 min-h-[40px] text-xs leading-5 text-slate-500">
                  {task.description ||
                    "No description provided."}
                </p>

                {/* TAGS */}

                <div className="mt-4 flex flex-wrap gap-2">

                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getPriorityStyle(
                      task.priority
                    )}`}
                  >
                    {task.priority} Priority
                  </span>

                </div>

                {/* DUE DATE */}

                <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">

                  <div className="flex items-center gap-2 text-xs">

                    <CalendarDays
                      size={14}
                      className={
                        isOverdue(task)
                          ? "text-red-400"
                          : "text-slate-600"
                      }
                    />

                    <span
                      className={
                        isOverdue(task)
                          ? "font-medium text-red-400"
                          : "text-slate-500"
                      }
                    >
                      {task.dueDate
                        ? new Date(
                            `${task.dueDate}T00:00:00`
                          ).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "No due date"}
                    </span>

                    {isOverdue(task) && (
                      <AlertTriangle
                        size={13}
                        className="text-red-400"
                      />
                    )}

                  </div>

                </div>

                {/* ACTIONS */}

                <div className="mt-4 flex gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      openEditModal(task)
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:border-blue-500/30 hover:text-blue-400"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      confirmDelete(task)
                    }
                    className="flex items-center justify-center rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-slate-600 transition hover:border-red-500/30 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>

                </div>

              </div>

            ))}

          </div>

        ) : (

          /* =================================================
             LIST VIEW
          ================================================= */

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">

            <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_auto] gap-5 border-b border-slate-800 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-600 md:grid">
              <span>Task</span>
              <span>Project</span>
              <span>Status</span>
              <span>Priority</span>
              <span>Actions</span>
            </div>

            {filteredTasks.map((task) => (

              <div
                key={task.id}
                className="grid gap-4 border-b border-slate-800 p-5 last:border-0 hover:bg-slate-950/50 md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-center md:gap-5"
              >

                <div className="flex items-center gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      toggleTaskComplete(task.id)
                    }
                  >
                    {task.status === "Completed" ? (
                      <CheckCircle2
                        size={20}
                        className="text-emerald-400"
                      />
                    ) : (
                      <Circle
                        size={20}
                        className="text-slate-600"
                      />
                    )}
                  </button>

                  <div>

                    <p
                      className={`text-sm font-semibold ${
                        task.status === "Completed"
                          ? "text-slate-500 line-through"
                          : "text-white"
                      }`}
                    >
                      {task.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Due:{" "}
                      {task.dueDate || "Not set"}
                    </p>

                  </div>

                </div>

                <span className="text-xs text-slate-400">
                  {task.project}
                </span>

                <span
                  className={`w-fit rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>

                <span
                  className={`w-fit rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getPriorityStyle(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>

                <div className="flex gap-1">

                  <button
                    type="button"
                    onClick={() =>
                      openEditModal(task)
                    }
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-800 hover:text-blue-400"
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      confirmDelete(task)
                    }
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-800 hover:text-red-400"
                  >
                    <Trash2 size={15} />
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex flex-col gap-2 border-t border-slate-800 pt-5 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">

          <span>
            Showing{" "}
            <strong className="text-slate-400">
              {filteredTasks.length}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-400">
              {tasks.length}
            </strong>{" "}
            tasks
          </span>

          <span>
            {completedTasks} completed ·{" "}
            {todoTasks} remaining
          </span>

        </div>

      </div>

      {/* ===================================================
          ADD / EDIT MODAL
      =================================================== */}

      {isModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">

            {/* HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-5">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Task Workspace
                </p>

                <h2 className="mt-1 text-lg font-semibold text-white">
                  {editingTask
                    ? "Edit Task"
                    : "Create New Task"}
                </h2>

              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-800 hover:text-white"
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

              {/* TITLE */}

              <div>

                <label className="mb-2 block text-xs font-semibold text-slate-400">
                  Task Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Build authentication system"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="mb-2 block text-xs font-semibold text-slate-400">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Describe what needs to be done..."
                  className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                />

              </div>

              {/* PROJECT */}

              <div>

                <label className="mb-2 block text-xs font-semibold text-slate-400">
                  Project
                </label>

                <input
                  type="text"
                  name="project"
                  value={formData.project}
                  onChange={handleInputChange}
                  placeholder="TaskFlow"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-blue-500/50"
                />

              </div>

              {/* STATUS / PRIORITY */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-xs font-semibold text-slate-400">
                    Status
                  </label>

                  <div className="relative">

                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-blue-500/50"
                    >
                      <option value="Todo">
                        Todo
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Completed">
                        Completed
                      </option>
                    </select>

                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                  </div>

                </div>

                <div>

                  <label className="mb-2 block text-xs font-semibold text-slate-400">
                    Priority
                  </label>

                  <div className="relative">

                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-blue-500/50"
                    >
                      <option value="Low">
                        Low
                      </option>

                      <option value="Medium">
                        Medium
                      </option>

                      <option value="High">
                        High
                      </option>
                    </select>

                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                  </div>

                </div>

              </div>

              {/* DUE DATE */}

              <div>

                <label className="mb-2 block text-xs font-semibold text-slate-400">
                  Due Date
                </label>

                <div className="relative">

                  <CalendarDays
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm text-slate-300 outline-none focus:border-blue-500/50"
                  />

                </div>

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-5">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 disabled:opacity-60"
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
                      {editingTask
                        ? "Update Task"
                        : "Create Task"}
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

      {deleteTask && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">

          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <Trash2 size={21} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-white">
              Delete Task?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-300">
                "{deleteTask.title}"
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
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
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
                    Delete Task
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

export default Tasks;