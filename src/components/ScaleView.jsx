import { textOnDark } from '../music/contrast.js'
import { display, NOTES, SCALES, scaleNotes } from '../music/theory.js'
import Fretboard from './Fretboard.jsx'
import { Piano } from './Keyboard.jsx'

// The key's scale on the whole neck and on the keys, every note labelled by its degree.
export default function ScaleView({ keyRoot, type, view }) {
  const notes = scaleNotes(keyRoot, type)
  const marks = new Map(notes.map((n, i) => [n.pitch, { color: n.color, label: n.degree, root: i === 0 }]))
  const name = `${display(NOTES[keyRoot])} ${SCALES[type].label.toLowerCase()} scale`
  const spelled = notes.map((n) => n.name).join(' ')

  return (
    <section className="scale-card" aria-label={`${name}: ${spelled}`}>
      <h2 className="scale-name">{name}</h2>
      {view !== 'keys' && <Fretboard marks={marks} label={`${name} on the guitar neck, open strings to the 12th fret`} />}
      {view !== 'guitar' && <Piano marks={marks} label={`${name} on the keys: ${spelled}`} />}
    </section>
  )
}

// The scale written out for the info rows: its degrees and its notes, a column each.
export function ScaleLine({ keyRoot, type }) {
  const notes = scaleNotes(keyRoot, type)
  return (
    <section className="progression" aria-label="The scale">
      <table>
        <tbody>
          <tr className="nashville">
            <th scope="row">Degree</th>
            {notes.map((n) => <td key={n.degree} style={{ color: textOnDark(n.color) }}>{n.degree}</td>)}
          </tr>
          <tr className="names">
            <th scope="row">Notes</th>
            {notes.map((n) => <td key={n.degree}>{n.name}</td>)}
          </tr>
        </tbody>
      </table>
    </section>
  )
}
