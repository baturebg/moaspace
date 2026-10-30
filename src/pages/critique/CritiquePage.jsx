import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  AudioLines,
  BadgeCheck,
  Check,
  CircleHelp,
  Eye,
  Flame,
  Heart,
  Maximize2,
  Minus,
  Palette,
  Pause,
  Play,
  Plus,
  PlusCircle,
  Ruler,
  Send,
  SunMedium,
} from 'lucide-react'
import QuadGrid from '../../components/net/QuadGrid'
import { Art, Btn, Initials, Inset, NetCard, Progress, Tag } from '../../components/net/ui'
import styles from './CritiquePage.module.css'

const RUBRIC = [
  { label: 'Color', score: 4.5 },
  { label: 'Comp', score: 4.8 },
  { label: 'Story', score: 4.0 },
]

const PINS = [
  { id: 1, x: 34, y: 28, icon: Ruler, text: 'Fix perspective on second colonnade arch' },
  { id: 2, x: 68, y: 64, icon: SunMedium, text: 'Lighting contrast needs a +1.2 EV bounce boost' },
]

const QUEUE = [
  { id: 'q1', title: 'Cyberpunk alleyway volumetric render', tag: '3D / BLENDER', user: '@kai_render', note: 'Seeking shader & neon bounce review', karma: 45, palette: 'neon' },
  { id: 'q2', title: 'Orchestral boss battle intro theme', tag: 'AUDIO / DAW', user: '@solis_sound', note: 'Brass mix mud at 250Hz, need feedback', karma: 60, audio: true },
  { id: 'q3', title: 'Character turnaround sheet: Astraea', tag: 'VISUAL DEV', user: '@hana_draws', note: 'Checking shoulder anatomy & silhouette weight', karma: 35, palette: 'paper' },
]

const VOICE_BARS = [8, 16, 20, 12, 24, 16, 8, 12, 20, 8, 16, 8]
const VOICE_LEN = 84

export default function CritiquePage() {
  const [karma, setKarma] = useState(840)
  const [quota, setQuota] = useState(5)
  const [requested, setRequested] = useState(false)

  const earn = (k) => {
    setKarma((v) => v + k)
    setQuota((q) => Math.min(7, q + 1))
  }

  return (
    <>
      <div className={styles.session}>
        <p className={styles.sessionLine}>
          <span className={styles.liveBadge}>
            <span /> LIVE CRITIQUE ROOM
          </span>
          <span className={styles.sessionLabel}>// Real-Time Artist Feedback Session:</span>
          <span className={styles.sessionCycle}>Cycle #409 • Neo-Brutalist Architecture &amp; Environmental Storytelling</span>
        </p>
        <div className={styles.sessionRow}>
          <div className={styles.reviewers}>
            <span className={styles.stack}>
              {['KR', 'VL', 'AM'].map((i) => (
                <Initials key={i} size={28} tone="slate">
                  {i}
                </Initials>
              ))}
            </span>
            <span>
              <strong>34 Verified Reviewers</strong> active now
            </span>
          </div>
          <Btn size="md" icon={requested ? Check : PlusCircle} onClick={() => setRequested(true)} disabled={requested}>
            {requested ? 'Review Requested' : 'Request Live Review'}
          </Btn>
        </div>
      </div>

      <QuadGrid columns="693fr 491fr" gap={16} stretch>
        <CanvasStage />
        <RubricPanel />
        <CritiqueQueue onEarn={earn} />
        <KarmaLedger karma={karma} quota={quota} />
      </QuadGrid>
    </>
  )
}

function SectionTag({ children, solid }) {
  return <span className={`${styles.sectionTag} ${solid ? styles.sectionTagSolid : ''}`}>{children}</span>
}

