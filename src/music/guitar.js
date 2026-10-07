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
  'Am': { frets: [0, 0, 2, 2, 1, 0], baseFret: 1 },
  'A7': { frets: [null, 0, 2, 0, 2, 0], baseFret: 1 },   // standard shape: the artwork's had no 7th
  'Bb': { frets: [null, 1, 3, 3, 3, 1], baseFret: 1 },
  'Bbm': { frets: [null, 1, 3, 3, 2, 1], baseFret: 1 },
  'Bb7': { frets: [null, 1, 3, 1, 3, 1], baseFret: 1 },   // standard shape: the artwork's had no 7th
  'B': { frets: [null, 2, 4, 4, 4, 2], baseFret: 1 },
  'Bm': { frets: [null, 2, 4, 4, 3, 2], baseFret: 1 },
  'B7': { frets: [null, 2, 1, 2, 0, 2], baseFret: 1 },   // standard shape: the artwork's had no 7th
}
