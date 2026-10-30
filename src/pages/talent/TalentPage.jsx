import { useMemo, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  BadgeCheck,
  Box,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Clock,
  Handshake,
  MapPin,
  Mic,
  Mountain,
  Palette,
  PenLine,
  Plus,
  Send,
} from 'lucide-react'
import QuadGrid from '../../components/net/QuadGrid'
import { Art, Btn, Eyebrow, Initials, Inset, NetCard, Tag, Title } from '../../components/net/ui'
import styles from './TalentPage.module.css'

const INTENTS = ['Looking for Collab', 'Skill Trade', 'Paid Commission']

const MEDIUMS = [
  { id: 'illustration', label: 'Illustration', icon: PenLine },
  { id: 'concept', label: 'Concept Art', icon: Mountain },
  { id: 'music', label: 'Music & Beats', icon: AudioLines },
  { id: '3d', label: '3D Models', icon: Box },
  { id: 'animation', label: 'Animation', icon: Clapperboard },
  { id: 'voice', label: 'Voice Acting', icon: Mic },
]

const ARTISTS = [
  {
    name: 'Mina Kova', status: 'Trade Open', specialty: 'Ethereal Concept & Matte Painting',
    tools: ['Blender', 'Photoshop'], style: 'Retro-Futurism', palette: 'neon',
    mediums: ['illustration', 'concept'], intents: ['Looking for Collab', 'Skill Trade'],
  },
  {
    name: 'Ren Haruki', status: 'Free Collab', specialty: 'Lo-fi & Cinematic Soundscapes',
    tools: ['Ableton', 'Moog'], style: 'Organic Beats', palette: 'ocean',
    mediums: ['music'], intents: ['Looking for Collab'],
  },
  {
    name: 'Sora Vance', status: 'Paid / Split', specialty: 'Character Sheets & Turnarounds',
    tools: ['Procreate', 'Clip Studio'], style: 'Graphic Novel', palette: 'paper', grey: true,
    mediums: ['illustration', 'animation'], intents: ['Paid Commission', 'Skill Trade'],
  },
  {
    name: 'Eliot Berg', status: 'Trade Open', specialty: 'Hard-surface & Game Prop Modeler',
    tools: ['ZBrush', 'Maya'], style: 'Low-Poly Fantasy', palette: 'forest',
    mediums: ['3d', 'illustration'], intents: ['Skill Trade', 'Looking for Collab'],
  },
]

const STILLS = ['dusk', 'ice', 'neon', 'ember', 'ocean', 'forest', 'teal', 'studio']

const INITIAL_REQUESTS = [
  {
    id: 1, initials: 'WB', title: 'Need background painter for webcomic', tag: 'Ongoing Series',
    body: '12-episode fantasy comic. Offering revenue share or character modeling trade',
    duration: '~3 Months', style: 'Semi-Realistic Cel Shading',
  },
  {
    id: 2, initials: 'SP', title: 'Synth producer offering mix & master for 3D album art', tag: 'Equal Trade', tagBelow: true,
    body: 'Have 5 finished synthwave tracks ready for your game/short, looking for high-quality 3D album art in return.',
    duration: '2 Weeks', style: '3D Cyber / Octane',
  },
  {
    id: 3, initials: 'VA', title: 'Voice actor seeking character illustration for portfolio banner', tag: 'Voice Trade', tagBelow: true,
    body: 'Offering up to 300 words of professional narration or character voice lines in exchange for a banner piece.',
    duration: '10 Days', style: 'Anime / Manga Portrait',
  },
]

const THREADS = [
  {
    id: 'kl', initials: 'KL', name: 'Kaelen Lo', preview: '"Sent the blender rig files, take a peek!"', time: '2m',
    messages: [
      { mine: false, text: 'Hey! Loved your lighting style on the latest piece. Are you free to take on 2 background paintings?' },
      { mine: true, text: "Yes! That sounds really fun. Let's make it an art trade for your animation reel." },
    ],
  },
  {
    id: 'nr', initials: 'NR', name: 'Nesta Ray', preview: '"Down for a reciprocal soundtrack trade?"', time: '1h',
    messages: [{ mine: false, text: 'Down for a reciprocal soundtrack trade? I can score a 2-minute loop for one of your stills.' }],
  },
]

