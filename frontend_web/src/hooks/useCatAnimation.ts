import { useState, useEffect, useRef, useCallback } from 'react';

// 12 floor spots with different idle animations
const FLOOR_SPOTS = [
  { x: 15, y: 55, idle: 'sitIdle' },
  { x: 25, y: 60, idle: 'layIdle' },
  { x: 35, y: 55, idle: 'lickPawSitFront' },
  { x: 45, y: 65, idle: 'tailWagSitFront' },
  { x: 55, y: 60, idle: 'sitIdle' },
  { x: 65, y: 55, idle: 'yarnSitFront' },
  { x: 20, y: 70, idle: 'layIdle' },
  { x: 35, y: 75, idle: 'sleep1LeftFront' },
  { x: 50, y: 72, idle: 'tailWagLieFront' },
  { x: 65, y: 70, idle: 'sitIdle' },
  { x: 30, y: 65, idle: 'meowSitFront' },
  { x: 55, y: 68, idle: 'curlBallLie' },
];

export interface CatAnimationState {
  x: number;
  y: number;
  animation: string;
  isMoving: boolean;
  targetSpot: number | null;
}

export function useCatAnimation(catName: string) {
  const [state, setState] = useState<CatAnimationState>({
    x: FLOOR_SPOTS[0].x,
    y: FLOOR_SPOTS[0].y,
    animation: 'sitIdle',
    isMoving: false,
    targetSpot: null,
  });

  const roamTimer = useRef<NodeJS.Timeout | null>(null);
  const moveAnimFrame = useRef<number | null>(null);

  const getWalkAnimation = useCallback((fromX: number, fromY: number, toX: number, toY: number) => {
    const dx = toX - fromX;
    const dy = toY - fromY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'walkRight' : 'walkLeft';
    } else {
      return dy > 0 ? 'walkDown' : 'walkUp';
    }
  }, []);

  const moveTo = useCallback((targetX: number, targetY: number, onComplete?: () => void, arriveAnimation?: string) => {
    const startX = state.x;
    const startY = state.y;
    const walkAnim = getWalkAnimation(startX, startY, targetX, targetY);
    
    setState(prev => ({
      ...prev,
      animation: walkAnim,
      isMoving: true,
    }));

    const distance = Math.sqrt(Math.pow(targetX - startX, 2) + Math.pow(targetY - startY, 2));
    const duration = Math.max(1200, Math.min(2500, distance * 40));
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const newX = startX + (targetX - startX) * progress;
      const newY = startY + (targetY - startY) * progress;

      setState(prev => ({
        ...prev,
        x: newX,
        y: newY,
      }));

      if (progress < 1) {
        moveAnimFrame.current = requestAnimationFrame(animate);
      } else {
        setState(prev => ({
          ...prev,
          animation: arriveAnimation || 'sitIdle',
          isMoving: false,
          targetSpot: null,
        }));
        if (onComplete) onComplete();
      }
    };

    moveAnimFrame.current = requestAnimationFrame(animate);
  }, [state.x, state.y, getWalkAnimation]);

  const moveToSpot = useCallback((spotIndex: number) => {
    const spot = FLOOR_SPOTS[spotIndex];
    moveTo(spot.x, spot.y, undefined, spot.idle);
  }, [moveTo]);

  const startRoaming = useCallback(() => {
    const roam = () => {
      const randomSpot = Math.floor(Math.random() * FLOOR_SPOTS.length);
      moveToSpot(randomSpot);
      
      const nextInterval = 5000 + Math.random() * 5000;
      roamTimer.current = setTimeout(roam, nextInterval);
    };

    const initialDelay = 3000 + Math.random() * 2000;
    roamTimer.current = setTimeout(roam, initialDelay);
  }, [moveToSpot]);

  const stopRoaming = useCallback(() => {
    if (roamTimer.current) {
      clearTimeout(roamTimer.current);
      roamTimer.current = null;
    }
    if (moveAnimFrame.current) {
      cancelAnimationFrame(moveAnimFrame.current);
      moveAnimFrame.current = null;
    }
  }, []);

  const playAction = useCallback((action: string, duration: number = 2000) => {
    stopRoaming();
    setState(prev => ({ ...prev, animation: action, isMoving: false }));
    
    setTimeout(() => {
      setState(prev => ({ ...prev, animation: 'sitIdle' }));
      startRoaming();
    }, duration);
  }, [stopRoaming, startRoaming]);

  useEffect(() => {
    startRoaming();
    return () => stopRoaming();
  }, []);

  return {
    state,
    setState,
    moveTo,
    moveToSpot,
    playAction,
    stopRoaming,
    startRoaming,
  };
}
