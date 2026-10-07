import { labelOn } from '../music/contrast.js'
import { BASS_TUNING, bassBox } from '../music/guitar.js'
import { chordTones, inKey, noteColor } from '../music/theory.js'

const GAP = 20

// A chord on bass, the way a beginner learns it: a box around the chord's root on the E or A string,
// every chord tone in it marked (an arpeggio, not a strummed shape), the roots ringed. Drawn like the
// guitar diagrams: strings left to right E A D G, frets down the page.
export default function BassDiagram({ root, quality, scheme, keyRoot }) {
  const { firstFret, lastFret } = bassBox(root)
  const tones = chordTones(root, quality)
  const open = firstFret === 0
  const top = open ? 1 : firstFret // first fret row drawn below the nut / top line
  const rows = lastFret - top + 1
  const width = GAP * 3
  const height = GAP * rows
  const x = (string) => string * GAP
  const label = (tone) => (scheme === 'chord' ? (tone.role === 'R' ? '1' : tone.role) : inKey(keyRoot, tone.pitch).label)

  const notes = []
  BASS_TUNING.forEach((tuning, s) => {
    for (let fret = firstFret; fret <= lastFret; fret++) {
      const tone = tones.find((t) => t.pitch === (tuning + fret) % 12)
      if (tone) notes.push({ s, fret, tone })
    }
  })

  return (
    <svg className="guitar bass" viewBox={`-26 -30 ${width + 52} ${height + 44}`} role="img"
         aria-label={`Bass: ${notes.map((n) => `${['E', 'A', 'D', 'G'][n.s]} string ${n.fret === 0 ? 'open' : `fret ${n.fret}`}`).join(', ')}`}>
      {Array.from({ length: rows + 1 }, (_, r) => (
        <line key={`f${r}`} x1={0} x2={width} y1={r * GAP} y2={r * GAP} className={r === 0 && open ? 'nut' : 'fret'} />
      ))}
      {BASS_TUNING.map((_, s) => <line key={`s${s}`} x1={x(s)} x2={x(s)} y1={0} y2={height} className="string bass-string" />)}
      {!open && <text x={-10} y={GAP * 0.5} className="base-fret" textAnchor="end" dominantBaseline="central">{top}</text>}

      {notes.map(({ s, fret, tone }) => {
        const color = noteColor(scheme, tone, keyRoot)
        const cy = fret === 0 ? -14 : (fret - top + 0.5) * GAP
        const isRoot = tone.role === 'R'
        return (
          <g key={`${s}-${fret}`}>
            {isRoot && <circle cx={x(s)} cy={cy} r={11} className="root-ring" style={{ stroke: color }} />}
            <circle cx={x(s)} cy={cy} r={8.4} fill={color} />
            <text x={x(s)} y={cy} className="dot-label" textAnchor="middle" dominantBaseline="central"
                  style={{ fill: labelOn(color) }}>{label(tone)}</text>
          </g>
        )
      })}
    </svg>
  )
}
