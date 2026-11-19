export type FontCategory = '圆体' | '无衬线' | '衬线' | '展示' | '手写' | '等宽'
export type Source = 'bundled' | 'manual' | 'uploaded'
export type FontRecord = { id:string; name:string; nativeName:string; category:FontCategory; languages:string; mood:string; source:Source; license:string; url:string; family:string; description:string }
const rows = [
  [
    "lxgw975",
    "LXGW 975 Yuan",
    "霞鹜 975 圆体",
    "圆体",
    "中英",
    "温柔 · 圆润",
    "bundled",
    "SIL OFL 1.1",
    "https://github.com/lxgw/975Yuan"
  ],
  [
    "gensen",
    "GenSen Rounded",
    "源泉圆体（TC 繁中版）",
    "圆体",
    "中日",
    "亲和 · 圆润",
    "bundled",
    "SIL OFL 1.1",
    "https://github.com/ButTaiwan/gensen-font"
  ],
  [
    "misans",
    "MiSans",
    "MiSans",
    "无衬线",
    "中英",
    "现代 · 精准",
    "manual",
    "小米专有许可 · 不得独立再分发",
    "https://hyperos.mi.com/font/download"
  ],
  [
    "harmonyos-sans",
    "HarmonyOS Sans",
    "鸿蒙字体",
    "无衬线",
    "中英",
    "系统 · 清晰",
    "manual",
    "华为专有许可 · 不得独立再分发",
    "https://developer.huawei.com/consumer/cn/design/resource/"
  ],
  [
    "misans-tc", "MiSans TC", "小米字体 · 繁体中文版",
    "无衬线", "中英", "繁体 · 屏显", "manual",
    "小米专有许可 · 不得独立再分发",
    "https://hyperos.mi.com/font/download"
  ],
  [
    "misans-latin", "MiSans Latin", "小米字体 · 拉丁文字版",
    "无衬线", "英文", "几何 · 多语言", "manual",
    "小米专有许可 · 不得独立再分发",
    "https://hyperos.mi.com/font/download"
  ],
  [
    "misans-l3", "MiSans L3", "小米字体 · 生僻字扩展",
    "无衬线", "中文", "生僻字 · 扩展", "manual",
    "小米专有许可 · 不得独立再分发",
    "https://hyperos.mi.com/font/download"
  ],
  [
    "harmonyos-sans-sc", "HarmonyOS Sans SC", "鸿蒙黑体 · 简体中文",
    "无衬线", "中英", "中文 · 系统设计", "manual",
    "华为专有许可 · 不得独立分发",
    "https://developer.huawei.com/consumer/cn/design/resource/"
  ],
  [
    "noto-sans-sc",
    "Noto Sans SC",
    "思源黑体 / Noto",
    "无衬线",
    "中英",
    "中性 · 专业",
    "bundled",
    "SIL OFL 1.1",
    "https://fonts.google.com/noto/specimen/Noto+Sans+SC"
  ],
  [
    "noto-serif-sc",
    "Noto Serif SC",
    "思源宋体 / Noto",
    "衬线",
    "中英",
    "文化 · 阅读",
    "bundled",
    "SIL OFL 1.1",
    "https://fonts.google.com/noto/specimen/Noto+Serif+SC"
  ],
  [
    "zcool-kuaile",
    "ZCOOL KuaiLe",
    "站酷快乐体",
    "展示",
    "中英",
    "快乐 · 活泼",
    "bundled",
    "SIL OFL 1.1",
    "https://fonts.google.com/specimen/ZCOOL+KuaiLe"
  ],
  [
    "zcool-xiaowei",
    "ZCOOL XiaoWei",
    "站酷小薇 LOGO 体",
    "衬线",
    "中英",
    "优雅 · 创意",
    "bundled",
    "SIL OFL 1.1",
    "https://fonts.google.com/specimen/ZCOOL+XiaoWei"
  ],
  [
    "zcool-qingke",
    "ZCOOL QingKe HuangYou",
    "站酷庆科黄油体",
    "展示",
    "中英",
    "复古 · 醒目",
    "bundled",
    "SIL OFL 1.1",
    "https://fonts.google.com/specimen/ZCOOL+QingKe+HuangYou"
  ],
  [
    "ma-shan-zheng",
    "Ma Shan Zheng",
    "马善政毛笔楷书",
    "手写",
    "中文",
    "书法 · 东方",
    "bundled",
    "SIL OFL 1.1",
    "https://fonts.google.com/specimen/Ma+Shan+Zheng"
  ],
  [
    "long-cang",
    "Long Cang",
    "龙藏体",
    "手写",
    "中文",
    "自由 · 洒脱",
    "bundled",
    "SIL OFL 1.1",
    "https://fonts.google.com/specimen/Long+Cang"
  ],
  [
    "zhi-mang-xing",
    "Zhi Mang Xing",
    "志莽行书",
    "手写",
    "中文",
    "东方 · 手写",
    "bundled",
    "SIL OFL 1.1",
    "https://fonts.google.com/specimen/Zhi+Mang+Xing"
  ],
  [
    "inter",
    "Inter",
    "Inter",
    "无衬线",
    "英文",
    "现代 · UI",
    "bundled",
    "SIL OFL 1.1",
    "https://fonts.google.com/specimen/Inter"
  ],
  [
    "dm-sans",
    "DM Sans",
    "DM Sans",
    "无衬线",
    "英文",
    "清爽 · 几何",
    "bundled",
    "SIL OFL 1.1",
    "https://fonts.google.com/specimen/DM+Sans"
  ],
  [
    "space-grotesk",
    "Space Grotesk",
    "Space Grotesk",
    "无衬线",
    "英文",
    "科技 · 个性",
    "bundled",
    "SIL OFL 1.1",
    "https://fonts.google.com/specimen/Space+Grotesk"
  ],
  [
    "outfit",
    "Outfit",
    "Outfit",
    "无衬线",
    "英文",
    "简洁 · 圆润",
    "bundled",
    "SIL OFL 1.1",
    "https://fonts.google.com/specimen/Outfit"
  ],
  [
    "playfair",
    "Playfair Display",
    "Playfair Display",
    "衬线",
    "英文",
    "优雅 · 杂志",
    "bundled",
    "SIL OFL 1.1",
    "https://fonts.google.com/specimen/Playfair+Display"
  ],
  [
    "fraunces",
    "Fraunces",
    "Fraunces",
    "衬线",
    "英文",
    "复古 · 精致",
    "bundled",
    "SIL OFL 1.1",
    "https://fonts.google.com/specimen/Fraunces"
  ],
  [
    "rubik",
    "Rubik",
    "Rubik",
    "圆体",
    "英文",
    "亲切 · 几何",
    "bundled",
    "SIL OFL 1.1",
    "https://fonts.google.com/specimen/Rubik"
  ],
  [
    "ibm-plex",
    "IBM Plex Mono",
    "IBM Plex Mono",
    "等宽",
    "英文",
    "技术 · 理性",
    "bundled",
    "SIL OFL 1.1",
    "https://fonts.google.com/specimen/IBM+Plex+Mono"
  ],
  [
    "baloo-2","Baloo 2","Baloo 2","圆体","英文",
    "可爱 · 活泼","bundled","SIL OFL 1.1",
    "https://fonts.google.com/specimen/Baloo+2"
  ],
  [
    "fredoka","Fredoka","Fredoka","圆体","英文",
    "圆润 · 游戏","bundled","SIL OFL 1.1",
    "https://fonts.google.com/specimen/Fredoka"
  ],
  [
    "montserrat","Montserrat","Montserrat","无衬线","英文",
    "清晰 · 现代","bundled","SIL OFL 1.1",
    "https://fonts.google.com/specimen/Montserrat"
  ],
  [
    "bungee","Bungee","Bungee","展示","英文",
    "醒目 · 标题","bundled","SIL OFL 1.1",
    "https://fonts.google.com/specimen/Bungee"
  ],
  [
    "noto-sans-tc","Noto Sans TC","思源黑体（繁体）","无衬线","中英",
    "现代 · 繁体","bundled","SIL OFL 1.1",
    "https://fonts.google.com/noto/specimen/Noto+Sans+TC"
  ],
  [
    "noto-sans-jp","Noto Sans JP","思源黑体（日文）","无衬线","日英",
    "屏显 · 日文","bundled","SIL OFL 1.1",
    "https://fonts.google.com/noto/specimen/Noto+Sans+JP"
  ],
  [
    "noto-sans-kr","Noto Sans KR","思源黑体（韩文）","无衬线","韩英",
    "屏显 · 韩文","bundled","SIL OFL 1.1",
    "https://fonts.google.com/noto/specimen/Noto+Sans+KR"
  ],
  [
    "zen-maru","Zen Maru Gothic","Zen Maru 圆体","圆体","日英",
    "可爱 · 治愈","bundled","SIL OFL 1.1",
    "https://fonts.google.com/specimen/Zen+Maru+Gothic"
  ],
  [
    "zen-kaku","Zen Kaku Gothic New","Zen Kaku 新黑体","无衬线","日英",
    "均衡 · 现代","bundled","SIL OFL 1.1",
    "https://fonts.google.com/specimen/Zen+Kaku+Gothic+New"
  ],
  [
    "kaisei-decol","Kaisei Decol","Kaisei 装饰明朝体","衬线","日英",
    "文艺 · 典雅","bundled","SIL OFL 1.1",
    "https://fonts.google.com/specimen/Kaisei+Decol"
  ],
  [
    "ibm-plex-jp","IBM Plex Sans JP","IBM Plex 日文字体","无衬线","日英",
    "科技 · 理性","bundled","SIL OFL 1.1",
    "https://fonts.google.com/specimen/IBM+Plex+Sans+JP"
  ],
  [
    "jetbrains-mono","JetBrains Mono","JetBrains Mono","等宽","英文",
    "编程 · 易读","bundled","SIL OFL 1.1",
    "https://fonts.google.com/specimen/JetBrains+Mono"
  ],
  [
    "unbounded","Unbounded","Unbounded","展示","英文",
    "未来 · 大胆","bundled","SIL OFL 1.1",
    "https://fonts.google.com/specimen/Unbounded"
  ],
  [
    "instrument-serif","Instrument Serif","Instrument Serif","衬线","英文",
    "编辑 · 优雅","bundled","SIL OFL 1.1",
    "https://fonts.google.com/specimen/Instrument+Serif"
  ],
  [
    "lxgw-wenkai","LXGW WenKai","霞鹜文楷","衬线","中英",
    "人文 · 阅读","bundled","SIL OFL 1.1",
    "https://github.com/lxgw/LxgwWenKai"
  ],
  [
    "genyo-gothic","GenYo Gothic","源样黑体（TC 繁中版）","无衬线","中日",
    "稳重 · 书卷","bundled","SIL OFL 1.1",
    "https://github.com/ButTaiwan/genyog-font"
  ]
] as string[][]
export const fonts: FontRecord[] = rows.map(row => { const [id,name,nativeName,category,languages,mood,source,license,url] = row; return { id,name,nativeName,category:category as FontCategory,languages,mood,source:source as Source,license,url,family:name,description:source === 'manual' ? '厂商官方字体系列，可从官网下载；支持识别本机字体或导入本地字库预览，本站不重新分发其字体文件。' : '本站自托管开源字体，可下载原版字库及其 OFL 许可证。' } })
export const categories = ['全部','圆体','无衬线','衬线','展示','手写','等宽','收藏'] as const
