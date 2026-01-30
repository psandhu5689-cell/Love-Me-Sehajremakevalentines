import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBack, IoClose } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import soundManager from '../utils/soundManager'
import Confetti from 'react-confetti'

interface Prompt {
  text: string
  correctReaction: Reaction
  alternateReaction?: Reaction
}

type Reaction = 'kiss' | 'hug' | 'tease' | 'ignore'

const PROMPTS: Prompt[] = [
  { text: 'She sent a selfie', correctReaction: 'kiss' },
  { text: 'He said "I miss you"', correctReaction: 'hug', alternateReaction: 'kiss' },
  { text: 'She is crying', correctReaction: 'hug' },
  { text: 'He is being dramatic', correctReaction: 'tease' },
  { text: 'She is mad', correctReaction: 'hug', alternateReaction: 'kiss' },
  { text: 'He is hungry', correctReaction: 'tease', alternateReaction: 'hug' },
  { text: 'She said "I love you"', correctReaction: 'kiss' },
  { text: 'He is being annoying', correctReaction: 'tease' },
  { text: 'She looks amazing', correctReaction: 'kiss' },
  { text: 'He forgot something', correctReaction: 'tease' },
  { text: 'She needs comfort', correctReaction: 'hug' },
  { text: 'He sent food pics', correctReaction: 'tease' },
  { text: 'She is sleepy', correctReaction: 'hug' },
  { text: 'He is showing off', correctReaction: 'tease' },
  { text: 'She wants attention', correctReaction: 'kiss', alternateReaction: 'hug' },
]

const REACTIONS = [
  { id: 'kiss' as Reaction, emoji: '💋', label: 'Kiss' },
  { id: 'hug' as Reaction, emoji: '🤗', label: 'Hug' },
  { id: 'tease' as Reaction, emoji: '😈', label: 'Tease' },
  { id: 'ignore' as Reaction, emoji: '🙄', label: 'Ignore' },
]

