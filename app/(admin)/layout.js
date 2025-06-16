
"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminProvider, useAdminContext } from "@/context/AdminContext";
import AdminHeader from "@/components/AdminHeader";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/AdminFooter";
import { Toaster } from 'react-hot-toast';

import "./globals.css";

function ProtectedLayout({ children }) {
  const { admin, loading, authChecked } = useAdminContext();
  const pathname = usePathname();
  const router = useRouter();

  // Check if current route is a protected admin route (excluding /admin)
  const isProtectedRoute = pathname.startsWith("/admin") && pathname !== "/admin";

  useEffect(() => {
    if (!authChecked) return; // Wait for initial auth check to complete
    
    if (isProtectedRoute && !admin) {
      router.push("/admin"); // redirect to login
    }
  }, [admin, authChecked, isProtectedRoute, router]);

  // Don't render anything until auth check is complete
  if (!authChecked || (isProtectedRoute && !admin)) {
    return null;
  }

  const shouldShowLayout = isProtectedRoute;

  return shouldShowLayout ? (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">
        <AdminHeader />
        <main className="admin-content">{children}</main>
        <Footer />
      </div>
    </div>
  ) : (
    <>{children}</>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Admin Panel</title>
      </head>
      <body>
        <Toaster position="top-right" reverseOrder={false} />
        <AdminProvider>
          <ProtectedLayout>{children}</ProtectedLayout>
        </AdminProvider>
      </body>
    </html>
  );
}