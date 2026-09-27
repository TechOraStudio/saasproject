import React, { useEffect, useState } from "react";
import {
  User,
  Bell,
  Palette,
  Shield,
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  Mail,
  Lock,
  Globe,
  Check,
  Moon,
  Monitor,
  Smartphone,
} from "lucide-react";

const SETTINGS_KEY = "taskflow_settings";

const DEFAULT_SETTINGS = {
  fullName: "Muhammad Muhadis",
  email: "muhadismgl.tech@gmail.com",
  role: "Full Stack Developer",
  language: "English",
  timezone: "Asia/Karachi",

  emailNotifications: true,
  taskNotifications: true,
  projectNotifications: true,
  weeklySummary: false,

  theme: "dark",
  compactMode: false,

  twoFactor: false,
};

const sections = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
  },
  {
    id: "general",
    label: "General",
    icon: SettingsIcon,
  },
];

function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedSettings = localStorage.getItem(SETTINGS_KEY);

    if (storedSettings) {
      setSettings({
        ...DEFAULT_SETTINGS,
        ...JSON.parse(storedSettings),
      });
    }
  }, []);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset all settings?"
    );

    if (!confirmed) return;

    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(DEFAULT_SETTINGS)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-200 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
            <SettingsIcon className="h-5 w-5 text-blue-400" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Settings
            </h1>

            <p className="text-sm text-slate-500">
              Manage your TaskFlow account and application preferences.
            </p>
          </div>
        </div>
      </div>

      {/* Main Settings Layout */}
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">

        {/* Sidebar */}
        <aside className="h-fit rounded-2xl border border-slate-800 bg-slate-900/70 p-2 shadow-xl shadow-black/10 backdrop-blur-xl">

          {sections.map((section) => {
            const Icon = section.icon;
            const active = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`group mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-300 ${
                  active
                    ? "bg-blue-500/10 text-blue-400 shadow-sm"
                    : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                }`}
              >
                <Icon
                  className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${
                    active ? "text-blue-400" : ""
                  }`}
                />

                {section.label}

                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />
                )}
              </button>
            );
          })}
        </aside>

        {/* Content */}
        <main className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl shadow-black/10 backdrop-blur-xl">

          {/* Profile */}
          {activeSection === "profile" && (
            <div className="p-6 sm:p-8">

              <SectionHeader
                title="Profile Settings"
                description="Update your personal information and account details."
              />

              {/* Profile Preview */}
              <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 sm:flex-row sm:items-center">

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-xl font-bold text-white shadow-lg shadow-blue-500/20">
                  MM
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    {settings.fullName}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {settings.role}
                  </p>

                  <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Active Account
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <InputField
                  label="Full Name"
                  value={settings.fullName}
                  onChange={(value) =>
                    updateSetting("fullName", value)
                  }
                  icon={User}
                />

                <InputField
                  label="Email Address"
                  type="email"
                  value={settings.email}
                  onChange={(value) =>
                    updateSetting("email", value)
                  }
                  icon={Mail}
                />

                <InputField
                  label="Role"
                  value={settings.role}
                  onChange={(value) =>
                    updateSetting("role", value)
                  }
                  icon={User}
                />

                <SelectField
                  label="Language"
                  value={settings.language}
                  onChange={(value) =>
                    updateSetting("language", value)
                  }
                  options={["English", "Urdu"]}
                  icon={Globe}
                />

                <SelectField
                  label="Timezone"
                  value={settings.timezone}
                  onChange={(value) =>
                    updateSetting("timezone", value)
                  }
                  options={[
                    "Asia/Karachi",
                    "UTC",
                    "Asia/Dubai",
                    "Europe/London",
                  ]}
                  icon={Globe}
                />

              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === "notifications" && (
            <div className="p-6 sm:p-8">

              <SectionHeader
                title="Notification Settings"
                description="Choose which notifications you want to receive."
              />

              <div className="space-y-3">
                <ToggleSetting
                  icon={Mail}
                  title="Email Notifications"
                  description="Receive important updates through email."
                  enabled={settings.emailNotifications}
                  onChange={(value) =>
                    updateSetting("emailNotifications", value)
                  }
                />

                <ToggleSetting
                  icon={Bell}
                  title="Task Notifications"
                  description="Get notified about task assignments and updates."
                  enabled={settings.taskNotifications}
                  onChange={(value) =>
                    updateSetting("taskNotifications", value)
                  }
                />

                <ToggleSetting
                  icon={SettingsIcon}
                  title="Project Notifications"
                  description="Receive updates about project activity."
                  enabled={settings.projectNotifications}
                  onChange={(value) =>
                    updateSetting("projectNotifications", value)
                  }
                />

                <ToggleSetting
                  icon={Mail}
                  title="Weekly Summary"
                  description="Receive a weekly summary of your projects and tasks."
                  enabled={settings.weeklySummary}
                  onChange={(value) =>
                    updateSetting("weeklySummary", value)
                  }
                />
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeSection === "appearance" && (
            <div className="p-6 sm:p-8">

              <SectionHeader
                title="Appearance"
                description="Customize how TaskFlow looks on your device."
              />

              <div className="mb-8">
                <h3 className="mb-3 text-sm font-semibold text-white">
                  Theme
                </h3>

                <div className="grid gap-3 sm:grid-cols-3">

                  <ThemeOption
                    icon={Moon}
                    title="Dark"
                    active={settings.theme === "dark"}
                    onClick={() =>
                      updateSetting("theme", "dark")
                    }
                  />

                  <ThemeOption
                    icon={Monitor}
                    title="System"
                    active={settings.theme === "system"}
                    onClick={() =>
                      updateSetting("theme", "system")
                    }
                  />

                  <ThemeOption
                    icon={Palette}
                    title="Light"
                    active={settings.theme === "light"}
                    onClick={() =>
                      updateSetting("theme", "light")
                    }
                  />

                </div>
              </div>

              <ToggleSetting
                icon={Smartphone}
                title="Compact Mode"
                description="Reduce spacing to display more information on the screen."
                enabled={settings.compactMode}
                onChange={(value) =>
                  updateSetting("compactMode", value)
                }
              />
            </div>
          )}

          {/* Security */}
          {activeSection === "security" && (
            <div className="p-6 sm:p-8">

              <SectionHeader
                title="Security"
                description="Protect your account and manage security preferences."
              />

              <div className="space-y-3">

                <ToggleSetting
                  icon={Shield}
                  title="Two-Factor Authentication"
                  description="Add an additional layer of protection to your account."
                  enabled={settings.twoFactor}
                  onChange={(value) =>
                    updateSetting("twoFactor", value)
                  }
                />

                <button
                  type="button"
                  className="group flex w-full items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-left transition-all duration-300 hover:border-blue-500/30 hover:bg-slate-950"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <Lock className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      Change Password
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Update your account password.
                    </p>
                  </div>

                  <span className="ml-auto text-slate-600 transition group-hover:text-blue-400">
                    →
                  </span>
                </button>

              </div>
            </div>
          )}

          {/* General */}
          {activeSection === "general" && (
            <div className="p-6 sm:p-8">

              <SectionHeader
                title="General Settings"
                description="Manage general TaskFlow application preferences."
              />

              <div className="space-y-3">

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                      <SettingsIcon className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">
                        TaskFlow Workspace
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Project Management Workspace
                      </p>
                    </div>

                    <span className="ml-auto rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                      Active
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                  <p className="text-xs uppercase tracking-wider text-slate-600">
                    Application Version
                  </p>

                  <p className="mt-2 text-lg font-semibold text-white">
                    TaskFlow v2.0
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Modern project management dashboard.
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-col gap-3 border-t border-slate-800 p-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-400 transition-all hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Settings
            </button>

            <div className="flex items-center gap-3">

              {saved && (
                <span className="flex items-center gap-2 text-sm text-emerald-400">
                  <Check className="h-4 w-4" />
                  Saved successfully
                </span>
              )}

              <button
                type="button"
                onClick={handleSave}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-500/30"
              >
                <Save className="h-4 w-4" />
                Save Changes

                <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />
              </button>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function SectionHeader({ title, description }) {
  return (
    <div className="mb-8 border-b border-slate-800 pb-6">
      <h2 className="text-xl font-bold text-white">
        {title}
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  icon: Icon,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  icon: Icon,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/70 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function ToggleSetting({
  icon: Icon,
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 transition-all duration-300 hover:border-slate-700">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-white">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        aria-label={`Toggle ${title}`}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-all duration-300 ${
          enabled
            ? "bg-blue-600"
            : "bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all duration-300 ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>

    </div>
  );
}

function ThemeOption({
  icon: Icon,
  title,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-2xl border p-5 text-left transition-all duration-300 ${
        active
          ? "border-blue-500/50 bg-blue-500/10 shadow-lg shadow-blue-500/5"
          : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
      }`}
    >
      <Icon
        className={`mb-4 h-5 w-5 ${
          active
            ? "text-blue-400"
            : "text-slate-500"
        }`}
      />

      <p className="font-semibold text-white">
        {title}
      </p>

      {active && (
        <span className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
          <Check className="h-3 w-3" />
        </span>
      )}
    </button>
  );
}

export default Settings;