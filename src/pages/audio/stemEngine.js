// Tiny Web Audio groove engine for the Audio & Stem Studio.
// Five synthesized stems at 128 BPM in F minor, a live scheduler, and offline WAV rendering.
import { useCallback, useEffect, useRef, useState } from 'react'

export const BPM = 128
export const STEP = 60 / BPM / 4 // one 16th note, in seconds
export const BAR = STEP * 16
export const DURATION = 164 // 02:44 song length from the design

export const SYNTH_TRACKS = [
  { id: 'drums', name: '1. Drums & Percussion' },
  { id: 'bass', name: '2. Synth Bass 808' },
  { id: 'lead', name: '3. Lead Melody & Arp' },
  { id: 'ambient', name: '4. Ambient Texture SFX' },
  { id: 'vocal', name: '5. Vocal Chops (Elena)' },
]

const midi = (m) => 440 * 2 ** ((m - 69) / 12)
// i–i–VI–VII in F minor
const CHORDS = [
  [65, 68, 72],
  [65, 68, 72],
  [61, 65, 68],
  [63, 67, 70],
]
const BASS_ROOTS = [29, 29, 25, 27]
const BASS_STEPS = [0, 3, 6, 10, 12]

const noiseCache = new WeakMap()
function noise(ctx) {
  if (!noiseCache.has(ctx)) {
    const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    noiseCache.set(ctx, buf)
  }
  return noiseCache.get(ctx)
}

function env(ctx, out, t, peak, attack, decay) {
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(peak, t + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay)
  g.connect(out)
  return g
}

function noiseHit(ctx, out, t, freq, peak, decay) {
  const src = ctx.createBufferSource()
  src.buffer = noise(ctx)
  const f = ctx.createBiquadFilter()
  f.type = 'highpass'
  f.frequency.value = freq
  src.connect(f).connect(env(ctx, out, t, peak, 0.002, decay))
  src.start(t)
  src.stop(t + decay + 0.05)
}

function tone(ctx, out, t, { type, freq, peak, attack = 0.005, decay, filter, detune = 0 }) {
  const o = ctx.createOscillator()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  o.detune.value = detune
  const g = env(ctx, out, t, peak, attack, decay)
  if (filter) {
    const f = ctx.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = filter
    o.connect(f).connect(g)
  } else o.connect(g)
  o.start(t)
  o.stop(t + attack + decay + 0.05)
  return o
}

/** Schedule every stem's notes for one 16th-note step at audio time t. */
export function playStep(ctx, outs, step, t) {
  const s = step % 16
  const bar = Math.floor(step / 16)
  const chord = CHORDS[bar % 4]

  if (outs.drums) {
    if (s % 4 === 0) {
      const o = tone(ctx, outs.drums, t, { type: 'sine', freq: 150, peak: 0.9, decay: 0.32 })
      o.frequency.exponentialRampToValueAtTime(45, t + 0.12)
    }
    if (s === 4 || s === 12) noiseHit(ctx, outs.drums, t, 1400, 0.45, 0.16)
    if (s % 2 === 0) noiseHit(ctx, outs.drums, t, 7500, s % 4 === 2 ? 0.16 : 0.08, 0.04)
  }
  if (outs.bass && BASS_STEPS.includes(s)) {
    tone(ctx, outs.bass, t, { type: 'sawtooth', freq: midi(BASS_ROOTS[bar % 4] + (s === 12 ? 12 : 0)), peak: 0.32, decay: 0.24, filter: 380 })
  }
  if (outs.lead && s % 2 === 0) {
    const note = chord[(s / 2) % 3] + (s >= 8 ? 12 : 0)
    tone(ctx, outs.lead, t, { type: 'square', freq: midi(note), peak: 0.07, decay: 0.16, filter: 2600 })
  }
  if (outs.ambient && s === 0 && bar % 2 === 0) {
    chord.forEach((n, i) =>
      tone(ctx, outs.ambient, t, { type: 'triangle', freq: midi(n - 12), peak: 0.05, attack: 0.9, decay: BAR * 2, detune: (i - 1) * 7, filter: 1400 }),
    )
  }
  if (outs.vocal && bar % 2 === 1 && (s === 8 || s === 11 || s === 14)) {
    const o = tone(ctx, outs.vocal, t, { type: 'sine', freq: midi(chord[s === 11 ? 1 : 2] + 12), peak: 0.09, attack: 0.01, decay: 0.2 })
    const lfo = ctx.createOscillator()
    const depth = ctx.createGain()
    lfo.frequency.value = 6
    depth.gain.value = 8
    lfo.connect(depth).connect(o.frequency)
    lfo.start(t)
    lfo.stop(t + 0.3)
  }
}

