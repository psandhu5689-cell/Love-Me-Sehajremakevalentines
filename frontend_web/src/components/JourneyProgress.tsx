import React from 'react'
import { motion } from 'framer-motion'
import { IoHeart } from 'react-icons/io5'
import { useTheme } from '../context/ThemeContext'

// Valentine's sequence pages in order
const SEQUENCE_PAGES = [
  { path: '/personalization', name: 'Name', short: '💫' },
  { path: '/origin', name: 'Story', short: '📖' },
  { path: '/photo-timeline', name: 'Photos', short: '📸' },
  { path: '/crossword', name: 'Crossword', short: '✏️' },
  { path: '/word-scramble', name: 'Scramble', short: '🔤' },
  { path: '/spot-difference', name: 'Spot', short: '🔍' },
  { path: '/video-letter', name: 'Video', short: '📹' },
  { path: '/card-match', name: 'Match', short: '🎴' },
  { path: '/hidden-hearts', name: 'Hearts', short: '💕' },
  { path: '/hold-reveal', name: 'Reveal', short: '🔓' },
  { path: '/music-memory', name: 'Music', short: '🎵' },
  { path: '/heart-draw', name: 'Draw', short: '❤️' },
  { path: '/secret-code', name: 'Code', short: '🔐' },
  { path: '/love-quiz', name: 'Quiz', short: '❓' },
  { path: '/quiet-stars', name: 'Stars', short: '⭐' },
  { path: '/question', name: 'Question', short: '💝' },
  { path: '/celebration', name: 'Celebrate', short: '🎉' },
]

interface JourneyProgressProps {
  currentPath: string
  variant?: 'minimal' | 'full' | 'heart'
}

export default function JourneyProgress({ currentPath, variant = 'heart' }: JourneyProgressProps) {
  const { colors } = useTheme()
  
  const currentIndex = SEQUENCE_PAGES.findIndex(p => p.path === currentPath)
  const progress = currentIndex >= 0 ? ((currentIndex + 1) / SEQUENCE_PAGES.length) * 100 : 0
  const currentPage = SEQUENCE_PAGES[currentIndex]
  
  if (currentIndex < 0) return null

  if (variant === 'minimal') {
    return (
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: colors.glass,
        backdropFilter: 'blur(10px)',
        padding: '8px 14px',
        borderRadius: 20,
        border: `1px solid ${colors.border}`,
        zIndex: 90,
      }}>
        <IoHeart size={14} color={colors.primary} />
        <span style={{
          fontSize: 12,
          color: colors.textSecondary,
          fontWeight: 500,
        }}>
          {currentIndex + 1}/{SEQUENCE_PAGES.length}
        </span>
      </div>
    )
  }

  if (variant === 'full') {
    return (
      <div style={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        background: colors.glass,
        backdropFilter: 'blur(10px)',
        padding: '6px 10px',
        borderRadius: 30,
        border: `1px solid ${colors.border}`,
        zIndex: 90,
        maxWidth: '90vw',
        overflowX: 'auto',
      }}>
        {SEQUENCE_PAGES.map((page, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          
          return (
            <motion.div
              key={page.path}
              initial={false}
              animate={{
                scale: isCurrent ? 1.2 : 1,
                opacity: isCompleted || isCurrent ? 1 : 0.4,
              }}
              style={{
                width: isCurrent ? 28 : 20,
                height: isCurrent ? 28 : 20,
                borderRadius: '50%',
                background: isCompleted 
                  ? colors.primary 
                  : isCurrent 
                    ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                    : colors.border,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isCurrent ? 12 : 10,
                boxShadow: isCurrent ? `0 0 12px ${colors.primaryGlow}` : 'none',
              }}
              title={page.name}
            >
              {isCompleted ? '✓' : page.short}
            </motion.div>
          )
        })}
      </div>
    )
  }

  // Heart variant (default) - Beautiful heart-shaped progress
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
      }}
    >
      {/* Heart container */}
      <div style={{
        position: 'relative',
        width: 50,
        height: 46,
      }}>
        {/* Background heart (empty) */}
        <svg
          viewBox="0 0 24 24"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            filter: `drop-shadow(0 2px 8px ${colors.primaryGlow})`,
          }}
        >
          <defs>
            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="100%" stopColor={colors.secondary} />
            </linearGradient>
            <clipPath id="heartClip">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </clipPath>
          </defs>
          
          {/* Empty heart outline */}
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="none"
            stroke={colors.border}
            strokeWidth="1.5"
          />
          
          {/* Filled heart (progress) */}
          <g clipPath="url(#heartClip)">
            <motion.rect
              x="0"
              initial={{ y: 24 }}
              animate={{ y: 24 - (progress / 100) * 24 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              width="24"
              height="24"
              fill="url(#heartGradient)"
            />
          </g>
          
          {/* Heart outline on top */}
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="none"
            stroke={colors.primary}
            strokeWidth="1"
            opacity="0.5"
          />
        </svg>
        
        {/* Pulse effect when at milestones */}
        {(progress === 25 || progress === 50 || progress === 75 || progress === 100) && (
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '50%',
              background: colors.primary,
            }}
          />
        )}
      </div>
      
      {/* Progress text */}
      <div style={{
        background: colors.glass,
        backdropFilter: 'blur(10px)',
        padding: '4px 10px',
        borderRadius: 12,
        border: `1px solid ${colors.border}`,
      }}>
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          color: colors.textPrimary,
        }}>
          {currentIndex + 1}/{SEQUENCE_PAGES.length}
        </span>
      </div>
      
      {/* Current page name */}
      <motion.span
        key={currentPage?.name}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: 10,
          color: colors.textSecondary,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {currentPage?.name}
      </motion.span>
    </motion.div>
  )
}

// Export sequence for use elsewhere
export { SEQUENCE_PAGES }
