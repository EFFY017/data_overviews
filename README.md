# OneX Intelligence — 数据资产概览

一个医疗数据资产概览看板（Dashboard）。基于 **Vite + React 18 + TypeScript** 构建。

## 项目结构

```
.
├── index.html              # Vite 入口（仅挂载点 + 字体）
├── vite.config.ts          # Vite 配置（base = /data_overviews/）
├── tsconfig.json
└── src/
    ├── main.tsx            # 应用入口（createRoot 渲染）
    ├── App.tsx             # 主应用：组装各区块、主题 / 视图状态
    ├── vite-env.d.ts       # Vite 客户端类型声明
    ├── styles/
    │   └── global.css      # 全局样式（主题 token + 各区块样式）
    ├── assets/
    │   └── logo.svg        # 品牌 Logo
    ├── data/
    │   ├── mockData.ts     # 后端返回的真实数据集原始记录
    │   ├── datasets.ts     # 由 mockData 实时聚合出的各项指标
    │   └── types.ts        # 数据模型类型
    └── components/
        ├── sections.tsx        # Hero / 领域网格 / 图表 / 流水线 / 合作方
        ├── DatasetExplorer.tsx # 数据集检索 / 浏览
        └── TweaksPanel.tsx     # 主题与视图配置面板
```

> 所有展示指标（数据总量、领域聚合、数据量分布、全流程统计等）都由
> `src/data/datasets.ts` 从 `src/data/mockData.ts` 实时计算——
> 更新数据通常只需替换 `mockData.ts` 的内容。

## 本地开发

```bash
npm install
npm run dev        # 启动开发服务器（带热更新 HMR）
```

打开终端提示的地址（默认 http://localhost:5173/data_overviews/ ）。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器，改动即时热更新 |
| `npm run typecheck` | 运行 TypeScript 类型检查（`tsc --noEmit`） |
| `npm run build` | 生产构建，先类型检查再打包，输出到 `dist/` |
| `npm run preview` | 本地预览 `dist/` 生产构建产物 |

## 部署（GitHub Pages）

`.github/workflows/deploy.yml` 会在推送到 `main` 后自动执行 `npm ci && npm run build`，
并将 `dist/` 发布到 GitHub Pages。

首次使用需在 GitHub 仓库开启 Pages：
**Settings → Pages → Build and deployment → Source 选择 "GitHub Actions"**。

之后每次 `git push` 到 `main`，Actions 会自动构建并部署，访问地址形如：
`https://EFFY017.github.io/data_overviews/`。

> 站点部署在 `/data_overviews/` 子路径下，已在 `vite.config.ts` 的 `base` 中配置；
> 本地 `dev` / `preview` 也会带上该前缀。
