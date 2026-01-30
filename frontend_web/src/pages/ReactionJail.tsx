import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBack, IoTimer, IoSkull, IoCheckmark, IoClose, IoTrophy } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import soundManager from '../utils/soundManager'

interface Prompt {
  id: string
  text: string
  action: 'tap' | 'hold' | 'wait'
  correctDuration?: number
}

interface GameResult {
  score: number
  totalPrompts: number
  timestamp: number
}

const PROMPTS: Prompt[] = [
  { id: '1', text: 'TAP NOW!', action: 'tap' },
  { id: '2', text: "DON'T TAP!", action: 'wait' },
  { id: '3', text: 'HOLD 3 SECONDS', action: 'hold', correctDuration: 3000 },
  { id: '4', text: 'TAP QUICK!', action: 'tap' },
  { id: '5', text: 'FREEZE! (Wait)', action: 'wait' },
  { id: '6', text: 'HOLD 2 SECONDS', action: 'hold', correctDuration: 2000 },
  { id: '7', text: 'TAP!', action: 'tap' },
  { id: '8', text: "DON'T MOVE!", action: 'wait' },
  { id: '9', text: 'HOLD 4 SECONDS', action: 'hold', correctDuration: 4000 },
  { id: '10', text: 'QUICK TAP!', action: 'tap' },
  { id: '11', text: 'STAY STILL!', action: 'wait' },
  { id: '12', text: 'TAP NOW!', action: 'tap' },
  { id: '13', text: 'HOLD 5 SECONDS', action: 'hold', correctDuration: 5000 },
  { id: '14', text: "DON'T TAP!", action: 'wait' },
  { id: '15', text: 'FINAL TAP!', action: 'tap' },
]

