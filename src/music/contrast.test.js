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
