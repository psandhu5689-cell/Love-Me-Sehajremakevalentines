import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBack, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import haptics from '../utils/haptics'

const QUIZ_QUESTIONS = [
  {
    question: 'When did we start talking?',
    options: ['Feb 26, 2025', 'Jan 15, 2025', 'Mar 1, 2025', 'Feb 14, 2025'],
    correct: 0,
  },
  {
    question: 'When did we start dating?',
    options: ['Jun 11, 2025', 'Jul 11, 2025', 'Aug 11, 2025', 'Jul 1, 2025'],
    correct: 1,
  },
  {
    question: "What's my silly nickname for you?",
    options: ['Sweetie', 'Berryboo', 'Honey', 'Angel'],
    correct: 1,
  },
  {
    question: 'What am I to you?',
    options: ['Your friend', 'Your boy', 'Your buddy', 'Your pal'],
    correct: 1,
  },
  {
    question: 'What are you when emotional?',
    options: ['Emotional', 'Sensitive', 'Crybaby', 'Sad'],
    correct: 2,
  },
  {
    question: "What's your other cute nickname?",
    options: ['Sweetpants', 'Poopypants', 'Fancypants', 'Smartypants'],
    correct: 1,
  },
  {
    question: 'What do we have?',
    options: ['Friendship', 'Love', 'Connection', 'Bond'],
    correct: 1,
  },
  {
    question: 'How long are we together?',
    options: ['A while', 'Some time', 'Forever', 'Long time'],
    correct: 2,
  },
  {
    question: "What's the first thing I said about you?",
    options: ['You were nice', 'You were cute', 'You were cool', 'You were smart'],
    correct: 1,
  },
  {
    question: 'What do I want with you?',
    options: ['Good times', 'Every second', 'Some moments', 'Happy days'],
    correct: 1,
  },
]

export default function LoveQuiz() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const question = QUIZ_QUESTIONS[currentQuestion]
  const isLastQuestion = currentQuestion === QUIZ_QUESTIONS.length - 1

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index)
    const correct = index === question.correct
    setIsCorrect(correct)

    if (correct) {
      haptics.success()
      setScore(score + 1)
    } else {
      haptics.error()
    }

    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true)
      } else {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setIsCorrect(null)
      }
    }, 1500)
  }

  const handleContinue = () => {
    haptics.medium()
    navigate('/celebration')
  }

  const getScoreMessage = () => {
    const percentage = (score / QUIZ_QUESTIONS.length) * 100
    if (percentage === 100) return "Perfect! You know us so well 💕"
    if (percentage >= 80) return "Amazing! You're paying attention 😊"
    if (percentage >= 60) return "Good job! You know quite a bit 😊"
    return "Not bad! We'll make more memories ❤️"
  }

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
        onClick={() => { haptics.light(); navigate(-1); }}
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
        {!showResult ? (
          <>
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
              Love Quiz ❤️
            </motion.h1>

            <p style={{
              color: colors.textSecondary,
              fontSize: 14,
              textAlign: 'center',
              marginBottom: 32,
            }}>
              Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
            </p>

            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: 4,
              background: colors.border,
              borderRadius: 2,
              marginBottom: 32,
              overflow: 'hidden',
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                {/* Question */}
                <div style={{
                  background: colors.glass,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${colors.border}`,
                  borderRadius: 24,
                  padding: 32,
                  marginBottom: 24,
                  textAlign: 'center',
                }}>
                  <h2 style={{
                    color: colors.textPrimary,
                    fontSize: 20,
                    fontWeight: 600,
                    lineHeight: 1.5,
                  }}>
                    {question.question}
                  </h2>
                </div>

                {/* Options */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}>
                  {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === index
                    const isCorrectAnswer = index === question.correct
                    const showFeedback = selectedAnswer !== null

                    let background = colors.glass
                    let borderColor = colors.border

                    if (showFeedback) {
                      if (isSelected) {
                        background = isCorrect ? '#4CAF50' : '#f44336'
                        borderColor = isCorrect ? '#4CAF50' : '#f44336'
                      } else if (isCorrectAnswer) {
                        background = '#4CAF50'
                        borderColor = '#4CAF50'
                      }
                    }

                    return (
                      <motion.button
                        key={index}
                        whileHover={!showFeedback ? { scale: 1.02 } : {}}
                        whileTap={!showFeedback ? { scale: 0.98 } : {}}
                        onClick={() => !showFeedback && handleAnswer(index)}
                        disabled={showFeedback}
                        style={{
                          padding: '20px',
                          borderRadius: 16,
                          background,
                          backdropFilter: 'blur(20px)',
                          border: `2px solid ${borderColor}`,
                          color: showFeedback && (isSelected || isCorrectAnswer) ? 'white' : colors.textPrimary,
                          fontSize: 16,
                          fontWeight: 500,
                          cursor: showFeedback ? 'default' : 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.3s',
                        }}
                      >
                        <span>{option}</span>
                        {showFeedback && isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            {isCorrect ? (
                              <IoCheckmarkCircle size={24} color="white" />
                            ) : (
                              <IoCloseCircle size={24} color="white" />
                            )}
                          </motion.div>
                        )}
                        {showFeedback && !isSelected && isCorrectAnswer && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <IoCheckmarkCircle size={24} color="white" />
                          </motion.div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              borderRadius: 24,
              padding: 40,
              textAlign: 'center',
            }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ fontSize: 80, marginBottom: 24 }}
            >
              🎉
            </motion.div>

            <h2 style={{
              color: 'white',
              fontSize: 32,
              fontWeight: 700,
              marginBottom: 16,
            }}>
              Quiz Complete!
            </h2>

            <div style={{
              fontSize: 48,
              fontWeight: 700,
              color: 'white',
              marginBottom: 16,
            }}>
              {score}/{QUIZ_QUESTIONS.length}
            </div>

            <p style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: 18,
              marginBottom: 32,
              lineHeight: 1.5,
            }}>
              {getScoreMessage()}
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
              style={{
                width: '100%',
                padding: '18px',
                borderRadius: 30,
                background: 'white',
                border: 'none',
                color: colors.primary,
                fontSize: 18,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Continue to Celebration 🎊
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
