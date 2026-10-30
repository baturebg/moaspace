import { useRef, useState } from 'react'
import {
  ArrowLeftRight,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Circle,
  FileArchive,
  FileImage,
  FileUp,
  Handshake,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  WandSparkles,
} from 'lucide-react'
import QuadGrid from '../../components/net/QuadGrid'
import { Art, Btn, Inset, NetCard, Progress, Tag } from '../../components/net/ui'
import PageIntro from '../../components/net/PageIntro'
import styles from './TradesPage.module.css'

const INITIAL_TRADES = [
  {
    id: 't1', status: 'In Progress', statusTone: 'teal', give: '3D Character Rigging', get: 'Acoustic Guitar OST',
    partner: 'Maya Lin', role: 'Sound Designer', due: 'Due in 4 days', stage: 'Stage: Draft Review', progress: 70,
    progressLabel: '70% Milestone',
  },
  {
    id: 't2', status: 'Waiting on Artist', statusTone: 'muted', give: 'Modular Font Set', get: 'Cyberpunk Splash Art',
    partner: 'Julian Vance', role: 'Illustrator', due: 'Due in 8 days', stage: 'Stage: Concept Approval', progress: 35,
    progressLabel: '35% Milestone',
  },
  {
    id: 't3', status: 'Completed & Locked', statusTone: 'teal', give: 'Brand Identity Pack', get: 'Motion Title Sequence',
    partner: 'Amina Sato', role: 'Motion Designer', due: 'Ready for Release', dueTone: 'teal', stage: 'Both final archives uploaded',
    progress: 100, progressLabel: '100%',
  },
]

const INITIAL_OFFERS = [
  {
    id: 'o1', name: 'Clara Wu', time: '2h ago', palette: 'dusk', offer: 'Original Oil Texture Pack & Brushes',
    want: '3D Blender Procedural Clay Shader', role: 'Texture Artist',
  },
  {
    id: 'o2', name: 'Devon Vance', time: 'Yesterday', palette: 'forest', offer: 'Interactive Micro-Site Design (Figma)',
    want: 'Character Rigging Animation Cycle', role: 'Web Designer',
  },
]

const INITIAL_FILES = [
  { name: 'Rough_Storyboard_v2.pdf', meta: 'Watermarked preview · 18 MB', status: 'Approved', icon: FileImage },
  { name: 'Hero_Character_Rig_Final.zip', meta: 'High-res final files · 410 MB', status: 'Locked in Escrow', icon: FileArchive, locked: true },
]

const CHECKLIST = [
  'Scope written & milestone confirmed',
  'Watermarked progress previews signed off',
  'Master assets uploaded to secure escrow',
  'Mutual release confirmation (Awaiting Partner)',
]

export default function TradesPage() {
  const [trades, setTrades] = useState(INITIAL_TRADES)
  const [offers, setOffers] = useState(INITIAL_OFFERS)

  const acceptOffer = (offer) => {
    setOffers((os) => os.filter((o) => o.id !== offer.id))
    setTrades((ts) => [
      {
        id: offer.id, status: 'Just Started', statusTone: 'teal', give: offer.want, get: offer.offer,
        partner: offer.name, role: offer.role, due: 'Due in 14 days', stage: 'Stage: Scope Agreement', progress: 5,
        progressLabel: '5% Milestone',
      },
      ...ts,
    ])
  }

  return (
    <>
      <PageIntro
        icon={ArrowLeftRight}
        title="Art & Skill Trades"
        badge="ESCROW PROTECTED"
        subtitle="Decentralized creative barter workspace. Plain terms: I craft this for you, you craft that for me."
        aside={
          <>
            <span className={styles.statusPill}>
              <span className={styles.dot} />
              <strong>{trades.length} Trades Active</strong>
              <span>· 2 Pending Deliveries</span>
            </span>
            <Btn size="md" icon={Plus}>
              Propose New Trade
            </Btn>
          </>
        }
      />
      <QuadGrid columns="497fr 687fr" gap={16}>
        <ActiveTrades trades={trades} />
        <TradeStudio />
        <IncomingOffers offers={offers} onAccept={acceptOffer} onRemove={(id) => setOffers((os) => os.filter((o) => o.id !== id))} />
        <ProtectionLocker />
      </QuadGrid>
    </>
  )
}

function QHead({ n, title, aside }) {
  return (
    <div className={styles.qhead}>
      <h2 className={styles.qtitle}>
        <span className={styles.qnum}>QUADRANT {n}</span>
        <span className={styles.qslash}>/</span>
        <span className="display">{title}</span>
      </h2>
      {aside}
    </div>
  )
}