export default function ReactionJail() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [gameStarted, setGameStarted] = useState(false)
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(2.5)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null)
  const [highScore, setHighScore] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const timerRef = useRef<number | null>(null)
  const prompts = useRef<Prompt[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('reactionJailHighScore')
    if (saved) setHighScore(parseInt(saved))
  }, [])

  useEffect(() => {
    if (gameStarted && !gameOver && showResult === null) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0.1) {
            handleTimeout()
            return 0
          }
          return prev - 0.1
        })
      }, 100)

      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }
  }, [gameStarted, gameOver, currentPromptIndex, showResult])

  const startGame = () => {
    soundManager.tap()
    // Shuffle prompts
    prompts.current = [...PROMPTS].sort(() => Math.random() - 0.5).slice(0, 10)
    setGameStarted(true)
    setCurrentPromptIndex(0)
    setScore(0)
    setStreak(0)
    setGameOver(false)
    setTimeLeft(2.5)
    setShowResult(null)
  }

  const handleTimeout = () => {
    soundManager.play('uiError')
    setShowResult('wrong')
    setStreak(0)
    
    setTimeout(() => {
      nextPrompt()
    }, 1000)
  }

  const handleReaction = (reaction: Reaction) => {
    if (timerRef.current) clearInterval(timerRef.current)
    
    const currentPrompt = prompts.current[currentPromptIndex]
    const isCorrect = reaction === currentPrompt.correctReaction || 
                     reaction === currentPrompt.alternateReaction

    if (isCorrect) {
      soundManager.play('uiSuccess')
      setShowResult('correct')
      setScore(score + 10)
      setStreak(streak + 1)
      
      if (streak + 1 === 5) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 2000)
      }
    } else {
      soundManager.play('uiError')
      setShowResult('wrong')
      setStreak(0)
    }

    setTimeout(() => {
      nextPrompt()
    }, 1000)
  }

  const nextPrompt = () => {
    if (currentPromptIndex >= prompts.current.length - 1) {
      endGame()
    } else {
      setCurrentPromptIndex(currentPromptIndex + 1)
      setTimeLeft(2.5)
      setShowResult(null)
    }
  }

  const endGame = () => {
    setGameOver(true)
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('reactionJailHighScore', score.toString())
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
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

      <div style={{ maxWidth: 600, margin: '60px auto 0', width: '100%' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ color: colors.textPrimary, fontSize: 32, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}
        >
          Reaction Jail 🚨
        </motion.h1>
        <p style={{ color: colors.textSecondary, fontSize: 14, textAlign: 'center', marginBottom: 32 }}>
          React fast or go to jail!
        </p>

        {!gameStarted ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              background: colors.glass,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${colors.border}`,
              borderRadius: 24,
              padding: 40,
              marginBottom: 24,
            }}>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ fontSize: 80, marginBottom: 16 }}
              >
                🚨
              </motion.div>
              <h2 style={{ color: colors.textPrimary, fontSize: 24, marginBottom: 16 }}>
                How to Play
              </h2>
              <p style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
                • Read the prompt<br />
                • Choose the right reaction<br />
                • You have 2.5 seconds<br />
                • Wrong answer = JAIL!
              </p>
              <div style={{
                background: colors.card,
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
              }}>
                <p style={{ color: colors.textPrimary, fontSize: 16, fontWeight: 600 }}>
                  High Score: {highScore}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startGame}
              style={{
                width: '100%',
                padding: '20px',
                borderRadius: 24,
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                border: 'none',
                color: 'white',
                fontSize: 20,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Start Game
            </motion.button>
          </div>
        ) : gameOver ? (
          <div style={{ textAlign: 'center' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                background: colors.glass,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${colors.border}`,
                borderRadius: 24,
                padding: 40,
                marginBottom: 24,
              }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ fontSize: 80, marginBottom: 16 }}
              >
                {score > highScore ? '🏆' : '✨'}
              </motion.div>
              <h2 style={{ color: colors.textPrimary, fontSize: 28, marginBottom: 16 }}>
                {score > highScore ? 'New High Score!' : 'Game Over!'}
              </h2>
              <div style={{
                background: colors.card,
                borderRadius: 16,
                padding: 20,
                marginBottom: 16,
              }}>
                <p style={{ color: colors.textPrimary, fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                  Score: {score}
                </p>
                <p style={{ color: colors.textSecondary, fontSize: 14 }}>
                  High Score: {highScore}
                </p>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startGame}
              style={{
                width: '100%',
                padding: '20px',
                borderRadius: 24,
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                border: 'none',
                color: 'white',
                fontSize: 18,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Play Again
            </motion.button>
          </div>
        ) : (
          <div>
            {/* Stats */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 24,
            }}>
              <div style={{
                background: colors.card,
                borderRadius: 12,
                padding: '12px 16px',
              }}>
                <p style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 4 }}>Score</p>
                <p style={{ color: colors.primary, fontSize: 20, fontWeight: 700 }}>{score}</p>
              </div>
              <div style={{
                background: colors.card,
                borderRadius: 12,
                padding: '12px 16px',
              }}>
                <p style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 4 }}>Streak</p>
                <p style={{ color: colors.primary, fontSize: 20, fontWeight: 700 }}>🔥 {streak}</p>
              </div>
              <div style={{
                background: colors.card,
                borderRadius: 12,
                padding: '12px 16px',
              }}>
                <p style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 4 }}>Round</p>
                <p style={{ color: colors.primary, fontSize: 20, fontWeight: 700 }}>{currentPromptIndex + 1}/10</p>
              </div>
            </div>

            {/* Timer Bar */}
            <div style={{
              width: '100%',
              height: 8,
              background: colors.border,
              borderRadius: 4,
              overflow: 'hidden',
              marginBottom: 32,
            }}>
              <motion.div
                animate={{ width: `${(timeLeft / 2.5) * 100}%` }}
                style={{
                  height: '100%',
                  background: timeLeft > 1 ? `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` : '#ff4444',
                  transition: 'width 0.1s linear',
                }}
              />
            </div>

            {/* Prompt */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPromptIndex}
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
                  minHeight: 150,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {showResult === null ? (
                  <h2 style={{ color: colors.textPrimary, fontSize: 24, fontWeight: 600 }}>
                    {prompts.current[currentPromptIndex]?.text}
                  </h2>
                ) : showResult === 'correct' ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <div style={{ fontSize: 64, marginBottom: 8 }}>✅</div>
                    <p style={{ color: colors.primary, fontSize: 20, fontWeight: 600 }}>
                      Correct. You're safe.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <div style={{ fontSize: 64, marginBottom: 8 }}>🚨</div>
                    <p style={{ color: '#ff4444', fontSize: 20, fontWeight: 600 }}>
                      WRONG. JAIL.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Reaction Buttons */}
            {showResult === null && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
              }}>
                {REACTIONS.map((reaction) => (
                  <motion.button
                    key={reaction.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleReaction(reaction.id)}
                    style={{
                      padding: '20px',
                      borderRadius: 20,
                      background: colors.glass,
                      backdropFilter: 'blur(20px)',
                      border: `2px solid ${colors.border}`,
                      color: colors.textPrimary,
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 40 }}>{reaction.emoji}</span>
                    <span>{reaction.label}</span>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
