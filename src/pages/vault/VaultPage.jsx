import { useEffect, useState } from 'react'
import {
  ArrowLeftRight,
  ArrowRight,
  Check,
  ChevronRight,
  CircleCheck,
  Download,
  Filter,
  Gem,
  LayoutDashboard,
  PlusCircle,
  ShieldCheck,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react'
import QuadGrid from '../../components/net/QuadGrid'
import { Art, Btn, Initials, Inset, NetCard, Tag } from '../../components/net/ui'
import styles from './VaultPage.module.css'

const MY_ASSETS = [
  { name: 'Custom Procreate Ink Brushes (32 brushes)', meta: 'Procreate .brushset · 84 MB · 48 trades', status: 'Active Trade', palette: 'forest' },
  { name: 'Substance Designer Tileable Sci-Fi Textures (10 pack)', meta: '.SBSAR & 4K PBR Maps · 612 MB · 91 trades', status: 'Active Trade', palette: 'slate' },
  { name: 'Eurorack Modular Synth Samples (96kHz)', meta: 'WAV 24-bit 96kHz Loops · 1.4 GB · 119 trades', status: 'Peer Requested', palette: 'neon', grey: true },
]

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'brushes', label: 'Brushes (840)' },
  { id: '3d', label: '3D Models (512)' },
  { id: 'sfx', label: 'Sound FX (430)' },
  { id: 'shaders', label: 'Shaders (310)' },
  { id: 'ui', label: 'UI Kits (198)' },
]

const PACKS = [
  {
    id: 'glass', type: 'Shader', category: 'shaders', name: 'Architectural Glass & Caustics Engine', by: 'Nora Vance', downloads: 340,
    terms: 'Trade with 1 Brush Pack', action: 'Trade', palette: 'ice', icon: Gem, clearance: '#7094-MOA-EX', size: '312 MB',
  },
  {
    id: 'hud', type: 'UI Kit', category: 'ui', name: 'Neo-HUD Vector Component Matrix', by: 'Soren Lindqvist', downloads: 892,
    terms: 'Free for Collaborators', action: 'Get Free', free: true, palette: 'ocean', icon: LayoutDashboard, clearance: '#5521-MOA-UI', size: '48 MB',
  },
]

const REQUESTS = [
  {
    id: 'kl', initials: 'KL', name: 'Kaelen Lo', sub: 'Audio Engineer · San Francisco', time: '12m ago',
    lines: [
      <span key="ask">Requested access to <b>Modular Synth Loops (96kHz)</b>.</span>,
      <span key="offer" className={styles.muted}>
        Offer: Unlimited license swap for <span className={styles.ink}>Granular Reverb Impulse Responses</span>.
      </span>,
    ],
    secondary: 'Review Terms', primary: 'Accept Trade',
    terms: 'Both parties receive a perpetual, non-exclusive license. Attribution optional. No standalone resale.',
  },
  {
    id: 'er', initials: 'ER', name: 'Elena R.', sub: '3D Technical Artist · Berlin', time: '1h ago',
    lines: [<span key="ask">Offered <b>Blender Geometry Node Rig</b> in exchange for your Sci-Fi Textures.</span>],
    secondary: 'Counter Offer', primary: 'Instant Trade',
  },
]

const CRITERIA = [
  { ok: true, title: '100% Royalty Free for Commercial & Indie Projects', text: 'Valid across broadcast, streaming, film, and interactive applications worldwide.' },
  { ok: true, title: 'Attribution Optional', text: 'No mandatory credit required in packaging, UI credits, or game rolls.' },
  { ok: false, title: 'No Resale as Standalone Asset', text: 'Repackaging raw textures or uncompiled nodes for marketplace sale is prohibited.' },
]

export default function VaultPage() {
  const [selected, setSelected] = useState(PACKS[0])

  return (
    <>
      <div className={styles.banner}>
        <div className={styles.bannerLeft}>
          <span className={styles.bannerIcon}>
            <ArrowLeftRight size={17} strokeWidth={2.4} />
          </span>
          <div>
            <p className={`display ${styles.crumb}`}>
              <span>MOA ASSET SYSTEM</span>
              <span className={styles.slash}>/</span>
              <span className={styles.crumbSub}>PEER-TO-PEER ESCROW</span>
            </p>
            <h1 className={`display ${styles.bannerTitle}`}>CREATIVE ASSET VAULT // Community Tool &amp; Brush Exchange</h1>
          </div>
        </div>
        <div className={styles.bannerRight}>
          <label className={styles.filterInput}>
            <Filter size={14} />
            <span className="visually-hidden">Filter trade nodes</span>
            <input placeholder="Filter trade nodes..." />
          </label>
          <Btn size="md" icon={PlusCircle}>
            Contribute New Asset
          </Btn>
        </div>
      </div>

      <QuadGrid columns="545fr 667fr" gap={20}>
        <MyVault />
        <Market selected={selected} onSelect={setSelected} />
        <TradeRequests />
        <LicenseChecker pack={selected} />
      </QuadGrid>
    </>
  )
}

