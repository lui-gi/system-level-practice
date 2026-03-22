import type { ReactNode } from "react";
import Navbar from "./Navbar.tsx";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {children}
    </div>
  );
}
