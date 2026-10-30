import { useState } from 'react'
import {
  BadgeCheck,
  Check,
  CheckCircle2,
  Clock,
  Droplet,
  ExternalLink,
  Eye,
  Image as ImageIcon,
  Layers,
  Lock,
  Palette,
  Printer,
  Save,
  Send,
  ShieldCheck,
  Store,
} from 'lucide-react'
import QuadGrid from '../../components/net/QuadGrid'
import { Btn, Inset, NetCard, Tag } from '../../components/net/ui'
import styles from './ContractPage.module.css'

const TOTAL = 1200
const MILESTONES = [
  { id: 'MS 01', pct: 30, title: 'Thumbnails & Color Rough', body: '3 composition options with lighting moodboards & palette swatch.', days: 4 },
  { id: 'MS 02', pct: 30, title: 'Line Art & 3D Blockout', body: 'Refined linework, Blender perspective rig, and basic occlusion pass.', days: 5 },
  { id: 'MS 03', pct: 40, title: 'Final Render & Source', body: 'Full rendering, fx layers, master PSD, 4K alpha exports.', days: 7 },
]

const SPECS = [
  { icon: Layers, title: 'PSD Format', sub: 'Organized Groups' },
  { icon: ImageIcon, title: '4K PNG Master', sub: '3840 x 2160 px' },
  { icon: Droplet, title: 'Transparent Alpha', sub: 'Clean Cutouts' },
  { icon: Printer, title: '300 DPI', sub: 'CMYK/RGB Dual' },
]

const REQUIREMENTS = [
  'Milestone files must be zipped with standardized naming (Aethelgard_Splash_v[X])',
  'Color Profile: Embed sRGB IEC61966-2.1 color gamut for rendering consistency',
]

const money = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function ContractPage() {
  const [mode, setMode] = useState('fiat') // fiat | barter
  const [revisions, setRevisions] = useState(2)
  const [sent, setSent] = useState(false)
  const [audited, setAudited] = useState(false)

  return (
    <div className={styles.page}>
      <div className={styles.band}>
        <p className={styles.crumb}>
          <span className={styles.crumbLead}>
            <span className={styles.leadDot} /> CONTRACT ARCHITECT
          </span>
          <span className={styles.crumbSlash}>/</span>
          <span className={`display ${styles.crumbTitle}`}>COMMISSION AGREEMENT #CA-4091</span>
          <span className={styles.crumbSub}>// 2D Character Splash Art for &apos;Aethelgard RPG&apos;</span>
        </p>
        <div className={styles.bandActions}>
          <span className={styles.draft}>
            <span /> {sent ? 'Sent for Signature' : 'Draft in Progress'}
          </span>
          <span className={styles.divider} />
          <button type="button" className={styles.audit} onClick={() => setAudited(true)}>
            {audited ? <CheckCircle2 size={14} /> : <Eye size={14} />} {audited ? 'Audit Passed' : 'Quick Audit'}
          </button>
          <span className={styles.saved}>
            <Save size={12} /> Auto-saved
          </span>
        </div>
      </div>

      <div className={styles.grid}>
        <QuadGrid columns="643fr 593fr" gap={12}>
          <ScopeMatrix mode={mode} setMode={setMode} revisions={revisions} setRevisions={setRevisions} />
          <PlainContract mode={mode} revisions={revisions} />
          <FileSpecs />
          <Signatures sent={sent} onSend={() => setSent(true)} />
        </QuadGrid>
      </div>
    </div>
  )
}

function QLabel({ children, tag, tagTone = 'teal' }) {
  return (
    <div className={styles.qlabel}>
      <span className="display">{children}</span>
      {tag && <span className={`${styles.qtag} ${tagTone === 'grey' ? styles.qtagGrey : ''} display`}>{tag}</span>}
    </div>
  )
}

