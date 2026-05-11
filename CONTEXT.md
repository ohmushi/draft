# Draft — Contexte de projet

> Document de référence généré depuis la session de conceptualisation.  
> À garder à la racine du projet et à consulter depuis IntelliJ.

---

## Vision

**Draft** est un atelier personnel en ligne. Un flux chronologique unique où cohabitent du code, des esquisses, des idées à moitié formées, des fils de pensée. Pas de catégories imposées, pas de bilans parfaits. Une caméra embarquée sur le processus créatif d'un développeur qui explore au-delà du dev.

### Valeurs fondatrices
- **Le brut assumé** — poster pendant, pas après. La trace compte plus que le résultat.
- **Tout est mélangé** — dev, dessin, musique, écriture dans un seul flux. Rien n'est isolé, tout s'influence.
- **Pour soi d'abord** — le partage est secondaire. Pas de pression d'audience.
- **Tout est en cours** — le site lui-même est un draft.

### La métaphore centrale
Un **atelier** — pas un portfolio, pas un blog. Un endroit où les choses sont en cours, où il y a de la matière partout, du désordre créatif assumé. On entre dans un atelier, on n'y est pas spectateur.

---

## Format des entrées

Une entrée = **une pensée, une séance, un moment**. Court et fréquent plutôt que long et rare.

- Pas de bilan parfait — écrire *pendant* la tentative
- Du brut assumé : une esquisse floue, un bout de code qui ne marche pas encore, une idée à moitié formée
- Logique de **fil** : les entrées s'accumulent et forment quelque chose ensemble
- Flux **unique et chronologique** — tout mélangé, pas de catégories séparées

---

## Design

### Concept visuel
**Le carnet de poche d'un artiste-ingénieur.** Pas le carnet propre et Instagram — le vrai, celui qui a traîné dans une poche, avec des annotations dans les marges, des couleurs qui débordent, mais où on sent une main qui sait ce qu'elle fait.

### Palette
```css
:root {
  --cream:       #F5F0E8;   /* fond principal — papier cassé */
  --cream-dark:  #EDE7D9;   /* fond secondaire — zones de code, images */
  --ink:         #1C1A17;   /* texte principal */
  --ink-soft:    #3D3A35;   /* texte corps des entrées */
  --ink-faint:   #8C8880;   /* métadonnées, dates, labels */
  --accent-red:  #C0392B;   /* annotations, ponctuation du titre */
  --accent-blue: #2563A8;   /* tag dev, bordure blocs de code */
  --accent-green:#4A7C59;   /* tag dessin */
  --accent-yellow:#D4A017;  /* tag écriture */
  --paper-line:  rgba(28, 26, 23, 0.08); /* séparateurs subtils */
}
```

### Typographie
| Usage | Police | Variante |
|---|---|---|
| Titre `Draft` | Playfair Display | 700, serif expressif |
| Corps des entrées | Newsreader | 300/400, italic disponible |
| Dates, tags, code inline, nav | JetBrains Mono | 300/400 |

Import Google Fonts :
```
https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Newsreader:ital,wght@0,300;0,400;1,300;1,400&family=JetBrains+Mono:wght@300;400&display=swap
```

### Layout
- Colonne unique centrée, `max-width: 680px`
- Généreux en espacement — les entrées respirent
- Pas de sidebar, pas de grille
- Fond crème avec texture papier subtile (SVG noise inline)
- Ligne SVG dessinée à la main sous le titre

### Couleurs par tag (pilules)
```css
.tag-dev      { background: rgba(37, 99, 168, 0.12); color: #2563A8; }
.tag-dessin   { background: rgba(74, 124, 89, 0.12);  color: #4A7C59; }
.tag-music    { background: rgba(192, 57, 43, 0.12);  color: #C0392B; }
.tag-ecriture { background: rgba(212, 160, 23, 0.15); color: #8a6600; }
```
> Les tags ne sont pas des catégories strictes — juste un marqueur discret. De nouveaux tags peuvent apparaître librement.

### Composants visuels spéciaux (MDX)
Ces composants enrichissent les entrées au-delà du markdown standard :

| Composant | Rendu | Usage |
|---|---|---|
| `<Sticky>` | Post-it jaune légèrement incliné | Pensée en marge, citation personnelle |
| `<Annotation>` | Texte italique rouge avec bordure gauche | Note de renvoi, "→ revenir là-dessus" |
| `<CodeBlock lang="js">` | Bloc monospace fond crème-dark, bordure bleue gauche | Extraits de code |
| `<AudioPlayer src="…">` | Player minimaliste fond crème-dark, bouton play/pause SVG, barre de progression 60fps | Enregistrements audio postés depuis le studio |
| Image markdown `![](url)` | `<img>` fond crème-dark, bordure pointillée, `border-radius: 2px` | Esquisses, captures, photos depuis MinIO |

### Organisation des SVG — `components/svg/`

Tous les SVG sont isolés dans `components/svg/` pour garantir la réutilisabilité et maintenir une architecture propre.

