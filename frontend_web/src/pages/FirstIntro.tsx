import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

interface Star {
  id: number
  x: number
  y: number
  size: number
  delay: number
}

const generateStars = (): Star[] => {
  return Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 70,
    size: Math.random() * 2.5 + 1,
    delay: Math.random() * 2,
  }))
}

export default function FirstIntro() {
  const navigate = useNavigate()
  const [stars] = useState<Star[]>(generateStars)
  const [showContent, setShowContent] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    setTimeout(() => setShowContent(true), 800)
    setTimeout(() => setShowButton(true), 3000)
  }, [])

  const handleContinue = () => {
    localStorage.setItem('first_intro_seen', 'true')
    sessionStorage.setItem('sehaj_intro_shown_session', 'true')
    navigate('/', { replace: true })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0F',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Parallax Heart particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`heart-${i}`}
          animate={{
            y: [-20, -60, -20],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            delay: i * 0.5,
            repeat: Infinity,
          }}
          style={{
            position: 'fixed',
            left: `${5 + Math.random() * 90}%`,
            top: `${20 + Math.random() * 60}%`,
            fontSize: 14 + Math.random() * 12,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {['💗', '✨', '💕', '⭐'][i % 4]}
        </motion.div>
      ))}

      {/* Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: star.delay,
          }}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            borderRadius: '50%',
            background: '#FFFFFF',
            boxShadow: '0 0 6px rgba(255,255,255,0.8)',
          }}
        />
      ))}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={showContent ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 2 }}
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 32px 120px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Glow */}
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
          style={{
            position: 'absolute',
            width: '90%',
            height: '60%',
            background: 'rgba(255, 107, 157, 0.08)',
            borderRadius: 200,
            filter: 'blur(60px)',
          }}
        />

        <p style={{
          fontSize: 28,
          fontWeight: 300,
          color: '#FFFFFF',
          marginBottom: 24,
          fontStyle: 'italic',
          textShadow: '0 0 20px rgba(255, 107, 157, 0.5)',
        }}>
          Hey baby,
        </p>

        <p style={messageStyle}>
          I know I'm not the best boyfriend at times…<br />
          but I'm definitely a goated one.
        </p>

        <p style={messageStyle}>
          I dedicate this app to everything you mean to me.
        </p>

        <p style={messageStyle}>
          My purpose wasn't to sugarcoat or win you over.<br />
          It was to show you that no matter what task,<br />
          no matter what time,<br />
          no matter what skill…
        </p>

        <p style={{
          ...messageStyle,
          fontSize: 17,
          fontWeight: 600,
          color: '#FF6B9D',
          fontStyle: 'italic',
          textShadow: '0 0 20px rgba(255, 107, 157, 0.6)',
        }}>
          I will do anything for you.
        </p>

        <p style={messageStyle}>
          Today I made an app.<br />
          Tomorrow I'll be taking your pictures on a Canon G7X<br />
          while you gracefully sit on the edge of a crescent moon.
        </p>

        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
            Sincerely,
          </p>
          <p style={{
            fontSize: 16,
            color: '#FFFFFF',
            fontWeight: 500,
            textShadow: '0 0 15px rgba(255, 107, 157, 0.4)',
          }}>
            your awesome man
          </p>
          <p style={{ fontSize: 14, color: 'rgba(255, 107, 157, 0.8)', fontStyle: 'italic', marginTop: 4 }}>
            (aka Prabh)
          </p>
        </div>
      </motion.div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={showButton ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        style={{
          position: 'fixed',
          bottom: 100,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 100,
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          style={{
            background: 'linear-gradient(135deg, #FF6B9D, #C44569, #8B3A62)',
            border: 'none',
            color: 'white',
            padding: '16px 50px',
            borderRadius: 30,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: 2,
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(255, 107, 157, 0.4)',
          }}
        >
          Continue
        </motion.button>
      </motion.div>
    </div>
  )
}

const messageStyle: React.CSSProperties = {
  fontSize: 15,
  color: 'rgba(255, 255, 255, 0.9)',
  textAlign: 'center',
  lineHeight: 1.8,
  marginBottom: 20,
  textShadow: '0 0 15px rgba(255, 107, 157, 0.3)',
}