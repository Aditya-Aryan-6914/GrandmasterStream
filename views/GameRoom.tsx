import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChessBoard from '../components/ChessBoard';
import StreamSidebar from '../components/StreamSidebar';
import { Piece, PieceColor, PieceType, ChatMessage } from '../types';
import { INITIAL_BOARD_LAYOUT } from '../constants';
import { generateStreamChat, analyzePosition } from '../services/geminiService';
import { ArrowLeft, Share2, Sparkles, Trophy } from 'lucide-react';

const GameRoom: React.FC = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState<(Piece | null)[][]>([]);
  const [turn, setTurn] = useState<PieceColor>(PieceColor.WHITE);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [viewerCount, setViewerCount] = useState(1204);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize board logic
  useEffect(() => {
    // Transform simple layout to full objects
    const initialBoard: (Piece | null)[][] = INITIAL_BOARD_LAYOUT.map((row, rIndex) => 
        row.map((char, cIndex) => {
            if (!char) return null;
            const color = char === char.toUpperCase() ? PieceColor.WHITE : PieceColor.BLACK;
            const type = char.toLowerCase() as PieceType;
            return { color, type };
        })
    );
    setBoard(initialBoard);
    
    // Welcome message
    setChatMessages([
        { id: 'sys1', user: 'System', text: `Welcome to Room ${roomId}! The match is starting.`, color: '#fbbf24', isSystem: true },
        { id: 'sys2', user: 'GrandmasterBot', text: 'Good luck to both players!', color: '#818cf8', isSystem: true }
    ]);

    // Simulate viewers fluctuation
    const interval = setInterval(() => {
        setViewerCount(prev => prev + Math.floor(Math.random() * 10) - 4);
    }, 3000);

    return () => clearInterval(interval);
  }, [roomId]);

  const handleMove = async (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    // Basic validation: Is it the right turn?
    const piece = board[fromRow][fromCol];
    if (!piece || piece.color !== turn) return;

    // TODO: Add full chess validation here or via library. 
    // For this demo, we allow most moves to demonstrate the UI/Gemini features without a heavy chess engine.
    
    // Execute Move (Optimistic UI)
    const newBoard = board.map(r => [...r]);
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;
    
    // Check for pawn promotion (simple auto-queen)
    if (piece.type === PieceType.PAWN && (toRow === 0 || toRow === 7)) {
        newBoard[toRow][toCol] = { ...piece, type: PieceType.QUEEN };
    }

    setBoard(newBoard);
    
    // Record Move (Simple notation)
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const notation = `${piece.type.toUpperCase() !== 'P' ? piece.type.toUpperCase() : ''}${files[toCol]}${8 - toRow}`;
    setMoveHistory(prev => [...prev, notation]);
    
    // Switch Turn
    setTurn(turn === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE);

    // Trigger AI Chat Reaction
    triggerAIChat(newBoard, notation);
    
    // Clear old analysis
    setAnalysis(null);
  };

  const triggerAIChat = async (currentBoard: (Piece | null)[][], lastMove: string) => {
    // 50% chance to generate chat comments on a move
    if (Math.random() > 0.1) {
       const responses = await generateStreamChat(currentBoard, lastMove);
       const newMessages = responses.map(r => ({
           id: Math.random().toString(36).substr(2, 9),
           user: r.username,
           text: r.comment,
           color: r.sentiment === 'hype' ? '#f472b6' : r.sentiment === 'critical' ? '#ef4444' : '#60a5fa' 
       }));
       
       // Add messages one by one with slight delay for realism
       newMessages.forEach((msg, i) => {
           setTimeout(() => {
               setChatMessages(prev => [...prev, msg]);
           }, i * 1500 + 500);
       });
    }
  };

  const handleSendMessage = (text: string) => {
      setChatMessages(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          user: 'You',
          text,
          color: '#ffffff'
      }]);
  };

  const handleAnalyze = async () => {
      if (isAnalyzing) return;
      setIsAnalyzing(true);
      const result = await analyzePosition(board);
      setAnalysis(result);
      setIsAnalyzing(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#302e2b] overflow-hidden">
      {/* Main Game Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="h-14 border-b border-gray-700 flex items-center justify-between px-4 bg-[#262421] z-10">
            <div className="flex items-center space-x-4">
                <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition">
                    <ArrowLeft size={24} />
                </button>
                <div className="flex flex-col">
                    <span className="font-bold text-gray-200">Room #{roomId}</span>
                    <span className="text-xs text-gray-500">Blitz • 5 min</span>
                </div>
            </div>
            <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded text-sm font-medium transition"
                    onClick={() => navigator.clipboard.writeText(roomId || '')}
                >
                    <Share2 size={16} />
                    <span>Share Code</span>
                </button>
            </div>
        </div>

        {/* Board Container */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8 overflow-auto relative">
            <div className="w-full max-w-[80vh] flex flex-col space-y-4">
                {/* Opponent Info */}
                <div className="flex items-center justify-between text-gray-300">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded bg-gray-600 flex items-center justify-center text-lg font-bold">
                            OP
                        </div>
                        <div>
                            <div className="font-semibold">Opponent</div>
                            <div className="text-xs text-gray-500">Rating: 1450</div>
                        </div>
                    </div>
                    <div className="bg-gray-800 px-3 py-1 rounded text-mono font-bold">
                        05:00
                    </div>
                </div>

                {/* The Board */}
                <ChessBoard 
                    board={board} 
                    onMove={handleMove} 
                    turn={turn} 
                />

                {/* Player Info */}
                <div className="flex items-center justify-between text-gray-300">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded bg-chess-accent flex items-center justify-center text-lg font-bold text-white">
                            ME
                        </div>
                        <div>
                            <div className="font-semibold">You</div>
                            <div className="text-xs text-gray-500">Rating: 1520</div>
                        </div>
                    </div>
                     <div className="bg-gray-700 px-3 py-1 rounded text-mono font-bold text-white">
                        04:55
                    </div>
                </div>
            </div>

            {/* AI Analysis Overlay */}
            {analysis && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-md border border-chess-accent/50 p-4 rounded-xl shadow-2xl max-w-md w-full animate-in slide-in-from-bottom-5">
                    <div className="flex items-start space-x-3">
                        <Sparkles className="text-chess-accent shrink-0 mt-1" size={20} />
                        <div>
                            <h4 className="font-bold text-chess-accent mb-1">Coach Gemini Analysis</h4>
                            <p className="text-sm text-gray-200 leading-relaxed">{analysis}</p>
                        </div>
                        <button onClick={() => setAnalysis(null)} className="text-gray-500 hover:text-white">
                            <ArrowLeft size={16} className="rotate-180" />
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* Footer Actions */}
        <div className="h-16 border-t border-gray-700 bg-[#262421] flex items-center justify-center space-x-4 px-4">
             <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded shadow-lg transition-all disabled:opacity-50"
             >
                {isAnalyzing ? (
                    <span className="animate-spin mr-2">⟳</span>
                ) : (
                    <Sparkles size={18} />
                )}
                <span>Ask AI Coach</span>
             </button>
        </div>
      </div>

      {/* Sidebar */}
      <StreamSidebar 
        chatMessages={chatMessages} 
        onSendMessage={handleSendMessage}
        moveHistory={moveHistory}
        viewerCount={viewerCount}
      />
    </div>
  );
};

export default GameRoom;