export function audibleGain(settings, id) {
  const anySolo = Object.values(settings).some((s) => s.solo)
  const s = settings[id]
  if (!s) return 0
  const on = anySolo ? s.solo : !s.mute
  return on ? s.vol : 0
}

/* ---------------- WAV export ---------------- */
function encodeWav(buffer) {
  const ch = buffer.numberOfChannels
  const len = buffer.length * ch * 2
  const view = new DataView(new ArrayBuffer(44 + len))
  const str = (o, s) => [...s].forEach((c, i) => view.setUint8(o + i, c.charCodeAt(0)))
  str(0, 'RIFF')
  view.setUint32(4, 36 + len, true)
  str(8, 'WAVE')
  str(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, ch, true)
  view.setUint32(24, buffer.sampleRate, true)
  view.setUint32(28, buffer.sampleRate * ch * 2, true)
  view.setUint16(32, ch * 2, true)
  view.setUint16(34, 16, true)
  str(36, 'data')
  view.setUint32(40, len, true)
  const data = Array.from({ length: ch }, (_, c) => buffer.getChannelData(c))
  let o = 44
  for (let i = 0; i < buffer.length; i++) {
    for (let c = 0; c < ch; c++) {
      const v = Math.max(-1, Math.min(1, data[c][i]))
      view.setInt16(o, v < 0 ? v * 0x8000 : v * 0x7fff, true)
      o += 2
    }
  }
  return new Blob([view], { type: 'audio/wav' })
}

export function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Render `bars` bars offline. `gains` maps synth track id -> gain (0 skips the track). */
export async function renderWav({ bars = 8, gains, eq = false, buffers = {} }) {
  const sr = 44100
  const seconds = bars * BAR + 1.5
  const ctx = new OfflineAudioContext(2, Math.ceil(sr * seconds), sr)
  const master = ctx.createGain()
  master.gain.value = 0.8
  let tail = master
  if (eq) {
    const shelf = ctx.createBiquadFilter()
    shelf.type = 'lowshelf'
    shelf.frequency.value = 180
    shelf.gain.value = 6
    master.connect(shelf)
    tail = shelf
  }
  tail.connect(ctx.destination)
  const outs = {}
  for (const [id, g] of Object.entries(gains)) {
    if (!g) continue
    const node = ctx.createGain()
    node.gain.value = g
    node.connect(master)
    if (buffers[id]) {
      const src = ctx.createBufferSource()
      src.buffer = buffers[id]
      src.loop = true
      src.connect(node)
      src.start(0)
    } else outs[id] = node
  }
  for (let step = 0; step < bars * 16; step++) playStep(ctx, outs, step, step * STEP + 0.05)
  return encodeWav(await ctx.startRendering())
}

