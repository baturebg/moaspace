import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  Download,
  FileAudio,
  GitBranch,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Rewind,
  FastForward,
  SlidersHorizontal,
  Trash2,
  UploadCloud,
  Users,
  Volume2,
  VolumeX,
} from 'lucide-react'
import QuadGrid from '../../components/net/QuadGrid'
import { Art, Btn, Inset, NetCard, Tag } from '../../components/net/ui'
import { BAR, DURATION, SYNTH_TRACKS, audibleGain, downloadBlob, renderWav, useStemEngine } from './stemEngine'
import styles from './AudioStudioPage.module.css'

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`

// deterministic pseudo-waveform per track so rows look distinct
const waveFor = (seed, n = 62) =>
  Array.from({ length: n }, (_, i) => {
    const v = Math.abs(Math.sin(i * 0.9 + seed * 2.1) * 0.6 + Math.sin(i * 0.31 + seed) * 0.4)
    return 3 + Math.round(v * 19)
  })

const SECTIONS = [
  { t: 0, label: '00:00 Intro' },
  { t: 45, label: '00:45 Build-Up' },
  { t: 75, label: '01:15 Combat Drop' },
  { t: 120, label: '02:00 Resolution' },
  { t: 164, label: '02:44 End' },
]

const INITIAL_CUES = [
  { id: 1, t: 30, title: 'Drop intro • Mecha bootup sound', role: 'Game Director', note: "Ensure the sub-bass ducking gives headroom for the protagonist's voice-over line here." },
  { id: 2, t: 75, title: 'Anime battle climax • Full distortion', role: 'Lead Animator', note: 'Laser beams collide on frame 1800. Stems 1 and 3 need peak transients to match explosion VFX.' },
  { id: 3, t: 120, title: 'Fade out • Reverb tail decay', role: 'Marcus T.', note: 'Let the vocal chop feedback trail naturally into the ambient pad before cutscene change.' },
]

const TEAM = [
  { name: 'Marcus T.', role: 'Beatmaker • Editing Track 1', host: true, palette: 'ember', online: true },
  { name: 'Elena Rostova', role: 'Topliner • Rendering Takes', palette: 'ocean', online: true },
  { name: 'David K.', role: 'Sound Design • Idle (Listening)', palette: 'studio', online: false },
]

const MANIFEST = [
  { name: 'DRUMS_PERC_128BPM.wav', size: '48.2 MB' },
  { name: 'BASS_808_FMIN.wav', size: '32.6 MB' },
  { name: 'LEAD_SYNTH_FMIN.wav', size: '41.8 MB' },
  { name: 'TEXTURES_FX_ENV.wav', size: '54.0 MB' },
]

const barOf = (t) => Math.floor(t / BAR) + 1

export default function AudioStudioPage() {
  const [uploads, setUploads] = useState([]) // { id, name, size }
  const [settings, setSettings] = useState(() =>
    Object.fromEntries(SYNTH_TRACKS.map((t) => [t.id, { mute: false, solo: false, vol: 0.8 }])),
  )
  const trackIds = useMemo(() => [...SYNTH_TRACKS.map((t) => t.id), ...uploads.map((u) => u.id)], [uploads])
  const engine = useStemEngine(trackIds)
  const [cues, setCues] = useState(INITIAL_CUES)
  const [exporting, setExporting] = useState(null)

  const { applyGains, playing } = engine
  useEffect(() => applyGains(settings), [settings, playing, applyGains])

  const tracks = [...SYNTH_TRACKS, ...uploads.map((u) => ({ id: u.id, name: `${SYNTH_TRACKS.length + uploads.indexOf(u) + 1}. ${u.name}`, uploaded: true }))]

  const update = (id, patch) => setSettings((s) => ({ ...s, [id]: { ...s[id], ...patch } }))

  const gainsMap = () => Object.fromEntries(trackIds.map((id) => [id, audibleGain(settings, id)]))

  const exportMix = async () => {
    setExporting('mix')
    try {
      downloadBlob(await renderWav({ bars: 16, gains: gainsMap(), eq: engine.eq, buffers: engine.buffers.current }), 'cyberpunk-boss-ost_mix-demo.wav')
    } finally {
      setExporting(null)
    }
  }

  const exportStems = async () => {
    setExporting('stems')
    try {
      for (const t of SYNTH_TRACKS) {
        const blob = await renderWav({ bars: 8, gains: { [t.id]: 0.9 } })
        downloadBlob(blob, `${t.id}_128bpm_fmin.wav`)
      }
    } finally {
      setExporting(null)
    }
  }

  const onFiles = async (files) => {
    for (const file of files) {
      if (!file.type.startsWith('audio/') && !/\.(wav|mp3|ogg|flac|m4a|aiff?)$/i.test(file.name)) continue
      const id = `up-${Date.now()}-${file.name}`
      try {
        await engine.addBuffer(id, file)
        setSettings((s) => ({ ...s, [id]: { mute: false, solo: false, vol: 0.8 } }))
        setUploads((u) => [...u, { id, name: file.name, size: `${(file.size / 1024 / 1024).toFixed(1)} MB` }])
      } catch {
        alert(`Could not decode ${file.name} — try a WAV or MP3 file.`)
      }
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.band}>
        <p className={styles.project}>
          <span className={styles.sync}>
            <span /> SYNC ACTIVE
          </span>
          <span className={styles.pipe}>|</span>
          <span className={styles.projLabel}>PROJECT //</span>
          <span className={`display ${styles.projName}`}>Cyberpunk Anime Boss Fight OST</span>
          <Tag tone="soft">
            <GitBranch size={12} /> Version 3.4.2
          </Tag>
        </p>
        <div className={styles.bandActions}>
          <span className={styles.active}>
            <Users size={15} /> 3 Active
          </span>
          <Btn size="md" icon={Download} onClick={exportMix} disabled={!!exporting}>
            {exporting === 'mix' ? 'Rendering mix…' : 'Export Mixed Demo'}
          </Btn>
        </div>
      </div>

      <div className={styles.grid}>
        <QuadGrid columns="798fr 396fr" joined>
          <Mixer engine={engine} tracks={tracks} settings={settings} update={update} />
          <Team onFiles={onFiles} />
          <Timeline engine={engine} cues={cues} setCues={setCues} />
          <Licensing uploads={uploads} exportStems={exportStems} exporting={exporting} />
        </QuadGrid>
      </div>
    </div>
  )
}

function QTitle({ tag, title, aside }) {
  return (
    <div className={styles.qhead}>
      <div className={styles.qleft}>
        <span className={styles.qtag}>{tag}</span>
        <h2 className={`display ${styles.qtitle}`}>{title}</h2>
      </div>
      {aside}
    </div>
  )
}

/* ---------------- Q1 mixer ---------------- */
function Mixer({ engine, tracks, settings, update }) {
  const { playing, position, levels, eq, setEq, toggle, seek } = engine
  const progress = position / DURATION

  return (
    <NetCard>
      <QTitle
        tag="Q1 // LIVE MIX"
        title="Multi-Track Stem Player & Mixer"
        aside={
          <div className={styles.meta}>
            <span>
              BPM <b>128</b>
            </span>
            <span>
              KEY <b>F Minor</b>
            </span>
            <span>
              TIME <b>02:44</b>
            </span>
          </div>
        }
      />

      <Inset className={styles.transport}>
        <div className={styles.transportLeft}>
          <button type="button" className={styles.bigPlay} onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
          </button>
          <button type="button" className={styles.skip} aria-label="Back 10 seconds" onClick={() => seek(position - 10)}>
            <Rewind size={16} />
          </button>
          <button type="button" className={styles.skip} aria-label="Forward 10 seconds" onClick={() => seek(position + 10)}>
            <FastForward size={16} />
          </button>
          <span className={styles.vDivider} />
          <span className={styles.clock}>
            {fmt(position)} / {fmt(DURATION)}
          </span>
        </div>
        <div className={styles.transportRight}>
          <span className={styles.meter} aria-hidden>
            <Volume2 size={12} />
            {levels.map((l, i) => (
              <span key={i} style={{ height: `${Math.round((playing ? l : [0.5, 1, 0.75, 0.375, 0.875][i]) * 16)}px` }} />
            ))}
          </span>
          <Btn size="xs" variant={eq ? 'primary' : 'soft'} icon={SlidersHorizontal} onClick={() => setEq((e) => !e)} aria-pressed={eq}>
            Master EQ
          </Btn>
        </div>
      </Inset>

      <div className={styles.tracks}>
        {tracks.map((t, i) => {
          const s = settings[t.id]
          if (!s) return null
          const heard = audibleGain(settings, t.id) > 0
          const wave = waveFor(i + 1)
          return (
            <Inset key={t.id} className={`${styles.track} ${heard ? '' : styles.trackOff}`}>
              <div className={styles.trackName}>
                <button type="button" className={`${styles.ms} ${s.mute ? styles.muteOn : ''}`} onClick={() => update(t.id, { mute: !s.mute })} aria-pressed={s.mute} aria-label={`Mute ${t.name}`}>
                  M
                </button>
                <button type="button" className={`${styles.ms} ${s.solo ? styles.soloOn : ''}`} onClick={() => update(t.id, { solo: !s.solo })} aria-pressed={s.solo} aria-label={`Solo ${t.name}`}>
                  S
                </button>
                <span title={t.name}>{t.name}</span>
                {t.uploaded && <Tag tone="sky">NEW</Tag>}
              </div>
              <button
                type="button"
                className={styles.trackWave}
                aria-label="Seek"
                onClick={(e) => {
                  const r = e.currentTarget.getBoundingClientRect()
                  seek(((e.clientX - r.left) / r.width) * DURATION)
                }}
              >
                {wave.map((h, j) => (
                  <span key={j} className={j / wave.length <= progress ? styles.wavePlayed : ''} style={{ height: h }} />
                ))}
              </button>
              <label className={styles.vol}>
                <span className="visually-hidden">Volume {t.name}</span>
                <input type="range" min="0" max="1" step="0.01" value={s.vol} onChange={(e) => update(t.id, { vol: +e.target.value })} />
                {s.vol === 0 || !heard ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </label>
            </Inset>
          )
        })}
      </div>
    </NetCard>
  )
}

/* ---------------- Q2 team & upload ---------------- */
function Team({ onFiles }) {
  const [over, setOver] = useState(false)
  const inputRef = useRef(null)

  return (
    <NetCard>
      <QTitle tag="Q2 // TEAM" title="Co-Producers in Session" aside={<Tag tone="teal" className={styles.split}>Equal 33% Master Split</Tag>} />
      <div className={styles.team}>
        {TEAM.map((m) => (
          <Inset key={m.name} className={styles.member}>
            <span className={styles.memberAvatar}>
              <Art palette={m.palette} radius={999} className={styles.avatar40} alt={m.name} />
              <span className={m.online ? styles.online : styles.idle} />
            </span>
            <span className={styles.memberText}>
              <strong>
                {m.name} {m.host && <Tag tone="solid" className={styles.host}>HOST</Tag>}
              </strong>
              <span>{m.role}</span>
            </span>
            <span className={styles.memberSplit}>1/3 Split</span>
          </Inset>
        ))}
      </div>

      <div
        className={`${styles.drop} ${over ? styles.dropOver : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          onFiles([...e.dataTransfer.files])
        }}
      >
        <UploadCloud size={24} className={styles.dropIcon} />
        <strong>Drop 24-bit WAV stems here</strong>
        <span>Auto-syncs to session grid • Up to 250MB</span>
        <input ref={inputRef} type="file" accept="audio/*" multiple hidden onChange={(e) => onFiles([...e.target.files])} />
        <Btn size="xs" variant="outline" onClick={() => inputRef.current?.click()}>
          Select Files
        </Btn>
      </div>
    </NetCard>
  )
}

