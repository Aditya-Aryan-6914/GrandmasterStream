import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface GameTimerProps {
  initialSeconds: number;
  isActive: boolean;
  onTimeUp?: () => void;
  playerName: string;
  isCurrentTurn?: boolean;
}

const GameTimer: React.FC<GameTimerProps> = ({
  initialSeconds,
  isActive,
  onTimeUp,
  playerName,
  isCurrentTurn = false
}) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isTimeWarning = timeLeft <= 60;

  return (
    <div
      className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
        isCurrentTurn
          ? `border-chess-accent ${isTimeWarning ? 'bg-red-500/10' : 'bg-chess-accent/10'}`
          : 'border-gray-700 bg-[#1a1a1a]'
      }`}
    >
      <div className="text-sm text-gray-400 mb-2">{playerName}</div>
      <div
        className={`flex items-center space-x-2 text-3xl font-mono font-bold ${
          isTimeWarning ? 'text-red-400' : 'text-white'
        }`}
      >
        <Clock size={24} />
        <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
      </div>
      {isCurrentTurn && (
        <div className="text-xs text-chess-accent mt-2 animate-pulse">Active</div>
      )}
    </div>
  );
};

export default GameTimer;
