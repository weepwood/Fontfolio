<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, reactive } from 'vue'
import { ArrowRight, ArrowUpRight, Check, Columns2, Copy, Download, ExternalLink, Github, Heart, LayoutGrid, Menu, Moon, Plus, Search, SlidersHorizontal, Sun, Type, UploadCloud, X } from 'lucide-vue-next'
import { categories, fonts as initialFonts, type FontRecord, type FontCategory } from './data/fonts'

type Filter = FontCategory | '全部' | '收藏'
type Page = 'gallery' | 'compare'
type Status = 'loading' | 'ready' | 'error'
const fontList = ref<FontRecord[]>([...initialFonts])
const activeFilter = ref<Filter>('全部')
const currentPage = ref<Page>('gallery')
const search = ref('')
const language = ref('全部语言')
const fontSize = ref(48)
const fontWeight = ref(400)
const spacing = ref(0)
const leading = ref(1.35)
const originalSample = '字里行间，自有风景。'
const sample = ref(originalSample)
const englishSample = 'Design is in the details.'
const dark = ref(false)
const detail = ref<FontRecord | null>(null)
const mobileMenu = ref(false)
const notice = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const uploadInput = ref<HTMLInputElement | null>(null)
const uploadTarget = ref<string | null>(null)
const localFamily = reactive<Record<string,string>>({})
const fontStatus = reactive<Record<string,Status>>({})
const selection = ref<string[]>(['noto-sans-sc','zcool-xiaowei'])
function stored<T>(key:string,fallback:T):T {
  try { const item = localStorage.getItem(key); return item ? JSON.parse(item) as T : fallback } catch { return fallback }
}
const favorites = ref<string[]>(stored('fontfolio:favorites',[]))
watch(favorites,value=>localStorage.setItem('fontfolio:favorites',JSON.stringify(value)),{deep:true})
watch(dark,value=>localStorage.setItem('fontfolio:theme',JSON.stringify(value)))
const filtered = computed(()=>fontList.value.filter(font=>{
  const query = search.value.trim().toLowerCase()
  const matchesQuery = !query || [font.id,font.name,font.nativeName,font.mood,font.category,font.languages].join(' ').toLowerCase().includes(query)
  const matchesCategory = activeFilter.value==='全部' || (activeFilter.value==='收藏' ? favorites.value.includes(font.id) : font.category===activeFilter.value)
  const matchesLanguage = language.value==='全部语言' || (language.value==='中文' ? font.languages.includes('中') : language.value==='日文' ? font.languages.includes('日') : font.languages.includes('英'))
  return matchesQuery && matchesCategory && matchesLanguage
}))
const comparison = computed(()=>selection.value.map(id=>fontList.value.find(f=>f.id===id)).filter((f):f is FontRecord=>Boolean(f)))
const favoriteCount = computed(()=>favorites.value.length)
function previewText(font:FontRecord) { return sample.value===originalSample && font.languages==='英文' ? englishSample : sample.value || 'Typography is beautiful.' }
function available(font:FontRecord) { return Boolean(localFamily[font.id]) || (font.source==='google' && fontStatus[font.id]==='ready') }
function styleFor(font:FontRecord) {
  return {fontFamily:available(font) ? '"' + (localFamily[font.id] || font.family) + '", sans-serif' : 'inherit',fontSize:fontSize.value+'px',fontWeight:fontWeight.value,letterSpacing:spacing.value+'px',lineHeight:leading.value}
}
function ensureFont(font:FontRecord) {
  if (font.source!=='google' || fontStatus[font.id]) return
  fontStatus[font.id]='loading'
  const link=document.createElement('link')
  link.rel='stylesheet'
  link.href='https://fonts.googleapis.com/css2?family='+encodeURIComponent(font.family).replace(/%20/g,'+')+'&display=swap'
  link.onload=async()=>{
    try { const test=font.languages==='英文'?'Typography':'字体预览'; const loaded=await document.fonts.load('400 32px "'+font.family+'"',test); fontStatus[font.id]=loaded.length?'ready':'error' }
    catch {fontStatus[font.id]='error'}
  }
  link.onerror=()=>{ fontStatus[font.id]='error' }
  document.head.appendChild(link)
}
let observer:IntersectionObserver | null=null
const targets=new Map<Element,FontRecord>()
const vVisible={
  mounted(el:Element,binding:{value:FontRecord}){targets.set(el,binding.value); if(observer)observer.observe(el)},
  updated(el:Element,binding:{value:FontRecord}){targets.set(el,binding.value)},
  unmounted(el:Element){observer?.unobserve(el);targets.delete(el)}
}
function toggleFavorite(id:string){favorites.value=favorites.value.includes(id)?favorites.value.filter(x=>x!==id):[...favorites.value,id]}
function toggleCompare(id:string){
  if(selection.value.includes(id)){selection.value=selection.value.filter(x=>x!==id);return}
  selection.value=selection.value.length<3?[...selection.value,id]:[...selection.value.slice(1),id]
}
function showFont(font:FontRecord){detail.value=font;ensureFont(font)}
function upload(id?:string){uploadTarget.value=id||null;uploadInput.value?.click()}
async function handleUpload(event:Event){
  const input=event.target as HTMLInputElement
  const file=input.files?.[0]
  input.value=''
  if(!file)return
  if(!/\.(ttf|otf|woff2?)$/i.test(file.name)||file.size>32*1024*1024){notice.value='请选择 32 MB 以内的 TTF、OTF、WOFF 或 WOFF2 字体文件。';return}
  const objectUrl=URL.createObjectURL(file)
  const name='FontfolioLocal_'+crypto.randomUUID().replace(/-/g,'')
  try{
    const face=new FontFace(name,'url("'+objectUrl+'")')
    await face.load()
    document.fonts.add(face)
    if(uploadTarget.value){
      localFamily[uploadTarget.value]=name
      notice.value='本地字体已加载，可以预览。'
    }else{
      const label=file.name.replace(/\.(ttf|otf|woff2?)$/i,'')
      const id='local-'+crypto.randomUUID()
      fontList.value.unshift({id,name:label,nativeName:'本地字体',category:'展示',languages:'中英',mood:'当前会话 · 本地预览',source:'uploaded',license:'请自行确认授权',url:'#',family:name,description:'仅在当前浏览器内存中使用，不会发送到服务器。'})
      localFamily[id]=name
      activeFilter.value='全部'
      currentPage.value='gallery'
      search.value=''
      notice.value='已导入 '+label+'，刷新后需重新导入。'
      await nextTick()
      window.scrollTo({top:0,behavior:'smooth'})
    }
  }catch{notice.value='无法读取字体文件，请确认其格式或完整性。'}
  finally{URL.revokeObjectURL(objectUrl);uploadTarget.value=null}
}
async function copyCss(font:FontRecord){
  try {await navigator.clipboard.writeText('font-family: "'+font.family+'", sans-serif;');notice.value='字体 CSS 已复制。'}
  catch {notice.value='复制失败，请检查浏览器剪贴板权限。'}
}
function changePage(view:Page){currentPage.value=view;mobileMenu.value=false}
function changeFilter(filter:Filter){activeFilter.value=filter;currentPage.value='gallery';mobileMenu.value=false}
function keydown(event:KeyboardEvent){
  if(event.key==='Escape'){detail.value=null;mobileMenu.value=false}
  if(event.key==='/' && !detail.value && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)){event.preventDefault();searchInput.value?.focus();currentPage.value='gallery'}
}
onMounted(()=>{
  dark.value=stored('fontfolio:theme',false)
  if('IntersectionObserver' in window){
    observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){const font=targets.get(entry.target);if(font)ensureFont(font);observer?.unobserve(entry.target)}},{rootMargin:'240px'})
    for(const el of targets.keys())observer.observe(el)
  }else{for(const font of filtered.value)ensureFont(font)}
  window.addEventListener('keydown',keydown)
})
onBeforeUnmount(()=>{observer?.disconnect();window.removeEventListener('keydown',keydown)})
watch(detail,(value)=>{document.body.style.overflow=value?'hidden':''})
</script>

