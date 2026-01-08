export enum Player {
  X = 'X',
  O = 'O',
}

export type CellValue = Player | null;

export type BoardState = CellValue[][];

export interface Position {
  row: number;
  col: number;
}

export interface GameStats {
  wins: number;
  losses: number;
  draws: number;
}