export default function TalentPage() {
  return (
    <QuadGrid columns="709fr 499fr">
      <Directory />
      <Spotlight />
      <RequestsBoard />
      <QuickChat />
    </QuadGrid>
  )
}

/* ---------------- Q1: Find Collaborators ---------------- */
function Directory() {
  const [intent, setIntent] = useState(INTENTS[0])
  const [medium, setMedium] = useState('illustration')
  const [connected, setConnected] = useState(new Set())
  // the default view (as designed) shows every featured artist; filtering starts once the user picks one
  const [filtered, setFiltered] = useState(false)

  // the grid keeps its layout; artists outside the selected medium + intent are dimmed
  const isMatch = (a) => !filtered || (a.mediums.includes(medium) && a.intents.includes(intent))
  const matches = useMemo(
    () => (filtered ? ARTISTS.filter((a) => a.mediums.includes(medium) && a.intents.includes(intent)).length : ARTISTS.length),
    [filtered, intent, medium],
  )
  const artists = ARTISTS

  const connect = (name) => setConnected((s) => new Set(s).add(name))

  return (
    <NetCard
      footer={
        <>
          <span>
            Showing {matches} of 128 active artists
          </span>
          <a href="#peers" className={styles.footLink}>
            Browse all peers <ArrowUpRight size={12} strokeWidth={2.4} />
          </a>
        </>
      }
    >
      <div className={styles.dirHead}>
        <div>
          <Eyebrow label="Workspace • NW" sub="Live Directory" />
          <Title as="h1" size="lg" className={styles.mt2}>
            Find Collaborators
          </Title>
        </div>
        <div className={styles.segment} role="tablist" aria-label="Intent">
          {INTENTS.map((i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={intent === i}
              className={intent === i ? styles.segOn : ''}
              onClick={() => {
                setIntent(i)
                setFiltered(true)
              }}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.mediums} role="tablist" aria-label="Medium">
        {MEDIUMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={medium === id}
            className={`${styles.medium} ${medium === id ? styles.mediumOn : ''}`}
            onClick={() => {
              setMedium(id)
              setFiltered(true)
            }}
          >
            <Icon size={12} strokeWidth={2.2} aria-hidden />
            {label}
          </button>
        ))}
      </div>

      <div className={styles.artistGrid}>
        {artists.map((a) => {
          const dim = !isMatch(a)
          const done = connected.has(a.name)
          return (
            <Inset key={a.name} className={`${styles.artist} ${dim ? styles.dim : ''}`}>
              <div className={styles.artistTop}>
                <Art palette={a.palette} radius={6} className={styles.thumb} alt={`${a.name} artwork`} />
                <div className={styles.artistInfo}>
                  <div className={styles.artistNameRow}>
                    <h3 className={styles.artistName}>{a.name}</h3>
                    <Tag tone={a.grey ? 'grey' : 'teal'}>{a.status}</Tag>
                  </div>
                  <p className={styles.specialty}>{a.specialty}</p>
                  <div className={styles.tools}>
                    {a.tools.map((t) => (
                      <Tag key={t} tone="white">
                        {t}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.artistFoot}>
                <span>Style: {a.style}</span>
                <Btn
                  size="sm"
                  variant={done ? 'soft' : 'primary'}
                  iconRight={done ? Check : ArrowRight}
                  onClick={() => connect(a.name)}
                  disabled={done}
                >
                  {done ? 'Requested' : 'Connect'}
                </Btn>
              </div>
            </Inset>
          )
        })}
      </div>
    </NetCard>
  )
}

/* ---------------- Q2: Artist Spotlight ---------------- */
function Spotlight() {
  const [start, setStart] = useState(0)
  const [sent, setSent] = useState(false)
  const visible = [0, 1, 2].map((i) => (start + i) % STILLS.length)

  return (
    <NetCard>
      <div className={styles.rowBetween}>
        <Eyebrow label="Workspace • NE" sub="Artist Spotlight" />
        <Tag tone="soft">Featured Today</Tag>
      </div>

      <div className={styles.featured}>
        <div className={styles.featuredAvatar}>
          <Art palette="studio" radius={999} className={styles.avatar80} alt="Maya Linnea" />
          <span className={styles.onlineDot} />
        </div>
        <div>
          <Title size="md">Maya Linnea</Title>
          <p className={styles.featuredRole}>Independent Animator &amp; Visual Storyteller</p>
          <p className={styles.featuredLoc}>
            <MapPin size={12} strokeWidth={2.2} aria-hidden /> Berlin, DE • UTC+2
          </p>
        </div>
      </div>

      <Inset className={styles.pitch}>
        <p>
          &quot;Indie animator making short films. I have a finished 4-minute rough cut ready and I am looking for a
          soundtrack composer to bring the sound world alive.&quot;
        </p>
      </Inset>

      <div className={styles.stillsHead}>
        <span>Recent Frame Stills ({visible[0] + 1}/{STILLS.length})</span>
        <div className={styles.carouselBtns}>
          <button type="button" aria-label="Previous" onClick={() => setStart((s) => (s - 1 + STILLS.length) % STILLS.length)}>
            <ChevronLeft size={12} strokeWidth={2.4} />
          </button>
          <button type="button" aria-label="Next" onClick={() => setStart((s) => (s + 1) % STILLS.length)}>
            <ChevronRight size={12} strokeWidth={2.4} />
          </button>
        </div>
      </div>
      <div className={styles.stills}>
        {visible.map((i) => (
          <Art key={i} palette={STILLS[i]} radius={6} className={styles.still} alt={`Frame still ${i + 1}`} />
        ))}
      </div>

      <Btn size="lg" block icon={sent ? Check : Handshake} className={styles.cta} onClick={() => setSent(true)} disabled={sent}>
        {sent ? 'Trade Request Sent' : 'Send Art Trade Request'}
      </Btn>
      <div className={styles.trust}>
        <span>
          <BadgeCheck size={13} strokeWidth={2.2} /> Verified Artist
        </span>
        <span>
          <Clock size={12} strokeWidth={2.2} /> Responds in ~2h
        </span>
      </div>
    </NetCard>
  )
}

/* ---------------- Q3: Open Collab Requests ---------------- */
function RequestsBoard() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS)
  const [applied, setApplied] = useState(new Set())
  const [posting, setPosting] = useState(false)
  const [draft, setDraft] = useState({ title: '', body: '' })

  const post = (e) => {
    e.preventDefault()
    if (!draft.title.trim()) return
    setRequests((r) => [
      { id: Date.now(), initials: 'DK', title: draft.title.trim(), tag: 'New', body: draft.body.trim() || 'No description yet.', duration: 'Flexible', style: 'Open to styles', mine: true },
      ...r,
    ])
    setDraft({ title: '', body: '' })
    setPosting(false)
  }

  return (
    <NetCard
      footer={
        <>
          <span>Fresh requests refreshed 4m ago</span>
          <a href="#listings" className={styles.footLink}>
            View 34 more listings →
          </a>
        </>
      }
    >
      <div className={styles.rowBetween}>
        <div>
          <Eyebrow label="Workspace • SW" sub="Creative Board" />
          <Title size="md" className={styles.mt2}>
            Open Collab Requests
          </Title>
        </div>
        <Btn variant="outline" size="sm" icon={Plus} className={styles.postBtn} onClick={() => setPosting((p) => !p)}>
          Post a Request
        </Btn>
      </div>

      {posting && (
        <form className={styles.postForm} onSubmit={post}>
          <input
            autoFocus
            placeholder="What are you looking for?"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          />
          <input
            placeholder="What can you offer in return?"
            value={draft.body}
            onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
          />
          <div className={styles.postActions}>
            <Btn variant="ghost" size="sm" onClick={() => setPosting(false)}>
              Cancel
            </Btn>
            <Btn type="submit" size="sm">
              Post
            </Btn>
          </div>
        </form>
      )}

      <div className={styles.requests}>
        {requests.map((r) => {
          const done = applied.has(r.id)
          return (
            <Inset key={r.id} className={styles.request}>
              <Initials size={40}>{r.initials}</Initials>
              <div className={styles.requestBody}>
                <div className={r.tagBelow ? styles.reqTitleCol : styles.reqTitleRow}>
                  <h3>{r.title}</h3>
                  <Tag tone="teal">{r.tag}</Tag>
                </div>
                <p className={styles.reqText}>{r.body}</p>
                <p className={styles.reqMeta}>
                  <span>
                    <CalendarDays size={12} strokeWidth={2} /> {r.duration}
                  </span>
                  <span className={styles.bullet}>•</span>
                  <span>
                    <Palette size={12} strokeWidth={2} /> {r.style}
                  </span>
                </p>
              </div>
              {!r.mine && (
                <Btn
                  variant={done ? 'soft' : 'outline'}
                  size="sm"
                  className={styles.applyBtn}
                  icon={done ? Check : undefined}
                  onClick={() => setApplied((s) => new Set(s).add(r.id))}
                  disabled={done}
                >
                  {done ? 'Applied' : 'Apply to Collab'}
                </Btn>
              )}
            </Inset>
          )
        })}
      </div>
    </NetCard>
  )
}