export default function ReactionJail() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle')
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [isHolding, setIsHolding] = useState(false)
  const [holdStartTime, setHoldStartTime] = useState<number | null>(null)
  const [holdDuration, setHoldDuration] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [history, setHistory] = useState<GameResult[]>([])
  const [timeLeft, setTimeLeft] = useState(3000) // 3 seconds per prompt
  const [showHistory, setShowHistory] = useState(false)

  const currentPrompt = PROMPTS[currentPromptIndex]

  useEffect(() => {
    loadHistory()
  }, [])

  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing') return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          // Time's up
          if (currentPrompt.action === 'wait') {
            // Success on wait action
            handleCorrect()
          } else {
            // Fail on other actions
            handleWrong()
          }
          return 0
        }
        return prev - 100
      })
    }, 100)

    return () => clearInterval(timer)
  }, [gameState, currentPromptIndex])

  // Hold timer effect
  useEffect(() => {
    if (!isHolding || !holdStartTime) return

    const timer = setInterval(() => {
      const duration = Date.now() - holdStartTime
      setHoldDuration(duration)
    }, 50)

    return () => clearInterval(timer)
  }, [isHolding, holdStartTime])

  const loadHistory = () => {
    const saved = localStorage.getItem('reactionJailHistory')
    if (saved) setHistory(JSON.parse(saved))
  }

  const saveHistory = (result: GameResult) => {
    const updated = [result, ...history].slice(0, 10)
    localStorage.setItem('reactionJailHistory', JSON.stringify(updated))
    setHistory(updated)
  }

  const startGame = () => {
    soundManager.play('uiSuccess')
    setGameState('playing')
    setCurrentPromptIndex(0)
    setScore(0)
    setTimeLeft(3000)
    setFeedback(null)
  }

  const handleCorrect = () => {
    soundManager.play('uiSuccess')
    setScore(prev => prev + 1)
    setFeedback('correct')
    setTimeout(() => {
      nextPrompt()
    }, 800)
  }

  const handleWrong = () => {
    soundManager.play('uiError')
    setFeedback('wrong')
    setTimeout(() => {
      nextPrompt()
    }, 800)
  }

  const nextPrompt = () => {
    setFeedback(null)
    if (currentPromptIndex >= PROMPTS.length - 1) {
      // Game finished
      const result: GameResult = {
        score,
        totalPrompts: PROMPTS.length,
        timestamp: Date.now(),
      }
      saveHistory(result)
      setGameState('finished')
    } else {
      setCurrentPromptIndex(prev => prev + 1)
      setTimeLeft(3000)
    }
  }

  const handleTap = () => {
    if (gameState !== 'playing' || feedback) return

    if (currentPrompt.action === 'tap') {
      handleCorrect()
    } else {
      handleWrong()
    }
  }

  const handleMouseDown = () => {
    if (gameState !== 'playing' || feedback) return
    if (currentPrompt.action === 'hold') {
      setIsHolding(true)
      setHoldStartTime(Date.now())
    }
  }

  const handleMouseUp = () => {
    if (!isHolding || !holdStartTime) return

    setIsHolding(false)
    const duration = Date.now() - holdStartTime
    setHoldStartTime(null)

    if (currentPrompt.action === 'hold' && currentPrompt.correctDuration) {
      const tolerance = 500 // 0.5 second tolerance
      if (Math.abs(duration - currentPrompt.correctDuration) <= tolerance) {
        handleCorrect()
      } else {
        handleWrong()
      }
    }

    setHoldDuration(0)
  }

  const getHoldProgress = () => {
    if (!currentPrompt.correctDuration) return 0
    return Math.min((holdDuration / currentPrompt.correctDuration) * 100, 100)
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
          Reaction Jail ⚡
        </motion.h1>
        <p style={{ color: colors.textSecondary, fontSize: 14, textAlign: 'center', marginBottom: 32 }}>
          Fast reflexes or locked up!
        </p>

        {/* Idle State */}
        {gameState === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center' }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontSize: 80, marginBottom: 24 }}
            >
              ⚡
            </motion.div>

            <div style={{
              background: colors.glass,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${colors.border}`,
              borderRadius: 24,
              padding: 32,
              marginBottom: 32,
              textAlign: 'left',
            }}>
              <h3 style={{ color: colors.textPrimary, fontSize: 20, fontWeight: 600, marginBottom: 16 }}>How to Play:</h3>
              <ul style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 2, paddingLeft: 20 }}>
                <li>Follow prompts quickly (3 seconds each)</li>
                <li><strong>TAP:</strong> Tap the screen</li>
                <li><strong>HOLD:</strong> Press and hold for exact seconds</li>
                <li><strong>WAIT:</strong> Don't touch anything!</li>
                <li>React fast or you're locked up! ⚡</li>
              </ul>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startGame}
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
                marginBottom: 16,
                boxShadow: `0 8px 24px ${colors.primaryGlow}`,
              }}
            >
              Start Game 🎮
            </motion.button>

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
              }}
            >
              {showHistory ? 'Hide' : 'Show'} History
            </motion.button>

            {/* History */}
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ marginTop: 16 }}
                >
                  {history.length === 0 ? (
                    <div style={{ color: colors.textSecondary, textAlign: 'center', padding: 20 }}>
                      No games played yet
                    </div>
                  ) : (
                    history.map((result, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        style={{
                          background: colors.card,
                          border: `1px solid ${colors.border}`,
                          borderRadius: 12,
                          padding: 16,
                          marginBottom: 8,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <p style={{ color: colors.textPrimary, fontSize: 16, fontWeight: 600 }}>
                            Score: {result.score}/{result.totalPrompts}
                          </p>
                          <p style={{ color: colors.textSecondary, fontSize: 12 }}>
                            {new Date(result.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div style={{
                          color: result.score >= result.totalPrompts * 0.8 ? '#44ff44' : '#ff4444',
                          fontSize: 20,
                        }}>
                          {result.score >= result.totalPrompts * 0.8 ? '🏆' : '💀'}
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Playing State */}
        {gameState === 'playing' && currentPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center' }}
          >
            {/* Progress Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}>
              <span style={{ color: colors.textSecondary, fontSize: 14 }}>
                Prompt {currentPromptIndex + 1}/{PROMPTS.length}
              </span>
              <span style={{ color: colors.primary, fontSize: 18, fontWeight: 600 }}>
                Score: {score}
              </span>
            </div>

            {/* Timer */}
            <div style={{
              width: '100%',
              height: 8,
              background: colors.card,
              borderRadius: 4,
              overflow: 'hidden',
              marginBottom: 32,
            }}>
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: `${(timeLeft / 3000) * 100}%` }}
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                }}
              />
            </div>

            {/* Prompt Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPrompt.id}
                initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
                onClick={() => currentPrompt.action === 'tap' && handleTap()}
                style={{
                  background: feedback === 'correct' 
                    ? 'linear-gradient(135deg, #44ff44, #00cc00)'
                    : feedback === 'wrong'
                    ? 'linear-gradient(135deg, #ff4444, #cc0000)'
                    : colors.glass,
                  backdropFilter: 'blur(20px)',
                  border: `2px solid ${feedback === 'correct' ? '#44ff44' : feedback === 'wrong' ? '#ff4444' : colors.border}`,
                  borderRadius: 32,
                  padding: 60,
                  marginBottom: 32,
                  cursor: currentPrompt.action === 'hold' ? 'grab' : currentPrompt.action === 'tap' ? 'pointer' : 'default',
                  userSelect: 'none',
                  position: 'relative',
                  minHeight: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {feedback === 'correct' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{ position: 'absolute', top: 20, right: 20 }}
                  >
                    <IoCheckmark size={48} color="white" />
                  </motion.div>
                )}
                
                {feedback === 'wrong' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{ position: 'absolute', top: 20, right: 20 }}
                  >
                    <IoClose size={48} color="white" />
                  </motion.div>
                )}

                <motion.h2
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{
                    color: feedback ? 'white' : colors.textPrimary,
                    fontSize: 36,
                    fontWeight: 700,
                    marginBottom: 16,
                  }}
                >
                  {currentPrompt.text}
                </motion.h2>

                {currentPrompt.action === 'hold' && isHolding && (
                  <div style={{
                    width: '100%',
                    maxWidth: 300,
                    height: 12,
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: 6,
                    overflow: 'hidden',
                    marginTop: 20,
                  }}>
                    <motion.div
                      style={{
                        height: '100%',
                        background: 'white',
                        width: `${getHoldProgress()}%`,
                      }}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* Finished State */}
        {gameState === 'finished' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center' }}
          >
            <motion.div
              animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ fontSize: 100, marginBottom: 24 }}
            >
              {score >= PROMPTS.length * 0.8 ? '🏆' : score >= PROMPTS.length * 0.5 ? '⚡' : '💀'}
            </motion.div>

            <div style={{
              background: colors.glass,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${colors.border}`,
              borderRadius: 24,
              padding: 40,
              marginBottom: 32,
            }}>
              <h2 style={{ color: colors.textPrimary, fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
                Game Over!
              </h2>
              <p style={{ color: colors.textSecondary, fontSize: 16, marginBottom: 24 }}>
                {score >= PROMPTS.length * 0.8 ? 'Lightning reflexes! 🏆' : score >= PROMPTS.length * 0.5 ? 'Not bad! Keep practicing ⚡' : 'Locked up! Try again 💀'}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'baseline',
                gap: 8,
                marginBottom: 16,
              }}>
                <span style={{ color: colors.primary, fontSize: 48, fontWeight: 700 }}>{score}</span>
                <span style={{ color: colors.textSecondary, fontSize: 20 }}>/ {PROMPTS.length}</span>
              </div>
              <p style={{ color: colors.textSecondary, fontSize: 14 }}>
                Accuracy: {Math.round((score / PROMPTS.length) * 100)}%
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { soundManager.tap(); setGameState('idle'); }}
              style={{
                width: '100%',
                padding: '20px',
                borderRadius: 20,
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
          </motion.div>
        )}
      </div>
    </div>
  )
}
