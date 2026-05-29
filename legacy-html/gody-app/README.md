# GODY • Integrated Prototype

This folder is the **single source of truth** for previewing and gradually integrating all the previously scattered HTML pages of the GODY mobile application.

## Why this exists

Previously every screen lived in its own folder (`home-page/`, `trips-pages/`, `payment-pages/`, etc). Each file duplicated the same container styling, status bar, fonts, and colors. Cross-page links only worked when you manually managed file paths.

**Now** there is one beautiful device previewer that brings every screen together with:

- Consistent iPhone frame (375×812)
- Working relative navigation between any screens
- Searchable sidebar grouped by flow
- Quick core user flow buttons
- Optional persistent app-level bottom tab chrome
- Easy path to deeper integration

## How to run (Recommended)

```bash
# From the project root (the folder containing gody-app/)
python -m http.server 5173
# or
npx serve -p 5173
```

Then open: **http://localhost:5173/gody-app/**

> Using a real local server is important — it makes all the original relative links (`../trip-pages/...`) work perfectly inside the iframe.

You can also open `gody-app/index.html` directly, but some deep navigation may be limited due to browser `file://` security rules.

## Keyboard Shortcuts

- `Cmd/Ctrl + K` — Focus the search box
- `R` (when body focused) — Reload current screen
- `?` — Show integration help

## Current Architecture (Gradual)

| Layer              | Status     | Notes |
|--------------------|------------|-------|
| Device shell + iframe | ✅ Done   | All 44 screens accessible |
| Page registry      | ✅ Done   | `page-registry.json` (auto-generated) |
| App chrome overlay | ✅ Done   | Toggleable bottom tabs |
| Shared CSS extract | Planned    | Next logical step |
| View partials (no iframe) | Planned | For key flows |
| Real React app     | Long-term  | `.figma/` already has many `.jsx` + SCSS modules ready |

## How to add / integrate a new page

1. Put the new HTML file in its logical folder (or a new `feature-xxx-page/` folder).
2. Re-run the registry generator (or manually add an entry to `page-registry.json`).
3. (Optional but powerful) If the page is part of a core flow, copy its inner `.xxx-container` + unique styles into `gody-app/views/feature-name.html` so we can later render it without an iframe and share state/CSS.

## Recommended Next Integration Steps

1. **Extract a shared bottom tab bar** (used on Home, Trips, Profile, etc.)
2. **Pick one complete booking flow** and promote its 5–7 screens into first-class views (no iframe).
3. **Create a tiny shared `common.css`** containing:
   - Status bar
   - Phone container reset
   - Primary color `#fecc2a`
   - Typography stack
4. **Migrate high-value screens to React** using the existing components under `.figma/`

## File Structure

```
gody-app/
├── index.html           # The beautiful unified preview shell
├── page-registry.json   # All screens + friendly names
├── README.md
├── styles/              # Future shared CSS
├── scripts/
│   └── preview.js       # Controller (search, routing, chrome, keyboard)
└── views/               # Future: extracted page partials (no iframe)
```

---

**This is the beginning of one cohesive application instead of 20+ disconnected prototypes.**

Start by running the server, exploring the Login → Home → Trips flow, and then decide which flow to deeply integrate next.