/* ---------------- Q1 ---------------- */
function ScopeMatrix({ mode, setMode, revisions, setRevisions }) {
  const [active, setActive] = useState('MS 01')
  const fiat = mode === 'fiat'

  return (
    <NetCard
      footer={
        <>
          <span className={styles.lockNote}>
            <ShieldCheck size={13} /> Smart escrow lock enabled on agreement execution
          </span>
          <span className={styles.secLoc}>SEC-LOC: #8841-AETHEL</span>
        </>
      }
    >
      <div className={styles.q1Head}>
        <div>
          <QLabel tag="Active Flow">QUADRANT 01 // INPUT MATRIX</QLabel>
          <h2 className={`display ${styles.h2}`}>Interactive Commission Scope</h2>
          <p className={styles.lede}>Tune milestones, remuneration mode, and structural delivery stages.</p>
        </div>
        <div className={styles.modeToggle} role="tablist" aria-label="Remuneration mode">
          <button type="button" role="tab" aria-selected={fiat} className={fiat ? styles.modeOn : ''} onClick={() => setMode('fiat')}>
            Fiat Escrow ({money(TOTAL).replace('.00', '')})
          </button>
          <button type="button" role="tab" aria-selected={!fiat} className={!fiat ? styles.modeOn : ''} onClick={() => setMode('barter')}>
            Art Barter Trade
          </button>
        </div>
      </div>

      <div className={styles.milestones}>
        {MILESTONES.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`${styles.milestone} ${active === m.id ? styles.msOn : ''}`}
            onClick={() => setActive(m.id)}
            aria-pressed={active === m.id}
          >
            <span className={styles.msTop}>
              <span className="display">{m.id}</span>
              <span className={styles.msPct}>{m.pct}%</span>
            </span>
            <span className={`display ${styles.msTitle}`}>{m.title}</span>
            <span className={styles.msBody}>{m.body}</span>
            <span className={styles.msFoot}>
              <span className={`display ${styles.msPrice}`}>{fiat ? money((TOTAL * m.pct) / 100) : `${m.pct}% of trade`}</span>
              <span className="display">{m.days} Days Est.</span>
            </span>
          </button>
        ))}
      </div>

      <Inset className={styles.controls}>
        <div className={styles.controlRow}>
          <div>
            <p className={`display ${styles.ctrlLabel}`}>TOTAL CONTRACT VALUE</p>
            <p className={`display ${styles.total}`}>{fiat ? `${money(TOTAL)} USD` : 'Art-for-Art Swap'}</p>
          </div>
          <span className={styles.vDivider} />
          <div>
            <p className={`display ${styles.ctrlLabel}`}>REVISION THRESHOLD</p>
            <div className={styles.stepper}>
              <button type="button" aria-label="Fewer revisions" onClick={() => setRevisions((r) => Math.max(0, r - 1))}>
                -
              </button>
              <span>{revisions}</span>
              <button type="button" aria-label="More revisions" onClick={() => setRevisions((r) => Math.min(9, r + 1))}>
                +
              </button>
              <small>(rounds included)</small>
            </div>
          </div>
        </div>
        <span className={`display ${styles.extra}`}>Additional rounds: {fiat ? '$65/hr' : '1 sketch / round'}</span>
      </Inset>
    </NetCard>
  )
}

/* ---------------- Q2 ---------------- */
function PlainContract({ mode, revisions }) {
  const [expanded, setExpanded] = useState(false)
  const fiat = mode === 'fiat'

  const clauses = [
    {
      icon: Store, title: 'Commercial Rights', no: 'CLAUSE 1.2', lead: 'Indie Game & Marketing:',
      text: "The Client receives exclusive commercial rights to utilize the artwork in digital distributions, promotional banners, and retail steam packages for 'Aethelgard RPG'.",
    },
    {
      icon: Palette, title: 'Intellectual Property & Display', no: 'CLAUSE 2.0', lead: 'Mutual Balance:',
      text: 'The Client owns the finalized output characters. The Artist permanently retains creator attribution, social media showcase, and portfolio inclusion rights worldwide without restriction.',
    },
    {
      icon: Lock, title: 'Payment Protection', no: 'CLAUSE 3.4', lead: 'Moa Escrow Locker:',
      text: fiat
        ? '100% of the funds are held securely upfront. Payouts disperse automatically at each stage upon mutual milestone verification, eliminating non-payment and chargebacks.'
        : 'Both parties lock their barter deliverables in escrow upfront. Files release automatically at each stage upon mutual milestone verification, so neither side can walk away with the other’s work.',
    },
  ]

  return (
    <NetCard
      footer={
        <>
          <span className={`display ${styles.berne}`}>Standard Berne Convention &amp; US/EU Digital Copyright compliant</span>
          <button type="button" className={`display ${styles.expand}`} onClick={() => setExpanded((e) => !e)} aria-expanded={expanded}>
            {expanded ? 'Collapse Legalese' : 'Expand Full Legal Legalese'} <ExternalLink size={12} />
          </button>
        </>
      }
    >
      <div className={styles.q2Head}>
        <div>
          <QLabel tag="Standard Pro Tier" tagTone="grey">
            QUADRANT 02 // LEGAL SYNTHESIZER
          </QLabel>
          <h2 className={`display ${styles.h2}`}>Live Plain-English Contract</h2>
          <p className={styles.lede}>Automated human-readable clauses compiled from active matrix.</p>
        </div>
        <div className={styles.confidence}>
          <span className={styles.confBadge}>
            <BadgeCheck size={17} /> 98%
          </span>
          <span className="display">Legal Confidence Index</span>
        </div>
      </div>

      <div className={styles.clauses}>
        {clauses.map(({ icon: Icon, title, no, lead, text }) => (
          <Inset key={no} className={styles.clause}>
            <div className={styles.clauseHead}>
              <h3 className="display">
                <Icon size={15} /> {title}
              </h3>
              <span className={`display ${styles.clauseNo}`}>{no}</span>
            </div>
            <p>
              <strong>{lead}</strong> {text}
            </p>
          </Inset>
        ))}
        {expanded && (
          <Inset className={styles.clause}>
            <div className={styles.clauseHead}>
              <h3 className="display">Revisions &amp; Termination</h3>
              <span className={`display ${styles.clauseNo}`}>CLAUSE 4.1</span>
            </div>
            <p>
              <strong>Scope Guard:</strong> {revisions} revision round{revisions === 1 ? ' is' : 's are'} included per
              milestone. Either party may terminate before MS 02 with funds or files for completed stages released to
              their owner.
            </p>
          </Inset>
        )}
      </div>
    </NetCard>
  )
}

