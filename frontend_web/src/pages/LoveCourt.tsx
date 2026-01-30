import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBack, IoHammer, IoRefresh } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import soundManager from '../utils/soundManager'

interface CourtCase {
  id: string
  case: string
  icon: string
}

interface CourtRecord {
  id: string
  case: string
  verdict: 'guilty' | 'not-guilty'
  sentence: string
  timestamp: number
}

const CASES: CourtCase[] = [
  { id: '1', case: 'Stole fries', icon: '🍟' },
  { id: '2', case: 'Left on delivered', icon: '📱' },
  { id: '3', case: 'Looked at another chair', icon: '👀' },
  { id: '4', case: 'Took too long to reply', icon: '⏰' },
  { id: '5', case: "Said 'k'", icon: '😐' },
  { id: '6', case: "Didn't say goodnight", icon: '🌙' },
  { id: '7', case: 'Ate without sending pic', icon: '🍽️' },
  { id: '8', case: 'Fell asleep mid call', icon: '😴' },
  { id: '9', case: 'Liked a random post', icon: '❤️' },
  { id: '10', case: "Didn't miss me enough", icon: '💔' },
  { id: '11', case: 'Forgot to send good morning', icon: '☀️' },
  { id: '12', case: 'Made me jealous on purpose', icon: '😤' },
  { id: '13', case: 'Ignored me for video games', icon: '🎮' },
  { id: '14', case: 'Ate my snacks', icon: '🍫' },
  { id: '15', case: 'Didnt laugh at my joke', icon: '😑' },
  { id: '16', case: 'Too cute without permission', icon: '😍' },
  { id: '17', case: 'Made me wait', icon: '⌛' },
  { id: '18', case: 'Didnt notice new haircut', icon: '💇' },
  { id: '19', case: 'Canceled plans last minute', icon: '❌' },
  { id: '20', case: 'Used too many emojis', icon: '😂' },
  { id: '21', case: 'Didnt use enough emojis', icon: '📝' },
  { id: '22', case: 'Posted without tagging me', icon: '📸' },
  { id: '23', case: 'Took the last bite', icon: '🍕' },
  { id: '24', case: 'Too dramatic', icon: '🎭' },
  { id: '25', case: 'Not dramatic enough', icon: '😶' },
  { id: '26', case: 'Made me smile too much', icon: '😊' },
  { id: '27', case: 'Existsed while being adorable', icon: '🥰' },
  { id: '28', case: 'Stole my blanket', icon: '🛏️' },
  { id: '29', case: 'Woke me up too early', icon: '🌅' },
  { id: '30', case: 'Being too perfect', icon: '✨' },
]

const GUILTY_VERDICTS = [
  "Guilty! No contest. The evidence is overwhelming.",
  "Absolutely guilty. Case closed.",
  "Guilty as charged. No appeals allowed.",
  "100% guilty. Don't even try to deny it.",
  "Super guilty. Like, extremely guilty.",
]

const NOT_GUILTY_VERDICTS = [
  "Not guilty! You're innocent in my court.",
  "Acquitted! You did nothing wrong.",
  "Not guilty. Case dismissed.",
  "Innocent! The court loves you.",
  "Not guilty. But you're still cute.",
]

const SENTENCES = [
  "Sentence: one kiss",
  "Sentence: cuddle immediately.",
]

