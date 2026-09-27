import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Edit3,
  Trash2,
  Shield,
  Code2,
  Palette,
  Briefcase,
  MoreVertical,
  Mail,
  X,
  Check,
  UserCheck,
  UserX,
} from "lucide-react";

const STORAGE_KEY = "taskflow_team_members";

const INITIAL_MEMBERS = [
  {
    id: 1,
    name: "Muhammad Muhadis",
    email: "muhadismgl.tech@gmail.com",
    role: "Admin",
    status: "Active",
    avatar: "MM",
  },
  {
    id: 2,
    name: "Ali Hassan",
    email: "ali@example.com",
    role: "Developer",
    status: "Active",
    avatar: "AH",
  },
  {
    id: 3,
    name: "Ahmed Raza",
    email: "ahmed@example.com",
    role: "Manager",
    status: "Active",
    avatar: "AR",
  },
  {
    id: 4,
    name: "Sara Khan",
    email: "sara@example.com",
    role: "Designer",
    status: "Inactive",
    avatar: "SK",
  },
];

const ROLE_OPTIONS = [
  "Admin",
  "Manager",
  "Developer",
  "Designer",
];

function Teams() {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteMember, setDeleteMember] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Developer",
    status: "Active",
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        setMembers(JSON.parse(stored));
      } catch {
        setMembers(INITIAL_MEMBERS);
      }
    }
  }, []);

  const saveMembers = (updatedMembers) => {
    setMembers(updatedMembers);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedMembers)
    );
  };

  const showToast = (message) => {
    setToast({
      show: true,
      message,
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: "",
      });
    }, 2500);
  };

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        member.email
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "All" ||
        member.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" ||
        member.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [members, search, roleFilter, statusFilter]);

  const stats = {
    total: members.length,
    active: members.filter(
      (member) => member.status === "Active"
    ).length,
    admins: members.filter(
      (member) => member.role === "Admin"
    ).length,
    developers: members.filter(
      (member) => member.role === "Developer"
    ).length,
  };

  const openAddModal = () => {
    setEditingMember(null);

    setFormData({
      name: "",
      email: "",
      role: "Developer",
      status: "Active",
    });

    setShowModal(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);

    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      status: member.status,
    });

    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      return;
    }

    if (editingMember) {
      const updatedMembers = members.map((member) =>
        member.id === editingMember.id
          ? {
              ...member,
              ...formData,
              avatar: getInitials(formData.name),
            }
          : member
      );

      saveMembers(updatedMembers);
      showToast("Team member updated successfully.");
    } else {
      const newMember = {
        id: Date.now(),
        ...formData,
        avatar: getInitials(formData.name),
      };

      saveMembers([...members, newMember]);
      showToast("Team member added successfully.");
    }

    setShowModal(false);
  };

  const handleDelete = () => {
    if (!deleteMember) return;

    const updatedMembers = members.filter(
      (member) => member.id !== deleteMember.id
    );

    saveMembers(updatedMembers);
    showToast("Team member removed successfully.");
    setDeleteMember(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-200 sm:p-6 lg:p-8">

      {/* Toast */}
      {toast.show && (
        <div className="fixed right-5 top-5 z-[100] flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-slate-900 px-5 py-3 text-sm text-emerald-400 shadow-2xl">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10">
            <Check className="h-4 w-4" />
          </div>

          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
              <Users className="h-5 w-5 text-blue-400" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Teams
              </h1>

              <p className="text-sm text-slate-500">
                Manage your team members, roles and permissions.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-500/30"
        >
          <UserPlus className="h-4 w-4" />
          Add Member

          <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          icon={Users}
          label="Total Members"
          value={stats.total}
        />

        <StatCard
          icon={UserCheck}
          label="Active Members"
          value={stats.active}
        />

        <StatCard
          icon={Shield}
          label="Administrators"
          value={stats.admins}
        />

        <StatCard
          icon={Code2}
          label="Developers"
          value={stats.developers}
        />

      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl shadow-black/10 backdrop-blur-xl">

        {/* Toolbar */}
        <div className="border-b border-slate-800 p-4 sm:p-5">

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

            {/* Search */}
            <div className="relative w-full xl:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

              <input
                type="text"
                placeholder="Search team members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row">

              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value)
                }
                className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-blue-500/50"
              >
                <option value="All">All Roles</option>

                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-blue-500/50"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

            </div>
          </div>
        </div>

        {/* Members */}
        <div className="p-4 sm:p-5">

          {filteredMembers.length === 0 ? (
            <EmptyState
              search={search}
              onAdd={openAddModal}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {filteredMembers.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onEdit={openEditModal}
                  onDelete={setDeleteMember}
                />
              ))}

            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal
          title={
            editingMember
              ? "Edit Team Member"
              : "Add Team Member"
          }
          onClose={() => setShowModal(false)}
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter member name"
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="member@example.com"
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Role
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50"
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

            </div>

            <div className="flex justify-end gap-3 border-t border-slate-800 pt-5">

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-400 transition hover:border-slate-600 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                {editingMember
                  ? "Save Changes"
                  : "Add Member"}
              </button>

            </div>

          </form>
        </Modal>
      )}

      {/* Delete Modal */}
      {deleteMember && (
        <Modal
          title="Remove Team Member"
          onClose={() => setDeleteMember(null)}
        >
          <div className="text-center">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <Trash2 className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-semibold text-white">
              Remove {deleteMember.name}?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This member will be removed from your TaskFlow team.
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-center gap-3">

              <button
                onClick={() => setDeleteMember(null)}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Remove Member
              </button>

            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}

/* ---------------- Components ---------------- */

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/20">
      <div className="mb-4 flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          <Icon className="h-5 w-5" />
        </div>

        <span className="text-xs font-medium text-slate-600">
          TEAM
        </span>
      </div>

      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function MemberCard({
  member,
  onEdit,
  onDelete,
}) {
  const RoleIcon = getRoleIcon(member.role);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5">

      {/* Top */}
      <div className="flex items-start justify-between">

        <div className="flex items-center gap-4">

          <div className="relative">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 font-bold text-white shadow-lg shadow-blue-500/10">
              {member.avatar}
            </div>

            <span
              className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-slate-950 ${
                member.status === "Active"
                  ? "bg-emerald-400"
                  : "bg-slate-600"
              }`}
            />

          </div>

          <div className="min-w-0">
            <h3 className="truncate font-semibold text-white">
              {member.name}
            </h3>

            <p className="truncate text-sm text-slate-500">
              {member.email}
            </p>
          </div>

        </div>

        <button className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-800 hover:text-white">
          <MoreVertical className="h-4 w-4" />
        </button>

      </div>

      {/* Role */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">

        <div className="flex items-center gap-2">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
            <RoleIcon className="h-4 w-4" />
          </div>

          <div>
            <p className="text-xs text-slate-600">
              Role
            </p>

            <p className="text-sm font-medium text-slate-300">
              {member.role}
            </p>
          </div>

        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            member.status === "Active"
              ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border border-slate-700 bg-slate-800 text-slate-500"
          }`}
        >
          {member.status}
        </span>

      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">

        <button
          onClick={() => onEdit(member)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs font-medium text-slate-400 transition hover:border-blue-500/30 hover:bg-blue-500/5 hover:text-blue-400"
        >
          <Edit3 className="h-3.5 w-3.5" />
          Edit
        </button>

        <button
          onClick={() => onDelete(member)}
          className="flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-red-400 transition hover:border-red-500/30 hover:bg-red-500/5"
          aria-label={`Delete ${member.name}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>

      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent transition-all duration-500 group-hover:w-full" />

    </div>
  );
}

function EmptyState({ search, onAdd }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center text-center">

      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-500">
        <Users className="h-6 w-6" />
      </div>

      <h3 className="font-semibold text-white">
        No team members found
      </h3>

      <p className="mt-2 max-w-sm text-sm text-slate-500">
        {search
          ? "Try changing your search or filters."
          : "Start building your team by adding your first member."}
      </p>

      {!search && (
        <button
          onClick={onAdd}
          className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Add Member
        </button>
      )}

    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/40">

        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">

          <h2 className="text-lg font-bold text-white">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        <div className="p-6">
          {children}
        </div>

      </div>
    </div>
  );
}

function getInitials(name) {
  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

function getRoleIcon(role) {
  switch (role) {
    case "Admin":
      return Shield;

    case "Manager":
      return Briefcase;

    case "Designer":
      return Palette;

    case "Developer":
      return Code2;

    default:
      return Users;
  }
}

export default Teams;