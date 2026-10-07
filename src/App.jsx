import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import ChordCard from './components/ChordCard.jsx'
import Progression from './components/Progression.jsx'
import ScaleView, { ScaleLine } from './components/ScaleView.jsx'
import Wheel from './components/Wheel.jsx'
import Choice from './components/Choice.jsx'
import Legend from './components/Legend.jsx'
import { fromSongMessage, MAX_CHORDS, START } from './music/progression.js'
import { chordName, display, MAJOR_SCALE, NOTES, SCALES } from './music/theory.js'
import { usePersisted } from './usePersisted.js'
import { useSizer } from './sizer.js'

const VIEWS = [['guitar', 'Guitar'], ['keys', 'Keys'], ['both', 'Both']]
const SCHEMES = [['chord', 'By chord'], ['key', 'By key']]
const MODES = [['chords', 'Chords'], ['scale', 'Scale']]

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

// An element's height in px, kept up to date.
function useHeight(ref) {
  const [height, setHeight] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(() => setHeight(el.offsetHeight))
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return height
}

export default function App() {
  const [keyRoot, setKey] = useState(START.key)
  const [chords, setChords] = useState(START.chords)
  const [view, setView] = usePersisted('view', 'both', ['guitar', 'keys', 'both'])
  const [scheme, setScheme] = usePersisted('scheme', 'chord', ['chord', 'key'])
  const [mode, setMode] = usePersisted('mode', 'chords', ['chords', 'scale'])
  const [scaleType, setScaleType] = usePersisted('scale', 'major', Object.keys(SCALES))
  const [scaling, setScaling] = usePersisted('scaling', 'fluid', ['fluid', 'fixed'])
  const sizerRef = useRef(null)
  const blockRef = useRef(null)
  const barRef = useRef(null)
  const infoRef = useRef(null)
  const infoHeight = useHeight(infoRef)  // the wheel is as tall as the info rows beside it
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

  // Steps of the wheel to ring: the progression's, or the scale's.
  const used = useMemo(() => (mode === 'scale'
    ? new Set(SCALES[scaleType].steps)
    : new Set(chords.map((c) => (MAJOR_SCALE[c.degree - 1] - (c.flat ? 1 : 0) + 12) % 12))), [mode, scaleType, chords])

  const change = (i, chord) => setChords((cs) => cs.map((c, j) => (j === i ? chord : c)))
  const remove = (i) => setChords((cs) => cs.filter((_, j) => j !== i))
  const add = () => setChords((cs) => [...cs, { degree: 1, flat: false, quality: '' }])

  // One row up to four chords, two rows after that.
  const rows = chords.length > 4 ? 2 : 1
  const cols = Math.ceil(chords.length / rows)

  const summary = mode === 'scale'
    ? `${display(NOTES[keyRoot])} ${SCALES[scaleType].label.toLowerCase()} scale`
    : `Key of ${display(NOTES[keyRoot])}: ${chords.map((c) => display(chordName(keyRoot, c))).join(', ')}`

  return (
    <div className="sizer" ref={sizerRef}>
    <div className="scaled" style={{ fontSize: `${scale}rem` }}>
    <div className="app">
      {/* The top: the info rows (two rows of controls, the progression, the colour legend) on the left,
          the wheel on the right as tall as all of them */}
      <header className="head" ref={barRef}>
        <div className="info" ref={infoRef}>
        <div className="bar-rows">
          <div className="bar-row">
            <h1 className="title">Nashville <span>Notation</span></h1>
            <label className="key-pick">
              <span className="key-caption">Key</span>
              <select value={keyRoot} onChange={(e) => setKey(Number(e.target.value))}>
                {NOTES.map((n, i) => <option key={n} value={i}>{display(n)}</option>)}
              </select>
            </label>
            <div className="segmented" role="group" aria-label="Transpose">
              <button type="button" onClick={() => setKey((k) => (k + 11) % 12)} aria-label="Transpose down a half step">−</button>
              <button type="button" onClick={() => setKey((k) => (k + 1) % 12)} aria-label="Transpose up a half step">+</button>
            </div>
          </div>
          <div className="bar-row">
            <span id="bar-mode" className="visually-hidden">Show chords or a scale</span>
            <Choice label="bar-mode" options={MODES} value={mode} onChange={setMode} />
            <span id="bar-view" className="visually-hidden">Show</span>
            <Choice label="bar-view" options={VIEWS} value={view} onChange={setView} />
            {mode === 'chords' ? (
              <>
                <span id="bar-colour" className="visually-hidden">Colour notes</span>
                <Choice label="bar-colour" options={SCHEMES} value={scheme} onChange={setScheme} />
                <button type="button" className="add" onClick={add} disabled={chords.length >= MAX_CHORDS}
                        aria-label={chords.length >= MAX_CHORDS ? `Add chord (${MAX_CHORDS} is the most)` : 'Add chord'}>+ Chord</button>
              </>
            ) : (
              <label className="scale-pick">
                <span className="visually-hidden">Scale</span>
                <select value={scaleType} onChange={(e) => setScaleType(e.target.value)}>
                  {Object.entries(SCALES).map(([value, sc]) => <option key={value} value={value}>{sc.label}</option>)}
                </select>
              </label>
            )}
            <button type="button" className="toggle scale-toggle" aria-pressed={scaling === 'fluid'}
                    onClick={() => setScaling(scaling === 'fluid' ? 'fixed' : 'fluid')}>Auto-scale text</button>
          </div>
        </div>
          {mode === 'chords' ? (
            <>
              <Progression keyRoot={keyRoot} chords={chords} />
              <Legend scheme={scheme} keyRoot={keyRoot} />
            </>
          ) : (
            <ScaleLine keyRoot={keyRoot} type={scaleType} />
          )}
        </div>
        <div className="head-wheel" style={{ width: infoHeight, height: infoHeight }}>
          <Wheel keyRoot={keyRoot} used={used} onKey={setKey} outline />
        </div>
      </header>

      <p className="visually-hidden" aria-live="polite">{summary}</p>

      <main className="stage">
      <div className="block" ref={blockRef}>

      {mode === 'scale' ? (
        <ScaleView keyRoot={keyRoot} type={scaleType} view={view} />
      ) : (
        <div className="grid" style={{ '--cols': cols, '--card': rows > 1 ? '15em' : '17em' }}>
          {chords.map((chord, i) => (
            <ChordCard key={i} index={i} chord={chord} keyRoot={keyRoot} view={view} scheme={scheme}
                       onChange={(c) => change(i, c)} onRemove={() => remove(i)} canRemove={chords.length > 1} />
          ))}
        </div>
      )}
      </div>
      </main>

    </div>
    </div>
    </div>
  )
}
