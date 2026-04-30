# Draft

Atelier personnel — flux chronologique unique. Voir [CONTEXT.md](CONTEXT.md) pour la vision.

## Navigation

| Route | Description |
|---|---|
| `/` | Flux chronologique de toutes les entrées |
| `/entry/[slug]` | Entrée individuelle |
| `/studio` | PWA de saisie rapide (éclairs) — accessible depuis le flux via le lien header ou le FAB |
| `/about` | Page à propos |

## Dev local

```bash
npm install
npm run dev
```

Ouvre http://localhost:3000.

## Run via Docker (local)

```bash
cp .env.example .env
docker compose -f docker-compose.local.yml up --build
```

L'app est exposée sur `http://localhost:3000`. Postgres écoute sur `localhost:5432`.

## Deploy via Dokploy

L'app se déploie comme une application **Compose** Dokploy. Traefik (fourni par Dokploy) gère le domaine et le TLS, donc le `docker-compose.yml` ne contient **aucun label Traefik** — tout passe par l'UI.

1. **Créer l'application** dans Dokploy → type *Compose* → brancher ce repo Git, branche par défaut, *Compose Path* = `docker-compose.yml`.
2. **Onglet *Environment*** : copier-coller les variables de `.env.example` et remplir les valeurs réelles (notamment `POSTGRES_PASSWORD` et `DATABASE_URL`). Le hostname Postgres en prod est `postgres` (nom du service Compose).
3. **Onglet *Domains*** : ajouter le domaine voulu, *Service Name* = `app`, *Container Port* = `3000`, activer HTTPS (Let's Encrypt).
4. **Deploy**. Au premier déploiement, Dokploy crée le bind mount `../files/postgres` à côté du projet (inclus dans les backups Dokploy), Postgres s'initialise, puis l'app applique `prisma migrate deploy` au boot avant de démarrer.

Au push suivant sur la branche, Dokploy rebuild et redéploie automatiquement (si l'auto-deploy est activé).

### Notes infra

- Réseau interne `draft` : isole l'app et Postgres.
- Réseau externe `dokploy-network` : permet à Traefik d'atteindre `app`. Il doit exister sur le démon Docker — Dokploy le crée à l'installation.
- Persistance Postgres : bind mount `../files/postgres` (convention Dokploy backup-friendly), pas de volume nommé.
- MinIO : bloc commenté dans le compose, à activer quand la PWA `/studio` poussera des médias.

