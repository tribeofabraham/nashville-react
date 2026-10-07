import { chordName, chordRoot, display, nashvilleSpoken, QUALITIES } from '../music/theory.js'
import NashvilleMark from './NashvilleMark.jsx'
import GuitarDiagram from './GuitarDiagram.jsx'
import Keyboard from './Keyboard.jsx'

// The number, flats included, chromatically: what the dropdown on each card offers.
const NUMBERS = [
  [1, false], [2, true], [2, false], [3, true], [3, false], [4, false],
  [5, true], [5, false], [6, true], [6, false], [7, true], [7, false],
].map(([degree, flat]) => ({ value: `${flat ? 'b' : ''}${degree}`, label: `${flat ? '♭' : ''}${degree}`, degree, flat }))


// One chord of the progression: its name big, its Nashville number, the instrument(s), and its controls.
export default function ChordCard({ index, chord, keyRoot, view, scheme, onChange, onRemove, canRemove }) {
  const root = chordRoot(keyRoot, chord)
  const name = chordName(keyRoot, chord)
  const set = (change) => onChange({ ...chord, ...change })
  const n = index + 1

  return (
    <article className="card" aria-label={`Chord ${n}: ${display(name)}, ${nashvilleSpoken(chord)}`}>
      {/* The chord's name and its Nashville number side by side; pick another number or chord type below */}
      {canRemove && (
        <button type="button" className="remove" onClick={onRemove} aria-label={`Remove chord ${n}`}>✕</button>
      )}
      <header className="card-head">
        <span className="chord-name">{display(name)}</span>
        <span className="chord-number">
          <label className="visually-hidden" htmlFor={`number-${n}`}>Chord {n} number</label>
          <select id={`number-${n}`} value={`${chord.flat ? 'b' : ''}${chord.degree}`}
                  onChange={(e) => {
                    const pick = NUMBERS.find((x) => x.value === e.target.value)
                    set({ degree: pick.degree, flat: pick.flat })
                  }}>
            {NUMBERS.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}
          </select>
          <span aria-hidden="true"><NashvilleMark quality={chord.quality} /></span>
        </span>
      </header>
      <label className="visually-hidden" htmlFor={`type-${n}`}>Chord {n} type</label>
      <select id={`type-${n}`} className="chord-type" value={chord.quality} onChange={(e) => set({ quality: e.target.value })}>
        {Object.entries(QUALITIES).map(([value, q]) => <option key={value} value={value}>{q.label}</option>)}
      </select>

      <div className={`instruments ${view}`}>
        {view !== 'keys' && <GuitarDiagram root={root} quality={chord.quality} scheme={scheme} keyRoot={keyRoot} />}
        {view !== 'guitar' && <Keyboard root={root} quality={chord.quality} scheme={scheme} keyRoot={keyRoot} />}
      </div>


    </article>
  )
}
