import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Check,
  X,
  CheckCheck,
  Trash2,
  Clock3,
  FolderKanban,
  CheckSquare,
  Users,
  ArrowRight,
} from "lucide-react";

function Navbar({
  sidebarOpen,
  setSidebarOpen,
  pageTitle = "Dashboard",
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New task assigned",
      message: "You have been assigned a new task.",
      time: "5 min ago",
      unread: true,
      type: "task",
    },
    {
      id: 2,
      title: "Project updated",
      message: "TaskFlow project was updated.",
      time: "25 min ago",
      unread: true,
      type: "project",
    },
    {
      id: 3,
      title: "Task completed",
      message: "A project task has been completed.",
      time: "1 hour ago",
      unread: false,
      type: "task",
    },
  ]);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  /* ---------------- TIME ---------------- */

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  /* ---------------- SEARCH DATA ---------------- */

  const searchItems = [
    {
      title: "Dashboard",
      type: "Page",
      icon: FolderKanban,
      path: "/",
    },
    {
      title: "Projects",
      type: "Page",
      icon: FolderKanban,
      path: "/projects",
    },
    {
      title: "Tasks",
      type: "Page",
      icon: CheckSquare,
      path: "/tasks",
    },
    {
      title: "Teams",
      type: "Page",
      icon: Users,
      path: "/teams",
    },
    {
      title: "Settings",
      type: "Page",
      icon: Settings,
      path: "/settings",
    },
  ];

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];

    return searchItems.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  /* ---------------- OUTSIDE CLICK ---------------- */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* ---------------- KEYBOARD SHORTCUTS ---------------- */

  useEffect(() => {
    const handleKeyboard = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();

        setSearchOpen(true);

        setTimeout(() => {
          document
            .querySelector("#taskflow-global-search")
            ?.focus();
        }, 50);
      }

      if (event.key === "Escape") {
        setSearchOpen(false);
        setNotificationOpen(false);
        setProfileOpen(false);
        setLogoutOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyboard);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, []);

  /* ---------------- NOTIFICATIONS ---------------- */

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const getNotificationIcon = (type) => {
    if (type === "project") {
      return <FolderKanban size={16} />;
    }

    return <CheckSquare size={16} />;
  };

  /* ---------------- SEARCH NAVIGATION ---------------- */

  const handleSearchNavigation = (path) => {
    window.location.href = path;
    setSearch("");
    setSearchOpen(false);
  };

  /* ---------------- LOGOUT ---------------- */

  const handleLogout = () => {
    setLogoutOpen(false);

    // Connect this later with your authentication system.
    console.log("Logout requested");
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">

        {/* TOP NAVBAR */}

        <div className="flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-3">

            {/* MOBILE MENU */}

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-300 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400 lg:hidden"
            >
              <Menu size={20} />
            </button>

            {/* PAGE TITLE */}

            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold tracking-tight text-white sm:text-xl">
                {pageTitle}
              </h2>

              <div className="hidden items-center gap-2 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />

                <p className="text-xs text-slate-500">
                  Welcome back, Muhadis
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-2 sm:gap-3">

            {/* DATE / TIME */}

            <div className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 xl:flex">
              <Clock3 size={15} className="text-slate-500" />

              <div>
                <p className="text-[10px] leading-none text-slate-600">
                  {formattedDate}
                </p>

                <p className="mt-1 text-xs font-medium leading-none text-slate-300">
                  {formattedTime}
                </p>
              </div>
            </div>

            {/* GLOBAL SEARCH */}

            <div
              ref={searchRef}
              className="relative hidden md:block"
            >
              <div
                className={`flex items-center border bg-slate-900/80 transition-all duration-300 ${
                  searchOpen
                    ? "w-72 rounded-xl border-blue-500/40 ring-2 ring-blue-500/10"
                    : "w-52 rounded-xl border-slate-800"
                }`}
              >
                <Search
                  size={17}
                  className="ml-3 shrink-0 text-slate-500"
                />

                <input
                  id="taskflow-global-search"
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search..."
                  className="w-full bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="mr-1 rounded-lg p-1 text-slate-500 hover:bg-slate-800 hover:text-white"
                  >
                    <X size={15} />
                  </button>
                )}

                {!search && (
                  <kbd className="mr-2 hidden rounded-md border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-500 lg:block">
                    Ctrl K
                  </kbd>
                )}
              </div>

              {/* SEARCH RESULTS */}

              {searchOpen && search.trim() && (
                <div className="absolute right-0 top-12 w-72 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50">

                  <div className="border-b border-slate-800 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                      Search Results
                    </p>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="p-2">
                      {searchResults.map((item) => {
                        const Icon = item.icon;

                        return (
                          <button
                            key={item.title}
                            onClick={() =>
                              handleSearchNavigation(item.path)
                            }
                            className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-slate-800"
                          >
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                              <Icon size={17} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-slate-200">
                                {item.title}
                              </p>

                              <p className="text-[11px] text-slate-600">
                                {item.type}
                              </p>
                            </div>

                            <ArrowRight
                              size={15}
                              className="text-slate-700 transition group-hover:translate-x-1 group-hover:text-blue-400"
                            />
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <Search
                        size={24}
                        className="mx-auto mb-2 text-slate-700"
                      />

                      <p className="text-sm text-slate-400">
                        No results found
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Try another search
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* MOBILE SEARCH */}

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400 md:hidden"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* NOTIFICATIONS */}

            <div
              ref={notificationRef}
              className="relative"
            >
              <button
                onClick={() => {
                  setNotificationOpen(!notificationOpen);
                  setProfileOpen(false);
                }}
                aria-label="Notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-300 hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
              >
                <Bell size={18} />

                {unreadCount > 0 && (
                  <>
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500" />

                    <span className="absolute right-2 top-2 h-2 w-2 animate-ping rounded-full bg-blue-500 opacity-50" />
                  </>
                )}

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-slate-950 bg-blue-600 px-1 text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* NOTIFICATION DROPDOWN */}

              {notificationOpen && (
                <div className="absolute right-0 top-12 w-[350px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50">

                  <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
                    <div>
                      <h3 className="font-semibold text-white">
                        Notifications
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {unreadCount > 0
                          ? `${unreadCount} unread`
                          : "All caught up"}
                      </p>
                    </div>

                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="flex items-center gap-1.5 text-xs font-medium text-blue-400 transition hover:text-blue-300"
                      >
                        <CheckCheck size={14} />
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[360px] overflow-y-auto">

                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`group flex gap-3 border-b border-slate-800/70 px-4 py-4 transition hover:bg-slate-800/40 ${
                            notification.unread
                              ? "bg-blue-500/[0.03]"
                              : ""
                          }`}
                        >
                          <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                            {getNotificationIcon(
                              notification.type
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium text-slate-200">
                                {notification.title}
                              </p>

                              {notification.unread && (
                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                              )}
                            </div>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {notification.message}
                            </p>

                            <div className="mt-2 flex items-center justify-between">
                              <p className="text-[11px] text-slate-600">
                                {notification.time}
                              </p>

                              <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                                {notification.unread && (
                                  <button
                                    onClick={() =>
                                      markNotificationRead(
                                        notification.id
                                      )
                                    }
                                    title="Mark as read"
                                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-blue-400"
                                  >
                                    <Check size={14} />
                                  </button>
                                )}

                                <button
                                  onClick={() =>
                                    deleteNotification(
                                      notification.id
                                    )
                                  }
                                  title="Delete"
                                  className="rounded-lg p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-10 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-600">
                          <Bell size={22} />
                        </div>

                        <p className="text-sm font-medium text-slate-300">
                          No notifications
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          You're all caught up.
                        </p>
                      </div>
                    )}
                  </div>

                  <button className="flex w-full items-center justify-center gap-2 px-4 py-3 text-xs font-medium text-blue-400 transition hover:bg-slate-800/50">
                    View all notifications
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>

            {/* DIVIDER */}

            <div className="hidden h-8 w-px bg-slate-800 sm:block" />

            {/* PROFILE */}

            <div
              ref={profileRef}
              className="relative"
            >
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationOpen(false);
                }}
                className="flex items-center gap-2 rounded-xl border border-transparent p-1.5 transition-all duration-300 hover:border-slate-800 hover:bg-slate-900"
              >
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-bold text-white shadow-lg shadow-blue-500/10">
                  MM

                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-emerald-400" />
                </div>

                <div className="hidden text-left lg:block">
                  <p className="text-sm font-semibold leading-none text-white">
                    Muhadis
                  </p>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Developer
                  </p>
                </div>

                <ChevronDown
                  size={15}
                  className={`hidden text-slate-500 transition-transform duration-300 lg:block ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* PROFILE DROPDOWN */}

              {profileOpen && (
                <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50">

                  <div className="border-b border-slate-800 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-sm font-bold text-white">
                        MM
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          Muhammad Muhadis
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          Full Stack Developer
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Online
                    </div>
                  </div>

                  <div className="p-2">

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        window.location.href = "/settings";
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    >
                      <User size={16} />
                      My Profile
                    </button>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        window.location.href = "/settings";
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    >
                      <Settings size={16} />
                      Settings
                    </button>

                  </div>

                  <div className="border-t border-slate-800 p-2">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        setLogoutOpen(true);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10"
                    >
                      <LogOut size={16} />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE SEARCH */}

        {searchOpen && (
          <div className="border-t border-slate-800 px-4 py-3 md:hidden">
            <div className="relative">
              <div className="flex items-center rounded-xl border border-blue-500/30 bg-slate-900 ring-2 ring-blue-500/5">
                <Search
                  size={17}
                  className="ml-3 text-slate-500"
                />

                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search pages..."
                  className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600"
                />

                <button
                  onClick={() => {
                    setSearch("");
                    setSearchOpen(false);
                  }}
                  className="mr-2 rounded-lg p-1 text-slate-500 hover:bg-slate-800 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* MOBILE SEARCH RESULTS */}

              {search.trim() && (
                <div className="absolute left-0 right-0 top-14 z-50 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
                  {searchResults.length > 0 ? (
                    <div className="p-2">
                      {searchResults.map((item) => {
                        const Icon = item.icon;

                        return (
                          <button
                            key={item.title}
                            onClick={() =>
                              handleSearchNavigation(item.path)
                            }
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-slate-800"
                          >
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                              <Icon size={17} />
                            </div>

                            <span className="text-sm text-slate-200">
                              {item.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="px-4 py-6 text-center text-sm text-slate-500">
                      No results found
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* LOGOUT CONFIRMATION */}

      {logoutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/50">

            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <LogOut size={20} />
              </div>

              <button
                onClick={() => setLogoutOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <h3 className="text-lg font-semibold text-white">
              Log out of TaskFlow?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to end your current session?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setLogoutOpen(false)}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 hover:shadow-lg hover:shadow-red-500/20"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;