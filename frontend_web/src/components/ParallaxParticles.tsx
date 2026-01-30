import React, { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ParticleConfig {
  emoji: string
  x: number
  y: number
  size: number
  delay: number
  duration: number
  parallaxFactor: number
}

interface ParallaxParticlesProps {
  emojis?: string[]
  count?: number
  className?: string
}

export default function ParallaxParticles({ 
  emojis = ['💗', '✨', '💕', '⭐', '💫'],
  count = 12,
}: ParallaxParticlesProps) {
  const { scrollY } = useScroll()
  const [particles, setParticles] = useState<ParticleConfig[]>([])
  
  useEffect(() => {
    // Generate random particles on mount
    const newParticles: ParticleConfig[] = []
    for (let i = 0; i < count; i++) {
      newParticles.push({
        emoji: emojis[i % emojis.length],
        x: 5 + Math.random() * 90,
        y: 5 + Math.random() * 90,
        size: 14 + Math.random() * 14,
        delay: i * 0.2,
        duration: 4 + Math.random() * 3,
        parallaxFactor: 0.1 + Math.random() * 0.3, // Different parallax speeds
      })
    }
    setParticles(newParticles)
  }, [count, emojis.join()])

  return (
    <>
      {particles.map((particle, i) => {
        // Each particle moves at different speed based on parallaxFactor
        const y = useTransform(
          scrollY, 
          [0, 1000], 
          [0, -100 * particle.parallaxFactor]
        )
        
        return (
          <motion.div
            key={i}
            style={{
              position: 'fixed',
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              fontSize: particle.size,
              pointerEvents: 'none',
              zIndex: 0,
              y,
            }}
            animate={{
              y: [-20, -50, -20],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.5, 0.2],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {particle.emoji}
          </motion.div>
        )
      })}
    </>
  )
}

// Simple version without parallax for static pages
export function FloatingParticles({ 
  emojis = ['💗', '✨', '💕', '⭐', '💫'],
  count = 12,
}: ParallaxParticlesProps) {
  const [particles] = useState(() => 
    Array.from({ length: count }, (_, i) => ({
      emoji: emojis[i % emojis.length],
      x: 5 + Math.random() * 90,
      y: 5 + Math.random() * 90,
      size: 14 + Math.random() * 14,
      delay: i * 0.2,
      duration: 4 + Math.random() * 3,
    }))
  )

  return (
    <>
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          style={{
            position: 'fixed',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: particle.size,
            pointerEvents: 'none',
            zIndex: 0,
          }}
          animate={{
            y: [-20, -50, -20],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.5, 0.2],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {particle.emoji}
        </motion.div>
      ))}
    </>
  )
}
