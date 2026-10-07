import { guitarShape } from '../music/guitar.js'
import { chordTones, inKey, noteColor } from '../music/theory.js'

const TUNING = [4, 9, 2, 7, 11, 4] // E A D G B E, low to high
const GAP = 20 // between strings, and between frets

// One chord's shape: strings top to bottom on the page are frets, left to right low E to high e, as
// chord charts are read. Each dot is coloured and labelled by the chosen scheme.
export default function GuitarDiagram({ root, quality, scheme, keyRoot }) {
  const { frets, baseFret } = guitarShape(root, quality)
  const played = frets.filter((f) => f !== null && f > 0)
  const rows = Math.max(4, Math.max(...played, baseFret) - baseFret + 1)
  const tones = chordTones(root, quality)

  const width = GAP * 5
  const height = GAP * rows
  const x = (string) => string * GAP
  const label = (tone) => (scheme === 'chord' ? (tone.role === 'R' ? '1' : tone.role) : inKey(keyRoot, tone.pitch).label)

  return (
    <svg className="guitar" viewBox={`-26 -30 ${width + 52} ${height + 44}`} role="img"
         aria-label={`Guitar: ${describe(frets)}`}>
      {/* Frets and strings */}
      {Array.from({ length: rows + 1 }, (_, r) => (
        <line key={`f${r}`} x1={0} x2={width} y1={r * GAP} y2={r * GAP}
              className={r === 0 && baseFret === 1 ? 'nut' : 'fret'} />
      ))}
      {TUNING.map((_, s) => <line key={`s${s}`} x1={x(s)} x2={x(s)} y1={0} y2={height} className="string" />)}
      {baseFret > 1 && <text x={-10} y={GAP * 0.5} className="base-fret" textAnchor="end" dominantBaseline="central">{baseFret}</text>}

      {frets.map((fret, s) => {
        if (fret === null) {
          return <text key={s} x={x(s)} y={-14} className="muted" textAnchor="middle" dominantBaseline="central">✕</text>
        }
        const pitch = (TUNING[s] + fret) % 12
        const tone = tones.find((t) => t.pitch === pitch)
        const color = noteColor(scheme, tone, keyRoot)
        const open = fret === 0
        const cy = open ? -14 : (fret - baseFret + 0.5) * GAP
        return (
          <g key={s}>
            <circle cx={x(s)} cy={cy} r={open ? 7.5 : 8.6} fill={open ? 'none' : color}
                    stroke={open ? color : 'none'} strokeWidth={open ? 3 : 0} />
            {!open && <text x={x(s)} y={cy} className="dot-label" textAnchor="middle" dominantBaseline="central">{label(tone)}</text>}
          </g>
        )
      })}
    </svg>
  )
}

function describe(frets) {
  const names = ['low E', 'A', 'D', 'G', 'B', 'high E']
  return frets.map((f, s) => `${names[s]} ${f === null ? 'not played' : f === 0 ? 'open' : `fret ${f}`}`).join(', ')
}
