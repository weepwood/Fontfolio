import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

// [site id, directory under google/fonts/ofl, original TTF, Google Fonts family, supported wght range]
const FONTS = [
  ['noto-sans-sc','notosanssc','NotoSansSC[wght].ttf','Noto Sans SC','100..900'],
  ['noto-serif-sc','notoserifsc','NotoSerifSC[wght].ttf','Noto Serif SC','200..900'],
  ['zcool-kuaile','zcoolkuaile','ZCOOLKuaiLe-Regular.ttf','ZCOOL KuaiLe',null],
  ['zcool-xiaowei','zcoolxiaowei','ZCOOLXiaoWei-Regular.ttf','ZCOOL XiaoWei',null],
  ['zcool-qingke','zcoolqingkehuangyou','ZCOOLQingKeHuangYou-Regular.ttf','ZCOOL QingKe HuangYou',null],
  ['ma-shan-zheng','mashanzheng','MaShanZheng-Regular.ttf','Ma Shan Zheng',null],
  ['long-cang','longcang','LongCang-Regular.ttf','Long Cang',null],
  ['zhi-mang-xing','zhimangxing','ZhiMangXing-Regular.ttf','Zhi Mang Xing',null],
  ['inter','inter','Inter[opsz,wght].ttf','Inter','100..900'],
  ['dm-sans','dmsans','DMSans[opsz,wght].ttf','DM Sans','100..1000'],
  ['space-grotesk','spacegrotesk','SpaceGrotesk[wght].ttf','Space Grotesk','300..700'],
  ['outfit','outfit','Outfit[wght].ttf','Outfit','100..900'],
  ['playfair','playfairdisplay','PlayfairDisplay[wght].ttf','Playfair Display','400..900'],
  ['fraunces','fraunces','Fraunces[SOFT,WONK,opsz,wght].ttf','Fraunces','100..900'],
  ['rubik','rubik','Rubik[wght].ttf','Rubik','300..900'],
  ['ibm-plex','ibmplexmono','IBMPlexMono-Regular.ttf','IBM Plex Mono',null],
  ['baloo-2','baloo2','Baloo2[wght].ttf','Baloo 2','400..800'],
  ['fredoka','fredoka','Fredoka[wdth,wght].ttf','Fredoka','300..700'],
  ['montserrat','montserrat','Montserrat[wght].ttf','Montserrat','100..900'],
  ['bungee','bungee','Bungee-Regular.ttf','Bungee',null],
  ['noto-sans-tc','notosanstc','NotoSansTC[wght].ttf','Noto Sans TC','100..900'],
  ['noto-sans-jp','notosansjp','NotoSansJP[wght].ttf','Noto Sans JP','100..900'],
  ['noto-sans-kr','notosanskr','NotoSansKR[wght].ttf','Noto Sans KR','100..900'],
  ['zen-maru','zenmarugothic','ZenMaruGothic-Regular.ttf','Zen Maru Gothic',null],
  ['zen-kaku','zenkakugothicnew','ZenKakuGothicNew-Regular.ttf','Zen Kaku Gothic New',null],
  ['kaisei-decol','kaiseidecol','KaiseiDecol-Regular.ttf','Kaisei Decol',null],
  ['ibm-plex-jp','ibmplexsansjp','IBMPlexSansJP-Regular.ttf','IBM Plex Sans JP',null],
  ['jetbrains-mono','jetbrainsmono','JetBrainsMono[wght].ttf','JetBrains Mono','100..800'],
  ['unbounded','unbounded','Unbounded[wght].ttf','Unbounded','200..900'],
  ['instrument-serif','instrumentserif','InstrumentSerif-Regular.ttf','Instrument Serif',null]
]

const root = join(process.cwd(), 'public', 'fonts')
const ua = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36'
const force = process.argv.includes('--force')

