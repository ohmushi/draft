# Tests — Draft

## Stack
- **Vitest** : tests unitaires et d'intégration (`npm test` ou `npx vitest run`)
- **@testing-library/react** : tests de composants (avec `// @vitest-environment jsdom`)
- **Co-location** : `foo.ts` → `foo.test.ts` dans le même dossier

## Règles
- Chaque use case a au moins un test (happy path + cas d'erreur)
- Chaque utilitaire public a des tests de ses cas limites
- Chaque composant React a un test de rendu minimal
- Mocker UNIQUEMENT les adaptateurs d'infrastructure — jamais la logique métier
- Tests déterministes : injecter l'horloge via le paramètre `clock`, pas `Date.now()` brut

## Pattern de test des use cases (InMemoryEntryRepository)

```typescript
import { describe, it, expect } from 'vitest'
import { createEntry } from './create-entry'
import { InMemoryEntryRepository } from '@/infrastructure/in-memory/entry-repository'

const fixedClock = () => new Date('2026-04-29T14:30:00')

describe('createEntry', () => {
  it('should create an entry with a generated slug', async () => {
    const repository = new InMemoryEntryRepository()
    const entry = await createEntry(repository, { text: 'contenu', tag: null }, fixedClock)
    expect(entry.slug).toContain('2026-04-29')
  })

  it('should throw when content is empty', async () => {
    const repository = new InMemoryEntryRepository()
    await expect(
      createEntry(repository, { text: '   ', tag: null }, fixedClock)
    ).rejects.toThrow('Entry content cannot be empty')
  })
})
```

## Ce qu'on ne teste pas
- La configuration Next.js (pages, layouts)
- Le CSS et les styles
- Les fichiers Prisma générés (`lib/generated/`)
- Les migrations SQL

## Commandes
```bash
npx vitest run          # run une fois (CI)
npx vitest              # watch mode (développement)
npx vitest run --coverage  # avec couverture
```

## Lancer les tests avant de terminer une tâche
Toujours exécuter `npx vitest run` avant de déclarer une implémentation terminée.
Si des tests échouent, corriger avant de passer à la suite.
