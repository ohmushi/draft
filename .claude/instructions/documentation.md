# Documentation — Draft

## Principe

Toute modification non triviale doit laisser une trace écrite. Le code dit *quoi*, la doc dit *pourquoi*.

---

## Ce qui doit être mis à jour systématiquement

### `CONTEXT.md`
Mettre à jour dès qu'un changement affecte :
- la stack technique (nouvelle dépendance, changement d'outil)
- la structure du projet (nouveau dossier, nouvelle couche)
- le schéma de données (nouveau modèle, nouveau champ)
- les composants MDX disponibles
- le design system (nouvelle variable CSS, nouvelle police)

### `CONTEXT-PWA.md`
Mettre à jour dès qu'un changement affecte :
- la route `/studio` et ses fonctionnalités
- le flux de données PWA → API → DB
- l'infrastructure médias (MinIO, GitHub API)

### `README.md`
Mettre à jour dès qu'un changement affecte :
- les commandes de dev ou de déploiement
- les prérequis ou variables d'environnement
- la procédure de déploiement Dokploy

### `.claude/instructions/`
Mettre à jour l'instruction concernée dès qu'une règle évolue (architecture, tests, qualité de code, documentation).

### `.env.example`
Tenir à jour avec **toutes** les variables utilisées dans le code, commentées si désactivées.

### `.claude/instructions/todo.md`
Mettre à jour après toute modification qui :
- complète un item → cocher ✅ avec la date (ex: `✅ 2026-04-30`)
- révèle un nouveau besoin → ajouter un item ⬜ avec contexte et intention
- rend un item obsolète → le noter dans l'item et le déplacer en ✅ avec la raison

---

## Quand créer un nouveau document

### Architecture Decision Record (ADR)
Créer un fichier `docs/adr/YYYY-MM-DD-titre.md` pour chaque décision d'architecture significative :
- Choix d'une technologie ou d'une bibliothèque
- Changement de stratégie de persistance ou de déploiement
- Introduction d'un nouveau pattern (ex: Result<T,E>, Clean Architecture)
- Décision de ne *pas* faire quelque chose (et pourquoi)

Format minimal :
```markdown
# ADR — Titre

**Date** : YYYY-MM-DD
**Statut** : Accepté | Supersédé par [lien]

## Contexte
Pourquoi cette décision était nécessaire.

## Décision
Ce qui a été choisi.

## Conséquences
Ce que ça implique (avantages, compromis, impact futur).
```

### Nouveau composant MDX
Mettre à jour la section *Composants visuels spéciaux* dans `CONTEXT.md` + ajouter une entrée dans `mdx-components.tsx`.

### Nouvelle route ou API
Mettre à jour la section *Structure du projet* dans `CONTEXT.md`.

---

## Ce qui n'a pas besoin de doc

- Corrections de bugs évidents (typo, lint, import manquant)
- Changements de style purement cosmétiques sans impact sur le design system
- Refactors internes sans changement de comportement (renommage de variable locale, etc.)
