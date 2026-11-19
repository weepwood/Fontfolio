import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

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
  ['bungee','bungee','Bungee-Regular.ttf','Bungee',null]
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
// Blueaka is not under the SIL OFL. Its embedded name table records copyright
// held by Beijing Founder Electronics Co., Ltd. Do NOT fetch or publish it by
// default, even though a copy is publicly accessible in another GitHub repo.
// The licensed publishing path must be enabled explicitly by the site operator.
async function bundleAuthorizedBlueaka() {
  const dir=join(root,'blueaka')
  const css=join(root,'blueaka.css')
  const manifest=join(dir,'manifest.json')
  const authorized=process.env.BLUEAKA_PUBLIC_DISTRIBUTION_AUTHORIZED==='true'

  if (!authorized) {
    // Critical: remove previously cached private/proprietary assets.
    rmSync(dir,{recursive:true,force:true})
    rmSync(css,{force:true})
    console.log('[font] Blueaka not distributed (no publishing authorization configured)')
    return
  }

  const localFile=process.env.BLUEAKA_FONT_FILE
  const privateUrl=process.env.BLUEAKA_SOURCE_URL
  if (!localFile && !privateUrl) {
    throw new Error('Blueaka was authorized for publishing, but neither BLUEAKA_FONT_FILE nor BLUEAKA_SOURCE_URL was supplied')
  }
  if (localFile && privateUrl) {
    throw new Error('Provide only one Blueaka source: local file OR private URL')
  }

  let bytes
  if (localFile) {
    bytes=readFileSync(resolve(localFile))
  } else {
    const url=new URL(privateUrl)
    if (url.protocol!=='https:') throw new Error('BLUEAKA_SOURCE_URL must be HTTPS')
    const headers={}
    if (process.env.BLUEAKA_SOURCE_TOKEN) headers.authorization='Bearer '+process.env.BLUEAKA_SOURCE_TOKEN
    // Never print the private URL or token; do not expose it in build logs.
    const response=await fetch(url,{headers,redirect:'follow'})
    if (!response.ok) throw new Error('Authorized Blueaka download failed: HTTP '+response.status)
    bytes=Buffer.from(await response.arrayBuffer())
  }

  const ttfMagic=Buffer.from([0,1,0,0])
  if (bytes.length<10000 || bytes.length>32*1024*1024 || !bytes.subarray(0,4).equals(ttfMagic)) {
    throw new Error('Invalid Blueaka TTF file; publishing aborted')
  }
  const digest=createHash('sha256').update(bytes).digest('hex')
  const expected=process.env.BLUEAKA_EXPECTED_SHA256 || 'f9ad7dd666ea5f0fdc4c0924ea561e1271922e3c3ebe30dc254932db1de85623'
  if (!/^[0-9a-f]{64}$/i.test(expected) || digest.toLowerCase()!==expected.toLowerCase()) {
    throw new Error('Blueaka SHA-256 mismatch; publishing aborted')
  }

  mkdirSync(dir,{recursive:true})
  writeFileSync(join(dir,'download.ttf'),bytes)
  writeFileSync(css,
    "/* BlueakaBetaGBK DemiBold; proprietary font; distribution permission required. */\n"+
    "@font-face{font-family:'Blueaka';src:url('./blueaka/download.ttf') format('truetype');font-style:normal;font-weight:600;font-display:swap}\n")
  writeFileSync(manifest,JSON.stringify({embedded:true,downloadable:true,family:'Blueaka',proprietary:true,sha256:digest},null,2)+'\n')
  console.log('[font] Blueaka published from an explicitly authorized source ('+bytes.length+' bytes)')
}
async function main() {
  mkdirSync(root,{recursive:true})
  await pool(FONTS,bundle,2)
  await pool(OTHER_OFL,bundleOriginal,2)
  await bundleAuthorizedBlueaka()
  console.log('[font] '+(FONTS.length+OTHER_OFL.length)+' OFL families ready')
}
main().catch(error=>{console.error(error);process.exitCode=1})
