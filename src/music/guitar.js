// Guitar fingerings, read from the original Nashville Notation's chords.svg and checked note by note
// against theory (every dot is a tone of its chord, in the colour of its role). Low E to high e;
// null = string not played. baseFret: the fret the diagram starts at (1 = the nut).

export const GUITAR = {
  'C': { frets: [null, 3, 2, 0, 1, 0], baseFret: 1 },
  'Cm': { frets: [null, 3, 5, 5, 4, 3], baseFret: 3 },
  'C7': { frets: [null, 3, 2, 3, 1, 0], baseFret: 1 },   // standard shape: the artwork's had no 7th
  'Db': { frets: [null, 4, 6, 6, 6, 4], baseFret: 4 },
  'Dbm': { frets: [null, 4, 6, 6, 5, 4], baseFret: 4 },
  'Db7': { frets: [null, 4, 6, 4, 6, 4], baseFret: 4 },
  'D': { frets: [null, null, 0, 2, 3, 2], baseFret: 1 },
  'Dm': { frets: [null, null, 0, 2, 3, 1], baseFret: 1 },
  'D7': { frets: [null, null, 0, 2, 1, 2], baseFret: 1 },
  'Eb': { frets: [null, null, 1, 3, 4, 3], baseFret: 1 },
  'Ebm': { frets: [null, null, 1, 3, 4, 2], baseFret: 1 },
  'Eb7': { frets: [null, null, 1, 3, 2, 3], baseFret: 1 },
  'E': { frets: [0, 2, 2, 1, 0, 0], baseFret: 1 },
  'Em': { frets: [0, 2, 2, 0, 0, 0], baseFret: 1 },
  'E7': { frets: [0, 2, 2, 1, 3, 0], baseFret: 1 },
  'F': { frets: [1, 3, 3, 2, 1, 1], baseFret: 1 },
  'Fm': { frets: [1, 3, 3, 1, 1, 1], baseFret: 1 },
  'F7': { frets: [1, 3, 1, 2, 1, 1], baseFret: 1 },
  'Gb': { frets: [2, 4, 4, 3, 2, 2], baseFret: 1 },
  'Gbm': { frets: [2, 4, 4, 2, 2, 2], baseFret: 1 },
  'Gb7': { frets: [2, 4, 2, 3, 2, 2], baseFret: 2 },   // standard shape: the artwork's had no 7th
  'G': { frets: [3, 2, 0, 0, 0, 3], baseFret: 1 },
  'Gm': { frets: [3, 5, 5, 3, 3, 3], baseFret: 3 },
  'G7': { frets: [3, 2, 0, 0, 0, 1], baseFret: 1 },
  'Ab': { frets: [4, 6, 6, 5, 4, 4], baseFret: 4 },
  'Abm': { frets: [4, 6, 6, 4, 4, 4], baseFret: 4 },
  'Ab7': { frets: [4, 6, 4, 5, 4, 4], baseFret: 4 },   // standard shape: the artwork's had no 7th
  'A': { frets: [null, 0, 2, 2, 2, 0], baseFret: 1 },
  'Am': { frets: [null, 0, 2, 2, 1, 0], baseFret: 1 },   // the artwork strummed the low E (an E under the chord)
  'A7': { frets: [null, 0, 2, 0, 2, 0], baseFret: 1 },   // standard shape: the artwork's had no 7th
  'Bb': { frets: [null, 1, 3, 3, 3, 1], baseFret: 1 },
  'Bbm': { frets: [null, 1, 3, 3, 2, 1], baseFret: 1 },
  'Bb7': { frets: [null, 1, 3, 1, 3, 1], baseFret: 1 },   // standard shape: the artwork's had no 7th
  'B': { frets: [null, 2, 4, 4, 4, 2], baseFret: 1 },
  'Bm': { frets: [null, 2, 4, 4, 3, 2], baseFret: 1 },
  'B7': { frets: [null, 2, 1, 2, 0, 2], baseFret: 1 },   // standard shape: the artwork's had no 7th
}

// -- The other chord types --
// Open shapes beginners learn first, where there's a standard one (checked like everything here).
const OPEN = {
  Cmaj7: [null, 3, 2, 0, 0, 0],
  Dmaj7: [null, null, 0, 2, 2, 2],
  Emaj7: [0, 2, 1, 1, 0, 0],
  Fmaj7: [null, null, 3, 2, 1, 0],
  Gmaj7: [3, 2, 0, 0, 0, 2],
  Dm7: [null, null, 0, 2, 1, 1],
  Em7: [0, 2, 2, 0, 3, 0],
  Am7: [null, 0, 2, 0, 1, 0],
  Dsus2: [null, null, 0, 2, 3, 0],
  Asus2: [null, 0, 2, 2, 0, 0],
  Dsus4: [null, null, 0, 2, 3, 3],
  Esus4: [0, 2, 2, 2, 0, 0],
  Asus4: [null, 0, 2, 2, 3, 0],
  Gsus4: [3, 3, 0, 0, 1, 3],
  Cadd9: [null, 3, 2, 0, 3, 0],
  Gadd9: [3, 2, 0, 2, 0, 3],
  C6: [null, 3, 2, 2, 1, 0],
  D6: [null, null, 0, 2, 0, 2],
  G6: [3, 2, 0, 0, 0, 0],
  A6: [null, 0, 2, 2, 2, 2],
  E6: [0, 2, 2, 1, 2, 0],
}

// Movable shapes for every other key: frets above the root's fret on the low E string (E) or on the
// A string (A), the two barre forms every guitarist learns. The lower-placed of the two is used.
const MOVABLE = {
  maj7: { E: [0, null, 1, 1, 0, null], A: [null, 0, 2, 1, 2, 0] },
  m7: { E: [0, 2, 0, 0, 0, 0], A: [null, 0, 2, 0, 1, 0] },
  sus2: { A: [null, 0, 2, 2, 0, 0] },
  sus4: { E: [0, 2, 2, 2, 0, 0], A: [null, 0, 2, 2, 3, 0] },
  add9: { A: [null, 0, 2, 4, 2, 0] },
  6: { A: [null, 0, 2, 2, 2, 2] },
  dim: { A: [null, 0, 1, 2, 1, null] },
}

const NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

// The shape for any root (0-11, C = 0) and chord type: { frets, baseFret }.
export function guitarShape(root, quality) {
  const name = NAMES[root] + quality
  if (GUITAR[name]) return GUITAR[name]
  let frets = OPEN[name]
  if (!frets) {
    const forms = MOVABLE[quality]
    const at = { E: (root - 4 + 12) % 12, A: (root - 9 + 12) % 12 }
    const form = Object.keys(forms).sort((a, b) => at[a] - at[b])[0]
    frets = forms[form].map((f) => (f === null ? null : at[form] + f))
  }
  const fretted = frets.filter((f) => f)
  const baseFret = fretted.length && Math.max(...fretted) > 4 ? Math.min(...fretted) : 1
  return { frets, baseFret }
}
