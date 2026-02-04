import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Cell } from '@/utils/sudoku';

interface SudokuGridProps {
  cells: Cell[];
  selectedCell: { row: number; col: number } | null;
  onCellPress: (row: number, col: number) => void;
  highlightNumber: number | null;
}

export function SudokuGrid({
  cells,
  selectedCell,
  onCellPress,
  highlightNumber,
}: SudokuGridProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getCell = (row: number, col: number) => {
    return cells.find((c) => c.row === row && c.col === col);
  };

  const renderCell = (row: number, col: number) => {
    const cell = getCell(row, col);
    if (!cell) return null;

    const isSelected =
      selectedCell?.row === row && selectedCell?.col === col;
    const isHighlighted =
      highlightNumber !== null && cell.value === highlightNumber;
    const isSameRow = selectedCell?.row === row;
    const isSameCol = selectedCell?.col === col;
    const isSameBlock =
      selectedCell &&
      Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
      Math.floor(selectedCell.col / 3) === Math.floor(col / 3);

    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={[
          styles.cell,
          isDark ? styles.cellDark : styles.cellLight,
          col % 3 === 2 && col !== 8 && styles.cellRightBorder,
          row % 3 === 2 && row !== 8 && styles.cellBottomBorder,
          isSelected && (isDark ? styles.cellSelectedDark : styles.cellSelectedLight),
          (isSameRow || isSameCol || isSameBlock) &&
            !isSelected &&
            (isDark ? styles.cellRelatedDark : styles.cellRelatedLight),
          isHighlighted &&
            !isSelected &&
            (isDark ? styles.cellHighlightedDark : styles.cellHighlightedLight),
          cell.isConflict && styles.cellConflict,
        ]}
        onPress={() => onCellPress(row, col)}>
        {cell.value !== null ? (
          <Text
            style={[
              styles.cellText,
              isDark ? styles.cellTextDark : styles.cellTextLight,
              cell.isInitial &&
                (isDark ? styles.cellTextInitialDark : styles.cellTextInitialLight),
              cell.isConflict && styles.cellTextConflict,
            ]}>
            {cell.value}
          </Text>
        ) : cell.notes.size > 0 ? (
          <View style={styles.notesContainer}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Text
                key={num}
                style={[
                  styles.noteText,
                  isDark ? styles.noteTextDark : styles.noteTextLight,
                  !cell.notes.has(num) && styles.noteTextHidden,
                ]}>
                {num}
              </Text>
            ))}
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.grid,
        isDark ? styles.gridDark : styles.gridLight,
      ]}>
      {Array.from({ length: 9 }, (_, row) => (
        <View key={row} style={styles.row}>
          {Array.from({ length: 9 }, (_, col) => renderCell(row, col))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    borderWidth: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gridLight: {
    borderColor: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  gridDark: {
    borderColor: '#E5E7EB',
    backgroundColor: '#111827',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
  },
  cellLight: {
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  cellDark: {
    borderColor: '#374151',
    backgroundColor: '#111827',
  },
  cellRightBorder: {
    borderRightWidth: 2,
    borderRightColor: '#4B5563',
  },
  cellBottomBorder: {
    borderBottomWidth: 2,
    borderBottomColor: '#4B5563',
  },
  cellSelectedLight: {
    backgroundColor: '#DBEAFE',
  },
  cellSelectedDark: {
    backgroundColor: '#1E3A5F',
  },
  cellRelatedLight: {
    backgroundColor: '#F3F4F6',
  },
  cellRelatedDark: {
    backgroundColor: '#1F2937',
  },
  cellHighlightedLight: {
    backgroundColor: '#FEF3C7',
  },
  cellHighlightedDark: {
    backgroundColor: '#422006',
  },
  cellConflict: {
    backgroundColor: '#FEE2E2',
  },
  cellText: {
    fontSize: 20,
    fontWeight: '600',
  },
  cellTextLight: {
    color: '#1F2937',
  },
  cellTextDark: {
    color: '#F9FAFB',
  },
  cellTextInitialLight: {
    color: '#1F2937',
    fontWeight: '800',
  },
  cellTextInitialDark: {
    color: '#E5E7EB',
    fontWeight: '800',
  },
  cellTextConflict: {
    color: '#DC2626',
  },
  notesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
    padding: 2,
  },
  noteText: {
    fontSize: 8,
    width: '33.33%',
    textAlign: 'center',
  },
  noteTextLight: {
    color: '#6B7280',
  },
  noteTextDark: {
    color: '#9CA3AF',
  },
  noteTextHidden: {
    opacity: 0,
  },
});
