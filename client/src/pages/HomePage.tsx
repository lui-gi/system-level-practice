import { Link } from "react-router";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">
        CSC 3320 Practice Hub
      </h1>
      <p className="text-muted-foreground text-lg max-w-md text-center">
        Practice resources for System Level Programming.
      </p>
      <div className="flex gap-4">
        <Link
          to="/practice"
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm font-medium shadow hover:bg-primary/90 transition-colors"
        >
          Practice Resources
        </Link>
        <Link
          to="/slides"
          className="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-3 text-sm font-medium shadow-sm hover:bg-accent transition-colors"
        >
          Lecture Slides
        </Link>
      </div>
    </main>
  );
}
