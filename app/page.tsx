import { getAllEntries } from "@/lib/entries";
import EntryCard from "@/components/EntryCard";

export default function Home() {
  const entries = getAllEntries();

  return (
    <main>
      {entries.map((entry, i) => (
        <div key={entry.slug}>
          <EntryCard entry={entry} index={i} />
          {i < entries.length - 1 && <hr className="entry-sep" />}
        </div>
      ))}

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
