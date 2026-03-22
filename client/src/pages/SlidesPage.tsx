import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowRight } from "lucide-react";

type SlideMeta = { filename: string };

export default function SlidesPage() {
  const { filename } = useParams<{ filename: string }>();
  const [slides, setSlides] = useState<SlideMeta[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!filename) {
      fetch("/api/slides")
        .then((r) => r.json())
        .then((data) => setSlides(data.slides ?? []))
        .catch(() => setError("Failed to load slide list."));
    }
  }, [filename]);

  return (
    <main className="mx-auto max-w-5xl px-8 py-16">
      {!filename ? (
        <>
          <h1 className="mb-1 text-3xl font-semibold tracking-tight text-foreground">
            Lecture Slides
          </h1>
          <p className="mb-10 text-sm text-muted-foreground">
            Select a deck to view.
          </p>

          {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

          {slides.length === 0 && !error ? (
            <p className="text-sm text-muted-foreground">
              No slides yet. Add{" "}
              <code className="font-mono text-xs">.pdf</code> files to the{" "}
              <code className="font-mono text-xs">slides/</code> folder.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {slides.map((s) => (
                <li key={s.filename}>
                  <Link
                    to={`/slides/${s.filename}`}
                    className="group flex items-center justify-between py-3 transition-colors hover:text-primary"
                  >
                    <span className="font-mono text-sm text-foreground group-hover:text-primary">
                      {s.filename}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/slides"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ← All slides
            </Link>
            <a
              href={`/api/slides/${filename}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Open in new tab ↗
            </a>
          </div>
          <h1 className="mb-6 font-mono text-2xl font-semibold text-foreground">
            {filename}
          </h1>
          <iframe
            src={`/api/slides/${filename}`}
            className="w-full rounded border border-border"
            style={{ height: "80vh" }}
            title={filename}
          />
        </>
      )}
    </main>
  );
}
