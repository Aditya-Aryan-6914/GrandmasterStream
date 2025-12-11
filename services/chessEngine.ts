import { Piece, PieceColor, PieceType } from '../types';

// Check if a square is under attack by opponent
export const isSquareUnderAttack = (
  board: (Piece | null)[][],
  row: number,
  col: number,
  byColor: PieceColor
): boolean => {
  // Check all opponent pieces for possible attacks on this square
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === byColor) {
        if (canPieceMoveTo(board, r, c, row, col)) {
          return true;
        }
      }
    }
  }
  return false;
};

// Get all legal moves for a piece
export const getLegalMoves = (
  board: (Piece | null)[][],
  row: number,
  col: number
): Array<[number, number]> => {
  const piece = board[row][col];
  if (!piece) return [];

  const legalMoves: Array<[number, number]> = [];
  const moves = getPieceMoveSquares(board, row, col, piece);

  // Filter out moves that would leave king in check
  for (const [toRow, toCol] of moves) {
    const testBoard = board.map(r => [...r]);
    testBoard[toRow][toCol] = piece;
    testBoard[row][col] = null;

    const myColor = piece.color;
    const opponentColor = myColor === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
    
    // Find my king
    let kingRow = -1, kingCol = -1;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = testBoard[r][c];
        if (p && p.type === PieceType.KING && p.color === myColor) {
          kingRow = r;
          kingCol = c;
          break;
        }
      }
      if (kingRow !== -1) break;
    }

    // Check if king would be in check
    if (kingRow === -1 || !isSquareUnderAttack(testBoard, kingRow, kingCol, opponentColor)) {
      legalMoves.push([toRow, toCol]);
    }
  }

  return legalMoves;
};

// Get possible move squares for a piece (without check validation)
export const getPieceMoveSquares = (
  board: (Piece | null)[][],
  row: number,
  col: number,
  piece: Piece
): Array<[number, number]> => {
  const moves: Array<[number, number]> = [];

  const addMove = (r: number, c: number) => {
    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const target = board[r][c];
      if (!target || target.color !== piece.color) {
        moves.push([r, c]);
      }
      return !target || target.color !== piece.color;
    }
    return false;
  };

  const addDirection = (startRow: number, startCol: number, directions: Array<[number, number]>, maxSteps = 8) => {
    for (const [dr, dc] of directions) {
      let r = startRow + dr;
      let c = startCol + dc;
      let steps = 0;
      while (steps < maxSteps) {
        if (r < 0 || r >= 8 || c < 0 || c >= 8) break;
        const target = board[r][c];
        if (target && target.color === piece.color) break;
        moves.push([r, c]);
        if (target && target.color !== piece.color) break;
        r += dr;
        c += dc;
        steps++;
      }
    }
  };

  switch (piece.type) {
    case PieceType.PAWN: {
      const direction = piece.color === PieceColor.WHITE ? -1 : 1;
      const startRow = piece.color === PieceColor.WHITE ? 6 : 1;
      const newRow = row + direction;

      // Forward move
      if (newRow >= 0 && newRow < 8 && !board[newRow][col]) {
        moves.push([newRow, col]);

        // Double move from start
        if (row === startRow && !board[row + 2 * direction]?.[col]) {
          moves.push([row + 2 * direction, col]);
        }
      }

      // Captures
      for (const dc of [-1, 1]) {
        const captureRow = row + direction;
        const captureCol = col + dc;
        if (captureRow >= 0 && captureRow < 8 && captureCol >= 0 && captureCol < 8) {
          const target = board[captureRow][captureCol];
          if (target && target.color !== piece.color) {
            moves.push([captureRow, captureCol]);
          }
        }
      }
      break;
    }

    case PieceType.KNIGHT: {
      const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      for (const [dr, dc] of knightMoves) {
        addMove(row + dr, col + dc);
      }
      break;
    }

    case PieceType.BISHOP: {
      addDirection(row, col, [[-1, -1], [-1, 1], [1, -1], [1, 1]]);
      break;
    }

    case PieceType.ROOK: {
      addDirection(row, col, [[-1, 0], [1, 0], [0, -1], [0, 1]]);
      break;
    }

    case PieceType.QUEEN: {
      addDirection(row, col, [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
      ]);
      break;
    }

    case PieceType.KING: {
      const kingMoves = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
      ];
      for (const [dr, dc] of kingMoves) {
        addMove(row + dr, col + dc);
      }
      break;
    }
  }

  return moves;
};

// Check if a piece can move to a specific square
export const canPieceMoveTo = (
  board: (Piece | null)[][],
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): boolean => {
  const piece = board[fromRow][fromCol];
  if (!piece) return false;

  const moves = getPieceMoveSquares(board, fromRow, fromCol, piece);
  return moves.some(([r, c]) => r === toRow && c === toCol);
};

// Convert position to chess notation
export const positionToNotation = (row: number, col: number): string => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  return `${files[col]}${8 - row}`;
};

// Get piece value for exchange calculation
export const getPieceValue = (type: PieceType): number => {
  switch (type) {
    case PieceType.PAWN: return 1;
    case PieceType.KNIGHT: return 3;
    case PieceType.BISHOP: return 3;
    case PieceType.ROOK: return 5;
    case PieceType.QUEEN: return 9;
    case PieceType.KING: return 0; // King not captured
    default: return 0;
  }
};
