import { useEffect, useRef, useState } from 'react'
import {
  AudioLines,
  Check,
  CheckCircle2,
  Download,
  Flag,
  Image as ImageIcon,
  Layers,
  ListChecks,
  Lock,
  MapPin,
  MessagesSquare,
  Mic,
  Pause,
  Paperclip,
  Play,
  Plus,
  RefreshCw,
  Repeat,
  Send,
  ShieldCheck,
  Smile,
  Upload,
  Users,
} from 'lucide-react'
import QuadGrid from '../../components/net/QuadGrid'
import { Art, Btn, Initials, Inset, NetCard, Tag } from '../../components/net/ui'
import styles from './LiveRoomPage.module.css'

const STATUS_FLOW = ['UPCOMING', 'IN PROGRESS', 'IN REVIEW', 'DONE']
const STATUS_WEIGHT = { DONE: 1, 'IN REVIEW': 0.9, 'IN PROGRESS': 0.7, UPCOMING: 0 }
const STATUS_TONE = { DONE: 'solid', 'IN REVIEW': 'sky', 'IN PROGRESS': 'teal', UPCOMING: 'grey' }

const INITIAL_STAGES = [
  { name: 'Concept Art', status: 'DONE' },
  { name: 'Soundtrack Draft', status: 'IN REVIEW' },
  { name: '3D Character Models', status: 'IN PROGRESS' },
  { name: 'Final Composite', status: 'UPCOMING' },
]

const WAVE = [12, 20, 32, 24, 40, 28, 36, 16, 32, 24, 12, 20, 28, 8, 24, 16, 36, 20, 12, 28, 16, 8]
const STEM_LEN = 108

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export default function LiveRoomPage() {
  const [stages, setStages] = useState(INITIAL_STAGES)
  const [messages, setMessages] = useState([
    { id: 1, who: 'ER', name: 'Elena R.', time: '11:24 AM', text: 'Uploaded the drum stems, check if they fit the boss fight scene tempo.', reactions: { '🔥': 2, '🎧': 1 } },
    { id: 2, who: 'DK', name: 'David K.', time: '11:27 AM', text: 'Perfect tempo, working on the synth lead now! The low end punch is great.', reactions: { '🙌': 2 } },
  ])
  const [pins, setPins] = useState([
    { id: 1, x: 33, y: 25, who: 'Elena', text: 'Increase neon hue', tone: 'sky' },
    { id: 2, x: 40, y: 61, who: 'David', text: 'Stem sync pt #2', tone: 'teal' },
  ])
  const [draftName, setDraftName] = useState(null)
  const [sync, setSync] = useState('0.4s')

  const resync = () => {
    setSync(null)
    setTimeout(() => setSync(`${(0.2 + Math.random() * 0.4).toFixed(1)}s`), 900)
  }

  const exportRoom = () => {
    const data = { room: 'LIVE ROOM #842', project: 'Cyberpunk Indie Game Demo', stages, pins, messages, exportedAt: new Date().toISOString() }
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'moa-live-room-842.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className={styles.roomBar}>
        <div className={styles.roomTitle}>
          <span className={styles.liveLabel}>
            <span /> LIVE ROOM #842
          </span>
          <span className={styles.slash}>/</span>
          <h1 className="display">Cyberpunk Indie Game Demo</h1>
          <Tag tone="teal">Co-op Session</Tag>
        </div>
        <div className={styles.roomActions}>
          <span className={styles.stack}>
            <Initials size={28} tone="teal">EK</Initials>
            <Initials size={28} tone="sky">DR</Initials>
            <Initials size={28} tone="slate">+1</Initials>
          </span>
          <Btn variant="soft" size="sm" icon={sync ? CheckCircle2 : RefreshCw} onClick={resync} className={sync ? '' : styles.spinning}>
            {sync ? `Synced (${sync})` : 'Syncing…'}
          </Btn>
          <Btn variant="outline" size="sm" icon={Download} onClick={exportRoom}>
            Export Room
          </Btn>
        </div>
      </div>

      <QuadGrid columns="770fr 414fr" gap={16}>
        <CanvasQuadrant pins={pins} setPins={setPins} draftName={draftName} setDraftName={setDraftName} />
        <Milestones stages={stages} setStages={setStages} />
        <Discussion messages={messages} setMessages={setMessages} />
        <Members />
      </QuadGrid>
    </>
  )
}

