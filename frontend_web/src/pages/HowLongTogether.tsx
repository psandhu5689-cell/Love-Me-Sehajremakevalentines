import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBack, IoHeart, IoSparkles, IoInfinite } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import haptics from '../utils/haptics'
import Confetti from 'react-confetti'
import { SPECIAL_MOMENT_NOTES } from '../data/personalContent'

// Key dates
const TALKING_START = new Date('2025-02-26T00:00:00')
const DATING_START = new Date('2025-07-11T00:00:00')

interface TimeBreakdown {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
  totalDays: number
}

interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function HowLongTogether() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [storyMode, setStoryMode] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // All timers updated by single interval
  const [talkingTime, setTalkingTime] = useState<TimeBreakdown>({
    years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalDays: 0
  })
  const [datingTime, setDatingTime] = useState<TimeBreakdown>({
    years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalDays: 0
  })
  const [anniversaryCountdown, setAnniversaryCountdown] = useState<CountdownTime | null>(null)
  const [isAnniversaryToday, setIsAnniversaryToday] = useState(false)

  // Window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Check for celebrations on mount
  useEffect(() => {
    const now = new Date()
    
    // Check if today is anniversary
    if (now.getMonth() === 6 && now.getDate() === 11) {
      setIsAnniversaryToday(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 8000)
    } else {
      // Check for monthly milestone (dating)
      const datingMonths = calculateTimeBreakdown(DATING_START, now).months
      if (now.getDate() === 11 && datingMonths > 0) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      }
    }
  }, [])

  // Calculate time breakdown with years, months, days, etc.
  const calculateTimeBreakdown = (startDate: Date, endDate: Date): TimeBreakdown => {
    const diffMs = endDate.getTime() - startDate.getTime()
    
    let years = endDate.getFullYear() - startDate.getFullYear()
    let months = endDate.getMonth() - startDate.getMonth()
    let days = endDate.getDate() - startDate.getDate()
    
    if (days < 0) {
      months--
      const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0)
      days += prevMonth.getDate()
    }
    
    if (months < 0) {
      years--
      months += 12
    }
    
    const totalSeconds = Math.floor(diffMs / 1000)
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    return { years, months, days, hours, minutes, seconds, totalDays }
  }

  // Calculate countdown to next anniversary
  const calculateAnniversaryCountdown = (now: Date): CountdownTime | null => {
    const currentYear = now.getFullYear()
    let nextAnniversary = new Date(currentYear, 6, 11) // July 11 of current year
    
    // If already passed this year, target next year
    if (now > nextAnniversary) {
      nextAnniversary = new Date(currentYear + 1, 6, 11)
    }
    
    const diffMs = nextAnniversary.getTime() - now.getTime()
    
    if (diffMs <= 0) return null
    
    const totalSeconds = Math.floor(diffMs / 1000)
    const days = Math.floor(totalSeconds / (24 * 3600))
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    
    return { days, hours, minutes, seconds }
  }

  // Single interval for all timers - performance optimized
  useEffect(() => {
    const updateAllTimers = () => {
      const now = new Date()
      
      // Update talking timer
      setTalkingTime(calculateTimeBreakdown(TALKING_START, now))
      
      // Update dating timer
      setDatingTime(calculateTimeBreakdown(DATING_START, now))
      
      // Update anniversary countdown
      const isToday = now.getMonth() === 6 && now.getDate() === 11
      setIsAnniversaryToday(isToday)
      
      if (!isToday) {
        setAnniversaryCountdown(calculateAnniversaryCountdown(now))
      }
    }
    
    updateAllTimers()
    const interval = setInterval(updateAllTimers, 1000)
    
    return () => clearInterval(interval)
  }, [])

  // Scroll to section
  const scrollToSection = (key: string) => {
    haptics.light()
    scrollRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  // Progress ring component
  const ProgressRing = ({ progress, color, size = 120 }: { progress: number; color: string; size?: number }) => {
    const radius = (size - 16) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (progress / 100) * circumference
    
    return (
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
    )
  }

  // Timer card component
  const TimerCard = ({ 
    title, 
    subtitle, 
    time, 
    color, 
    gradient, 
    story, 
    refKey,
    progress 
  }: { 
    title: string
    subtitle?: string
    time: TimeBreakdown | CountdownTime | null
    color: string
    gradient: string[]
    story?: string
    refKey: string
    progress?: number
  }) => (
    <motion.div
      ref={el => scrollRefs.current[refKey] = el}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: colors.glass,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${colors.border}`,
        borderRadius: 24,
        padding: 28,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 8px 32px ${color}20`,
      }}
    >
      {/* Gradient top bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: `linear-gradient(90deg, ${gradient[0]}, ${gradient[1]})`,
      }} />
      
      {/* Progress ring (if provided) */}
      {progress !== undefined && (
        <div style={{
          position: 'absolute',
          top: 20,
          right: 20,
          opacity: 0.3,
        }}>
          <ProgressRing progress={progress} color={color} size={80} />
        </div>
      )}
      
      {/* Title */}
      <h3 style={{
        color: colors.textPrimary,
        fontSize: 22,
        fontWeight: 600,
        marginBottom: subtitle ? 4 : 16,
      }}>
        {title}
      </h3>
      
      {/* Subtitle */}
      {subtitle && (
        <p style={{
          color: colors.textSecondary,
          fontSize: 13,
          marginBottom: 16,
          fontStyle: 'italic',
        }}>
          {subtitle}
        </p>
      )}
      
      {/* Time display */}
      {time && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
          gap: 12,
          marginBottom: storyMode && story ? 16 : 0,
        }}>
          {'years' in time && time.years > 0 && (
            <TimeUnit value={time.years} label="Years" color={color} />
          )}
          {'months' in time && (time.years > 0 || time.months > 0) && (
            <TimeUnit value={time.months} label="Months" color={color} />
          )}
          <TimeUnit value={time.days} label="Days" color={color} />
          <TimeUnit value={time.hours} label="Hours" color={color} />
          <TimeUnit value={time.minutes} label="Min" color={color} />
          <TimeUnit value={time.seconds} label="Sec" color={color} />
        </div>
      )}
      
      {/* Story mode caption */}
      <AnimatePresence>
        {storyMode && story && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              color: colors.textSecondary,
              fontSize: 13,
              fontStyle: 'italic',
              lineHeight: 1.5,
              marginTop: 16,
              paddingTop: 16,
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            "{story}"
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )

  // Time unit component
  const TimeUnit = ({ value, label, color }: { value: number; label: string; color: string }) => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4,
    }}>
      <motion.div
        key={value}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: color,
          lineHeight: 1,
        }}
      >
        {value.toString().padStart(2, '0')}
      </motion.div>
      <span style={{
        color: colors.textSecondary,
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      }}>
        {label}
      </span>
    </div>
  )

  // Memory chip
  const MemoryChip = ({ label, icon, onClick }: { label: string; icon?: string; onClick: () => void }) => (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        background: colors.glass,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${colors.border}`,
        borderRadius: 20,
        padding: '10px 16px',
        color: colors.textPrimary,
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {icon && <span>{icon}</span>}
      {label}
    </motion.button>
  )

  // Calculate progress percentages for rings
  const getTalkingProgress = () => {
    const now = new Date()
    const yearStart = new Date(now.getFullYear(), 0, 1)
    const yearEnd = new Date(now.getFullYear() + 1, 0, 1)
    const yearProgress = ((now.getTime() - yearStart.getTime()) / (yearEnd.getTime() - yearStart.getTime())) * 100
    return yearProgress
  }

  const getDatingProgress = () => {
    const now = new Date()
    const yearStart = new Date(now.getFullYear(), 0, 1)
    const yearEnd = new Date(now.getFullYear() + 1, 0, 1)
    const yearProgress = ((now.getTime() - yearStart.getTime()) / (yearEnd.getTime() - yearStart.getTime())) * 100
    return yearProgress
  }

  const getAnniversaryProgress = () => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const lastAnniversary = new Date(currentYear, 6, 11)
    const nextAnniversary = lastAnniversary < now ? new Date(currentYear + 1, 6, 11) : lastAnniversary
    const prevAnniversary = lastAnniversary < now ? lastAnniversary : new Date(currentYear - 1, 6, 11)
    
    const total = nextAnniversary.getTime() - prevAnniversary.getTime()
    const elapsed = now.getTime() - prevAnniversary.getTime()
    return (elapsed / total) * 100
  }

  // Get random story for each section
  const getStory = (index: number) => {
    return SPECIAL_MOMENT_NOTES[index % SPECIAL_MOMENT_NOTES.length]
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: 40,
    }}>
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={isAnniversaryToday ? 500 : 200}
          gravity={0.3}
        />
      )}

      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          haptics.light()
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
          boxShadow: `0 4px 12px ${colors.primaryGlow}`,
        }}
      >
        <IoChevronBack size={24} color={colors.primary} />
      </motion.button>

      {/* Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 100,
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            haptics.light()
            setStoryMode(!storyMode)
          }}
          style={{
            background: storyMode ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 22,
            padding: '10px 16px',
            color: storyMode ? 'white' : colors.textPrimary,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: `0 4px 12px ${colors.primaryGlow}`,
          }}
        >
          <IoSparkles size={16} />
          {storyMode ? 'Story' : 'Clean'}
        </motion.button>
      </motion.div>

      {/* Content */}
      <div style={{
        maxWidth: 600,
        margin: '0 auto',
        width: '100%',
        padding: '80px 20px 20px',
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ marginBottom: 12 }}
          >
            <IoHeart size={48} color={colors.primary} />
          </motion.div>
          
          <h1 style={{
            color: colors.textPrimary,
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 8,
          }}>
            Our Time Together
          </h1>
          
          <p style={{
            color: colors.textSecondary,
            fontSize: 14,
          }}>
            Every second counts
          </p>

          {/* Anniversary message */}
          {isAnniversaryToday && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                marginTop: 16,
                padding: '12px 24px',
                borderRadius: 20,
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                color: 'white',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Happy Anniversary Baby 💖
            </motion.div>
          )}
        </motion.div>

        {/* Memory Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 8,
            marginBottom: 24,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          className="hide-scrollbar"
        >
          <MemoryChip label="Feb 26, 2025" icon="💬" onClick={() => scrollToSection('talking')} />
          <MemoryChip label="Jul 11, 2025" icon="💗" onClick={() => scrollToSection('dating')} />
          <MemoryChip label="Next July 11" icon="🎉" onClick={() => scrollToSection('anniversary')} />
          <MemoryChip label="Forever" icon="♾️" onClick={() => scrollToSection('forever')} />
        </motion.div>

        {/* Timer Cards */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}>
          {/* Talking Since Timer */}
          <TimerCard
            title="Talking Since"
            time={talkingTime}
            color="#FF6B9D"
            gradient={['#FF6B9D', '#C471ED']}
            story={getStory(0)}
            refKey="talking"
            progress={getTalkingProgress()}
          />

          {/* Dating Since Timer */}
          <TimerCard
            title="Dating Since"
            time={datingTime}
            color="#4FACFE"
            gradient={['#4FACFE', '#00F2FE']}
            story={getStory(1)}
            refKey="dating"
            progress={getDatingProgress()}
          />

          {/* Anniversary Countdown */}
          {isAnniversaryToday ? (
            <motion.div
              ref={el => scrollRefs.current['anniversary'] = el}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                backdropFilter: 'blur(20px)',
                borderRadius: 24,
                padding: 40,
                textAlign: 'center',
                boxShadow: `0 12px 40px ${colors.primaryGlow}`,
              }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ fontSize: 64, marginBottom: 16 }}
              >
                💖
              </motion.div>
              <h3 style={{
                color: 'white',
                fontSize: 28,
                fontWeight: 700,
              }}>
                Today 💖
              </h3>
              <p style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: 16,
                marginTop: 8,
              }}>
                Happy Anniversary, my love
              </p>
            </motion.div>
          ) : anniversaryCountdown ? (
            <TimerCard
              title="Till Anniversary"
              time={anniversaryCountdown}
              color="#43E97B"
              gradient={['#43E97B', '#38F9D7']}
              story={getStory(2)}
              refKey="anniversary"
              progress={getAnniversaryProgress()}
            />
          ) : null}

          {/* Forever Card */}
          <motion.div
            ref={el => scrollRefs.current['forever'] = el}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: colors.glass,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${colors.border}`,
              borderRadius: 24,
              padding: 40,
              textAlign: 'center',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ marginBottom: 16 }}
            >
              <IoInfinite size={64} color={colors.primary} />
            </motion.div>
            <h3 style={{
              color: colors.textPrimary,
              fontSize: 24,
              fontWeight: 600,
              marginBottom: 12,
            }}>
              Forever
            </h3>
            <p style={{
              color: colors.textSecondary,
              fontSize: 16,
              lineHeight: 1.6,
            }}>
              Every second with you is a gift. And I want every second that comes next.
            </p>
          </motion.div>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
