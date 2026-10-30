import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeftRight,
  ArrowRight,
  BadgeCheck,
  Box,
  Check,
  ChevronRight,
  Crosshair,
  Download,
  Eye,
  Handshake,
  Heart,
  Link2,
  MapPin,
  Mic,
  MoreHorizontal,
  Pause,
  PenTool,
  Pencil,
  Play,
  Plus,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
} from 'lucide-react'
import QuadGrid from '../../components/net/QuadGrid'
import { Art, Btn, Inset, NetCard, Tag } from '../../components/net/ui'
import styles from './StudioPage.module.css'

const TOOLS = ['Procreate 5X', 'Eurorack Modular', 'Ableton 12', 'Cinema 4D', 'Blender Eevee']

const TABS = [
  { id: 'all', label: 'All Works' },
  { id: 'visual', label: 'Visual Art' },
  { id: 'audio', label: 'Music & Audio' },
  { id: '3d', label: '3D & Motion' },
]

const WORKS = [
  { id: 'w1', kind: 'visual', title: 'Emerald Canyon Shrine', medium: 'Procreate / Digital 2D', note: 'Open for 3D swap', stat: '1.4k', statIcon: Eye, palette: 'forest', action: ArrowLeftRight, actionLabel: 'Propose swap' },
  { id: 'w2', kind: 'audio', title: 'Analog Resonance V', medium: 'Ableton / Ambient OST', note: 'Master Stems Included', stat: '860', statIcon: Heart, palette: 'dusk', action: Download, actionLabel: 'Request stems', audio: true },
  { id: 'w3', kind: '3d', title: 'Hydroponics Pod B', medium: 'Blender / Sci-Fi Scene', note: '.blend + PBR Textures', stat: '2.1k', statIcon: Eye, palette: 'neon', action: Box, actionLabel: 'Request source' },
]

const INITIAL_WISHES = [
  { icon: UserRound, title: 'Need: Rigged low-poly characters', sub: 'Fantasy or Cyberpunk bipedal models', priority: 'High Priority', tone: 'teal' },
  { icon: Mic, title: 'Need: Voice acting for animation trailer', sub: 'Deep narration tone (~45 seconds)', priority: 'Medium', tone: 'soft' },
  { icon: PenTool, title: 'Need: Logo redesign', sub: 'Monogram vector identity for synth lab', priority: 'Open', tone: 'grey' },
]

const STATS = [
  { label: 'Trade Reliability', value: '100%', sub: 'Zero disputes filed' },
  { label: 'Turnaround Speed', value: '2.4 Days', sub: 'Top 5% on MOA Space' },
  { label: 'Community Rating', value: '4.98', sub: 'Based on 36 peer reviews', stars: true },
]

const TESTIMONIALS = [
  { who: 'Elena Rostova (3D Animator)', when: '3d ago', text: '“Fast turnaround and high quality art! Traded a rigged mech model for two ambient stems. Will trade again!”' },
  { who: 'Marcus Vance (Game Dev)', when: '2w ago', text: '“Easy to collaborate with and completely transparent during asset handoff. Seamless trade escrow experience.”' },
]

const ACTIVITY = [
  { item: 'Ambient Loop Pack', result: 'Exchanged for UE5 Shaders' },
  { item: '2D Matte Matte Pack', result: 'Exchanged for UI Kit' },
  { item: 'Modular Sub-bass', result: 'Pending Escrow', pending: true },
]

const DEFAULT_STATEMENT =
  'I paint fantasy landscapes and build analog soundscapes on a modular rig. Every piece I trade is crafted by hand — I love swapping visuals for sound, and sound for motion, so each collaboration leaves both artists with something new.'

