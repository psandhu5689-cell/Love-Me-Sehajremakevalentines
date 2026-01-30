import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  IoChevronBack, 
  IoSwapHorizontal,
  IoLockClosed,
  IoRocket,
  IoImages,
  IoShuffle,
  IoFlame
} from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import soundManager from '../utils/soundManager'
import {
  WHEN_YOURE_SAD_MESSAGES,
  DAILY_COMPLIMENTS
} from '../data/personalContent'

export default function DailyLoveHub() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [headerLine, setHeaderLine] = useState('')
  const [wouldYouRatherPreview, setWouldYouRatherPreview] = useState('')
  const [loveVaultPreview, setLoveVaultPreview] = useState('')
  const [triggerPullPreview, setTriggerPullPreview] = useState('')
  const [sharedAlbumPreview, setSharedAlbumPreview] = useState('')
  const [streak, setStreak] = useState(0)

  const activities = [
    {
      id: 'would-you-rather',
      title: 'This or That',
      icon: IoSwapHorizontal,
      gradient: ['#FA709A', '#FEE140'],
      route: '/would-you-rather',
      getPreview: () => wouldYouRatherPreview,
    },
    {
      id: 'love-vault',
      title: 'Love Vault',
      icon: IoLockClosed,
      gradient: ['#C471ED', '#FF6B9D'],
      route: '/love-vault',
      getPreview: () => loveVaultPreview,
    },
    {
      id: 'trigger-pull',
      title: 'Trigger Pull',
      icon: IoRocket,
      gradient: ['#43E97B', '#38F9D7'],
      route: '/trigger-pull',
      getPreview: () => triggerPullPreview,
    },
    {
      id: 'shared-album',
      title: 'Shared Album',
      icon: IoImages,
      gradient: ['#4FACFE', '#00F2FE'],
      route: '/shared-album',
      getPreview: () => sharedAlbumPreview,
    },
  ]

  useEffect(() => {
    loadStreak()
    generatePreviews()
  }, [])

  const loadStreak = () => {
    const saved = localStorage.getItem('dailyLoveStreak')
    if (saved) setStreak(parseInt(saved))
  }

  const getRandomItem = <T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)]
  }

  const generatePreviews = () => {
    const allMessages = [...WHEN_YOURE_SAD_MESSAGES, ...DAILY_COMPLIMENTS]
    setHeaderLine(getRandomItem(allMessages))
    
    setWouldYouRatherPreview('Would you rather have a cozy night in or go on an adventure?')
    
    const vaultCount = JSON.parse(localStorage.getItem('loveVaultNotes') || '[]').length
    setLoveVaultPreview(vaultCount > 0 ? `${vaultCount} secrets waiting` : 'No secrets yet, create one')
    
    setTriggerPullPreview('Tell me why I make you smile')
    
    const albumCount = JSON.parse(localStorage.getItem('sharedAlbumPhotos') || '[]').length
    setSharedAlbumPreview(albumCount > 0 ? `${albumCount} memories saved` : 'Add our first memory')
  }

  const handleShuffle = () => {
    soundManager.play('magic')
    generatePreviews()
  }

  const handleNavigate = (route: string) => {
    soundManager.play('uiNavigate')
    navigate(route)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      padding: '20px',
      paddingBottom: '100px',
    }}>
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
        }}
      >
        <IoChevronBack size={24} color={colors.primary} />
      </motion.button>

      <div style={{
        maxWidth: 800,
        margin: '60px auto 0',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          <h1 style={{
            color: colors.textPrimary,
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 12,
          }}>
            Our Love Hub 💕
          </h1>

          <motion.p
            key={headerLine}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              fontStyle: 'italic',
              marginBottom: 16,
            }}
          >
            "{headerLine}"
          </motion.p>

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
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
          marginBottom: 80,
        }}>
          {activities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleNavigate(activity.route)}
                style={{
                  background: colors.glass,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${colors.border}`,
                  borderRadius: 24,
                  padding: 28,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: `0 8px 32px ${colors.primaryGlow}`,
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${activity.gradient[0]}, ${activity.gradient[1]})`,
                }} />

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

                <h3 style={{
                  color: colors.textPrimary,
                  fontSize: 22,
                  fontWeight: 600,
                  marginBottom: 8,
                }}>
                  {activity.title}
                </h3>

                <p style={{
                  color: colors.textSecondary,
                  fontSize: 14,
                  lineHeight: 1.5,
                  minHeight: 42,
                }}>
                  {activity.getPreview()}
                </p>
              </motion.div>
            )
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShuffle}
          style={{
            width: '100%',
            maxWidth: 300,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '16px',
            borderRadius: 30,
            background: colors.glass,
            border: `1px solid ${colors.border}`,
            color: colors.textPrimary,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <IoShuffle size={20} />
          Shuffle Previews
        </motion.button>
      </div>
    </div>
  )
}
