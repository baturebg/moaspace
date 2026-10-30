import { useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../../assets/moa-logo.svg'
import searchIcon from '../../assets/icons/search.svg'
import bellIcon from '../../assets/icons/bell.svg'
import ThemeToggle from './ThemeToggle'
import styles from './Header.module.css'

const NAV = [
  { to: '/', label: 'Nexus', end: true },
  { to: '/talent', label: 'Talent' },
  { to: '/barters', label: 'Barters' },
  { to: '/studio', label: 'Artifacts' },
]

export default function Header({ title = 'Collaboration Hub', subtitle = 'Creative Nexus' }) {
  const searchRef = useRef(null)

  // ⌘K / Ctrl+K focuses the global search, as hinted by the kbd badge
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <img src={logo} alt="Moa Space" width="128" height="32" className={styles.logo} />
          <span className={styles.brandText}>
            <span className={styles.brandTitle}>{title}</span>
            <span className={styles.brandSub}>{subtitle}</span>
          </span>
        </Link>

        <form className={styles.search} role="search" onSubmit={(e) => e.preventDefault()}>
          <img src={searchIcon} alt="" width="13.5" height="13.5" className={styles.searchIcon} />
          <label htmlFor="global-search" className="visually-hidden">
            Search
          </label>
          <input
            id="global-search"
            ref={searchRef}
            type="search"
            placeholder="Search creators, roles, audio, projects..."
            className={styles.searchInput}
          />
          <kbd className={styles.kbd}>⌘K</kbd>
        </form>

        <div className={styles.right}>
          <nav className={styles.nav} aria-label="Primary">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <ThemeToggle onDark />
          <button type="button" className={styles.bell} aria-label="Notifications (new)">
            <img src={bellIcon} alt="" />
            <span className={styles.bellDot} />
          </button>
          <div className={styles.user}>
            <span className={styles.userAvatar}>DK</span>
            <span className={styles.userText}>
              <span className={styles.userName}>David K.</span>
              <span className={styles.userRole}>Pro Creator</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
