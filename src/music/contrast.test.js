// npm test: every colour in the app reads at 4.5:1 or better where it carries text.
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { contrast, INK, labelOn, textOnDark, WARM } from './contrast.js'
import { DEGREE_COLORS, OUTSIDE_COLOR, ROLE_COLORS } from './theory.js'

const COLORS = [...new Set([...Object.values(ROLE_COLORS), ...Object.values(DEGREE_COLORS), OUTSIDE_COLOR])]

test('labels on every coloured dot and key read at 4.5:1', () => {
  for (const c of COLORS) assert.ok(contrast(labelOn(c), c) >= 4.5, `${c}: ${contrast(labelOn(c), c).toFixed(2)}`)
})

test('every colour used as text on the dark page reads at 4.5:1', () => {
  for (const c of COLORS) {
    for (const bg of [INK, WARM]) assert.ok(contrast(textOnDark(c), bg) >= 4.5, `${c} on ${bg}`)
  }
})

// The theme's own text colours, from index.css.
const PAPER = '#f4efe6'
const CREAM = '#e8e0d0'
const MUTED = '#a09282'
const BRASS = '#b8923a'
const BRASS_LIGHT = '#d4aa55'

test('the theme’s text reads at 4.5:1 on the olive page and cards', () => {
  for (const fg of [PAPER, CREAM, MUTED, BRASS, BRASS_LIGHT]) {
    for (const bg of [INK, WARM]) assert.ok(contrast(fg, bg) >= 4.5, `${fg} on ${bg}: ${contrast(fg, bg).toFixed(2)}`)
  }
})

test('dark text on the brass buttons and the wheel’s key disc reads at 4.5:1', () => {
  for (const bg of [BRASS, BRASS_LIGHT]) assert.ok(contrast(INK, bg) >= 4.5, `ink on ${bg}: ${contrast(INK, bg).toFixed(2)}`)
})
