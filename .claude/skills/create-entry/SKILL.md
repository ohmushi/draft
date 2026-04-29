---
name: create-entry
description: Créer une nouvelle entrée dans le flux Draft en suivant l'architecture Clean Architecture du projet. Génère le slug, construit le contenu MDX, et insère via le use case createEntry (jamais Prisma directement).
---

# Skill — Créer une entrée Draft

## Quand utiliser ce skill
- Ajouter une entrée de test ou d'exemple dans le flux
- Créer une entrée programmatiquement via la base de données
- Déboguer le pipeline de création d'entrée

## Ce que ce skill fait
1. Demander le contenu (texte MDX), le tag optionnel (`dev`, `dessin`, `music`, `ecriture`), et l'heure optionnelle
2. Appeler le use case `createEntry` de `@/application/create-entry` avec un `PrismaEntryRepository`
3. Vérifier que l'entrée est bien persistée (slug retourné)
4. Lancer `npx tsc --noEmit` pour valider la compilation
5. Lancer `npx vitest run application/create-entry` pour valider les tests

## Conventions obligatoires
- Slug généré via `generateSlug(formatDate(now), now.getTime())` depuis `@/lib/slug`
- Tag typé `EntryTag | null` — valider avec `isEntryTag()` depuis `@/domain/entry`
- Contenu MDX sans frontmatter si pas de tag, avec frontmatter `---\ntag: X\n---` si tag présent
- Jamais d'appel direct à `getPrisma()` dans le use case — passer par l'interface `EntryRepository`

## Exemple d'appel correct
```typescript
import { createEntry } from '@/application/create-entry'
import { PrismaEntryRepository } from '@/infrastructure/prisma/entry-repository'

const entry = await createEntry(
  new PrismaEntryRepository(),
  { text: 'contenu MDX', tag: 'dev' },
)
```

## Structure d'une entrée MDX avec tag
```mdx
---
tag: dev
---

Corps de l'entrée en markdown standard.

<Annotation>→ note en marge</Annotation>
```
