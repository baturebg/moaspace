import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.copy}>© 2025 MOA SPACE COLLABORATION NEXUS</span>
          <span className={styles.sep}>•</span>
          <span className={styles.status}>
            <span className={styles.statusDot} />
            SYSTEM ONLINE
          </span>
        </div>
        <nav className={styles.links} aria-label="Footer">
          <a href="#escrow">Escrow Protocol</a>
          <a href="#contracts">Smart Contracts</a>
          <a href="#help">Help Center</a>
        </nav>
      </div>
    </footer>
  )
}
