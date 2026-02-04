import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useColorScheme,
  SafeAreaView,
  Modal,
  Platform,
} from 'react-native';
import { useSudokuGame } from '@/hooks/useSudokuGame';
import { SudokuGrid } from '@/components/SudokuGrid';
import { NumberPad } from '@/components/NumberPad';
import { GameControls } from '@/components/GameControls';
import { GameInfo } from '@/components/GameInfo';
import { WinModal } from '@/components/WinModal';
import { Difficulty } from '@/utils/sudoku';
import { Play } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function GameScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    gameState,
    cells,
    startNewGame,
    selectCell,
    placeNumber,
    eraseCell,
    toggleNotesMode,
    useHint,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useSudokuGame();

  const [showDifficultyModal, setShowDifficultyModal] = useState(true);
  const [showWinModal, setShowWinModal] = useState(false);

  const highlightNumber =
    gameState.selectedCell && gameState.board[gameState.selectedCell.row]
      ? gameState.board[gameState.selectedCell.row][gameState.selectedCell.col]
      : null;

  const handleStartGame = (difficulty: Difficulty) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    startNewGame(difficulty);
    setShowDifficultyModal(false);
  };

  const handleNewGame = () => {
    setShowWinModal(false);
    setShowDifficultyModal(true);
  };

  useEffect(() => {
    if (gameState.isComplete) {
      setShowWinModal(true);
    }
  }, [gameState.isComplete]);

  if (showDifficultyModal) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          isDark ? styles.containerDark : styles.containerLight,
        ]}>
        <View style={styles.difficultyModal}>
          <Text
            style={[
              styles.modalTitle,
              isDark ? styles.modalTitleDark : styles.modalTitleLight,
            ]}>
            Choose Difficulty
          </Text>

          <View style={styles.difficultyButtons}>
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
              <TouchableOpacity
                key={diff}
                style={[
                  styles.difficultyButton,
                  isDark
                    ? styles.difficultyButtonDark
                    : styles.difficultyButtonLight,
                ]}
                onPress={() => handleStartGame(diff)}>
                <Text
                  style={[
                    styles.difficultyButtonText,
                    isDark
                      ? styles.difficultyButtonTextDark
                      : styles.difficultyButtonTextLight,
                  ]}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </Text>
                <Text
                  style={[
                    styles.difficultyDescription,
                    isDark
                      ? styles.difficultyDescriptionDark
                      : styles.difficultyDescriptionLight,
                  ]}>
                  {diff === 'easy'
                    ? '30 cells removed'
                    : diff === 'medium'
                      ? '40 cells removed'
                      : '50 cells removed'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        isDark ? styles.containerDark : styles.containerLight,
      ]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              isDark ? styles.titleDark : styles.titleLight,
            ]}>
            Sudoku
          </Text>
          <TouchableOpacity
            style={[
              styles.newGameButton,
              isDark ? styles.newGameButtonDark : styles.newGameButtonLight,
            ]}
            onPress={handleNewGame}>
            <Play size={16} color={isDark ? '#60A5FA' : '#3B82F6'} />
            <Text
              style={[
                styles.newGameButtonText,
                isDark
                  ? styles.newGameButtonTextDark
                  : styles.newGameButtonTextLight,
              ]}>
              New
            </Text>
          </TouchableOpacity>
        </View>

        <GameInfo
          timer={gameState.timer}
          mistakes={gameState.mistakes}
          maxMistakes={gameState.maxMistakes}
        />

        <View style={styles.gridContainer}>
          <SudokuGrid
            cells={cells}
            selectedCell={gameState.selectedCell}
            onCellPress={selectCell}
            highlightNumber={highlightNumber}
          />
        </View>

        <View style={styles.controlsContainer}>
          <GameControls
            notesMode={gameState.notesMode}
            onToggleNotes={toggleNotesMode}
            hintsRemaining={gameState.hintsRemaining}
            onUseHint={useHint}
            canUndo={canUndo}
            onUndo={undo}
            canRedo={canRedo}
            onRedo={redo}
          />
        </View>

        <View style={styles.padContainer}>
          <NumberPad
            onNumberPress={placeNumber}
            onErasePress={eraseCell}
            disabled={!gameState.selectedCell}
          />
        </View>
      </ScrollView>

      <WinModal
        visible={showWinModal}
        timer={gameState.timer}
        mistakes={gameState.mistakes}
        difficulty={gameState.difficulty}
        onNewGame={handleNewGame}
        onClose={() => setShowWinModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: '#F9FAFB',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  scrollContent: {
    padding: 16,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
  },
  titleLight: {
    color: '#1F2937',
  },
  titleDark: {
    color: '#F9FAFB',
  },
  newGameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  newGameButtonLight: {
    backgroundColor: '#DBEAFE',
  },
  newGameButtonDark: {
    backgroundColor: '#1E3A5F',
  },
  newGameButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  newGameButtonTextLight: {
    color: '#3B82F6',
  },
  newGameButtonTextDark: {
    color: '#60A5FA',
  },
  gridContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  controlsContainer: {
    paddingHorizontal: 4,
  },
  padContainer: {
    paddingHorizontal: 4,
    paddingBottom: 20,
  },
  difficultyModal: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 32,
  },
  modalTitle: {
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
  },
  modalTitleLight: {
    color: '#1F2937',
  },
  modalTitleDark: {
    color: '#F9FAFB',
  },
  difficultyButtons: {
    gap: 16,
  },
  difficultyButton: {
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  difficultyButtonLight: {
    backgroundColor: '#FFFFFF',
  },
  difficultyButtonDark: {
    backgroundColor: '#374151',
  },
  difficultyButtonText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  difficultyButtonTextLight: {
    color: '#1F2937',
  },
  difficultyButtonTextDark: {
    color: '#F9FAFB',
  },
  difficultyDescription: {
    fontSize: 14,
  },
  difficultyDescriptionLight: {
    color: '#6B7280',
  },
  difficultyDescriptionDark: {
    color: '#9CA3AF',
  },
});
