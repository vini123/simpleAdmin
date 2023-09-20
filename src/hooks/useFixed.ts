import { watch, ref, nextTick } from 'vue'
import { useWindowSize } from '@vueuse/core'

export function useFixed(id: string, adjust: number): Record<string, any> {
  const { height } = useWindowSize()
  const isFixed = ref(false)

  watch(height, () => {
    resize()
  })

  function resize() {
    nextTick(() => {
      const element: HTMLElement | null = document.getElementById(id)

      if (element) {
        const h1 = element?.offsetTop
        const h2 = element?.clientHeight
        isFixed.value = height.value - h1 - adjust < h2
      }
    })
  }

  return { ref: isFixed, fun: resize }
}
