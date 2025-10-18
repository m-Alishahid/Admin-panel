"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  // State for controlling sidebar visibility
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/users", label: "Users", icon: "👥" },
    { href: "/category", label: "Categories", icon: "📦" },
    { href: "/products", label: "Products", icon: "📦" },
    { href: "/orders", label: "Orders", icon: "🛒" },
    { href: "/api", label: "API", icon: "🔗" },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle Button (Visible when sidebar is closed) */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed left-0 top-0 m-4 z-40 p-2 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition"
        >
          {/* Menu Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      )}

      {/* Main Sidebar Container */}
      <div
        className={`bg-blue-800 text-white h-screen fixed top-0 left-0 z-50 overflow-y-auto transition-all duration-300 shadow-2xl
          ${isOpen ? "w-64" : "w-0"}
        `}
      >
        <div className="flex justify-between items-center p-4 h-[64px] bg-blue-900">
          {/* Panel Title */}
          <h1 className={`text-2xl font-bold transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            Admin Panel
          </h1>

          {/* Close Button (Visible when sidebar is open) */}
          <button
            onClick={toggleSidebar}
            className={`p-1 rounded-full text-blue-100 hover:bg-blue-700 transition ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* Close/X Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              // Conditional styling based on active path and mouse hover
              className={`flex items-center px-6 py-3 text-base font-medium transition-colors duration-200
                ${pathname === item.href
                  ? "bg-blue-600 border-l-4 border-white shadow-inner" // Active link
                  : "hover:bg-blue-700 hover:border-l-4 border-blue-400" // Inactive link
                }
              `}
            >
              <span className="mr-4 text-xl">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;