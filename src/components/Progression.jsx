import { chordName, display, roman } from '../music/theory.js'

// The whole progression written out, three ways, one column per chord so they line up.
export default function Progression({ keyRoot, chords }) {
  const number = (c) => (
    <>
      {c.flat ? '♭' : ''}{c.degree}{c.quality === 'm' ? 'm' : ''}{c.quality === '7' && <sup>7</sup>}
    </>
  )
  const numeral = (c) => {
    const r = roman(c)
    return <>{r.numeral}{r.seven && <sup>7</sup>}</>
  }
  const rows = [
    ['Nashville', 'nashville', number],
    ['Roman', 'roman', numeral],
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
