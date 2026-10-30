import styles from './Panel.module.css'

/**
 * White rounded card with the "● QUADRANT 0X // TITLE" header row used across Moa Space.
 * `tone` colours the dot + title (teal | sky).
 */
export default function Panel({ title, tone = 'teal', aside, footer, className = '', children, ...rest }) {
  return (
    <section className={`${styles.panel} ${className}`} {...rest}>
      <div className={styles.body}>
        {title && (
          <header className={styles.head}>
            <h2 className={`${styles.title} ${styles[tone]}`}>
              <span className={styles.dot} />
              {title}
            </h2>
            {aside}
          </header>
        )}
        {children}
      </div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </section>
  )
}
