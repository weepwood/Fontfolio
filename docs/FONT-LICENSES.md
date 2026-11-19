# Fontfolio 内置字体许可与来源

网站通过 Google Fonts 的开放字体仓库拉取 SIL OFL 1.1 字体。运行 \`npm run fonts:sync\` 后：

- \`public/fonts/<id>/download.ttf\`：原版可安装 TrueType 字体，网页提供下载。
- \`public/fonts/<id>/OFL.txt\`：与该字体对应的完整原版授权文件。
- \`public/fonts/<id>.css\` 与 \`public/fonts/<id>/*.woff2\`：针对网页按需加载的 WOFF2 切片。

完整源代码与字体文件均来自 Google Fonts 的开源资源：
https://github.com/google/fonts/tree/main/ofl

字体作者、保留字体名称 (Reserved Font Name)、改作限制与完整许可条款，请阅读每份 \`OFL.txt\`。Fontfolio 的代码许可不覆盖第三方字体。

Blueaka、MiSans、霞鹜 975 圆体、源泉圆体目前只显示资料和导入入口，不随仓库或发布网站分发；只有取得可再分发的明确许可后才能改为直接托管。
