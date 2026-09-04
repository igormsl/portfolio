# AGENTS.md — Public portfolio — Codex

Инструкции для Codex в этой папке. Пути ниже относительны к ней; команды выполняются из корня соответствующего Git-репозитория.

## Сначала прочитать

- [CLAUDE.md](CLAUDE.md)
- [videos/manifest.json](videos/manifest.json)
- [v2/manifest.json](v2/manifest.json)
- [en/manifest.json](en/manifest.json)

## Рабочий контракт

- This is an independent public repository. Only approved public copy and media belong here; keep private source materials and operator notes outside it.
- Review main, v2 and en together when changing shared assets. The English selection is maintained manually; generated main fields have an upstream owner.
- A manifest reference is a delivery dependency. Keep full video, preview and poster consistent; do not remove assets based on size or duplication alone.
- Push to the publishing branch can publish the site. Require authorization covering publication and verify Pages separately from the local preview.

## Проверка

Parse all three JSON manifests and check their local media paths. Inspect desktop/mobile playback, posters, lightbox and routes; preserve intended noindex on v2/en. Check git diff --check.
