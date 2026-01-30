# Valentine's Sequence App - PRD

## Original Problem Statement
VALENTINES SEQUENCE EXPANSION – Add 8+ new pages with puzzles and media into the Valentine's sequence. Create a rich, interactive romantic journey with photos, videos, games, and puzzles.

## Architecture
- **Frontend**: React + Vite + Framer Motion (frontend_web/)
- **Backend**: FastAPI (backend/)
- **Database**: MongoDB
- **Styling**: Inline styles with theme context
- **Audio**: Howler.js for sound effects and music

## User Personas
- **Sehaj**: The recipient of this romantic app
- **Prabh**: The creator, author of all personal content

## Core Requirements (Static)
1. Valentine's sequence starting from START button
2. 8+ new interactive pages with puzzles and media
3. Mobile-first, PWA-friendly
4. Real project assets (photos/videos)
5. Prabh voice for all content

## What's Been Implemented

### Date: Jan 30, 2026
- ✅ Created **HiddenHearts** page (`/hidden-hearts`)
  - Find 7 hidden hearts in a photo
  - Progress tracking with animated progress bar
  - Hint system that pulses all hearts
  - Beautiful animations and confetti on completion
  - Skip functionality

- ✅ Fixed Valentine's Sequence Navigation Flow:
  - Origin → PhotoTimeline → Crossword → WordScramble → SpotDifference → VideoLetter → CardMatch → **HiddenHearts** → HoldReveal → MusicMemory → HeartDraw → SecretCode → LoveQuiz → QuietStars → Question → Celebration → Home

- ✅ Updated Navigation:
  - CardMatch → HiddenHearts (was: HoldReveal)
  - HiddenHearts → HoldReveal (new)
  - HoldReveal → MusicMemory (was: QuietStars)
  - LoveQuiz → QuietStars (was: Celebration)
  - QuietStars → Question (was: Home)
  - Celebration → Home (final)

### Existing 8 New Pages (Previously Implemented)
1. PhotoTimeline - Swipeable photo memories
2. WordScramble - Unscramble love words
3. SpotDifference - Find differences game
4. VideoLetter - Watch video message
5. MusicMemory - Pick our song
6. HeartDraw - Draw a heart on canvas
7. SecretCode - Keypad with special dates
8. LoveQuiz - 10 questions about us

## Prioritized Backlog

### P0 (Critical)
- All implemented ✅

### P1 (High Priority)
- Add more photo/video content to pages
- Improve video loading performance
- Add sound effects to HiddenHearts

### P2 (Medium Priority)
- Add offline caching for PWA
- Implement save progress for all games
- Add achievement badges

## Next Tasks
1. Add more heart animations to HiddenHearts
2. Consider adding difficulty levels to puzzles
3. Add more personal photos to the timeline
4. Implement streak/completion tracking

## Technical Notes
- Frontend runs on port 3000 (Vite dev server)
- Backend runs on port 8001 (FastAPI)
- Videos hosted on customer-assets.emergentagent.com

### Date: Jan 30, 2026 (Update 2)
- ✅ Created **JourneyProgress** component (`/components/JourneyProgress.tsx`)
  - Heart-shaped progress indicator that fills based on sequence position
  - Shows X/17 counter with current page position
  - Displays current page name label (PHOTOS, CODE, CELEBRATE, etc.)
  - Smooth animated fill with gradient colors
  - Positioned in top-right corner of all sequence pages
  - 3 variants available: heart (default), minimal, full

- ✅ Added JourneyProgress to all 17 Valentine's sequence pages:
  1. Personalization (1/17)
  2. Origin (2/17)
  3. PhotoTimeline (3/17)
  4. Crossword (4/17)
  5. WordScramble (5/17)
  6. SpotDifference (6/17)
  7. VideoLetter (7/17)
  8. CardMatch (8/17)
  9. HiddenHearts (9/17)
  10. HoldReveal (10/17)
  11. MusicMemory (11/17)
  12. HeartDraw (12/17)
  13. SecretCode (13/17)
  14. LoveQuiz (14/17)
  15. QuietStars (15/17)
  16. Question (16/17)
  17. Celebration (17/17)

### Date: Jan 30, 2026 (Update 3)
- ✅ Verified **HowLongTogether** page (`/how-long-together`) - Already fully implemented
  - 4 timer sections all working correctly:
    1. Talking Since (Feb 26, 2025) - Shows years, months, days, hours, min, sec
    2. Dating Since (Jul 11, 2025) - Shows years, months, days, hours, min, sec
    3. Till Anniversary - Countdown to next July 11 (shows "Today 💖" on July 11)
    4. Found Each Other in Old Lifetimes - 6x talking duration with "6 lives ago" subtitle
  - Single shared interval ticking every second (performance optimized)
  - Progress rings on each card (pink, blue, green gradient fills)
  - Glassy card design with backdrop blur
  - Mobile-friendly vertical stack layout
  - Memory chips for quick navigation
  - Story/Clean mode toggle
  - Anniversary celebration with confetti on July 11

