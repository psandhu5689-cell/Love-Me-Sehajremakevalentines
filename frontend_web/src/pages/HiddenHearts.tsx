import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBack, IoHeart, IoCheckmarkCircle } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import haptics from '../utils/haptics'
import Confetti from 'react-confetti'
import JourneyProgress from '../components/JourneyProgress'

// Hidden heart positions (percentages) - scattered across the image
const HIDDEN_HEARTS = [
  { id: 1, x: 15, y: 20, size: 'small', hint: 'top left corner' },
  { id: 2, x: 78, y: 15, size: 'medium', hint: 'top right area' },
  { id: 3, x: 45, y: 35, size: 'small', hint: 'center top' },
  { id: 4, x: 25, y: 60, size: 'tiny', hint: 'left side' },
  { id: 5, x: 70, y: 55, size: 'small', hint: 'right middle' },
  { id: 6, x: 50, y: 75, size: 'medium', hint: 'bottom center' },
  { id: 7, x: 85, y: 80, size: 'tiny', hint: 'bottom right' },
]

const PHOTO_URL = 'https://customer-assets.emergentagent.com/job_love-adventure-49/artifacts/cayt7gcy_IMG_5352.jpeg'

const getHeartSize = (size: string) => {
  switch (size) {
    case 'tiny': return 24
    case 'small': return 32
    case 'medium': return 40
    default: return 32
  }
}

const getTapAreaSize = (size: string) => {
  switch (size) {
    case 'tiny': return 44
    case 'small': return 50
    case 'medium': return 56
    default: return 50
  }
}

