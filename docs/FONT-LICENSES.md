# Fontfolio 字体许可与来源

本项目是一座提供字体原始文件下载的公开字体收藏库，因此对“允许独立提供原始字体下载”的授权要求高于仅在网页上使用字形的普通网站。

## 本站可下载的开源字体

- Google Fonts 官方 OFL 仓库：https://github.com/google/fonts/tree/main/ofl
- 霞鹜 975 圆体：https://github.com/lxgw/975Yuan
- 霞鹜文楷：https://github.com/lxgw/LxgwWenKai
- 源泉圆体：https://github.com/ButTaiwan/gensen-font
- 源样黑体：https://github.com/ButTaiwan/genyog-font

以上自托管的 34 个字体家族使用 SIL Open Font License 1.1；构建脚本保留上游原始字体文件，并在 `public/fonts/<id>/OFL.txt` 保留对应许可证。字体版权仍归各自作者。网页专用 WOFF2 由 Google Fonts 官方供应；对于来自作者仓库的完整大字库，不进行修改或重新命名。

## 仅提供资料和本地预览的字体

**HarmonyOS Sans / 鸿蒙字体**

官方字体许可：https://github.com/openharmony/global_system_resources/blob/master/LICENSE_Fonts

华为字体许可允许在某些软件内嵌入未经修改的字体，但禁止将字体作为独立产品分发。Fontfolio 的主要功能之一是独立下载字库，因此未将鸿蒙字体作为公开下载资产托管。请从官方开发者资源获取，并自行核实授权。

**MiSans / 小米字体**

官网：https://hyperos.mi.com/font/zh/

官方许可：https://hyperos.mi.com/font-download/MiSans字体知识产权许可协议.pdf

MiSans 使用定制的专有字体许可，明确限制单独再次分发字体软件及其任何副本，因此不随本项目发布。如果你已合法获得字体文件，可在本浏览器内自己导入，文件保存在本地 IndexedDB。

## 贡献新字体时的要求

检查上游原作者授权及保留字体名称（Reserved Font Name）条款；确保下载文件为原版，附带原版许可证；记录真实来源链接、所选字重和语言版本；在浏览器实际测试显示和下载；遇到许可证不明确的字体，只添加官网资料，不上传字库。


## 官方原始文件与本站副本

34 款 OFL 字体的直接官方下载文件 URL 来自构建脚本同一份受控清单，构建时生成 `public/fonts/official-sources.json`。Google Fonts 字体从其开源仓库 `google/fonts/ofl/<family>` 指向原始 TTF；霞鹜和源泉系列直接指向字体作者发布的 TTF/OTF。详情页同时提供本站字库下载、官方原始文件下载、官方网站与 OFL 许可证入口。

请注意：官方原文件下载链接指向**当前脚本选定的一个字重或可变字重文件**，不是所有字体家族的完整文件合集。如果需要其他字重、语言或版本，请从官方项目页浏览下载。


## MiSans 与 HarmonyOS Sans 官方字体系列

新收录 MiSans TC、MiSans Latin、MiSans L3、HarmonyOS Sans SC，与原有 MiSans、HarmonyOS Sans 共计 6 个厂商字体条目。

- 小米 MiSans 官方下载与许可：https://hyperos.mi.com/font/download
- 华为 HarmonyOS Sans 官方设计资源：https://developer.huawei.com/consumer/cn/design/resource/
- 华为字体许可原文：https://github.com/openharmony/utils_system_resources/blob/master/LICENSE_Fonts

两份厂商协议均非 SIL OFL。小米禁止独立再次分发字体软件及副本；华为允许一定条件下与非字体软件捆绑原版字体，但禁止单独分发、禁止与字体软件一起分发。Fontfolio 作为字体收藏和下载平台，不把这 6 个字体软件作为公开下载资产。

在浏览器中使用字体时，仅尝试通过 CSS `local()` 加载用户系统已安装的指定字体名称，不枚举用户设备中的字体。用户也可以自主选择本地 TTF/OTF/WOFF/WOFF2，文件仅在当前浏览器的 IndexedDB 保存，不传到服务器。
