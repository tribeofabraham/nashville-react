import { QUALITIES } from '../music/theory.js'

// The chord-type part of a Nashville number, after the number: "m", a raised "7", "maj7", "sus4", "°".
export default function NashvilleMark({ quality }) {
  const { text, sup } = QUALITIES[quality].mark
  return (
    <>
      {text && <span className="mark">{text}</span>}
      {sup && <sup>{sup}</sup>}
    </>
  )
}
