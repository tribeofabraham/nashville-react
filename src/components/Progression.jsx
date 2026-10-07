import { fromNumberValue, NUMBERS, numberValue } from '../music/progression.js'
import { chordName, chordRoot, QUALITIES, spellInKey } from '../music/theory.js'
import NashvilleMark from './NashvilleMark.jsx'

// The whole progression written out in Nashville numbers and chord names, a column per chord so they
// line up. Both are dropdowns too, the same as on the cards: the number picks another number, the
// name picks another chord type on that root. Each dropdown sits invisibly over its text, so the text
// keeps its look (superscripts and all).
export default function Progression({ keyRoot, chords, onChange }) {
  return (
    <section className="progression" aria-label="The progression">
      <table>
        <tbody>
          <tr className="nashville">
            <th scope="row">Nashville</th>
            {chords.map((c, i) => (
              <td key={i}>
                <span className="pick">
                  <span aria-hidden="true">{c.flat ? '♭' : ''}{c.degree}<NashvilleMark quality={c.quality} /></span>
                  <select aria-label={`Chord ${i + 1} number`} value={numberValue(c)}
                          onChange={(e) => onChange(i, { ...c, ...fromNumberValue(e.target.value) })}>
                    {NUMBERS.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}
                  </select>
                </span>
              </td>
            ))}
          </tr>
          <tr className="names">
            <th scope="row">Chords</th>
            {chords.map((c, i) => {
              const root = spellInKey(keyRoot, c.degree, chordRoot(keyRoot, c))
              return (
                <td key={i}>
                  <span className="pick">
                    <span aria-hidden="true">{chordName(keyRoot, c)}</span>
                    <select aria-label={`Chord ${i + 1}: ${chordName(keyRoot, c)}. Chord type`} value={c.quality}
                            onChange={(e) => onChange(i, { ...c, quality: e.target.value })}>
                      {Object.keys(QUALITIES).map((q) => <option key={q} value={q}>{root + q}</option>)}
                    </select>
                  </span>
                </td>
              )
            })}
          </tr>
        </tbody>
      </table>
    </section>
  )
}
