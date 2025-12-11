export enum PieceType {
  PAWN = 'p',
  KNIGHT = 'n',
  BISHOP = 'b',
  ROOK = 'r',
  QUEEN = 'q',
  KING = 'k',
}

export enum PieceColor {
  WHITE = 'w',
  BLACK = 'b',
}

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export interface BoardSquare {
  piece: Piece | null;
  position: string; // e.g., "a1", "h8"
  row: number;
  col: number;
}

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  color?: string;
  isSystem?: boolean;
}

export interface GameState {
  board: (Piece | null)[][];
  turn: PieceColor;
  moveHistory: string[];
  isCheck: boolean;
  isCheckmate: boolean;
  capturedWhite: PieceType[];
  capturedBlack: PieceType[];
}