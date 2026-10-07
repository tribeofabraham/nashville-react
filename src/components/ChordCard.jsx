import { chordName, chordRoot, display, nashville, nashvilleSpoken } from '../music/theory.js'
import GuitarDiagram from './GuitarDiagram.jsx'
import Keyboard from './Keyboard.jsx'

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

  return (
    <article className="card" aria-label={`Chord ${n}: ${display(name)}, ${nashvilleSpoken(chord)}`}>
      <header className="card-head">
        <span className="chord-name">{display(name)}</span>
        <span className="chord-number" aria-hidden="true">
          {nashville({ ...chord, quality: chord.quality === '7' ? '' : chord.quality })}
          {chord.quality === '7' && <sup>7</sup>}
        </span>
      </header>

      <div className={`instruments ${view}`}>
        {view !== 'keys' && <GuitarDiagram root={root} quality={chord.quality} name={name} scheme={scheme} keyRoot={keyRoot} />}
        {view !== 'guitar' && <Keyboard root={root} quality={chord.quality} scheme={scheme} keyRoot={keyRoot} />}
      </div>

      {editing && <div className="card-controls">
        <label className="visually-hidden" htmlFor={`degree-${n}`}>Chord {n} number</label>
        <select id={`degree-${n}`} value={chord.degree} onChange={(e) => set({ degree: Number(e.target.value) })}>
          {[1, 2, 3, 4, 5, 6, 7].map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <button type="button" className="toggle" aria-pressed={chord.flat} aria-label={`Chord ${n} flat`}
                onClick={() => set({ flat: !chord.flat })}>♭</button>
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
