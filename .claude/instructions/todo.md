# TODO — Draft

> Intentions et fonctionnalités restantes à implémenter.
> Ce fichier est la mémoire du projet : chaque entrée décrit **pourquoi** quelque chose doit être fait, pas juste quoi.
> Mettre à jour après chaque modification qui complète, ajoute ou rend obsolète un item.

---

## Règle de mise à jour

Après toute modification non triviale :
- Cocher ✅ les items complétés (avec la date)
- Ajouter les nouveaux items découverts en cours de route
- Ne jamais supprimer les items ✅ — ils forment le journal du projet

---

## Studio — Médias

### ✅ Upload réel des photos — 2026-05-03
**Contexte** : L'UI de sélection de photo est en place dans `/studio`. La photo s'affiche en preview locale (base64 via FileReader), mais n'est jamais envoyée au serveur. La `formData` POST vers `/api/entry` ne contient que `text` et `tag`.  
**Intention** : Envoyer la photo dans la formData (`photos[]`), l'uploader vers MinIO depuis la route API, injecter l'URL publique dans le MDX généré comme `![](https://minio…)`.  
**Dépend de** : Intégration MinIO.

### ✅ Enregistrement audio réel (MediaRecorder API) — 2026-05-11
**Contexte** : Le timer d'enregistrement dans le studio est une simulation visuelle — aucun son n'est capturé. `isRecording` incrémente un compteur, c'est tout.  
**Intention** : Utiliser `navigator.mediaDevices.getUserMedia({ audio: true })` + `MediaRecorder` pour capturer un vrai flux audio, produire un `Blob` (format webm/ogg), puis l'uploader vers MinIO à la publication.  
**Contrainte UX** : demander la permission micro seulement au premier clic sur le bouton — pas à l'ouverture de l'app.

### ✅ Preview audio avant publication — 2026-05-11
**Contexte** : Après avoir "enregistré", l'utilisateur voit une vignette `🎵 0:32` mais ne peut pas réécouter le clip avant de publier. C'est un risque d'erreur (mauvaise prise).  
**Intention** : Ajouter un `<audio>` natif minimaliste dans la vignette, ou un bouton play/pause SVG qui rejoue le blob local. Doit rester dans l'esprit graphique du projet (pas de player HTML5 par défaut).  
**Dépend de** : Enregistrement audio réel.

### ✅ Intégration MinIO (stockage des médias) — 2026-05-03
**Contexte** : MinIO est mentionné dans CONTEXT-PWA.md comme solution de stockage des médias, mais aucune infrastructure n'existe dans le code. Il n'y a ni client, ni adaptateur, ni variable d'environnement active.  
**Intention** : Créer une interface `MediaStorage` dans `domain/` (méthode `upload(file, filename) → url`), implémenter `MinioMediaStorage` dans `infrastructure/minio/`, l'injecter dans la route API. Ajouter les variables `MINIO_*` dans `.env.example`.

---

## Flux — Affichage des médias

### ⬜ Affichage des images dans le flux et les entrées individuelles
**Contexte** : Le MDX supporte `![](url)` et les images s'affichent via le rendu MDX standard. Mais il n'y a pas de style particulier : pas de `next/image`, pas de classe CSS dédiée, pas de placeholder pendant le chargement.  
**Intention** : Styler les images dans `globals.css` (`.entry-body img`) pour qu'elles s'inscrivent dans le design — fond crème-dark, bordure pointillée, `border-radius: 2px`, comme le mockup. Envisager `next/image` pour l'optimisation si les images viennent de MinIO (domaine connu).

### ⬜ Player audio dans le flux
**Contexte** : Un enregistrement posté depuis le studio sera inséré dans le MDX comme lien ou balise audio. Il n'existe pas encore de composant `<Audio>` MDX, et le player HTML5 natif est visuellement incompatible avec le design.  
**Intention** : Créer un composant MDX `<Audio src="…" />` avec un player minimaliste — bouton play/pause SVG, durée en JetBrains Mono, fond `--cream-dark`. L'enregistrer dans `mdx-components.tsx`. Ajouter le composant `Audio` au tableau de `CONTEXT.md`.