**Contenu du dossier :**
- `IconName.svg` — fichier SVG brut (référence source)
- `IconName.tsx` — composant React qui exporte l'SVG
- `index.ts` — exports centralisés

**Icônes disponibles :**
| Icône | Fichier | Usage |
|---|---|---|
| Titre underline | `TitleUnderlineIcon.tsx` | Ligne ondulée rouge sous le logo Draft |
| Wavy divider | `WavyDividerIcon.tsx` | Séparatrice wavy du flux principal |
| PWA divider | `PwaWavyDividerIcon.tsx` | Séparatrice wavy du studio mobile |
| Play | `PlayIcon.tsx` | Bouton lecture audio |
| Pause | `PauseIcon.tsx` | Bouton pause audio |
| Camera | `CameraIconButton.tsx` | Bouton photo dans le studio |
| Microphone | `MicrophoneIconButton.tsx` | Bouton enregistrement audio dans le studio |

**Pattern d'utilisation :**
```tsx
import { PlayIcon, PauseIcon } from '@/components/svg'

export default function AudioPlayer() {
  return (
    <button>
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </button>
  )
}
```

### Animations
- `fadeUp` au chargement des entrées (staggered, délai 0.05s par entrée)
- `pulse` sur l'indicateur de scroll (2.5s, opacity 0.4→1)
- Hover sur `.entry-date` : passage de `ink-faint` à `ink`

---

## Stack technique

| Couche | Choix | Raison |
|---|---|---|
| Framework | **Next.js** (App Router) | Déjà maîtrisé, pas de surprise |
| Contenu | **PostgreSQL** via Prisma 7 | Entrées stockées en base, MDX compilé au runtime (`next-mdx-remote`) |
| Rendu | **SSR dynamique** (`force-dynamic`) | Données viennent de la DB à chaque requête |
| Hébergement | **Dokploy** (serveur perso, Docker + compose) | App dynamique, Traefik gère le TLS |
| Style | **CSS Modules ou globals.css** | Pas de sur-ingénierie |

### Dépendances clés
```bash
npm install @prisma/client @prisma/adapter-pg next-mdx-remote
npm install -D prisma
```

### `next.config.ts`
```ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  output: 'standalone',
  pageExtensions: ['ts', 'tsx'],
}

export default config
```

---

## Structure du projet

```
draft/
├── prisma/
│   ├── schema.prisma                    ← modèle Entry (id, slug, date, tag, time, content)
│   └── migrations/                      ← migrations SQL générées par Prisma
├── app/
│   ├── page.tsx                         ← flux (accueil), SSR dynamique, compileMDX
│   ├── entry/
│   │   └── [slug]/
│   │       └── page.tsx                 ← page individuelle, SSR dynamique, compileMDX
│   ├── api/
│   │   └── entry/
│   │       └── route.ts                 ← POST : insert en DB + revalidatePath
│   ├── layout.tsx                       ← header, footer, fonts
│   └── globals.css                      ← variables CSS, styles globaux
├── components/
│   ├── svg/
│   │   ├── index.ts                     ← exports centralisés (TitleUnderlineIcon, PlayIcon, etc.)
│   │   ├── IconName.tsx                 ← composants SVG réutilisables
│   │   └── IconName.svg                 ← fichiers SVG bruts (référence)
│   ├── EntryCard.tsx                    ← une entrée dans le flux
│   ├── Sticky.tsx                       ← post-it jaune (composant MDX)
│   ├── Annotation.tsx                   ← note rouge en marge (composant MDX)
│   ├── CodeBlock.tsx                    ← bloc de code stylisé (composant MDX)
│   ├── AudioPlayer.tsx                  ← player audio avec PlayIcon et PauseIcon
│   └── PhotoGrid.tsx                    ← grille d'images (composant MDX)
├── lib/
│   ├── db.ts                            ← singleton Prisma (lazy, PrismaPg adapter)
│   ├── entries.ts                       ← getAllEntries / getEntryBySlug via Prisma
│   └── generated/prisma/               ← client Prisma généré (ne pas éditer)
├── public/
├── Dockerfile                           ← multi-stage, standalone, migrate deploy
├── docker-compose.yml                   ← prod (Dokploy) : app + postgres
├── docker-compose.local.yml             ← local : ports exposés
└── next.config.ts
```

---

## Format d'une entrée

Une entrée = une ligne dans la table `Entry` de PostgreSQL.

| Champ | Type | Description |
|---|---|---|
| `id` | `Int` | PK auto-increment |
| `slug` | `String` | Unique — `YYYY-MM-DD-<timestamp>` |
| `date` | `String` | Date de création `YYYY-MM-DD` |
| `tag` | `String?` | Tag optionnel : `dev`, `dessin`, `music`, `ecriture` |
| `time` | `String?` | Heure `HH:MM` (optionnel) |
| `content` | `String` | Corps MDX brut (sans frontmatter) |
| `createdAt` | `DateTime` | Timestamp automatique |

Le champ `content` accepte du MDX : markdown standard + composants `<Sticky>`, `<Annotation>`, `<CodeBlock>`. Le rendu est compilé au runtime via `next-mdx-remote/rsc`.