/* ---------------- Q3 timeline ---------------- */
function Timeline({ engine, cues, setCues }) {
  const { position, seek } = engine
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState({ title: '', note: '' })

  const add = (e) => {
    e.preventDefault()
    if (!draft.title.trim()) return
    setCues((c) => [...c, { id: Date.now(), t: Math.floor(position), title: draft.title.trim(), role: 'David K.', note: draft.note.trim() }].sort((a, b) => a.t - b.t))
    setDraft({ title: '', note: '' })
    setAdding(false)
  }

  const exportMarkers = () => {
    const rows = ['Name,Start,Bar,Owner,Note', ...cues.map((c) => `"${c.title}",${fmt(c.t)},${barOf(c.t)},"${c.role}","${c.note.replace(/"/g, "'")}"`)]
    downloadBlob(new Blob([rows.join('\n')], { type: 'text/csv' }), 'markers.csv')
  }

  return (
    <NetCard
      footer={
        <>
          <span className={styles.synced}>
            <CheckCircle2 size={13} /> All markers synced with FinalCut &amp; Reaper markers.csv
          </span>
          <button type="button" className={styles.footLink} onClick={exportMarkers}>
            <RefreshCw size={12} /> Sync Video Track
          </button>
        </>
      }
    >
      <QTitle
        tag="Q3 // SYNC TIMELINE"
        title="Arrangement & Scene Sync Notes"
        aside={
          <Btn size="md" variant="soft" icon={Plus} className={styles.clearKnob} onClick={() => setAdding((a) => !a)}>
            Add Cue Note
          </Btn>
        }
      />

      <Inset className={styles.arrangement}>
        <div className={styles.sections}>
          {SECTIONS.map((s) => (
            <button key={s.t} type="button" style={{ left: `${(s.t / DURATION) * 100}%` }} onClick={() => seek(s.t === DURATION ? 0 : s.t)}>
              {s.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={styles.bar}
          aria-label="Song position"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            seek(((e.clientX - r.left) / r.width) * DURATION)
          }}
        >
          <span className={styles.barFill} style={{ width: `${(position / DURATION) * 100}%` }} />
          <span className={styles.playhead} style={{ left: `${(position / DURATION) * 100}%` }} />
        </button>
        <div className={styles.scenes}>
          <span style={{ left: '0%' }}>
            <i /> Scene 01
          </span>
          <span style={{ left: '41%' }}>
            <i className={styles.climax} /> Scene 02 (Climax)
          </span>
          <span style={{ right: 0 }}>
            <i className={styles.fade} /> Credits Fade
          </span>
        </div>
      </Inset>

      {adding && (
        <form className={styles.cueForm} onSubmit={add}>
          <span className={styles.cueAt}>
            @ {fmt(position)} · BAR {barOf(position)}
          </span>
          <input autoFocus placeholder="Cue title, e.g. Boss phase 2 • key change" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
          <input placeholder="Note for the team" value={draft.note} onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))} />
          <Btn type="submit" size="sm">
            Add
          </Btn>
        </form>
      )}

      <div className={styles.cues}>
        {cues.map((c) => (
          <Inset key={c.id} className={styles.cue}>
            <button type="button" className={styles.cueTime} onClick={() => seek(c.t)} title="Jump to cue">
              <strong>{fmt(c.t)}</strong>
              <span>BAR {barOf(c.t)}</span>
            </button>
            <div className={styles.cueBody}>
              <p className={styles.cueTitle}>
                {c.title} <Tag tone="grey" className={styles.cueRole}>{c.role}</Tag>
              </p>
              {c.note && <p className={styles.cueNote}>&quot;{c.note}&quot;</p>}
            </div>
            <button type="button" className={styles.cueDelete} aria-label="Delete cue" onClick={() => setCues((cs) => cs.filter((x) => x.id !== c.id))}>
              <Trash2 size={14} />
            </button>
          </Inset>
        ))}
      </div>
    </NetCard>
  )
}

