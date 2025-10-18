"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
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
          className="fixed left-4 top-4 z-50 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          ${isOpen ? "w-80 translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between p-6 h-20 bg-gradient-to-r from-blue-900 to-blue-800 border-b border-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-blue-600 font-bold text-lg">A</span>
            </div>
            <div className={`transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-blue-200 text-xs">Management Console</p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-lg bg-blue-700 hover:bg-blue-600 transition-all duration-200 hover:scale-110 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-4 text-base font-medium transition-all duration-200 rounded-xl group relative overflow-hidden
                ${pathname === item.href
                  ? "bg-white text-blue-700 shadow-lg transform scale-[1.02] border-l-4 border-blue-500"
                  : "text-blue-100 hover:bg-blue-700 hover:text-white hover:shadow-md hover:translate-x-1"
                }
              `}
            >
              {/* Active indicator dot */}
              {pathname === item.href && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              )}
              
              <span className={`text-xl transition-transform duration-200 ${
                pathname === item.href ? 'scale-110' : 'group-hover:scale-110'
              }`}>
                {item.icon}
              </span>
              
              <span className={`ml-4 font-medium transition-all duration-300 ${
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
        <div className={`absolute bottom-0 left-0 right-0 p-6 border-t border-blue-700 transition-all duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold">U</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-blue-300">Super Admin</p>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Sidebar;