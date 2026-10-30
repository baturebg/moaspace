import styles from './NetworkFooter.module.css'

export default function NetworkFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.name}>MOA SPACE — Artist Network</span>
          <span className={styles.online}>
            <span className={styles.dot} />
            Online
          </span>
        </div>
        <nav className={styles.links} aria-label="Footer">
          <a href="#escrow">Trades &amp; Escrow</a>
          <a href="#agreements">Agreements</a>
          <a href="#help">Help</a>
        </nav>
      </div>
    </footer>
  )
}