/* ---------------- Q3 ---------------- */
function FileSpecs() {
  const [checked, setChecked] = useState([true, true])
  const ready = checked.every(Boolean)

  return (
    <NetCard
      footer={
        <>
          <span className={`display ${styles.channel}`}>Delivery Channel: Moa Encrypted Direct Staging Vault</span>
          <span className={`display ${ready ? styles.ready : styles.notReady}`}>
            {ready ? 'Ready for upload staging' : `${checked.filter(Boolean).length} / ${REQUIREMENTS.length} confirmed`}
          </span>
        </>
      }
    >
      <div className={styles.q3Head}>
        <div>
          <QLabel>QUADRANT 03 // PRODUCTION ARTIFACTS</QLabel>
          <h2 className={`display ${styles.h2sm}`}>Deliverable File Specs &amp; Checklist</h2>
        </div>
        <Tag tone="grey" className="display">
          4 Requirements
        </Tag>
      </div>

      <div className={styles.specs}>
        {SPECS.map(({ icon: Icon, title, sub }) => (
          <Inset key={title} className={styles.spec}>
            <Icon size={16} className={styles.specIcon} />
            <strong className="display">{title}</strong>
            <span>{sub}</span>
          </Inset>
        ))}
      </div>

      <div className={styles.reqs}>
        {REQUIREMENTS.map((r, i) => (
          <label key={r} className={styles.req}>
            <input type="checkbox" checked={checked[i]} onChange={() => setChecked((c) => c.map((v, j) => (j === i ? !v : v)))} />
            <span className={styles.box}>{checked[i] && <Check size={12} strokeWidth={3} />}</span>
            {r}
          </label>
        ))}
      </div>
    </NetCard>
  )
}

/* ---------------- Q4 ---------------- */
function Signatures({ sent, onSend }) {
  return (
    <NetCard>
      <div className={styles.q3Head}>
        <div>
          <QLabel>QUADRANT 04 // CLOSING ESCROW</QLabel>
          <h2 className={`display ${styles.h2sm}`}>Signatures &amp; Escrow Deposit</h2>
        </div>
        <span className={`display ${styles.vault}`}>
          <Lock size={12} /> $1,200 Locked in Vault
        </span>
      </div>

      <div className={styles.slots}>
        <Inset className={styles.slot}>
          <div className={styles.slotHead}>
            <span className="display">ARTIST SIGNATURE</span>
            <span className={`display ${styles.verified}`}>
              <CheckCircle2 size={12} /> Verified
            </span>
          </div>
          <p className={`display ${styles.sigName}`}>David K.</p>
          <p className={styles.sigMeta}>Signed Oct 24, 2024 · 14:32 UTC</p>
          <span className={styles.sigBar}>
            <span style={{ width: '100%' }} />
          </span>
        </Inset>
        <Inset className={styles.slot}>
          <div className={styles.slotHead}>
            <span className="display">CLIENT SIGNATURE</span>
            <span className={`display ${styles.pending}`}>
              <Clock size={12} /> {sent ? 'Invited' : 'Pending'}
            </span>
          </div>
          <p className={`display ${styles.sigAwait}`}>Awaiting Client Signature</p>
          <p className={styles.sigMeta}>{sent ? 'Agreement delivered — invitation link active (val: 72 hrs)' : 'Invitational link active (val: 72 hrs)'}</p>
          <span className={styles.sigBar}>
            <span className={styles.sigBarPending} style={{ width: sent ? '55%' : '25%' }} />
          </span>
        </Inset>
      </div>

      <p className={styles.multisig}>
        <span /> Escrow release protected by multi-sig handshake
      </p>
      <Btn size="lg" iconRight={sent ? Check : Send} className={`display ${styles.send}`} onClick={onSend} disabled={sent}>
        {sent ? 'Agreement Sent' : 'Send Agreement to Client'}
      </Btn>
    </NetCard>
  )
}
