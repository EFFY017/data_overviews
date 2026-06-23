---
name: prd-to-design-code
description: 在本设计稿项目里从零生成符合 CLAUDE.md 目标规范的新页面 / 组件 / 区块。当用户要求"新建设计稿页面/组件"、"从零生成设计稿代码"、"加一个新页面/新区块/新弹窗"、"把已定的交互(或 PRD 里的某个流程)做成设计稿代码"、"实现一个 XX 页面/组件"时使用。**范围限定：仅用于把设计落地为前端代码实现，不用于 UI/UX 设计本身(视觉风格、配色、布局、交互方案等)——做设计时不要调用本 skill。** 本 skill 负责**从零新建**；对齐已有组件到目标规范属于维护改动，按 CLAUDE.md 规则直接做即可。
---

# Create Design

在设计稿项目里**从零生成新页面 / 组件 / 区块**，直接按目标规范产出、不留迁移债。设计稿的定位、以及“生产级 / 不接真实 API”的立场，见 CLAUDE.md「项目信息」「项目约束（目标规范）」，此处不复述。本 skill 与 CLAUDE.md 均为**项目无关的通用产物**，可整体复用到不同设计稿项目。

**唯一事实源：项目根 `CLAUDE.md`。** 样式、图标、命名、mock、类型、文案、UI 状态、复用、汇报格式等所有规范细节以 CLAUDE.md 为准；本文件只描述**从零生成的执行流程**，不复制规则。开始前先读 CLAUDE.md 的「项目约束（目标规范）」段。

> 维护约定：本文件用 `「…」` 锚定 CLAUDE.md 的段落标题。改动 CLAUDE.md 小标题后，跑 `grep -oE '「[^」]+」' SKILL.md` 逐一对照 CLAUDE.md 现有标题，确保锚点不断链。

项目现状（已就绪，无需迁移基建）：`.tsx` + 类型 / antd-style 样式 / lucide 图标 / zustand 状态（`src/store/`）/ react-router 7 / ahooks + lodash-es；页面 mock 就近 `xxxMock.ts`。新代码直接按目标规范产出，放置与命名与现有结构对齐。

## 核心原则

- **从零即合规**：新建的东西一律按目标规范产出（`.tsx` + 明确类型 / antd 组件优先 / lucide 图标 / antd-style 样式 / mock 与文案集中），不要先写粗糙版再返工。
- **先复用再新建**：动手前搜现有页面、组件、mock、样式 hook，能复用就复用，避免重复造轮子。不要过早抽象。
- **薄入口**：页面入口只负责布局、状态串联、模块组合；JSX、mock、样式、交互细节下沉到子组件 / 各自文件。

## 执行步骤

### Step 0 — 读 CLAUDE.md

读「项目约束（目标规范）」段，明确目标写法。项目根即设计稿项目本身（**无子目录嵌套，不要 `cd`**）。

### Step 1 — 明确意图与范围

从用户描述 / `PRD.md` / 设计意图中提取：

- 页面 / 组件 / 区块清单
- 关键 UI 状态（idle / loading / empty / error / success / disabled）
- 交互行为（Tabs、Modal、Select、Search、Steps、Table 分页、Button loading/disabled 等）
- 数据字段（用于定义类型与 mock）

范围较大时先与用户确认本次要做哪些，再开工。

### Step 2 — 查现有结构，优先复用

```bash
find src -maxdepth 3 -type f \( -name "*.tsx" -o -name "*.ts" \) \
  | grep -v node_modules | sort
```

搜 `src/pages/`、`src/components/`、`src/store/`、页面内部域文件夹与页面内 `xxxMock.ts`：

- 有可复用的业务组件 / 基础组件 / 样式 hook / zustand store / mock 字段 → 直接复用，不重复造。
- 异步/防抖等优先用 ahooks，工具函数优先用 lodash-es，不自造同类原语。
- 确认放置位置：页面专属放页面目录；跨页面复用上移到 `src/components/`、`src/store/`、`src/mocks/`、`src/constants/`、`src/utils/`（后三者按需创建）。
- 不为套结构机械搬动存量文件；与现有结构对齐。

### Step 3 — 规划文件结构

按 CLAUDE.md「页面结构」（含目录树示例）规划，此处不复述要点：薄入口 `XxxPage.tsx` 在域根，同名域文件夹**平铺**收纳业务组件 / `types.ts` / `utils.ts` / `xxxMock.ts` / 域内共享样式单文件；**组件自身样式内联进 `.tsx`**，不用 `components/`、`mocks/`、`styles/` 等 wrapper（仅域足够复杂时才在内部按功能再分子目录）。业务职责命名，文件名 = 主导出名。

### Step 4 — 实现（规则全部遵循 CLAUDE.md）

逐文件产出。下列是**必须覆盖的检查维度**，每条的具体写法以 CLAUDE.md 对应段落为准，本列表不复述规则：

- 类型 → 「类型定义」
- UI 组件（优先 antd） → 「样式工作流」
- 图标（lucide） → 「图标」
- 样式（antd-style） → 「样式工作流」
- mock 集中 → 「Mock 数据」
- 命名 → 「文件命名」
- UI 状态 / 常见交互 → 「UI 状态与交互」
- 移动端响应式 → 「样式工作流」
- 功能层简化（i18n → 中文字面量 / API → mock / 上传导出 → 不引入）留痕给生产；状态用 zustand、路由用 react-router 保留生产写法（仅去权限守卫） → 「生产级、设计稿即蓝本」

skill 流程额外约定（CLAUDE.md 未覆盖）：文案中文可直接写在 JSX、不引入 i18n，但按「生产级、设计稿即蓝本」保持**平铺字面量、便于机械抽取**；属于数据的内容归就近 `xxxMock.ts`（跨页面复用才上移到 `src/mocks/`，按需创建）；不接入真实 API。

### Step 5 — 验证

```bash
npm run typecheck   # 跑类型检查，更能抓类型问题
```

验证脚本以 CLAUDE.md「命令」为准。不要虚报验证结果。

### Step 6 — 汇报

按 CLAUDE.md「汇报格式」输出，验证项为 `npm run typecheck`。

## 生成决策速查

> 「从零新建时的常见决策 → 目标写法」，规范定义见 CLAUDE.md。

| 要做什么                | 目标写法                                                                                                                         |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 新建一个页面            | 薄入口 `XxxPage.tsx`(域根) + 同名域文件夹平铺业务组件(样式内联) + 域内共享 `xxxStyles.ts` + `xxxMock.ts` + `types.ts`/`utils.ts` |
| 要个图标                | `import { SearchIcon } from 'lucide-react'`（`Icon` 后缀别名）                                                                   |
| 展示一个列表 / 表格     | antd `Table` + 就近 `xxxMock.ts` 数据 + loading / empty 状态                                                                     |
| 要个弹窗 / 表单         | antd `Modal` / `Form`，不自造 `<div className="modal">`                                                                          |
| 写颜色样式              | `antd-style` 里用 `token.colorXxx`，不写 `#8f96a1`                                                                               |
| 写尺寸 / 圆角 / 间距    | 保留明确数值（如 `border-radius: 10px`），不强行 token 化                                                                        |
| 需要 mock 数据          | 定义 `types.ts` 类型 + 就近 `xxxMock.ts` 数据，组件从该文件 import                                                               |
| 一段结构在 2 处以上复用 | 提取共享组件 / 具名函数 / 共享 style hook（不过早抽象）                                                                          |
