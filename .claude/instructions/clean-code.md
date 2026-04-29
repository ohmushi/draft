# Clean Code — Draft

## SOLID appliqué à ce projet

- **S** — Un use case = une opération. Un composant = un rôle visuel. Un repository = un modèle.
- **O** — Étendre via de nouveaux use cases ou adaptateurs, pas en modifiant les existants.
- **L** — `InMemoryEntryRepository` et `PrismaEntryRepository` sont substituables partout.
- **I** — `EntryRepository` expose seulement ce dont les use cases ont besoin (3 méthodes max).
- **D** — Les use cases reçoivent `EntryRepository` (interface), jamais `PrismaEntryRepository` (concret).

## Naming

| Catégorie | Convention | Exemple |
|---|---|---|
| Fonctions | verbe + nom | `createEntry`, `validateSlug`, `formatEntryDate` |
| Types de données | nom | `Entry`, `CreateEntryInput`, `NewEntry` |
| Interfaces | nom (pas de préfixe `I`) | `EntryRepository` |
| Booléens | `is`/`has`/`can` | `isValidSlug`, `hasTag`, `isEntryTag` |
| Constantes | SCREAMING_SNAKE | `ENTRY_TAGS` |

**Interdits** : abbréviations (`repo`, `ents`, `cnt`), noms génériques (`data`, `item`, `obj`)

## Fonctions
- Max 20 lignes — au-delà, extraire une fonction nommée
- Max 3 paramètres — au-delà, créer un type d'input
- Pas d'effets de bord cachés : une fonction qui sauvegarde ET notifie doit être nommée explicitement
- Une seule responsabilité : `toDomainEntry` ne fait que mapper, `createEntry` ne fait que créer

## TypeScript
```typescript
// ✅ type pour les shapes de données
type Entry = {
  readonly id: number
  readonly slug: string
  readonly tag: EntryTag | null
}

// ✅ interface pour les contrats polymorphiques
interface EntryRepository {
  save(entry: NewEntry): Promise<Entry>
  findAll(): Promise<Entry[]>
  findBySlug(slug: string): Promise<Entry | null>
}

// ✅ Result<T,E> pour les opérations faillibles
type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E }

// ❌ any interdit
// ❌ as unknown as X interdit sauf lib/db.ts (workaround Prisma connu)
// ❌ ! (non-null assertion) interdit — gérer le null explicitement
// ❌ champs optionnels à la place d'unions discriminantes
```

## Gestion d'erreurs
- **Dans les use cases** : retourner `Result<T, E>` pour les erreurs métier (entrée non trouvée)
- **Dans les use cases** : `throw` pour les violations de préconditions (contenu vide)
- **Dans les routes API** : catch les erreurs, retourner les codes HTTP appropriés
- **Ne jamais** laisser une erreur Prisma remonter non gérée dans une page Next.js

## Organisation des imports (ordre)
```typescript
// 1. Dépendances externes (next, react, etc.)
// 2. Dépendances domaine (@/domain/*)
// 3. Dépendances application (@/application/*)
// 4. Dépendances infrastructure (@/infrastructure/*)
// 5. Utilitaires (@/lib/*)
// 6. Composants (@/components/*)
```
