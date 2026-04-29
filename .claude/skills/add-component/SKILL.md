---
name: add-component
description: Ajouter un nouveau composant MDX au projet Draft (comme Sticky, Annotation, CodeBlock) avec son fichier de test et son enregistrement dans mdx-components.tsx. Respecte le design system du projet.
---

# Skill — Ajouter un composant MDX

## Quand utiliser ce skill
- Ajouter un nouveau type de bloc visuel utilisable dans le MDX des entrées
- Enrichir la palette de composants MDX disponibles dans le flux

## Ce que ce skill fait
1. Créer `components/NomComposant.tsx` avec les props typées
2. Créer `components/NomComposant.test.tsx` avec un test de rendu minimal
3. Ajouter l'export dans `mdx-components.tsx`
4. Ajouter le style CSS dans `app/globals.css` si nécessaire
5. Lancer `npx tsc --noEmit` et `npx vitest run components/NomComposant`

## Template de composant

```tsx
// components/NomComposant.tsx
import type { ReactNode } from 'react'

type NomComposantProps = {
  readonly children: ReactNode
}

export default function NomComposant({ children }: NomComposantProps) {
  return (
    <div className="nom-composant">
      {children}
    </div>
  )
}
```

## Template de test

```tsx
// components/NomComposant.test.tsx
// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import NomComposant from './NomComposant'

describe('NomComposant', () => {
  it('should render its children', () => {
    render(<NomComposant>contenu test</NomComposant>)
    expect(screen.getByText('contenu test')).toBeDefined()
  })
})
```

## Règles du design system
- CSS via `app/globals.css` uniquement — pas de style inline, pas de CSS Modules
- Typographie : `Newsreader` pour le corps, `JetBrains Mono` pour les métadonnées
- Palette : utiliser les variables CSS (`--cream`, `--ink`, `--accent-red`, etc.)
- Composant pur : aucun state, aucun effet de bord, aucun data fetching
- Props `readonly` par défaut
- Toujours exporter en `default`
