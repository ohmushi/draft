@AGENTS.md
@CONTEXT.md
@mockup.html
@draft-pwa.html
@CONTEXT-PWA.md

# Instructions Claude

## Références obligatoires
- Toujours consulter `AGENTS.md` — lire les docs Next.js dans `node_modules/next/dist/docs/` avant d'écrire du code.
- Toujours consulter `CONTEXT.md` avant de coder — c'est la spec du projet.
- Toujours consulter `mockup.html` — c'est la référence visuelle absolue.
- Toujours consulter `CONTEXT-PWA.md` avant de coder — c'est la spec du PWA.
- Toujours consulter `draft-pwa.html` — c'est la référence visuelle absolue pour la PWA.

## Style de réponse
- Code direct, pas de blabla.
- Exposer la solution sans explication à rallonge.
- Pas de reformulation de la demande.

## Qualité de code
- TypeScript strict.
- Pas de `any`.
- Noms explicites, pas d'abréviations cryptiques.
- Un fichier = une responsabilité.
- CSS vanilla ou globals.css, pas de sur-ingénierie.
- Suivre la structure de projet définie dans CONTEXT.md.
