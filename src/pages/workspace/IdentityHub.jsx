import { useState } from 'react'
import Panel from '../../components/ui/Panel'
import Pill from '../../components/ui/Pill'
import davidAvatar from '../../assets/avatars/david.png'
import swapIcon from '../../assets/icons/swap.svg'
import paidWorkIcon from '../../assets/icons/paid-work.svg'
import chatIcon from '../../assets/icons/chat.svg'
import videoIcon from '../../assets/icons/video.svg'
import moreIcon from '../../assets/icons/more-circle.svg'
import videoWhiteIcon from '../../assets/icons/video-white.svg'
import styles from './IdentityHub.module.css'

const PERSONAS = [
  { id: 'composer', name: 'Composer', detail: 'Film / Modular', status: 'Active', title: 'Audio Artisan' },
  { id: 'developer', name: 'Web Developer', detail: 'Fullstack / Web3', status: 'Expert', title: 'Web Developer' },
  { id: 'painter', name: 'Painter', detail: 'Spatial Canvas', status: 'Open', title: 'Spatial Painter' },
]

const OBJECTIVES = ['Like-Minded', 'Collab', 'Barter', 'Startups', 'Projects', 'Edu', 'Paid Work']

const SKILLS = [
  { tag: '#FilmScore' },
  { tag: '#Orchestration' },
  { tag: '#AbletonLive' },
  { tag: '#Max/MSP', highlight: true },
  { tag: '#SoundDesign', highlight: true },
]

export default function IdentityHub() {
  const [personaId, setPersonaId] = useState('composer')
  const [objectives, setObjectives] = useState(new Set(['Like-Minded', 'Collab', 'Barter', 'Projects', 'Paid Work']))

  const persona = PERSONAS.find((p) => p.id === personaId)
  const swapTarget = personaId === 'developer' ? PERSONAS[0] : PERSONAS[1]

  const toggleObjective = (name) =>
    setObjectives((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })

  return (
    <Panel
      title="Quadrant 01 // Identity Hub"
      aside={
        <Pill tone="neutral" size="md" bordered className={styles.id}>
          ID: DK-7749
        </Pill>
      }
      footer={
        <div className={styles.actions}>
          <div className={styles.iconButtons}>
            <button type="button" className={styles.iconButton} aria-label="Message">
              <img src={chatIcon} alt="" />
            </button>
            <button type="button" className={styles.iconButton} aria-label="Video call">
              <img src={videoIcon} alt="" />
            </button>
            <button type="button" className={styles.iconButton} aria-label="More options">
              <img src={moreIcon} alt="" />
            </button>
          </div>
          <button type="button" className={styles.primary}>
            <img src={videoWhiteIcon} alt="" />
            View {persona.name} Reel
          </button>
        </div>
      }
    >
      <div className={styles.profile}>
        <div className={styles.who}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatarRing}>
              <img src={davidAvatar} alt="David K." className={styles.avatar} />
            </div>
            <span className={styles.onlineBadge} aria-label="Online">
              <span />
            </span>
          </div>
          <div className={styles.meta}>
            <div className={styles.nameRow}>
              <h3 className={`${styles.name} display`}>David K.</h3>
              <Pill tone="success" size="md">
                Online
              </Pill>
            </div>
            <p className={styles.location}>
              Berlin, Germany <span className={styles.bullet}>•</span> <strong>UTC+2</strong>
            </p>
            <p className={styles.reputation}>
              Reputation:
              <Pill tone="teal" size="md">
                99.4% Grid Trust
              </Pill>
            </p>
          </div>
        </div>

        <div className={styles.modeBox}>
          <span className={styles.modeLabel}>Active Persona</span>
          <Pill tone="tealSolid" size="lg" dot className={styles.modePill}>
            {persona.title}
          </Pill>
          <button type="button" className={styles.swap} onClick={() => setPersonaId(swapTarget.id)}>
            Swap {swapTarget.id === 'developer' ? 'Dev' : 'Audio'} View
            <img src={swapIcon} alt="" />
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <h4 className={styles.sectionTitle}>Persona Matrices</h4>
          <span className={styles.sectionNote}>{PERSONAS.length} Deployed</span>
        </div>
        <div className={styles.personas} role="radiogroup" aria-label="Active persona">
          {PERSONAS.map((p) => {
            const active = p.id === personaId
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={active}
                className={`${styles.persona} ${active ? styles.personaActive : ''}`}
                onClick={() => setPersonaId(p.id)}
              >
                <span className={styles.personaDot} />
                <span className={styles.personaText}>
                  <span className={styles.personaName}>{p.name}</span>
                  <span className={styles.personaDetail}>{p.detail}</span>
                </span>
                <Pill tone={active ? 'tealSolid' : 'slate'} size="xs" shape="tag" className={styles.personaBadge}>
                  {active ? 'Active' : p.status}
                </Pill>
              </button>
            )
          })}
        </div>
      </div>

      <div className={`${styles.section} ${styles.objectives}`}>
        <div className={styles.sectionHead}>
          <h4 className={styles.sectionTitle}>Collaboration Objectives</h4>
          <span className={`${styles.sectionNote} ${styles.multi}`}>MULTI-SELECT</span>
        </div>
        <div className={styles.chips}>
          {OBJECTIVES.map((name) => {
            const on = objectives.has(name)
            return (
              <button
                key={name}
                type="button"
                aria-pressed={on}
                className={`${styles.chip} ${on ? styles.chipOn : ''}`}
                onClick={() => toggleObjective(name)}
              >
                {on && (name === 'Paid Work' ? <img src={paidWorkIcon} alt="" /> : <span className={styles.chipDot} />)}
                {name}
              </button>
            )
          })}
        </div>
      </div>

      <div className={styles.bio}>
        <p>
          Film, theatre, and concert composer specializing in hybrid orchestral &amp; modular electronic scores for
          indie games, interactive installations, and narrative features.
        </p>
        <div className={styles.skills}>
          {SKILLS.map((s) => (
            <Pill
              key={s.tag}
              tone={s.highlight ? 'teal' : 'white'}
              size="md"
              shape="tag"
              bordered
              className={s.highlight ? styles.skillHi : styles.skill}
            >
              {s.tag}
            </Pill>
          ))}
        </div>
      </div>
    </Panel>
  )
}
