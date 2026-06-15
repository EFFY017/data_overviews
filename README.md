# OneX Intelligence — 数据资产概览

一个静态的医疗数据资产概览看板（Dashboard）。使用 CDN 引入的 React 18 + 浏览器端 Babel 渲染，无需打包构建。

## 项目结构

| 文件 | 说明 |
| --- | --- |
| `index.html` | 入口页面，引入样式与各脚本 |
| `data.js` | 数据源（分类、数据集、合作方等） |
| `sections.jsx` | Hero、领域网格、图表、流水线、合作方等可视化区块 |
| `explorer.jsx` | 数据集检索 / 浏览模块 |
| `tweaks-panel.jsx` | 主题与视图配置面板 |
| `dashboard-app.jsx` | 应用主入口，组装各区块 |
| `Logo jpg-06.svg` | 品牌 Logo |

> 注意：页面通过相对路径加载 `.jsx` / `data.js`，**必须经由 HTTP 服务访问**，直接用 `file://` 双击打开会因浏览器跨域限制而无法加载。

## 本地预览

```bash
npm install
npm run dev
```

然后打开 http://localhost:3000 。

> 也可以不安装依赖，直接用任意静态服务器，例如：`npx serve .` 或 `python3 -m http.server 3000`。

## 部署（GitHub Pages）

仓库已包含 `.github/workflows/deploy.yml`，推送到 `main` 分支后会自动构建并发布到 GitHub Pages。

首次使用需在 GitHub 仓库开启 Pages：
**Settings → Pages → Build and deployment → Source 选择 "GitHub Actions"**。

之后每次 `git push` 到 `main`，Actions 会自动部署，访问地址形如：
`https://EFFY017.github.io/data_overviews/`