/* ---------------- Q1: canvas ---------------- */
function CanvasStage() {
  const [version, setVersion] = useState('A')
  const [zoom, setZoom] = useState(140)
  const [openPins, setOpenPins] = useState(new Set([1, 2]))
  const stageRef = useRef(null)

  const togglePin = (id) =>
    setOpenPins((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })

  return (
    <NetCard className={styles.tight}>
      <div className={styles.stageBar}>
        <div className={styles.stageTitle}>
          <span className={styles.canvasNo}>CANVAS #01</span>
          <h2>Sanctuary of the Sunken Spire — v3.4</h2>
          <span className={styles.by}>by @elysian_cadence</span>
        </div>
        <div className={styles.controls}>
          <div className={styles.ab} role="tablist" aria-label="Version">
            {['A', 'B'].map((v) => (
              <button key={v} type="button" role="tab" aria-selected={version === v} className={version === v ? styles.abOn : ''} onClick={() => setVersion(v)}>
                Vers. {v}
              </button>
            ))}
          </div>
          <div className={styles.zoom}>
            <button type="button" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(50, z - 10))}>
              <Minus size={12} />
            </button>
            <span>{zoom}%</span>
            <button type="button" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(300, z + 10))}>
              <Plus size={12} />
            </button>
          </div>
          <button type="button" className={styles.full} aria-label="Fullscreen" onClick={() => stageRef.current?.requestFullscreen?.()}>
            <Maximize2 size={13} />
          </button>
        </div>
      </div>

      <div className={styles.stage} ref={stageRef}>
        <div className={styles.stageArt} style={{ transform: `scale(${zoom / 140})` }}>
          <Art palette={version === 'A' ? 'ocean' : 'teal'} radius={0} className={styles.stageImg} alt="Sanctuary of the Sunken Spire" />
        </div>
        {PINS.map(({ id, x, y, icon: Icon, text }) => (
          <div key={id} className={styles.pin} style={{ left: `${x}%`, top: `${y}%` }}>
            {openPins.has(id) && (
              <span className={styles.pinTip}>
                <Icon size={12} /> {text}
              </span>
            )}
            <button type="button" className={styles.pinDot} aria-label={`Feedback pin ${id}`} aria-pressed={openPins.has(id)} onClick={() => togglePin(id)}>
              0{id}
            </button>
          </div>
        ))}
        <span className={styles.hud}>
          <Palette size={13} /> <strong>Current Layer: Composition Pass #3</strong> <span>• 3840 × 2160 Px</span>
        </span>
      </div>

      <Inset className={styles.brief}>
        <span className={styles.briefIcon}>
          <CircleHelp size={15} />
        </span>
        <div>
          <div className={styles.briefHead}>
            <span>ARTIST DIRECT BRIEF</span>
            <strong>Deadline: 2h remaining</strong>
          </div>
          <p>
            &quot;Seeking sharp feedback regarding color harmony &amp; spatial scale. Do the emerald bioluminescent tides
            clash with the atmospheric haze on the right horizon? Be ruthless on the focal depth!&quot;
          </p>
        </div>
      </Inset>
    </NetCard>
  )
}

/* ---------------- Q2: rubric & comments ---------------- */
function RubricPanel() {
  const [comments, setComments] = useState([])
  const [draft, setDraft] = useState('')
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(48)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setT((v) => (v >= VOICE_LEN ? 0 : v + 1)), 1000)
    return () => clearInterval(id)
  }, [playing])

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  const submit = (e) => {
    e.preventDefault()
    if (!draft.trim()) return
    setComments((c) => [...c, draft.trim()])
    setDraft('')
  }

  return (
    <NetCard className={styles.tight}>
      <div className={styles.headRow}>
        <div className={styles.headLeft}>
          <SectionTag>COMMUNITY RUBRIC</SectionTag>
          <h2 className={styles.h3}>Critique &amp; Scores</h2>
        </div>
        <span className={styles.aggregate}>4.4 / 5.0 Aggregated</span>
      </div>

      <Inset className={styles.rubric}>
        {RUBRIC.map((r) => (
          <div key={r.label}>
            <div className={styles.rubricLabel}>
              <span>{r.label}</span>
              <strong>{r.score.toFixed(1)}</strong>
            </div>
            <Progress value={(r.score / 5) * 100} height={6} />
          </div>
        ))}
      </Inset>

      <div className={styles.comments}>
        <article className={styles.comment}>
          <div className={styles.commentHead}>
            <span className={styles.who}>
              <Initials size={24} tone="teal">
                MK
              </Initials>
              <strong>Miriam Thorne</strong>
              <Tag tone="teal" className={styles.role}>
                STAFF CONCEPT LEAD
              </Tag>
            </span>
            <time>4m ago</time>
          </div>
          <p>
            The water displacement is staggering, but Pin #01 is spot on: the arch vanishing line falls flat toward the
            focal axis. Soften the edge fog and the depth will instantly 2x.
          </p>
        </article>

        <article className={styles.comment}>
          <div className={styles.commentHead}>
            <span className={styles.who}>
              <Initials size={24} tone="teal">
                DK
              </Initials>
              <strong>Devin Vance</strong>
              <Tag tone="grey" className={styles.role}>
                LIGHTING DIR.
              </Tag>
            </span>
            <span className={styles.voiceLabel}>Voice Critique</span>
          </div>
          <div className={styles.player}>
            <button type="button" className={styles.play} aria-label={playing ? 'Pause' : 'Play'} onClick={() => setPlaying((p) => !p)}>
              {playing ? <Pause size={11} fill="currentColor" /> : <Play size={11} fill="currentColor" />}
            </button>
            <span className={styles.voiceBars} aria-hidden>
              {VOICE_BARS.map((h, i) => (
                <span key={i} style={{ height: h, opacity: i / VOICE_BARS.length <= t / VOICE_LEN ? 1 : 0.3 }} />
              ))}
            </span>
            <span className={styles.voiceTime}>
              {fmt(t)} / {fmt(VOICE_LEN)}
            </span>
          </div>
        </article>

        {comments.map((c, i) => (
          <article key={i} className={styles.comment}>
            <div className={styles.commentHead}>
              <span className={styles.who}>
                <Initials size={24} tone="navy">
                  DK
                </Initials>
                <strong>You</strong>
              </span>
              <time>just now</time>
            </div>
            <p>{c}</p>
          </article>
        ))}
      </div>

      <form className={styles.post} onSubmit={submit}>
        <label htmlFor="critique-note" className="visually-hidden">
          Critique note
        </label>
        <input
          id="critique-note"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Drop timestamped note or pinned coordinate..."
          autoComplete="off"
        />
        <Btn type="submit" size="md" icon={Send} className={styles.submit}>
          Submit
        </Btn>
      </form>
    </NetCard>
  )
}

