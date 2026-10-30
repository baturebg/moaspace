import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Panel from '../../components/ui/Panel'
import Pill from '../../components/ui/Pill'
import laimonasAvatar from '../../assets/avatars/laimonas.png'
import elenaAvatar from '../../assets/avatars/elena.png'
import marcusAvatar from '../../assets/avatars/marcus.png'
import filterButton from '../../assets/icons/filter-button.svg'
import searchIcon from '../../assets/icons/search-gray.svg'
import usersIcon from '../../assets/icons/users.svg'
import chevronIcon from '../../assets/icons/chevron-right.svg'
import styles from './TalentRadar.module.css'

const FILTERS = [
  { id: 'all', label: 'All Match', count: 28 },
  { id: 'arts', label: 'Arts', count: 12 },
  { id: 'tech', label: 'Tech', count: 9 },
  { id: 'ventures', label: 'Ventures', count: 5 },
  { id: 'sound', label: 'Sound', count: 2 },
]

const PEOPLE = [
  {
    name: 'Laimonas Vokietis',
    role: 'Lead 3D & Tech Art',
    roleColor: 'var(--sky-ink)',
    ring: 'var(--teal)',
    avatar: laimonasAvatar,
    pitch: '"Building UE5 ARPG. Need dark orchestral intro…',
    tags: [
      { label: 'WANTS AUDIO', tone: 'teal' },
      { label: 'OFFERS 3D', tone: 'neutral', bordered: true },
    ],
    categories: ['arts', 'tech'],
  },
  {
    name: 'Elena Rostova',
    role: 'Web3 & Protocol Dev',
    roleColor: 'var(--teal-ink)',
    ring: 'var(--sky)',
    avatar: elenaAvatar,
    pitch: '"Writing smart contracts for generative music…',
    tags: [
      { label: 'ETH/SOL', tone: 'sky' },
      { label: 'COLLAB', tone: 'teal' },
    ],
    categories: ['tech', 'ventures'],
  },
  {
    name: 'Marcus Chen',
    role: 'Game Architect',
    roleColor: 'var(--muted)',
    ring: 'var(--navy)',
    avatar: marcusAvatar,
    pitch: '"Rogue-like deckbuilder. Seeking synth audio…',
    tags: [
      { label: 'BARTER', tone: 'outline', bordered: true },
      { label: 'GODOT 4', tone: 'slate' },
    ],
    categories: ['ventures', 'sound'],
  },
]

export default function TalentRadar() {
  const [query, setQuery] = useState('Needs Composer | Offers Web Development')
  const [filter, setFilter] = useState('all')

  const visible = useMemo(() => {
    // the default query describes the user's own need/offer, so only filter on free text
    const q = query.includes('|') ? '' : query.trim().toLowerCase()
    return PEOPLE.filter(
      (p) =>
        (filter === 'all' || p.categories.includes(filter)) &&
        (!q || `${p.name} ${p.role} ${p.pitch}`.toLowerCase().includes(q)),
    )
  }, [query, filter])

  return (
    <Panel
      title="Quadrant 02 // Talent Radar"
      tone="sky"
      aside={
        <div className={styles.radar}>
          Global Radar
          <button type="button" className={styles.filterBtn} aria-label="Radar filters">
            <img src={filterButton} alt="" />
          </button>
        </div>
      }
      footer={
        <div className={styles.telemetry}>
          <span className={styles.online}>
            <img src={usersIcon} alt="" />
            42 creators online within affinity vector
          </span>
          <Link to="/talent" className={styles.explore}>
            Explore All Talent
            <img src={chevronIcon} alt="" />
          </Link>
        </div>
      }
    >
      <div className={styles.controls}>
        <div className={styles.search}>
          <img src={searchIcon} alt="" className={styles.searchIcon} />
          <label htmlFor="talent-search" className="visually-hidden">
            Search talent
          </label>
          <input
            id="talent-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
          <Pill tone="teal" size="sm" bordered className={styles.match}>
            98% Match
          </Pill>
        </div>

        <div className={styles.filters} role="tablist" aria-label="Talent categories">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              className={`${styles.filter} ${filter === f.id ? styles.filterOn : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {visible.length ? (
          <div className={styles.cards}>
            {visible.map((p) => (
              <article key={p.name} className={styles.card}>
                <div className={styles.cardBody}>
                  <div className={styles.ring} style={{ background: `linear-gradient(to bottom, ${p.ring}, var(--border))` }}>
                    <img src={p.avatar} alt={p.name} className={styles.avatar} />
                  </div>
                  <h3 className={`${styles.name} display`}>{p.name}</h3>
                  <p className={styles.role} style={{ color: p.roleColor }}>
                    {p.role}
                  </p>
                  <p className={styles.pitch}>{p.pitch}</p>
                </div>
                <div className={styles.cardFoot}>
                  {p.tags.map((t) => (
                    <Pill key={t.label} tone={t.tone} size="xs" bordered={t.bordered} className={styles.tag}>
                      {t.label}
                    </Pill>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>No creators match this filter yet.</p>
        )}
      </div>
    </Panel>
  )
}
