import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IoVolumeHigh, IoVolumeMute } from 'react-icons/io5'
import soundManager from '../utils/soundManager'
import { useTheme } from '../context/ThemeContext'

export default function MuteToggle() {
  const { colors } = useTheme()
  const [muted, setMuted] = useState(soundManager.isMuted())

  const handleToggle = () => {
    const newMuted = soundManager.toggleMute()
    setMuted(newMuted)
    
    // Play a test sound when unmuting
    if (!newMuted) {
      setTimeout(() => soundManager.play('toggleOn'), 100)
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        background: colors.glass,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 1000,
        boxShadow: `0 4px 12px ${colors.primaryGlow}`,
      }}
      title={muted ? 'Unmute sounds' : 'Mute sounds'}
    >
      {muted ? (
        <IoVolumeMute size={20} color={colors.textSecondary} />
      ) : (
        <IoVolumeHigh size={20} color={colors.primary} />
      )}
    </motion.button>
  )
}