---

## Studio — UX & robustesse

### ⬜ Authentification du studio
**Contexte** : `/studio` est accessible sans protection. C'est acceptable en phase de dev perso, mais dès que le site est public, n'importe qui peut poster dans le flux.  
**Intention** : Ajouter un middleware Next.js qui vérifie un cookie signé (`draft-auth`). Pas de formulaire de login élaboré — un simple mot de passe posté vers une route `/api/auth` qui pose le cookie. L'interface de login doit rester dans l'esprit de la PWA (sobre, sans framework d'auth).

### ⬜ Message d'erreur plus précis dans le studio
**Contexte** : En cas d'échec de publication, le studio affiche "erreur — réessayer" sans aucun détail. Difficile de diagnostiquer si c'est réseau, validation, ou serveur.  
**Intention** : Récupérer le champ `error` de la réponse JSON de l'API et l'afficher dans le message. Rester discret (pas de toast agressif) — une ligne en `--accent-red` sous le bouton publier suffit.

---

## Flux principal

### ⬜ Pagination ou "charger plus"
**Contexte** : `listEntries` retourne toutes les entrées en une requête. Pas de problème maintenant, mais à 200+ entrées le rendu initial sera lent et inutilement chargé.  
**Intention** : Ajouter une limite côté use case (`listEntries(repository, { limit, offset })`), un curseur ou un simple bouton "voir les entrées précédentes" en bas du flux. Préférer la simplicité à l'infinite scroll automatique — l'intention est un flux chronologique que l'on remonte volontairement.

### ⬜ Navigation entre entrées sur la page individuelle
**Contexte** : `/entry/[slug]` affiche une entrée complète mais sans aucune navigation vers les entrées adjacentes. L'utilisateur doit revenir au flux pour passer à l'entrée suivante.  
**Intention** : Ajouter en bas de la page individuelle des liens "← entrée précédente" / "entrée suivante →" en JetBrains Mono, dans l'esprit du carnet — sans titres, juste les dates. Nécessite d'enrichir `getEntry` ou d'ajouter un use case `getAdjacentEntries`.

### ⬜ Métadonnées SEO pour les entrées individuelles
**Contexte** : Les pages `/entry/[slug]` n'ont pas de `generateMetadata`. Le `<title>` est celui du layout racine pour toutes les pages.  
**Intention** : Exporter `generateMetadata` depuis `app/(main)/entry/[slug]/page.tsx` avec un titre basé sur la date et le tag (ex: `"dev · 29 avr. 2026 — Draft"`), et une description extraite des 150 premiers caractères du contenu.

---

## Pages manquantes

### ⬜ Page `/about`
**Contexte** : Le lien "à propos" apparaît dans la navigation du header mais pointe vers une page inexistante.  
**Intention** : Une page courte, écrite en MDX ou directement en TSX — texte personnel sur la philosophie du projet, sans mise en scène. Dans l'esprit "atelier ouvert", pas un portfolio.

---

## PWA & infrastructure

### ⬜ Icônes PWA pour iOS
**Contexte** : `manifest.json` pointe uniquement vers `favicon.ico`. Sur iOS, "Ajouter à l'écran d'accueil" génère une icône floue ou vide sans les tailles requises (180×180 pour apple-touch-icon, 192×192 et 512×512 pour le manifest).  
**Intention** : Générer les icônes aux bonnes tailles (fond `--cream`, lettre D en Playfair Display), les placer dans `public/`, mettre à jour `manifest.json` et ajouter `<link rel="apple-touch-icon">` dans le layout.

### ⬜ `apple-mobile-web-app-*` dans le layout studio
**Contexte** : CONTEXT-PWA.md liste les balises méta nécessaires au mode standalone iOS (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`). Elles ne sont pas présentes dans `app/studio/layout.tsx`.  
**Intention** : Les ajouter via `export const metadata` dans le layout studio pour que l'app se comporte correctement une fois ajoutée à l'écran d'accueil (barre de statut, mode plein écran).

---

## Complétés ✅

Les items complétés sont marqués inline dans leurs sections respectives.
