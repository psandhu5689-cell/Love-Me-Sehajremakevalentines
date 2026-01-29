import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBack, IoHeart, IoHeartHalf } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAudio } from '../context/AudioContext'
import haptics from '../utils/haptics'

const SAD_MESSAGES = [
  "You're not alone in this.",
  "I'm right here with you.",
  "It's okay to feel this way.",
  "You're stronger than you think.",
  "This too shall pass.",
  "I believe in you.",
  "You've got this.",
  "Take your time, no rush.",
  "You're doing amazing.",
  "I'm proud of you.",
  "You matter so much.",
  "Your feelings are valid.",
  "One step at a time.",
  "You're loved.",
  "Breathe, you're safe.",
  "Tomorrow is a new day.",
  "You're enough, just as you are.",
  "I'm here to listen.",
  "You're not a burden.",
  "You deserve kindness.",
]

export default function DailyLove() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const { playClick, playPop } = useAudio()
  
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [kissDelivered, setKissDelivered] = useState(false)
  const [hugDelivered, setHugDelivered] = useState(false)
  const lastMessageRef = useRef(0)
  
  // Spin wheel to new random message
  const handleSpinWheel = () => {
    haptics.light()
    playClick()
    
    // Get random message different from current
    let newIndex = Math.floor(Math.random() * SAD_MESSAGES.length)
    while (newIndex === currentMessageIndex && SAD_MESSAGES.length > 1) {
      newIndex = Math.floor(Math.random() * SAD_MESSAGES.length)
    }
    setCurrentMessageIndex(newIndex)
    lastMessageRef.current = newIndex
  }
  
  // Quick kiss handler
  const handleQuickKiss = () => {
    playPop()
    haptics.medium()
    setKissDelivered(true)
    setTimeout(() => setKissDelivered(false), 2000)
  }
  
  // Hug handler
  const handleHug = () => {
    playPop()
    haptics.medium()
    setHugDelivered(true)
    setTimeout(() => setHugDelivered(false), 3000)
  }
  
  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      display: 'flex',
      flexDirection: 'column',
      padding: 20,
      position: 'relative',
      overflow: 'auto',
    }}>
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
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
      
      {/* Main Content Container */}
      <div style={{
        maxWidth: 500,
        margin: '80px auto 0',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            color: colors.textPrimary,
            fontSize: 28,
            fontWeight: 600,
            marginBottom: 8,
          }}>
            I'm here for you
          </h1>
          <p style={{
            color: colors.textSecondary,
            fontSize: 14,
            fontStyle: 'italic',
          }}>
            When you need comfort
          </p>
        </div>
        
        {/* Message Wheel Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: colors.glass,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${colors.border}`,
            borderRadius: 24,
            padding: 32,
            boxShadow: `0 8px 32px ${colors.primaryGlow}`,
          }}
        >
          {/* Single Message Display */}
          <div style={{
            minHeight: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMessageIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                style={{
                  color: colors.textPrimary,
                  fontSize: 20,
                  fontWeight: 600,
                  textAlign: 'center',
                  lineHeight: 1.6,
                  fontStyle: 'italic',
                }}
              >
                "{SAD_MESSAGES[currentMessageIndex]}"
              </motion.p>
            </AnimatePresence>
          </div>
          
          {/* Spin Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSpinWheel}
            style={{
              width: '100%',
              padding: '14px 24px',
              borderRadius: 16,
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              border: 'none',
              color: 'white',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: `0 4px 16px ${colors.primaryGlow}`,
            }}
          >
            Another Message
          </motion.button>
        </motion.div>
        
        {/* BIG HUG WIDGET */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: colors.glass,
            backdropFilter: 'blur(20px)',
            border: `2px solid ${colors.primary}`,
            borderRadius: 24,
            padding: 40,
            boxShadow: `0 8px 32px ${colors.primaryGlow}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Hug Delivered Overlay */}
          <AnimatePresence>
            {hugDelivered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(135deg, ${colors.primary}dd, ${colors.secondary}dd)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  borderRadius: 24,
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: 2 }}
                  >
                    <IoHeart size={64} color="white" />
                  </motion.div>
                  <p style={{
                    color: 'white',
                    fontSize: 24,
                    fontWeight: 600,
                    marginTop: 16,
                  }}>
                    Hug delivered 🤗
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Hug Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleHug}
            style={{
              width: '100%',
              minHeight: 140,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <IoHeart size={72} color={colors.primary} />
            </motion.div>
            <p style={{
              color: colors.textPrimary,
              fontSize: 24,
              fontWeight: 700,
              textAlign: 'center',
            }}>
              Need a Hug?
            </p>
            <p style={{
              color: colors.textSecondary,
              fontSize: 14,
              textAlign: 'center',
            }}>
              Tap here for virtual comfort
            </p>
          </motion.button>
        </motion.div>
        
        {/* Quick Kiss Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleQuickKiss}
          style={{
            background: colors.glass,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${colors.border}`,
            borderRadius: 16,
            padding: '16px 24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            boxShadow: `0 4px 16px ${colors.secondaryGlow}`,
          }}
        >
          <span style={{ fontSize: 24 }}>💋</span>
          <span style={{
            color: colors.textPrimary,
            fontSize: 16,
            fontWeight: 600,
          }}>
            {kissDelivered ? 'Kiss delivered!' : 'Quick Kiss'}
          </span>
        </motion.button>
        
        <div style={{ height: 40 }} /> {/* Bottom spacing */}
      </div>
    </div>
  )
}
