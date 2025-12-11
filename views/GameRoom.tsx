import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChessBoard from '../components/ChessBoard';
import GameTimer from '../components/GameTimer';
import StreamSidebar from '../components/StreamSidebar';
import { Piece, PieceColor, PieceType, ChatMessage } from '../types';
import { INITIAL_BOARD_LAYOUT } from '../constants';
import { generateStreamChat, analyzePosition } from '../services/geminiService';
import { ArrowLeft, Share2, Sparkles, Trophy, Volume2, VolumeX, Users } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  avatar: string;
}

const GameRoom: React.FC = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [board, setBoard] = useState<(Piece | null)[][]>([]);
  const [turn, setTurn] = useState<PieceColor>(PieceColor.WHITE);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [viewerCount, setViewerCount] = useState(1204);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [gameEnded, setGameEnded] = useState(false);
  const [winner, setWinner] = useState<'white' | 'black' | null>(null);
  const [player1, setPlayer1] = useState<Player | null>(null);
  const [player2, setPlayer2] = useState<Player | null>(null);
  const [isPlayer1Ready, setIsPlayer1Ready] = useState(false);
  const [isPlayer2Ready, setIsPlayer2Ready] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);

  useEffect(() => {
    if (user && !player1) {
      setPlayer1({
        id: user.id,
        name: user.name,
        avatar: user.avatar || ''
      });
    }

    const initialBoard: (Piece | null)[][] = INITIAL_BOARD_LAYOUT.map((row) =>
      row.map((char) => {
        if (!char) return null;
        const color = char === char.toUpperCase() ? PieceColor.WHITE : PieceColor.BLACK;
        const type = char.toLowerCase() as PieceType;
        return { color, type };
      })
    );
    setBoard(initialBoard);

    setChatMessages([
      {
        id: 'sys1',
        user: 'System',
        text: `Room ${roomId} created. Waiting for opponent...`,
        color: '#fbbf24',
        isSystem: true
      }
    ]);

    const interval = setInterval(() => {
      setViewerCount(prev => Math.max(100, prev + Math.floor(Math.random() * 20) - 10));
    }, 5000);

    return () => clearInterval(interval);
  }, [roomId, user]);

  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const interval = setInterval(() => {
      if (turn === PieceColor.WHITE) {
        setWhiteTime(prev => {
          if (prev <= 1) {
            setGameEnded(true);
            setWinner('black');
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 1) {
            setGameEnded(true);
            setWinner('white');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, gameEnded, turn]);

  const handleMove = async (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    if (!gameStarted || gameEnded) return;

    const piece = board[fromRow][fromCol];
    if (!piece || piece.color !== turn) return;

    const newBoard = board.map(r => [...r]);
    const capturedPiece = newBoard[toRow][toCol];
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;

    if (piece.type === PieceType.PAWN && (toRow === 0 || toRow === 7)) {
      newBoard[toRow][toCol] = { ...piece, type: PieceType.QUEEN };
    }

    setBoard(newBoard);

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const notation = `${piece.type.toUpperCase() !== 'P' ? piece.type.toUpperCase() : ''}${files[toCol]}${8 - toRow}${capturedPiece ? 'x' : ''}`;
    setMoveHistory(prev => [...prev, notation]);

    setTurn(turn === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE);

    try {
      const responses = await generateStreamChat(newBoard, notation);
      if (responses && responses.length > 0) {
        responses.forEach(response => {
          setChatMessages(prev => [
            ...prev,
            {
              id: `ai_${Date.now()}_${Math.random()}`,
              user: response.username,
              text: response.comment,
              color: '#818cf8',
              isSystem: false
            }
          ]);
        });
      }
    } catch (e) {
      console.error('Chat generation failed:', e);
    }
  };

  const handleAnalyzePosition = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const response = await analyzePosition(board);
      if (response) {
        setChatMessages(prev => [
          ...prev,
          {
            id: `analysis_${Date.now()}`,
            user: 'Position Analysis',
            text: response,
            color: '#34d399',
            isSystem: false
          }
        ]);
      }
    } catch (e) {
      console.error('Analysis failed:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReadyUp = (playerNum: 1 | 2) => {
    if (playerNum === 1) {
      const newReady = !isPlayer1Ready;
      setIsPlayer1Ready(newReady);
      if (newReady && isPlayer2Ready && player1 && player2) {
        setGameStarted(true);
      }
    } else {
      const newReady = !isPlayer2Ready;
      setIsPlayer2Ready(newReady);
      if (newReady && isPlayer1Ready && player1 && player2) {
        setGameStarted(true);
      }
    }
  };

  const playerIsWhite = player1?.id === user?.id;
  const isFlipped = !playerIsWhite;
  const isMyTurn = (playerIsWhite && turn === PieceColor.WHITE) || (!playerIsWhite && turn === PieceColor.BLACK);
  const isMyGame = player1?.id === user?.id || player2?.id === user?.id;

  return (
    <div className="min-h-screen bg-[#302e2b] text-white flex flex-col">
      <header className="bg-[#262421] border-b border-gray-800 p-4 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => navigate('/')} className="flex items-center space-x-2 hover:text-chess-accent transition">
          <ArrowLeft size={20} />
          <span>Exit</span>
        </button>

        <div className="flex items-center space-x-6">
          <div className="text-center hidden sm:block">
            <span className="text-sm text-gray-400">Room Code</span>
            <div className="font-mono font-bold text-lg">{roomId}</div>
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={copyRoomCode} className="bg-gray-700 hover:bg-gray-600 p-2 rounded transition flex items-center space-x-2 text-sm">
              <Share2 size={18} />
              {copied && <span className="text-xs">Copied!</span>}
            </button>

            <button onClick={() => setIsSoundEnabled(!isSoundEnabled)} className="hover:text-chess-accent transition">
              {isSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>

            <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded text-sm">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <Users size={16} />
              <span>{viewerCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </header>

        <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 max-w-7xl mx-auto w-full overflow-auto">
          <div className="flex-1 flex flex-col space-y-4">
            {!gameStarted ? (
              <div className="bg-[#262421] rounded-lg p-6 border border-gray-700">
                <h2 className="text-2xl font-bold mb-6">Waiting for players...</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#1a1a1a] rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <img src={player1?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} alt="Player 1" className="w-12 h-12 rounded-full" />
                      <div>
                        <div className="font-bold">{player1?.name || 'Waiting...'}</div>
                        <div className="text-xs text-gray-500">White</div>
                      </div>
                    </div>
                    {player1?.id === user?.id && (
                      <button onClick={() => handleReadyUp(1)} className={`w-full py-2 rounded-lg font-semibold transition ${isPlayer1Ready ? 'bg-green-600 hover:bg-green-700' : 'bg-chess-accent hover:bg-chess-accentHover'}`}>
                        {isPlayer1Ready ? '✓ Ready' : 'Ready Up'}
                      </button>
                    )}
                    {isPlayer1Ready && player1?.id !== user?.id && <div className="text-green-400 text-sm font-semibold">✓ Ready</div>}
                  </div>

                  <div className="bg-[#1a1a1a] rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <img src={player2?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=player2'} alt="Player 2" className="w-12 h-12 rounded-full" />
                      <div>
                        <div className="font-bold">{player2?.name || 'Waiting...'}</div>
                        <div className="text-xs text-gray-500">Black</div>
                      </div>
                    </div>
                    {player2?.id === user?.id && (
                      <button onClick={() => handleReadyUp(2)} className={`w-full py-2 rounded-lg font-semibold transition ${isPlayer2Ready ? 'bg-green-600 hover:bg-green-700' : 'bg-chess-accent hover:bg-chess-accentHover'}`}>
                        {isPlayer2Ready ? '✓ Ready' : 'Ready Up'}
                      </button>
                    )}
                    {isPlayer2Ready && player2?.id !== user?.id && <div className="text-green-400 text-sm font-semibold">✓ Ready</div>}
                  </div>
                </div>

                {!isMyGame && (
                  <button onClick={() => setPlayer2({ id: user?.id || '', name: user?.name || '', avatar: user?.avatar || '' })} className="w-full mt-6 bg-chess-accent hover:bg-chess-accentHover py-3 rounded-lg font-semibold transition">
                    Join as Black
                  </button>
                )}
              </div>
            ) : null}

            {gameStarted && (
              <div className="bg-[#262421] rounded-lg p-6 flex flex-col items-center">
                <div className="w-full mb-4">
                  <GameTimer initialSeconds={blackTime} isActive={gameStarted && turn === PieceColor.BLACK && !gameEnded} playerName={player2?.name || 'Black'} isCurrentTurn={turn === PieceColor.BLACK} />
                </div>

                <ChessBoard board={board} onMove={handleMove} turn={turn} isFlipped={isFlipped} disabled={!isMyTurn || gameEnded || !isMyGame} />

                <div className="w-full mt-4">
                  <GameTimer initialSeconds={whiteTime} isActive={gameStarted && turn === PieceColor.WHITE && !gameEnded} playerName={player1?.name || 'White'} isCurrentTurn={turn === PieceColor.WHITE} />
                </div>

                {gameEnded && (
                  <div className="mt-6 p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg text-center w-full border border-chess-accent">
                    <Trophy className="inline text-yellow-500 mb-4" size={40} />
                    <h3 className="text-3xl font-bold mb-2">{winner === 'white' ? '♔ White Wins!' : '♚ Black Wins!'}</h3>
                    <p className="text-gray-400 mb-6">Game Over</p>
                    <button onClick={() => navigate('/')} className="bg-chess-accent hover:bg-chess-accentHover px-8 py-3 rounded-lg font-semibold transition">
                      Back to Home
                    </button>
                  </div>
                )}

                {gameStarted && !gameEnded && (
                  <button onClick={handleAnalyzePosition} disabled={isAnalyzing} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-2 rounded-lg font-semibold transition flex items-center justify-center space-x-2">
                    <Sparkles size={18} />
                    <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Position'}</span>
                  </button>
                )}
              </div>
            )}

            {gameStarted && (
              <div className="bg-[#262421] rounded-lg p-4 border border-gray-700">
                <h3 className="font-bold mb-3">Move History</h3>
                <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                  {moveHistory.map((move, idx) => (
                    <div key={idx} className="bg-[#1a1a1a] p-2 rounded text-sm text-center font-mono">
                      {move}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:w-80 flex-shrink-0">
            <StreamSidebar 
              chatMessages={chatMessages} 
              onSendMessage={(msg) => setChatMessages(prev => [...prev, {
                id: `user_${Date.now()}`,
                user: user?.name || 'You',
                text: msg,
                color: '#6366f1',
                isSystem: false
              }])}
              moveHistory={moveHistory}
              viewerCount={viewerCount}
            />
          </div>
        </div>
    </div>
  );
};

export default GameRoom;
