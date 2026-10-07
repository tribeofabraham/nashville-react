// Colour contrast (WCAG): labels on the coloured dots and keys, and coloured text on the dark page, must
// read at 4.5:1 or better. contrast.test.js holds every colour in the app to it.

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
export const contrast = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

export const INK = '#12150a' // the page
export const WARM = '#1d2111' // the cards
const WHITE = '#ffffff'

// The label for a coloured dot or key: white or ink, whichever reads better on that colour.
export const labelOn = (fill) => (contrast(WHITE, fill) >= contrast(INK, fill) ? WHITE : INK)

// A colour used as text on the dark page (the wheel's numbers, the scale's degrees): the same hue,
// lightened just enough to read at 4.5:1 on the cards' background (the lighter of the two).
const mix = (hex, t) => '#' + [1, 3, 5].map((i) => {
  const v = parseInt(hex.slice(i, i + 2), 16)
  return Math.round(v + (255 - v) * t).toString(16).padStart(2, '0')
}).join('')
export function textOnDark(color) {
  for (let t = 0; t <= 1; t += 0.02) {
    const c = mix(color, t)
    if (contrast(c, WARM) >= 4.5) return c
  }
  return WHITE
}
