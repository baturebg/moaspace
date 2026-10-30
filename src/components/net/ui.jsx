import styles from './ui.module.css'

const cx = (...c) => c.filter(Boolean).join(' ')

/** White bordered card used for every quadrant on the Artist Network screens */
export function NetCard({ className, footer, children, ...rest }) {
  return (
    <section className={cx(styles.card, className)} {...rest}>
      <div className={styles.cardBody}>{children}</div>
      {footer && <div className={styles.cardFoot}>{footer}</div>}
    </section>
  )
}

/** "WORKSPACE • NW ● Live Directory" overline */
export function Eyebrow({ label, sub, lead, className }) {
  return (
    <p className={cx(styles.eyebrow, className)}>
      {lead && <span className={styles.leadDot} />}
      <span className={styles.eyebrowLabel}>{label}</span>
      {sub && (
        <>
          <span className={styles.eyebrowSep} />
          <span className={styles.eyebrowSub}>{sub}</span>
        </>
      )}
    </p>
  )
}

/** Condensed display heading */
export function Title({ as: Tag = 'h2', size = 'md', className, children }) {
  return <Tag className={cx('display', styles.title, styles[`t-${size}`], className)}>{children}</Tag>
}

/**
 * variant: primary | soft | outline | ghost | link | danger
 * size: xs | sm | md | lg
 */
export function Btn({ variant = 'primary', size = 'sm', icon: Icon, iconRight: IconRight, block, className, children, ...rest }) {
  const iconSize = { xs: 11, sm: 12, md: 14, lg: 16 }[size]
  return (
    <button type="button" className={cx(styles.btn, styles[variant], styles[`b-${size}`], block && styles.block, className)} {...rest}>
      {Icon && <Icon size={iconSize} strokeWidth={2.2} aria-hidden />}
      {children}
      {IconRight && <IconRight size={iconSize} strokeWidth={2.2} aria-hidden />}
    </button>
  )
}

/** Initials avatar. tone: teal | soft | sky | navy | slate */
export function Initials({ children, size = 40, tone = 'soft', className }) {
  return (
    <span className={cx(styles.initials, styles[`i-${tone}`], className)} style={{ width: size, height: size, fontSize: size * 0.32 }}>
      {children}
    </span>
  )
}

const PALETTES = {
  teal: ['#0f766e', '#134e4a', '#5eead4'],
  dusk: ['#f59e0b', '#be185d', '#1e1b4b'],
  neon: ['#7c3aed', '#0e7490', '#020617'],
  forest: ['#65a30d', '#166534', '#fef3c7'],
  paper: ['#f5f5f4', '#d6d3d1', '#a8a29e'],
  studio: ['#92400e', '#1c1917', '#fbbf24'],
  ice: ['#e0f2fe', '#94a3b8', '#f8fafc'],
  ocean: ['#155e75', '#083344', '#22d3ee'],
  ember: ['#ea580c', '#7c2d12', '#fde68a'],
  slate: ['#334155', '#0f172a', '#64748b'],
}

/**
 * Placeholder artwork tile — stands in for the Figma images that could not be exported
 * (Figma MCP rate limit). Swap `src` in once real assets are available.
 */
export function Art({ src, palette = 'teal', icon: Icon, label, radius = 10, className, style, alt = '' }) {
  if (src) return <img src={src} alt={alt} className={cx(styles.art, className)} style={{ borderRadius: radius, ...style }} />
  const [a, b, c] = PALETTES[palette] ?? PALETTES.teal
  return (
    <div
      role="img"
      aria-label={alt || label || 'Artwork'}
      className={cx(styles.art, className)}
      style={{
        borderRadius: radius,
        background: `radial-gradient(120% 90% at 20% 15%, ${c}66 0%, transparent 55%), radial-gradient(90% 80% at 85% 90%, ${a}cc 0%, transparent 60%), linear-gradient(140deg, ${a} 0%, ${b} 100%)`,
        ...style,
      }}
    >
      {Icon && <Icon className={styles.artIcon} strokeWidth={1.5} aria-hidden />}
      {label && <span className={styles.artLabel}>{label}</span>}
    </div>
  )
}

export function Progress({ value, className, tone = 'teal', height = 8 }) {
  return (
    <div className={cx(styles.track, className)} style={{ height }} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className={cx(styles.fill, styles[`f-${tone}`])} style={{ width: `${value}%` }} />
    </div>
  )
}

/** Inner grey panel */
export function Inset({ className, children, ...rest }) {
  return (
    <div className={cx(styles.inset, className)} {...rest}>
      {children}
    </div>
  )
}

/** Small rounded label: tone teal | soft | grey | white | solid | sky | danger */
export function Tag({ tone = 'soft', className, children, ...rest }) {
  return (
    <span className={cx(styles.tag, styles[`g-${tone}`], className)} {...rest}>
      {children}
    </span>
  )
}
