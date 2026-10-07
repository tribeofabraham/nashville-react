# Nashville Notation (React)

A clean-slate React version of the Tribe of Abraham Nashville Notation wheel: pick a key, build a
progression in Nashville numbers, and see each chord on guitar, keys, or both, big and bold.

Notes are coloured two ways, from the original's artwork:

- **By chord**: each note's role in the chord. Root red, 3rd blue, 5th green, 7th orange.
- **By key**: each note's place in the key, 1 to 7. In D, a G chord shows as 4, 6 and 1.

## Where things are

- `src/music/theory.js`: keys, Nashville numbers, chord tones and both colourings. No React.
- `src/music/guitar.js`: guitar shapes for ten chord types in all twelve keys (major, minor, 7th,
  maj7, m7, sus2, sus4, add9, 6th, diminished). Major, minor and 7th are the original app's 36,
  read from its chord artwork and checked note by note (six 7th chords there had no 7th and Am
  strummed the low E; those use standard shapes here). The rest are the standard open shapes
  beginners learn, and the two movable barre forms for every other key.
- `npm test` proves the music: chord names, transposing, colours, and that all 120 guitar shapes
  play only their chord's notes, all the ones that matter, with the root lowest.

The original jQuery version lives on in the `nashville-notation` repo, at tribeofabraham.com/notation/.
