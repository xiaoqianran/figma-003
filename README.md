# Figma 学习 003 - 参考 GODY

**React + Vite + TypeScript 重构版**

本项目已完成从纯静态 HTML 原型集合向现代前端技术栈的全面迁移。

## 技术栈

- Vite + React 19 + TypeScript
- Tailwind CSS
- 保留「黄控台」工业档案美学设计系统

## 核心特性（正在重建中）

- 专业设备模拟器（缩放、旋转、弹出）
- 44 个原型的动态注册表 + 搜索筛选
- 用户旅程自动播放器
- 由 React 完全主导的架构

## 开发

```bash
npm install
npm run dev
```

## 在线预览

https://xiaoqianran.github.io/figma-003/

## 原项目

旧版纯 HTML 版本的代码已迁移至 `public/prototypes/` 目录，当前作为 React 应用内的预览资源使用。
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
