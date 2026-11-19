# Fontfolio 字形档案

一个用于收藏、展示、比对字体的静态网页项目。基于 Vue 3 + TypeScript + Vite + SCSS，支持 GitHub Pages 部署，不需要数据库或后端。

## 首版功能

- 20 款种子字体档案；分类、语言筛选、搜索与本地收藏
- 交互式预览：自定义文本、字号与字重
- 最多三款字体的排版实验室：字号、字重、字间距、行高
- 字体详情：风格、字形、语言、授权说明及官方来源
- 浏览器本地导入 `.ttf`、`.otf`、`.woff`、`.woff2` 字体；文件不上传到服务器
- 深浅色主题、移动端适配、键盘 `/` 聚焦搜索
- GitHub Actions 构建并发布到 GitHub Pages

> **授权说明**：仓库不包含 Blueaka、MiSans 等第三方字体文件。Blueaka 的独立授权尚未核实，MiSans 的许可对字体文件再分发有限制。请在使用、下载、内嵌、改作或再分发字体前阅读字体权利人的最新许可。Google Fonts 字体通过网页按需加载；当前页面上的字体授权标签是便于检索的元数据，不构成法律承诺。

## 本地开发

Node.js 22+，npm：

```bash
npm install
npm run dev
npm run build
npm run preview
```

启动后访问 Vite 输出的本地网址（通常为 http://localhost:5173）。在国内网络环境如果 Google Fonts 不可访问，会显示加载失败或备用字形；应用本身仍可使用搜索、收藏、元数据和本地字体导入。

## GitHub Pages 发布

1. 创建公开 GitHub 仓库，例如 `weepwood/Fontfolio`（仅供命名参考，仓库需自己创建）。
2. 将本项目所有文件提交至 `main` 分支。第一次在本地运行 `npm install` 后，建议把生成的 `package-lock.json` 一并提交，之后可将 CI 的 `npm install` 改为更严格的 `npm ci`。
3. 仓库 `Settings → Pages → Build and deployment → Source` 选择 `GitHub Actions`。
4. 推送至 `main` 后，`.github/workflows/deploy.yml` 将安装依赖、构建并发布到 Pages。
5. 若仓库名称为 `Fontfolio`，项目默认访问地址会是 `https://weepwood.github.io/Fontfolio/`。实际地址以 GitHub Actions 部署结果为准。

工作流会自动处理常见的仓库子路径 (`/Fontfolio/`)；如使用自定义域名，请根据自定义域名场景把 Vite `base` 设为 `/` 并按 GitHub Pages 文档配置域名。

## 添加新字体

编辑 `src/data/fonts.ts`，添加一个 `FontEntry`：

```ts
{
  id: 'new-font', name: 'New Font', nativeName: '字体中文名',
  family: 'New Font', category: '圆体', language: ['中文','英文'],
  mood: '柔和 · 友善', description: '简短介绍',
  source: 'manual', license: '授权待核实',
  licenseNote: '阅读权利人的最新条款。',
  homepage: 'https://example.org', initial: 'Aa',
}
```

`source: 'manual'` 表示仅展示元数据，用户可在浏览器手动导入已合法取得的字体文件进行预览；`source: 'google'` 表示字体名称来自 Google Fonts API 且能够通过官方 CSS API 请求加载；`source: 'uploaded'` 由本地导入生成，仅保存在本次页面内存中。

请**不要**为了让字体自动显示而直接提交来源和授权不明确的 TTF/OTF 文件。

## 下一步

- 字体语言和字符覆盖率探测（fontTools 离线生成静态清单）
- 字体元数据 schema 校验、数据源自动同步与变更历史
- 更完整的排版对比：字体轴、OpenType features、更多语言样张
- 导出收藏清单 JSON、分享只含配置参数的静态链接
- 全量性能策略：字体按需加载、字库子集与网络失败降级

## 第三方与参考

- https://github.com/Kiramei/baas-tauri — Blueaka 字体参考来源（**不随本项目再分发**）
- https://github.com/lxgw/975Yuan — 霞鹜 975 圆体
- https://github.com/ButTaiwan/gensen-font — 源泉圆体
- https://hyperos.mi.com/font/zh/ — MiSans 官方信息
- https://fonts.google.com/ — Google Fonts（字体许可各自核对）
- https://vite.dev/guide/static-deploy.html — GitHub Pages 官方部署方案