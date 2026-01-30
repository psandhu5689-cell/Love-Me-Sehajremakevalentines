import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBack, IoPlay, IoHeart } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import haptics from '../utils/haptics'
import JourneyProgress from '../components/JourneyProgress'

const VIDEO_URL = 'https://customer-assets.emergentagent.com/job_romance-theme/artifacts/04jb8vk3_5744FE7D-DE20-40FB-94A9-C39CB3EDC595.MOV'

export default function VideoLetter() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [hasStarted, setHasStarted] = useState(false)
  const [watchTime, setWatchTime] = useState(0)
  const [canContinue, setCanContinue] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const intervalRef = useRef<number | null>(null)

  const handlePlay = () => {
    haptics.medium()
    setHasStarted(true)
    videoRef.current?.play()

    // Track watch time
    intervalRef.current = window.setInterval(() => {
      setWatchTime((prev) => {
        const newTime = prev + 1
        if (newTime >= 5) {
          setCanContinue(true)
          if (intervalRef.current) clearInterval(intervalRef.current)
        }
        return newTime
      })
    }, 1000)
  }

  const handleContinue = () => {
    haptics.success()
    if (intervalRef.current) clearInterval(intervalRef.current)
    navigate('/card-match')
  }

  // Floating hearts
  const hearts = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 80 + 10}%`,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 4,
  }))

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          haptics.light()
          if (intervalRef.current) clearInterval(intervalRef.current)
          navigate(-1)
        }}
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

      {/* Floating Hearts (only when playing) */}
      {hasStarted && hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{
            y: '-100vh',
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            left: heart.left,
            fontSize: 24,
            pointerEvents: 'none',
          }}
        >
          ❤️
        </motion.div>
      ))}

      <div style={{
        maxWidth: 600,
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
            marginBottom: 16,
          }}
        >
          A Letter For You 💌
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            color: colors.textSecondary,
            fontSize: 14,
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          Watch this special moment
        </motion.p>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            background: colors.glass,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${colors.border}`,
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: `0 12px 40px ${colors.primaryGlow}`,
            position: 'relative',
          }}
        >
          <video
            ref={videoRef}
            src={VIDEO_URL}
            controls={hasStarted}
            playsInline
            style={{
              width: '100%',
              display: 'block',
              background: '#000',
            }}
          />

          {/* Play Overlay */}
          {!hasStarted && (
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.5)',
                cursor: 'pointer',
              }}
              onClick={handlePlay}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 8px 24px ${colors.primaryGlow}`,
                }}
              >
                <IoPlay size={40} color="white" style={{ marginLeft: 4 }} />
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Watch Progress */}
        {hasStarted && !canContinue && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              color: colors.textSecondary,
              fontSize: 13,
              textAlign: 'center',
              marginTop: 16,
            }}
          >
            Keep watching... {watchTime}/5 seconds
          </motion.p>
        )}

        {/* Continue Button */}
        <AnimatePresence>
          {canContinue && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinue}
              style={{
                width: '100%',
                marginTop: 24,
                padding: '16px',
                borderRadius: 30,
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                border: 'none',
                color: 'white',
                fontSize: 17,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: `0 6px 20px ${colors.primaryGlow}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              Continue
              <IoHeart size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
