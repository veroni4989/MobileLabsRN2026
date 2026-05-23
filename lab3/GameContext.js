import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const INITIAL_CHALLENGES = [
  { id: 'tap10',      title: 'Зроби 10 кліків',        description: "Натисни на об'єкт 10 разів",   icon: '👆', target: 10  },
  { id: 'doubletap5', title: 'Подвійний клік 5 разів',  description: 'Зроби 5 подвійних кліків',      icon: '✌️', target: 5   },
  { id: 'longpress',  title: 'Утримай 3 секунди',       description: "Утримуй об'єкт 3 секунди",      icon: '⏱️', target: 1   },
  { id: 'drag',       title: "Перетягни об'єкт",        description: "Перемісти об'єкт по екрану",    icon: '🔄', target: 1   },
  { id: 'swiperight', title: 'Свайп вправо',            description: 'Зроби швидкий свайп вправо',    icon: '👉', target: 1   },
  { id: 'swipeleft',  title: 'Свайп вліво',             description: 'Зроби швидкий свайп вліво',     icon: '👈', target: 1   },
  { id: 'pinch',      title: "Зміни розмір об'єкта",    description: 'Використай pinch-жест',         icon: '🤏', target: 1   },
  { id: 'reach100',   title: 'Набери 100 очок',         description: 'Набери загалом 100 очок',       icon: '🏆', target: 100 },
  { id: 'swipe50',    title: 'Набери 50 очок свайпами', description: 'Отримай 50 очок через свайпи',  icon: '🌟', target: 50  },
];

const initChallenges = () =>
  INITIAL_CHALLENGES.map(c => ({ ...c, progress: 0, completed: false }));

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [score, setScore]           = useState(0);
  const [swipeScore, setSwipeScore] = useState(0);
  const [challenges, setChallenges] = useState(initChallenges);
  const [isDark, setIsDark]         = useState(false);

  useEffect(() => {
    setChallenges(prev => prev.map(c =>
      c.id === 'reach100'
        ? { ...c, progress: Math.min(score, 100), completed: score >= 100 }
        : c
    ));
  }, [score]);

  useEffect(() => {
    setChallenges(prev => prev.map(c =>
      c.id === 'swipe50'
        ? { ...c, progress: Math.min(swipeScore, 50), completed: swipeScore >= 50 }
        : c
    ));
  }, [swipeScore]);

  const addScore = useCallback((pts, fromSwipe = false) => {
    setScore(s => s + pts);
    if (fromSwipe) setSwipeScore(s => s + pts);
  }, []);

  const markChallenge = useCallback((id, increment = 1) => {
    setChallenges(prev => prev.map(c => {
      if (c.id !== id || c.completed) return c;
      const p = Math.min(c.progress + increment, c.target);
      return { ...c, progress: p, completed: p >= c.target };
    }));
  }, []);

  const toggleTheme = useCallback(() => setIsDark(d => !d), []);

  const resetGame = useCallback(() => {
    setScore(0);
    setSwipeScore(0);
    setChallenges(initChallenges());
  }, []);

  return (
    <GameContext.Provider value={{ score, challenges, isDark, addScore, markChallenge, toggleTheme, resetGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}