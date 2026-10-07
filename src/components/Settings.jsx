import { useEffect, useRef } from 'react'
import { DEGREE_COLORS, display, NOTES, ROLE_COLORS, ROLE_NAMES } from '../music/theory.js'
import Wheel from './Wheel.jsx'

const VIEWS = [['guitar', 'Guitar'], ['keys', 'Keys'], ['both', 'Both']]
const SCHEMES = [['chord', 'By chord'], ['key', 'By key']]

// The overlay: the wheel, the key, and how things are shown. A native dialog, so Esc closes it and
// keyboard focus stays inside while it's open.
export default function Settings({ open, onClose, keyRoot, onKey, used, view, onView, scheme, onScheme, scaling, onScaling }) {
  const dialog = useRef(null)
  useEffect(() => {
    const d = dialog.current
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog ref={dialog} className="settings" onClose={onClose} aria-labelledby="settings-title"
            onClick={(e) => { if (e.target === dialog.current) onClose() }}>
      <div className="settings-body">
        <header className="settings-head">
          <h2 id="settings-title">Key &amp; settings</h2>
          <button type="button" className="close" onClick={onClose} aria-label="Close settings">✕</button>
        </header>

        <Wheel keyRoot={keyRoot} used={used} onKey={onKey} />

        <div className="settings-row">
          <label htmlFor="key-select">Key</label>
          <select id="key-select" value={keyRoot} onChange={(e) => onKey(Number(e.target.value))}>
            {NOTES.map((n, i) => <option key={n} value={i}>{display(n)}</option>)}
          </select>
          <div className="segmented" role="group" aria-label="Transpose">
            <button type="button" onClick={() => onKey((keyRoot + 11) % 12)} aria-label="Transpose down a half step">−</button>
            <button type="button" onClick={() => onKey((keyRoot + 1) % 12)} aria-label="Transpose up a half step">+</button>
          </div>
        </div>

        <div className="settings-row">
          <span id="view-label">Show</span>
          <Choice label="view-label" options={VIEWS} value={view} onChange={onView} />
        </div>

        <div className="settings-row">
          <span id="scheme-label">Colour</span>
          <Choice label="scheme-label" options={SCHEMES} value={scheme} onChange={onScheme} />
        </div>

        <div className="settings-row">
          <span>Size</span>
          <button type="button" className="toggle scale-toggle" aria-pressed={scaling === 'fluid'}
                  onClick={() => onScaling(scaling === 'fluid' ? 'fixed' : 'fluid')}>
            Auto-scale text
          </button>
        </div>

        <ul className="legend" aria-label="What the colours mean">
          {scheme === 'chord'
            ? Object.entries(ROLE_COLORS).filter(([role]) => role !== '9').map(([role, color]) => (
                <li key={role}><span className="swatch" style={{ background: color }}>{role === 'R' ? '1' : role === '2' ? '2/9' : role}</span>
                  {role === '2' ? 'second / ninth' : ROLE_NAMES[role]}</li>
              ))
            : Object.entries(DEGREE_COLORS).map(([degree, color]) => (
                <li key={degree}><span className="swatch" style={{ background: color }}>{degree}</span>{display(NOTES[(keyRoot + [0, 2, 4, 5, 7, 9, 11][degree - 1]) % 12])}</li>
              ))}
        </ul>
      </div>
    </dialog>
  )
}

export function Choice({ label, options, value, onChange }) {
  return (
    <div className="segmented" role="group" aria-labelledby={label}>
      {options.map(([v, text]) => (
        <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)}>{text}</button>
      ))}
    </div>
  )
}
