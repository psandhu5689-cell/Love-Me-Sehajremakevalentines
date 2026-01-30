import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  IoChevronBack, 
  IoHeart, 
  IoHelpCircle, 
  IoTrophy, 
  IoChatbubbles, 
  IoStar, 
  IoBook, 
  IoImages,
  IoSwapHorizontal,
  IoRefresh,
  IoShuffle,
  IoSparkles,
  IoTime,
  IoFlame
} from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import soundManager from '../utils/soundManager'
import {
  DAILY_COMPLIMENTS,
  WHY_I_LOVE_YOU,
  DAILY_QUESTIONS,
  DAILY_CHALLENGES,
  WHEN_YOURE_SAD_MESSAGES,
  SPECIAL_MOMENT_NOTES
} from '../data/personalContent'

interface Activity {
  id: string
  title: string
  subtitle: string
  icon: any
  gradient: string[]
  route: string
  previewData?: string[]
}

export default function DailyLoveHub() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const carouselRef = useRef<HTMLDivElement>(null)
  
  // State
  const [sadPreview, setSadPreview] = useState('')
  const [thisOrThatPreview, setThisOrThatPreview] = useState('')
  const [togetherPreview, setTogetherPreview] = useState('')
  const [activityPreviews, setActivityPreviews] = useState<Record<string, string>>({})
  const [streak, setStreak] = useState(0)
  const [daysUntilAnniversary, setDaysUntilAnniversary] = useState(0)

  // Calculate days until next anniversary
  useEffect(() => {
    const now = new Date()
    const currentYear = now.getFullYear()
    let nextAnniversary = new Date(currentYear, 6, 11) // July 11
    
    if (now > nextAnniversary) {
      nextAnniversary = new Date(currentYear + 1, 6, 11)
    }
    
    const diffTime = nextAnniversary.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    setDaysUntilAnniversary(diffDays)
  }, [])

  // Activities for carousel
  const activities: Activity[] = [
    {
      id: 'compliments',
      title: 'For Sehaj & Mrs. Sandhu',
      subtitle: 'Words from my heart',
      icon: IoHeart,
      gradient: ['#FF6B9D', '#C471ED'],
      route: '/daily-compliments',
      previewData: DAILY_COMPLIMENTS,
    },
    {
      id: 'why-i-love-you',
      title: 'Why does he love me',
      subtitle: 'Because reasons',
      icon: IoStar,
      gradient: ['#FF9472', '#F2709C'],
      route: '/why-i-love-you',
      previewData: WHY_I_LOVE_YOU,
    },
    {
      id: 'questions',
      title: 'Mhmm what would she say',
      subtitle: 'Let me know you better',
      icon: IoHelpCircle,
      gradient: ['#4FACFE', '#00F2FE'],
      route: '/daily-questions',
      previewData: DAILY_QUESTIONS,
    },
    {
      id: 'challenges',
      title: 'A little this & A little that',
      subtitle: 'Small things for us',
      icon: IoTrophy,
      gradient: ['#43E97B', '#38F9D7'],
      route: '/daily-challenges',
      previewData: DAILY_CHALLENGES,
    },
    {
      id: 'special-moments',
      title: '"Here and There" memories',
      subtitle: 'Things I remember',
      icon: IoBook,
      gradient: ['#FFA8A8', '#FCFF00'],
      route: '/special-moments',
      previewData: SPECIAL_MOMENT_NOTES,
    },
    {
      id: 'gallery',
      title: 'When i.....',
      subtitle: 'Our moments together',
      icon: IoImages,
      gradient: ['#4facfe', '#00f2fe'],
      route: '/gallery',
    },
  ]

  // Initialize previews
  useEffect(() => {
    loadStreak()
    generateAllPreviews()
  }, [])

  const loadStreak = () => {
    const savedStreak = localStorage.getItem('dailyLoveStreak')
    if (savedStreak) setStreak(parseInt(savedStreak))
  }

  const getRandomItem = <T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)]
  }

  const generateAllPreviews = () => {
    // Sad preview
    setSadPreview(getRandomItem(WHEN_YOURE_SAD_MESSAGES))
    
    // This or That preview
    setThisOrThatPreview('Would you rather have a quiet night in or go on an adventure?')
    
    // Together For preview
    setTogetherPreview(`${daysUntilAnniversary} days until our anniversary`)
    
    // Activity previews
    const newPreviews: Record<string, string> = {}
    activities.forEach(activity => {
      if (activity.previewData && activity.previewData.length > 0) {
        newPreviews[activity.id] = getRandomItem(activity.previewData)
      }
    })
    setActivityPreviews(newPreviews)
  }

  const refreshSadPreview = () => {
    soundManager.play('sparkle')
    setSadPreview(getRandomItem(WHEN_YOURE_SAD_MESSAGES))
  }

  const handleShuffle = () => {
    soundManager.play('magic')
    generateAllPreviews()
  }

  const handleSurpriseMe = () => {
    soundManager.play('sparkle')
    const allRoutes = [
      '/daily-love',
      '/would-you-rather',
      '/how-long-together',
      ...activities.map(a => a.route)
    ]
    const randomRoute = getRandomItem(allRoutes)
    navigate(randomRoute)
  }

  const handleNavigate = (route: string) => {
    soundManager.play('uiNavigate')
    navigate(route)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: 100,
    }}>\n      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          soundManager.play('uiBack')
          navigate('/')
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

      {/* Header with Streak */}
      <div style={{
        padding: '80px 20px 20px',
        textAlign: 'center',
      }}>\n        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            color: colors.textPrimary,
            fontSize: 36,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Daily Love ✨
        </motion.h1>
        
        <p style={{
          color: colors.textSecondary,
          fontSize: 14,
          marginBottom: 16,
        }}>
          Your personal love library
        </p>

        {streak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              padding: '6px 16px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              color: 'white',
            }}
          >
            <IoFlame size={16} />
            {streak} day streak
          </motion.div>
        )}
      </div>

      <div style={{
        padding: '0 20px',
        maxWidth: 800,
        margin: '0 auto',
        width: '100%',
      }}>
        {/* FEATURED: When You're Sad */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleNavigate('/daily-love')}
          style={{
            background: `linear-gradient(135deg, #FF6B9D, #C471ED)`,
            borderRadius: 24,
            padding: 32,
            marginBottom: 24,
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            boxShadow: `0 12px 40px ${colors.primaryGlow}`,
          }}
        >
          {/* Shimmer effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            animation: 'shimmer 3s infinite',
          }} />

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 16,
            position: 'relative',
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <IoChatbubbles size={28} color=\"white\" />
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{
                color: 'white',
                fontSize: 24,
                fontWeight: 600,
                marginBottom: 8,
              }}>
                When You're Sad
              </h2>
              
              <p style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: 15,
                lineHeight: 1.6,
                fontStyle: 'italic',
                marginBottom: 0,
              }}>
                \"{sadPreview}\"
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                refreshSadPreview()
              }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <IoRefresh size={18} color=\"white\" />
            </motion.button>
          </div>

          <div style={{
            marginTop: 16,
            paddingTop: 16,
            borderTop: '1px solid rgba(255,255,255,0.2)',
          }}>
            <span style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: 13,
            }}>
              Tap to open • I'm here for you 💗
            </span>
          </div>
        </motion.div>

        {/* TWO BIG FEATURED TILES */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}>
          {/* This or That */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleNavigate('/would-you-rather')}
            style={{
              background: colors.glass,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${colors.border}`,
              borderRadius: 20,
              padding: 24,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: `0 8px 24px ${colors.primaryGlow}`,
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'linear-gradient(90deg, #FA709A, #FEE140)',
            }} />

            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #FA709A, #FEE140)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <IoSwapHorizontal size={24} color=\"white\" />
            </div>

            <h3 style={{
              color: colors.textPrimary,
              fontSize: 20,
              fontWeight: 600,
              marginBottom: 8,
            }}>
              This or That
            </h3>

            <p style={{
              color: colors.textSecondary,
              fontSize: 14,
              lineHeight: 1.5,
              marginBottom: 12,
            }}>
              {thisOrThatPreview}
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: colors.primary,
              fontSize: 13,
              fontWeight: 600,
            }}>
              Fun choices together →
            </div>
          </motion.div>

          {/* Together For (How Long Together) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleNavigate('/how-long-together')}
            style={{
              background: colors.glass,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${colors.border}`,
              borderRadius: 20,
              padding: 24,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: `0 8px 24px ${colors.primaryGlow}`,
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'linear-gradient(90deg, #4FACFE, #00F2FE)',
            }} />

            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #4FACFE, #00F2FE)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <IoTime size={24} color=\"white\" />
            </div>

            <h3 style={{
              color: colors.textPrimary,
              fontSize: 20,
              fontWeight: 600,
              marginBottom: 8,
            }}>
              Together For
            </h3>

            <div style={{
              marginBottom: 12,
            }}>
              <div style={{
                display: 'flex',
                gap: 8,
                marginBottom: 8,
              }}>
                <div style={{
                  flex: 1,
                  background: colors.card,
                  borderRadius: 12,
                  padding: '8px 12px',
                  textAlign: 'center',
                }}>
                  <div style={{
                    color: colors.primary,
                    fontSize: 16,
                    fontWeight: 700,
                  }}>
                    Talking
                  </div>
                  <div style={{
                    color: colors.textSecondary,
                    fontSize: 11,
                  }}>
                    Feb 26
                  </div>
                </div>
                <div style={{
                  flex: 1,
                  background: colors.card,
                  borderRadius: 12,
                  padding: '8px 12px',
                  textAlign: 'center',
                }}>
                  <div style={{
                    color: colors.primary,
                    fontSize: 16,
                    fontWeight: 700,
                  }}>
                    Dating
                  </div>
                  <div style={{
                    color: colors.textSecondary,
                    fontSize: 11,
                  }}>
                    Jul 11
                  </div>
                </div>
              </div>
              
              <div style={{
                color: colors.textSecondary,
                fontSize: 13,
                textAlign: 'center',
              }}>
                {daysUntilAnniversary} days till anniversary 💖
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: colors.primary,
              fontSize: 13,
              fontWeight: 600,
            }}>
              See our timers →
            </div>
          </motion.div>
        </div>

        {/* ACTIVITY CAROUSEL */}
        <div style={{
          marginBottom: 32,
        }}>
          <h2 style={{
            color: colors.textPrimary,
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 16,
          }}>
            More Activities
          </h2>

          <div
            ref={carouselRef}
            style={{
              display: 'flex',
              gap: 16,
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              paddingBottom: 8,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            className=\"hide-scrollbar\"
          >
            {activities.map((activity, index) => {
              const Icon = activity.icon
              const preview = activityPreviews[activity.id]
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigate(activity.route)}
                  style={{
                    minWidth: 240,
                    maxWidth: 240,
                    scrollSnapAlign: 'start',
                    background: colors.glass,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${colors.border}`,
                    borderRadius: 16,
                    padding: 20,
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: `linear-gradient(90deg, ${activity.gradient[0]}, ${activity.gradient[1]})`,
                  }} />

                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: `linear-gradient(135deg, ${activity.gradient[0]}, ${activity.gradient[1]})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}>
                    <Icon size={20} color=\"white\" />
                  </div>

                  <h4 style={{
                    color: colors.textPrimary,
                    fontSize: 15,
                    fontWeight: 600,
                    marginBottom: 6,
                  }}>
                    {activity.title}
                  </h4>

                  <p style={{
                    color: colors.textSecondary,
                    fontSize: 12,
                    lineHeight: 1.4,
                    minHeight: 48,
                  }}>
                    {preview ? `\"${preview.substring(0, 50)}...\"` : activity.subtitle}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS BAR */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: colors.card,
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${colors.border}`,
        padding: '16px 20px',
        display: 'flex',
        gap: 12,
        zIndex: 90,
      }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShuffle}
          style={{
            flex: 1,
            padding: '14px 20px',
            borderRadius: 16,
            background: colors.glass,
            border: `1px solid ${colors.border}`,
            color: colors.textPrimary,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <IoShuffle size={18} />
          Shuffle Hub
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSurpriseMe}
          style={{
            flex: 1,
            padding: '14px 20px',
            borderRadius: 16,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            border: 'none',
            color: 'white',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: `0 4px 16px ${colors.primaryGlow}`,
          }}
        >
          <IoSparkles size={18} />
          Surprise Me
        </motion.button>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  )
}
