// The music behind the app: keys, Nashville numbers, chord tones, and the two colourings.
// Pitches are 0-11 with C = 0. No React here, so it can be tested on its own (theory.test.js).

// Spelled with flats, as on the wheel; ♭ is for display.
export const NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
export const display = (note) => note.replace('b', '♭')

// Semitones above the key for each Nashville number 1-7 (the major scale).
export const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11]

export const QUALITIES = {
  '': { label: 'major', intervals: { 0: 'R', 4: '3', 7: '5' } },
  m: { label: 'minor', intervals: { 0: 'R', 3: '3', 7: '5' } },
  7: { label: 'seven', intervals: { 0: 'R', 4: '3', 7: '5', 10: '7' } },
}

// Colour by chord: each note's role in the chord, as in the original chord diagrams.
export const ROLE_COLORS = { R: '#c02727', 3: '#235daa', 5: '#7ea740', 7: '#ff7415' }
export const ROLE_NAMES = { R: 'root', 3: 'third', 5: 'fifth', 7: 'seventh' }

// Colour by key: each note's place in the key, 1-7, from the original wheel's palette.
// 1, 3 and 5 match the chord colours above, so a 1 chord looks the same either way.
export const DEGREE_COLORS = { 1: '#c02727', 2: '#5226a8', 3: '#235daa', 4: '#2d7899', 5: '#7ea740', 6: '#8e7100', 7: '#ff7415' }
export const OUTSIDE_COLOR = '#6b6b6b' // a note that isn't in the key (a ♭7 chord's root, say)

const mod12 = (n) => ((n % 12) + 12) % 12

// A chord in the progression: a Nashville number, maybe flatted, and a quality.
//   { degree: 1-7, flat: true|false, quality: '' | 'm' | '7' }
export function chordRoot(key, chord) {
  return mod12(key + MAJOR_SCALE[chord.degree - 1] - (chord.flat ? 1 : 0))
}

export function chordName(key, chord) {
  return NOTES[chordRoot(key, chord)] + chord.quality
}

// How the chord reads in Nashville numbers: "1", "♭7", "4m", "57".
export function nashville(chord) {
  return `${chord.flat ? '♭' : ''}${chord.degree}${chord.quality}`
}

// The same chord in Roman numerals: capitals for major and 7th chords, lower case for minor.
// The 7 is returned apart, to be raised: { numeral: '♭VII', seven: false }, { numeral: 'V', seven: true }.
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
export function roman(chord) {
  const numeral = ROMAN[chord.degree - 1]
  return {
    numeral: `${chord.flat ? '♭' : ''}${chord.quality === 'm' ? numeral.toLowerCase() : numeral}`,
    seven: chord.quality === '7',
  }
}

// Said aloud, for screen readers: "flat seven", "four minor", "five seven".
const WORDS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven']
export function nashvilleSpoken(chord) {
  return [chord.flat && 'flat', WORDS[chord.degree - 1], chord.quality === 'm' && 'minor', chord.quality === '7' && 'seven']
    .filter(Boolean).join(' ')
}

// The chord's notes, each with its role: [{ pitch, role }], root first.
export function chordTones(root, quality) {
  return Object.entries(QUALITIES[quality].intervals).map(([interval, role]) => ({ pitch: mod12(root + Number(interval)), role }))
}

// Where a pitch sits in a key: { degree: 1-7 } for a note of the key, else { degree: null, label: '♭7' }.
export function inKey(key, pitch) {
  const above = mod12(pitch - key)
  const degree = MAJOR_SCALE.indexOf(above)
  if (degree >= 0) return { degree: degree + 1, label: String(degree + 1) }
  return { degree: null, label: `♭${MAJOR_SCALE.indexOf(above + 1) + 1}` }
}

// The colour for a note, by the chosen scheme: 'chord' (its role in the chord) or 'key' (its place in the key).
export function noteColor(scheme, { role, pitch }, key) {
  if (scheme === 'chord') return ROLE_COLORS[role]
  const { degree } = inKey(key, pitch)
  return degree ? DEGREE_COLORS[degree] : OUTSIDE_COLOR
}