export default function StudioPage() {
  const [focus, setFocus] = useState(false)

  return (
    <div className={focus ? styles.focusMode : ''}>
      <Inset className={styles.statusBar}>
        <div className={styles.session}>
          <span className={styles.sessionDot} />
          <div>
            <p className={styles.sessionLabel}>LIVE STUDIO SESSION</p>
            <p className={`display ${styles.sessionTitle}`}>David K. — Creative Workspace &amp; Trade Ledger</p>
          </div>
        </div>
        <div className={styles.statusRight}>
          <Tag tone="teal" className={styles.verified}>
            <BadgeCheck size={14} /> Verified Creator
          </Tag>
          <Btn variant={focus ? 'primary' : 'outline'} size="sm" icon={Crosshair} onClick={() => setFocus((f) => !f)} aria-pressed={focus}>
            Focus Mode
          </Btn>
        </div>
      </Inset>

      <QuadGrid columns="456fr 744fr" joined className={styles.quads}>
        <Profile />
        <Gallery />
        <Wishlist />
        <StudioStats />
      </QuadGrid>

      <ProposeBand />
    </div>
  )
}

function QHead({ label, title, aside, badge }) {
  return (
    <div className={styles.qhead}>
      <div>
        <p className={styles.qlabel}>{label}</p>
        <h2 className={`display ${styles.qtitle}`}>
          {title}
          {badge}
        </h2>
      </div>
      {aside}
    </div>
  )
}

/* ---------------- Q1 ---------------- */
function Profile() {
  const [editing, setEditing] = useState(false)
  const [statement, setStatement] = useState(DEFAULT_STATEMENT)
  const [copied, setCopied] = useState(false)

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard can be unavailable (insecure context) — ignore */
    }
  }

  return (
    <NetCard
      className={styles.dimmable}
      footer={
        <div className={styles.profileActions}>
          <Btn size="lg" variant="primary" icon={editing ? Check : Pencil} className={styles.grow} onClick={() => setEditing((e) => !e)}>
            {editing ? 'Save Profile' : 'Edit Profile'}
          </Btn>
          <button type="button" className={styles.iconBtn} aria-label="Copy profile link" onClick={share}>
            {copied ? <Check size={15} /> : <Link2 size={15} />}
          </button>
          <button type="button" className={styles.iconBtn} aria-label="More">
            <MoreHorizontal size={15} />
          </button>
        </div>
      }
    >
      <div className={styles.overline}>
        <p className={styles.qlabel}>QUADRANT 01 // PROFILE</p>
        <Tag tone="teal">
          <span className={styles.liveDot} /> Available for Trades
        </Tag>
      </div>

      <div className={styles.hero}>
        <div className={styles.avatarWrap}>
          <Art palette="studio" radius={999} className={styles.avatar} alt="David K." />
          <span className={styles.verifiedBadge}>
            <Check size={10} strokeWidth={3} />
          </span>
        </div>
        <div>
          <div className={styles.nameRow}>
            <h1 className="display">David K.</h1>
            <Tag tone="soft">Lv. 4</Tag>
          </div>
          <p className={styles.disciplines}>Digital Painting · Modular Synthesizer · Motion Graphics</p>
          <p className={styles.location}>
            <MapPin size={12} /> Berlin / Remote Studio
          </p>
        </div>
      </div>

      <Inset className={styles.statement}>
        <p className={styles.statementHead}>
          <Quote size={14} /> Creative Statement
        </p>
        {editing ? (
          <textarea value={statement} onChange={(e) => setStatement(e.target.value)} rows={4} aria-label="Creative statement" />
        ) : (
          <p className={styles.statementText}>{statement}</p>
        )}
      </Inset>

      <p className={styles.toolsetLabel}>CORE TOOLSET</p>
      <div className={styles.tools}>
        {TOOLS.map((t) => (
          <Tag key={t} tone="grey" className={styles.tool}>
            {t}
          </Tag>
        ))}
      </div>
    </NetCard>
  )
}

