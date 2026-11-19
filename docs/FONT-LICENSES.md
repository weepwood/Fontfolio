# Fontfolio 内置字体许可与来源

网站从 Google Fonts 的开放字体仓库及霞鹜/源泉官方仓库拉取 SIL OFL 1.1 字体。运行 \`npm run fonts:sync\` 后：

- \`public/fonts/<id>/download.ttf（源泉圆体为 download.otf）\`：原版可安装 TrueType 字体，网页提供下载。
- \`public/fonts/<id>/OFL.txt\`：与该字体对应的完整原版授权文件。
- \`public/fonts/<id>.css\` 与 \`public/fonts/<id>/*.woff2\`：针对网页按需加载的 WOFF2 切片。

完整源代码与字体文件均来自 Google Fonts 的开源资源：
https://github.com/google/fonts/tree/main/ofl

字体作者、保留字体名称 (Reserved Font Name)、改作限制与完整许可条款，请阅读每份 \`OFL.txt\`。Fontfolio 的代码许可不覆盖第三方字体。

霞鹜 975 圆体与源泉圆体已经从原作者仓库按 OFL 授权自托管（前者 TTF、后者 OTF）。Blueaka 和 MiSans 默认只显示资料及本地导入入口。


## Blueaka：非开源字体的授权部署模式

上传文件 `Blueaka.ttf` 的内嵌名字为 `BlueakaBetaGBK DemiBold`（版本 2.00），内嵌版权声明：

```
Copyright(c) Beijing Founder Electronics Co.,Ltd. 北京北大方正电子有限公司
```

它**不是 SIL OFL 字体**。第三方仓库公开上传 TTF 不等于取得公开网站嵌入、复制、传播、提供下载的授权。Fontfolio 默认不把它打包到 Pages 网站。

获得**明确覆盖网页公开嵌入和字体文件下载/再分发**的许可后，提供以下两种方式之一：

- 本地构建：设置 `BLUEAKA_FONT_FILE=/path/to/Blueaka.ttf`，并设置 `BLUEAKA_PUBLIC_DISTRIBUTION_AUTHORIZED=true`。
- GitHub Pages：在 Settings → Secrets and variables → Actions 中设置 repository/environment variable `BLUEAKA_PUBLIC_DISTRIBUTION_AUTHORIZED=true`，secret `BLUEAKA_SOURCE_URL` 为你有权分发的私有 HTTPS 字体文件链接；需要认证时设置 `BLUEAKA_SOURCE_TOKEN`。不同来源版本可通过变量 `BLUEAKA_EXPECTED_SHA256` 指定 SHA-256。

**仅设置开关不构成法律授权。** 原上传文件的 SHA-256 是 `f9ad7dd666ea5f0fdc4c0924ea561e1271922e3c3ebe30dc254932db1de85623`，构建脚本会核对这一哈希，防止误用其他字体。部署时将生成 `public/fonts/blueaka/download.ttf`、`public/fonts/blueaka.css` 与 `public/fonts/blueaka/manifest.json`。此时页面检测 manifest 后会自动显示 Blueaka 真实字体，并开放下载按钮与方正授权条款入口。未授权或未配置时，构建脚本清除曾经缓存的 Blueaka 文件，避免意外泄漏。

这两种模式均不会将字体二进制文件加入 Git 历史。**用户自行在页面上传**仅存储在其自己的浏览器 IndexedDB 中，不属于网站公开托管。
