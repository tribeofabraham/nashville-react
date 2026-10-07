import { chordTones, inKey, noteColor, NOTES, display } from '../music/theory.js'

const WHITE = [0, 2, 4, 5, 7, 9, 11]
const BLACK_LEFT = { 1: 0.62, 3: 1.72, 6: 3.6, 8: 4.68, 10: 5.76 } // where each black key sits, in white keys
const W = 20 // white key width
const H = 76
const BW = 12
const BH = 48

// Two octaves from C, with every key that's a note of the chord coloured and labelled.
export default function Keyboard({ root, quality, scheme, keyRoot }) {
  const tones = chordTones(root, quality)
  const lit = new Map()
  for (let n = 0; n < 24; n++) {
    const tone = tones.find((t) => t.pitch === n % 12)
    if (tone) lit.set(n, tone)
  }
  const label = (tone) => (scheme === 'chord' ? (tone.role === 'R' ? '1' : tone.role) : inKey(keyRoot, tone.pitch).label)

  const whites = []
  const blacks = []
  for (let octave = 0; octave < 2; octave++) {
    WHITE.forEach((pc, i) => whites.push({ n: octave * 12 + pc, x: (octave * 7 + i) * W }))
    Object.entries(BLACK_LEFT).forEach(([pc, pos]) => blacks.push({ n: octave * 12 + Number(pc), x: (octave * 7 + pos) * W }))
  }

  const key = ({ n, x }, black) => {
    const tone = lit.get(n)
    const color = tone && noteColor(scheme, tone, keyRoot)
    const w = black ? BW : W
    const h = black ? BH : H
    return (
      <g key={n}>
        <rect x={x} y={0} width={w} height={h} rx={black ? 2 : 3}
              className={black ? 'key black' : 'key white'} style={color ? { fill: color } : undefined} />
        {tone && (
          <text x={x + w / 2} y={h - (black ? 9 : 12)} className="key-label" textAnchor="middle" dominantBaseline="central">
            {label(tone)}
          </text>
        )}
      </g>
    )
  }

  const names = tones.map((t) => display(NOTES[t.pitch])).join(' ')
  return (
    <svg className="keys" viewBox={`-2 -2 ${14 * W + 4} ${H + 4}`} role="img" aria-label={`Keyboard: ${names}`}>
      {whites.map((k) => key(k, false))}
      {blacks.map((k) => key(k, true))}
    </svg>
  )
}
