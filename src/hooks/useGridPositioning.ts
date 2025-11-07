// Grid-based positioning system for booth placement
// Grid: 120 columns x 80 rows = 9,600 cells
// Cell size: 10x10 pixels
// Canvas: 1200x800 pixels

export const GRID_COLS = 120;
export const GRID_ROWS = 80;
export const CELL_SIZE = 10;
export const CANVAS_WIDTH = 1200;
export const CANVAS_HEIGHT = 800;

export interface GridPosition {
  row: number; // 0-79
  col: number; // 0-119
}

export interface CoordinatePosition {
  x: number;
  y: number;
}

/**
 * Convert grid position to X/Y coordinates
 */
export const gridToCoordinates = (gridPos: GridPosition): CoordinatePosition => {
  return {
    x: gridPos.col * CELL_SIZE,
    y: gridPos.row * CELL_SIZE,
  };
};

/**
 * Convert X/Y coordinates to grid position
 */
export const coordinatesToGrid = (coords: CoordinatePosition): GridPosition => {
  return {
    row: Math.floor(coords.y / CELL_SIZE),
    col: Math.floor(coords.x / CELL_SIZE),
  };
};

/**
 * Get a human-readable label for a grid position
 */
export const getGridLabel = (gridPos: GridPosition): string => {
  // For rows beyond Z (26), use AA, AB, AC pattern like Excel
  let rowLabel = '';
  let row = gridPos.row;
  while (row >= 0) {
    rowLabel = String.fromCharCode(65 + (row % 26)) + rowLabel;
    row = Math.floor(row / 26) - 1;
  }
  const colLabel = (gridPos.col + 1).toString(); // 1-120
  return `Row ${rowLabel}, Column ${colLabel}`;
};

/**
 * Check if a grid position is valid
 */
export const isValidGridPosition = (gridPos: GridPosition): boolean => {
  return (
    gridPos.row >= 0 &&
    gridPos.row < GRID_ROWS &&
    gridPos.col >= 0 &&
    gridPos.col < GRID_COLS
  );
};

/**
 * Find the next available grid cell
 */
export const findNextAvailableCell = (
  occupiedCells: GridPosition[]
): GridPosition | null => {
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const isOccupied = occupiedCells.some(
        (cell) => cell.row === row && cell.col === col
      );
      if (!isOccupied) {
        return { row, col };
      }
    }
  }
  return null; // All cells occupied
};

/**
 * Get multiple positions starting from a cell (for bulk moves)
 */
export const getBulkGridPositions = (
  startCell: GridPosition,
  count: number,
  occupiedCells: GridPosition[]
): GridPosition[] => {
  const positions: GridPosition[] = [];
  let row = startCell.row;
  let col = startCell.col;

  for (let i = 0; i < count; i++) {
    positions.push({ row, col });
    col++;
    if (col >= GRID_COLS) {
      col = 0;
      row++;
      if (row >= GRID_ROWS) {
        break; // Can't fit all booths
      }
    }
  }

  return positions;
};

/**
 * Check if a zone is valid
 */
export const isValidZone = (zone: {
  startRow: number;
  startCol: number;
  rows: number;
  cols: number;
}): boolean => {
  return (
    zone.startRow >= 0 &&
    zone.startRow + zone.rows <= GRID_ROWS &&
    zone.startCol >= 0 &&
    zone.startCol + zone.cols <= GRID_COLS
  );
};

/**
 * Get position preset coordinates
 */
export const getPresetPosition = (preset: string): GridPosition => {
  const presets: Record<string, GridPosition> = {
    "top-left": { row: 0, col: 0 },
    "top-center": { row: 0, col: 59 },
    "top-right": { row: 0, col: 119 },
    "middle-left": { row: 39, col: 0 },
    center: { row: 39, col: 59 },
    "middle-right": { row: 39, col: 119 },
    "bottom-left": { row: 79, col: 0 },
    "bottom-center": { row: 79, col: 59 },
    "bottom-right": { row: 79, col: 119 },
  };
  return presets[preset] || { row: 0, col: 0 };
};
