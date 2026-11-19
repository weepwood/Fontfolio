<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

/**
 * Font preview cards favor a single complete line. Measure using the actual
 * loaded font instead of estimating CJK glyph widths from character count.
 */
const props = defineProps<{
  text: string
  fontFamily: string
  fontWeight: number
  letterSpacing: number
  lineHeight: number
  preferredSize: number
}>()

const root = ref<HTMLElement | null>(null)
const actualSize = ref(props.preferredSize)
const wrapped = ref(false)
const minimumSize = 19
let resizeObserver: ResizeObserver | null = null
let animationFrame = 0
let canvas: HTMLCanvasElement | null = null

function fitText() {
  const element = root.value
  if (!element) return

  // A small safety margin prevents fractional glyph measurements from clipping.
  const availableWidth = element.clientWidth - 10
  if (availableWidth <= 0) return

  const context = (canvas ??= document.createElement('canvas')).getContext('2d')
  if (!context) return

  const content = props.text.replace(/\s+/g, ' ').trim()
  const maximum = Math.max(12, Math.min(props.preferredSize, 48))
  const minimum = Math.min(minimumSize, maximum)
  if (!content) {
    actualSize.value = maximum
    wrapped.value = false
    return
  }

  const family = getComputedStyle(element).fontFamily
  const count = Array.from(content).length
  const widthAt = (size: number) => {
    context.font = `${props.fontWeight} ${size}px ${family}`
    return context.measureText(content).width + count * props.letterSpacing
  }

  // User-entered newlines are intentional; do not force them into one line.
  if (/[\r\n]/.test(props.text)) {
    actualSize.value = maximum
    wrapped.value = true
    return
  }

  if (widthAt(maximum) <= availableWidth) {
    actualSize.value = maximum
    wrapped.value = false
    return
  }

  if (widthAt(minimum) > availableWidth) {
    // Exception: excessively long custom strings can use up to two lines.
    actualSize.value = minimum
    wrapped.value = true
    return
  }

  // Binary-search the largest fitting size to keep specimens legible.
  let low = minimum
  let high = maximum
  for (let i = 0; i < 12; i++) {
    const middle = (low + high) / 2
    if (widthAt(middle) <= availableWidth) low = middle
    else high = middle
  }
  actualSize.value = Math.floor(low * 10) / 10
  wrapped.value = false
}

function scheduleFit() {
  if (animationFrame) cancelAnimationFrame(animationFrame)
  animationFrame = requestAnimationFrame(fitText)
}

onMounted(() => {
  if (typeof ResizeObserver !== 'undefined' && root.value) {
    resizeObserver = new ResizeObserver(scheduleFit)
    resizeObserver.observe(root.value)
  } else {
    window.addEventListener('resize', scheduleFit)
  }
  // Font loading changes measured glyph widths after CSS is first injected.
  document.fonts.addEventListener('loadingdone', scheduleFit)
  void document.fonts.ready.then(scheduleFit)
  scheduleFit()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', scheduleFit)
  document.fonts.removeEventListener('loadingdone', scheduleFit)
  if (animationFrame) cancelAnimationFrame(animationFrame)
})

watch(
  () => [props.text, props.fontFamily, props.fontWeight, props.letterSpacing, props.lineHeight, props.preferredSize],
  () => { void nextTick(scheduleFit) }
)
</script>

<template>
  <div
    ref="root"
    class="card-sample"
    :class="{ 'card-sample--wrap': wrapped }"
    :style="{
      fontFamily,
      fontWeight,
      fontSize: actualSize + 'px',
      letterSpacing: letterSpacing + 'px',
      lineHeight
    }"
    :title="text"
  >{{ text }}</div>
</template>
