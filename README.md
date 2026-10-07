# Nashville Notation (React)

A clean-slate React version of the Tribe of Abraham Nashville Notation wheel: pick a key, build a
progression in Nashville numbers, and see each chord on guitar, keys, or both, big and bold.

Notes are coloured two ways, from the original's artwork:

- **By chord**: each note's role in the chord. Root red, 3rd blue, 5th green, 7th orange.
- **By key**: each note's place in the key, 1 to 7. In D, a G chord shows as 4, 6 and 1.

## Where things are

- `src/music/theory.js`: keys, Nashville numbers, chord tones and both colourings. No React.
- `src/music/guitar.js`: the 36 guitar shapes, read from the original app's chord artwork and
  checked note by note (six 7th chords there had no 7th; they use standard shapes here).
- `npm test` proves the music: chord names, transposing, colours, and that every guitar shape plays
  only its chord's tones, and all of them.

The original jQuery version lives on in the `nashville-notation` repo, at tribeofabraham.com/notation/.
