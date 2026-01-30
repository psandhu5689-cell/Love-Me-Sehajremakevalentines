import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronBack, IoAdd, IoClose, IoHeart, IoHeartOutline, IoTrash, IoImages } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import soundManager from '../utils/soundManager'

interface Photo {
  id: string
  url: string
  caption: string
  date: string
  isFavorite: boolean
  timestamp: number
}

export default function SharedAlbum() {
  const navigate = useNavigate()
  const { colors } = useTheme()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [filter, setFilter] = useState<'all' | 'favorites'>('all')

  // Form state
  const [url, setUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    loadPhotos()
  }, [])

  const loadPhotos = () => {
    const saved = localStorage.getItem('sharedAlbumPhotos')
    if (saved) setPhotos(JSON.parse(saved))
  }

  const savePhotos = (newPhotos: Photo[]) => {
    const capped = newPhotos.slice(0, 100)
    localStorage.setItem('sharedAlbumPhotos', JSON.stringify(capped))
    setPhotos(capped)
  }

  const addPhoto = () => {
    if (!url || !caption || !date) return

    soundManager.play('uiSuccess')
    const photo: Photo = {
      id: Date.now().toString(),
      url,
      caption,
      date,
      isFavorite: false,
      timestamp: Date.now(),
    }

    savePhotos([photo, ...photos])
    resetForm()
    setShowAdd(false)
  }

  const toggleFavorite = (id: string) => {
    soundManager.tap()
    const updated = photos.map(p => 
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    )
    savePhotos(updated)
  }

  const deletePhoto = (id: string) => {
    soundManager.tap()
    const updated = photos.filter(p => p.id !== id)
    savePhotos(updated)
    setSelectedPhoto(null)
  }

  const resetForm = () => {
    setUrl('')
    setCaption('')
    setDate('')
  }

  const filteredPhotos = photos.filter(p => 
    filter === 'all' ? true : p.isFavorite
  )

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
        onClick={() => { soundManager.play('uiBack'); navigate(-1); }}
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

      <div style={{ maxWidth: 1000, margin: '60px auto 0' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ color: colors.textPrimary, fontSize: 32, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}
        >
          Shared Album 📸
        </motion.h1>
        <p style={{ color: colors.textSecondary, fontSize: 14, textAlign: 'center', marginBottom: 32 }}>
          Our memories together
        </p>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { soundManager.tap(); setShowAdd(true); }}
            style={{
              padding: '12px 24px',
              borderRadius: 16,
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              border: 'none',
              color: 'white',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <IoAdd size={20} />
            Add Memory
          </motion.button>

          <div style={{ display: 'flex', gap: 8, background: colors.card, padding: 6, borderRadius: 12 }}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => { soundManager.tap(); setFilter('all'); }}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                background: filter === 'all' ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : 'transparent',
                border: 'none',
                color: filter === 'all' ? 'white' : colors.textSecondary,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              All
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => { soundManager.tap(); setFilter('favorites'); }}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                background: filter === 'favorites' ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : 'transparent',
                border: 'none',
                color: filter === 'favorites' ? 'white' : colors.textSecondary,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <IoHeart size={16} />
              Favorites
            </motion.button>
          </div>
        </div>

        {/* Photos Grid */}
        {filteredPhotos.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: colors.textSecondary,
          }}>
            <IoImages size={64} color={colors.textSecondary} style={{ marginBottom: 16, opacity: 0.5 }} />
            <p style={{ fontSize: 16 }}>No memories yet. Start adding some! 💕</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 20,
          }}>
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03, y: -4 }}
                onClick={() => { soundManager.tap(); setSelectedPhoto(photo); }}
                style={{
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 20,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <div style={{
                  width: '100%',
                  height: 200,
                  background: `url(${photo.url}) center/cover`,
                  position: 'relative',
                }}>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(photo.id); }}
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      background: 'rgba(0,0,0,0.5)',
                      backdropFilter: 'blur(10px)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    {photo.isFavorite ? (
                      <IoHeart size={20} color="#ff4444" />
                    ) : (
                      <IoHeartOutline size={20} color="white" />
                    )}
                  </motion.button>
                </div>

                <div style={{ padding: 16 }}>
                  <p style={{
                    color: colors.textPrimary,
                    fontSize: 15,
                    fontWeight: 600,
                    marginBottom: 4,
                  }}>
                    {photo.caption}
                  </p>
                  <p style={{
                    color: colors.textSecondary,
                    fontSize: 13,
                  }}>
                    {photo.date}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Photo Modal */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.7)',
                zIndex: 200,
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: 500,
                background: colors.card,
                borderRadius: 24,
                padding: 32,
                zIndex: 201,
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <h2 style={{ color: colors.textPrimary, fontSize: 24, marginBottom: 24 }}>Add Memory</h2>

              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Image URL (e.g., https://example.com/photo.jpg)"
                style={{
                  width: '100%',
                  padding: '14px',
                  marginBottom: 16,
                  borderRadius: 12,
                  background: colors.background,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary,
                  fontSize: 14,
                  outline: 'none',
                }}
              />

              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Caption"
                style={{
                  width: '100%',
                  padding: '14px',
                  marginBottom: 16,
                  borderRadius: 12,
                  background: colors.background,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary,
                  fontSize: 14,
                  outline: 'none',
                }}
              />

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px',
                  marginBottom: 24,
                  borderRadius: 12,
                  background: colors.background,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary,
                  fontSize: 14,
                  outline: 'none',
                }}
              />

              <div style={{ display: 'flex', gap: 12 }}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { soundManager.tap(); setShowAdd(false); resetForm(); }}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: 12,
                    background: colors.glass,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={addPhoto}
                  disabled={!url || !caption || !date}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: 12,
                    background: (url && caption && date) ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : colors.glass,
                    border: 'none',
                    color: 'white',
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: (url && caption && date) ? 'pointer' : 'not-allowed',
                    opacity: (url && caption && date) ? 1 : 0.5,
                  }}
                >
                  Add
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* View Photo Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.9)',
                zIndex: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
              }}
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); setSelectedPhoto(null); }}
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 202,
                }}
              >
                <IoClose size={24} color="white" />
              </motion.button>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: '90%',
                  maxHeight: '90vh',
                  background: colors.card,
                  borderRadius: 24,
                  overflow: 'hidden',
                  zIndex: 201,
                }}
              >
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  style={{
                    width: '100%',
                    maxHeight: '70vh',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
                <div style={{ padding: 24 }}>
                  <h3 style={{ color: colors.textPrimary, fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
                    {selectedPhoto.caption}
                  </h3>
                  <p style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 16 }}>
                    {selectedPhoto.date}
                  </p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleFavorite(selectedPhoto.id)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: 12,
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
                      {selectedPhoto.isFavorite ? <IoHeart size={18} color="#ff4444" /> : <IoHeartOutline size={18} />}
                      {selectedPhoto.isFavorite ? 'Unfavorite' : 'Favorite'}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deletePhoto(selectedPhoto.id)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: 12,
                        background: 'rgba(255,0,0,0.1)',
                        border: '1px solid rgba(255,0,0,0.3)',
                        color: '#ff4444',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                      }}
                    >
                      <IoTrash size={18} />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
