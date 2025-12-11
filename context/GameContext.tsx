import React, { createContext, useContext, useState, useCallback } from 'react';

export interface GamePlayer {
  id: string;
  name: string;
  avatar: string;
  rating?: number;
  joined: boolean;
}

interface GameContextType {
  player1: GamePlayer | null;
  player2: GamePlayer | null;
  isPlayer1Ready: boolean;
  isPlayer2Ready: boolean;
  gameStarted: boolean;
  currentTurn: 'white' | 'black';
  setPlayer: (playerNumber: 1 | 2, player: GamePlayer) => void;
  setPlayerReady: (playerNumber: 1 | 2, ready: boolean) => void;
  startGame: () => void;
  switchTurn: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [player1, setPlayer1State] = useState<GamePlayer | null>(null);
  const [player2, setPlayer2State] = useState<GamePlayer | null>(null);
  const [isPlayer1Ready, setIsPlayer1Ready] = useState(false);
  const [isPlayer2Ready, setIsPlayer2Ready] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentTurn, setCurrentTurn] = useState<'white' | 'black'>('white');

  const setPlayer = useCallback((playerNumber: 1 | 2, player: GamePlayer) => {
    if (playerNumber === 1) {
      setPlayer1State(player);
    } else {
      setPlayer2State(player);
    }
  }, []);

  const setPlayerReady = useCallback((playerNumber: 1 | 2, ready: boolean) => {
    if (playerNumber === 1) {
      setIsPlayer1Ready(ready);
    } else {
      setIsPlayer2Ready(ready);
    }
  }, []);

  const startGame = useCallback(() => {
    if (player1 && player2 && isPlayer1Ready && isPlayer2Ready) {
      setGameStarted(true);
    }
  }, [player1, player2, isPlayer1Ready, isPlayer2Ready]);

  const switchTurn = useCallback(() => {
    setCurrentTurn(prev => prev === 'white' ? 'black' : 'white');
  }, []);

  const resetGame = useCallback(() => {
    setIsPlayer1Ready(false);
    setIsPlayer2Ready(false);
    setGameStarted(false);
    setCurrentTurn('white');
  }, []);

  return (
    <GameContext.Provider value={{
      player1,
      player2,
      isPlayer1Ready,
      isPlayer2Ready,
      gameStarted,
      currentTurn,
      setPlayer,
      setPlayerReady,
      startGame,
      switchTurn,
      resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
