const TUNING = [4, 9, 2, 7, 11, 4] // E A D G B E, low to high
const FRETS = 12
const FRET_W = 34
const STRING_GAP = 18
const MARKERS = [3, 5, 7, 9]

// The neck from the open strings to the 12th fret, high e on top as tab reads, with every note in
// marks (pitch 0-11 -> { color, label, root }) shown where it falls. Roots get a ring.
export default function Fretboard({ marks, label }) {
  const width = FRETS * FRET_W
  const height = STRING_GAP * 5
  const y = (string) => (5 - string) * STRING_GAP // string 0 = low E, drawn at the bottom
  const x = (fret) => (fret === 0 ? -FRET_W * 0.45 : (fret - 0.5) * FRET_W)

  return (
    <svg className="fretboard" viewBox={`${-FRET_W} -14 ${width + FRET_W + 12} ${height + 40}`} role="img" aria-label={label}>
      {MARKERS.map((f) => <circle key={f} cx={x(f)} cy={height / 2} r={4} className="inlay" />)}
      <circle cx={x(12)} cy={STRING_GAP * 1.5} r={4} className="inlay" />
      <circle cx={x(12)} cy={STRING_GAP * 3.5} r={4} className="inlay" />

      <line x1={0} x2={0} y1={0} y2={height} className="nut" />
      {Array.from({ length: FRETS }, (_, f) => (
        <line key={f} x1={(f + 1) * FRET_W} x2={(f + 1) * FRET_W} y1={0} y2={height} className="fret" />
      ))}
      {TUNING.map((_, s) => <line key={s} x1={-FRET_W * 0.15} x2={width} y1={y(s)} y2={y(s)} className="string" />)}

      {[3, 5, 7, 9, 12].map((f) => (
        <text key={f} x={x(f)} y={height + 22} className="fret-number" textAnchor="middle">{f}</text>
      ))}

      {TUNING.flatMap((open, s) =>
        Array.from({ length: FRETS + 1 }, (_, fret) => {
          const mark = marks.get((open + fret) % 12)
          if (!mark) return null
          return (
            <g key={`${s}-${fret}`}>
              {mark.root && <circle cx={x(fret)} cy={y(s)} r={10.5} className="root-ring" style={{ stroke: mark.color }} />}
              <circle cx={x(fret)} cy={y(s)} r={8} fill={mark.color} />
              <text x={x(fret)} y={y(s)} className="dot-label" textAnchor="middle" dominantBaseline="central">{mark.label}</text>
            </g>
          )
        }),
      )}
    </svg>
  )
}
