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

// What the app opens with: the original's 1, ♭7, 4, 1 in D. (The original called it Amazing Grace;
// Amazing Grace is the D - 1 4 1 5 preset below.)
export const START = {
  key: 2,
  chords: [
    { degree: 1, flat: false, quality: '' },
    { degree: 7, flat: true, quality: '' },
    { degree: 4, flat: false, quality: '' },
    { degree: 1, flat: false, quality: '' },
  ],
}

// Presets: songs to walk beginners through the basic chords, labelled by key and progression the way
// they read in the dropdown ("C - 1 5 6m 4"). A minor-key song is numbered from its own minor chord
// (1m), as Nashville charts do: Watchtower in Bm is 1m ♭7 ♭6 ♭7, played in the key of B.
const C = (degree, quality = '', flat = false) => ({ degree, flat, quality })
export const PRESETS = [
  { id: 'let-it-be', label: 'C - 1 5 6m 4', song: 'Let It Be', key: 0, chords: [C(1), C(5), C(6, 'm'), C(4)] },
  { id: 'g-1-3m-4-5', label: 'G - 1 3m 4 5', song: 'Too many to name', key: 7, chords: [C(1), C(3, 'm'), C(4), C(5)] },
  { id: 'watchtower', label: 'Bm - 1m ♭7 ♭6 ♭7', song: 'All Along the Watchtower', key: 11,
    chords: [C(1, 'm'), C(7, '', true), C(6, '', true), C(7, '', true)] },
  { id: 'amazing-grace', label: 'D - 1 4 1 5', song: 'Amazing Grace', key: 2, chords: [C(1), C(4), C(1), C(5)] },
]

// The preset the screen is showing right now, if it's one exactly.
export function currentPreset(key, chords) {
  const same = (a, b) => a.degree === b.degree && a.flat === b.flat && a.quality === b.quality
  return PRESETS.find((p) => p.key === key && p.chords.length === chords.length && p.chords.every((c, i) => same(c, chords[i])))
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
