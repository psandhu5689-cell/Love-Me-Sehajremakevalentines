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
