// A row of buttons, one of them pressed: Guitar / Keys / Both, By chord / By key.
export default function Choice({ label, options, value, onChange }) {
  return (
    <div className="segmented" role="group" aria-labelledby={label}>
      {options.map(([v, text]) => (
        <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)}>{text}</button>
      ))}
    </div>
  )
}
