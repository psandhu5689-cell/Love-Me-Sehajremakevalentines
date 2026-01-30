import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBack, IoRefresh } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import haptics from '../utils/haptics'
import Confetti from 'react-confetti'
import JourneyProgress from '../components/JourneyProgress'

export default function HeartDraw() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [strokes, setStrokes] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize] = useState({ width: window.innerWidth, height: window.innerHeight })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    ctx.strokeStyle = colors.primary
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [colors])

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsDrawing(true)
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    setStrokes(strokes + 1)

    // Simple check: if user made enough strokes, consider it complete
    if (strokes >= 5 && !isComplete) {
      haptics.success()
      setIsComplete(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setStrokes(0)
    setIsComplete(false)
    haptics.light()
  }

  const handleContinue = () => {
    haptics.medium()
    navigate('/secret-code')
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
      <JourneyProgress currentPath="/heart-draw" />
      
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
          Draw a Heart ❤️
        </motion.h1>

        <p style={{
          color: colors.textSecondary,
          fontSize: 14,
          textAlign: 'center',
          marginBottom: 32,
        }}>
          Draw with your finger or mouse
        </p>

        {/* Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: colors.glass,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${colors.border}`,
            borderRadius: 24,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{
              width: '100%',
              height: 300,
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 16,
              cursor: 'crosshair',
              touchAction: 'none',
            }}
          />

          {/* Clear Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearCanvas}
            style={{
              marginTop: 16,
              padding: '12px 24px',
              borderRadius: 20,
              background: colors.card,
              border: `1px solid ${colors.border}`,
              color: colors.textPrimary,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              margin: '16px auto 0',
            }}
          >
            <IoRefresh size={18} />
            Clear
          </motion.button>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                borderRadius: 20,
                padding: 24,
                textAlign: 'center',
                marginBottom: 24,
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{ fontSize: 48, marginBottom: 12 }}
              >
                ❤️
              </motion.div>

              <h3 style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 600,
                marginBottom: 8,
              }}>
                Perfect! 💗
              </h3>

              <p style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: 14,
              }}>
                Your heart is beautiful, just like you
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue Button */}
        {isComplete && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 30,
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              border: 'none',
              color: 'white',
              fontSize: 17,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: `0 6px 20px ${colors.primaryGlow}`,
            }}
          >
            Continue
          </motion.button>
        )}
      </div>
    </div>
  )
}