export default function LoveCourt() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [currentCase, setCurrentCase] = useState<CourtCase | null>(null)
  const [showVerdict, setShowVerdict] = useState(false)
  const [verdict, setVerdict] = useState<'guilty' | 'not-guilty' | null>(null)
  const [verdictText, setVerdictText] = useState('')
  const [sentence, setSentence] = useState('')
  const [records, setRecords] = useState<CourtRecord[]>([])
  const [showRecords, setShowRecords] = useState(false)

  useEffect(() => {
    loadRecords()
    selectRandomCase()
  }, [])

  const loadRecords = () => {
    const saved = localStorage.getItem('courtRecords')
    if (saved) setRecords(JSON.parse(saved))
  }

  const saveRecord = (record: CourtRecord) => {
    const updated = [record, ...records].slice(0, 15)
    localStorage.setItem('courtRecords', JSON.stringify(updated))
    setRecords(updated)
  }

  const selectRandomCase = () => {
    const randomCase = CASES[Math.floor(Math.random() * CASES.length)]
    setCurrentCase(randomCase)
    setShowVerdict(false)
    setVerdict(null)
  }

  const handleVerdict = (v: 'guilty' | 'not-guilty') => {
    if (!currentCase) return
    
    soundManager.play('uiSuccess')
    setVerdict(v)
    
    const verdicts = v === 'guilty' ? GUILTY_VERDICTS : NOT_GUILTY_VERDICTS
    const vText = verdicts[Math.floor(Math.random() * verdicts.length)]
    const sent = SENTENCES[Math.floor(Math.random() * SENTENCES.length)]
    
    setVerdictText(vText)
    setSentence(sent)
    setShowVerdict(true)
    
    const record: CourtRecord = {
      id: Date.now().toString(),
      case: currentCase.case,
      verdict: v,
      sentence: sent,
      timestamp: Date.now(),
    }
    saveRecord(record)
  }

  const handleAppeal = () => {
    if (!verdict) return
    soundManager.tap()
    
    const verdicts = verdict === 'guilty' ? GUILTY_VERDICTS : NOT_GUILTY_VERDICTS
    const vText = verdicts[Math.floor(Math.random() * verdicts.length)]
    setVerdictText(vText)
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
          Love Court ⚖️
        </motion.h1>
        <p style={{ color: colors.textSecondary, fontSize: 14, textAlign: 'center', marginBottom: 32 }}>
          Mini trials with absurd verdicts
        </p>

        {/* Case Card */}
        <AnimatePresence mode="wait">
          {currentCase && (
            <motion.div
              key={currentCase.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                background: colors.glass,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${colors.border}`,
                borderRadius: 24,
                padding: 40,
                marginBottom: 32,
                textAlign: 'center',
              }}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ fontSize: 64, marginBottom: 16 }}
              >
                {currentCase.icon}
              </motion.div>
              <IoHammer size={48} color={colors.primary} style={{ marginBottom: 16 }} />
              <h2 style={{ color: colors.textPrimary, fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
                The Case:
              </h2>
              <p style={{ color: colors.textPrimary, fontSize: 20 }}>
                {currentCase.case}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Verdict Buttons */}
        {!showVerdict && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleVerdict('guilty')}
              style={{
                padding: '24px',
                borderRadius: 20,
                background: 'linear-gradient(135deg, #ff4444, #cc0000)',
                border: 'none',
                color: 'white',
                fontSize: 18,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Guilty 🔴
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleVerdict('not-guilty')}
              style={{
                padding: '24px',
                borderRadius: 20,
                background: 'linear-gradient(135deg, #44ff44, #00cc00)',
                border: 'none',
                color: 'white',
                fontSize: 18,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Not Guilty 🟢
            </motion.button>
          </div>
        )}

        {/* Verdict Display */}
        <AnimatePresence>
          {showVerdict && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{
                background: verdict === 'guilty' 
                  ? 'linear-gradient(135deg, #ff4444, #cc0000)'
                  : 'linear-gradient(135deg, #44ff44, #00cc00)',
                borderRadius: 24,
                padding: 32,
                marginBottom: 24,
                textAlign: 'center',
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -15, 15, 0] }}
                transition={{ duration: 0.5 }}
              >
                <IoHammer size={64} color="white" style={{ marginBottom: 16 }} />
              </motion.div>
              
              <h3 style={{ color: 'white', fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
                {verdictText}
              </h3>
              
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, marginBottom: 16 }}>
                {sentence}
              </p>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAppeal}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Appeal
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { soundManager.tap(); selectRandomCase(); }}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 16,
                    background: 'white',
                    border: 'none',
                    color: verdict === 'guilty' ? '#cc0000' : '#00cc00',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Next Case
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Court Records */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { soundManager.tap(); setShowRecords(!showRecords); }}
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
            marginBottom: 16,
          }}
        >
          {showRecords ? 'Hide' : 'Show'} Court Records
        </motion.button>

        <AnimatePresence>
          {showRecords && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {records.map((record, index) => (
                <motion.div
                  key={record.id}
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
                    <span style={{ color: colors.textPrimary, fontWeight: 600 }}>{record.case}</span>
                    <span style={{
                      color: record.verdict === 'guilty' ? '#ff4444' : '#44ff44',
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}>
                      {record.verdict === 'guilty' ? 'Guilty' : 'Not Guilty'}
                    </span>
                  </div>
                  <p style={{ color: colors.textSecondary, fontSize: 13 }}>
                    {record.sentence}
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
