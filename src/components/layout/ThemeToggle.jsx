import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../theme'
import styles from './ThemeToggle.module.css'

/** Sun/moon switch. `onDark` styles it for the navy Nexus header. */
export default function ThemeToggle({ onDark = false }) {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      className={`${styles.toggle} ${onDark ? styles.onDark : ''}`}
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
    >
      {dark ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
    </button>
  )
}
