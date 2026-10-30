import { useRef, useState } from 'react'
import Panel from '../../components/ui/Panel'
import laimonasAvatar from '../../assets/avatars/laimonas-small.png'
import moreIcon from '../../assets/icons/more-circle-tabs.svg'
import sendIcon from '../../assets/icons/send-white.svg'
import chatIcon from '../../assets/icons/chat-input.svg'
import styles from './CommsTrades.module.css'

const TABS = [
  { id: 'colleagues', label: 'Colleagues', count: 12 },
  { id: 'inbox', label: 'Inbox', count: 4 },
  { id: 'requests', label: 'Requests', badge: 2 },
  { id: 'activities', label: 'Activities' },
]

const EMPTY_COPY = {
  colleagues: '12 colleagues in your collaboration graph.',
  inbox: '4 unread threads waiting in your inbox.',
  activities: 'No new activity in the last 24 hours.',
}

const INITIAL_MESSAGES = [
  {
    id: 1,
    from: 'LV',
    text: 'Hey David! Loved your OST snippet for Unravel. Would love to trade our Unreal character assets for your score on our Steam prologue!',
  },
  {
    id: 2,
    from: 'DK',
    text: 'Listening to your pitch now. The polycount and rigging look solid. Reviewing contract details in Escrow!',
  },
]

export default function CommsTrades() {
  const [tab, setTab] = useState('requests')
  const [status, setStatus] = useState('pending') // pending | accepted | declined
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [draft, setDraft] = useState('')
  const inputRef = useRef(null)

  const send = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setMessages((m) => [...m, { id: Date.now(), from: 'DK', text }])
    setDraft('')
  }

  const counter = () => {
    setDraft('Counter offer: ')
    inputRef.current?.focus()
  }

  return (
    <Panel
      title="Quadrant 04 // Communications & Trades"
      aside={
        <span className={styles.socket}>
          <span className={styles.socketDot} />
          Socket Connected
        </span>
      }
    >
      <div className={styles.top}>
        <div className={styles.tabBar}>
          <div className={styles.tabs} role="tablist">
            {TABS.map((t) => {
              const active = t.id === tab
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`${styles.tab} ${active ? styles.tabOn : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                  {t.count != null && <span className={styles.count}>&nbsp;({t.count})</span>}
                  {t.badge != null && status === 'pending' && <span className={styles.badge}>{t.badge}</span>}
                </button>
              )
            })}
          </div>
          <button type="button" className={styles.more} aria-label="More tabs">
            <img src={moreIcon} alt="" />
          </button>
        </div>

        {tab === 'requests' ? (
          <article className={styles.request}>
            <div className={styles.requestHead}>
              <div className={styles.sender}>
                <img src={laimonasAvatar} alt="" className={styles.senderAvatar} />
                <div className={styles.senderText}>
                  <p>
                    <strong>Laimonas Vokietis</strong> <span>@ Voxel Studios</span>
                  </p>
                  <p className={styles.kind}>PROPOSED BARTER AGREEMENT</p>
                </div>
              </div>
              <time className={styles.ago}>18m ago</time>
            </div>

            <div className={styles.termsBox}>
              <p>
                <b className={styles.offering}>OFFERING:</b> 3D Rigged Creature Model (Unreal FBX)
              </p>
              <p>
                <span className={styles.for}>FOR:</span> 2-min Orchestral Main Title Score
              </p>
            </div>

            {status === 'pending' ? (
              <div className={styles.actions}>
                <button type="button" className={styles.accept} onClick={() => setStatus('accepted')}>
                  <img src={sendIcon} alt="" />
                  Accept Barter
                </button>
                <button type="button" className={styles.secondary} onClick={counter}>
                  Counter Offer
                </button>
                <button type="button" className={`${styles.secondary} ${styles.decline}`} onClick={() => setStatus('declined')}>
                  Decline
                </button>
              </div>
            ) : (
              <div className={`${styles.result} ${status === 'declined' ? styles.resultDeclined : ''}`}>
                <span>{status === 'accepted' ? 'Barter accepted — moved to Escrow.' : 'Barter declined.'}</span>
                <button type="button" onClick={() => setStatus('pending')}>
                  Undo
                </button>
              </div>
            )}
          </article>
        ) : (
          <p className={styles.empty}>{EMPTY_COPY[tab]}</p>
        )}
      </div>

      <div className={styles.thread}>
        <div className={styles.messages} aria-live="polite">
          {messages.map((m) => {
            const mine = m.from === 'DK'
            return (
              <div key={m.id} className={`${styles.msgRow} ${mine ? styles.mine : styles.theirs}`}>
                <span className={styles.initials}>{m.from}</span>
                <p className={styles.bubble}>{m.text}</p>
              </div>
            )
          })}
        </div>

        <form className={styles.composer} onSubmit={send}>
          <img src={chatIcon} alt="" className={styles.composerIcon} />
          <label htmlFor="direct-note" className="visually-hidden">
            Message
          </label>
          <input
            id="direct-note"
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Send direct note or propose swap parameter..."
            className={styles.composerInput}
            autoComplete="off"
          />
          <button type="submit" className={styles.sendBtn} aria-label="Send">
            <img src={sendIcon} alt="" />
          </button>
        </form>
      </div>
    </Panel>
  )
}
