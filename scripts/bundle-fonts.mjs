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
async function main() {
  mkdirSync(root,{recursive:true})
  await pool(FONTS,bundle,2)
  console.log('[font] '+FONTS.length+' families ready')
}
main().catch(error=>{console.error(error);process.exitCode=1})