### Date: Jan 30, 2026 (Update 4)
- ✅ **Daily Love Activities - Glassy Redesign**
  
  **Page Improvements:**
  - Added floating background particles (💗, ✨, 💕, ⭐)
  - Glassy header with backdrop blur
  - All activity cards now have glassmorphism design
  
  **Heart to Heart 💕:**
  - Glassy card with shimmer effect
  - Tags showing "60 prompts" and "Save history"
  - Gradient icon background
  
  **Would You Rather 🎲:**
  - Glassy card with shimmer effect
  - Tags showing "35 questions" and "See their pick"
  - Purple gradient icon
  
  **Who's Right? 🪙:**
  - Spinning 3D coin animation (idle wobble)
  - Enhanced flip animation with perspective
  - Glassy score display (Prabh vs Sehaj)
  - Live score tracking on card preview
  - "Reset Score" button
  - Floating sparkle particles
  - Gold gradient button with glow
  
  **Together For 🕯️:**
  - Shows "X days and counting" preview
  - Glassy card design

### Date: Jan 30, 2026 (Update 5)
- ✅ **Would You Rather - Match Percentage Feature**
  - Added match stats panel showing:
    - Match Rate percentage (color-coded: green >70%, orange >40%, pink <40%)
    - Total questions answered
    - Total matches count
  - Match celebration message when both pick the same ("💕 You both picked the same! 💕")
  - Stats persist in localStorage
  - Reset Stats button
  - Glassy UI with floating particles

- ✅ **Heart to Heart - Favorites Feature**
  - Favorites button with badge showing count
  - Heart button on each prompt card to toggle favorite
  - "X favorite(s) saved" counter below title
  - Favorites modal with:
    - Glassy design with backdrop blur
    - List of saved prompts with remove buttons
    - Empty state with guidance
  - Favorites persist in localStorage
  - Pulsing heart animation at top
  - Updated glassy card design

### Date: Jan 30, 2026 (Update 6)
- ✅ **Glassy Design Applied to All Pages**
  
  **Updated Pages:**
  - Index (user selection modal with floating particles)
  - Gallery (glassy header, cards with shadows)
  - LoveQuiz (floating particles, glassy back button)
  - SecretCode (floating 🔐 particles, glassy keypad)
  - HeartDraw (floating ❤️ particles, glassy canvas)
  - MusicMemory (floating 🎵 particles, glassy cards)
  - DailyLove activities (already glassy)
  
  **Common Glassy Elements:**
  - `colors.glass` background with `backdropFilter: 'blur(10px-20px)'`
  - Floating emoji particles with motion animations
  - Border with `colors.border`
  - Box shadows with `colors.primaryGlow`
  - Shimmer effects on buttons
  - Rounded corners (20-32px radius)

### Date: Jan 30, 2026 (Update 7)
- ✅ **Glassy Design + Parallax Particles on ALL Remaining Pages**
  
  **Created Component:**
  - `ParallaxParticles.tsx` - Reusable parallax floating particles component
  
  **Updated Pages (excluding VirtualBed):**
  - CardMatch - Floating 🎴💕✨💗🃏 particles with parallax
  - Celebration - Extra particles (🎉💕✨🎊💗⭐🥳), 15 total
  - FirstIntro - Parallax heart particles overlay on stars
  - HoldReveal - Floating 🔓💕✨💗🔮 particles
  - Origin - Floating 📖💕✨💗🌟 particles
  - Personalization - Floating 💫💕✨💗✏️ particles
  - Question - Enhanced parallax 💝💕✨💗❤️🥰 particles
  - SpotDifference - Floating 🔍💕✨👁️💗 particles
  - Crossword - Floating ✏️💕✨📝💗 particles
  - RelationshipEmergency - Emergency 🚨💕❤️🆘💗 particles
  - TryNotToSmile - Already had floating particles
  
  **Parallax Effect:**
  - Each particle has different parallaxFactor (0.1-0.3)
  - Particles move at different speeds on scroll
  - Includes rotation, scale, and opacity animations
  - Creates depth and immersion
  
  **Common Pattern:**
  - All back buttons now use `colors.glass` with `backdropFilter: 'blur(10px)'`
  - Pages have `overflow: 'hidden'` to contain particles
  - Particles use `position: 'fixed'` with `zIndex: 0`
