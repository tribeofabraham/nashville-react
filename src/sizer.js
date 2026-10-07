import { useLayoutEffect, useState } from 'react'

/**
 * sizer - scales a module to the space it lives in.
 *
 * Returns a scale factor for the module's font size (use it as `${scale}rem`).
 * Since everything inside the module is in ems, the whole layout scales with it.
 *
 *   width  ratio = parent width   / designWidth
 *   height ratio = window height  / designHeight   (when fitHeight is on)
 *   scale        = the smaller of the two, kept between minScale and maxScale
 *
 * contentWidth (in em) is how wide the module's content actually is. When set,
 * the width ratio only shrinks the module once that content would no longer
 * fit at 1rem, so a narrow window doesn't leave a tiny card in empty space.
 *
 * When the parent is narrower than reflowBelow (in rem), scaling stops and the
 * module sits at 1rem so the stacked mobile layout takes over at a readable size.
 *
 * Height is read from the browser window rather than the parent, because a
 * parent without a fixed height grows with its content. Measuring it would
 * shrink the module, which shrinks the parent, and so on.
 */
export function useSizer(
  ref,
  {
    enabled = true,
    designWidth = 1920,
    designHeight = 1080,
    fitHeight = true,
    minScale = 0.4,
    maxScale = 2,
    reflowBelow = 34,
    contentWidth,
  } = {},
) {
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const parent = ref.current?.parentElement
    if (!enabled || !parent) return

    function measure() {
      const remSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
      if (parent.clientWidth < reflowBelow * remSize) {
        setScale(1)
        return
      }

      const designRatio = parent.clientWidth / designWidth
      const contentFit = contentWidth
        ? Math.min(1, parent.clientWidth / (contentWidth * remSize))
        : 0
      const widthRatio = Math.max(designRatio, contentFit)
      const heightRatio = fitHeight ? window.innerHeight / designHeight : Infinity
      const ratio = Math.min(widthRatio, heightRatio)
      const clamped = Math.min(maxScale, Math.max(minScale, ratio))
      setScale(Math.round(clamped * 1000) / 1000)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(parent)
    window.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [ref, enabled, designWidth, designHeight, fitHeight, minScale, maxScale, reflowBelow, contentWidth])

  return enabled ? scale : 1
}
