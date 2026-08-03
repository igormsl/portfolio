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
- `videos/` — shared full, preview and poster assets used by manifests.

The parent private repo owns the generation scripts. Do not hand-edit generated main-manifest fields without checking that workflow. The English manifest is intentionally manual, so a v2 selection change requires an explicit en review rather than blind copying.

## Asset lifecycle

Treat a manifest reference as a publication dependency. Before removing or replacing media:

1. search all three manifests and HTML files;
2. confirm the canonical file and whether a delivery URL already depends on it;
3. keep each referenced full video, preview and poster together;
4. respect GitHub's per-file limits and verify the live Pages result after deployment.

Large or duplicate files are not automatically disposable. Moving future heavy delivery media to Releases/CDN is a separate migration with URL and rollback checks.

## Validation

Before commit:

- parse all JSON manifests;
- verify every local file referenced by a manifest exists;
- inspect `git diff --check` and `git status -sb`;
- serve locally and check desktop/mobile layouts, playback, posters, lightbox and all three routes;
- confirm `v2/` and `en/` retain `noindex` if that remains the owner decision.

Push to `main` is a production publication action, not just a backup. Show the intended diff first and perform a Pages/hard-refresh smoke after publication.
