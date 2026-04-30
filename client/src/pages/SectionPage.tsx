// client/src/pages/SectionPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { getSection } from "@/lib/sections";

type ResourceMeta = { id: string; filename: string };

export default function SectionPage() {
  const { section, id } = useParams<{ section: string; id: string }>();
  const [resources, setResources] = useState<ResourceMeta[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sectionMeta = section ? getSection(section) : undefined;
  const sectionTitle = sectionMeta?.title ?? "Resources";

  useEffect(() => {
    if (section && !id) {
      const controller = new AbortController();
      fetch(`/api/sections/${section}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((data) => setResources(data.resources ?? []))
        .catch((err) => {
          if (err.name !== "AbortError") {
            setError("Failed to load resources.");
          }
        });
      return () => controller.abort();
    }
  }, [section, id]);

  if (!section || !sectionMeta) {
    return (
      <main className="mx-auto max-w-4xl px-8 py-16">
        <p className="text-sm text-destructive">Unknown section.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-8 py-16">
      {!id ? (
        <>
          <h1 className="mb-1 text-3xl font-semibold tracking-tight text-foreground">
            {sectionTitle}
          </h1>
          <p className="mb-10 text-sm text-muted-foreground">
            Select a resource to begin.
          </p>

          {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

          {resources.length === 0 && !error ? (
            <p className="text-sm text-muted-foreground">
              No resources here yet.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {resources.map((r) => (
                <li key={r.id}>
                  <Link
                    to={`/${section}/${r.id}`}
                    className="group flex items-center justify-between py-3 transition-colors hover:text-primary"
                  >
                    <span className="font-mono text-sm text-foreground group-hover:text-primary">
                      {r.id}
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
              to={`/${section}`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back to {sectionTitle}
            </Link>
            <a
              href={`/api/sections/${section}/${id}/raw`}
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
            src={`/api/sections/${section}/${id}/raw`}
            className="w-full rounded border border-border"
            style={{ height: "80vh" }}
            title={id}
          />
        </>
      )}
    </main>
  );
}
