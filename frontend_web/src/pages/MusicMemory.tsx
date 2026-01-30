import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBack, IoMusicalNotes, IoPlay, IoPause } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { PLAYLIST } from '../context/MusicContext'
import haptics from '../utils/haptics'
import { Howl } from 'howler'
import JourneyProgress from '../components/JourneyProgress'

const SONG_OPTIONS = [
  { id: 1, song: PLAYLIST[0], label: 'First Love', image: 'https://customer-assets.emergentagent.com/job_romance-theme/artifacts/04jb8vk3_5744FE7D-DE20-40FB-94A9-C39CB3EDC595.MOV' },
  { id: 2, song: PLAYLIST[1], label: 'Our Song', image: 'https://customer-assets.emergentagent.com/job_romance-theme/artifacts/5qfbtsdz_4AC0D8EE-3674-4B81-B9A7-B6D93624CD39.MOV' },
  { id: 3, song: PLAYLIST[2], label: 'Happy Moment', image: 'https://customer-assets.emergentagent.com/job_romance-theme/artifacts/ep4xd9gw_7AE7E78A-C9AA-4437-B148-3644D4D18B0D.MOV' },
  { id: 4, song: PLAYLIST[3], label: 'Cozy Vibes', image: 'https://customer-assets.emergentagent.com/job_romance-theme/artifacts/iyxch1nu_ACAF7C77-F271-4132-9484-CA469D89580D.MOV' },
]

export default function MusicMemory() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [selected, setSelected] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showContinue, setShowContinue] = useState(false)
  const soundRef = useRef<Howl | null>(null)

  const handleSelect = (option: typeof SONG_OPTIONS[0]) => {
    haptics.medium()
    setSelected(option.id)

    // Stop previous sound
    if (soundRef.current) {
      soundRef.current.stop()
      soundRef.current.unload()
    }

    // Play new sound
    soundRef.current = new Howl({
      src: [option.song.url],
      html5: true,
      volume: 0.5,
      onplay: () => setIsPlaying(true),
      onend: () => {
        setIsPlaying(false)
        setShowContinue(true)
      },
    })

    soundRef.current.play()

    // Auto-stop after 10 seconds
    setTimeout(() => {
      if (soundRef.current) {
        soundRef.current.stop()
        setIsPlaying(false)
        setShowContinue(true)
      }
    }, 10000)
  }

  const togglePlayPause = () => {
    if (!soundRef.current) return

    if (isPlaying) {
      soundRef.current.pause()
      setIsPlaying(false)
    } else {
      soundRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleContinue = () => {
    if (soundRef.current) {
      soundRef.current.stop()
      soundRef.current.unload()
    }
    haptics.success()
    navigate('/heart-draw')
  }

  React.useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.stop()
        soundRef.current.unload()
      }
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      display: 'flex',
      flexDirection: 'column',
      padding: 20,
    }}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          haptics.light()
          if (soundRef.current) {
            soundRef.current.stop()
            soundRef.current.unload()
          }
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

      <div style={{
        maxWidth: 600,
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
          Our Song 🎵
        </motion.h1>

        <p style={{
          color: colors.textSecondary,
          fontSize: 14,
          textAlign: 'center',
          marginBottom: 32,
        }}>
          Pick the song that feels like us
        </p>

        {/* Song Options */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 16,
          marginBottom: 24,
        }}>
          {SONG_OPTIONS.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(option)}
              style={{
                background: selected === option.id ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : colors.glass,
                backdropFilter: 'blur(20px)',
                border: selected === option.id ? 'none' : `1px solid ${colors.border}`,
                borderRadius: 16,
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <video
                src={option.image}
                style={{
                  width: '100%',
                  height: 120,
                  objectFit: 'cover',
                  opacity: selected === option.id ? 0.3 : 0.7,
                }}
                muted
                playsInline
              />

              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 12,
              }}>
                <IoMusicalNotes size={32} color={selected === option.id ? 'white' : colors.primary} />
                <p style={{
                  color: selected === option.id ? 'white' : colors.textPrimary,
                  fontSize: 14,
                  fontWeight: 600,
                  marginTop: 8,
                  textAlign: 'center',
                }}>
                  {option.label}
                </p>
              </div>

              {selected === option.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: 16 }}>✅</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Play/Pause Control */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: colors.glass,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${colors.border}`,
              borderRadius: 20,
              padding: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 24,
            }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlayPause}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {isPlaying ? (
                <IoPause size={24} color="white" />
              ) : (
                <IoPlay size={24} color="white" style={{ marginLeft: 2 }} />
              )}
            </motion.button>

            <div style={{ flex: 1 }}>
              <p style={{
                color: colors.textPrimary,
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 4,
              }}>
                {SONG_OPTIONS.find(o => o.id === selected)?.song.title || 'Playing...'}
              </p>
              <p style={{
                color: colors.textSecondary,
                fontSize: 12,
              }}>
                {isPlaying ? 'Playing...' : 'Paused'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Continue Button */}
        <AnimatePresence>
          {showContinue && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
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
        </AnimatePresence>
      </div>
    </div>
  )
}
