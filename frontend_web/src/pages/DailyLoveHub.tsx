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
  IoSparkles
} from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import haptics from '../utils/haptics'
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
  featured?: boolean
}

export default function DailyLoveHub() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const carouselRef = useRef<HTMLDivElement>(null)
  
  // State for previews and progress
  const [previews, setPreviews] = useState<Record<string, string>>({})
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [streak, setStreak] = useState(0)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [rotatingSubtitle, setRotatingSubtitle] = useState('')

  const activities: Activity[] = [
    {
      id: 'sad',
      title: 'When You\'re Sad',
      subtitle: 'I\'m here for you',
      icon: IoChatbubbles,
      gradient: ['#FF6B9D', '#C471ED'],
      route: '/daily-love',
      previewData: WHEN_YOURE_SAD_MESSAGES,
      featured: true,
    },
    {
      id: 'compliments',
      title: 'Daily Compliment',
      subtitle: 'Words from my heart',
      icon: IoHeart,
      gradient: ['#FF6B9D', '#C471ED'],
      route: '/daily-compliments',
      previewData: DAILY_COMPLIMENTS,
      featured: true,
    },
    {
      id: 'why-i-love-you',
      title: 'Why I Love You',
      subtitle: 'Because reasons',
      icon: IoStar,
      gradient: ['#FF9472', '#F2709C'],
      route: '/why-i-love-you',
      previewData: WHY_I_LOVE_YOU,
      featured: true,
    },
    {
      id: 'would-you-rather',
      title: 'This or That',
      subtitle: 'Fun choices together',
      icon: IoSwapHorizontal,
      gradient: ['#FA709A', '#FEE140'],
      route: '/would-you-rather',
      featured: true,
    },
    {
      id: 'special-moments',
      title: 'Special Moments',
      subtitle: 'Things I remember',
      icon: IoBook,
      gradient: ['#FFA8A8', '#FCFF00'],
      route: '/special-moments',
      previewData: SPECIAL_MOMENT_NOTES,
      featured: true,
    },
    {
      id: 'questions',
      title: 'Daily Questions',
      subtitle: 'Let me know you better',
      icon: IoHelpCircle,
      gradient: ['#4FACFE', '#00F2FE'],
      route: '/daily-questions',
      previewData: DAILY_QUESTIONS,
    },
    {
      id: 'challenges',
      title: 'Daily Challenges',
      subtitle: 'Small things for us',
      icon: IoTrophy,
      gradient: ['#43E97B', '#38F9D7'],
      route: '/daily-challenges',
      previewData: DAILY_CHALLENGES,
    },
    {
      id: 'gallery',
      title: 'Gallery',
      subtitle: 'Our moments together',
      icon: IoImages,
      gradient: ['#4facfe', '#00f2fe'],
      route: '/gallery',
    },
  ]

  // Initialize previews and load progress
  useEffect(() => {
    loadProgress()
    generateAllPreviews()
    rotateSubtitle()
    
    const interval = setInterval(rotateSubtitle, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadProgress = () => {
    const savedProgress = localStorage.getItem('dailyLoveProgress')
    const savedStreak = localStorage.getItem('dailyLoveStreak')
    
    if (savedProgress) setProgress(JSON.parse(savedProgress))
    if (savedStreak) setStreak(parseInt(savedStreak))
  }

  const saveProgress = (activityId: string) => {
    const newProgress = { ...progress, [activityId]: (progress[activityId] || 0) + 1 }
    setProgress(newProgress)
    localStorage.setItem('dailyLoveProgress', JSON.stringify(newProgress))
  }

  const generateAllPreviews = () => {
    const newPreviews: Record<string, string> = {}
    activities.forEach(activity => {
      if (activity.previewData && activity.previewData.length > 0) {
        newPreviews[activity.id] = getRandomItem(activity.previewData)
      }
    })
    setPreviews(newPreviews)
  }

  const refreshPreview = (activityId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    haptics.light()
    
    const activity = activities.find(a => a.id === activityId)
    if (activity?.previewData) {
      setPreviews(prev => ({
        ...prev,
        [activityId]: getRandomItem(activity.previewData!)
      }))
    }
  }

  const getRandomItem = <T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)]
  }

  const rotateSubtitle = () => {
    const allMessages = [...DAILY_COMPLIMENTS, ...WHEN_YOURE_SAD_MESSAGES]
    setRotatingSubtitle(getRandomItem(allMessages))
  }

  const handleShuffle = () => {
    haptics.medium()
    generateAllPreviews()
    rotateSubtitle()
  }

  const handleSurpriseMe = () => {
    haptics.medium()
    const randomActivity = getRandomItem(activities)
    navigate(randomActivity.route)
  }

  const handleActivityClick = (activity: Activity) => {
    haptics.medium()
    saveProgress(activity.id)
    navigate(activity.route)
  }

  const handleLongPress = (activity: Activity) => {
    haptics.medium()
    setSelectedActivity(activity)
    setShowPreview(true)
  }

  const featuredActivities = activities.filter(a => a.featured)
  const gridActivities = activities

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: 100,
    }}>
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          haptics.light()
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

      {/* Header */}
      <div style={{
        padding: '80px 20px 20px',
        textAlign: 'center',
      }}>
        <motion.h1
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
        
        <AnimatePresence mode="wait">
          <motion.p
            key={rotatingSubtitle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              marginBottom: 8,
            }}
          >
            {rotatingSubtitle}
          </motion.p>
        </AnimatePresence>

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
              marginTop: 8,
            }}
          >
            🔥 {streak} day streak
          </motion.div>
        )}
      </div>

      {/* Featured Carousel */}
      <div style={{
        padding: '0 0 24px 0',
        overflow: 'hidden',
      }}>
        <div
          ref={carouselRef}
          style={{
            display: 'flex',
            gap: 16,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            paddingLeft: 20,
            paddingRight: 20,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          className="hide-scrollbar"
        >
          {featuredActivities.map((activity, index) => {
            const Icon = activity.icon
            const preview = previews[activity.id]
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleActivityClick(activity)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  handleLongPress(activity)
                }}
                style={{
                  minWidth: 280,
                  maxWidth: 280,
                  scrollSnapAlign: 'start',
                  background: colors.glass,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${colors.border}`,
                  borderRadius: 24,
                  padding: 24,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: `0 8px 32px ${colors.primaryGlow}`,
                }}
              >
                {/* Gradient Top Bar */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${activity.gradient[0]}, ${activity.gradient[1]})`,
                }} />

                {/* Icon */}
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: `linear-gradient(135deg, ${activity.gradient[0]}, ${activity.gradient[1]})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <Icon size={28} color="white" />
                </div>

                {/* Title */}
                <h3 style={{
                  color: colors.textPrimary,
                  fontSize: 20,
                  fontWeight: 600,
                  marginBottom: 8,
                }}>
                  {activity.title}
                </h3>

                {/* Preview or Subtitle */}
                <p style={{
                  color: colors.textSecondary,
                  fontSize: 13,
                  lineHeight: 1.5,
                  minHeight: 60,
                  marginBottom: 12,
                }}>
                  {preview ? `"${preview}"` : activity.subtitle}
                </p>

                {/* Refresh Button */}
                {activity.previewData && (
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => refreshPreview(activity.id, e)}
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      background: colors.card,
                      border: `1px solid ${colors.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <IoRefresh size={16} color={colors.primary} />
                  </motion.button>
                )}

                {/* Progress Badge */}
                {progress[activity.id] > 0 && (
                  <div style={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    background: colors.card,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    padding: '4px 10px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: colors.primary,
                  }}>
                    {progress[activity.id]} visits
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Activity Grid */}
      <div style={{
        padding: '0 20px',
      }}>
        <h2 style={{
          color: colors.textPrimary,
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 16,
        }}>
          All Activities
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
        }}>
          {gridActivities.map((activity, index) => {
            const Icon = activity.icon
            const preview = previews[activity.id]
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleActivityClick(activity)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  handleLongPress(activity)
                }}
                style={{
                  background: colors.glass,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${colors.border}`,
                  borderRadius: 16,
                  padding: 16,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Gradient Top Bar */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, ${activity.gradient[0]}, ${activity.gradient[1]})`,
                }} />

                {/* Icon */}
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
                  <Icon size={20} color="white" />
                </div>

                {/* Title */}
                <h4 style={{
                  color: colors.textPrimary,
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 4,
                }}>
                  {activity.title}
                </h4>

                {/* Preview or Subtitle */}
                <p style={{
                  color: colors.textSecondary,
                  fontSize: 11,
                  lineHeight: 1.4,
                  minHeight: 32,
                }}>
                  {preview ? `"${preview.substring(0, 40)}..."` : activity.subtitle}
                </p>

                {/* Refresh Button */}
                {activity.previewData && (
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => refreshPreview(activity.id, e)}
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      background: colors.card,
                      border: `1px solid ${colors.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <IoRefresh size={12} color={colors.primary} />
                  </motion.button>
                )}

                {/* Progress Badge */}
                {progress[activity.id] > 0 && (
                  <div style={{
                    position: 'absolute',
                    bottom: 12,
                    right: 12,
                    background: colors.card,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 8,
                    padding: '2px 6px',
                    fontSize: 9,
                    fontWeight: 600,
                    color: colors.primary,
                  }}>
                    {progress[activity.id]}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Bottom Quick Actions */}
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
          Shuffle
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

      {/* Long Press Preview Modal */}
      <AnimatePresence>
        {showPreview && selectedActivity && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreview(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
                zIndex: 200,
              }}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: 400,
                background: colors.card,
                border: `1px solid ${colors.border}`,
                borderRadius: 24,
                padding: 32,
                zIndex: 201,
                boxShadow: `0 20px 60px ${colors.primaryGlow}`,
              }}
            >
              {(() => {
                const Icon = selectedActivity.icon
                return (
                  <>
                    <div style={{
                      width: 64,
                      height: 64,
                      borderRadius: 18,
                      background: `linear-gradient(135deg, ${selectedActivity.gradient[0]}, ${selectedActivity.gradient[1]})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                      margin: '0 auto 16px',
                    }}>
                      <Icon size={32} color="white" />
                    </div>

                    <h3 style={{
                      color: colors.textPrimary,
                      fontSize: 24,
                      fontWeight: 600,
                      textAlign: 'center',
                      marginBottom: 8,
                    }}>
                      {selectedActivity.title}
                    </h3>

                    <p style={{
                      color: colors.textSecondary,
                      fontSize: 14,
                      textAlign: 'center',
                      marginBottom: 24,
                      lineHeight: 1.5,
                    }}>
                      {previews[selectedActivity.id] 
                        ? `"${previews[selectedActivity.id]}"` 
                        : selectedActivity.subtitle}
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowPreview(false)
                        handleActivityClick(selectedActivity)
                      }}
                      style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: 16,
                        background: `linear-gradient(135deg, ${selectedActivity.gradient[0]}, ${selectedActivity.gradient[1]})`,
                        border: 'none',
                        color: 'white',
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Start
                    </motion.button>
                  </>
                )
              })()}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