export default function HiddenHearts() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [foundHearts, setFoundHearts] = useState<number[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [lastFound, setLastFound] = useState<number | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [pulseAll, setPulseAll] = useState(false)

  const isComplete = foundHearts.length === HIDDEN_HEARTS.length

  useEffect(() => {
    if (isComplete) {
      haptics.success()
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }, [isComplete])

  // Pulse hint effect
  useEffect(() => {
    if (showHint) {
      setPulseAll(true)
      const timer = setTimeout(() => {
        setPulseAll(false)
        setShowHint(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [showHint])

  const handleHeartTap = (heartId: number) => {
    if (foundHearts.includes(heartId)) return
    
    haptics.medium()
    setFoundHearts(prev => [...prev, heartId])
    setLastFound(heartId)
    
    // Clear last found animation after delay
    setTimeout(() => setLastFound(null), 1500)
  }

  const handleContinue = () => {
    haptics.medium()
    navigate('/hold-reveal')
  }

  const handleHint = () => {
    haptics.light()
    setShowHint(true)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          colors={[colors.primary, colors.secondary, '#FFD700', '#FF69B4']}
        />
      )}

      {/* Back Button */}
      <motion.button
        data-testid="back-button"
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
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(10px)',
          border: `1px solid rgba(255,255,255,0.2)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 100,
        }}
      >
        <IoChevronBack size={24} color="white" />
      </motion.button>

      {/* Header */}
      <div style={{
        padding: '80px 20px 20px',
        textAlign: 'center',
        background: `linear-gradient(180deg, ${colors.background} 0%, transparent 100%)`,
        position: 'relative',
        zIndex: 10,
      }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            color: colors.textPrimary,
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 8,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Hidden Hearts 💕
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            color: colors.textSecondary,
            fontSize: 14,
          }}
        >
          Find all 7 hidden hearts in the photo
        </motion.p>
      </div>

      {/* Progress Bar */}
      <div style={{
        padding: '0 20px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          flex: 1,
          height: 8,
          background: colors.glass,
          borderRadius: 4,
          overflow: 'hidden',
          border: `1px solid ${colors.border}`,
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(foundHearts.length / HIDDEN_HEARTS.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
              borderRadius: 4,
            }}
          />
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: colors.glass,
          padding: '6px 12px',
          borderRadius: 20,
          border: `1px solid ${colors.border}`,
        }}>
          <IoHeart size={16} color={colors.primary} />
          <span style={{
            color: colors.textPrimary,
            fontSize: 14,
            fontWeight: 600,
          }}>
            {foundHearts.length}/{HIDDEN_HEARTS.length}
          </span>
        </div>
      </div>

      {/* Photo Container with Hidden Hearts */}
      <div style={{
        flex: 1,
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 500,
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: `0 20px 60px ${colors.primaryGlow}`,
            border: `2px solid ${colors.border}`,
          }}
        >
          {/* Photo background */}
          <img
            src={PHOTO_URL}
            alt="Find the hearts"
            style={{
              width: '100%',
              height: 'auto',
              aspectRatio: '4/3',
              objectFit: 'cover',
              display: 'block',
            }}
          />

          {/* Overlay for better heart visibility */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.15)',
            pointerEvents: 'none',
          }} />

          {/* Hidden Hearts */}
          {HIDDEN_HEARTS.map((heart) => {
            const isFound = foundHearts.includes(heart.id)
            const isLastFound = lastFound === heart.id
            const heartSize = getHeartSize(heart.size)
            const tapSize = getTapAreaSize(heart.size)

            return (
              <motion.button
                key={heart.id}
                data-testid={`heart-${heart.id}`}
                onClick={() => handleHeartTap(heart.id)}
                initial={{ scale: 0 }}
                animate={{
                  scale: isFound ? 1 : (pulseAll ? [1, 1.3, 1] : 1),
                  opacity: isFound ? 1 : (pulseAll ? 0.8 : 0),
                }}
                whileHover={!isFound ? { scale: 1.2, opacity: 0.5 } : {}}
                whileTap={!isFound ? { scale: 0.9 } : {}}
                transition={pulseAll ? { duration: 0.5, repeat: 2 } : { type: 'spring' }}
                style={{
                  position: 'absolute',
                  left: `${heart.x}%`,
                  top: `${heart.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: tapSize,
                  height: tapSize,
                  borderRadius: '50%',
                  background: isFound 
                    ? `radial-gradient(circle, ${colors.primary}80 0%, transparent 70%)`
                    : 'transparent',
                  border: 'none',
                  cursor: isFound ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 20,
                }}
              >
                <AnimatePresence>
                  {isFound && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                    >
                      <IoHeart 
                        size={heartSize} 
                        color={colors.primary}
                        style={{
                          filter: `drop-shadow(0 0 10px ${colors.primary})`,
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Celebration burst when found */}
                {isLastFound && (
                  <>
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{
                          scale: 2,
                          opacity: 0,
                          x: Math.cos(i * 45 * Math.PI / 180) * 40,
                          y: Math.sin(i * 45 * Math.PI / 180) * 40,
                        }}
                        transition={{ duration: 0.6 }}
                        style={{
                          position: 'absolute',
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          background: colors.primary,
                        }}
                      />
                    ))}
                  </>
                )}
              </motion.button>
            )
          })}

          {/* Completion Overlay */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 30,
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  <IoCheckmarkCircle size={80} color="#4CAF50" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  style={{
                    color: 'white',
                    fontSize: 24,
                    fontWeight: 700,
                    marginTop: 16,
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  }}
                >
                  All Hearts Found! 💕
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Bottom Actions */}
      <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        {!isComplete && (
          <motion.button
            data-testid="hint-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleHint}
            style={{
              width: '100%',
              maxWidth: 400,
              margin: '0 auto',
              padding: '14px',
              borderRadius: 16,
              background: colors.glass,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${colors.border}`,
              color: colors.textSecondary,
              fontSize: 15,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <IoHeart size={18} color={colors.primary} />
            Need a hint? Tap here
          </motion.button>
        )}

        <motion.button
          data-testid="continue-button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          disabled={!isComplete}
          style={{
            width: '100%',
            maxWidth: 400,
            margin: '0 auto',
            padding: '18px',
            borderRadius: 30,
            background: isComplete 
              ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
              : colors.glass,
            border: isComplete ? 'none' : `1px solid ${colors.border}`,
            color: isComplete ? 'white' : colors.textMuted,
            fontSize: 17,
            fontWeight: 600,
            cursor: isComplete ? 'pointer' : 'not-allowed',
            boxShadow: isComplete ? `0 6px 20px ${colors.primaryGlow}` : 'none',
            opacity: isComplete ? 1 : 0.5,
          }}
        >
          {isComplete ? 'Continue 💕' : `Find ${HIDDEN_HEARTS.length - foundHearts.length} more hearts`}
        </motion.button>

        {/* Skip button */}
        {!isComplete && (
          <motion.button
            data-testid="skip-button"
            whileHover={{ scale: 1.02 }}
            onClick={() => { haptics.light(); navigate('/hold-reveal'); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: colors.textMuted,
              fontSize: 14,
              cursor: 'pointer',
              padding: '10px',
              margin: '0 auto',
            }}
          >
            Skip →
          </motion.button>
        )}
      </div>
    </div>
  )
}
