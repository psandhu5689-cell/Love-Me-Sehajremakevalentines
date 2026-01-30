import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBack, IoHeart, IoSend, IoTime, IoTrash } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import soundManager from '../utils/soundManager'

interface TriggerEntry {
  id: string
  prompt: string
  response: string
  timestamp: number
}

const PROMPTS = [
  "Tell me why I make you smile",
  "What's your favorite thing about us?",
  "Describe me in 3 words",
  "What made you fall for me?",
  "What's your favorite memory of us?",
  "What do you love most about me?",
  "What do I do that makes you feel special?",
  "How do I make your day better?",
  "What's something I said that you'll never forget?",
  "Why do you choose me every day?",
  "What's your favorite way I show love?",
  "Describe the moment you knew you loved me",
  "What's something small I do that means a lot?",
  "How do I make you feel safe?",
  "What's your dream future with me?",
]

export default function TriggerPull() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [entries, setEntries] = useState<TriggerEntry[]>([])
  const [showEntries, setShowEntries] = useState(false)

  useEffect(() => {
    loadEntries()
    generateNewPrompt()
  }, [])

  const loadEntries = () => {
    const saved = localStorage.getItem('triggerPullEntries')
    if (saved) setEntries(JSON.parse(saved))
  }

  const saveEntries = (newEntries: TriggerEntry[]) => {
    const capped = newEntries.slice(0, 50)
    localStorage.setItem('triggerPullEntries', JSON.stringify(capped))
    setEntries(capped)
  }

  const generateNewPrompt = () => {
    const randomPrompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)]
    setCurrentPrompt(randomPrompt)
  }

  const handleSubmit = () => {
    if (!response.trim()) return

    soundManager.play('heart')
    const entry: TriggerEntry = {
      id: Date.now().toString(),
      prompt: currentPrompt,
      response: response.trim(),
      timestamp: Date.now(),
    }

    saveEntries([entry, ...entries])
    setResponse('')
    generateNewPrompt()
  }

  const deleteEntry = (id: string) => {
    soundManager.tap()
    const updated = entries.filter(e => e.id !== id)
    saveEntries(updated)
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

      <div style={{ maxWidth: 700, margin: '60px auto 0' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ color: colors.textPrimary, fontSize: 32, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}
        >
          Trigger Pull 🚀
        </motion.h1>
        <p style={{ color: colors.textSecondary, fontSize: 14, textAlign: 'center', marginBottom: 40 }}>
          Random love prompts to express yourself
        </p>

        {/* Current Prompt Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPrompt}
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            style={{
              background: colors.glass,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${colors.border}`,
              borderRadius: 24,
              padding: 32,
              marginBottom: 32,
              boxShadow: `0 8px 32px ${colors.primaryGlow}`,
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ textAlign: 'center', marginBottom: 20 }}
            >
              <IoHeart size={48} color={colors.primary} />
            </motion.div>

            <h2 style={{
              color: colors.textPrimary,
              fontSize: 24,
              fontWeight: 600,
              textAlign: 'center',
              marginBottom: 24,
              lineHeight: 1.4,
            }}>
              "{currentPrompt}"
            </h2>

            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response..."
              rows={4}
              style={{
                width: '100%',
                padding: '16px',
                marginBottom: 16,
                borderRadius: 16,
                background: colors.background,
                border: `1px solid ${colors.border}`,
                color: colors.textPrimary,
                fontSize: 15,
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />

            <div style={{ display: 'flex', gap: 12 }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { soundManager.tap(); generateNewPrompt(); setResponse(''); }}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: 16,
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Skip
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!response.trim()}
                style={{
                  flex: 2,
                  padding: '16px',
                  borderRadius: 16,
                  background: response.trim() ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : colors.glass,
                  border: 'none',
                  color: 'white',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: response.trim() ? 'pointer' : 'not-allowed',
                  opacity: response.trim() ? 1 : 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <IoSend size={18} />
                Submit Response
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* View Responses Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { soundManager.tap(); setShowEntries(!showEntries); }}
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
            marginBottom: 24,
          }}
        >
          <IoTime size={20} />
          {showEntries ? 'Hide' : 'View'} Past Responses ({entries.length})
        </motion.button>

        {/* Entries List */}
        <AnimatePresence>
          {showEntries && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {entries.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: colors.textSecondary,
                  fontSize: 14,
                }}>
                  No responses yet. Start sharing your feelings! 💕
                </div>
              ) : (
                entries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{
                      background: colors.card,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 16,
                      padding: 20,
                      marginBottom: 12,
                      position: 'relative',
                    }}
                  >
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteEntry(entry.id)}
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        background: 'rgba(255,0,0,0.1)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <IoTrash size={16} color="#ff4444" />
                    </motion.button>

                    <p style={{
                      color: colors.primary,
                      fontSize: 14,
                      fontWeight: 600,
                      marginBottom: 8,
                    }}>
                      "{entry.prompt}"
                    </p>
                    <p style={{
                      color: colors.textPrimary,
                      fontSize: 15,
                      lineHeight: 1.6,
                      marginBottom: 8,
                    }}>
                      {entry.response}
                    </p>
                    <p style={{
                      color: colors.textSecondary,
                      fontSize: 12,
                    }}>
                      {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