/* ---------------- Q4 licensing ---------------- */
function Licensing({ uploads, exportStems, exporting }) {
  return (
    <NetCard
      footer={
        <div className={styles.licenseActions}>
          <Btn size="lg" block icon={Download} onClick={exportStems} disabled={!!exporting}>
            {exporting === 'stems' ? 'Rendering stems…' : 'Download All Stems (WAV)'}
          </Btn>
          <Link to="/contract" className={styles.contractLink}>
            View Smart Agreement Contract
          </Link>
        </div>
      }
    >
      <QTitle tag="Q4 // TRADE" title="Stem Licensing & Trade" />
      <Inset className={styles.agreement}>
        <div className={styles.agreementHead}>
          <span>SMART AGREEMENT</span>
          <Tag tone="teal">
            <CheckCircle2 size={12} /> Accepted
          </Tag>
        </div>
        <h3>Studio OST Commercial License</h3>
        <p>Signed by Sound Designer (David K.) on Mar 28 • Verified on Moa Escrow</p>
        <div className={styles.terms}>
          <div>
            <span>ROYALTIES</span>
            <strong>33.3% Master</strong>
          </div>
          <div>
            <span>STEM TRADE</span>
            <strong>Reciprocal WAV</strong>
          </div>
        </div>
      </Inset>

      <p className={styles.manifestLabel}>ARCHIVE MANIFEST</p>
      <ul className={styles.manifest}>
        {[...MANIFEST, ...uploads].map((f) => (
          <li key={f.name}>
            <span>
              <FileAudio size={13} /> {f.name}
            </span>
            <span>{f.size}</span>
          </li>
        ))}
      </ul>
    </NetCard>
  )
}
