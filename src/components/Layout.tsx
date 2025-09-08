import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout: React.FC = () => {
  return (
    <div className="min-h-dvh bg-[var(--surface)] text-[var(--text)]">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