/* ---------------- Q3: queue ---------------- */
function CritiqueQueue({ onEarn }) {
  const [reviewed, setReviewed] = useState(new Set())

  return (
    <NetCard
      className={styles.tight}
      footer={
        <>
          <span className={styles.footNote}>Displaying 3 of 18 pending submissions in your disciplines</span>
          <a href="#roster" className={styles.footLink}>
            View Full Critique Roster <ArrowRight size={11} strokeWidth={2.6} />
          </a>
        </>
      }
    >
      <div className={styles.headRow}>
        <div className={styles.headLeft}>
          <SectionTag>COMMUNITY QUEUE</SectionTag>
          <h2 className={styles.h3}>WIPs Waiting for Critique</h2>
        </div>
        <span className={styles.sort}>Sort by: Highest Karma Payout</span>
      </div>
      <div className={styles.queue}>
        {QUEUE.map((q) => {
          const done = reviewed.has(q.id)
          return (
            <Inset key={q.id} className={styles.queueItem}>
              {q.audio ? (
                <span className={styles.audioThumb}>
                  <AudioLines size={20} />
                </span>
              ) : (
                <Art palette={q.palette} radius={4} className={styles.queueThumb} alt={q.title} />
              )}
              <div className={styles.queueText}>
                <h3>
                  {q.title} <Tag tone="grey" className={styles.qTag}>{q.tag}</Tag>
                </h3>
                <p>
                  Requested by <span>{q.user}</span> • &quot;{q.note}&quot;
                </p>
              </div>
              <div className={styles.queueActions}>
                <span className={styles.karma}>+{q.karma} Karma</span>
                <Btn
                  size="sm"
                  variant={done ? 'soft' : 'primary'}
                  icon={done ? Check : undefined}
                  disabled={done}
                  onClick={() => {
                    setReviewed((s) => new Set(s).add(q.id))
                    onEarn(q.karma)
                  }}
                >
                  {done ? 'Reviewed' : 'Review & Earn'}
                </Btn>
              </div>
            </Inset>
          )
        })}
      </div>
    </NetCard>
  )
}

/* ---------------- Q4: karma ---------------- */
function KarmaLedger({ karma, quota }) {
  const [redeemed, setRedeemed] = useState(false)
  const pct = Math.round((quota / 7) * 100)

  return (
    <NetCard className={styles.tight}>
      <div className={styles.headRow}>
        <div className={styles.headLeft}>
          <SectionTag solid>REPUTATION</SectionTag>
          <h2 className={styles.h3}>Karma Ledger</h2>
        </div>
        <span className={styles.tier}>
          <BadgeCheck size={16} /> Tier 3 Mentor
        </span>
      </div>

      <div className={styles.hero}>
        <span className={styles.heroCircle} />
        <div>
          <p className={styles.heroLabel}>AVAILABLE CRITIQUE KARMA</p>
          <p className={styles.heroValue}>
            <span className="display">{karma}</span> KP
          </p>
          <p className={styles.heroNote}>= {Math.floor(karma / 400)} Free Featured Discovery Spotlights</p>
        </div>
        <div className={styles.heroSide}>
          <span className={styles.streak}>
            <Flame size={12} /> 14 Day Streak
          </span>
          <button type="button" className={styles.redeem} onClick={() => setRedeemed(true)} disabled={redeemed}>
            {redeemed ? 'Perks Redeemed' : 'Redeem Perks'}
          </button>
        </div>
      </div>

      <p className={styles.accoladesLabel}>PEER ACCOLADES BESTOWED</p>
      <div className={styles.accolades}>
        <Inset className={styles.accolade}>
          <span className={styles.accIcon}>
            <Eye size={17} />
          </span>
          <span>
            <strong>Eagle Eye</strong>
            <small>32 Anatomy Catches</small>
          </span>
        </Inset>
        <Inset className={styles.accolade}>
          <span className={styles.accIcon}>
            <Heart size={15} />
          </span>
          <span>
            <strong>Encouraging Mentor</strong>
            <small>48 Helpful Votes</small>
          </span>
        </Inset>
      </div>

      <div className={styles.quotaRow}>
        <span>Weekly Studio Quota ({quota}/7 Critiques)</span>
        <strong>{pct}% Complete</strong>
      </div>
      <Progress value={pct} />
    </NetCard>
  )
}
