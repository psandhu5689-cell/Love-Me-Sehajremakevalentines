import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBack, IoLockClosed, IoLockOpen } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import haptics from '../utils/haptics'
import Confetti from 'react-confetti'
import JourneyProgress from '../components/JourneyProgress'

const VALID_CODES = ['2625', '0711', '26250711', '26', '07', '11']

export default function SecretCode() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [code, setCode] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showError, setShowError] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize] = useState({ width: window.innerWidth, height: window.innerHeight })

  const handleNumberClick = (num: string) => {
    if (code.length < 8) {
      haptics.light()
      setCode(code + num)
    }
  }

  const handleClear = () => {
    haptics.light()
    setCode('')
    setShowError(false)
  }

  const handleSubmit = () => {
    if (VALID_CODES.includes(code)) {
      haptics.success()
      setIsUnlocked(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    } else {
      haptics.error()
      setShowError(true)
      setTimeout(() => setShowError(false), 1000)
    }
  }

  const handleContinue = () => {
    haptics.medium()
    navigate('/love-quiz')
  }

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓']

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      display: 'flex',
      flexDirection: 'column',
      padding: 20,
    }}>
      {/* Journey Progress */}
      <JourneyProgress currentPath="/secret-code" />
      
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
        />
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { haptics.light(); navigate(-1); }}
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

      <div style={{
        maxWidth: 400,
        margin: '80px auto 0',
        width: '100%',
      }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            color: colors.textPrimary,
            fontSize: 28,
            fontWeight: 600,
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          Secret Code 🔐
        </motion.h1>

        <p style={{
          color: colors.textSecondary,
          fontSize: 14,
          textAlign: 'center',
          marginBottom: 32,
        }}>
          Enter our special code
        </p>

        {!isUnlocked ? (
          <>
            {/* Lock Display */}
            <motion.div
              animate={showError ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              style={{
                background: colors.glass,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${showError ? '#ff4444' : colors.border}`,
                borderRadius: 24,
                padding: 40,
                marginBottom: 32,
                textAlign: 'center',
              }}
            >
              <IoLockClosed size={64} color={showError ? '#ff4444' : colors.primary} style={{ marginBottom: 24 }} />

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 12,
                marginBottom: 16,
              }}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      background: index < code.length ? colors.primary : colors.border,
                      transition: 'background 0.2s',
                    }}
                  />
                ))}
              </div>

              <p style={{
                color: colors.textSecondary,
                fontSize: 24,
                fontFamily: 'monospace',
                letterSpacing: 8,
                minHeight: 32,
              }}>
                {code || ' '}
              </p>

              {showError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    color: '#ff4444',
                    fontSize: 13,
                    marginTop: 12,
                  }}
                >
                  Try again! Hint: Think about our special dates
                </motion.p>
              )}
            </motion.div>

            {/* Keypad */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
            }}>
              {numbers.map((num) => (
                <motion.button
                  key={num}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (num === 'C') handleClear()
                    else if (num === '✓') handleSubmit()
                    else handleNumberClick(num)
                  }}
                  style={{
                    padding: 24,
                    borderRadius: 16,
                    background: num === '✓' ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : colors.card,
                    border: `1px solid ${colors.border}`,
                    color: num === '✓' ? 'white' : colors.textPrimary,
                    fontSize: num === 'C' || num === '✓' ? 20 : 24,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {num}
                </motion.button>
              ))}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              borderRadius: 24,
              padding: 40,
              textAlign: 'center',
              marginBottom: 24,
            }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              <IoLockOpen size={80} color="white" style={{ marginBottom: 24 }} />
            </motion.div>

            <h2 style={{
              color: 'white',
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 12,
            }}>
              Unlocked! 🔓
            </h2>

            <p style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: 15,
              marginBottom: 24,
              lineHeight: 1.5,
            }}>
              You know our special dates by heart
            </p>

            {/* Revealed Photo */}
            <div style={{
              borderRadius: 16,
              overflow: 'hidden',
              marginBottom: 24,
            }}>
              <video
                src="https://customer-assets.emergentagent.com/job_romance-theme/artifacts/04jb8vk3_5744FE7D-DE20-40FB-94A9-C39CB3EDC595.MOV"
                controls
                playsInline
                style={{
                  width: '100%',
                  display: 'block',
                }}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: 30,
                background: 'white',
                border: 'none',
                color: colors.primary,
                fontSize: 17,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Continue
            </motion.button>
          </motion.div>
        )}

        <p style={{
          color: colors.textMuted,
          fontSize: 12,
          textAlign: 'center',
          marginTop: 16,
          fontStyle: 'italic',
        }}>
          Hint: Feb 26, Jul 11, or combine them
        </p>
      </div>
    </div>
  )
}
