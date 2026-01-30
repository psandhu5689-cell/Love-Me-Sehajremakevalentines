import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBack, IoAdd, IoLockClosed, IoLockOpen, IoSearch, IoClose } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import soundManager from '../utils/soundManager'
import Confetti from 'react-confetti'

interface VaultNote {
  id: string
  title: string
  message: string
  lockType: 'passcode' | 'time' | 'none'
  passcode?: string
  unlockTime?: number
  isUnlocked: boolean
  createdAt: number
}

export default function LoveVault() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [notes, setNotes] = useState<VaultNote[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [showUnlock, setShowUnlock] = useState<VaultNote | null>(null)
  const [filter, setFilter] = useState<'all' | 'locked' | 'unlocked'>('all')
  const [search, setSearch] = useState('')
  const [passcodeInput, setPasscodeInput] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize] = useState({ width: window.innerWidth, height: window.innerHeight })

  // Form state
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [lockType, setLockType] = useState<'passcode' | 'time' | 'none'>('none')
  const [passcode, setPasscode] = useState('')
  const [unlockTime, setUnlockTime] = useState('')

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = () => {
    const saved = localStorage.getItem('loveVaultNotes')
    if (saved) {
      setNotes(JSON.parse(saved))
    }
  }

  const saveNotes = (newNotes: VaultNote[]) => {
    // Cap at 100 notes
    const capped = newNotes.slice(0, 100)
    localStorage.setItem('loveVaultNotes', JSON.stringify(capped))
    setNotes(capped)
  }

  const createNote = () => {
    if (!title || !message) return

    const note: VaultNote = {
      id: Date.now().toString(),
      title,
      message,
      lockType,
      passcode: lockType === 'passcode' ? passcode : undefined,
      unlockTime: lockType === 'time' ? new Date(unlockTime).getTime() : undefined,
      isUnlocked: lockType === 'none',
      createdAt: Date.now(),
    }

    soundManager.play('uiSuccess')
    saveNotes([note, ...notes])
    resetForm()
    setShowCreate(false)
  }

  const unlockNote = (note: VaultNote) => {
    if (note.lockType === 'passcode') {
      if (passcodeInput === note.passcode) {
        soundManager.play('celebration')
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
        
        const updated = notes.map(n => 
          n.id === note.id ? { ...n, isUnlocked: true } : n
        )
        saveNotes(updated)
        setShowUnlock(null)
        setPasscodeInput('')
      } else {
        soundManager.play('uiError')
      }
    } else if (note.lockType === 'time') {
      if (Date.now() >= (note.unlockTime || 0)) {
        soundManager.play('celebration')
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
        
        const updated = notes.map(n => 
          n.id === note.id ? { ...n, isUnlocked: true } : n
        )
        saveNotes(updated)
      }
    }
  }

  const resetForm = () => {
    setTitle('')
    setMessage('')
    setLockType('none')
    setPasscode('')
    setUnlockTime('')
  }

  const filteredNotes = notes
    .filter(note => {
      if (filter === 'locked') return !note.isUnlocked
      if (filter === 'unlocked') return note.isUnlocked
      return true
    })
    .filter(note => 
      search ? note.title.toLowerCase().includes(search.toLowerCase()) : true
    )

  const getTimeRemaining = (unlockTime: number) => {
    const diff = unlockTime - Date.now()
    if (diff <= 0) return 'Ready to unlock!'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h remaining`
    return `${hours}h remaining`
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      padding: '20px',
      paddingBottom: '100px',
    }}>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { soundManager.play('uiBack'); navigate(-1); }}
        style={{
          position: 'fixed',
          top: 20,
          left: 20,
          width: 44,
          height: 44,
          borderRadius: 22,
          background: colors.card,
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 100,
        }}
      >
        <IoChevronBack size={24} color={colors.primary} />
      </motion.button>

      <div style={{ maxWidth: 800, margin: '60px auto 0' }}>
        <h1 style={{ color: colors.textPrimary, fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
          Love Vault 🔐
        </h1>
        <p style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 24 }}>
          Secret notes and surprises
        </p>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { soundManager.tap(); setShowCreate(true); }}
            style={{
              padding: '12px 20px',
              borderRadius: 16,
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              border: 'none',
              color: 'white',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <IoAdd size={18} />
            Create Secret
          </motion.button>

          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <IoSearch size={18} color={colors.textSecondary} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                borderRadius: 16,
                background: colors.card,
                border: `1px solid ${colors.border}`,
                color: colors.textPrimary,
                fontSize: 14,
                outline: 'none',
              }}
            />
          </div>

          <select
            value={filter}
            onChange={(e) => { soundManager.tap(); setFilter(e.target.value as any); }}
            style={{
              padding: '12px 16px',
              borderRadius: 16,
              background: colors.card,
              border: `1px solid ${colors.border}`,
              color: colors.textPrimary,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            <option value="all">All</option>
            <option value="locked">Locked</option>
            <option value="unlocked">Unlocked</option>
          </select>
        </div>

        {/* Notes Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filteredNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundManager.tap()
                if (!note.isUnlocked && note.lockType !== 'none') {
                  setShowUnlock(note)
                }
              }}
              style={{
                background: note.isUnlocked ? colors.glass : colors.card,
                border: `1px solid ${colors.border}`,
                borderRadius: 16,
                padding: 20,
                cursor: note.isUnlocked ? 'default' : 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {!note.isUnlocked && (
                <div style={{ position: 'absolute', top: 12, right: 12 }}>
                  <IoLockClosed size={20} color={colors.primary} />
                </div>
              )}

              <h3 style={{ color: colors.textPrimary, fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                {note.title}
              </h3>

              {note.isUnlocked ? (
                <p style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 1.5 }}>
                  {note.message}
                </p>
              ) : (
                <div>
                  {note.lockType === 'passcode' && (
                    <p style={{ color: colors.textSecondary, fontSize: 13 }}>🔑 Passcode required</p>
                  )}
                  {note.lockType === 'time' && note.unlockTime && (
                    <p style={{ color: colors.textSecondary, fontSize: 13 }}>
                      ⏰ {getTimeRemaining(note.unlockTime)}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: colors.textSecondary }}>
            No secrets found. Create your first one!
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreate(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.7)',
                zIndex: 200,
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: 500,
                background: colors.card,
                borderRadius: 24,
                padding: 32,
                zIndex: 201,
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <h2 style={{ color: colors.textPrimary, fontSize: 24, marginBottom: 24 }}>Create Secret</h2>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                style={{
                  width: '100%',
                  padding: '14px',
                  marginBottom: 16,
                  borderRadius: 12,
                  background: colors.background,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary,
                  fontSize: 14,
                  outline: 'none',
                }}
              />

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Secret message..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '14px',
                  marginBottom: 16,
                  borderRadius: 12,
                  background: colors.background,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary,
                  fontSize: 14,
                  outline: 'none',
                  resize: 'vertical',
                }}
              />

              <select
                value={lockType}
                onChange={(e) => setLockType(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '14px',
                  marginBottom: 16,
                  borderRadius: 12,
                  background: colors.background,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                <option value="none">No Lock</option>
                <option value="passcode">Passcode Lock</option>
                <option value="time">Time Lock</option>
              </select>

              {lockType === 'passcode' && (
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode (e.g., 2625)"
                  style={{
                    width: '100%',
                    padding: '14px',
                    marginBottom: 16,
                    borderRadius: 12,
                    background: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              )}

              {lockType === 'time' && (
                <input
                  type="datetime-local"
                  value={unlockTime}
                  onChange={(e) => setUnlockTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    marginBottom: 16,
                    borderRadius: 12,
                    background: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { soundManager.tap(); setShowCreate(false); resetForm(); }}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: 12,
                    background: colors.glass,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={createNote}
                  disabled={!title || !message}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: 12,
                    background: title && message ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : colors.glass,
                    border: 'none',
                    color: 'white',
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: title && message ? 'pointer' : 'not-allowed',
                    opacity: title && message ? 1 : 0.5,
                  }}
                >
                  Create
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Unlock Modal */}
      <AnimatePresence>
        {showUnlock && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUnlock(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.7)',
                zIndex: 200,
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: 400,
                background: colors.card,
                borderRadius: 24,
                padding: 32,
                zIndex: 201,
                textAlign: 'center',
              }}
            >
              <IoLockClosed size={64} color={colors.primary} style={{ marginBottom: 16 }} />
              <h2 style={{ color: colors.textPrimary, fontSize: 20, marginBottom: 8 }}>{showUnlock.title}</h2>

              {showUnlock.lockType === 'passcode' && (
                <>
                  <p style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 20 }}>Enter passcode to unlock</p>
                  <input
                    type="text"
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && unlockNote(showUnlock)}
                    placeholder="Passcode"
                    style={{
                      width: '100%',
                      padding: '14px',
                      marginBottom: 16,
                      borderRadius: 12,
                      background: colors.background,
                      border: `1px solid ${colors.border}`,
                      color: colors.textPrimary,
                      fontSize: 16,
                      textAlign: 'center',
                      outline: 'none',
                    }}
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => unlockNote(showUnlock)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: 12,
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                      border: 'none',
                      color: 'white',
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Unlock
                  </motion.button>
                </>
              )}

              {showUnlock.lockType === 'time' && showUnlock.unlockTime && (
                <>
                  {Date.now() >= showUnlock.unlockTime ? (
                    <>
                      <p style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 20 }}>Time's up! Ready to unlock</p>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => unlockNote(showUnlock)}
                        style={{
                          width: '100%',
                          padding: '14px',
                          borderRadius: 12,
                          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                          border: 'none',
                          color: 'white',
                          fontSize: 16,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Unlock Now
                      </motion.button>
                    </>
                  ) : (
                    <p style={{ color: colors.textSecondary, fontSize: 14 }}>
                      {getTimeRemaining(showUnlock.unlockTime)}
                    </p>
                  )}
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
