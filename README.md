# Igor Maslyakov portfolio site

Static GitHub Pages portfolio with self-hosted video, previews and posters.

## Routes

- `/portfolio/` — main Russian portfolio.
- `/portfolio/v2/` — reduced safe-selection surface.
- `/portfolio/en/` — English LetMeSolveThis surface using the v2 selection with separate copy.
- `/portfolio/agency/` — agency cases, branded «Агентство», with videos grouped by confirmed client/project. Publication status is tracked in the private project's `docs/SITE-HANDOFF.md`.

Main, v2 and English share assets from `videos/` and use their respective manifests. The agency landing reuses those videos and adds compressed, approved media in `agency/media/`.

The agency surface is a static editorial landing with selected client cases, separate AI and editing collections, image galleries, a working process, service formats and anonymous team roles. [agency/projects.json](agency/projects.json) is its generated public delivery manifest (`schemaVersion: 3`), not a second editable source. It contains approved case copy, grouped work URLs, curated galleries and Telegram contacts. The HTML, CSS, JavaScript and manifest are exported together from approved sources maintained outside this public repository. Do not copy private source manifests or working documents into it. Read [CLAUDE.md](CLAUDE.md) before editing.

## Local check

Serve the directory with a static HTTP server, then verify all four routes, responsive layout, full/preview playback, posters and lightbox. Before publication, also parse each manifest plus `agency/projects.json` and confirm every referenced local asset exists. Agency playback uses keyboard-accessible dialogs with previous/next video controls. AI and editing collections have a large selected preview and thumbnail navigation, with horizontal swipe on touch screens. Client cases keep their own galleries, including contact sheets, campaign artwork and image zoom. Preview animation can be paused and respects reduced-motion and data-saving preferences. Old agency case hashes redirect to their regrouped case or section.

The agency landing has no contact form and no links to client social profiles. Its only contact is [@kseniapetel](https://t.me/kseniapetel), including the header and no-JavaScript fallback. No backend or analytics service is required. The agency, v2 and English routes retain `noindex`.

Changes pushed to `main` publish through GitHub Pages. Browser/CDN cache may require a hard refresh after the deployment completes.
