import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PixelButton } from '../components/ui/pixel-button';
import { ArrowLeft } from 'lucide-react';

const wordSearchData = {
  words: [
    { word: 'SOLAR', clue: 'Energy from the sun.' },
    { word: 'REUSE', clue: 'Use an item more than once.' },
    { word: 'REDUCE', clue: 'Make smaller or use less.' },
    { word: 'WATER', clue: 'H2O, essential for life.' },
    { word: 'FOREST', clue: 'A large area of trees.' },
    { word: 'ENERGY', clue: 'Power from physical resources.' },
    { word: 'EARTH', clue: 'Our home planet.' },
    { word: 'GREEN', clue: 'The color of nature; eco-friendly.' },
    { word: 'OCEAN', clue: 'A very large expanse of sea.' },
    { word: 'PLANT', clue: 'A living organism like a tree or flower.' },
  ],
};

const gridSize = 10;
const initialHintCount = 10;

interface Cell {
  char: string;
  x: number;
  y: number;
  isSelecting: boolean;
  isFound: boolean;
  isHint: boolean;
}

interface PlacedWord {
  word: string;
  startX: number;
  startY: number;
  dir: { x: number; y: number };
}

const SVG_NS = 'http://www.w3.org/2000/svg';

// Styling
const gradientTextClass =
  'bg-gradient-to-r from-emerald-500 to-sky-600 bg-clip-text text-transparent';
const buttonBaseClass =
  'w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300';