### Créer une entrée

Via la PWA `/studio` (POST sur `/api/entry`) ou directement en DB.

**Exemple avec code et annotation :**
```mdx
---
tag: dev
---

Je me suis retrouvé à réécrire trois fois la même fonction.

<CodeBlock lang="js">
const render = (src) => {
  return parse(src).transform(highlight)
}
</CodeBlock>

Le fait que je bloque sur ça me dit quelque chose. Peut-être que la question
n'est pas technique.

<Annotation>→ revenir là-dessus demain, tête reposée</Annotation>
```

---

## `lib/entries.ts` — logique de lecture

```ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const ENTRIES_DIR = path.join(process.cwd(), 'content/entries')

export type Entry = {
  slug: string
  date: string
  tag: string
  excerpt: string
}

export function getAllEntries(): Entry[] {
  const files = fs.readdirSync(ENTRIES_DIR)
    .filter(f => f.endsWith('.mdx'))
    .sort()
    .reverse() // plus récent en premier

  return files.map(filename => {
    const slug = filename.replace(/\.mdx$/, '')
    const datePart = slug.slice(0, 10) // YYYY-MM-DD
    const raw = fs.readFileSync(path.join(ENTRIES_DIR, filename), 'utf-8')
    const { data, content } = matter(raw)

    return {
      slug,
      date: datePart,
      tag: data.tag ?? 'autre',
      excerpt: content.slice(0, 200).trim(),
    }
  })
}

export function getEntryBySlug(slug: string) {
  const filepath = path.join(ENTRIES_DIR, `${slug}.mdx`)
  const raw = fs.readFileSync(filepath, 'utf-8')
  const { data, content } = matter(raw)
  return { slug, date: slug.slice(0, 10), tag: data.tag ?? 'autre', content }
}
```

---

## `mdx-components.tsx` — composants globaux

```tsx
import type { MDXComponents } from 'mdx/types'
import Sticky from './components/Sticky'
import Annotation from './components/Annotation'
import CodeBlock from './components/CodeBlock'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Sticky,
    Annotation,
    CodeBlock,
    ...components,
  }
}
```

---

## Navigation (pages)

| Route | Fichier | Contenu |
|---|---|---|
| `/` | `app/page.tsx` | Flux chronologique de toutes les entrées |
| `/entry/[slug]` | `app/entry/[slug]/page.tsx` | Entrée individuelle complète |
| `/about` | `app/about/page.tsx` | Page à propos (à écrire plus tard) |
| `/studio` | `app/studio/page.tsx` | PWA de saisie rapide (éclairs) |

### Accès au studio depuis le flux

Deux points d'entrée vers `/studio` sont présents sur le flux :

- **Lien header** : icône crayon + label `éclair` aligné à droite en face du logo (`.studio-link`). JetBrains Mono 0.62rem uppercase, `--ink-faint` → `--ink` au hover.
- **FAB** : bouton rond fixe (`position: fixed`, `bottom: 2rem`, `right: 2rem`, `z-index: 20`), fond `--ink`, icône `+` SVG blanche. Sur viewport ≥ 720px, s'aligne avec la colonne de contenu via `right: calc((100vw - 680px) / 2 - 1rem)`.

---

## Prototype HTML de référence

Le fichier `draft-mockup.html` (livré avec ce document) est le prototype validé.  
Il est la référence visuelle absolue pour l'implémentation.

### Points clés à reproduire fidèlement
- Titre `Draft` en Playfair Display 700 avec point rouge `::after`
- Ligne SVG dessinée à la main sous le titre (`stroke="#C0392B"`)
- Tagline en italique Newsreader léger
- Navigation en JetBrains Mono uppercase avec `→` rouge sur l'élément actif
- Séparateur SVG wavy entre header et contenu
- Entrées avec `fadeUp` staggered au chargement
- Tags en pilules colorées (voir palette par tag)
- `<Sticky>` : fond `#F5E642`, `rotate(-1.5deg)`, ombre douce
- `<Annotation>` : italique rouge, bordure gauche 2px rouge
- `<CodeBlock>` : monospace, fond `--cream-dark`, bordure gauche bleue
- Séparateurs entre entrées : ligne fine avec `--paper-line`
- Footer : `"Draft — atelier ouvert depuis 2026"` · dot rouge · `"tout est en cours"`

---

## Ordre de développement recommandé

1. `next.config.ts` + installation des dépendances
2. `globals.css` — variables CSS et styles de base
3. `mdx-components.tsx` — déclaration des composants globaux
4. `components/Sticky.tsx`, `Annotation.tsx`, `CodeBlock.tsx`
5. `lib/entries.ts` — lecture et parsing des fichiers MDX
6. `app/layout.tsx` — header, footer, import des fonts
7. `app/page.tsx` — flux principal
8. `app/entry/[slug]/page.tsx` — page individuelle
9. Premières vraies entrées dans `content/entries/`

---

*Draft — tout est en cours.*