import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoChevronBack, IoSparkles, IoArrowForward, IoChevronForward } from 'react-icons/io5'
import { useTheme } from '../context/ThemeContext'
import { useUser } from '../context/UserContext'
import { useAudio } from '../context/AudioContext'
import JourneyProgress from '../components/JourneyProgress'

export default function Personalization() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const { setUserName } = useUser()
  const { playKiss, playClick } = useAudio()
  const [name, setName] = useState('')

  const handleContinue = () => {
    playKiss()
    const finalName = name.trim() || 'Sehaj'
    setUserName(finalName)
    navigate('/origin')
  }

  const handleSkip = () => {
    playClick()
    setUserName('Sehaj')
    navigate('/crossword')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Parallax Floating particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [-20, -50, -20],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            delay: i * 0.3,
            repeat: Infinity,
          }}
          style={{
            position: 'fixed',
            left: `${5 + Math.random() * 90}%`,
            top: `${10 + Math.random() * 80}%`,
            fontSize: 16 + Math.random() * 10,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {['💫', '💕', '✨', '💗', '✏️'][i % 5]}
        </motion.div>
      ))}

      {/* Journey Progress */}
      <JourneyProgress currentPath="/personalization" />
      
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { playClick(); navigate(-1); }}
        style={{
          position: 'absolute',
          top: 50,
          left: 16,
          width: 44,
          height: 44,
          borderRadius: 22,
          background: colors.glass,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
        }}
      >
        <IoChevronBack size={24} color={colors.primary} />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', width: '100%', maxWidth: 400 }}
      >
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          background: colors.primaryGlow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 30px',
        }}>
          <IoSparkles size={40} color={colors.primary} />
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 300, color: colors.textPrimary, marginBottom: 12 }}>
          What should I call you?
        </h1>

        <p style={{ color: colors.primary, fontSize: 15, fontStyle: 'italic', marginBottom: 8, lineHeight: 1.5 }}>
          wife, Berryboo, poopypants,<br />whatever your name is 💕
        </p>

        <p style={{ color: colors.textMuted, fontSize: 13, fontStyle: 'italic', marginBottom: 30 }}>
          (You can skip to continue as Sehaj)
        </p>

        <div style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: 16,
          padding: 4,
          marginBottom: 30,
          boxShadow: `0 0 40px ${colors.primaryGlow}`,
        }}>
          <input
            type="text"
            value={name}
            onChange={(e) => { playClick(); setName(e.target.value); }}
            placeholder="Your name..."
            style={{
              width: '100%',
              padding: 18,
              fontSize: 18,
              textAlign: 'center',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: colors.textPrimary,
            }}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            border: 'none',
            color: 'white',
            padding: '16px 36px',
            borderRadius: 30,
            fontSize: 17,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            margin: '0 auto',
            boxShadow: `0 6px 20px ${colors.primaryGlow}`,
          }}
        >
          Continue
          <IoArrowForward size={20} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={handleSkip}
          style={{
            background: 'transparent',
            border: 'none',
            color: colors.textSecondary,
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            margin: '16px auto 0',
          }}
        >
          Skip
          <IoChevronForward size={16} />
        </motion.button>
      </motion.div>
    </div>
  )
}