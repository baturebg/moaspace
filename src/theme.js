import { useCallback, useEffect, useState } from 'react'

const KEY = 'moa-theme'

const systemTheme = () => (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

const readSaved = () => {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'dark' || v === 'light' ? v : null
  } catch {
    return null
  }
}

/** Light/dark theme: follows the OS until the user picks one, then remembers the choice. */
export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || readSaved() || systemTheme())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // keep following the OS while the user hasn't chosen
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mq) return
    const onChange = () => !readSaved() && setTheme(mq.matches ? 'dark' : 'light')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(KEY, next)
      } catch {
        /* storage unavailable — still switch for this visit */
      }
      return next
    })
  }, [])

  return { theme, toggle }
}
