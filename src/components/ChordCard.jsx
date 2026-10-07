import { chordName, chordRoot, display, nashvilleSpoken, roman } from '../music/theory.js'
import GuitarDiagram from './GuitarDiagram.jsx'
import Keyboard from './Keyboard.jsx'

// The number, flats included, chromatically: what the dropdown on each card offers.
const NUMBERS = [
  [1, false], [2, true], [2, false], [3, true], [3, false], [4, false],
  [5, true], [5, false], [6, true], [6, false], [7, true], [7, false],
].map(([degree, flat]) => ({ value: `${flat ? 'b' : ''}${degree}`, label: `${flat ? '♭' : ''}${degree}`, degree, flat }))

const QUALITIES = [
  { value: '', label: 'Maj', spoken: 'major' },
  { value: 'm', label: 'm', spoken: 'minor' },
  { value: '7', label: '7', spoken: 'seven' },
]

// One chord of the progression: its name big, its Nashville number, the instrument(s), and its controls.
export default function ChordCard({ index, chord, keyRoot, view, scheme, editing, onChange, onRemove, canRemove }) {
  const root = chordRoot(keyRoot, chord)
  const name = chordName(keyRoot, chord)
  const set = (change) => onChange({ ...chord, ...change })
  const n = index + 1
  const r = roman(chord)

  return (
    <article className="card" aria-label={`Chord ${n}: ${display(name)}, ${nashvilleSpoken(chord)}`}>
      {/* Three ways to write the chord: its name, its Nashville number (pick another here), its Roman numeral */}
      <header className="card-head">
        <span className="chord-name">{display(name)}</span>
        <span className="chord-ids">
          <span className="chord-number">
            <label className="visually-hidden" htmlFor={`number-${n}`}>Chord {n} number</label>
            <select id={`number-${n}`} value={`${chord.flat ? 'b' : ''}${chord.degree}`}
                    onChange={(e) => {
                      const pick = NUMBERS.find((x) => x.value === e.target.value)
                      set({ degree: pick.degree, flat: pick.flat })
                    }}>
              {NUMBERS.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}
            </select>
            {chord.quality === 'm' && <span aria-hidden="true">m</span>}
            {chord.quality === '7' && <sup aria-hidden="true">7</sup>}
          </span>
          <span className="chord-roman" aria-hidden="true">
            {r.numeral}{r.seven && <sup>7</sup>}
          </span>
        </span>
      </header>

      <div className={`instruments ${view}`}>
        {view !== 'keys' && <GuitarDiagram root={root} quality={chord.quality} name={name} scheme={scheme} keyRoot={keyRoot} />}
        {view !== 'guitar' && <Keyboard root={root} quality={chord.quality} scheme={scheme} keyRoot={keyRoot} />}
      </div>

      {editing && <div className="card-controls">
        <div className="segmented" role="group" aria-label={`Chord ${n} quality`}>
          {QUALITIES.map((q) => (
            <button key={q.value} type="button" aria-pressed={chord.quality === q.value} aria-label={q.spoken}
                    onClick={() => set({ quality: q.value })}>{q.label}</button>
          ))}
        </div>
        {canRemove && (
          <button type="button" className="remove" aria-label={`Remove chord ${n}`} onClick={onRemove}>✕</button>
        )}
      </div>}
    </article>
  )
}
