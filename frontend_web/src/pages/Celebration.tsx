import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoHeart, IoSparkles, IoGift } from 'react-icons/io5'
import Confetti from 'react-confetti'
import { useTheme } from '../context/ThemeContext'
import { useUser } from '../context/UserContext'
import { useAudio } from '../context/AudioContext'
import JourneyProgress from '../components/JourneyProgress'

const MEMORIES_FLOATING = [
  'Click the blue heart heheheh',
  'I will always love you',
  "You're not that dumb",
  'Wanna fuck',
  'I miss terms and conditions',
  'Thank you for being my sweet girl',
]

export default function Celebration() {
  const navigate = useNavigate()
  const { colors, isDark } = useTheme()
  const { userName } = useUser()
  const { playMagic, playPop } = useAudio()
  const [showSecret, setShowSecret] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    setTimeout(() => setShowConfetti(false), 5000)
  }, [])

  const handleSecretPress = () => {
    playMagic()
    setShowSecret(true)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      position: 'relative',
      overflow: 'auto',
    }}>
      {/* Parallax Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [-30, -80, -30],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5 + Math.random() * 4,
            delay: i * 0.2,
            repeat: Infinity,
          }}
          style={{
            position: 'fixed',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: 18 + Math.random() * 16,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {['🎉', '💕', '✨', '🎊', '💗', '⭐', '🥳'][i % 7]}
        </motion.div>
      ))}

      {/* Journey Progress */}
      <JourneyProgress currentPath="/celebration" />
      
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={150}
          colors={[colors.primary, colors.secondary, colors.tertiary, '#FFD700']}
        />
      )}

      <div style={{ padding: '100px 24px 24px', textAlign: 'center' }}>
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          style={{ marginBottom: 32, marginTop: 20 }}
        >
          <div style={{
            position: 'relative',
            display: 'inline-block',
          }}>
            <div style={{
              position: 'absolute',
              width: 100,
              height: 100,
              borderRadius: 50,
              background: colors.primaryGlow,
              top: -20,
              left: '50%',
              transform: 'translateX(-50%)',
            }} />
            <IoHeart size={60} color={colors.primary} />
          </div>
          <h1 style={{
            fontSize: 36,
            fontWeight: 300,
            color: colors.textPrimary,
            marginTop: 12,
            letterSpacing: 1,
          }}>
            You said YES!
          </h1>
        </motion.div>

        {/* Memory chips */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 10,
          marginBottom: 32,
        }}>
          {MEMORIES_FLOATING.map((memory, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              style={{
                background: colors.card,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <IoSparkles size={14} color={colors.primary} />
              <span style={{ color: colors.textSecondary, fontSize: 13 }}>{memory}</span>
            </motion.div>
          ))}
        </div>

        {/* Message Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 24,
            padding: 24,
            marginBottom: 20,
            boxShadow: `0 0 40px ${colors.primaryGlow}`,
          }}
        >
          <p style={{
            fontSize: 20,
            lineHeight: 1.7,
            color: colors.textPrimary,
            fontStyle: 'italic',
            marginBottom: 20,
          }}>
            "{userName}, you have always been my Valentine.<br />
            This just makes it official."
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            <IoHeart size={24} color={colors.primary} />
            <IoHeart size={32} color={colors.primary} />
            <IoHeart size={24} color={colors.primary} />
          </div>
        </motion.div>

        {/* Back to Home Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { playMagic(); navigate('/'); }}
          style={{
            background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryDark})`,
            border: 'none',
            color: 'white',
            padding: '16px 28px',
            borderRadius: 30,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            margin: '30px auto',
            boxShadow: `0 6px 20px ${colors.secondaryGlow}`,
          }}
        >
          <IoGift size={20} />
          Back to Home
        </motion.button>

        {/* Blue Heart - Second */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSecretPress}
          style={{
            background: isDark ? 'rgba(74, 144, 217, 0.15)' : '#E6F0FF',
            border: 'none',
            borderRadius: 30,
            padding: 15,
            cursor: 'pointer',
          }}
        >
          <IoHeart size={24} color="#4A90D9" />
        </motion.button>

        {showSecret && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              marginTop: 24,
              padding: 20,
              borderRadius: 16,
              background: isDark ? 'rgba(74, 144, 217, 0.15)' : '#E6F0FF',
            }}
          >
            <p style={{ color: '#4A90D9', fontSize: 16, fontStyle: 'italic', textAlign: 'center' }}>
              P.S. I choose you every day, and your coochie can come get stretched again muah.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}