function QHead({ icon: Icon, n, title, aside }) {
  return (
    <div className={styles.qhead}>
      <div className={styles.qleft}>
        <span className={styles.qicon}>
          <Icon size={15} />
        </span>
        <div>
          <p className={styles.qlabel}>QUADRANT {n}</p>
          <h2 className={`display ${styles.qtitle}`}>{title}</h2>
        </div>
      </div>
      {aside}
    </div>
  )
}

/* ---------------- Q1 ---------------- */
function CanvasQuadrant({ pins, setPins, draftName, setDraftName }) {
  const [pinMode, setPinMode] = useState(false)
  const [editing, setEditing] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(42)
  const [loop, setLoop] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setT((v) => {
        if (v + 1 < STEM_LEN) return v + 1
        return loop ? 0 : STEM_LEN
      })
    }, 1000)
    return () => clearInterval(id)
  }, [playing, loop])

  const isPlaying = playing && t < STEM_LEN

  const placePin = (e) => {
    if (!pinMode) return
    const r = e.currentTarget.getBoundingClientRect()
    const id = Date.now()
    setPins((p) => [...p, { id, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, who: 'David', text: '', tone: 'teal' }])
    setEditing(id)
    setPinMode(false)
  }

  return (
    <NetCard>
      <QHead
        icon={ImageIcon}
        n="01"
        title="Project Canvas & Assets"
        aside={
          <div className={styles.canvasActions}>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && setDraftName(e.target.files[0].name)} />
            <Btn size="sm" icon={Upload} onClick={() => fileRef.current?.click()}>
              Upload New Draft
            </Btn>
            <Btn size="sm" variant={pinMode ? 'primary' : 'soft'} icon={MapPin} onClick={() => setPinMode((m) => !m)} aria-pressed={pinMode}>
              {pinMode ? 'Click canvas…' : 'Leave Pin Note'}
            </Btn>
          </div>
        }
      />

      <div className={styles.viewport}>
        <div className={`${styles.canvas} ${pinMode ? styles.pinMode : ''}`} onClick={placePin}>
          <Art palette="neon" radius={8} className={styles.canvasArt} alt="Cyberpunk city concept" />
          <span className={styles.canvasShade} />
          {pins.map((p) => (
            <span
              key={p.id}
              className={`${styles.pin} ${p.tone === 'sky' ? styles.pinSky : ''}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className={styles.pinDot} />
              {editing === p.id ? (
                <input
                  autoFocus
                  className={styles.pinInput}
                  placeholder="Type note, Enter to save"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const text = e.currentTarget.value.trim()
                      setPins((ps) => (text ? ps.map((x) => (x.id === p.id ? { ...x, text } : x)) : ps.filter((x) => x.id !== p.id)))
                      setEditing(null)
                    }
                    if (e.key === 'Escape') {
                      setPins((ps) => ps.filter((x) => x.id !== p.id))
                      setEditing(null)
                    }
                  }}
                />
              ) : (
                `${p.who}: ${p.text}`
              )}
            </span>
          ))}
          <span className={styles.viewPill}>
            Canvas {draftName ? 'v4.3' : 'v4.2'} • 3840×2160 <span className={styles.dotSep} /> Zoom 100%
          </span>
          {draftName && <span className={styles.draftTag}>New draft: {draftName}</span>}
        </div>

        <div className={styles.rail}>
          <Inset className={styles.mood}>
            <div className={styles.railHead}>
              <span>SHARED MOODBOARD</span>
              <span className={styles.muted}>{draftName ? 5 : 4} files</span>
            </div>
            <div className={styles.moodGrid}>
              <Art palette="ocean" radius={4} className={styles.moodImg} alt="Moodboard 1" />
              <Art palette="ember" radius={4} className={styles.moodImg} alt="Moodboard 2" />
            </div>
          </Inset>

          <Inset className={styles.stem}>
            <p className={styles.stemName}>
              <AudioLines size={14} /> Boss_Combat_Loop_BPM142
            </p>
            <p className={styles.stemLen}>01:48</p>
            <p className={styles.stemMeta}>Stem: 24bit WAV • Master Bus</p>
            <div className={styles.wave} aria-hidden>
              {WAVE.map((h, i) => (
                <span key={i} style={{ height: h, opacity: i / WAVE.length <= t / STEM_LEN ? 1 : 0.3 }} />
              ))}
            </div>
            <div className={styles.stemControls}>
              <button
                type="button"
                className={styles.playBtn}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                onClick={() => {
                  if (t >= STEM_LEN) setT(0)
                  setPlaying(!isPlaying)
                }}
              >
                {isPlaying ? <Pause size={11} fill="currentColor" /> : <Play size={11} fill="currentColor" />}
              </button>
              <span className={styles.stemTime}>
                <strong>{fmt(t)}</strong> / {fmt(STEM_LEN)}
              </span>
              <button type="button" className={`${styles.loopBtn} ${loop ? styles.loopOn : ''}`} aria-label="Loop" aria-pressed={loop} onClick={() => setLoop((l) => !l)}>
                <Repeat size={12} />
              </button>
            </div>
          </Inset>
        </div>
      </div>
    </NetCard>
  )
}

/* ---------------- Q2 ---------------- */
function Milestones({ stages, setStages }) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const pct = Math.round((stages.reduce((s, x) => s + STATUS_WEIGHT[x.status], 0) / stages.length) * 100)
  // the design counts delivered-for-review work as an achieved milestone
  const done = stages.filter((s) => s.status === 'DONE' || s.status === 'IN REVIEW').length
  const R = 28
  const C = 2 * Math.PI * R

  const advance = (i) =>
    setStages((ss) => ss.map((s, j) => (j === i ? { ...s, status: STATUS_FLOW[(STATUS_FLOW.indexOf(s.status) + 1) % STATUS_FLOW.length] } : s)))

  const add = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setStages((ss) => [...ss, { name: name.trim(), status: 'UPCOMING' }])
    setName('')
    setAdding(false)
  }

  return (
    <NetCard
      footer={
        adding ? (
          <form className={styles.addForm} onSubmit={add}>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Deliverable name" />
            <Btn type="submit" size="sm">
              Add
            </Btn>
          </form>
        ) : (
          <Btn variant="soft" size="md" block icon={Plus} onClick={() => setAdding(true)}>
            Add Custom Deliverable
          </Btn>
        )
      }
    >
      <QHead icon={ListChecks} n="02" title="Milestones & Tasks" aside={<Tag tone="soft">Sprint 02</Tag>} />

      <Inset className={styles.ringBox}>
        <div className={styles.ring}>
          <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden>
            <circle cx="32" cy="32" r={R} fill="none" stroke="var(--border)" strokeWidth="6" />
            <circle
              cx="32"
              cy="32"
              r={R}
              fill="none"
              stroke="var(--teal)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - pct / 100)}
              transform="rotate(-90 32 32)"
              style={{ transition: 'stroke-dashoffset 0.4s ease' }}
            />
          </svg>
          <span className="display">{pct}%</span>
        </div>
        <div>
          <p className={styles.ringTitle}>{pct}% Complete</p>
          <p className={styles.ringSub}>
            {done} of {stages.length} key milestones achieved. Alpha assembly ready next Tuesday.
          </p>
        </div>
      </Inset>

      <ol className={styles.stages}>
        {stages.map((s, i) => (
          <li key={s.name}>
            <button type="button" className={styles.stage} onClick={() => advance(i)} title="Click to advance status">
              <span className={`${styles.stageCheck} ${s.status === 'DONE' ? styles.stageDone : ''}`}>
                {s.status === 'DONE' ? <Check size={11} strokeWidth={3} /> : s.status === 'UPCOMING' ? <Flag size={10} /> : <Layers size={10} />}
              </span>
              <span className={styles.stageName}>
                {i + 1}. {s.name}
              </span>
              <Tag tone={STATUS_TONE[s.status]}>{s.status}</Tag>
            </button>
          </li>
        ))}
      </ol>
    </NetCard>
  )
}

/* ---------------- Q3 ---------------- */
function Discussion({ messages, setMessages }) {
  const [draft, setDraft] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length])

  const send = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    setMessages((m) => [...m, { id: Date.now(), who: 'DK', name: 'David K.', time, text, reactions: {} }])
    setDraft('')
  }

  const react = (id, emoji) =>
    setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, reactions: { ...m.reactions, [emoji]: (m.reactions[emoji] || 0) + 1 } } : m)))

  return (
    <NetCard>
      <QHead
        icon={MessagesSquare}
        n="03"
        title="Artist Notes & Discussion"
        aside={
          <span className={styles.typing}>
            <span /> Elena typing...
          </span>
        }
      />
      <div className={styles.feed} ref={listRef}>
        {messages.map((m) => (
          <div key={m.id} className={styles.msg}>
            <Initials size={32} tone={m.who === 'DK' ? 'teal' : 'sky'}>
              {m.who}
            </Initials>
            <Inset className={styles.msgBody}>
              <div className={styles.msgHead}>
                <strong>{m.name}</strong>
                <time>{m.time}</time>
              </div>
              <p>{m.text}</p>
              <div className={styles.reactions}>
                {Object.entries(m.reactions).map(([emoji, n]) => (
                  <button key={emoji} type="button" onClick={() => react(m.id, emoji)}>
                    {emoji} {n}
                  </button>
                ))}
                <button type="button" className={styles.addReaction} aria-label="Add reaction" onClick={() => react(m.id, '👍')}>
                  <Smile size={12} />
                </button>
              </div>
            </Inset>
          </div>
        ))}
      </div>
      <form className={styles.composer} onSubmit={send}>
        <button type="button" className={styles.composerIcon} aria-label="Attach file">
          <Paperclip size={15} />
        </button>
        <button type="button" className={styles.composerIcon} aria-label="Voice note">
          <Mic size={15} />
        </button>
        <label htmlFor="room-msg" className="visually-hidden">
          Message
        </label>
        <input id="room-msg" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write to Elena & David... (Press Enter to share)" autoComplete="off" />
        <Btn type="submit" size="md" iconRight={Send}>
          Send
        </Btn>
      </form>
    </NetCard>
  )
}

/* ---------------- Q4 ---------------- */
function Members() {
  return (
    <NetCard>
      <QHead icon={Users} n="04" title="Members & Rights" aside={<Lock size={15} className={styles.lockIcon} aria-label="Rights locked" />} />
      <div className={styles.roster}>
        <Inset className={styles.member}>
          <Initials size={32} tone="teal">
            DK
          </Initials>
          <span className={styles.memberText}>
            <strong>David K.</strong>
            <span>Lead Audio Composer</span>
          </span>
          <Tag tone="solid">Host</Tag>
        </Inset>
        <Inset className={styles.member}>
          <Initials size={32} tone="sky">
            ER
          </Initials>
          <span className={styles.memberText}>
            <strong>Elena R.</strong>
            <span>3D Character Artist</span>
          </span>
          <Tag tone="sky">Co-Creator</Tag>
        </Inset>
      </div>
      <div className={styles.rights}>
        <ShieldCheck size={20} className={styles.rightsIcon} />
        <div>
          <strong>Shared 50/50 Creative Rights</strong>
          <p>Equal IP splits &amp; automated royalty smart contract</p>
        </div>
        <Tag tone="solid" className={styles.signed}>
          <Check size={11} strokeWidth={3} /> Signed
        </Tag>
      </div>
    </NetCard>
  )
}
