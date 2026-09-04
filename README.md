# Igor Maslyakov portfolio site

Static GitHub Pages portfolio with self-hosted video, previews and posters.

## Routes

- `/portfolio/` — main Russian portfolio.
- `/portfolio/v2/` — reduced safe-selection surface.
- `/portfolio/en/` — English LetMeSolveThis surface using the v2 selection with separate copy.
- `/portfolio/agency/` — agency cases, branded «Агентство», with videos grouped by confirmed client/project. Publication status is tracked in the private project's `docs/SITE-HANDOFF.md`.

All routes share assets from `videos/`. Main content uses `videos/manifest.json`; v2 and English use their own manifests. Agency content is edited manually in [agency/projects.json](agency/projects.json): `client` is blank when unknown, `theses` contains short project-level bullets, and `description` is reserved for later. Video entries carry a title, slug and orientation, without descriptions. Empty theses and descriptions leave space without placeholder copy. Read [CLAUDE.md](CLAUDE.md) before editing because this is a public repository with NDA and personal-data boundaries.

## Local check

Serve the directory with any static HTTP server, then verify all four routes, responsive layout, full/preview playback, posters and lightbox. Before publication, also parse each manifest plus `agency/projects.json` and confirm every referenced local asset exists. Agency playback uses a keyboard-accessible dialog; preview animation can be paused and respects reduced-motion preferences.

Changes pushed to `main` publish through GitHub Pages. Browser/CDN cache may require a hard refresh after the deployment completes.
