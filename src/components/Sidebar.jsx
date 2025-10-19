"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/users", label: "Users", icon: "👥" },
    { href: "/category", label: "Categories", icon: "📦" },
    { href: "/products", label: "Products", icon: "🛍️" },
    { href: "/orders", label: "Orders", icon: "🛒" },
    { href: "/api", label: "API", icon: "🔗" },
  ];

  return (
    <>
      {/* Toggle Button (Visible when sidebar is closed) */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed left-2 md:left-4 top-4 z-50 p-2 md:p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          aria-label="Open sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      )}

      {/* Overlay when sidebar is open on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Sidebar Container */}
      <div
        className={`bg-gradient-to-b from-blue-800 to-blue-900 text-white h-screen fixed top-0 left-0 z-50 overflow-y-auto transition-all duration-300 shadow-2xl
          ${isOpen
            ? "w-64 sm:w-72 lg:w-80 translate-x-0"
            : "-translate-x-full"
          }
        `}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between p-4 md:p-6 h-16 md:h-20 bg-gradient-to-r from-blue-900 to-blue-800 border-b border-blue-700">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-blue-600 font-bold text-sm md:text-lg">A</span>
            </div>
            <div className={`transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-blue-200 text-xs hidden sm:block">Management Console</p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-lg bg-blue-700 hover:bg-blue-600 transition-all duration-200 hover:scale-110 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 md:p-4 space-y-1 md:space-y-2 mt-2 md:mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => window.innerWidth < 1024 && toggleSidebar()} // Auto-close on mobile after navigation
              className={`flex items-center px-3 md:px-4 py-3 md:py-4 text-sm md:text-base font-medium transition-all duration-200 rounded-xl group relative overflow-hidden
                ${pathname === item.href
                  ? "bg-white text-blue-700 shadow-lg transform scale-[1.02] border-l-4 border-blue-500"
                  : "text-blue-100 hover:bg-blue-700 hover:text-white hover:shadow-md hover:translate-x-1"
                }
              `}
            >
              {/* Active indicator dot */}
              {pathname === item.href && (
                <div className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full"></div>
                </div>
              )}

              <span className={`text-lg md:text-xl transition-transform duration-200 ${
                pathname === item.href ? 'scale-110' : 'group-hover:scale-110'
              }`}>
                {item.icon}
              </span>

              <span className={`ml-3 md:ml-4 font-medium transition-all duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-0'
              }`}>
                {item.label}
              </span>

              {/* Hover effect */}
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-xl ${
                pathname === item.href ? 'hidden' : ''
              }`} />
            </Link>
          ))}
        </nav>

        {/* Footer Section */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 border-t border-blue-700 transition-all duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-xs md:text-sm font-bold">U</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-blue-300 hidden sm:block">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
