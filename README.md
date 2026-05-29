# Figma 学习 003 - GODY React 原型控制台

[中文](./README.md) | [English](./README.en.md)

> **🚀 在线演示**： [https://xiaoqianran.github.io/figma-003/](https://xiaoqianran.github.io/figma-003/)

## 快速访问

- 🚀 **在线演示** — [https://xiaoqianran.github.io/figma-003/](https://xiaoqianran.github.io/figma-003/)
- 📖 **完整迁移报告** — [MIGRATION.md](./MIGRATION.md)
- 📁 **React 源码** — [`src/`](./src/)（44 个真实页面组件）
- 🗂️ **历史静态原型保留** — [`legacy-html/`](./legacy-html/)

---

## 项目简介

本项目已全面采用 React 技术栈。生产入口为 Vite 构建的 React 应用（`index.html` + `src/main.tsx`），44 个原型页面均由 `src/pages/` 下的真实 React 组件渲染实现。

## 当前结构

- `index.html` - Vite 入口，仅挂载 React 到 `#root`
- `src/App.tsx` - 原型控制台核心，实现路由、设备预览、搜索过滤、流程演示
- `src/pageRegistry.tsx` - 类型化注册表，将全部 44 个页面 ID 映射到真实组件
- `src/pages/` - 按领域分组的真实 TSX 页面实现
- `src/components/` - 共享的控制台、移动端 UI 及通用组件
- `legacy-html/` - 旧版静态 HTML 控制台与原始原型（仅供参考）

根目录已不再包含旧的 `*-page` / `*-pages` 静态原型文件夹。

## 运行项目

```bash
npm install
npm run dev
npm run build
npm run preview
```

本地开发地址（Vite base 路径）：

```
http://127.0.0.1:5173/figma-003/
```

## 路由说明

- `/#/` - React 原型控制台主页
- `/#/prototype/:pageId` - 选中指定页面的控制台预览
- `/#/standalone/:pageId` - 独立设备预览模式（纯手机模拟器）

## 历史 HTML 版本

早期静态实现已全部迁移至：

- `legacy-html/gody-app/`
- `legacy-html/prototypes/`

这些文件**不再是运行时**，仅用于视觉对照和历史回溯。当前 React 实现为唯一事实来源。
