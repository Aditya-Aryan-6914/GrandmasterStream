import React, { useState, useMemo } from 'react';
import { Piece, PieceColor, PieceType } from '../types';
import { PIECE_SVGS } from '../constants';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getLegalMoves } from '../services/chessEngine';

interface ChessBoardProps {
  board: (Piece | null)[][];
  onMove: (fromRow: number, fromCol: number, toRow: number, toCol: number) => void;
  turn: PieceColor;
  isFlipped?: boolean;
  disabled?: boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ board, onMove, turn, isFlipped = false, disabled = false }) => {
  const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null);
  
  const legalMoves = useMemo(() => {
    if (!selectedSquare) return [];
    return getLegalMoves(board, selectedSquare.row, selectedSquare.col);
  }, [selectedSquare, board]);

  const handleSquareClick = (row: number, col: number) => {
    if (disabled) return;

    const piece = board[row][col];

    // If a square is already selected
    if (selectedSquare) {
      // If clicking the same square, deselect
      if (selectedSquare.row === row && selectedSquare.col === col) {
        setSelectedSquare(null);
        return;
      }

      // Check if target square is a legal move
      const isLegalMove = legalMoves.some(([r, c]) => r === row && c === col);
      
      if (isLegalMove) {
        // Execute the move
        onMove(selectedSquare.row, selectedSquare.col, row, col);
        setSelectedSquare(null);
      } else if (piece && piece.color === turn) {
        // Switch selection to another friendly piece
        setSelectedSquare({ row, col });
      } else {
        // Invalid move, deselect
        setSelectedSquare(null);
      }
    } else {
      // Select a piece if it belongs to the current turn
      if (piece && piece.color === turn) {
        setSelectedSquare({ row, col });
      }
    }
  };

  const renderSquare = (row: number, col: number) => {
    const piece = board[row][col];
    const isDark = (row + col) % 2 === 1;
    const isSelected = selectedSquare?.row === row && selectedSquare?.col === col;
    const isLegalMoveSquare = legalMoves.some(([r, c]) => r === row && c === col);
    
    // Notation labels
    const isBottomRow = row === 7;
    const isRightCol = col === 7;
    const file = String.fromCharCode(97 + col); // a-h
    const rank = 8 - row; // 1-8

    return (
      <div
        key={`${row}-${col}`}
        onClick={() => handleSquareClick(row, col)}
        className={twMerge(
          "relative w-full pb-[100%] cursor-pointer transition-all duration-100",
          isDark ? "bg-chess-dark" : "bg-chess-light",
          isSelected && "ring-4 ring-yellow-400 ring-inset",
          isLegalMoveSquare && !piece && "after:content-[''] after:absolute after:inset-0 after:bg-yellow-400/20",
          isLegalMoveSquare && piece && "ring-2 ring-red-400 ring-inset",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center p-1">
            {piece && (
                <div className="w-full h-full transform transition-transform duration-200 hover:scale-110">
                    {PIECE_SVGS[`${piece.color}${piece.type}`]}
                </div>
            )}
        </div>

        {/* Legal move indicator - dot in center */}
        {isLegalMoveSquare && !piece && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-3 h-3 bg-yellow-400 rounded-full opacity-70"></div>
          </div>
        )}

        {/* Capture indicator - ring */}
        {isLegalMoveSquare && piece && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-5 h-5 border-2 border-red-400 rounded-full opacity-70"></div>
          </div>
        )}

        {/* Coordinates */}
        {isBottomRow && (
             <span className={clsx("absolute bottom-0.5 right-1 text-[10px] font-bold", isDark ? "text-chess-light" : "text-chess-dark")}>
                 {file}
             </span>
        )}
        {col === 0 && (
             <span className={clsx("absolute top-0.5 left-1 text-[10px] font-bold", isDark ? "text-chess-light" : "text-chess-dark")}>
                 {rank}
             </span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-[600px] aspect-square bg-[#302e2b] p-1 rounded-sm shadow-2xl select-none">
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full border-2 border-[#302e2b]">
        {board.map((row, rIndex) =>
          row.map((_, cIndex) => renderSquare(rIndex, cIndex))
        )}
      </div>
    </div>
  );
};

export default ChessBoard;