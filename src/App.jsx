import { useEffect, useMemo, useState } from 'react'
import ChordCard from './components/ChordCard.jsx'
import Settings, { Choice } from './components/Settings.jsx'
import { fromSongMessage, MAX_CHORDS, START } from './music/progression.js'
import { chordName, display, MAJOR_SCALE, NOTES } from './music/theory.js'
import { usePersisted } from './usePersisted.js'

const VIEWS = [['guitar', 'Guitar'], ['keys', 'Keys'], ['both', 'Both']]

export default function App() {
  const [keyRoot, setKey] = useState(START.key)
  const [chords, setChords] = useState(START.chords)
  const [view, setView] = usePersisted('view', 'both', ['guitar', 'keys', 'both'])
  const [scheme, setScheme] = usePersisted('scheme', 'chord', ['chord', 'key'])
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [editing, setEditing] = useState(false) // play mode by default: just the chords, as big as they go

  // Other Tribe of Abraham tools can load a song, as they could into the original.
  useEffect(() => {
    const onMessage = (e) => {
      const song = fromSongMessage(e.data)
      if (song) {
        setKey(song.key)
        setChords(song.chords)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  // Steps of the wheel the progression uses, to ring them there.
  const used = useMemo(() => new Set(chords.map((c) => (MAJOR_SCALE[c.degree - 1] - (c.flat ? 1 : 0) + 12) % 12)), [chords])

  const change = (i, chord) => setChords((cs) => cs.map((c, j) => (j === i ? chord : c)))
  const remove = (i) => setChords((cs) => cs.filter((_, j) => j !== i))
  const add = () => setChords((cs) => [...cs, { degree: 1, flat: false, quality: '' }])

  // One row up to four chords, two rows after that.
  const rows = chords.length > 4 ? 2 : 1
  const cols = Math.ceil(chords.length / rows)

  const summary = `Key of ${display(NOTES[keyRoot])}: ${chords.map((c) => display(chordName(keyRoot, c))).join(', ')}`

  return (
    <div className="app">
      <header className="bar">
        <h1 className="title">Nashville <span>Notation</span></h1>
        <button type="button" className="key-button" onClick={() => setSettingsOpen(true)}
                aria-label={`Key of ${display(NOTES[keyRoot])}. Open the key wheel and settings`}>
          <span className="key-label">Key</span>
          <span className="key-name">{display(NOTES[keyRoot])}</span>
        </button>
        <div className="segmented" role="group" aria-label="Transpose">
          <button type="button" onClick={() => setKey((k) => (k + 11) % 12)} aria-label="Transpose down a half step">−</button>
          <button type="button" onClick={() => setKey((k) => (k + 1) % 12)} aria-label="Transpose up a half step">+</button>
        </div>
        <span id="bar-view" className="visually-hidden">Show</span>
        <Choice label="bar-view" options={VIEWS} value={view} onChange={setView} />
        <button type="button" className="edit" aria-pressed={editing} onClick={() => setEditing((e) => !e)}>
          {editing ? 'Done' : 'Edit chords'}
        </button>
        {editing && (
          <button type="button" className="add" onClick={add} disabled={chords.length >= MAX_CHORDS}
                  aria-label={chords.length >= MAX_CHORDS ? `Add chord (${MAX_CHORDS} is the most)` : 'Add chord'}>+ Chord</button>
        )}
        <button type="button" className="settings-button" onClick={() => setSettingsOpen(true)}>Settings</button>
      </header>

      <p className="visually-hidden" aria-live="polite">{summary}</p>

      <main className="grid" style={{ '--cols': cols, '--rows': rows }}>
        {chords.map((chord, i) => (
          <ChordCard key={i} index={i} chord={chord} keyRoot={keyRoot} view={view} scheme={scheme} editing={editing}
                     onChange={(c) => change(i, c)} onRemove={() => remove(i)} canRemove={chords.length > 1} />
        ))}
      </main>

      <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} keyRoot={keyRoot} onKey={setKey} used={used}
                view={view} onView={setView} scheme={scheme} onScheme={setScheme} />
    </div>
  )
}
