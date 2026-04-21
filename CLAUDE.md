@AGENTS.md
@CONTEXT.md
@mockup.html

# Instructions Claude

## Références obligatoires
- Toujours consulter `CONTEXT.md` avant de coder — c'est la spec du projet.
- Toujours consulter `mockup.html` — c'est la référence visuelle absolue.
- Toujours consulter `AGENTS.md` — lire les docs Next.js dans `node_modules/next/dist/docs/` avant d'écrire du code.

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
