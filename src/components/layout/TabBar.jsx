import { NavLink } from 'react-router-dom'
import nexusIcon from '../../assets/icons/tab-nexus.svg'
import tradesIcon from '../../assets/icons/tab-trades.svg'
import studioIcon from '../../assets/icons/tab-studio.svg'
import vaultIcon from '../../assets/icons/tab-vault.svg'
import styles from './TabBar.module.css'

const TABS = [
  { to: '/', label: 'Nexus', icon: nexusIcon, w: 17.417, h: 17.417, end: true },
  { to: '/barters', label: 'Trades', icon: tradesIcon, w: 17.417, h: 13.741 },
  { to: '/studio', label: 'Studio', icon: studioIcon, w: 17.417, h: 17.417 },
  { to: '/vault', label: 'Vault', icon: vaultIcon, w: 16.042, h: 17.804 },
]

// Mobile-only bottom navigation (from the "Mobile Collaboration Nexus" frame)
export default function TabBar() {
  return (
    <nav className={styles.bar} aria-label="Primary mobile">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) => (isActive ? `${styles.tab} ${styles.active}` : styles.tab)}
        >
          {/* masked so the icon can take the active/inactive colour */}
          <span
            className={styles.icon}
            style={{ width: tab.w, height: tab.h, maskImage: `url("${tab.icon}")`, WebkitMaskImage: `url("${tab.icon}")` }}
          />
          <span className={`${styles.label} display`}>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
