@AGENTS.md
@CONTEXT.md
@mockup.html
@draft-pwa.html
@CONTEXT-PWA.md
@.claude/instructions/architecture.md
@.claude/instructions/testing.md
@.claude/instructions/clean-code.md
@.claude/instructions/documentation.md

# Instructions Claude

## Références obligatoires
- Toujours consulter `AGENTS.md` — lire les docs Next.js dans `node_modules/next/dist/docs/` avant d'écrire du code.
- Toujours consulter `CONTEXT.md` avant de coder — c'est la spec du projet.
- Toujours consulter `mockup.html` — c'est la référence visuelle absolue.
- Toujours consulter `CONTEXT-PWA.md` avant de coder — c'est la spec du PWA.
- Toujours consulter `draft-pwa.html` — c'est la référence visuelle absolue pour la PWA.

## Documentation
Suivre `.claude/instructions/documentation.md` — toute modification non triviale met à jour `CONTEXT.md`, `README.md` ou l'instruction concernée. Les décisions d'architecture donnent lieu à un ADR dans `docs/adr/`.

## Architecture
Suivre strictement les couches définies dans `.claude/instructions/architecture.md`.
Toute nouvelle fonctionnalité passe par un use case dans `application/`.
Jamais d'appel Prisma direct dans les pages ou composants.

## Tests
Chaque nouveau fichier de logique (use case, utilitaire) est accompagné de son `.test.ts`.
Lancer `npx vitest run` avant de déclarer une tâche terminée.

## Style de réponse
- Code direct, pas de blabla.
- Pas de reformulation de la demande.

## Qualité de code
- TypeScript strict, pas de `any`, pas de `!` (non-null assertion).
- Noms explicites, pas d'abréviations cryptiques.
- Un fichier = une responsabilité.
- CSS vanilla ou globals.css, pas de sur-ingénierie.
- `readonly` par défaut sur les types du domaine.
- `Result<T, E>` pour les opérations faillibles — jamais de `throw` dans la logique métier.
