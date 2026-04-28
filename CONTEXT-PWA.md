# Draft — CONTEXT-PWA

> Document de référence pour le développement de la porte mobile de Draft.
> La PWA vit dans la même application Next.js que le flux global, sous la route `/studio`.

---

## Contexte & intention

Draft a deux portes d'entrée pour créer une entrée :

- **La porte IDE** — fichiers MDX dans `content/entries/`, pour les entrées complexes (projets dev, demos, billets construits)
- **La porte mobile (cette PWA)** — interface minimaliste accessible depuis l'iPhone, pour les **éclairs** : pensées rapides, photos, enregistrements audio

Un éclair est une entrée comme une autre dans le flux. Même format de sortie, même fichier MDX dans `content/entries/`. Deux portes, un seul flux.

### Philosophie de l'éclair
> "Comme prendre une note sur mon iPhone"

- 0 friction — ouvrir, écrire, envoyer
- Pas de bilan parfait, pas de structure imposée
- Brut assumé — une phrase suffit, une photo suffit
- Le tag est **optionnel** et se choisit **après** avoir écrit, pas avant

---

## Architecture

Tout vit dans la même app Next.js. Pas de repo séparé.

```
app/
├── studio/
│   └── page.tsx              ← PWA de saisie
├── api/
│   └── entry/
│       └── route.ts          ← API Route qui reçoit l'éclair et le pousse
```

### Flux de données

```
/studio (PWA sur iPhone)
    ↓  POST multipart (texte + photos + audio optionnels)
/api/entry (Next.js API Route)
    ↓  médias → MinIO (self-hosted)
    ↓  fichier MDX → GitHub API (content/entries/)
GitHub push → Dokploy détecte → rebuild automatique
Draft mis à jour
```

### Infrastructure
- **Hébergement** : serveur personnel via **Dokploy** (pas Vercel — app non statique)
- **Médias** : **MinIO** self-hosted pour photos et audio
- **Auth** : aucune pour l'instant. À ajouter plus tard.

---

## Route `/studio`

### Comportement PWA
Ajoutée à l'écran d'accueil iPhone via "Ajouter à l'écran d'accueil" → mode standalone, plus de barre Safari.

`manifest.json` requis :
```json
{
  "name": "Draft",
  "short_name": "Draft",
  "display": "standalone",
  "background_color": "#F5F0E8",
  "theme_color": "#1C1A17",
  "start_url": "/studio",
  "icons": [...]
}
```

Dans le `<head>` :
```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
```

### Protection
Pas d'authentification pour l'instant — `/studio` est accessible librement. À sécuriser plus tard (middleware + cookie signé).

Variables d'environnement :
```
GITHUB_TOKEN=ghp_...
GITHUB_OWNER=ton_username
GITHUB_REPO=draft
MINIO_ENDPOINT=https://minio.ton-serveur.com
MINIO_ACCESS_KEY=...
MINIO_SECRET_KEY=...
MINIO_BUCKET=draft-media
```

---

## Interface — ce qui a été validé

Le design est validé. Le fichier `draft-pwa.html` est la référence visuelle absolue.

### Structure de l'écran
```
┌─────────────────────────┐
│  Draft.        → flux   │  ← header (logo + lien vers le flux)
│ ─────────────────────── │  ← ligne SVG ondulée
│                         │
│  [textarea]             │  ← zone d'écriture, focus immédiat
│                         │
│  [recording bar]        │  ← visible seulement si enregistrement actif
│  [media previews]       │  ← thumbs photos/audio si ajoutés
│                         │
├─────────────────────────┤
│  tag  dev  dessin  ...  │  ← tags optionnels (aucun par défaut)
│  [📷 icône] [🎙 icône]  [publier ↑] │
└─────────────────────────┘
```

### Règles UX importantes
- **Le textarea a le focus immédiatement** à l'ouverture — on écrit sans toucher l'écran
- **Aucun tag sélectionné par défaut** — le tag est optionnel, il se choisit après avoir écrit
- **Cliquer un tag actif le désélectionne** (toggle)
- **"publier" est désactivé** tant qu'il n'y a ni texte, ni photo, ni audio
- **Pas de confirmation** avant envoi — brut assumé, cohérent avec l'esprit Draft
- **Feedback de succès** : overlay discret (✓ + "posté dans le flux"), disparaît après 1.6s, reset de l'interface

### Icônes
SVG au trait fin (`stroke-width: 1.5`, `stroke-linecap: round`), pas d'emojis.