/* ---------------- live engine hook ---------------- */
export function useStemEngine(trackIds) {
  const ctxRef = useRef(null)
  const nodes = useRef({}) // id -> GainNode
  const master = useRef(null)
  const eqNode = useRef(null)
  const analyser = useRef(null)
  const buffers = useRef({}) // uploaded id -> AudioBuffer
  const sources = useRef([])
  const timer = useRef(null)
  const raf = useRef(null)
  const clock = useRef({ startCtx: 0, startPos: 0, nextStep: 0 })

  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(48)
  const [levels, setLevels] = useState([0.5, 1, 0.75, 0.375, 0.875])
  const [eq, setEq] = useState(false)

  const ensureCtx = useCallback(() => {
    if (ctxRef.current) return ctxRef.current
    const ctx = new AudioContext()
    const m = ctx.createGain()
    m.gain.value = 0.8
    const shelf = ctx.createBiquadFilter()
    shelf.type = 'lowshelf'
    shelf.frequency.value = 180
    shelf.gain.value = 0
    const an = ctx.createAnalyser()
    an.fftSize = 64
    m.connect(shelf).connect(an).connect(ctx.destination)
    ctxRef.current = ctx
    master.current = m
    eqNode.current = shelf
    analyser.current = an
    return ctx
  }, [])

  const nodeFor = useCallback(
    (id) => {
      const ctx = ensureCtx()
      if (!nodes.current[id]) {
        const g = ctx.createGain()
        g.gain.value = 0
        g.connect(master.current)
        nodes.current[id] = g
      }
      return nodes.current[id]
    },
    [ensureCtx],
  )

  const stopAll = useCallback(() => {
    clearInterval(timer.current)
    cancelAnimationFrame(raf.current)
    sources.current.forEach((s) => {
      try {
        s.stop()
      } catch {
        /* already stopped */
      }
    })
    sources.current = []
  }, [])

  const start = useCallback(
    (from) => {
      const ctx = ensureCtx()
      ctx.resume()
      stopAll()
      const startCtx = ctx.currentTime + 0.06
      clock.current = { startCtx, startPos: from, nextStep: Math.ceil(from / STEP) }
      trackIds.forEach((id) => nodeFor(id))

      // uploaded stems loop in sync with the grid
      Object.entries(buffers.current).forEach(([id, buf]) => {
        const src = ctx.createBufferSource()
        src.buffer = buf
        src.loop = true
        src.connect(nodeFor(id))
        src.start(startCtx, from % buf.duration)
        sources.current.push(src)
      })

      const outs = () => Object.fromEntries(SYNTH_TRACKS.map((t) => [t.id, nodes.current[t.id]]))
      timer.current = setInterval(() => {
        const c = clock.current
        const o = outs()
        let at = c.startCtx + (c.nextStep * STEP - c.startPos)
        while (at < ctx.currentTime + 0.12) {
          playStep(ctx, o, c.nextStep, Math.max(at, ctx.currentTime))
          c.nextStep++
          at = c.startCtx + (c.nextStep * STEP - c.startPos)
        }
      }, 25)

      const bins = new Uint8Array(analyser.current.frequencyBinCount)
      const tick = () => {
        const c = clock.current
        setPosition((c.startPos + Math.max(0, ctx.currentTime - c.startCtx)) % DURATION)
        analyser.current.getByteFrequencyData(bins)
        setLevels([1, 3, 6, 10, 16].map((b) => Math.max(0.12, bins[b] / 255)))
        raf.current = requestAnimationFrame(tick)
      }
      raf.current = requestAnimationFrame(tick)
      setPlaying(true)
    },
    [ensureCtx, nodeFor, stopAll, trackIds],
  )

  const pause = useCallback(() => {
    stopAll()
    setPlaying(false)
  }, [stopAll])

  const toggle = useCallback(() => (playing ? pause() : start(position)), [playing, pause, start, position])

  const seek = useCallback(
    (sec) => {
      const p = ((sec % DURATION) + DURATION) % DURATION
      setPosition(p)
      if (playing) start(p)
    },
    [playing, start],
  )

  const applyGains = useCallback(
    (settings) => {
      if (!ctxRef.current) return
      trackIds.forEach((id) => nodeFor(id).gain.setTargetAtTime(audibleGain(settings, id), ctxRef.current.currentTime, 0.02))
    },
    [nodeFor, trackIds],
  )

  const addBuffer = useCallback(
    async (id, file) => {
      const ctx = ensureCtx()
      buffers.current[id] = await ctx.decodeAudioData(await file.arrayBuffer())
      nodeFor(id)
      if (playing) start(position)
    },
    [ensureCtx, nodeFor, playing, position, start],
  )

  useEffect(() => {
    if (eqNode.current) eqNode.current.gain.setTargetAtTime(eq ? 6 : 0, ctxRef.current.currentTime, 0.05)
  }, [eq])

  useEffect(
    () => () => {
      stopAll()
      ctxRef.current?.close()
    },
    [stopAll],
  )

  return { playing, position, levels, eq, setEq, toggle, seek, applyGains, addBuffer, buffers }
}
