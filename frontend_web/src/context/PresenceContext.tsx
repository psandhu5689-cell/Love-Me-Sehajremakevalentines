import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface PresenceData {
  shared: boolean
  timestamp: number | null
}

interface HeartToHeartEntry {
  prompt: string
  timestamp: number
  user: 'prabh' | 'sehaj'
}

interface PresenceContextType {
  currentUser: 'prabh' | 'sehaj' | null
  setCurrentUser: (user: 'prabh' | 'sehaj') => void
  prabhPresence: PresenceData
  sehajPresence: PresenceData
  showUserSetup: boolean
  showPresenceCheck: boolean
  setShowUserSetup: (show: boolean) => void
  setShowPresenceCheck: (show: boolean) => void
  markPresence: (shared: boolean) => void
  heartToHeartHistory: HeartToHeartEntry[]
  addHeartToHeart: (prompt: string) => void
  getTimeAgo: (timestamp: number) => string
  checkShouldShowPresence: () => boolean
}

const PresenceContext = createContext<PresenceContextType | undefined>(undefined)

const AWAY_THRESHOLD = 5 * 60 * 1000 // 5 minutes - show presence modal if away longer than this

export function PresenceProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<'prabh' | 'sehaj' | null>(null)
  const [prabhPresence, setPrabhPresence] = useState<PresenceData>({ shared: false, timestamp: null })
  const [sehajPresence, setSehajPresence] = useState<PresenceData>({ shared: false, timestamp: null })
  const [showUserSetup, setShowUserSetup] = useState(false)
  const [showPresenceCheck, setShowPresenceCheck] = useState(false)
  const [heartToHeartHistory, setHeartToHeartHistory] = useState<HeartToHeartEntry[]>([])
  const [sessionChecked, setSessionChecked] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    try {
      // Check if this is the first ever visit
      const hasVisitedBefore = localStorage.getItem('hasVisitedBefore')
      
      // Load current user
      const savedUser = localStorage.getItem('currentUser') as 'prabh' | 'sehaj' | null
      const lastActivity = localStorage.getItem('lastActivityTime')
      const now = Date.now()

      // Load presence data
      const prabhShared = localStorage.getItem('lastVisitShared_prabh') === 'true'
      const prabhTimestamp = localStorage.getItem('lastSharedVisit_prabh')
      const sehajShared = localStorage.getItem('lastVisitShared_sehaj') === 'true'
      const sehajTimestamp = localStorage.getItem('lastSharedVisit_sehaj')

      setPrabhPresence({
        shared: prabhShared,
        timestamp: prabhTimestamp ? parseInt(prabhTimestamp) : null,
      })

      setSehajPresence({
        shared: sehajShared,
        timestamp: sehajTimestamp ? parseInt(sehajTimestamp) : null,
      })

      // Load heart to heart history
      const savedHistory = localStorage.getItem('heartToHeartHistory')
      if (savedHistory) {
        setHeartToHeartHistory(JSON.parse(savedHistory))
      }

      // Determine if we should show modals
      if (!savedUser || !hasVisitedBefore) {
        // First visit or no user set - show user setup
        setShowUserSetup(true)
        localStorage.setItem('hasVisitedBefore', 'true')
      } else {
        setCurrentUserState(savedUser)
        
        // Check if user was away long enough to show presence modal
        if (lastActivity) {
          const timeSinceLastActivity = now - parseInt(lastActivity)
          if (timeSinceLastActivity > AWAY_THRESHOLD && !sessionChecked) {
            setShowPresenceCheck(true)
          }
        }
      }

      // Update last activity time
      localStorage.setItem('lastActivityTime', now.toString())
      setSessionChecked(true)
    } catch (error) {
      console.error('Error loading presence data:', error)
    }
  }

  const setCurrentUser = (user: 'prabh' | 'sehaj') => {
    setCurrentUserState(user)
    localStorage.setItem('currentUser', user)
    localStorage.setItem('hasVisitedBefore', 'true')
    setShowUserSetup(false)
    
    // Only show presence check if they were away for a while, not on first setup
    const lastActivity = localStorage.getItem('lastActivityTime')
    if (lastActivity) {
      const timeSinceLastActivity = Date.now() - parseInt(lastActivity)
      if (timeSinceLastActivity > AWAY_THRESHOLD) {
        setShowPresenceCheck(true)
      }
    }
  }

  const markPresence = (shared: boolean) => {
    if (!currentUser) return

    const timestamp = Date.now()

    if (currentUser === 'prabh') {
      localStorage.setItem('lastVisitShared_prabh', shared.toString())
      if (shared) {
        localStorage.setItem('lastSharedVisit_prabh', timestamp.toString())
        setPrabhPresence({ shared: true, timestamp })
      }
    } else {
      localStorage.setItem('lastVisitShared_sehaj', shared.toString())
      if (shared) {
        localStorage.setItem('lastSharedVisit_sehaj', timestamp.toString())
        setSehajPresence({ shared: true, timestamp })
      }
    }

    setShowPresenceCheck(false)
  }

  const addHeartToHeart = (prompt: string) => {
    if (!currentUser) return

    const entry: HeartToHeartEntry = {
      prompt,
      timestamp: Date.now(),
      user: currentUser,
    }

    const newHistory = [entry, ...heartToHeartHistory].slice(0, 50) // Keep last 50 entries
    setHeartToHeartHistory(newHistory)
    localStorage.setItem('heartToHeartHistory', JSON.stringify(newHistory))
  }

  const getTimeAgo = (timestamp: number): string => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes} min ago`
    if (hours < 24) return `${hours} hr ago`
    return `${days} day${days > 1 ? 's' : ''} ago`
  }

  const checkShouldShowPresence = (): boolean => {
    const lastActivity = localStorage.getItem('lastActivityTime')
    if (!lastActivity) return false
    
    const timeSinceLastActivity = Date.now() - parseInt(lastActivity)
    return timeSinceLastActivity > AWAY_THRESHOLD
  }

  // Update activity time periodically
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('lastActivityTime', Date.now().toString())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <PresenceContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        prabhPresence,
        sehajPresence,
        showUserSetup,
        showPresenceCheck,
        setShowUserSetup,
        setShowPresenceCheck,
        markPresence,
        heartToHeartHistory,
        addHeartToHeart,
        getTimeAgo,
        checkShouldShowPresence,
      }}
    >
      {children}
    </PresenceContext.Provider>
  )
}

export function usePresence() {
  const context = useContext(PresenceContext)
  if (!context) {
    throw new Error('usePresence must be used within a PresenceProvider')
  }
  return context
}
