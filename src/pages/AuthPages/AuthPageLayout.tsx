import React from "react";
// import GridShape from "../../components/common/GridShape";
// import { Link } from "react-router";
// import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-slate-900 z-1 dark:bg-slate-900 sm:p-0">
      <div className="relative flex items-center justify-center w-full h-screen dark:bg-slate-900 sm:p-0">
        {children}
      </div>
    </div>
  );
}
