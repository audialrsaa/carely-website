// ======================================================
// app/users/layout.jsx
// LAYOUT GLOBAL USER (SEMUA HALAMAN /users/* PAKE SIDEBAR OTOMATIS)
// ======================================================
"use client";

import UserSidebar from "@/app/components/sidebarUser";

export default function UsersLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f7f7f7] flex">
      <UserSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}