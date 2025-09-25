import React, { ReactNode } from "react";
import Navbar from "./Navbar"; // We'll create this next

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
