import { useEffect, useState } from 'react'

// State this device remembers between visits (the view, the colouring). Storage can be missing or
// blocked (private windows, some iframes), so it quietly falls back to the default.
export function usePersisted(name, initial, allowed) {
  const key = `nashville:${name}`
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved !== null && (!allowed || allowed.includes(saved)) ? saved : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, value)
    } catch { /* not remembered, still works */ }
  }, [key, value])
  return [value, setValue]
}
