# Igor Maslyakov portfolio site

Static GitHub Pages portfolio with self-hosted video, previews and posters.

## Routes

- `/portfolio/` — main Russian portfolio.
- `/portfolio/v2/` — reduced safe-selection surface.
- `/portfolio/en/` — English LetMeSolveThis surface using the v2 selection with separate copy.

All routes share assets from `videos/`. Main content uses `videos/manifest.json`; v2 and English use their own manifests. Read [CLAUDE.md](CLAUDE.md) before editing because this is a public repository with NDA and personal-data boundaries.

## Local check

Serve the directory with any static HTTP server, then verify all three routes, responsive layout, full/preview playback, posters and lightbox. Before publication, also parse each manifest and confirm every referenced local asset exists.

Changes pushed to `main` publish through GitHub Pages. Browser/CDN cache may require a hard refresh after the deployment completes.
