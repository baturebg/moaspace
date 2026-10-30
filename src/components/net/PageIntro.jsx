import styles from './PageIntro.module.css'

/** Title row above the quadrant grid: icon badge, display title, badge, subtitle and right-side actions */
export default function PageIntro({ icon: Icon, title, badge, subtitle, aside }) {
  return (
    <div className={styles.intro}>
      <div className={styles.left}>
        {Icon && (
          <span className={styles.icon}>
            <Icon size={18} strokeWidth={2.2} />
          </span>
        )}
        <div>
          <div className={styles.titleRow}>
            <h1 className={`display ${styles.title}`}>{title}</h1>
            {badge && <span className={styles.badge}>{badge}</span>}
          </div>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>
      {aside && <div className={styles.aside}>{aside}</div>}
    </div>
  )
}
