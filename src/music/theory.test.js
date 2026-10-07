// npm test: proves the music before any of it is drawn.
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { GUITAR } from './guitar.js'
import { chordName, chordRoot, chordTones, inKey, nashville, nashvilleSpoken, noteColor, NOTES, QUALITIES, roman } from './theory.js'

const D = NOTES.indexOf('D')
const AMAZING_GRACE = [
  { degree: 1, flat: false, quality: '' },
  { degree: 7, flat: true, quality: '' },
  { degree: 4, flat: false, quality: '' },
  { degree: 1, flat: false, quality: '' },
]

test('Amazing Grace in D is D, C, G, D', () => {
  assert.deepEqual(AMAZING_GRACE.map((c) => chordName(D, c)), ['D', 'C', 'G', 'D'])
  assert.deepEqual(AMAZING_GRACE.map(nashville), ['1', '♭7', '4', '1'])
  assert.equal(nashvilleSpoken(AMAZING_GRACE[1]), 'flat seven')
})

test('Roman numerals: capitals major, lower case minor, the 7 apart', () => {
  assert.deepEqual(AMAZING_GRACE.map((c) => roman(c).numeral), ['I', '♭VII', 'IV', 'I'])
  assert.deepEqual(roman({ degree: 2, flat: false, quality: 'm' }), { numeral: 'ii', seven: false })
  assert.deepEqual(roman({ degree: 5, flat: false, quality: '7' }), { numeral: 'V', seven: true })
  assert.deepEqual(roman({ degree: 6, flat: false, quality: 'm' }), { numeral: 'vi', seven: false })
})

test('the same numbers in every key are the same distance apart', () => {
  for (let key = 0; key < 12; key++) {
    const roots = AMAZING_GRACE.map((c) => chordRoot(key, c))
    assert.equal((roots[1] - roots[0] + 12) % 12, 10) // ♭7 is ten semitones up
    assert.equal((roots[2] - roots[0] + 12) % 12, 5) // 4 is five semitones up
  }
})

test('the diatonic chords of C', () => {
  const chords = [1, 2, 3, 4, 5, 6].map((degree) => chordName(0, { degree, flat: false, quality: [2, 3, 6].includes(degree) ? 'm' : '' }))
  assert.deepEqual(chords, ['C', 'Dm', 'Em', 'F', 'G', 'Am'])
  assert.equal(chordName(0, { degree: 5, flat: false, quality: '7' }), 'G7')
})

test('chord tones and their roles', () => {
  const g7 = chordTones(NOTES.indexOf('G'), '7').map(({ pitch, role }) => `${NOTES[pitch]}:${role}`)
  assert.deepEqual(g7, ['G:R', 'B:3', 'D:5', 'F:7'])
  const am = chordTones(NOTES.indexOf('A'), 'm').map(({ pitch }) => NOTES[pitch])
  assert.deepEqual(am, ['A', 'C', 'E'])
})

test('colour by key: a G chord in D is 4, 6 and 1', () => {
  const tones = chordTones(NOTES.indexOf('G'), '')
  assert.deepEqual(tones.map((t) => inKey(D, t.pitch).label), ['4', '6', '1'])
  assert.equal(inKey(D, NOTES.indexOf('C')).label, '♭7') // the ♭7 chord's root isn't in the key
  assert.equal(noteColor('key', tones[0], D), '#2d7899')
  assert.equal(noteColor('chord', tones[0], D), '#c02727') // and it's the root of its own chord
})

test('every guitar shape plays only its chord tones, and all of them', () => {
  const TUNING = [4, 9, 2, 7, 11, 4] // E A D G B E
  for (const [name, { frets }] of Object.entries(GUITAR)) {
    const root = NOTES.indexOf(name.replace(/[m7]$/, ''))
    const quality = name.endsWith('m') ? 'm' : name.endsWith('7') ? '7' : ''
    const want = Object.keys(QUALITIES[quality].intervals).map(Number)
    const played = new Set()
    frets.forEach((fret, string) => {
      if (fret === null) return
      const interval = (TUNING[string] + fret - root + 120) % 12
      assert.ok(want.includes(interval), `${name}: string ${6 - string}, fret ${fret} isn't a tone of the chord`)
      played.add(interval)
    })
    // Every tone but the 5th: guitar voicings often leave it out (the standard C7, x32310, does).
    const needed = want.filter((i) => i !== 7)
    for (const i of needed) assert.ok(played.has(i), `${name} doesn't play all its tones`)
  }
  assert.equal(Object.keys(GUITAR).length, 36)
})
