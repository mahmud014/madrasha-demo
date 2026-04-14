// app/student/layout.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import StudentSidebar from "@/components/student/StudentSidebar";
import { useEffect, useState } from "react";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  // ক্লায়েন্ট সাইড না হওয়া পর্যন্ত লোডিং দেখান
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex  overflow-hidden items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const allowedRoles = ["parent", "student"];

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50" suppressHydrationWarning>
      <StudentSidebar />
      <div className="flex-1 p-4 md:p-8">
        <main className="max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
