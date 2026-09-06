# CLAUDE.md — public portfolio site

This directory is the independent public repository published with GitHub Pages. The private parent repository contains biography, contacts, source spreadsheets, build scripts and NDA context; none of that is automatically safe to copy here.

## Public boundary

- Publish only owner-approved copy, images, manifests and compressed portfolio media.
- Keep private contacts, source masters, client identities under NDA, local paths, tokens and working notes out of this repo and Git history.
- Validate every claim against the approved public version; do not infer names or metrics from filenames.

## Surfaces and source contracts

- `index.html` + `videos/manifest.json` — main portfolio.
- `v2/index.html` + `v2/manifest.json` — reduced safe/NDA-conscious selection.
- `en/index.html` + `en/manifest.json` — English LetMeSolveThis surface; its selection is synchronized manually with v2.
- `agency/index.html`, `styles.css`, `app.js` + `agency/projects.json` — generated agency landing and public delivery manifest (`schemaVersion: 2`). Approved project copy is maintained outside this public repo. The export groups work by client, preserves anonymous cases and excludes unapproved examples; it is not a blind union of main/v2. Individual videos have titles without descriptions. Exported HTML and delivery data must stay in sync.
- `agency/media/` — only compressed media actually used by the active agency landing. Source masters, intake manifests, research, QA reports and the rejected design do not belong here.
- `videos/` — shared full, preview and poster assets used by manifests.

Generation scripts live outside this public repo. Do not hand-edit generated main-manifest fields or agency export files without checking their source workflow. The English manifest is intentionally manual, so a v2 selection change requires an explicit en review rather than blind copying.

## Asset lifecycle

Treat a manifest reference as a publication dependency. Before removing or replacing media:

1. search all three manifests, `agency/projects.json` and all four HTML routes;
2. confirm the canonical file and whether a delivery URL already depends on it;
3. keep each referenced full video, preview and poster together;
4. respect GitHub's per-file limits and verify the live Pages result after deployment.

Large or duplicate files are not automatically disposable. Moving future heavy delivery media to Releases/CDN is a separate migration with URL and rollback checks.

## Validation

Before commit:

- parse all JSON manifests and `agency/projects.json`;
- verify every local file referenced by a manifest exists;
- inspect `git diff --check` and `git status -sb`;
- serve locally and check desktop/mobile layouts, playback, posters, lightbox and all four routes;
- confirm `v2/`, `en/` and `agency/` retain `noindex` if that remains the owner decision.
- check agency deep links, image galleries and brief copying; verify public HTML/code hashes after Pages finishes, not just its HTTP status.

Push to `main` is a production publication action, not just a backup. Show the intended diff first and perform a Pages/hard-refresh smoke after publication.
