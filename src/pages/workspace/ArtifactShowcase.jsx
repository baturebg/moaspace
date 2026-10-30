import { useEffect, useState } from 'react'
import Panel from '../../components/ui/Panel'
import Pill from '../../components/ui/Pill'
import playIcon from '../../assets/icons/play.svg'
import stemsIcon from '../../assets/icons/paper-upload.svg'
import barterIcon from '../../assets/icons/barter.svg'
import arrowUpIcon from '../../assets/icons/arrow-up.svg'
import styles from './ArtifactShowcase.module.css'

const TEAL = '2, 126, 111'
const SKY = '14, 165, 233'
// [height, rgb, alpha] — bar values from the Figma waveform
const BARS = [
  [12, TEAL, 0.3], [20, TEAL, 0.5], [32, TEAL, 0.7], [40, TEAL, 1], [24, TEAL, 1], [44, TEAL, 1],
  [28, SKY, 1], [48, SKY, 1], [36, SKY, 1], [20, TEAL, 1], [44, TEAL, 1], [16, TEAL, 0.6],
  [32, TEAL, 1], [48, TEAL, 1], [40, TEAL, 1], [28, SKY, 1], [44, SKY, 1], [16, SKY, 0.6],
  [24, TEAL, 0.5], [36, TEAL, 1], [12, TEAL, 0.3],
]

const DURATION = 3 * 60 + 42

const STATS = [
  { value: '14', label: 'Collabs Done', color: 'var(--teal-ink)' },
  { value: '09', label: 'Barters Settled', color: 'var(--sky-ink)' },
  { value: '04', label: 'Ventures Advised', color: 'var(--text)' },
]

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export default function ArtifactShowcase() {
  const [playRequested, setPlayRequested] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const playing = playRequested && elapsed < DURATION

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setElapsed((e) => Math.min(e + 1, DURATION)), 1000)
    return () => clearInterval(t)
  }, [playing])

  const togglePlay = () => {
    if (elapsed >= DURATION) setElapsed(0)
    setPlayRequested(!playing)
  }

  const progress = elapsed / DURATION
  const started = playing || elapsed > 0

  return (
    <Panel
      title="Quadrant 03 // Artifact Showcase"
      aside={
        <Pill tone="teal" size="sm" bordered className={styles.featured}>
          FEATURED TRACK
        </Pill>
      }
      footer={
        <div className={styles.stats}>
          {STATS.map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className="display" style={{ color: s.color }}>
                {s.value}
              </span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      }
    >
      <div className={styles.content}>
        <div className={styles.track}>
          <div className={styles.trackHead}>
            <div className={styles.trackInfo}>
              <div className={styles.trackTitleRow}>
                <h3 className={`${styles.trackTitle} display`}>Unravel (Original OST)</h3>
                <Pill tone="teal" size="sm" bordered>
                  GAME JAM WINNER
                </Pill>
              </div>
              <p className={styles.trackSub}>Hybrid Dark Orchestral &amp; Modular Buchla Synthesizer</p>
            </div>
            <Pill tone="white" size="lg" shape="tag" bordered className={styles.time}>
              {started ? `-${fmt(DURATION - elapsed)}` : fmt(DURATION)}
            </Pill>
          </div>

          <div className={styles.wave}>
            <button
              type="button"
              className={styles.play}
              aria-label={playing ? 'Pause' : 'Play'}
              onClick={togglePlay}
            >
              {playing ? (
                <span className={styles.pause}>
                  <span />
                  <span />
                </span>
              ) : (
                <img src={playIcon} alt="" />
              )}
            </button>
            <div className={styles.bars} aria-hidden>
              {BARS.map(([h, rgb, a], i) => {
                const past = !started || i / BARS.length <= progress
                return (
                  <span
                    key={i}
                    className={styles.bar}
                    style={{ height: h, background: `rgba(${rgb}, ${past ? a : a * 0.3})` }}
                  />
                )
              })}
            </div>
          </div>

          <div className={styles.specs}>
            <a href="#stems" className={styles.stemsLink}>
              <img src={stemsIcon} alt="" />
              Non-exclusive Stems Available
            </a>
            <span>48kHz / 24-bit Flac &amp; Ableton Set</span>
          </div>
        </div>

        <div className={styles.barter}>
          <div className={styles.barterHead}>
            <span className={styles.barterTitle}>
              <img src={barterIcon} alt="" />
              Direct Barter Proposition (Active)
            </span>
            <Pill tone="teal" size="sm">
              ESCROW READY
            </Pill>
          </div>
          <div className={styles.terms}>
            <div className={styles.term}>
              <span className={styles.termLabel}>
                <img src={arrowUpIcon} alt="" />
                Offering
              </span>
              <p>Custom 3-Minute Orchestral / Electronic Boss Battle Theme + SFX Stems</p>
            </div>
            <div className={styles.term}>
              <span className={`${styles.termLabel} ${styles.seeking}`}>
                <span className={styles.seekDot} />
                Seeking
              </span>
              <p>Full-stack React/Node Developer to build Audio DSP Plugin License Store</p>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  )
}
