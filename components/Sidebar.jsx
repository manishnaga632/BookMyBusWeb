


"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Profile", path: "/admin/profile" },
  { name: "Profile_Manager", path: "/admin/adminProfile" },
  { name: "Users", path: "/admin/users" },
  { name: "Travels", path: "/admin/travels" },
  { name: "Contact", path: "/admin/contact" },
  { name: "Booking", path: "/admin/booking" }

];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className={`sidebar-link ${pathname === item.path ? "active" : ""}`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
