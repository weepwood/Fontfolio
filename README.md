# Fontfolio — 字体画廊、排版实验室与开源字体下载

基于 Vue 3 + TypeScript + Vite + SCSS 的字体收藏网页，使用 GitHub Pages 静态部署。

## 已实现

- **24 款字体资料**：其中 **22 款 SIL OFL 开源字体内置到发布网站**，页面不依赖 Google Fonts 实时 CSS 服务。
- **字体直接下载**：字体卡片和详情提供完整 TTF 下载，详情页面提供对应 OFL.txt 授权文件。
- **按需真实预览**：采用 Google Fonts 官方提供的 WOFF2 Unicode 切片，支持中文和西文字体的按需字形加载。
- **字体画廊**：搜索、分类、语言筛选、浏览器收藏、实时样张、深浅主题。
- **排版实验室**：最多比较三款字体，控制字号、字重、间距、行高等参数。
- **本地字体**：TTF / OTF / WOFF / WOFF2 可导入浏览器 IndexedDB；文件不上传服务器。
- **授权策略**：Blueaka / MiSans 暂不随网站再分发，保留资料、来源链接及本地导入；LXGW 975 Yuan 与 GenSen Rounded 已使用原作者版本内置。

在线地址：https://weepwood.github.io/Fontfolio/

## 本地开发

需要 Node.js 22+，首次运行需要访问 Google Fonts 资源服务器和 google/fonts GitHub 上游仓库。

```bash
npm install
npm run fonts:sync
npm run dev
npm run build
npm run preview
```

构建脚本会从 Google Fonts、霞鹜 975 圆体与源泉圆体官方仓库获取字体文件。`npm run build` 会自动同步，字体已缓存时直接复用；获取失败时停止构建，防止发布缺少资源的网站。

## 字体资源目录

```text
scripts/bundle-fonts.mjs          # 受控的 22 款 OFL 字体来源与构建脚本
src/data/fonts.ts                 # 包含授权、语言、风格在内的字体资料
public/fonts/<id>.css             # 自托管 @font-face 样式表
public/fonts/<id>/*.woff2         # 自托管 WOFF2 字形切片
public/fonts/<id>/download.ttf    # 可下载安装的完整原始字体（源泉圆体为 download.otf）
public/fonts/<id>/OFL.txt         # 对应的版权声明和许可证全文
docs/FONT-LICENSES.md             # 授权说明
.github/workflows/deploy.yml      # GitHub Pages 自动部署
```

`public/fonts/` 是构建产物，被 `.gitignore` 排除，不会将大型字体二进制加入 Git 提交历史；GitHub Actions 在每次构建时生成它并利用缓存，加快后续部署。**最终发布的 GitHub Pages 网站会托管这些字体文件。**

## 新增字体

1. 先确认字体许可证及其是否允许网页嵌入、下载与再分发。
2. 在 `src/data/fonts.ts` 中添加字体资料。使用 `source: 'bundled'` 代表可直接下载。
3. 在 `scripts/bundle-fonts.mjs` 添加字体 ID、Google Fonts 仓库 OFL 子目录、TTF 原文件名及 CSS 字族。
4. 执行 `npm run fonts:sync && npm run build`，检查字体卡片、样张和 `OFL.txt`。

## Blueaka 和 MiSans

Blueaka 来源：https://github.com/Kiramei/baas-tauri/blob/main/scripts/fonts-src/Blueaka.ttf 。公开仓库存在字体文件不等于取得再分发授权，因而当前版本**不内置**该字体。用户可通过本地导入功能预览已合法取得的字库；MiSans 亦未提供本站再分发版本。

霞鹜 975 圆体与源泉圆体均根据作者的 SIL OFL 1.1 许可分发，使用**未修改的原版**文件；源泉圆体选择了 TC 繁体字形版本。二者由于完整字库体积较大，首次显示时需要下载更多数据。

## 许可证

代码许可证参见根目录 LICENSE。22 款内置字体的版权归各自字体作者或权利人所有，请通过字体详情页查看对应的 OFL.txt。更多说明见 [字体许可与来源](docs/FONT-LICENSES.md)。
