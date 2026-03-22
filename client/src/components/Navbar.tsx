import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/slides", label: "Slides" },
  { to: "/practice", label: "Practice" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-8">
        <Link
          to="/"
          className="text-sm font-semibold text-foreground transition-colors hover:text-muted-foreground"
        >
          SysLevel Practice
        </Link>
        <nav className="flex items-center gap-6">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "text-sm transition-colors",
                pathname.startsWith(to)
                  ? "font-medium text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
