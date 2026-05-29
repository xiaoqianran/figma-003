# Figma 学习 003 - 参考 GODY

<div align="center">

### 🔗 **GitHub 仓库**  
**[https://github.com/xiaoqianran/figma-003](https://github.com/xiaoqianran/figma-003)**

</div>

---

> 一个采用「工业档案美学」语言构建的专业级移动应用原型集成平台。
> 将原本分散的 44 个 GODY 移动端 Figma 复刻页面，整合进具有真实硬件感的设备模拟控制台，用于严肃的设计评审与完整用户旅程验证。

**在线预览**： [https://xiaoqianran.github.io/figma-003/](https://xiaoqianran.github.io/figma-003/)（推荐） / [原型控制台](https://xiaoqianran.github.io/figma-003/gody-app/console.html)

将原本分散在 20+ 个文件夹中的 44 个 GODY 移动端页面，整合进一个具有真实硬件感的设备模拟控制台，用于严肃的设计评审与交互体验验证。

---

## 在线访问

- **项目主页**（推荐）：[https://xiaoqianran.github.io/figma-003](https://xiaoqianran.github.io/figma-003)
- **原型控制台**（核心体验）：[https://xiaoqianran.github.io/figma-003/gody-app/console.html](https://xiaoqianran.github.io/figma-003/gody-app/console.html)

---

## 项目特色

- **工业档案美学**：基于 80 年代中国交通调度控制台与现代极简设计的混合语言，极致克制且具有力量感。
- **真实硬件模拟**：设备边框带有物理倒角、高光、电源指示灯与机械式切换反馈。
- **完整流程覆盖**：登录、主页、搜索、预订、支付、我的行程、账户等全链路页面均可直接交互。
- **专业评审工具**：左侧档案式导航 + 右侧元数据卡片，适合团队设计走查使用。

---

## 本地运行

```bash
# 推荐使用任意静态服务器
python -m http.server 5173
# 或
npx serve
```

然后访问 `http://localhost:5173` 即可。

> 注意：由于页面使用相对路径，建议使用本地服务器而非直接双击打开 HTML 文件。

---

## 项目结构

```
.
├── .github/workflows/deploy.yml   # GitHub Pages 自动部署
├── gody-app/
│   ├── console.html               # 核心原型控制台（推荐入口）
│   └── README.md                  # 旧版预览器说明
├── account-pages/                 # 账户相关页面
├── home-page/                     # 主页
├── login-page/                    # 登录注册
├── trips-pages/                   # 我的行程
├── payment-pages/                 # 支付流程
├── ...                            # 其他 30+ 个页面目录
├── index.html                     # 项目落地页（当前美学版本）
└── README.md                      # 本文件
```

---

## 技术说明

- 纯静态实现，无需构建工具
- 采用自研「黄控台」设计系统（深黑 + 签名黄 + 冷钢灰）
- 设备模拟器支持 iframe 加载任意原有原型
- 已配置 GitHub Actions 自动部署至 GitHub Pages

---

## 学习目的

本项目为 Figma 设计复刻系列学习第 003 期。

通过完整复刻一个真实移动应用的全部核心页面，练习：
- 信息架构与交互流程梳理
- 设计语言的系统性落地
- 高品质前端界面实现（避开通用 AI 审美）
- 专业原型管理与呈现方式

---

## 致谢

- 原始设计参考：GODY 移动应用
- 所有页面均为手动复刻学习用途

---

如有任何问题或建议，欢迎通过 GitHub Issues 交流。

**仓库地址**：https://github.com/xiaoqianran/figma-003
