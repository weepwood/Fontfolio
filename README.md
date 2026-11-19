# Fontfolio — 开源字体画廊与下载实验室

基于 Vue 3、TypeScript、Vite 和 SCSS 的静态字体收藏网站，部署在 GitHub Pages。

在线地址：https://weepwood.github.io/Fontfolio/

## 字体目录

- **40 款字体资料**，其中 **34 款 SIL OFL 1.1 开源字体**由本站托管，提供真实预览、完整 TTF/OTF 字库下载和相应许可证。
- 新增 12 款：思源黑体繁体/日文/韩文、Zen Maru Gothic、Zen Kaku Gothic New、Kaisei Decol、IBM Plex Sans JP、JetBrains Mono、Unbounded、Instrument Serif、霞鹜文楷、源样黑体。
- 已有思源黑体简体（Noto Sans SC）、思源宋体、站酷系列、霞鹜 975 圆体、源泉圆体、Inter 等保留。
- **MiSans、HarmonyOS Sans 及其系列变体（6 个条目）**：采用厂商专有许可，不能在字体目录网站独立再分发字库。本站提供官方下载入口、本机字体检测和本地导入预览。

## 功能

- 搜索、分类、筛选语言和资源来源（本站内置／官方获取）、收藏、深浅色主题、实时调整样张、三字体排版对比。
- 开源字体由网站按需加载 WOFF2 切片或原始 TTF/OTF，不依赖线上 Google Fonts CSS 服务。
- 字体卡片和详情提供本站原始文件下载；详情另附版权与许可证全文。
- 用户导入的字体文件只保存在浏览器 IndexedDB，不上传任何服务器。

## 本地开发

Node.js 22+，首次同步字体需要能够访问 Google Fonts 和对应的 GitHub 官方开源仓库：

```bash
npm install
npm run fonts:sync
npm run dev
npm run build
npm run preview
```

构建时下载的字库写入 `public/fonts/`，该目录被 .gitignore 排除，不提交至 Git。GitHub Actions 会缓存这些资源并最终打包进 Pages 发布产物。如果字体源下载失败，部署构建中止。

## 内置字体和许可证

- `scripts/bundle-fonts.mjs`：开源字体白名单、官方文件源地址与自动打包流程。
- `src/data/fonts.ts`：分类、文字信息、语言、版权状态和下载来源。
- `public/fonts/<id>.css` 与 `public/fonts/<id>/*.woff2`：站内预览。
- `public/fonts/<id>/download.ttf`（部分为 OTF）：原始字库下载。
- `public/fonts/<id>/OFL.txt`：对应字体许可原文。
- `docs/FONT-LICENSES.md`：授权边界与来源说明。

增加字体前，必须先确认**允许第三方托管和提供原始字库下载**，不能仅以“免费商用”判断。代码的 LICENSE 不适用于第三方字体本身。


## 双下载入口：本地预览、本站下载与官方下载

Fontfolio 的 34 款开放许可字体在 GitHub Pages 上**自托管预览字库**；默认页面无需跳转外站即可查看实际字形。

- **本站下载**：下载本站构建时从上游获取的原版完整 TTF/OTF（`public/fonts/<id>/download.ttf` 或 `download.otf`）。
- **官方下载**：链接到 Google Fonts 官方 `google/fonts` 仓库或字体作者官方仓库中的**对应原始字库文件**；即使本站资源暂时不可用，仍可通过官方发布地址获取。
- **访问官网 / 项目**：查看作者介绍、字体家族其他字重、版本历史及授权。
- **许可证**：每个可下载字体都提供与原版文件对应的 `OFL.txt`。

官方下载文件地址由 `scripts/bundle-fonts.mjs` 在打包字体时统一生成到 `public/fonts/official-sources.json`，与构建时使用的原版字库保持一致，无需重复维护两个独立链接清单。页面获取映射失败时，官方下载按钮自动退回相应字体的官方项目页。

MiSans、MiSans TC、MiSans Latin、MiSans L3、HarmonyOS Sans、HarmonyOS Sans SC 均使用厂商专有许可，**不由 Fontfolio 托管原始字体文件**。卡片和详情提供官方获取入口、当前浏览器可用的本机字体检测，以及本地导入预览。