/* ---------------- Q1 ---------------- */
function ActiveTrades({ trades }) {
  return (
    <NetCard
      footer={
        <>
          <span>Automated fair arbitration active</span>
          <a href="#archive" className={styles.footLink}>
            View trade archive <ArrowRight size={12} strokeWidth={2.4} />
          </a>
        </>
      }
    >
      <QHead n="01" title="My Active Trades" aside={<Tag tone="grey">{trades.length} Active Barters</Tag>} />
      <div className={styles.tradeList}>
        {trades.map((t) => (
          <Inset key={t.id} className={styles.trade}>
            <div className={styles.tradeTop}>
              <div>
                <p className={`${styles.status} ${t.statusTone === 'muted' ? styles.statusMuted : ''}`}>{t.status}</p>
                <h3 className={styles.tradeTitle}>
                  {t.give} <span className={styles.arrow}>➔</span> {t.get}
                </h3>
                <p className={styles.partner}>
                  Partner: <span>{t.partner}</span> ({t.role})
                </p>
              </div>
              <Tag tone={t.dueTone === 'teal' ? 'teal' : 'soft'} className={styles.due}>
                {t.due}
              </Tag>
            </div>
            <div className={styles.progressRow}>
              <span>{t.stage}</span>
              <strong>{t.progressLabel}</strong>
            </div>
            <Progress value={t.progress} />
          </Inset>
        ))}
      </div>
    </NetCard>
  )
}

