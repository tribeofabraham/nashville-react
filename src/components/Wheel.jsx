import { useRef } from 'react'
import { labelOn, textOnDark } from '../music/contrast.js'
import { DEGREE_COLORS, display, MAJOR_SCALE, NOTES, OUTSIDE_COLOR } from '../music/theory.js'

// The Nashville numbers around the inside, one per semitone, 1 at the top.
const NUMBERS = ['1', '♭2', '2', '♭3', '3', '4', '♭5', '5', '♭6', '6', '♭7', '7']

// Sized so nothing touches: the number discs (r 10.8 at 46) clear the dividers either side (11.9 away)
// and to the hub and mid rings; the note discs (r 15 at 82) sit inside the outer ring with room between.
const R_OUTER = 100
const R_NOTE = 82
const R_MID = 64
const R_NUMBER = 46
const R_HUB = 28
const R_USED = 10.8
const R_KEY = 15

// Divider strokes between the slices: halfway between one step and the next.
const divider = (step, r1, r2) => {
  const [x1, y1] = at(step + 0.5, r1)
  const [x2, y2] = at(step + 0.5, r2)
  return <line key={step} x1={x1} y1={y1} x2={x2} y2={y2} className="divider" />
}

const at = (step, r) => {
  const a = ((step * 30 - 90) * Math.PI) / 180
  return [Math.cos(a) * r, Math.sin(a) * r]
}

// The keys turn around the numbers: the key you're in sits at the top, over 1.
// Pick a note on the outer ring to change key (mouse only: the Key dropdown is the keyboard's way).
export default function Wheel({ keyRoot, used, onKey }) {
  // Keep turning the short way round, so B to C is one step, not eleven back.
  const turn = useRef({ key: keyRoot, deg: -keyRoot * 30 })
  if (turn.current.key !== keyRoot) {
    const step = ((keyRoot - turn.current.key + 18) % 12) - 6
    turn.current = { key: keyRoot, deg: turn.current.deg - step * 30 }
  }
  const deg = turn.current.deg
  const keyName = display(NOTES[keyRoot])

  return (
    <svg className="wheel" viewBox="-103 -103 206 206" role="group" aria-label="Key wheel">
      <circle r={R_OUTER} className="wheel-outer" />
      <circle r={R_MID} className="wheel-inner" />
      {NUMBERS.map((_, step) => divider(step, R_HUB, R_MID))}

      {/* Numbers: fixed. Each in its colour; those in the progression (or scale) filled with it. */}
      {NUMBERS.map((label, step) => {
        const [x, y] = at(step, R_NUMBER)
        const degree = MAJOR_SCALE.indexOf(step)
        const color = degree >= 0 ? DEGREE_COLORS[degree + 1] : OUTSIDE_COLOR
        const on = used.has(step)
        return (
          <g key={label}>
            {on && <circle cx={x} cy={y} r={R_USED} className="number-used" style={{ fill: color }} />}
            <text x={x} y={y} className={on ? 'wheel-number on' : 'wheel-number'} textAnchor="middle" dominantBaseline="central"
                  style={{ fill: on ? labelOn(color) : textOnDark(color) }}>
              {label}
            </text>
          </g>
        )
      })}

      {/* Notes: turning. Each label turns back so it stays upright. */}
      <g className="wheel-notes" style={{ transform: `rotate(${deg}deg)` }}>
        {NOTES.map((_, i) => divider(i, R_MID, R_OUTER))}
        {NOTES.map((note, i) => {
          const [x, y] = at(i, R_NOTE)
          const current = i === keyRoot
          return (
            <g key={note} className="wheel-note" role="button" tabIndex={-1}
               aria-label={`Key of ${display(note)}`} aria-pressed={current} onClick={() => onKey(i)}>
              <circle cx={x} cy={y} r={R_KEY} className={current ? 'note-hit current' : 'note-hit'} />
              <text x={x} y={y} className={current ? 'wheel-note-label current' : 'wheel-note-label'}
                    textAnchor="middle" dominantBaseline="central"
                    style={{ transform: `rotate(${-deg}deg)`, transformOrigin: `${x}px ${y}px` }}>
                {display(note)}
              </text>
            </g>
          )
        })}
      </g>
      <path d="M -6 -103 L 6 -103 L 0 -99 Z" className="wheel-pointer" />

      {/* The hub: the key you're in */}
      <circle r={R_HUB - 1} className="wheel-hub" />
      <text key={keyName} className="wheel-hub-label" textAnchor="middle" dominantBaseline="central" aria-hidden="true">{keyName}</text>
    </svg>
  )
}
