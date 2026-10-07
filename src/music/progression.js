import { QUALITIES } from './theory.js'

// A progression: the key and up to eight chords in Nashville numbers.

export const MAX_CHORDS = 8

// The number, flats included, chromatically: what the dropdown on each card offers.
export const NUMBERS = [
  [1, false], [2, true], [2, false], [3, true], [3, false], [4, false],
  [5, true], [5, false], [6, true], [6, false], [7, true], [7, false],
].map(([degree, flat]) => ({ value: `${flat ? 'b' : ''}${degree}`, label: `${flat ? '♭' : ''}${degree}`, degree, flat }))

// A chord's number as the dropdowns hold it ('b7', '4'), and back.
export const numberValue = (chord) => `${chord.flat ? 'b' : ''}${chord.degree}`
export const fromNumberValue = (value) => {
  const pick = NUMBERS.find((x) => x.value === value)
  return { degree: pick.degree, flat: pick.flat }
}

// Amazing Grace in D, as the original opened with: 1, ♭7, 4, 1.
export const START = {
  key: 2,
  chords: [
    { degree: 1, flat: false, quality: '' },
    { degree: 7, flat: true, quality: '' },
    { degree: 4, flat: false, quality: '' },
    { degree: 1, flat: false, quality: '' },
  ],
}

// The original's song message, so other Tribe of Abraham tools can load a song the same way:
//   { target: 'notation' | 'nashville', type: 'setSong', keyIndex: 0-11, chords: [1-7, …], mods: [0-5, …] }
// mods: 0 none, 1 m, 2 7, 3 ♭, 4 ♭m, 5 ♭7. Newer senders can add qualities: ['maj7', 'sus4', …] for
// any chord type (QUALITIES), which then takes the place of the type in mods.

export function fromSongMessage(d) {
  if (!d || d.type !== 'setSong' || !['notation', 'nashville'].includes(d.target)) return null
  if (!Number.isInteger(d.keyIndex) || !Array.isArray(d.chords)) return null
  const chords = d.chords.slice(0, MAX_CHORDS).map((degree, i) => {
    const mod = Number(d.mods?.[i] ?? 0)
    const named = d.qualities?.[i]
    return {
      degree: Math.min(7, Math.max(1, Number(degree) || 1)),
      flat: mod >= 3,
      quality: named in QUALITIES ? named : mod === 1 || mod === 4 ? 'm' : mod === 2 || mod === 5 ? '7' : '',
    }
  })
  return chords.length ? { key: ((d.keyIndex % 12) + 12) % 12, chords } : null
}
