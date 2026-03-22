import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";

type ResourceMeta = { id: string; filename: string };

export default function PracticePage() {
  const { id } = useParams<{ id: string }>();
  const [resources, setResources] = useState<ResourceMeta[]>([]);
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      fetch("/api/resources")
        .then((r) => r.json())
        .then((data) => setResources(data.resources ?? []))
        .catch(() => setError("Failed to load resources."));
    } else {
      fetch(`/api/resources/${id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.error) setError(data.error);
          else setHtml(data.html);
        })
        .catch(() => setError("Failed to load resource."));
    }
  }, [id]);

  return (
    <main className="min-h-screen bg-background p-8 max-w-4xl mx-auto">
      <Link
        to="/"
        className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block"
      >
        Back to home
      </Link>

      {!id ? (
        <>
          <h1 className="text-3xl font-bold mb-6">Practice Resources</h1>
          {error && (
            <p className="text-destructive mb-4">{error}</p>
          )}
          {resources.length === 0 && !error ? (
            <div className="rounded-lg border border-border p-6 text-center text-muted-foreground">
              No resources found. Add <code>.html</code> files to the{" "}
              <code>resources/</code> folder.
            </div>
          ) : (
            <ul className="space-y-2">
              {resources.map((r) => (
                <li key={r.id}>
                  <Link
                    to={`/practice/${r.id}`}
                    className="block rounded-md border border-border px-4 py-3 hover:bg-accent transition-colors font-mono text-sm"
                  >
                    {r.filename}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <Link
            to="/practice"
            className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block ml-4"
          >
            Back to list
          </Link>
          <h1 className="text-3xl font-bold mb-6 font-mono">{id}</h1>
          {error && <p className="text-destructive">{error}</p>}
          {html && (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </>
      )}
    </main>
  );
}
