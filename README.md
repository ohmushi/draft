# Draft

Atelier personnel — flux chronologique unique. Voir [CONTEXT.md](CONTEXT.md) pour la vision.

## Dev local

```bash
npm install
npm run dev
```

Ouvre http://localhost:3000.

## Run via Docker

```bash
cp .env.example .env   # remplir GITHUB_TOKEN/OWNER/REPO si on veut tester /api/entry
docker compose up --build
```

L'app écoute sur le port `3000` du service. En local, décommenter le bloc `ports:` dans `docker-compose.yml` pour l'exposer sur l'hôte.

## Deploy via Dokploy

1. Pointer Dokploy sur ce repo (le `docker-compose.yml` est détecté automatiquement)
2. Renseigner les variables d'env (cf `.env.example`)
3. Push → Dokploy rebuild et publie derrière Traefik (TLS auto)
