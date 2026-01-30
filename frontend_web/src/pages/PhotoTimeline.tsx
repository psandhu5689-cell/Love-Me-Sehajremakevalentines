import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBack, IoChevronForward, IoClose } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import haptics from '../utils/haptics'
import JourneyProgress from '../components/JourneyProgress'

const PHOTOS = [
  {
    url: 'https://customer-assets.emergentagent.com/job_romance-theme/artifacts/04jb8vk3_5744FE7D-DE20-40FB-94A9-C39CB3EDC595.MOV',
    caption: "Remember when we first talked? I knew you were special right away.",
    date: "Feb 26, 2025"
  },
  {
    url: 'https://customer-assets.emergentagent.com/job_romance-theme/artifacts/5qfbtsdz_4AC0D8EE-3674-4B81-B9A7-B6D93624CD39.MOV',
    caption: "You fell asleep on call again. I stayed and listened to you breathe.",
    date: "March 2025"
  },
  {
    url: 'https://customer-assets.emergentagent.com/job_romance-theme/artifacts/ep4xd9gw_7AE7E78A-C9AA-4437-B148-3644D4D18B0D.MOV',
    caption: "The way you laugh at my dumb jokes makes everything worth it.",
    date: "April 2025"
  },
  {
    url: 'https://customer-assets.emergentagent.com/job_romance-theme/artifacts/iyxch1nu_ACAF7C77-F271-4132-9484-CA469D89580D.MOV',
    caption: "Every time you call me just to say hi, I smile like an idiot.",
    date: "May 2025"
  },
  {
    url: 'https://customer-assets.emergentagent.com/job_romance-theme/artifacts/cfyjmwjq_F42C870F-FAA3-401C-8272-6260F51FBD2A.MOV',
    caption: "You're the first person I want to tell everything to.",
    date: "June 2025"
  },
  {
    url: 'https://customer-assets.emergentagent.com/job_add-this-1/artifacts/zr6k5md8_6ED17C90-F068-4114-862A-9C69C98D65D1.MOV',
    caption: "I love how you get excited about small things.",
    date: "July 2025"
  },
]

export default function PhotoTimeline() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null)

  const handlePrevious = () => {
    haptics.light()
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : PHOTOS.length - 1))
  }

  const handleNext = () => {
    haptics.light()
    setCurrentIndex((prev) => (prev < PHOTOS.length - 1 ? prev + 1 : 0))
  }

  const handleContinue = () => {
    haptics.medium()
    navigate('/crossword')
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
      {/* Back Button */}
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

      {/* Header */}
      <div style={{
        padding: '80px 20px 20px',
        textAlign: 'center',
      }}>
        <h1 style={{
          color: colors.textPrimary,
          fontSize: 28,
          fontWeight: 600,
          marginBottom: 8,
        }}>
          Our Timeline 📸
        </h1>
        <p style={{
          color: colors.textSecondary,
          fontSize: 14,
        }}>
          Swipe through our memories
        </p>
      </div>

      {/* Photo Carousel */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 20px',
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            style={{
              width: '100%',
              maxWidth: 400,
            }}
          >
            <motion.div
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                haptics.light()
                setFullscreenIndex(currentIndex)
              }}
              style={{
              background: colors.card,
              borderRadius: 20,
              overflow: 'hidden',
              border: `1px solid ${colors.border}`,
              cursor: 'pointer',
            }}
          >
            {/* Video Thumbnail */}
            <div style={{
              width: '100%',
              height: 300,
              background: colors.glass,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
              <video
                src={PHOTOS[currentIndex].url}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                muted
                playsInline
              />
              <div style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: colors.primary,
                color: 'white',
                padding: '6px 12px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600,
              }}>
                {PHOTOS[currentIndex].date}
              </div>
            </div>

            {/* Caption */}
            <div style={{
              padding: 20,
            }}>
              <p style={{
                color: colors.textPrimary,
                fontSize: 15,
                lineHeight: 1.6,
                fontStyle: 'italic',
              }}>
                "{PHOTOS[currentIndex].caption}"
              </p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>

    {/* Navigation Arrows */}
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: 80,
      padding: '20px 0',
    }}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handlePrevious}
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          background: colors.card,
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <IoChevronBack size={24} color={colors.primary} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleNext}
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          background: colors.card,
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <IoChevronForward size={24} color={colors.primary} />
      </motion.button>
    </div>

    {/* Progress Dots */}
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: 8,
      padding: '10px 0',
    }}>
      {PHOTOS.map((_, index) => (
        <div
          key={index}
          style={{
            width: index === currentIndex ? 24 : 8,
            height: 8,
            borderRadius: 4,
            background: index === currentIndex ? colors.primary : colors.border,
            transition: 'all 0.3s',
            cursor: 'pointer',
          }}
          onClick={() => {
            haptics.light()
            setCurrentIndex(index)
          }}
        />
      ))}
    </div>

    {/* Continue Button */}
    <div style={{ padding: '20px' }}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleContinue}
        style={{
          width: '100%',
          maxWidth: 400,
          margin: '0 auto',
          padding: '16px',
          borderRadius: 30,
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          border: 'none',
          color: 'white',
          fontSize: 17,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'block',
          boxShadow: `0 6px 20px ${colors.primaryGlow}`,
        }}
      >
        Continue
      </motion.button>
    </div>

    {/* Fullscreen Modal */}
    <AnimatePresence>
      {fullscreenIndex !== null && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullscreenIndex(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.95)',
              zIndex: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                setFullscreenIndex(null)
              }}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                width: 44,
                height: 44,
                borderRadius: 22,
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <IoClose size={24} color="white" />
            </motion.button>

            <video
              src={PHOTOS[fullscreenIndex].url}
              controls
              autoPlay
              playsInline
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                borderRadius: 12,
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  </div>
  )
}