const WordSearchGame: React.FC = () => {
  const navigate = useNavigate();
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [clues, setClues] = useState<{ word: string; clue: string }[]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [hintCount, setHintCount] = useState(initialHintCount);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState<Cell[]>([]);
  const [messageText, setMessageText] = useState('');
  const [messageColorClass, setMessageColorClass] = useState('');
  const [currentSelectionText, setCurrentSelectionText] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  const gridContainerRef = useRef<HTMLDivElement>(null);
  const lineSvgRef = useRef<SVGSVGElement>(null);

  const shuffleArray = useCallback((array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }, []);

  const createEmptyGrid = useCallback(() => {
    const newGrid: Cell[][] = Array.from({ length: gridSize }, (_, y) =>
      Array.from({ length: gridSize }, (_, x) => ({
        char: '',
        x,
        y,
        isSelecting: false,
        isFound: false,
        isHint: false,
      }))
    );
    setGrid(newGrid);
    return newGrid;
  }, []);

  const canPlaceWord = useCallback(
    (
      word: string,
      startX: number,
      startY: number,
      dir: { x: number; y: number },
      currentGrid: Cell[][]
    ) => {
      for (let i = 0; i < word.length; i++) {
        const x = startX + i * dir.x;
        const y = startY + i * dir.y;
        if (
          x < 0 ||
          x >= gridSize ||
          y < 0 ||
          y >= gridSize ||
          (currentGrid[y][x].char !== '' &&
            currentGrid[y][x].char !== word[i])
        ) {
          return false;
        }
      }
      return true;
    },
    []
  );

  const deepCloneGrid = (grid: Cell[][]): Cell[][] =>
    grid.map(row => row.map(cell => ({ ...cell })));

  const placeWordsInGrid = useCallback(
    (currentWords: string[], currentGrid: Cell[][]) => {
      const horizontalDirections = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
      ];
      const verticalDirections = [
        { x: 0, y: 1 },
        { x: 0, y: -1 },
      ];
      const diagonalDirections = [
        { x: 1, y: 1 },
        { x: -1, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: 1 },
      ];

      let shuffledWords = [...currentWords];
      shuffleArray(shuffledWords);

      const wordsWithDirections: { word: string; type: string }[] = [];
      shuffledWords.forEach((word, index) => {
        if (index < 3) {
          wordsWithDirections.push({ word, type: 'horizontal' });
        } else if (index < 7) {
          wordsWithDirections.push({ word, type: 'vertical' });
        } else {
          wordsWithDirections.push({ word, type: 'diagonal' });
        }
      });
      wordsWithDirections.sort((a, b) => b.word.length - a.word.length);

      const newPlacedWords: PlacedWord[] = [];
      const tempGrid = deepCloneGrid(currentGrid);

      for (const wordObj of wordsWithDirections) {
        const { word, type } = wordObj;
        let directionsPool;
        if (type === 'horizontal') directionsPool = horizontalDirections;
        else if (type === 'vertical') directionsPool = verticalDirections;
        else directionsPool = diagonalDirections;

        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 200) {
          const dir =
            directionsPool[
              Math.floor(Math.random() * directionsPool.length)
            ];
          const startX = Math.floor(Math.random() * gridSize);
          const startY = Math.floor(Math.random() * gridSize);

          if (canPlaceWord(word, startX, startY, dir, tempGrid)) {
            for (let i = 0; i < word.length; i++) {
              tempGrid[startY + i * dir.y][startX + i * dir.x].char =
                word[i];
            }
            newPlacedWords.push({ word, startX, startY, dir });
            placed = true;
          }
          attempts++;
        }
      }
      setGrid(tempGrid);
      setPlacedWords(newPlacedWords);
      return tempGrid;
    },
    [shuffleArray, canPlaceWord]
  );

  const fillEmptyCells = useCallback((currentGrid: Cell[][]) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const newGrid = currentGrid.map(row =>
      row.map(cell => {
        if (cell.char === '') {
          return {
            ...cell,
            char: alphabet[Math.floor(Math.random() * alphabet.length)],
          };
        }
        return cell;
      })
    );
    setGrid(newGrid);
  }, []);

  const showMessage = useCallback(
    (text: string, colorClass: string, permanent = false) => {
      setMessageText(text);
      setMessageColorClass(colorClass);
      if (!permanent) {
        setTimeout(() => {
          setMessageText('');
          setMessageColorClass('');
        }, 2500);
      }
    },
    []
  );

  const initGame = useCallback(() => {
    const initialClues = [...wordSearchData.words];
    const initialWords = initialClues.map(c => c.word.toUpperCase());

    setClues(initialClues);
    setWords(initialWords);
    setFoundWords(new Set());
    setHintCount(initialHintCount);
    setCurrentSelectionText('');
    setMessageText('');
    setMessageColorClass('');
    if (lineSvgRef.current) {
      lineSvgRef.current.innerHTML = '';
    }

    let newGrid = createEmptyGrid();
    newGrid = placeWordsInGrid(initialWords, newGrid);
    fillEmptyCells(newGrid);
    setGameStarted(true);
  }, [createEmptyGrid, placeWordsInGrid, fillEmptyCells]);

  const getCellFromEvent = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!gridContainerRef.current) return null;
      let clientX: number;
      let clientY: number;
      if (e instanceof TouchEvent) {
        if (e.touches.length === 0) return null;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const target = document.elementFromPoint(clientX, clientY) as
        | HTMLElement
        | null;
      if (target && target.classList.contains('grid-cell')) {
        const x = parseInt(target.dataset.x || '0');
        const y = parseInt(target.dataset.y || '0');
        return grid[y][x];
      }
      return null;
    },
    [grid]
  );

  const handleInteractionStart = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const cell = getCellFromEvent(e);
      if (!cell || cell.isFound) return;

      setIsSelecting(true);
      setSelection([cell]);
      setGrid(prevGrid =>
        prevGrid.map(row =>
          row.map(c =>
            c.x === cell.x && c.y === cell.y
              ? { ...c, isSelecting: true }
              : { ...c, isSelecting: false }
          )
        )
      );
      setCurrentSelectionText(cell.char);
    },
    [getCellFromEvent]
  );

  const handleInteractionMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isSelecting) return;
      e.preventDefault();
      const cell = getCellFromEvent(e);
      if (
        cell &&
        !selection.some(s => s.x === cell.x && s.y === cell.y) &&
        !cell.isFound
      ) {
        if (selection.length === 1) {
          setSelection(prev => [...prev, cell]);
          setGrid(prevGrid =>
            prevGrid.map(row =>
              row.map(c =>
                c.x === cell.x && c.y === cell.y
                  ? { ...c, isSelecting: true }
                  : c
              )
            )
          );
          setCurrentSelectionText(prev => prev + cell.char);
        } else if (selection.length > 1) {
          const prevCell = selection[selection.length - 1];
          const prevPrevCell = selection[selection.length - 2];

          const dx = cell.x - prevCell.x;
          const dy = cell.y - prevCell.y;

          const prevDx = prevCell.x - prevPrevCell.x;
          const prevDy = prevCell.y - prevPrevCell.y;

          if (dx === prevDx && dy === prevDy) {
            setSelection(prev => [...prev, cell]);
            setGrid(prevGrid =>
              prevGrid.map(row =>
                row.map(c =>
                  c.x === cell.x && c.y === cell.y
                    ? { ...c, isSelecting: true }
                    : c
                )
              )
            );
            setCurrentSelectionText(prev => prev + cell.char);
          }
        }
      }
    },
    [isSelecting, selection, getCellFromEvent]
  );

  const drawFoundLine = useCallback((cells: Cell[]) => {
    if (!lineSvgRef.current || cells.length === 0 || !gridContainerRef.current)
      return;

    const gridRect = gridContainerRef.current.getBoundingClientRect();
    const firstCellElement = document.querySelector(
      `[data-x='${cells[0].x}'][data-y='${cells[0].y}']`
    ) as HTMLElement | null;
    const lastCellElement = document.querySelector(
      `[data-x='${cells[cells.length - 1].x}'][data-y='${cells[cells.length - 1].y}']`
    ) as HTMLElement | null;

    if (!firstCellElement || !lastCellElement) return;

    const firstRect = firstCellElement.getBoundingClientRect();
    const lastRect = lastCellElement.getBoundingClientRect();

    const x1 = (firstRect.left + firstRect.right) / 2 - gridRect.left;
    const y1 = (firstRect.top + firstRect.bottom) / 2 - gridRect.top;
    const x2 = (lastRect.left + lastRect.right) / 2 - gridRect.left;
    const y2 = (lastRect.top + lastRect.bottom) / 2 - gridRect.top;

    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', `M${x1},${y1} L${x2},${y2}`);
    path.setAttribute('stroke', 'rgba(245, 158, 11, 0.85)');
    path.setAttribute('stroke-width', '22');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('fill', 'none');

    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
    path.classList.add('found-line-path');

    lineSvgRef.current.appendChild(path);

    setTimeout(() => {
      path.style.strokeDashoffset = '0';
    }, 10);
  }, []);

  const handleInteractionEnd = useCallback(() => {
    if (!isSelecting) return;
    setIsSelecting(false);

    const selectedWord = selection.map(cell => cell.char).join('');
    const reversedWord = selectedWord.split('').reverse().join('');

    let wordFound: string | null = null;
    let foundDirection: 'normal' | 'reversed' | null = null;

    if (words.includes(selectedWord) && !foundWords.has(selectedWord)) {
      wordFound = selectedWord;
      foundDirection = 'normal';
    } else if (
      words.includes(reversedWord) &&
      !foundWords.has(reversedWord)
    ) {
      wordFound = reversedWord;
      foundDirection = 'reversed';
    }

    if (wordFound) {
      setFoundWords(prev => {
        const newSet = new Set(prev).add(wordFound!);
        drawFoundLine(
          foundDirection === 'reversed'
            ? [...selection].reverse()
            : selection
        );
        setGrid(prevGrid =>
          prevGrid.map(row =>
            row.map(c =>
              selection.some(s => s.x === c.x && s.y === c.y)
                ? { ...c, isSelecting: false, isFound: true }
                : { ...c, isSelecting: false }
            )
          )
        );
        showMessage('Word Found!', 'text-green-600');
        if (newSet.size === words.length) {
          setTimeout(
            () =>
              showMessage(
                '🎉 You Found Them All! 🎉',
                'text-emerald-500',
                true
              ),
            500
          );
        }
        return newSet;
      });
    } else {
      setGrid(prevGrid =>
        prevGrid.map(row => row.map(c => ({ ...c, isSelecting: false })))
      );
    }

    setSelection([]);
    setTimeout(() => {
      setCurrentSelectionText('');
    }, 500);
  }, [isSelecting, selection, words, foundWords, drawFoundLine, showMessage]);

  const useHint = useCallback(() => {
    if (hintCount === 0 || foundWords.size === words.length) return;

    const unfoundWords = placedWords.filter(
      w => !foundWords.has(w.word)
    );
    if (unfoundWords.length === 0) return;

    const wordToHint =
      unfoundWords[Math.floor(Math.random() * unfoundWords.length)];

    setGrid(prevGrid =>
      prevGrid.map(row =>
        row.map(c => {
          const isPartOfHint = wordToHint.word.split('').some((_, i) =>
            c.x === wordToHint.startX + i * wordToHint.dir.x &&
            c.y === wordToHint.startY + i * wordToHint.dir.y
          );
          return { ...c, isHint: isPartOfHint };
        })
      )
    );

    setTimeout(() => {
      setGrid(prevGrid =>
        prevGrid.map(row => row.map(c => ({ ...c, isHint: false })))
      );
    }, 2000);

    setHintCount(prev => prev - 1);
  }, [hintCount, foundWords, words, placedWords]);

  // Attach native event listeners with proper typing
  useEffect(() => {
    const container = gridContainerRef.current;
    if (!container) return;

    container.addEventListener('mousedown', handleInteractionStart);
    container.addEventListener('mousemove', handleInteractionMove);
    document.addEventListener('mouseup', handleInteractionEnd);
    container.addEventListener('touchstart', handleInteractionStart, {
      passive: false,
    });
    container.addEventListener('touchmove', handleInteractionMove, {
      passive: false,
    });
    document.addEventListener('touchend', handleInteractionEnd);

    return () => {
      container.removeEventListener('mousedown', handleInteractionStart);
      container.removeEventListener('mousemove', handleInteractionMove);
      document.removeEventListener('mouseup', handleInteractionEnd);
      container.removeEventListener('touchstart', handleInteractionStart);
      container.removeEventListener('touchmove', handleInteractionMove);
      document.removeEventListener('touchend', handleInteractionEnd);
    };
  }, [handleInteractionStart, handleInteractionMove, handleInteractionEnd]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-tr from-emerald-200 to-sky-300 relative">
      {/* --- FLOATING "RETURN" BUTTON --- */}
      <PixelButton
        onClick={() => navigate(-1)} // Navigates to the previous page (Dashboard)
        variant="secondary" // Light colored variant
        className="absolute top-4 left-4 z-10 flex items-center gap-2"
        size="sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Return
      </PixelButton>

      <div className="flex flex-row items-center justify-center w-full max-w-full px-2 gap-1">
        {/* Left Side Video */}
        <div className="hidden lg:block w-2/5 h-screen">
          <video
            src="/sus-game/video1.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full rounded-lg shadow-lg object-cover"
          />
        </div>

        <div className="game-wrapper flex-grow">
          <div
            id="game-app"
            className="w-full max-w-6xl bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 text-center"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <PixelButton onClick={() => navigate('/sus-game/dashboard')}>
                <ArrowLeft className="h-5 w-5" />
              </PixelButton>
              <h1
                className={`${gradientTextClass} text-4xl sm:text-5xl font-bold text-center`}
              >
                Eco Word Search
              </h1>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
              <button
                onClick={initGame}
                className={`${buttonBaseClass} sm:w-40 bg-emerald-500 hover:bg-emerald-600`}
              >
                New Game
              </button>
              <button
                onClick={useHint}
                className={`${buttonBaseClass} sm:w-40 bg-amber-500 hover:bg-amber-600`}
                disabled={hintCount === 0}
              >
                Hint ({hintCount})
              </button>
            </div>

            {/* Game Board */}
            <div className="flex flex-col lg:flex-row items-center gap-12 w-full">
              <div className="relative">
                <div
                  ref={gridContainerRef}
                  className="relative bg-white p-2 rounded-lg shadow-lg"
                >
                  <div
                    className="grid gap-4"
                    style={{
                      gridTemplateColumns: `repeat(${gridSize}, 3rem)`,
                      gridTemplateRows: `repeat(${gridSize}, 3rem)`,
                    }}
                  >
                    {grid.map((row, y) =>
                      row.map((cell, x) => (
                        <div
                          key={`${x}-${y}`}
                          data-x={x}
                          data-y={y}
                      className={`grid-cell border border-gray-200 flex items-center justify-center text-lg font-bold relative select-none transition-all duration-200 ease-in-out
                      ${cell.isFound ? 'bg-emerald-200 text-emerald-700 scale-110' : ''}
                      ${cell.isHint ? 'bg-amber-200 text-amber-800' : ''}
                      ${cell.isSelecting ? 'shadow-[0_0_0_3px_#F97316_inset] scale-110' : ''}`}
                    >
                      {cell.char}
                    </div>
                  ))
                )}
              </div>
                  <svg
                    ref={lineSvgRef}
                    className="absolute inset-0 pointer-events-none"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              </div>

              {/* Words List */}
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className={`${gradientTextClass} text-2xl font-bold mb-4`}>
                  Find These Words
                </h2>
                <ul className="space-y-2 text-left overflow-y-auto max-h-96">
                  {clues.map(({ word, clue }) => (
                    <li
                      key={word}
                      className={`flex justify-between items-start p-2 rounded-lg transition-all duration-300 ${
                        foundWords.has(word)
                          ? 'bg-emerald-50 line-through text-emerald-600'
                          : 'hover:bg-emerald-50'
                      }`}
                    >
                      <div>
                        <span className="font-bold">{word}</span>
                        <p className="text-sm text-gray-500">{clue}</p>
                      </div>
                      {foundWords.has(word) && (
                        <span className="text-emerald-500">✓</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Messages */}
            <div className="mt-6 text-xl font-semibold min-h-[2rem]">
              {messageText && (
                <span className={messageColorClass}>{messageText}</span>
              )}
            </div>

            {/* Current Selection */}
            <div className="mt-2 text-lg text-gray-700 min-h-[1.5rem]">
              {currentSelectionText && (
                <span>Current: {currentSelectionText}</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Video */}
        <div className="hidden lg:block w-1/3 h-screen">
          <video
            src="/sus-game/video2.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full rounded-lg shadow-lg object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default WordSearchGame;
