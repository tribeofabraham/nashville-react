import { useRef } from 'react'
import { DEGREE_COLORS, display, MAJOR_SCALE, NOTES, OUTSIDE_COLOR } from '../music/theory.js'

// The Nashville numbers around the inside, one per semitone, 1 at the top.
const NUMBERS = ['1', '♭2', '2', '♭3', '3', '4', '♭5', '5', '♭6', '6', '♭7', '7']

const R_OUTER = 100
const R_NOTE = 82
const R_MID = 64
const R_NUMBER = 46

const at = (step, r) => {
  const a = ((step * 30 - 90) * Math.PI) / 180
  return [Math.cos(a) * r, Math.sin(a) * r]
}

// The keys turn around the numbers: the key you're in sits at the top, over 1.
// Pick a note on the outer ring to change key.
// outline: the small version on the main screen, drawn as outlines rather than filled rings.
export default function Wheel({ keyRoot, used, onKey, outline = false }) {
  // Keep turning the short way round, so B to C is one step, not eleven back.
  const turn = useRef({ key: keyRoot, deg: -keyRoot * 30 })
  if (turn.current.key !== keyRoot) {
    const step = ((keyRoot - turn.current.key + 18) % 12) - 6
    turn.current = { key: keyRoot, deg: turn.current.deg - step * 30 }
  }
  const deg = turn.current.deg

  return (
    <svg className={outline ? 'wheel outline' : 'wheel'} viewBox="-104 -104 208 208" role="group" aria-label="Key wheel">
      <circle r={R_OUTER} className="wheel-outer" />
      <circle r={R_MID} className="wheel-inner" />

      {/* Numbers: fixed. Diatonic ones in their colour; those in the progression ringed. */}
      {NUMBERS.map((label, step) => {
        const [x, y] = at(step, R_NUMBER)
        const degree = MAJOR_SCALE.indexOf(step)
        return (
          <g key={label}>
            {used.has(step) && <circle cx={x} cy={y} r={11} className="number-used" />}
            <text x={x} y={y} className="wheel-number" textAnchor="middle" dominantBaseline="central"
                  style={{ fill: degree >= 0 ? DEGREE_COLORS[degree + 1] : OUTSIDE_COLOR }}>
              {label}
            </text>
          </g>
        )
      })}

      {/* Notes: turning. Each label turns back so it stays upright. */}
      <g className="wheel-notes" style={{ transform: `rotate(${deg}deg)` }}>
        {NOTES.map((note, i) => {
          const [x, y] = at(i, R_NOTE)
          const current = i === keyRoot
          return (
            <g key={note} className="wheel-note" role="button" tabIndex={-1} onClick={() => onKey(i)}
               aria-label={`Key of ${display(note)}`}>
              <circle cx={x} cy={y} r={14} className={current ? 'note-hit current' : 'note-hit'} />
              <text x={x} y={y} className="wheel-note-label" textAnchor="middle" dominantBaseline="central"
                    style={{ transform: `rotate(${-deg}deg)`, transformOrigin: `${x}px ${y}px` }}>
                {display(note)}
              </text>
            </g>
          )
        })}
      </g>
      <path d="M -7 -104 L 7 -104 L 0 -94 Z" className="wheel-pointer" />
    </svg>
  )
}