async function fetchBytes(url) {
  let last
  for (let attempt = 0; attempt < 3; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 60000)
    try {
      const response = await fetch(url, {headers:{'user-agent':ua,'accept':'*/*'},signal:controller.signal})
      if (!response.ok) throw new Error('HTTP ' + response.status + ' ' + url)
      return Buffer.from(await response.arrayBuffer())
    } catch (error) {
      last = error
      if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
    } finally {
      clearTimeout(timer)
    }
  }
  throw last
}
async function store(url, dest, magic) {
  if (!force && existsSync(dest)) {
    const bytes = readFileSync(dest)
    if (!magic || bytes.subarray(0,magic.length).equals(magic)) return
  }
  const bytes = await fetchBytes(url)
  if (magic && !bytes.subarray(0,magic.length).equals(magic)) throw new Error('Not a WOFF2: ' + url)
  mkdirSync(dirname(dest),{recursive:true})
  writeFileSync(dest,bytes)
}
async function pool(inputs, fn, capacity) {
  let cursor = 0
  await Promise.all(Array.from({length:Math.min(capacity,inputs.length)}, async () => {
    while (cursor < inputs.length) await fn(inputs[cursor++])
  }))
}
async function bundle([id,slug,file,family,weight]) {
  const dir = join(root,id)
  const cssPath = join(root,id+'.css')
  const downloadPath = join(dir,'download.ttf')
  const licensePath = join(dir,'OFL.txt')
  if (!force && [downloadPath,licensePath,cssPath].every(existsSync)) {
    console.log('[font] cached '+id)
    return
  }

  mkdirSync(dir,{recursive:true})
  const upstream='https://raw.githubusercontent.com/google/fonts/main/ofl/'+slug+'/'
  const cssUrl='https://fonts.googleapis.com/css2?family='+family.replace(/ /g,'+')
    +(weight?':wght@'+weight:'')+'&display=swap'
  const [cssBytes]=await Promise.all([
    fetchBytes(cssUrl),
    store(upstream+encodeURIComponent(file),downloadPath),
    store(upstream+'OFL.txt',licensePath)
  ])
  const css=cssBytes.toString('utf8')
  if (!css.includes('@font-face')) throw new Error('Missing font-face: '+id)
  const variants=new Map()
  const localCss=css.replace(/https:\/\/fonts\.gstatic\.com\/[^)\s'"<>]+/g,url=>{
    const name=createHash('sha256').update(url).digest('hex').slice(0,16)+'.woff2'
    variants.set(url,name)
    return './'+id+'/'+name
  })
  if (!variants.size || !localCss.includes('woff2')) throw new Error('WOFF2 unavailable: '+id)
  await pool([...variants],([url,name])=>store(url,join(dir,name),Buffer.from('wOF2')),8)
  writeFileSync(cssPath,'/* '+family+' — original OFL.txt: ./'+id+'/OFL.txt */\n'+localCss)
  console.log('[font] bundled '+id+' ('+variants.size+' WOFF2 files)')
}

// The two families below are copied unmodified from the original author's repositories.
// They are intentionally NOT converted or subsetted to avoid reserved-font-name conflicts.
const OTHER_OFL = [
  {
    id:'lxgw975', family:'LXGW 975 Yuan',
    source:'https://raw.githubusercontent.com/lxgw/975Yuan/master/TTF/LXGW975YuanSC-400W.ttf',
    license:'https://raw.githubusercontent.com/lxgw/975Yuan/master/OFL.txt',
    ext:'ttf', format:'truetype'
  },
  {
    id:'gensen', family:'GenSen Rounded',
    source:'https://raw.githubusercontent.com/ButTaiwan/gensen-font/master/otf/TC/GenSenRounded2TC-R.otf',
    license:'https://raw.githubusercontent.com/ButTaiwan/gensen-font/master/SIL_Open_Font_License_1.1.txt',
    ext:'otf', format:'opentype'
  },
  {
    id:'lxgw-wenkai', family:'LXGW WenKai',
    source:'https://raw.githubusercontent.com/lxgw/LxgwWenKai/main/fonts/TTF/LXGWWenKai-Regular.ttf',
    license:'https://raw.githubusercontent.com/lxgw/LxgwWenKai/main/OFL.txt',
    ext:'ttf', format:'truetype'
  },
  {
    id:'genyo-gothic', family:'GenYo Gothic',
    source:'https://raw.githubusercontent.com/ButTaiwan/genyog-font/master/otf/TC/GenYoGothic2TC-R.otf',
    license:'https://raw.githubusercontent.com/ButTaiwan/genyog-font/master/SIL_Open_Font_License_1.1.txt',
    ext:'otf', format:'opentype'
  }
]
async function bundleOriginal(font) {
  const dir=join(root,font.id)
  const file=join(dir,'download.'+font.ext)
  const license=join(dir,'OFL.txt')
  const css=join(root,font.id+'.css')
  if (!force && [file,license,css].every(existsSync)) {
    console.log('[font] cached '+font.id)
    return
  }
  await Promise.all([store(font.source,file),store(font.license,license)])
  writeFileSync(css,
    "/* Original font file, not modified; OFL.txt: ./"+font.id+"/OFL.txt */\n"+
    "@font-face{font-family:'"+font.family+"';src:url('./"+font.id+"/download."+font.ext+
    "') format('"+font.format+"');font-style:normal;font-weight:400;font-display:swap}\n")
  console.log('[font] bundled original '+font.id)
}
async function main() {
  mkdirSync(root,{recursive:true})
  await pool(FONTS,bundle,2)
  await pool(OTHER_OFL,bundleOriginal,2)
  // One authoritative source for both packaged binaries and upstream links:
  // the UI reads this JSON to offer official upstream downloads.
  const upstreamFiles=Object.fromEntries([
    ...FONTS.map(([id,slug,file])=>[
      id, 'https://raw.githubusercontent.com/google/fonts/main/ofl/'+slug+'/'+encodeURIComponent(file)
    ]),
    ...OTHER_OFL.map(({id,source})=>[id,source])
  ])
  const bundledCount=FONTS.length+OTHER_OFL.length
  if(Object.keys(upstreamFiles).length!==bundledCount){
    throw new Error('Duplicate font id in upstream download registry')
  }
  writeFileSync(join(root,'official-sources.json'),JSON.stringify(upstreamFiles,null,2)+'\n')
  console.log('[font] '+bundledCount+' OFL families ready, official download links generated')
}
main().catch(error=>{console.error(error);process.exitCode=1})