Appareil photo :
```svg
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="2" y="6" width="20" height="14" rx="2"/>
  <circle cx="12" cy="13" r="3.5"/>
  <path d="M8 6V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1"/>
</svg>
```

Microphone :
```svg
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="9" y="2" width="6" height="11" rx="3"/>
  <path d="M5 10a7 7 0 0 0 14 0"/>
  <line x1="12" y1="17" x2="12" y2="21"/>
  <line x1="9" y1="21" x2="15" y2="21"/>
</svg>
```

---

## Design system (identique au flux global)

```css
:root {
  --cream: #F5F0E8;
  --cream-dark: #EDE7D9;
  --ink: #1C1A17;
  --ink-soft: #3D3A35;
  --ink-faint: #8C8880;
  --accent-red: #C0392B;
  --accent-blue: #2563A8;
  --accent-green: #4A7C59;
  --paper-line: rgba(28, 26, 23, 0.08);
}
```

Typographie :
- `Playfair Display` 700 → logo
- `Newsreader` 300/400 → textarea, labels
- `JetBrains Mono` 300/400 → tags, métadonnées, boutons

Tags (couleurs) :
```css
.tag-dev      { background: rgba(37,99,168,0.12);  color: #2563A8; }
.tag-dessin   { background: rgba(74,124,89,0.12);  color: #4A7C59; }
.tag-music    { background: rgba(192,57,43,0.12);  color: #C0392B; }
.tag-ecriture { background: rgba(212,160,23,0.15); color: #8a6600; }
```

---

## API Route — `/api/entry`

Reçoit un `multipart/form-data` avec :

| Champ | Type | Requis |
|---|---|---|
| `text` | string | non (si media présent) |
| `tag` | string | non |
| `photos` | File[] | non |
| `audio` | File | non |

### Logique de traitement

```ts
// app/api/entry/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const text = formData.get('text') as string
  const tag = formData.get('tag') as string

  // 1. Upload médias vers MinIO → récupérer les URLs
  // 2. Construire le contenu MDX
  // 3. Pousser vers GitHub via Octokit

  const date = new Date().toISOString().slice(0, 10)
  const slug = `${date}-${Date.now()}`
  const filename = `${slug}.mdx`

  const mdxContent = buildMDX({ text, tag, mediaUrls: [] })

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

  await octokit.repos.createOrUpdateFileContents({
    owner: process.env.GITHUB_OWNER!,
    repo: process.env.GITHUB_REPO!,
    path: `content/entries/${filename}`,
    message: `éclair: ${slug}`,
    content: Buffer.from(mdxContent).toString('base64'),
  })

  return NextResponse.json({ ok: true, slug })
}

function buildMDX({ text, tag, mediaUrls }: {
  text: string
  tag: string
  mediaUrls: string[]
}) {
  const frontmatter = tag ? `---\ntag: ${tag}\n---\n\n` : ''
  const images = mediaUrls.map(url => `![](${url})`).join('\n')
  return `${frontmatter}${text ?? ''}${images ? '\n\n' + images : ''}`
}
```

Dépendance à ajouter :
```bash
npm install @octokit/rest
npm install minio  # client MinIO officiel
```

---

## Format de sortie — fichier MDX généré

Identique aux entrées manuelles. Le flux ne fait pas la différence entre un éclair et une entrée IDE.

```
content/entries/2026-04-24-1745489312000.mdx
```

Contenu minimal (texte seul, sans tag) :
```mdx
j'ai passé 20 minutes à essayer de comprendre pourquoi ce hook re-rendait. c'était une dépendance manquante dans le useEffect. évidemment.
```

Contenu avec tag et photo :
```mdx
---
tag: dessin
---

troisième essai sur les mains. toujours aussi difficile.

![](https://minio.ton-serveur.com/draft-media/2026-04-24-esquisse-mains.jpg)
```

---

## Ordre de développement recommandé

1. **`/studio/page.tsx`** — interface validée (référence : `draft-pwa.html`)
2. **`/api/entry/route.ts`** — réception du formData, construction MDX, push GitHub (sans médias d'abord)
3. **Tester le flux complet** texte seul → fichier MDX dans le repo → rebuild
4. **Intégration MinIO** — upload photos et audio, injection des URLs dans le MDX
5. **`manifest.json` + balises apple** — activer le mode PWA standalone

---

*Draft — tout est en cours.