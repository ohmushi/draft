---
name: add-svg-icon
description: Créer une nouvelle icône SVG réutilisable dans components/svg/ pour utilisation dans les composants React ou MDX.
---

# Skill — Ajouter une icône SVG réutilisable

## Quand utiliser ce skill
- Créer une nouvelle icône pour les boutons, contrôles ou éléments interactifs
- Exporter une icône hardcodée d'un composant vers la librairie `components/svg/`
- Ajouter des icônes pour la PWA ou le flux principal

## Ce que ce skill fait
1. Créer `components/svg/IconName.svg` — fichier SVG brut (référence)
2. Créer `components/svg/IconName.tsx` — composant React qui exporte le SVG
3. Ajouter l'export dans `components/svg/index.ts`
4. Vérifier la compilation avec `npx tsc --noEmit`

## Template — Fichier SVG brut

```svg
<!-- components/svg/IconName.svg -->
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2..." stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  <circle cx="12" cy="13" r="3"/>
</svg>
```

## Template — Composant React

```tsx
// components/svg/IconName.tsx
export default function IconName() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2..."
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3" />
    </svg>
  )
}
```

## Conventions de nommage

| Type | Pattern | Exemple |
|------|---------|---------|
| Icône simple | `IconName.tsx` | `PlayIcon.tsx`, `PauseIcon.tsx` |
| Bouton icône | `IconNameButton.tsx` | `CameraIconButton.tsx`, `MicrophoneIconButton.tsx` |
| Décoration/séparatrice | `FeatureName.tsx` | `WavyDividerIcon.tsx`, `TitleUnderlineIcon.tsx` |

## Bonnes pratiques

### Attributs SVG
- **`viewBox`** : `0 0 24 24` pour les petites icônes (16×16, 20×20)
- **`stroke`** : `currentColor` pour hériter la couleur du parent
- **`fill`** : `none` pour les icônes au trait uniquement
- **`strokeWidth`** : `1.5` pour trait fin, `2` pour plus de poids
- **`strokeLinecap` / `strokeLinejoin`** : `round` pour un look arrondi

### React JSX
- Utiliser camelCase (`strokeWidth`, `strokeLinecap`, pas `stroke-width`)
- Pas de `width` / `height` — laisser le parent contrôler via CSS
- Pas de classes CSS inline — utiliser le `currentColor`
- Utiliser les attributs pour adapter le rendu (ex: `opacity`)

### Couleurs
- **Jamais** hardcoder des couleurs (`#C0392B`, `#1C1A17`)
- Utiliser `currentColor` pour l'héritage
- Si besoin de couleur fixe (logo), la passer en prop ou l'hardcoder explicitement avec un commentaire

### Exemple : refactor d'un SVG inline

**Avant** (dans `AudioPlayer.tsx`) :
```tsx
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
  <polygon points="5 3 19 12 5 21" fill="currentColor"/>
</svg>
```

**Après** (dans `components/svg/PlayIcon.tsx`) :
```tsx
export default function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points="5 3 19 12 5 21"
        fill="currentColor"
      />
    </svg>
  )
}
```

**Puis** dans `components/svg/index.ts` :
```ts
export { default as PlayIcon } from './PlayIcon'
```

**Puis** dans `AudioPlayer.tsx` :
```tsx
import { PlayIcon } from './svg'

export default function AudioPlayer() {
  return (
    <button>
      <PlayIcon />
    </button>
  )
}
```

## Mise à jour de l'index

Toujours ajouter le nouvel export dans `components/svg/index.ts` :

```ts
export { default as NewIconName } from './NewIconName'
export { default as AnotherIcon } from './AnotherIcon'
```

## Vérification finale

```bash
# Compiler et vérifier les types
npx tsc --noEmit

# Si des tests importent ces icônes
npx vitest run
```

## Quand utiliser les SVG composants vs `next/image`

| Situation | Utilisez |
|-----------|----------|
| Petite icône (16–24px) | `components/svg/IconName.tsx` |
| Logo ou décoration | `components/svg/DecorName.tsx` |
| Photo, image de contenu | `next/image` (avec optimisation) |
| SVG du flux Figma | Exporter + placer dans `components/svg/` |
