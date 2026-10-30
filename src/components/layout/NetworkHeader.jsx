import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Bell, ChevronDown, Search, User } from 'lucide-react'
import logo from '../../assets/moa-logo-dark.svg'
import logoOnDark from '../../assets/moa-logo.svg'
import ThemeToggle from './ThemeToggle'
import styles from './NetworkHeader.module.css'

const NAV = [
  { to: '/talent', label: 'Artists' },
  { to: '/barters', label: 'Trades' },
  { to: '/studio', label: 'Creations' },
]

// Rooms that have no slot in the Figma nav are reachable from the Explore menu
const ROOMS = [
  { to: '/', label: 'Collaboration Nexus', hint: '4-quadrant workspace' },
  { to: '/live-room', label: 'Live Project Room', hint: 'Co-creation workspace' },
  { to: '/audio-studio', label: 'Audio & Stem Studio', hint: 'Music co-creation' },
  { to: '/critique', label: 'Critique Studio', hint: 'Peer review' },
  { to: '/contract', label: 'Contract Builder', hint: 'Fair agreements' },
  { to: '/vault', label: 'Community Vault', hint: 'Assets & resources' },
]

// Light "Artist Network" header used by the discovery / trades / studio screens
export default function NetworkHeader() {
  const searchRef = useRef(null)
  const menuRef = useRef(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
      if (e.key === 'Escape') setOpen(false)
    }
    const onClick = (e) => {
      if (!menuRef.current?.contains(e.target)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [])

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="Moa Space home">
          <img src={logo} alt="Moa Space" className={styles.logoLight} />
          <img src={logoOnDark} alt="" className={styles.logoDark} />
        </Link>

        <form className={styles.search} role="search" onSubmit={(e) => e.preventDefault()}>
          <Search size={15} className={styles.searchIcon} aria-hidden />
          <label htmlFor="network-search" className="visually-hidden">
            Search
          </label>
          <input
            id="network-search"
            ref={searchRef}
            type="search"
            placeholder="Search artists, artwork, audio, projects... ⌘K"
            className={styles.searchInput}
          />
          <kbd className={styles.kbd}>⌘K</kbd>
        </form>

        <nav className={styles.nav} aria-label="Primary">
          <div className={styles.explore} ref={menuRef}>
            <button
              type="button"
              className={styles.link}
              aria-expanded={open}
              aria-haspopup="menu"
              onClick={() => setOpen((o) => !o)}
            >
              Explore
              <ChevronDown size={14} className={styles.caret} aria-hidden />
            </button>
            {open && (
              <div className={styles.menu} role="menu">
                {ROOMS.map((r) => (
                  <Link key={r.to} to={r.to} role="menuitem" className={styles.menuItem} onClick={() => setOpen(false)}>
                    <span>{r.label}</span>
                    <small>{r.hint}</small>
                  </Link>
                ))}
              </div>
            )}
          </div>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.right}>
          <ThemeToggle />
          <button type="button" className={styles.bell} aria-label="Notifications">
            <Bell size={17} strokeWidth={1.8} />
          </button>
          <button type="button" className={styles.avatar} aria-label="Account">
            <User size={14} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </header>
  )
}
