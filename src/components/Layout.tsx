"use client";

import { SessionProvider } from "next-auth/react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SessionProvider>
      <div className="flex">
        <Sidebar />
        <div className="ml-64 flex-1 p-6 bg-gray-100 min-h-screen">
          {children}
        </div>
      </div>
    </SessionProvider>
  );
};

export default Layout;
