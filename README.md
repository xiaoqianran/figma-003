# Figma 学习 003 - 参考 GODY

**Dual-Mode Project: Static "黄控台" Primary + React + Vite (in development)**

This repository cleanly supports **two experiences at the same time** with zero deletions of original work.

## Primary Experience (GitHub Pages — What Visitors See)

The beautiful original static **黄控台 (Yellow Console)**:

- `index.html` (landing page at repo root)
- `gody-app/console.html` (the full-featured interactive prototype console)
- All prototype HTML folders living directly at the project root (e.g. `home-page/`, `login-page/`, `map-pages/`, `trips-pages/`, `confirm-pickup*-page/`, etc.)

**44 prototypes** are loaded via `gody-app/page-registry.json` using relative paths (`../xxx-page/...`).

**Live URL**: https://xiaoqianran.github.io/figma-003/

This is the **authoritative, always-visible** version on GitHub Pages. The deployment workflow uploads the entire project root so the original design system and all static files remain untouched and primary.

## React + Vite Tech Stack (Development in Progress)

Modern React 19 + TypeScript + Vite + Tailwind re-implementation lives in `src/`:

- `src/App.tsx` — the React-powered "GODY LAB • REACT" console (device simulator, search/filter, zoom/rotate, registry-driven)
- `src/page-registry.json` — same data shape as the static one (for consistency)
- `src/main.tsx`, styling, etc.

**Prototype previews in the React console** are powered by iframes pointing to the dedicated mirror:

- `public/prototypes/` — **exact, complete copy** of all 26 prototype folders from the root (kept in sync manually or via copy scripts during development).

This mirror allows the React build (`npm run build`) to be completely self-contained.

### Running the React Edition Locally

```bash
npm install
npm run dev          # Vite dev server (visit the React console entry as appropriate for your setup)
npm run build        # Produces dist/ (React assets + public/prototypes/ inside)
npm run preview      # Preview the built React output
```

The React console can preview **exactly the same 44 prototypes** as the static 黄控台.

## How the Dual Setup Works

| Aspect                    | Static "黄控台" (Primary on Pages)          | React + Vite (src/)                          |
|---------------------------|---------------------------------------------|---------------------------------------------|
| Entry point               | `index.html` → `gody-app/console.html`     | `src/App.tsx` (bundled)                     |
| Prototype files           | Folders at project root                     | Mirror at `public/prototypes/` (for build)  |
| Registry                  | `gody-app/page-registry.json`               | `src/page-registry.json` (imported)         |
| Iframe paths              | `../login-page/index.html` etc.             | `${BASE_URL}prototypes/login-page/...`      |
| GitHub Pages behavior     | Fully deployed (no build step)              | Not deployed (dev/build only)               |
| When editing a prototype  | Edit root folder directly                   | Also sync to `public/prototypes/`           |

- **No original HTML, folders, or gody-app/ were deleted or moved.**
- `public/prototypes/` is the **only** additional copy required for the React stack to be independent.
- The deployment workflow (`.github/workflows/deploy.yml`) explicitly avoids building the React app so the static primary experience is never overwritten.

## Keeping Prototypes in Sync

After modifying any root-level prototype folder (HTML, assets, jsx/scss experiments), run a sync so the React edition sees the latest:

```powershell
# Example PowerShell (or equivalent shell script)
$protoDirs = @('account-pages', 'choose-car-page', ...); foreach ($d in $protoDirs) { Copy-Item $d "public/prototypes" -Recurse -Force }
```

Or simply copy the changed folder into `public/prototypes/`.

## Project Structure Highlights

- `gody-app/` — static console + its registry + styles
- `*-page/` / `*-pages/` (26 folders) — original prototype sources (used by static)
- `public/prototypes/` — mirror for React/Vite self-contained builds
- `src/` — React source (App.tsx is the new console UI)
- `.github/workflows/deploy.yml` — deploys full root for static primacy
- Root `index.html` — beautiful static landing (preserved)

## Philosophy

The original hand-crafted static 黄控台 with its exquisite industrial aesthetic is the **shipped product** and the face of the GitHub Pages site.

The React + Vite work is a parallel modernization track that can eventually offer enhanced interactivity, while always being able to preview 100% of the same prototype content.

Both modes coexist peacefully.

---

**Figma 学习 003** — Preserving craft while exploring modern stacks.
