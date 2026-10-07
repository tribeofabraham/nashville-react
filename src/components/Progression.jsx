import { chordName, display } from '../music/theory.js'
import NashvilleMark from './NashvilleMark.jsx'

// The whole progression written out in Nashville numbers and chord names, a column per chord so they line up.
export default function Progression({ keyRoot, chords }) {
  const number = (c) => (
    <>
      {c.flat ? '♭' : ''}{c.degree}<NashvilleMark quality={c.quality} />
    </>
  )
  const rows = [
    ['Nashville', 'nashville', number],
    ['Chords', 'names', (c) => display(chordName(keyRoot, c))],
  ]

  return (
    <section className="progression" aria-label="The progression">
      <table>
        <tbody>
          {rows.map(([label, cls, show]) => (
            <tr key={cls} className={cls}>
              <th scope="row">{label}</th>
              {chords.map((c, i) => <td key={i}>{show(c)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
