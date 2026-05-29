# Figma 学习 003 - GODY React Prototype Console

> **🚀 在线演示**： [https://xiaoqianran.github.io/figma-003/](https://xiaoqianran.github.io/figma-003/)

## 快速访问

- 🚀 **在线演示** — [https://xiaoqianran.github.io/figma-003/](https://xiaoqianran.github.io/figma-003/)
- 📖 **完整迁移报告** — [MIGRATION.md](./MIGRATION.md)
- 📁 **React 源码** — [`src/`](./src/)（44 个真实页面组件）
- 🗂️ **历史静态原型保留** — [`legacy-html/`](./legacy-html/)

---

This project is now React-first. The production entry is the Vite app at `index.html` + `src/main.tsx`; the 44 prototype screens are rendered by real React components under `src/pages`.

## Current Structure

- `index.html` - Vite shell only, mounts React at `#root`
- `src/App.tsx` - React prototype console, routing, device preview, search/filter, flows
- `src/pageRegistry.tsx` - typed registry mapping all 44 screen IDs to React components
- `src/pages/` - real TSX page implementations grouped by domain
- `src/components/` - shared console, mobile, and UI components
- `legacy-html/` - old static HTML console and original HTML prototypes kept only as reference

The root directory no longer contains the old `*-page` / `*-pages` prototype folders.

## Run

```bash
npm install
npm run dev
npm run build
npm run preview
```

Local dev URL uses the Vite base path:

```text
http://127.0.0.1:5173/figma-003/
```

## Routing

- `/#/` - React lab console
- `/#/prototype/:pageId` - React lab console with a selected screen
- `/#/standalone/:pageId` - standalone React device preview

## Legacy HTML

The previous static implementation has been moved out of the root:

- `legacy-html/gody-app/`
- `legacy-html/prototypes/`

These files are not the app runtime. They are retained only for visual comparison or recovery while the React implementation remains the source of truth.