function QHead({ label, title, aside }) {
  return (
    <div className={styles.qhead}>
      <div>
        <p className={`display ${styles.qlabel}`}>
          <span className={styles.qdot} />
          {label}
        </p>
        <h2 className={`display ${styles.qtitle}`}>{title}</h2>
      </div>
      {aside}
    </div>
  )
}

/* ---------------- Q1 ---------------- */
function MyVault() {
  return (
    <NetCard
      footer={
        <>
          <span className={styles.metric}>
            <TrendingUp size={15} /> Peer utility score: 98.4%
          </span>
          <a href="#vault" className={styles.footLink}>
            Vault Details <ArrowRight size={12} strokeWidth={2.4} />
          </a>
        </>
      }
    >
      <QHead label="QUADRANT 01 // VAULT" title="My Shared Art Asset Vault" aside={<Tag tone="teal">Live Sync</Tag>} />
      <Inset className={styles.balance}>
        <span className={styles.balanceLabel}>
          <Wallet size={15} /> Trade Escrow Balance
        </span>
        <span className={styles.balanceStats}>
          <span className={styles.statTeal}>5 Contributed</span>
          <span>·</span>
          <span className={styles.statGrey}>12 Downloaded</span>
        </span>
      </Inset>
      <div className={styles.assets}>
        {MY_ASSETS.map((a) => (
          <Inset key={a.name} className={styles.asset}>
            <Art palette={a.palette} radius={4} className={styles.assetThumb} alt={a.name} />
            <div className={styles.assetText}>
              <strong>{a.name}</strong>
              <span>{a.meta}</span>
            </div>
            <Tag tone={a.grey ? 'grey' : 'teal'}>{a.status}</Tag>
          </Inset>
        ))}
      </div>
    </NetCard>
  )
}

