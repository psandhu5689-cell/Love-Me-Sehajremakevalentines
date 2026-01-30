import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBack, IoStar, IoStarOutline, IoTime, IoCopy } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import soundManager from '../utils/soundManager'

type RoastLevel = 'light' | 'medium' | 'unhinged'

interface RoastEntry {
  id: string
  roast: string
  comfort: string
  level: RoastLevel
  timestamp: number
  isFavorite: boolean
}

const ROASTS = {
  light: [
    "You'd lose your head if it wasn't attached",
    "You're as organized as a bag of cats",
    "You walk into more doors than you walk through",
    "Your cooking could be classified as experimental art",
    "You have the attention span of a goldfish on caffeine",
  ],
  medium: [
    "You're the human version of 'send help' texts",
    "Your sense of direction makes a lost GPS look competent",
    "You trip over air and blame the floor",
    "You're cute but your brain runs on dial-up",
    "You'd get lost in a one-room apartment",
  ],
  unhinged: [
    "You're an adorable disaster with legs",
    "Your logic could confuse a magic 8-ball",
    "You're proof that chaos chose a favorite",
    "You're the reason warning labels exist",
    "Your common sense went out for milk and never came back",
  ],
}

export default function RoastRoulette() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [level, setLevel] = useState<RoastLevel>('medium')
  const [currentRoast, setCurrentRoast] = useState<RoastEntry | null>(null)
  const [showComfort, setShowComfort] = useState(false)
  const [history, setHistory] = useState<RoastEntry[]>([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    const saved = localStorage.getItem('roastHistory')
    if (saved) setHistory(JSON.parse(saved))
  }

  const saveHistory = (newHistory: RoastEntry[]) => {
    const capped = newHistory.slice(0, 20)
    localStorage.setItem('roastHistory', JSON.stringify(capped))
    setHistory(capped)
  }

  const getRandomRoast = () => {
    const roasts = ROASTS[level]
    return roasts[Math.floor(Math.random() * roasts.length)]
  }

  const handleRoastMe = () => {
    soundManager.tap()
    setShowComfort(false)
    
    const roast = getRandomRoast()
    const entry: RoastEntry = {
      id: Date.now().toString(),
      roast,
      comfort: "but you're still mine.",
      level,
      timestamp: Date.now(),
      isFavorite: false,
    }
    
    setCurrentRoast(entry)
    saveHistory([entry, ...history])
    
    setTimeout(() => {
      setShowComfort(true)
      soundManager.play('heart')
    }, 500)
  }

  const toggleFavorite = () => {
    if (!currentRoast) return
    soundManager.tap()
    
    const updated = history.map(r => 
      r.id === currentRoast.id ? { ...r, isFavorite: !r.isFavorite } : r
    )
    saveHistory(updated)
    setCurrentRoast({ ...currentRoast, isFavorite: !currentRoast.isFavorite })
  }

  const handleShare = () => {
    if (!currentRoast) return
    soundManager.tap()
    
    const text = `${currentRoast.roast}\n${currentRoast.comfort}`
    navigator.clipboard.writeText(text)
    // Could add a toast notification here
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      padding: '20px',
      paddingBottom: '100px',
    }}>
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

      <div style={{ maxWidth: 600, margin: '60px auto 0' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ color: colors.textPrimary, fontSize: 32, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}
        >
          Roast Roulette 🎯
        </motion.h1>
        <p style={{ color: colors.textSecondary, fontSize: 14, textAlign: 'center', marginBottom: 32 }}>
          Get roasted, then comforted
        </p>

        {/* Level Toggle */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 32,
          background: colors.card,
          padding: 6,
          borderRadius: 16,
        }}>
          {(['light', 'medium', 'unhinged'] as RoastLevel[]).map((l) => (
            <motion.button
              key={l}
              whileTap={{ scale: 0.95 }}
              onClick={() => { soundManager.tap(); setLevel(l); }}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 12,
                background: level === l ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : 'transparent',
                border: 'none',
                color: level === l ? 'white' : colors.textSecondary,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {l}
            </motion.button>
          ))}
        </div>

        {/* Roast Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRoastMe}
          style={{
            width: '100%',
            padding: '24px',
            borderRadius: 24,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            border: 'none',
            color: 'white',
            fontSize: 20,
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: 32,
            boxShadow: `0 8px 24px ${colors.primaryGlow}`,
          }}
        >
          Roast Me 🔥
        </motion.button>

        {/* Roast Card */}
        <AnimatePresence mode="wait">
          {currentRoast && (
            <motion.div
              key={currentRoast.id}
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              style={{
                background: colors.glass,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${colors.border}`,
                borderRadius: 24,
                padding: 32,
                marginBottom: 24,
                position: 'relative',
              }}
            >
              <div style={{
                position: 'absolute',
                top: 16,
                right: 16,
                display: 'flex',
                gap: 8,
              }}>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleFavorite}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    background: colors.card,
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {currentRoast.isFavorite ? (
                    <IoStar size={20} color={colors.primary} />
                  ) : (
                    <IoStarOutline size={20} color={colors.textSecondary} />
                  )}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    background: colors.card,
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <IoCopy size={20} color={colors.textSecondary} />
                </motion.button>
              </div>

              <div style={{ marginBottom: showComfort ? 16 : 0 }}>
                <p style={{
                  color: colors.textPrimary,
                  fontSize: 18,
                  lineHeight: 1.6,
                  marginBottom: 0,
                }}>
                  {currentRoast.roast}
                </p>
              </div>

              <AnimatePresence>
                {showComfort && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      paddingTop: 16,
                      borderTop: `1px solid ${colors.border}`,
                    }}
                  >
                    <p style={{
                      color: colors.primary,
                      fontSize: 16,
                      fontStyle: 'italic',
                    }}>
                      {currentRoast.comfort}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { soundManager.tap(); setShowHistory(!showHistory); }}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 16,
            background: colors.card,
            border: `1px solid ${colors.border}`,
            color: colors.textPrimary,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <IoTime size={20} />
          {showHistory ? 'Hide History' : 'Show History'}
        </motion.button>

        {/* History List */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ marginTop: 16 }}
            >
              {history.slice(0, 20).map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    background: colors.card,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 8,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{
                      color: colors.textSecondary,
                      fontSize: 12,
                      textTransform: 'uppercase',
                    }}>
                      {entry.level}
                    </span>
                    {entry.isFavorite && <IoStar size={16} color={colors.primary} />}
                  </div>
                  <p style={{ color: colors.textPrimary, fontSize: 14, marginBottom: 4 }}>
                    {entry.roast}
                  </p>
                  <p style={{ color: colors.textSecondary, fontSize: 13, fontStyle: 'italic' }}>
                    {entry.comfort}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