/* ---------------- Q2 ---------------- */
function TradeStudio() {
  const [revisions, setRevisions] = useState(2)
  const [editing, setEditing] = useState(false)
  const [changeRequested, setChangeRequested] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  return (
    <NetCard>
      <QHead n="02" title="Trade Studio & Comparison" aside={<Tag tone="soft">Draft Agreement #TR-882</Tag>} />

      <div className={styles.compare}>
        <Inset className={styles.side}>
          <div className={styles.sideHead}>
            <span className={styles.sideLabel}>What I Give</span>
            <Tag tone="soft">You (Creator)</Tag>
          </div>
          <h3 className={styles.sideTitle}>2 Concept Art Illustrations</h3>
          <p className={styles.sideText}>Sci-fi environment matte paintings, layered PSDs + high-res 4K renders.</p>
          <Art palette="neon" icon={WandSparkles} label="Asset: Portfolio_Set_04.psd" radius={4} className={styles.sideArt} />
          <ul className={styles.checks}>
            <li>
              <CheckCircle2 size={13} /> {revisions} Revision{revisions === 1 ? '' : 's'} included
              {editing && (
                <span className={styles.stepper}>
                  <button type="button" aria-label="Fewer revisions" onClick={() => setRevisions((r) => Math.max(0, r - 1))}>
                    <Minus size={10} />
                  </button>
                  <button type="button" aria-label="More revisions" onClick={() => setRevisions((r) => r + 1)}>
                    <Plus size={10} />
                  </button>
                </span>
              )}
            </li>
            <li>
              <CheckCircle2 size={13} /> Commercial license transfer
            </li>
          </ul>
          <Btn variant="soft" size="md" block icon={editing ? Check : SlidersHorizontal} onClick={() => setEditing((e) => !e)}>
            {editing ? 'Done Editing' : 'Modify My Deliverables'}
          </Btn>
        </Inset>

        <Inset className={styles.side}>
          <div className={styles.sideHead}>
            <span className={`${styles.sideLabel} ${styles.teal}`}>What I Get</span>
            <Tag tone="teal">Felix Thorne</Tag>
          </div>
          <h3 className={styles.sideTitle}>Sound Design &amp; Foley (60s Teaser)</h3>
          <p className={styles.sideText}>Mastered stereo audio stem, synth accents, organic tactile impact recordings.</p>
          <Art palette="studio" label="Format: 24bit / 48kHz WAV" radius={4} className={styles.sideArt} />
          <ul className={styles.checks}>
            <li>
              <CheckCircle2 size={13} /> Full sync-sound stem stems
            </li>
            <li>
              <CheckCircle2 size={13} /> Royalty-free festival rights
            </li>
          </ul>
          <Btn
            variant="soft"
            size="md"
            block
            icon={changeRequested ? Check : SlidersHorizontal}
            onClick={() => setChangeRequested(true)}
            disabled={changeRequested}
          >
            {changeRequested ? 'Change Requested' : 'Request Deliverable Change'}
          </Btn>
        </Inset>
      </div>

      <div className={styles.score}>
        <p>
          <BadgeCheck size={20} className={styles.scoreIcon} />
          <span>
            Equitable Barter Score: <b>9.8</b> / 10. Estimated effort parity matched.
          </span>
        </p>
        <Btn size="lg" icon={confirmed ? Check : Handshake} onClick={() => setConfirmed(true)} disabled={confirmed}>
          {confirmed ? 'Agreement Confirmed' : 'Confirm Trade Agreement'}
        </Btn>
      </div>
    </NetCard>
  )
}

/* ---------------- Q3 ---------------- */
function IncomingOffers({ offers, onAccept, onRemove }) {
  const [countered, setCountered] = useState(new Set())

  return (
    <NetCard
      footer={
        <>
          <span>Proposals auto-expire in 72 hours</span>
          <a href="#prefs" className={styles.footLink}>
            Trade preferences <SlidersHorizontal size={12} strokeWidth={2.4} />
          </a>
        </>
      }
    >
      <QHead n="03" title="Incoming Trade Offers" aside={<Tag tone="grey">{offers.length} New Requests</Tag>} />
      <div className={styles.offers}>
        {offers.length === 0 && <p className={styles.empty}>All caught up — accepted offers moved to My Active Trades.</p>}
        {offers.map((o) => (
          <Inset key={o.id} className={styles.offer}>
            <Art palette={o.palette} radius={4} className={styles.offerArt} alt={`${o.name} portfolio`} />
            <div className={styles.offerBody}>
              <div className={styles.offerHead}>
                <h3>{o.name}</h3>
                <span>{o.time}</span>
              </div>
              <p className={styles.offerText}>
                Offers <span className={styles.ink}>{o.offer}</span> in exchange for your{' '}
                <span className={styles.tealText}>{o.want}.</span>
              </p>
              <div className={styles.offerActions}>
                <Btn size="xs" onClick={() => onAccept(o)}>
                  Accept Trade
                </Btn>
                <Btn
                  size="xs"
                  variant="soft"
                  onClick={() => setCountered((s) => new Set(s).add(o.id))}
                  disabled={countered.has(o.id)}
                >
                  {countered.has(o.id) ? 'Counter Sent' : 'Counter Offer'}
                </Btn>
                <Btn size="xs" variant="ghost" onClick={() => onRemove(o.id)}>
                  Decline
                </Btn>
              </div>
            </div>
          </Inset>
        ))}
      </div>
    </NetCard>
  )
}

/* ---------------- Q4 ---------------- */
function ProtectionLocker() {
  const [files, setFiles] = useState(INITIAL_FILES)
  const [cleared, setCleared] = useState([true, true, true, false])
  const inputRef = useRef(null)

  const onUpload = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const mb = Math.max(0.1, f.size / 1024 / 1024).toFixed(1)
    setFiles((fs) => [...fs, { name: f.name, meta: `Uploaded just now · ${mb} MB`, status: 'Pending Review', icon: FileUp }])
    e.target.value = ''
  }

  return (
    <NetCard
      footer={
        <>
          <span>Zero-commission peer barter protocol</span>
          <a href="#escrow-policy" className={styles.footLink}>
            Escrow policy details <ShieldCheck size={13} strokeWidth={2.2} />
          </a>
        </>
      }
    >
      <QHead
        n="04"
        title="Trade Protection & File Delivery"
        aside={
          <Tag tone="teal">
            <Lock size={11} strokeWidth={2.4} /> Escrow Locker Secured
          </Tag>
        }
      />
      <div className={styles.compare}>
        <Inset className={styles.locker}>
          <div className={styles.lockerHead}>
            <span className={styles.sideLabel}>Delivery Locker Vault</span>
            <span className={styles.protected}>Both Artists Protected</span>
          </div>
          {files.map(({ name, meta, status, icon: Icon, locked }) => (
            <div key={name} className={styles.file}>
              <Icon size={16} strokeWidth={1.8} className={styles.fileIcon} />
              <div className={styles.fileText}>
                <strong>{name}</strong>
                <span>{meta}</span>
              </div>
              <Tag tone={locked ? 'teal' : 'soft'} className={styles.fileTag}>
                {status}
              </Tag>
            </div>
          ))}
          <input ref={inputRef} type="file" hidden onChange={onUpload} />
          <Btn variant="soft" size="md" block icon={FileUp} onClick={() => inputRef.current?.click()}>
            Upload Work-in-Progress / Final
          </Btn>
        </Inset>

        <Inset className={styles.locker}>
          <div className={styles.lockerHead}>
            <span className={styles.sideLabel}>Fair Exchange Checklist</span>
            <strong className={styles.cleared}>
              {cleared.filter(Boolean).length} / {CHECKLIST.length} Cleared
            </strong>
          </div>
          <ul className={styles.checklist}>
            {CHECKLIST.map((item, i) => (
              <li key={item}>
                <button
                  type="button"
                  aria-pressed={cleared[i]}
                  className={cleared[i] ? styles.done : ''}
                  onClick={() => setCleared((c) => c.map((v, j) => (j === i ? !v : v)))}
                >
                  {cleared[i] ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                  <span>{item}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className={styles.note}>
            Files remain encrypted in the safe locker until both parties click release. Neither artist can claim files
            without releasing theirs.
          </p>
        </Inset>
      </div>
    </NetCard>
  )
}