/* ---------------- Q2 ---------------- */
function Market({ selected, onSelect }) {
  const [filter, setFilter] = useState('all')
  const [claimed, setClaimed] = useState(new Set())
  const packs = PACKS.filter((p) => filter === 'all' || p.category === filter)

  return (
    <NetCard
      footer={
        <>
          <span>Showing {packs.length} of 2,410 verified peer nodes</span>
          <a href="#assets" className={styles.footLink}>
            Explore All Assets <ChevronRight size={13} strokeWidth={2.6} />
          </a>
        </>
      }
    >
      <QHead label="QUADRANT 02 // MARKET" title="Community Asset Exchange Market" aside={<span className={styles.packs}>2,410 available packs</span>} />
      <div className={styles.filters} role="tablist" aria-label="Asset type">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            className={`${styles.filter} ${filter === f.id ? styles.filterOn : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      {packs.length ? (
        <div className={styles.packGrid}>
          {packs.map((p) => {
            const done = claimed.has(p.id)
            return (
              <Inset
                key={p.id}
                className={`${styles.pack} ${selected.id === p.id ? styles.packOn : ''}`}
                role="button"
                tabIndex={0}
                aria-pressed={selected.id === p.id}
                onClick={() => onSelect(p)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(p)}
              >
                <div className={styles.packArt}>
                  <Art palette={p.palette} icon={p.icon} radius={6} className={styles.packImg} alt={p.name} />
                  <span className={styles.packType}>{p.type}</span>
                </div>
                <h3>{p.name}</h3>
                <p className={styles.packBy}>
                  <span>by {p.by}</span>
                  <span>
                    <Download size={10} strokeWidth={2.4} /> {p.downloads + (done ? 1 : 0)}
                  </span>
                </p>
                <div className={styles.packFoot}>
                  <span>{p.terms}</span>
                  <Btn
                    size="xs"
                    variant={p.free ? 'primary' : 'outline'}
                    icon={done ? Check : undefined}
                    disabled={done}
                    onClick={(e) => {
                      e.stopPropagation()
                      setClaimed((s) => new Set(s).add(p.id))
                    }}
                  >
                    {done ? (p.free ? 'Added' : 'Requested') : p.action}
                  </Btn>
                </div>
              </Inset>
            )
          })}
        </div>
      ) : (
        <p className={styles.empty}>No packs from your network in this category yet.</p>
      )}
    </NetCard>
  )
}

/* ---------------- Q3 ---------------- */
function TradeRequests() {
  const [state, setState] = useState({}) // id -> 'accepted' | 'countered' | 'reviewing'

  const pending = REQUESTS.filter((r) => state[r.id] !== 'accepted').length

  return (
    <NetCard
      footer={
        <>
          <span>Smart Contract Escrow v2.4</span>
          <a href="#history" className={styles.footLink}>
            Trade History →
          </a>
        </>
      }
    >
      <QHead label="QUADRANT 03 // REQUESTS" title="Asset Trade Requests" aside={<Tag tone="teal">{pending} Pending</Tag>} />
      <div className={styles.requests}>
        {REQUESTS.map((r) => {
          const s = state[r.id]
          return (
            <Inset key={r.id} className={styles.request}>
              <div className={styles.reqHead}>
                <span className={styles.reqWho}>
                  <Initials size={40}>{r.initials}</Initials>
                  <span>
                    <strong>{r.name}</strong>
                    <small>{r.sub}</small>
                  </span>
                </span>
                <time>{r.time}</time>
              </div>
              <div className={styles.reqBox}>
                {r.lines.map((l, i) => (
                  <p key={i}>{l}</p>
                ))}
                {s === 'reviewing' && r.terms && <p className={styles.terms}>{r.terms}</p>}
              </div>
              {s === 'accepted' ? (
                <p className={styles.accepted}>
                  <CircleCheck size={14} /> Trade accepted — assets released to escrow.
                </p>
              ) : (
                <div className={styles.reqActions}>
                  <Btn
                    size="sm"
                    variant="ghost"
                    className={styles.greyBtn}
                    onClick={() => setState((st) => ({ ...st, [r.id]: r.terms ? (st[r.id] === 'reviewing' ? undefined : 'reviewing') : 'countered' }))}
                    disabled={s === 'countered'}
                  >
                    {s === 'countered' ? 'Counter Sent' : s === 'reviewing' ? 'Hide Terms' : r.secondary}
                  </Btn>
                  <Btn size="sm" onClick={() => setState((st) => ({ ...st, [r.id]: 'accepted' }))}>
                    {r.primary}
                  </Btn>
                </div>
              )}
            </Inset>
          )
        })}
      </div>
    </NetCard>
  )
}

/* ---------------- Q4 ---------------- */
function LicenseChecker({ pack }) {
  const [progress, setProgress] = useState(null)

  useEffect(() => {
    if (progress === null || progress >= 100) return
    const t = setTimeout(() => setProgress((p) => Math.min(100, p + 8)), 120)
    return () => clearTimeout(t)
  }, [progress])

  const exportCertificate = () => {
    const body = [
      'MOA SPACE — ASSET LICENSE CERTIFICATE',
      '',
      `Asset: ${pack.name}`,
      `Creator: ${pack.by}`,
      `Clearance ID: ${pack.clearance}`,
      'Clearance Level: A (Peer-Verified)',
      '',
      ...CRITERIA.map((c) => `${c.ok ? '[✓]' : '[✗]'} ${c.title} — ${c.text}`),
      '',
      `Issued: ${new Date().toISOString()}`,
    ].join('\n')
    const url = URL.createObjectURL(new Blob([body], { type: 'text/plain' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `moa-license-${pack.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloading = progress !== null && progress < 100

  return (
    <NetCard
      footer={
        <div className={styles.licenseFoot}>
          <p className={styles.dmca}>
            <ShieldCheck size={15} /> Zero DMCA risk via peer blockchain notarization
          </p>
          <div className={styles.licenseActions}>
            <Btn variant="soft" size="md" onClick={exportCertificate}>
              Export Certificate
            </Btn>
            <Btn size="md" icon={progress === 100 ? Check : Download} onClick={() => setProgress(0)} disabled={downloading}>
              {progress === null
                ? `Instant Download (${pack.size})`
                : downloading
                  ? `Downloading… ${progress}%`
                  : 'Downloaded'}
            </Btn>
          </div>
        </div>
      }
    >
      <QHead
        label="QUADRANT 04 // ESCROW & LICENSE"
        title="Asset License & Fair Use Checker"
        aside={
          <Tag tone="teal">
            <CircleCheck size={13} /> Peer-Verified
          </Tag>
        }
      />
      <Inset className={styles.license}>
        <div className={styles.licenseHead}>
          <div>
            <p className={styles.selLabel}>SELECTED ASSET NODE</p>
            <h3>{pack.name}</h3>
            <p className={styles.clearance}>Moa Space Cryptographic Clearance ID: {pack.clearance}</p>
          </div>
          <span className={styles.level}>Clearance Level A</span>
        </div>
        <div className={styles.criteria}>
          {CRITERIA.map((c) => (
            <div key={c.title} className={styles.criterion}>
              <span className={c.ok ? styles.ok : styles.no}>{c.ok ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={2.6} />}</span>
              <div>
                <strong>{c.title}</strong>
                <p>{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Inset>
    </NetCard>
  )
}
