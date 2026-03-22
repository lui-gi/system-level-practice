import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowRight } from "lucide-react";

type ResourceMeta = { id: string; filename: string };

export default function PracticePage() {
  const { id } = useParams<{ id: string }>();
  const [resources, setResources] = useState<ResourceMeta[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      fetch("/api/resources")
        .then((r) => r.json())
        .then((data) => setResources(data.resources ?? []))
        .catch(() => setError("Failed to load resources."));
    }
  }, [id]);

  return (
    <main className="mx-auto max-w-4xl px-8 py-16">
      {!id ? (
        <>
          <h1 className="mb-1 text-3xl font-semibold tracking-tight text-foreground">
            Practice Resources
          </h1>
          <p className="mb-10 text-sm text-muted-foreground">
            Select a resource to begin.
          </p>

          {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

          {resources.length === 0 && !error ? (
            <p className="text-sm text-muted-foreground">
              No resources yet. Add{" "}
              <code className="font-mono text-xs">.html</code> files to the{" "}
              <code className="font-mono text-xs">resources/</code> folder.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {resources.map((r) => (
                <li key={r.id}>
                  <Link
                    to={`/practice/${r.id}`}
                    className="group flex items-center justify-between py-3 transition-colors hover:text-primary"
                  >
                    <span className="font-mono text-sm text-foreground group-hover:text-primary">
                      {r.filename}
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
              to="/practice"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ← All resources
            </Link>
            <a
              href={`/api/resources/${id}/raw`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Open in new tab ↗
            </a>
          </div>
          <h1 className="mb-6 font-mono text-2xl font-semibold text-foreground">
            {id}
          </h1>
          <iframe
            src={`/api/resources/${id}/raw`}
            className="w-full rounded border border-border"
            style={{ height: "80vh" }}
            title={id}
          />
        </>
      )}
    </main>
  );
}