<template>
  <div class="app-shell" :class="{dark}">
    <div class="mobile-overlay" v-if="mobileMenu" @click="mobileMenu=false"></div>
    <aside class="sidebar" :class="{'sidebar-open':mobileMenu}">
      <div class="brand" @click="changePage('gallery')">
        <span class="brand-mark"><Type :size="21" :stroke-width="2.1"/></span>
        <span class="brand-text">fontfolio<span class="brand-dot">.</span></span>
        <span class="brand-index">/ 001</span>
      </div>
      <div class="side-label">WORKSPACE</div>
      <nav class="main-nav" aria-label="主要导航">
        <button type="button" :class="{selected:currentPage==='gallery'}" @click="changePage('gallery')"><LayoutGrid :size="17"/> 字体画廊 <span>01</span></button>
        <button type="button" :class="{selected:currentPage==='compare'}" @click="changePage('compare')"><Columns2 :size="17"/> 排版实验室 <span>02</span></button>
      </nav>
      <div class="side-label category-heading">COLLECTIONS <span>{{ fontList.length.toString().padStart(2,'0') }}</span></div>
      <nav class="category-nav" aria-label="字体分类">
        <button v-for="(cat,index) in categories" :key="cat" type="button" :class="{selected:currentPage==='gallery' && activeFilter===cat}" @click="changeFilter(cat)">
          <span class="category-symbol">{{ index===0 ? '✳' : index===7 ? '♡' : '↳' }}</span><span>{{ cat==='全部'?'全部字体':cat==='收藏'?'我的收藏':cat }}</span><span v-if="cat==='收藏'" class="side-count">{{ favoriteCount }}</span>
        </button>
      </nav>
      <div class="side-bottom">
        <div class="sidebar-tip"><span class="eyebrow">CURATED TYPE LIBRARY</span><p>收集值得珍藏的字体，寻找文字的另一种可能。</p><span class="side-tip-line"></span></div>
        <div class="sidebar-footer"><a href="https://github.com/weepwood/Fontfolio" target="_blank" rel="noopener noreferrer" aria-label="查看 GitHub 源码"><Github :size="18"/></a><span>Open source, made for type.</span><button type="button" class="icon-button" @click="dark=!dark" :aria-label="dark?'切换浅色':'切换深色'"><Sun v-if="dark" :size="17"/><Moon v-else :size="17"/></button></div>
      </div>
    </aside>
    <main class="main-content">
      <header class="topbar">
        <button type="button" class="icon-button mobile-menu-button" aria-label="打开菜单" @click="mobileMenu=true"><Menu :size="21"/></button>
        <div class="breadcrumb"><span>LIBRARY</span><span class="slash">/</span><strong>{{ currentPage==='gallery'?'字体画廊':'排版实验室' }}</strong></div>
        <div class="top-actions"><span class="edition">FONT COLLECTION · 2026</span><button class="icon-button top-theme-button" type="button" :aria-label="dark?'切换浅色':'切换深色'" @click="dark=!dark"><Sun v-if="dark" :size="17"/><Moon v-else :size="17"/></button><a class="github-top" href="https://github.com/weepwood/Fontfolio" target="_blank" rel="noopener noreferrer"><Github :size="16"/> <span>GitHub</span> <ArrowUpRight :size="14"/></a></div>
      </header>
      <div class="page-container">
        <template v-if="currentPage==='gallery'">
          <section class="hero">
            <div class="hero-kicker"><span class="kicker-dot"></span> AN INDEPENDENT TYPOGRAPHY ARCHIVE <span class="hero-no">NO. 001</span></div>
            <div class="hero-heading"><h1>每一种字形，<br/><em>都有自己的声音。</em></h1><div class="hero-right"><span class="hero-star">✳</span><p>Discover & collect typefaces.<br/>探索字体的形态、秩序与情绪。</p></div></div>
            <div class="hero-line"><span>字体是语言，也是设计的温度。</span><span>EST. 2026 <ArrowRight :size="16"/></span></div>
          </section>
          <section class="browser-section">
            <div class="section-heading"><div><span class="eyebrow">01 / THE COLLECTION</span><h2>字体画廊 <span class="counter">{{ filtered.length.toString().padStart(2,'0') }}</span></h2></div><button class="ghost-link" type="button" @click="upload()"><UploadCloud :size="16"/> 导入本地字体 <Plus :size="15"/></button></div>
            <div class="browser-toolbar">
              <label class="search-box"><Search :size="19"/><input ref="searchInput" v-model="search" aria-label="搜索字体" placeholder="搜索字体、风格或关键词..." /><kbd>/</kbd></label>
              <div class="select-wrap"><select v-model="language" aria-label="选择语言"><option>全部语言</option><option>中文</option><option>英文</option><option>日文</option></select></div>
              <div class="result-count">{{ filtered.length }} FONTS</div>
            </div>
            <div class="filter-chips"><button v-for="cat in categories" :key="cat" type="button" :class="{active:activeFilter===cat}" @click="changeFilter(cat)">{{cat==='全部'?'全部字体':cat==='收藏'?'♡ 收藏':cat}}</button></div>
            <div v-if="filtered.length" class="font-grid">
              <article v-for="font in filtered" :key="font.id" v-visible="font" class="font-card" tabindex="0" @click="showFont(font)" @keydown.enter="showFont(font)">
                <div class="font-card-top"><div><span class="card-number">{{ String(fontList.indexOf(font)+1).padStart(2,'0') }}</span><span class="card-tag">{{font.category}}</span></div><button type="button" class="favorite-button" :aria-label="favorites.includes(font.id)?'取消收藏':'收藏字体'" @click.stop="toggleFavorite(font.id)"><Heart :size="17" :fill="favorites.includes(font.id)?'currentColor':'none'"/></button></div>
                <div class="card-sample-wrap"><div class="card-sample" :style="{...styleFor(font),fontSize:'clamp(30px, 3vw, 46px)'}">{{ font.languages==='英文'?'AaBb':font.nativeName.length>9?'字形之间':font.nativeName.slice(0,4) }}</div><div v-if="font.source==='manual' && !available(font)" class="needs-font">可导入字体预览</div><div v-else-if="fontStatus[font.id]==='error' && !available(font)" class="needs-font">加载失败 · 显示备用字体</div></div>
                <div class="font-card-footer"><div><h3>{{font.name}}</h3><p>{{font.nativeName}} · {{font.mood}}</p></div><ArrowUpRight :size="18"/></div>
              </article>
            </div>
            <div v-else class="empty-state"><span>∅</span><h3>没有找到匹配的字体</h3><p>试试其他关键词或清空筛选条件。</p><button type="button" @click="search='';activeFilter='全部';language='全部语言'">显示全部字体 <ArrowRight :size="15"/></button></div>
          </section>
          <section class="preview-panel">
            <div class="section-heading"><div><span class="eyebrow">02 / MAKE IT YOURS</span><h2>实时文字预览</h2></div><div class="panel-hint"><SlidersHorizontal :size="17"/> INTERACTIVE TYPE TESTER</div></div>
            <div class="preview-card"><div class="preview-head"><label class="preview-text-label">你的预览文字 <span>可直接编辑</span></label><div class="preview-badge">LIVE PREVIEW</div></div><textarea v-model="sample" rows="2" maxlength="150" aria-label="输入自定义预览文字" placeholder="输入你想预览的文字"></textarea><div class="controls-grid"><label>字号 <strong>{{fontSize}} px</strong><input v-model.number="fontSize" type="range" min="18" max="100" step="1"/></label><label>字重 <strong>{{fontWeight}}</strong><input v-model.number="fontWeight" type="range" min="300" max="800" step="100"/></label><label>字间距 <strong>{{spacing}} px</strong><input v-model.number="spacing" type="range" min="-2" max="12" step=".5"/></label><label>行高 <strong>{{leading.toFixed(2)}}</strong><input v-model.number="leading" type="range" min="1" max="2.2" step=".05"/></label></div><div class="preview-tip">参数会同步应用于上方字体卡片和排版实验室；字体未加载时使用系统备用字形。</div></div>
          </section>
          <section class="footer-feature"><div><span class="eyebrow">03 / COMPARE & DISCOVER</span><h2>找到刚刚好的字体组合。</h2><p>把最多三款字体放在一起，比较同一段文字的不同气质。</p></div><button type="button" @click="changePage('compare')">打开排版实验室 <ArrowRight :size="18"/></button></section>
        </template>
        <template v-else>
          <section class="compare-hero"><span class="eyebrow">THE TYPOGRAPHY PLAYGROUND / 02</span><h1>排版实验室<span class="period">.</span></h1><p>在同样的文字中寻找微妙差异。你可以在画廊中添加喜欢的字体，最多同时比较三款。</p><button class="ghost-link" type="button" @click="changePage('gallery')"><ArrowRight :size="16" class="arrow-back"/> 返回字体画廊</button></section>
          <div class="compare-settings"><label>预览文字 <input v-model="sample" maxlength="150" aria-label="对比预览文字"/></label><div class="compare-settings-sliders"><label>字号 <span>{{fontSize}}px</span><input v-model.number="fontSize" type="range" min="18" max="100"/></label><label>字重 <span>{{fontWeight}}</span><input v-model.number="fontWeight" type="range" min="300" max="800" step="100"/></label><label>字间距 <span>{{spacing}}px</span><input v-model.number="spacing" type="range" min="-2" max="12" step=".5"/></label></div></div>
          <div class="compare-stack"><div v-for="(font,index) in comparison" :key="font.id" class="compare-card" v-visible="font"><div class="compare-card-head"><div><span class="compare-number">0{{index+1}}</span><div><strong>{{font.name}}</strong><small>{{font.nativeName}} · {{font.category}}</small></div></div><button class="icon-button" type="button" aria-label="移出对比" @click="toggleCompare(font.id)"><X :size="17"/></button></div><div class="compare-copy" :style="styleFor(font)">{{previewText(font)}}</div><div class="compare-foot"><span>{{available(font)?'字体已加载':'备用字体 / 可导入'}}</span><button type="button" @click="showFont(font)">查看字体详情 <ArrowUpRight :size="15"/></button></div></div><div v-if="!comparison.length" class="empty-state"><span>＋</span><h3>还没有选中字体</h3><button type="button" @click="changePage('gallery')">从字体画廊添加 <ArrowRight :size="16"/></button></div><button v-if="comparison.length<3" class="add-compare" type="button" @click="changePage('gallery')"><Plus :size="20"/> 从画廊添加其他字体</button></div>
        </template>
        <footer class="site-footer"><span>fontfolio. © 2026</span><span>Curated with intention. <span class="footer-separator">/</span> Designed for typography lovers.</span><a href="https://github.com/weepwood/Fontfolio" target="_blank" rel="noopener noreferrer">SOURCE ON GITHUB <ArrowUpRight :size="13"/></a></footer>
      </div>
    </main>
    <div v-if="detail" class="modal-backdrop" @click.self="detail=null">
      <section class="font-modal" role="dialog" aria-modal="true" :aria-label="'字体详情 '+detail.name">
        <div class="modal-top"><div><span class="eyebrow">FONT DETAILS / {{detail.category.toUpperCase()}}</span><h2>{{detail.name}}</h2><p>{{detail.nativeName}} · {{detail.mood}}</p></div><button type="button" class="modal-close" aria-label="关闭详情" @click="detail=null"><X :size="20"/></button></div>
        <div v-visible="detail" class="modal-specimen" :style="{...styleFor(detail),fontSize:'clamp(35px, 6vw, 75px)'}">{{previewText(detail)}}</div>
        <div class="modal-actions"><button type="button" :class="{marked:favorites.includes(detail.id)}" @click="toggleFavorite(detail.id)"><Heart :size="17" :fill="favorites.includes(detail.id)?'currentColor':'none'"/> {{favorites.includes(detail.id)?'已收藏':'添加收藏'}}</button><button type="button" @click="toggleCompare(detail.id)"><Columns2 :size="17"/> {{selection.includes(detail.id)?'从对比移除':'加入对比'}}</button><button type="button" @click="copyCss(detail)"><Copy :size="17"/> 复制 CSS</button><button v-if="detail.source!=='google' && !available(detail)" type="button" @click="upload(detail.id)"><UploadCloud :size="17"/> 导入字库</button></div>
        <div class="modal-info"><div><span class="info-label">TYPE CATEGORY</span><strong>{{detail.category}}</strong></div><div><span class="info-label">LANGUAGE</span><strong>{{detail.languages}}</strong></div><div><span class="info-label">FONT LICENSE</span><strong>{{detail.license}}</strong></div><div><span class="info-label">PREVIEW STATE</span><strong>{{available(detail)?'真实字形已加载':'备用字形 / 需要导入'}}</strong></div></div>
        <p class="modal-description">{{detail.description}} <span v-if="detail.source==='manual'">公开可下载不代表可以任意商用或再分发，请核对权利人的具体许可条款。</span></p>
        <a v-if="detail.url!=='#'" :href="detail.url" target="_blank" rel="noopener noreferrer" class="source-button">查看字体来源和授权 <ExternalLink :size="16"/></a>
      </section>
    </div>
    <input ref="uploadInput" type="file" accept=".ttf,.otf,.woff,.woff2" hidden @change="handleUpload"/>
    <div v-if="notice" class="toast" role="status"><Check :size="16"/><span>{{notice}}</span><button type="button" aria-label="关闭提示" @click="notice=''"><X :size="16"/></button></div>
    <button type="button" class="floating-upload" aria-label="导入字体" title="导入本地字体" @click="upload()"><Download :size="20"/></button>
  </div>
</template>
