import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";

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
    <main className="min-h-screen bg-background p-8 max-w-5xl mx-auto">
      <Link
        to="/"
        className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block"
      >
        Back to home
      </Link>

      {!filename ? (
        <>
          <h1 className="text-3xl font-bold mb-6">Lecture Slides</h1>
          {error && <p className="text-destructive mb-4">{error}</p>}
          {slides.length === 0 && !error ? (
            <div className="rounded-lg border border-border p-6 text-center text-muted-foreground">
              No slides found. Add <code>.pdf</code> files to the{" "}
              <code>slides/</code> folder.
            </div>
          ) : (
            <ul className="space-y-2">
              {slides.map((s) => (
                <li key={s.filename}>
                  <Link
                    to={`/slides/${s.filename}`}
                    className="block rounded-md border border-border px-4 py-3 hover:bg-accent transition-colors font-mono text-sm"
                  >
                    {s.filename}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/slides"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Back to slides list
            </Link>
            <a
              href={`/api/slides/${filename}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Open in new tab
            </a>
          </div>
          <h1 className="text-2xl font-bold mb-4 font-mono">{filename}</h1>
          <iframe
            src={`/api/slides/${filename}`}
            className="w-full rounded-lg border border-border"
            style={{ height: "80vh" }}
            title={filename}
          />
        </>
      )}
    </main>
  );
}
