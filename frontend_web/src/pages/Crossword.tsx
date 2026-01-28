import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoChevronBack, IoChevronForward, IoCheckmark } from 'react-icons/io5'
import { useTheme } from '../context/ThemeContext'
import { useAudio } from '../context/AudioContext'

const PUZZLE = {
  word: 'SEHAJ',
  clue: 'The most beautiful person in my world',
}

export default function Crossword() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const { playClick, playComplete } = useAudio()
  const [letters, setLetters] = useState<string[]>(Array(PUZZLE.word.length).fill(''))
  const [isComplete, setIsComplete] = useState(false)

  const handleLetterChange = (index: number, value: string) => {
    playClick()
    const newLetters = [...letters]
    newLetters[index] = value.toUpperCase().slice(-1)
    setLetters(newLetters)

    const word = newLetters.join('')
    if (word === PUZZLE.word) {
      playComplete()
      setIsComplete(true)
    }

    // Auto-focus next input
    if (value && index < PUZZLE.word.length - 1) {
      const nextInput = document.getElementById(`letter-${index + 1}`)
      nextInput?.focus()
    }
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
    }}>
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

      {/* Skip Button */}
      {!isComplete && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => { playClick(); navigate('/card-match'); }}
          style={{
            position: 'absolute',
            top: 50,
            right: 16,
            padding: '8px 14px',
            borderRadius: 20,
            background: colors.card,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
          }}
        >
          <span style={{ color: colors.textSecondary, fontSize: 14, fontWeight: 500 }}>Skip</span>
          <IoChevronForward size={16} color={colors.textSecondary} />
        </motion.button>
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', maxWidth: 400 }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 300, color: colors.textPrimary, marginBottom: 8 }}>
          Mini Crossword
        </h1>
        <p style={{ color: colors.textSecondary, fontStyle: 'italic', marginBottom: 40 }}>
          Solve the puzzle 💕
        </p>

        <div style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: 20,
          padding: 24,
          marginBottom: 24,
          boxShadow: `0 0 40px ${colors.primaryGlow}`,
        }}>
          <p style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 20 }}>
            <strong>Clue:</strong> {PUZZLE.clue}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            {PUZZLE.word.split('').map((_, index) => (
              <input
                key={index}
                id={`letter-${index}`}
                type="text"
                value={letters[index]}
                onChange={(e) => handleLetterChange(index, e.target.value)}
                maxLength={1}
                disabled={isComplete}
                style={{
                  width: 50,
                  height: 50,
                  textAlign: 'center',
                  fontSize: 24,
                  fontWeight: 600,
                  border: `2px solid ${isComplete && letters[index] === PUZZLE.word[index] ? colors.success : colors.border}`,
                  borderRadius: 12,
                  background: isComplete ? colors.card : 'transparent',
                  color: isComplete ? colors.success : colors.textPrimary,
                  outline: 'none',
                }}
              />
            ))}
          </div>
        </div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 24,
            }}>
              <IoCheckmark size={24} color={colors.success} />
              <span style={{ color: colors.success, fontSize: 18, fontWeight: 600 }}>
                That's right! It's you! 💖
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { playClick(); navigate('/card-match'); }}
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
              }}
            >
              Continue
              <IoChevronForward size={20} />
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}