/* ---------------- Q4: Quick Chat ---------------- */
function QuickChat() {
  const [threads, setThreads] = useState(THREADS)
  const [activeId, setActiveId] = useState('kl')
  const [draft, setDraft] = useState('')
  const active = threads.find((t) => t.id === activeId)

  const send = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setThreads((ts) => ts.map((t) => (t.id === activeId ? { ...t, messages: [...t.messages, { mine: true, text }] } : t)))
    setDraft('')
  }

  return (
    <NetCard className={styles.chatCard}>
      <div className={styles.rowBetween}>
        <Eyebrow label="Workspace • SE" sub="Messages" />
        <span className={styles.live}>
          <span /> Live
        </span>
      </div>
      <Title size="md" className={styles.mt2}>
        Quick Chat &amp; Inquiries
      </Title>

      <div className={styles.threads}>
        {threads.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`${styles.thread} ${t.id === activeId ? styles.threadOn : ''}`}
            onClick={() => setActiveId(t.id)}
          >
            <Initials size={32} tone={t.id === activeId ? 'teal' : 'slate'}>
              {t.initials}
            </Initials>
            <span className={styles.threadText}>
              <strong>{t.name}</strong>
              <span>{t.preview}</span>
            </span>
            <span className={styles.threadTime}>{t.time}</span>
          </button>
        ))}
      </div>

      <Inset className={styles.micro} aria-live="polite">
        {active.messages.map((m, i) =>
          m.mine ? (
            <p key={i} className={styles.outBubble}>
              {m.text}
            </p>
          ) : (
            <div key={i} className={styles.inRow}>
              <Initials size={24} tone="teal">
                {active.initials}
              </Initials>
              <p className={styles.inBubble}>{m.text}</p>
            </div>
          ),
        )}
      </Inset>

      <form className={styles.noteForm} onSubmit={send}>
        <label htmlFor="quick-note" className="visually-hidden">
          Note
        </label>
        <input
          id="quick-note"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Write a note to ${active.name.split(' ')[0]}...`}
          autoComplete="off"
        />
        <Btn type="submit" size="sm" iconRight={Send}>
          Send note
        </Btn>
      </form>
    </NetCard>
  )
}
