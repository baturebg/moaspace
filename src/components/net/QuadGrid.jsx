import { Children, useLayoutEffect, useRef, useState } from 'react'
import styles from './QuadGrid.module.css'

/**
 * 2×2 quadrant layout with the "Section intersection — Direction control" knob
 * sitting where the four cards meet. The knob's arrows move focus between quadrants.
 * `columns` is a grid-template-columns value, e.g. "709fr 499fr".
 */
export default function QuadGrid({ columns = '1fr 1fr', gap = 24, stretch = false, joined = false, children, className = '' }) {
  const gridRef = useRef(null)
  const [knob, setKnob] = useState(null)
  const [focus, setFocus] = useState(null)
  const cells = Children.toArray(children)

  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const place = () => {
      const [a, b] = grid.children
      if (!a || !b) return
      const g = grid.getBoundingClientRect()
      const ra = a.getBoundingClientRect()
      const rb = b.getBoundingClientRect()
      // hidden when the grid collapses to one column
      if (rb.top > ra.top + 10) return setKnob(null)
      const half = joined ? 0 : gap / 2
      setKnob({ x: ra.right - g.left + half, y: Math.max(ra.bottom, rb.bottom) - g.top + half })
    }
    place()
    const ro = new ResizeObserver(place)
    Array.from(grid.children).forEach((c) => ro.observe(c))
    ro.observe(grid)
    return () => ro.disconnect()
  }, [gap, joined, cells.length])

  const move = (dx, dy) => {
    const cur = focus ?? 0
    const col = Math.min(1, Math.max(0, (cur % 2) + dx))
    const row = Math.min(1, Math.max(0, Math.floor(cur / 2) + dy))
    const next = row * 2 + col
    setFocus(next)
    gridRef.current?.children[next]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  return (
    <div className={`${styles.wrap} ${className}`}>
      <div
        ref={gridRef}
        className={`${styles.grid} ${stretch || joined ? styles.stretch : ''} ${joined ? styles.joined : ''}`}
        style={{ '--cols': columns, '--gap': `${joined ? 0 : gap}px` }}
      >
        {cells.map((child, i) => (
          <div key={i} className={`${styles.cell} ${focus === i ? styles.focused : ''}`}>
            {child}
          </div>
        ))}
      </div>

      {knob && (
        <div className={styles.knob} style={{ left: knob.x, top: knob.y }} role="group" aria-label="Quadrant navigator">
          <div className={styles.ring}>
            <button type="button" className={`${styles.arrow} ${styles.up}`} aria-label="Focus upper quadrant" onClick={() => move(0, -1)} />
            <button type="button" className={`${styles.arrow} ${styles.down}`} aria-label="Focus lower quadrant" onClick={() => move(0, 1)} />
            <button type="button" className={`${styles.arrow} ${styles.left}`} aria-label="Focus left quadrant" onClick={() => move(-1, 0)} />
            <button type="button" className={`${styles.arrow} ${styles.right}`} aria-label="Focus right quadrant" onClick={() => move(1, 0)} />
            <button type="button" className={styles.center} aria-label="Clear focus" onClick={() => setFocus(null)} />
          </div>
          <span className={`${styles.stud} ${styles.sN}`} />
          <span className={`${styles.stud} ${styles.sS}`} />
          <span className={`${styles.stud} ${styles.sW}`} />
          <span className={`${styles.stud} ${styles.sE}`} />
        </div>
      )}
    </div>
  )
}
