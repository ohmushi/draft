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

---

## SVG et icônes — pattern de réutilisabilité

### Isolation des SVG

Tous les SVG doivent vivre dans `components/svg/`, jamais inline dans les composants React. Cela permet :
- La réutilisation sans duplication
- Une maintenance centralisée
- Une meilleure organisation du code

### Nommage des icônes

| Type | Pattern | Exemple |
|------|---------|---------|
| Icône simple | `IconName.tsx` | `PlayIcon.tsx`, `HomeIcon.tsx` |
| Icône de bouton | `IconNameButton.tsx` | `CameraIconButton.tsx`, `MicrophoneIconButton.tsx` |
| Décoration/séparatrice | `FeatureName.tsx` | `WavyDividerIcon.tsx`, `TitleUnderlineIcon.tsx` |

### Attributs SVG dans React

```tsx
// ✅ Correct — camelCase JSX, currentColor pour héritage
export default function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="5 3 19 12 5 21" fill="currentColor" />
    </svg>
  )
}

// ❌ Incorrect — kebab-case (pas du JSX), couleur hardcodée
<svg stroke-width="1.5" stroke="#2563A8">
  <path d="..." />
</svg>
```

### Propriété `currentColor`

Utiliser `stroke="currentColor"` ou `fill="currentColor"` pour permettre l'héritage de couleur :

```tsx
// Parent contrôle la couleur via CSS
<button style={{ color: '#C0392B' }}>
  <PlayIcon />  ← hérite la couleur rouge
</button>
```

### Quand refactor un SVG inline

Si un SVG est hardcodé dans un composant et réutilisable ailleurs :

1. **Extraire** : créer `components/svg/IconName.tsx`
2. **Enregistrer** : ajouter l'export dans `components/svg/index.ts`
3. **Importer** : `import { IconName } from './svg'`
4. **Remplacer** : utiliser `<IconName />` à la place du SVG inline
