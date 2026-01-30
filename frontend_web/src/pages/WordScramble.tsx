import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBack, IoRefresh, IoCheckmarkCircle } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import haptics from '../utils/haptics'
import Confetti from 'react-confetti'
import JourneyProgress from '../components/JourneyProgress'

const WORDS = [
  { word: 'SEHAJ', scrambled: 'JAESH', hint: 'Your girl' },
  { word: 'PRABH', scrambled: 'HBPAR', hint: 'Your boy' },
  { word: 'BERRYBOO', scrambled: 'YROBEROB', hint: 'Sweet nickname' },
  { word: 'CRYBABY', scrambled: 'BABYCRY', hint: 'When emotional' },
  { word: 'LOVE', scrambled: 'VOLE', hint: 'What we have' },
  { word: 'CUDDLE', scrambled: 'DUDELC', hint: 'Cozy together' },
  { word: 'KISS', scrambled: 'SIKS', hint: 'Sweet gesture' },
  { word: 'FOREVER', scrambled: 'ROFEVRE', hint: 'How long' },
]

export default function WordScramble() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [solved, setSolved] = useState<number[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })

  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const currentWord = WORDS[currentIndex]
  const isAllSolved = solved.length === WORDS.length

  const handleSubmit = () => {
    if (userAnswer.toUpperCase() === currentWord.word) {
      haptics.success()
      setSolved([...solved, currentIndex])
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
      
      setTimeout(() => {
        if (currentIndex < WORDS.length - 1) {
          setCurrentIndex(currentIndex + 1)
          setUserAnswer('')
        }
      }, 1500)
    } else {
      haptics.error()
    }
  }

  const handleSkip = () => {
    haptics.light()
    if (currentIndex < WORDS.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setUserAnswer('')
    }
  }

  const handleContinue = () => {
    haptics.medium()
    navigate('/spot-difference')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      display: 'flex',
      flexDirection: 'column',
      padding: 20,
    }}>
      {/* Journey Progress */}
      <JourneyProgress currentPath="/word-scramble" />
      
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
        maxWidth: 500,
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
          Word Scramble 🔤
        </motion.h1>

        <p style={{
          color: colors.textSecondary,
          fontSize: 14,
          textAlign: 'center',
          marginBottom: 32,
        }}>
          Unscramble our special words
        </p>

        {/* Progress */}
        <div style={{
          display: 'flex',
          gap: 4,
          marginBottom: 32,
          justifyContent: 'center',
        }}>
          {WORDS.map((_, index) => (
            <div
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: solved.includes(index) ? colors.primary : colors.border,
              }}
            />
          ))}
        </div>

        {!isAllSolved ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              {/* Scrambled Word */}
              <div style={{
                background: colors.glass,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${colors.border}`,
                borderRadius: 24,
                padding: 32,
                marginBottom: 24,
                textAlign: 'center',
              }}>
                <p style={{
                  color: colors.textSecondary,
                  fontSize: 13,
                  marginBottom: 16,
                }}>
                  Hint: {currentWord.hint}
                </p>

                <div style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: colors.primary,
                  letterSpacing: 8,
                  marginBottom: 24,
                }}>
                  {currentWord.scrambled}
                </div>

                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Your answer..."
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: 20,
                    textAlign: 'center',
                    background: colors.card,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 16,
                    color: colors.textPrimary,
                    outline: 'none',
                    letterSpacing: 4,
                  }}
                />
              </div>

              {/* Buttons */}
              <div style={{
                display: 'flex',
                gap: 12,
              }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSkip}
                  style={{
                    flex: 1,
                    padding: '16px',
                    borderRadius: 16,
                    background: colors.card,
                    border: `1px solid ${colors.border}`,
                    color: colors.textSecondary,
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
                  disabled={!userAnswer}
                  style={{
                    flex: 2,
                    padding: '16px',
                    borderRadius: 16,
                    background: userAnswer ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : colors.glass,
                    border: 'none',
                    color: 'white',
                    fontSize: 17,
                    fontWeight: 600,
                    cursor: userAnswer ? 'pointer' : 'not-allowed',
                    opacity: userAnswer ? 1 : 0.5,
                  }}
                >
                  Submit
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              borderRadius: 24,
              padding: 40,
              textAlign: 'center',
            }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              style={{ fontSize: 64, marginBottom: 16 }}
            >
              🎉
            </motion.div>

            <h2 style={{
              color: 'white',
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 8,
            }}>
              Perfect!
            </h2>

            <p style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: 16,
              marginBottom: 24,
            }}>
              You unscrambled all our special words
            </p>

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
      </div>
    </div>
  )
}
