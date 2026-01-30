import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBack } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import haptics from '../utils/haptics'
import Confetti from 'react-confetti'
import JourneyProgress from '../components/JourneyProgress'

// Using two different video frames as "spot the difference"
const IMAGE_1 = 'https://customer-assets.emergentagent.com/job_romance-theme/artifacts/04jb8vk3_5744FE7D-DE20-40FB-94A9-C39CB3EDC595.MOV'
const IMAGE_2 = 'https://customer-assets.emergentagent.com/job_romance-theme/artifacts/5qfbtsdz_4AC0D8EE-3674-4B81-B9A7-B6D93624CD39.MOV'

// Simulated differences (in a real implementation, these would be actual differences)
const DIFFERENCES = [
  { id: 1, x: 30, y: 25, found: false },
  { id: 2, x: 70, y: 40, found: false },
  { id: 3, x: 50, y: 60, found: false },
  { id: 4, x: 20, y: 70, found: false },
  { id: 5, x: 80, y: 30, found: false },
]

export default function SpotDifference() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [foundDifferences, setFoundDifferences] = useState<number[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize] = useState({ width: window.innerWidth, height: window.innerHeight })

  const handleSpotClick = (id: number, e: React.MouseEvent) => {
    if (foundDifferences.includes(id)) return

    haptics.success()
    setFoundDifferences([...foundDifferences, id])

    if (foundDifferences.length === DIFFERENCES.length - 1) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }

  const isComplete = foundDifferences.length === DIFFERENCES.length

  const handleContinue = () => {
    haptics.medium()
    navigate('/video-letter')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      display: 'flex',
      flexDirection: 'column',
      padding: 20,
    }}>
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
        maxWidth: 800,
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
          Spot 5 Differences 🔍
        </motion.h1>

        <p style={{
          color: colors.textSecondary,
          fontSize: 14,
          textAlign: 'center',
          marginBottom: 32,
        }}>
          Found: {foundDifferences.length}/5
        </p>

        {!isComplete ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 16,
            marginBottom: 24,
          }}>
            {/* Image 1 */}
            <div style={{
              position: 'relative',
              background: colors.card,
              borderRadius: 16,
              overflow: 'hidden',
              border: `1px solid ${colors.border}`,
            }}>
              <video
                src={IMAGE_1}
                style={{
                  width: '100%',
                  display: 'block',
                }}
                muted
                playsInline
              />

              {/* Clickable spots */}
              {DIFFERENCES.map((diff) => (
                <motion.div
                  key={diff.id}
                  onClick={(e) => handleSpotClick(diff.id, e)}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    position: 'absolute',
                    top: `${diff.y}%`,
                    left: `${diff.x}%`,
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    background: foundDifferences.includes(diff.id)
                      ? 'rgba(76, 175, 80, 0.5)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: foundDifferences.includes(diff.id)
                      ? '2px solid #4CAF50'
                      : '2px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {foundDifferences.includes(diff.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{ fontSize: 20 }}
                    >
                      ✔️
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <p style={{
              color: colors.textSecondary,
              fontSize: 13,
              textAlign: 'center',
              fontStyle: 'italic',
            }}>
              Tap the areas that look different
            </p>
          </div>
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
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
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
              Found Them All!
            </h2>

            <p style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: 16,
              marginBottom: 24,
            }}>
              You have a sharp eye 👀
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
