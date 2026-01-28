import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

interface StarryBackgroundProps {
  starCount?: number
  shootingStarCount?: number
  color?: string
}

export default function StarryBackground({ 
  starCount = 100, 
  shootingStarCount = 5,
  color = '#ffffff'
}: StarryBackgroundProps) {
  // Generate static stars
  const stars = useMemo(() => {
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 1,
    }))
  }, [starCount])

  // Generate shooting stars
  const shootingStars = useMemo(() => {
    return Array.from({ length: shootingStarCount }, (_, i) => ({
      id: i,
      startX: Math.random() * 50,
      startY: Math.random() * 30,
      delay: Math.random() * 8 + i * 3,
      duration: Math.random() * 1 + 0.5,
    }))
  }, [shootingStarCount])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
    }}>
      {/* Static twinkling stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 ${star.size * 2}px ${color}`,
          }}
        />
      ))}

      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <motion.div
          key={`shooting-${star.id}`}
          initial={{ 
            x: `${star.startX}vw`, 
            y: `${star.startY}vh`,
            opacity: 0,
          }}
          animate={{
            x: [`${star.startX}vw`, `${star.startX + 60}vw`],
            y: [`${star.startY}vh`, `${star.startY + 40}vh`],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            repeatDelay: 8,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: `linear-gradient(45deg, ${color}, transparent)`,
            boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
          }}
        >
          {/* Tail */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 80,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${color}80, ${color})`,
            transform: 'rotate(-45deg) translateX(40px)',
            transformOrigin: 'right center',
            borderRadius: 2,
          }} />
        </motion.div>
      ))}

      {/* Nebula clouds */}
      <motion.div
        animate={{
          opacity: [0.03, 0.08, 0.03],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '10%',
          left: '20%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,157,0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <motion.div
        animate={{
          opacity: [0.05, 0.1, 0.05],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(147,112,219,0.3) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
    </div>
  )
}
