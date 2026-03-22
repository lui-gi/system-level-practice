import { Link } from "react-router";
import { ArrowRight, BookOpen, PenLine } from "lucide-react";

const sections = [
  {
    to: "/slides",
    icon: BookOpen,
    title: "Lecture Slides",
    description: "Browse PDF slide decks from class. Cross-reference topics while working through practice problems.",
    highlight: false,
  },
  {
    to: "/practice",
    icon: PenLine,
    title: "Practice Resources",
    description: "Exercises and quizzes scoped to course material. Test your understanding topic by topic.",
    highlight: true,
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-8 py-20">

      {/* Hero */}
      <section className="mb-20">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          CSC 3320 · System Level Programming
        </p>
        <h1 className="mb-4 text-4xl font-semibold tracking-tight text-foreground">
          SysLevel Practice
        </h1>
        <p className="mb-8 max-w-md text-sm leading-relaxed text-muted-foreground">
          Practice resources for CSC 3320. Includes lecture slides for easy cross-referencing.
        </p>

      </section>

      {/* Section cards */}
      <section>
        <p className="mb-6 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Sections
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {sections.map(({ to, icon: Icon, title, description, highlight }) => (
            <Link
              key={to}
              to={to}
              className={`group flex flex-col gap-4 rounded border p-6 transition-colors ${
                highlight
                  ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border-border hover:bg-accent"
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`h-4 w-4 ${highlight ? "text-primary-foreground" : "text-primary"}`} />
                <ArrowRight className={`h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100 ${highlight ? "text-primary-foreground" : "text-muted-foreground"}`} />
              </div>
              <div>
                <h3 className={`mb-1 text-sm font-medium ${highlight ? "text-primary-foreground" : "text-foreground"}`}>{title}</h3>
                <p className={`text-xs leading-relaxed ${highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Attribution */}
      <div className="mt-10 flex flex-col items-start gap-3">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          made by:
        </p>
        <pre
          className="font-mono text-xs text-muted-foreground"
          style={{ animation: "spinY 6s linear infinite", display: "inline-block" }}
        >{` _       _       _
| |_   _(_) __ _(_)
| | | | | |/ _\` | |
| | |_| | | (_| | |
|_|\\__,_|_|\\__, |_|
           |___/   `}</pre>
      </div>
    </div>
  );
}
