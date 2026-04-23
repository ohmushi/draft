import { getAllEntries } from "@/lib/entries";
import EntryCard from "@/components/EntryCard";

export default async function Home() {
  const entries = getAllEntries();

  const entryModules = await Promise.all(
    entries.map((entry) => import(`@/content/entries/${entry.slug}.mdx`))
  );

  return (
    <main>
      {entries.map((entry, i) => {
        const Post = entryModules[i].default;
        return (
          <div key={entry.slug}>
            <EntryCard entry={entry} index={i}>
              <Post />
            </EntryCard>
            {i < entries.length - 1 && <hr className="entry-sep" />}
          </div>
        );
      })}

      {entries.length === 0 && (
        <p style={{ color: "var(--ink-faint)", fontStyle: "italic" }}>
          Aucune entrée pour le moment.
        </p>
      )}

      {entries.length > 0 && (
        <div className="scroll-hint">↓ &nbsp; plus haut dans le flux</div>
      )}
    </main>
  );
}
