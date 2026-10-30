import styles from './Pill.module.css'

/**
 * Small label / badge.
 * tone:  teal | tealSolid | neutral | white | slate | sky | success | outline
 * size:  xs (9px) | sm (10px) | md (11px) | lg (12px)
 * shape: pill | tag (6px radius)
 */
export default function Pill({
  tone = 'teal',
  size = 'sm',
  shape = 'pill',
  bordered = false,
  dot = false,
  as: Tag = 'span',
  className = '',
  children,
  ...rest
}) {
  const cls = [styles.pill, styles[tone], styles[size], styles[shape], bordered && styles.bordered, className]
    .filter(Boolean)
    .join(' ')
  return (
    <Tag className={cls} {...rest}>
      {dot && <span className={styles.dot} />}
      {children}
    </Tag>
  )
}
