"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 p-6 bg-gray-100 min-h-screen transition-all duration-300 ${
        isOpen ? "lg:ml-80" : "lg:ml-0"
      }`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
