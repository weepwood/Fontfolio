export type FontCategory = '圆体' | '无衬线' | '衬线' | '展示' | '手写' | '等宽'
export type Source = 'google' | 'manual' | 'uploaded'
export type FontRecord = { id:string; name:string; nativeName:string; category:FontCategory; languages:string; mood:string; source:Source; license:string; url:string; family:string; description:string }
const rows = [
  [
    "blueaka",
    "Blueaka",
    "蔚蓝档案风格字体",
    "圆体",
    "中英",
    "游戏 · 柔和",
    "manual",
    "待核实",
    "https://github.com/Kiramei/baas-tauri/blob/main/scripts/fonts-src/Blueaka.ttf"
  ],
  [
    "lxgw975",
    "LXGW 975 Yuan",
    "霞鹜 975 圆体",
    "圆体",
    "中英",
    "温柔 · 圆润",
    "manual",
    "SIL OFL 1.1",
    "https://github.com/lxgw/975Yuan"
  ],
  [
    "gensen",
    "GenSen Rounded",
    "源泉圆体",
    "圆体",
    "中日",
    "亲和 · 圆润",
    "manual",
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
    "专有许可",
    "https://hyperos.mi.com/font/zh/"
  ],
  [
    "noto-sans-sc",
    "Noto Sans SC",
    "思源黑体 / Noto",
    "无衬线",
    "中英",
    "中性 · 专业",
    "google",
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
    "google",
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
    "google",
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
    "google",
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
    "google",
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
    "google",
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
    "google",
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
    "google",
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
    "google",
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
    "google",
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
    "google",
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
    "google",
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
    "google",
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
    "google",
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
    "google",
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
    "google",
    "SIL OFL 1.1",
    "https://fonts.google.com/specimen/IBM+Plex+Mono"
  ]
] as string[][]
export const fonts: FontRecord[] = rows.map(row => { const [id,name,nativeName,category,languages,mood,source,license,url] = row; return { id,name,nativeName,category:category as FontCategory,languages,mood,source:source as Source,license,url,family:name,description:source === 'manual' ? '该字体不随项目分发。如已合法获得字体文件，可在本地导入预览。' : '支持在线按需加载的字体，可通过官方来源进一步了解使用许可。' } })
export const categories = ['全部','圆体','无衬线','衬线','展示','手写','等宽','收藏'] as const
