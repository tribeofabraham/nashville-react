// A progression: the key and up to eight chords in Nashville numbers.

export const MAX_CHORDS = 8

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
// mods: 0 none, 1 m, 2 7, 3 ♭, 4 ♭m, 5 ♭7.
export function fromSongMessage(d) {
  if (!d || d.type !== 'setSong' || !['notation', 'nashville'].includes(d.target)) return null
  if (!Number.isInteger(d.keyIndex) || !Array.isArray(d.chords)) return null
  const chords = d.chords.slice(0, MAX_CHORDS).map((degree, i) => {
    const mod = Number(d.mods?.[i] ?? 0)
    return {
      degree: Math.min(7, Math.max(1, Number(degree) || 1)),
      flat: mod >= 3,
      quality: mod === 1 || mod === 4 ? 'm' : mod === 2 || mod === 5 ? '7' : '',
    }
  })
  return chords.length ? { key: ((d.keyIndex % 12) + 12) % 12, chords } : null
}
