import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import ChordCard from './components/ChordCard.jsx'
import Progression from './components/Progression.jsx'
import Settings, { Choice } from './components/Settings.jsx'
import { fromSongMessage, MAX_CHORDS, START } from './music/progression.js'
import { chordName, display, MAJOR_SCALE, NOTES } from './music/theory.js'
import { usePersisted } from './usePersisted.js'
import { useSizer } from './sizer.js'

const VIEWS = [['guitar', 'Guitar'], ['keys', 'Keys'], ['both', 'Both']]

// The sizer (as on the xAPI login): the whole app is in em, scaled to fill the window, width and height.
// Its design size is the content's own (useContentSize below), so the chords grow until they fill the
// screen, however many there are and whichever view. Phones (under 34em wide) keep their own layout.
const SIZER = { fitHeight: true, minScale: 0.5, maxScale: 4 }
const MARGIN_EM = 1.5 // room kept around the content when it's scaled to fit

// The content's size at 1em: the progression and cards, plus the bar above them. It's all in em, so this
// doesn't change as the sizer scales it, and measuring it can't feed back into the scale.
function useContentSize(blockRef, barRef) {
  const [size, setSize] = useState({ width: 1600, height: 900 })
  useLayoutEffect(() => {
    const block = blockRef.current
    const bar = barRef.current
    if (!block || !bar) return
    const measure = () => {
      const em = parseFloat(getComputedStyle(block).fontSize)
      const width = Math.round(((block.offsetWidth / em) + 2 * MARGIN_EM) * 16)
      const height = Math.round((((block.offsetHeight + bar.offsetHeight) / em) + 2 * MARGIN_EM) * 16)
      setSize((s) => (s.width === width && s.height === height ? s : { width, height }))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(block)
    observer.observe(bar)
    return () => observer.disconnect()
  }, [blockRef, barRef])
  return size
}

export default function App() {
  const [keyRoot, setKey] = useState(START.key)
  const [chords, setChords] = useState(START.chords)
  const [view, setView] = usePersisted('view', 'both', ['guitar', 'keys', 'both'])
  const [scheme, setScheme] = usePersisted('scheme', 'chord', ['chord', 'key'])
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [editing, setEditing] = useState(false) // play mode by default: just the chords, as big as they go
  const [scaling, setScaling] = usePersisted('scaling', 'fluid', ['fluid', 'fixed'])
  const sizerRef = useRef(null)
  const blockRef = useRef(null)
  const barRef = useRef(null)
  const content = useContentSize(blockRef, barRef)
  const scale = useSizer(sizerRef, { ...SIZER, designWidth: content.width, designHeight: content.height,
                                     enabled: scaling === 'fluid' })

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
    <div className="sizer" ref={sizerRef}>
    <div className="scaled" style={{ fontSize: `${scale}rem` }}>
    <div className="app">
      <header className="bar" ref={barRef}>
        <h1 className="title">Nashville <span>Notation</span></h1>
        <button type="button" className="key-button" onClick={() => setSettingsOpen(true)}
                aria-label={`Key of ${display(NOTES[keyRoot])}. Open the key wheel and settings`}>
          <span className="key-caption">Key</span>
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

      <main className="stage">
      <div className="block" ref={blockRef}>
      <Progression keyRoot={keyRoot} chords={chords} />

      <div className="grid" style={{ '--cols': cols, '--card': rows > 1 ? '15em' : '17em' }}>
        {chords.map((chord, i) => (
          <ChordCard key={i} index={i} chord={chord} keyRoot={keyRoot} view={view} scheme={scheme} editing={editing}
                     onChange={(c) => change(i, c)} onRemove={() => remove(i)} canRemove={chords.length > 1} />
        ))}
      </div>
      </div>
      </main>

      <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} keyRoot={keyRoot} onKey={setKey} used={used}
                view={view} onView={setView} scheme={scheme} onScheme={setScheme}
                scaling={scaling} onScaling={setScaling} />
    </div>
    </div>
    </div>
  )
}
