# Architecture — Draft (Clean Architecture)

## Couches (dépendances vers l'intérieur uniquement)

```
domain/          ← entités, interfaces de repositories, value objects (zéro dépendance externe)
application/     ← use cases (dépend uniquement de domain/)
infrastructure/  ← implémentations Prisma, MinIO, GitHub (dépend de domain/)
app/             ← Next.js : pages, API routes, layouts (dépend de application/)
components/      ← React components purs (props seulement, aucun data fetching)
lib/             ← utilitaires partagés : slug, date, validation
```

## Règles absolues
- `domain/` n'importe JAMAIS Prisma, Next.js, ou toute dépendance infra
- `application/` ne connaît pas Prisma — seulement les interfaces du domain
- Les pages Next.js appellent des use cases, jamais un repository directement
- Les components React ne font jamais de data fetching (aucun `fetch`, aucun Prisma)
- Chaque use case = un fichier = une seule responsabilité

## Patterns à utiliser
- **Repository pattern** : interface dans `domain/`, implémentation dans `infrastructure/prisma/`
- **Use case** : une fonction par opération (createEntry, listEntries, getEntry)
- **Result<T, E>** : pas d'exceptions pour les cas métier, des types discriminants
- **Input/Output types** explicites pour chaque use case (jamais de Prisma types leakés)
- **Injection de dépendances** : les use cases reçoivent leurs dépendances en paramètre (testabilité)

## Structure cible
```
domain/
  entry.ts           ← type Entry, interface EntryRepository, type CreateEntryInput, Result<T,E>
application/
  create-entry.ts    ← use case createEntry(repository, input, clock?)
  list-entries.ts    ← use case listEntries(repository)
  get-entry.ts       ← use case getEntry(repository, slug) → Result<Entry, EntryNotFoundError>
infrastructure/
  prisma/
    entry-repository.ts      ← PrismaEntryRepository implements EntryRepository
  in-memory/
    entry-repository.ts      ← InMemoryEntryRepository (pour les tests uniquement)
components/
  svg/
    index.ts         ← exports centralisés (TitleUnderlineIcon, WavyDividerIcon, etc.)
    IconName.tsx     ← composants SVG réutilisables
    IconName.svg     ← fichiers SVG bruts (référence)
app/
  api/entry/route.ts ← injecte PrismaEntryRepository dans les use cases
```

## Règle des SVG dans `components/`

**Tous les SVG doivent être isolés dans `components/svg/`**, jamais inline dans les composants React.

```tsx
// ❌ Incorrect — SVG inline dans le composant
export default function Button() {
  return (
    <button>
      <svg viewBox="..."><path d="..." /></svg>
    </button>
  )
}

// ✅ Correct — SVG exporté depuis components/svg/
import { IconName } from './svg'
export default function Button() {
  return (
    <button>
      <IconName />
    </button>
  )
}
```

**Raisons :**
- Réutilisabilité — une icône peut être utilisée dans plusieurs composants
- Maintenabilité — modifier une icône se fait au même endroit
- Testabilité — les SVG peuvent être testés indépendamment
- Organisation — distinction claire entre logique et présentation

## Convention d'injection
Les use cases reçoivent le repository en premier paramètre, puis les données en deuxième.
Le `clock` (horloge) est injecté en troisième paramètre avec une valeur par défaut, pour les tests déterministes.

```typescript
// ✅ Correct
async function createEntry(
  repository: EntryRepository,
  input: CreateEntryInput,
  clock: () => Date = () => new Date(),
): Promise<Entry>

// ❌ Incorrect — couplage à Prisma
async function createEntry(input: CreateEntryInput): Promise<Entry> {
  await getPrisma().entry.create(...)
}
```
