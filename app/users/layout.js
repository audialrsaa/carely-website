// app/users/layout.jsx
"use client";

import SidebarUser from "@/app/components/sidebarUser";

export default function UsersLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarUser />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}