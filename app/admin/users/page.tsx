"use client";

import React, { useEffect, useState } from "react";
import { UserCog, Trash2, Loader2, Mail, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "parent" | "student";
  id: string;
  createdAt?: string;
}

export default function UserManagementPage() {
  const { language } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // ইউজার লিস্ট নিয়ে আসা
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (error) {
      toast.error(
        language === "bn"
          ? "ইউজার লিস্ট লোড করতে সমস্যা হয়েছে"
          : "Failed to load users",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // রোল আপডেট করার ফাংশন
  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        toast.success(
          language === "bn"
            ? "রোল আপডেট সফল হয়েছে"
            : "Role updated successfully",
        );
        fetchUsers();
      } else {
        toast.error(
          language === "bn" ? "আপডেট করা সম্ভব হয়নি" : "Update failed",
        );
      }
    } catch (error) {
      toast.error(language === "bn" ? "আপডেট করা সম্ভব হয়নি" : "Update failed");
    }
  };

  // ইউজার ডিলিট ফাংশন
  const handleDeleteUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(
          language === "bn"
            ? "ইউজার ডিলিট সফল হয়েছে"
            : "User deleted successfully",
        );
        fetchUsers();
      } else {
        toast.error(
          language === "bn" ? "ডিলিট করা সম্ভব হয়নি" : "Delete failed",
        );
      }
    } catch (error) {
      toast.error(language === "bn" ? "ডিলিট করা সম্ভব হয়নি" : "Delete failed");
    } finally {
      setDeleteConfirm(null);
    }
  };

  // ফিল্টার এবং সার্চ করা ইউজার
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const roleOptions = [
    { value: "all", labelBn: "সকল", labelEn: "All" },
    { value: "admin", labelBn: "অ্যাডমিন", labelEn: "Admin" },
    { value: "teacher", labelBn: "শিক্ষক", labelEn: "Teacher" },
    { value: "parent", labelBn: "শিক্ষার্থী", labelEn: "Student" },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-600";
      case "teacher":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-green-100 text-green-600";
    }
  };

  const getRoleLabel = (role: string) => {
    if (language === "bn") {
      switch (role) {
        case "admin":
          return "অ্যাডমিন";
        case "teacher":
          return "শিক্ষক";
        default:
          return "শিক্ষার্থী";
      }
    }
    return role === "parent" ? "Student" : role;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* হেডার */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <UserCog className="text-primary w-6 h-6" />
          {language === "bn" ? "ইউজার ম্যানেজমেন্ট" : "User Management"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {language === "bn"
            ? "সিস্টেমের সকল ব্যবহারকারী এবং তাদের এক্সেস কন্ট্রোল করুন"
            : "Manage all system users and their access controls"}
        </p>
      </div>

      {/* সার্চ ও ফিল্টার বার */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={
              language === "bn"
                ? "নাম, ইমেইল বা আইডি দিয়ে খুঁজুন..."
                : "Search by name, email or ID..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-gray-400 self-center hidden sm:block" />
          {roleOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilterRole(option.value)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all
                ${
                  filterRole === option.value
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              {language === "bn" ? option.labelBn : option.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* ইউজার লিস্ট টেবিল */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-3 sm:p-4 font-semibold text-gray-700 text-sm">
                  {language === "bn" ? "ইউজার তথ্য" : "User Details"}
                </th>
                <th className="p-3 sm:p-4 font-semibold text-gray-700 text-sm">
                  {language === "bn" ? "রোল" : "Role"}
                </th>
                <th className="p-3 sm:p-4 font-semibold text-gray-700 text-sm text-right">
                  {language === "bn" ? "অ্যাকশন" : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-10 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary w-6 h-6" />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-gray-400">
                    {language === "bn"
                      ? "কোনো ইউজার পাওয়া যায়নি"
                      : "No users found"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm sm:text-base">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 text-sm sm:text-base">
                            {user.name}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {user.email}
                          </div>
                          <div className="text-[10px] sm:text-xs text-gray-400">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4">
                      <span
                        className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase ${getRoleColor(user.role)}`}
                      >
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleUpdate(user._id, e.target.value)
                          }
                          className="text-xs sm:text-sm border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                        >
                          <option value="parent">
                            {language === "bn" ? "শিক্ষার্থী" : "Student"}
                          </option>
                          <option value="teacher">
                            {language === "bn" ? "শিক্ষক" : "Teacher"}
                          </option>
                          <option value="admin">
                            {language === "bn" ? "অ্যাডমিন" : "Admin"}
                          </option>
                        </select>
                        <button
                          onClick={() => setDeleteConfirm(user._id)}
                          className="p-1.5 sm:p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ডিলিট কনফার্মেশন ডায়ালগ */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-80 p-6 mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {language === "bn"
                  ? "ইউজার ডিলিট নিশ্চিত করুন"
                  : "Confirm Delete"}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {language === "bn"
                  ? "আপনি কি নিশ্চিত যে এই ইউজারটি ডিলিট করতে চান?"
                  : "Are you sure you want to delete this user?"}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  {language === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button
                  onClick={() => handleDeleteUser(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  {language === "bn" ? "ডিলিট" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* পরিসংখ্যান */}
      <div className="mt-6 flex justify-between items-center text-xs text-gray-400">
        <span>
          {language === "bn" ? "মোট ইউজার" : "Total Users"}: {users.length}
        </span>
        <span>
          {language === "bn" ? "ফিল্টারকৃত" : "Filtered"}:{" "}
          {filteredUsers.length}
        </span>
      </div>
    </div>
  );
}
