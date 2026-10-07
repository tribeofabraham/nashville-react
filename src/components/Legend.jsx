import { DEGREE_COLORS, display, MAJOR_SCALE, NOTES, ROLE_COLORS, ROLE_NAMES } from '../music/theory.js'

// What the colours mean, for the colouring in use.
export default function Legend({ scheme, keyRoot }) {
  const items = scheme === 'chord'
    ? ['R', '3', '5', '7', '2', '4', '6'].map((role) => ({        // the chord's own notes first, then the added ones
        color: ROLE_COLORS[role], mark: role === 'R' ? '1' : role === '2' ? '2/9' : role,
        text: role === '2' ? 'second / ninth' : ROLE_NAMES[role],
      }))
    : Object.entries(DEGREE_COLORS).map(([degree, color]) => ({
        color, mark: degree, text: display(NOTES[(keyRoot + MAJOR_SCALE[degree - 1]) % 12]),
      }))
  return (
    <ul className="legend" aria-label="What the colours mean">
      {items.map((it) => (
        <li key={it.mark}><span className="swatch" style={{ background: it.color }}>{it.mark}</span>{it.text}</li>
      ))}
    </ul>
  )
}