/* ---------------- Q2 ---------------- */
function Gallery() {
  const [tab, setTab] = useState('all')
  const [playing, setPlaying] = useState(null)
  const [acted, setActed] = useState(new Set())
  const works = WORKS.filter((w) => tab === 'all' || w.kind === tab)

  return (
    <NetCard
      footer={
        <>
          <span className={styles.escrowNote}>
            <ShieldCheck size={14} /> Instant smart escrow contract enabled on all listed trade assets.
          </span>
          <a href="#creations" className={styles.footLink}>
            View All 18 Creations <ArrowRight size={12} strokeWidth={2.4} />
          </a>
        </>
      }
    >
      <div className={styles.galleryHead}>
        <QHead label="QUADRANT 02 // PORTFOLIO HUB" title="Artwork & Creations Gallery" badge={<span className={styles.activeCount}>18 Active</span>} />
        <div className={styles.tabs} role="tablist" aria-label="Gallery filter">
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={tab === t.id ? styles.tabOn : ''} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.works}>
        {works.map((w) => {
          const done = acted.has(w.id)
          const Action = done ? Check : w.action
          const StatIcon = w.statIcon
          return (
            <article key={w.id} className={styles.work}>
              <div className={styles.workArt}>
                <Art palette={w.palette} radius={0} className={styles.workImg} alt={w.title} />
                <span className={styles.available}>
                  <span /> Available to Trade
                </span>
                {w.audio && (
                  <button
                    type="button"
                    className={styles.playBtn}
                    aria-label={playing === w.id ? 'Pause preview' : 'Play preview'}
                    onClick={() => setPlaying((p) => (p === w.id ? null : w.id))}
                  >
                    {playing === w.id ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                  </button>
                )}
                <span className={styles.stat}>
                  <StatIcon size={11} /> {w.stat}
                </span>
                {playing === w.id && <span className={styles.eq} aria-hidden><span /><span /><span /><span /></span>}
              </div>
              <div className={styles.workBody}>
                <h3>{w.title}</h3>
                <p className={styles.workMedium}>{w.medium}</p>
                <div className={styles.workFoot}>
                  <span>{w.note}</span>
                  <button
                    type="button"
                    className={`${styles.workAction} ${done ? styles.workActionDone : ''}`}
                    aria-label={w.actionLabel}
                    title={done ? 'Sent' : w.actionLabel}
                    onClick={() => setActed((s) => new Set(s).add(w.id))}
                  >
                    <Action size={13} />
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </NetCard>
  )
}

/* ---------------- Q3 ---------------- */
function Wishlist() {
  const [wishes, setWishes] = useState(INITIAL_WISHES)
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState({ title: '', sub: '' })

  const add = (e) => {
    e.preventDefault()
    if (!draft.title.trim()) return
    setWishes((w) => [...w, { icon: Sparkles, title: `Need: ${draft.title.trim()}`, sub: draft.sub.trim() || 'Details on request', priority: 'Open', tone: 'grey' }])
    setDraft({ title: '', sub: '' })
    setAdding(false)
  }

  return (
    <NetCard
      className={styles.dimmable}
      footer={
        !adding && (
          <Btn size="lg" block icon={Plus} onClick={() => setAdding(true)}>
            Add Wishlist Item
          </Btn>
        )
      }
    >
      <QHead
        label="QUADRANT 03 // REQUEST LEDGER"
        title="My Trade Wishlist"
        aside={
          <button type="button" className={styles.iconBtnSm} aria-label="Add wishlist item" onClick={() => setAdding(true)}>
            <Plus size={13} />
          </button>
        }
      />
      <p className={styles.wishIntro}>What skills and assets this artist is currently looking for in exchange:</p>
      <div className={styles.wishes}>
        {wishes.map(({ icon: Icon, title, sub, priority, tone }) => (
          <Inset key={title} className={styles.wish}>
            <span className={styles.wishIcon}>
              <Icon size={15} />
            </span>
            <div className={styles.wishText}>
              <strong>{title}</strong>
              <span>{sub}</span>
            </div>
            <Tag tone={tone}>{priority}</Tag>
          </Inset>
        ))}
      </div>
      {adding && (
        <form className={styles.wishForm} onSubmit={add}>
          <input autoFocus placeholder="What do you need? e.g. Foley for teaser" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
          <input placeholder="Details (optional)" value={draft.sub} onChange={(e) => setDraft((d) => ({ ...d, sub: e.target.value }))} />
          <div className={styles.wishFormActions}>
            <Btn variant="ghost" size="sm" onClick={() => setAdding(false)}>
              Cancel
            </Btn>
            <Btn type="submit" size="sm" icon={Plus}>
              Add
            </Btn>
          </div>
        </form>
      )}
    </NetCard>
  )
}

/* ---------------- Q4 ---------------- */
function StudioStats() {
  return (
    <NetCard
      className={styles.dimmable}
      footer={
        <>
          <span>All past trades verified cryptographically on MOA Space network.</span>
          <a href="#reviews" className={styles.footLink}>
            Read all 36 reviews <ChevronRight size={13} strokeWidth={2.6} />
          </a>
        </>
      }
    >
      <QHead
        label="QUADRANT 04 // TRUST & METRICS"
        title="Studio Stats & Feedback"
        aside={
          <p className={styles.trust}>
            <BadgeCheck size={14} /> <strong>100% Positive Trades</strong> <span>• 42 Swaps Completed</span>
          </p>
        }
      />
      <div className={styles.stats}>
        {STATS.map((s) => (
          <Inset key={s.label} className={styles.statBox}>
            <p className={styles.statLabel}>{s.label}</p>
            <p className={`display ${styles.statValue}`}>
              {s.value}
              {s.stars && (
                <span className={styles.stars} aria-label="5 stars">
                  {[0, 1, 2].map((i) => (
                    <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
              )}
            </p>
            <p className={styles.statSub}>{s.sub}</p>
          </Inset>
        ))}
      </div>

      <div className={styles.twoCol}>
        <div>
          <p className={styles.colLabel}>VERIFIED TESTIMONIALS</p>
          <div className={styles.testimonials}>
            {TESTIMONIALS.map((t) => (
              <Inset key={t.who} className={styles.testimonial}>
                <div className={styles.tHead}>
                  <strong>{t.who}</strong>
                  <span>{t.when}</span>
                </div>
                <p>{t.text}</p>
              </Inset>
            ))}
          </div>
        </div>
        <div>
          <p className={styles.colLabel}>RECENT TRADE ACTIVITY</p>
          <div className={styles.activity}>
            {ACTIVITY.map((a) => (
              <Inset key={a.item} className={styles.activityRow}>
                <span className={styles.activityItem}>
                  <span className={a.pending ? styles.dotPending : styles.dotDone} />
                  {a.item}
                </span>
                <span className={a.pending ? styles.pendingText : styles.resultText}>{a.result}</span>
              </Inset>
            ))}
          </div>
        </div>
      </div>
    </NetCard>
  )
}

/* ---------------- CTA ---------------- */
function ProposeBand() {
  const [feedback, setFeedback] = useState(false)
  const [sent, setSent] = useState(false)
  const [text, setText] = useState('')

  return (
    <Inset className={styles.band}>
      <div className={styles.bandMain}>
        <div className={styles.bandText}>
          <span className={styles.bandIcon}>
            <Handshake size={18} />
          </span>
          <div>
            <h3>Want to propose a customized trade with David?</h3>
            <p>Select any piece from the gallery or make an offer directly against his active wishlist.</p>
          </div>
        </div>
        <div className={styles.bandActions}>
          <Link to="/contract" className={styles.bandPrimary}>
            <ArrowLeftRight size={14} /> Propose Direct Trade
          </Link>
          <Btn variant="outline" size="lg" onClick={() => setFeedback((f) => !f)} aria-expanded={feedback}>
            Leave Feedback
          </Btn>
        </div>
      </div>
      {feedback && (
        <form
          className={styles.feedback}
          onSubmit={(e) => {
            e.preventDefault()
            if (text.trim()) setSent(true)
          }}
        >
          {sent ? (
            <p className={styles.thanks}>
              <Check size={14} /> Thanks — your feedback was sent to David.
            </p>
          ) : (
            <>
              <textarea rows={3} placeholder="Share how your collaboration went…" value={text} onChange={(e) => setText(e.target.value)} />
              <Btn type="submit" size="md" iconRight={ArrowRight}>
                Send Feedback
              </Btn>
            </>
          )}
        </form>
      )}
    </Inset>
  )
}
