// The music behind the app: keys, Nashville numbers, chord tones, and the two colourings.
// Pitches are 0-11 with C = 0. No React here, so it can be tested on its own (theory.test.js).

// Spelled with flats, as on the wheel; ♭ is for display.
export const NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
export const display = (note) => note.replace('b', '♭')

// Spelling a note the way the key calls for it: each step of the scale takes the next letter, so D major
// is D E F♯ G A B C♯ (not G♭ and D♭), F major has B♭, and a ♭7 in D is C. letter: 0 = C … 6 = B.
const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const NATURAL = [0, 2, 4, 5, 7, 9, 11]
const ACCIDENTAL = { '-2': '𝄫', '-1': '♭', 0: '', 1: '♯', 2: '𝄪' }
export function spell(letter, pitch) {
  const l = ((letter % 7) + 7) % 7
  const off = ((((pitch - NATURAL[l]) % 12) + 18) % 12) - 6
  return LETTERS[l] + ACCIDENTAL[off]
}
const keyLetter = (key) => LETTERS.indexOf(NOTES[key][0])
// A note of the key, by its scale step (1-7, as in a degree like '♭3' -> 3).
export const spellInKey = (key, step, pitch) => spell(keyLetter(key) + step - 1, pitch)

// Semitones above the key for each Nashville number 1-7 (the major scale).
export const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11]

// The chord types, in the order the dropdown offers them. intervals: semitones above the root, and each
// note's role in the chord (what it's coloured and labelled by). mark: how the type is written after the
// Nashville number, with sup for the part that's raised (1m, 1⁷, 1m⁷, 1ᵐᵃʲ⁷, 1°).
export const QUALITIES = {
  '': { label: 'Major', spoken: 'major', intervals: { 0: 'R', 4: '3', 7: '5' }, mark: {} },
  m: { label: 'Minor (m)', spoken: 'minor', intervals: { 0: 'R', 3: '3', 7: '5' }, mark: { text: 'm' } },
  7: { label: '7th', spoken: 'seven', intervals: { 0: 'R', 4: '3', 7: '5', 10: '7' }, mark: { sup: '7' } },
  maj7: { label: 'Major 7th (maj7)', spoken: 'major seven', intervals: { 0: 'R', 4: '3', 7: '5', 11: '7' }, mark: { sup: 'maj7' } },
  m7: { label: 'Minor 7th (m7)', spoken: 'minor seven', intervals: { 0: 'R', 3: '3', 7: '5', 10: '7' }, mark: { text: 'm', sup: '7' } },
  sus2: { label: 'Sus2', spoken: 'sus two', intervals: { 0: 'R', 2: '2', 7: '5' }, mark: { sup: 'sus2' } },
  sus4: { label: 'Sus4', spoken: 'sus four', intervals: { 0: 'R', 5: '4', 7: '5' }, mark: { sup: 'sus4' } },
  add9: { label: 'Add9', spoken: 'add nine', intervals: { 0: 'R', 4: '3', 7: '5', 2: '9' }, mark: { sup: 'add9' } },
  6: { label: '6th', spoken: 'six', intervals: { 0: 'R', 4: '3', 7: '5', 9: '6' }, mark: { sup: '6' } },
  dim: { label: 'Diminished (dim)', spoken: 'diminished', intervals: { 0: 'R', 3: '3', 6: '5' }, mark: { text: '°' } },
}

// Colour by chord: each note's role in the chord, as in the original chord diagrams.
// The added notes (2nd/9th, 4th, 6th) take their colours from the key palette below.
export const ROLE_COLORS = { R: '#c02727', 3: '#235daa', 5: '#7ea740', 7: '#ff7415', 2: '#5226a8', 9: '#5226a8', 4: '#2d7899', 6: '#8e7100' }
export const ROLE_NAMES = { R: 'root', 3: 'third', 5: 'fifth', 7: 'seventh', 2: 'second', 9: 'ninth', 4: 'fourth', 6: 'sixth' }

// Colour by key: each note's place in the key, 1-7, from the original wheel's palette.
// 1, 3 and 5 match the chord colours above, so a 1 chord looks the same either way.
export const DEGREE_COLORS = { 1: '#c02727', 2: '#5226a8', 3: '#235daa', 4: '#2d7899', 5: '#7ea740', 6: '#8e7100', 7: '#ff7415' }
export const OUTSIDE_COLOR = '#6b6b6b' // a note that isn't in the key (a ♭7 chord's root, say)

const mod12 = (n) => ((n % 12) + 12) % 12

// A chord in the progression: a Nashville number, maybe flatted, and a quality.
//   { degree: 1-7, flat: true|false, quality: a key of QUALITIES }
export function chordRoot(key, chord) {
  return mod12(key + MAJOR_SCALE[chord.degree - 1] - (chord.flat ? 1 : 0))
}

// The chord's name, its root spelled for the key: in D the 3 chord is F♯m, in F the 4 chord is B♭.
export function chordName(key, chord) {
  return spellInKey(key, chord.degree, chordRoot(key, chord)) + chord.quality
}

// How the chord reads in Nashville numbers, as plain text: "1", "♭7", "4m", "57", "1maj7".
export function nashville(chord) {
  const { text = '', sup = '' } = QUALITIES[chord.quality].mark
  return `${chord.flat ? '♭' : ''}${chord.degree}${text}${sup}`
}

// Said aloud, for screen readers: "flat seven", "four minor", "five seven".
const WORDS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven']
export function nashvilleSpoken(chord) {
  return [chord.flat && 'flat', WORDS[chord.degree - 1], chord.quality && QUALITIES[chord.quality].spoken]
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

// -- Scales --
// Each scale on the key's root: semitones above it, and how each note is named as a degree. A degree's
// colour comes from its number (♭3 shares 3's colour), so the root is red in every scale.
export const SCALES = {
  major: { label: 'Major', steps: [0, 2, 4, 5, 7, 9, 11], degrees: ['1', '2', '3', '4', '5', '6', '7'] },
  minor: { label: 'Natural minor', steps: [0, 2, 3, 5, 7, 8, 10], degrees: ['1', '2', '♭3', '4', '5', '♭6', '♭7'] },
  majorPentatonic: { label: 'Major pentatonic', steps: [0, 2, 4, 7, 9], degrees: ['1', '2', '3', '5', '6'] },
  minorPentatonic: { label: 'Minor pentatonic', steps: [0, 3, 5, 7, 10], degrees: ['1', '♭3', '4', '5', '♭7'] },
  blues: { label: 'Blues', steps: [0, 3, 5, 6, 7, 10], degrees: ['1', '♭3', '4', '♭5', '5', '♭7'] },
  mixolydian: { label: 'Mixolydian', steps: [0, 2, 4, 5, 7, 9, 10], degrees: ['1', '2', '3', '4', '5', '6', '♭7'] },
}

// The scale's notes from its root: [{ pitch, degree: '♭3', name: 'F', color }].
export function scaleNotes(root, type) {
  const { steps, degrees } = SCALES[type]
  return steps.map((step, i) => {
    const number = Number(degrees[i].replace('♭', ''))
    return {
      pitch: mod12(root + step),
      degree: degrees[i],
      name: spellInKey(root, number, mod12(root + step)),
      color: DEGREE_COLORS[number],
    }
  })
}
