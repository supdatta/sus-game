import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PixelButton } from '../components/ui/pixel-button';
import { ArrowLeft } from 'lucide-react';

const wordList = [
    { "answer": "RENEWABLE", "clue": "Energy that won't run out (e.g. solar)" },
    { "answer": "OZONE", "clue": "Layer that protects Earth from UV rays" },
    { "answer": "RECYCLE", "clue": "Process materials for reuse" },
    { "answer": "HEAT", "clue": "Global warming is a rise in global ___" },
    { "answer": "SOLAR", "clue": "Energy from the sun" },
    { "answer": "RESOURCE", "clue": "A stock or supply of materials" },
    { "answer": "OCEAN", "clue": "Vast body of water, affected by warming" },
    { "answer": "WIND", "clue": "A clean energy source using turbines" },
    { "answer": "TREE", "clue": "Absorbs CO₂, helps fight climate change" },
    { "answer": "LEVEL", "clue": "Melting ice causes the sea ___ to rise" },
    { "answer": "FOSSIL", "clue": "___ fuels (like coal and oil)" },
    { "answer": "CARBON", "clue": "A primary greenhouse gas element" },
    { "answer": "FOREST", "clue": "A large area of trees that absorbs CO₂" },
    { "answer": "SMOG", "clue": "Hazy fog caused by air pollution" },
    { "answer": "ECOLOGY", "clue": "Study of organisms and their environment" },
    { "answer": "GAS", "clue": "Methane is a powerful greenhouse ___" },
    { "answer": "ACID", "clue": "___ rain, caused by pollutants" }
];

const gridSize = 10;

interface Cell {
    value: string;
    correctValue: string | null;
    clues: CrosswordClue[];
    isWordCorrect: boolean;
    isLetterCorrect: boolean;
    isIncorrect: boolean;
    number: number | null;
    inputRef: React.RefObject<HTMLInputElement>;
}

interface CrosswordClue {
    answer: string;
    clue: string;
    x: number;
    y: number;
    orientation: 'across' | 'down';
    number: number;
}

const CrosswordGame: React.FC = () => {
    const navigate = useNavigate();
    const [grid, setGrid] = useState<Cell[][]>([]);
    const [clues, setClues] = useState<{ across: CrosswordClue[]; down: CrosswordClue[] }>({ across: [], down: [] });
    const [activeClue, setActiveClue] = useState<CrosswordClue | null>(null);
    const [message, setMessage] = useState('');
    const [lastFocusedCell, setLastFocusedCell] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });

    const gridRefs = useRef<React.RefObject<HTMLInputElement>[][]>(
        Array(gridSize).fill(null).map(() => Array(gridSize).fill(null).map(() => React.createRef()))
    );

    const generateCrossword = useCallback(() => {
        let placedClues: CrosswordClue[] = [];
        let tempGrid: (string | null)[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
        const words = [...wordList].sort((a, b) => b.answer.length - a.answer.length);

        const placeWord = (wordObj: { answer: string; clue: string }, x: number, y: number, orientation: 'across' | 'down') => {
            for (let i = 0; i < wordObj.answer.length; i++) {
                if (orientation === 'across') tempGrid[y][x + i] = wordObj.answer[i];
                else tempGrid[y + i][x] = wordObj.answer[i];
            }
            placedClues.push({ ...wordObj, x, y, orientation, number: 0 });
        };

        const getNewPosition = (clue: CrosswordClue, i: number, j: number, newOrientation: 'across' | 'down') => {
            if (newOrientation === 'down') return { x: clue.x + i, y: clue.y - j };
            else return { x: clue.x - j, y: clue.y + i };
        };

        const canPlace = (word: string, x: number, y: number, orientation: 'across' | 'down', currentGrid: (string | null)[][]) => {
            if (x < 0 || y < 0) return false;

            if (orientation === 'across') {
                if (x + word.length > gridSize) return false;
                if ((x > 0 && currentGrid[y][x - 1]) || (x + word.length < gridSize && currentGrid[y][x + word.length])) return false;

                for (let i = 0; i < word.length; i++) {
                    const gridVal = currentGrid[y][x + i];
                    if (gridVal && gridVal !== word[i]) return false;
                    if (!gridVal) {
                        if ((y > 0 && currentGrid[y - 1]?.[x + i]) || (y < gridSize - 1 && currentGrid[y + 1]?.[x + i])) return false;
                    }
                }
            } else {
                if (y + word.length > gridSize) return false;
                if ((y > 0 && currentGrid[y - 1]?.[x]) || (y + word.length < gridSize && currentGrid[y + word.length]?.[x])) return false;

                for (let i = 0; i < word.length; i++) {
                    const gridVal = currentGrid[y + i][x];
                    if (gridVal && gridVal !== word[i]) return false;
                    if (!gridVal) {
                        if ((x > 0 && currentGrid[y + i]?.[x - 1]) || (x < gridSize - 1 && currentGrid[y + i]?.[x + 1])) return false;
                    }
                }
            }
            return true;
        };

        const firstWord = words.shift();
        if (firstWord) {
            const startY = Math.floor(gridSize / 2);
            const startX = Math.floor((gridSize - firstWord.answer.length) / 2);
            placeWord(firstWord, startX, startY, 'across');
        }

        let attempts = 0;
        while (words.length > 0 && attempts < 500) {
            const wordToPlace = words.shift();
            let bestFit = null;

            for (const existingClue of placedClues) {
                for (let i = 0; i < existingClue.answer.length; i++) {
                    for (let j = 0; j < wordToPlace.answer.length; j++) {
                        if (existingClue.answer[i] === wordToPlace.answer[j]) {
                            const newOrientation = existingClue.orientation === 'across' ? 'down' : 'across';
                            const newPos = getNewPosition(existingClue, i, j, newOrientation);

                            if (canPlace(wordToPlace.answer, newPos.x, newPos.y, newOrientation, tempGrid)) {
                                bestFit = { word: wordToPlace, x: newPos.x, y: newPos.y, orientation: newOrientation };
                                break;
                            }
                        }
                    }
                    if (bestFit) break;
                }
                if (bestFit) break;
            }

            if (bestFit) {
                placeWord(bestFit.word, bestFit.x, bestFit.y, bestFit.orientation);
            } else {
                words.push(wordToPlace);
            }
            attempts++;
        }

        placedClues.sort((a, b) => a.y - b.y || a.x - b.x);
        let clueNumber = 1;
        const numberCoords: Record<string, number> = {};
        placedClues.forEach(clue => {
            const coordKey = `${clue.x},${clue.y}`;
            if (!numberCoords[coordKey]) {
                numberCoords[coordKey] = clueNumber++;
            }
            clue.number = numberCoords[coordKey];
        });

        const newGrid: Cell[][] = Array(gridSize).fill(null).map((_, y) =>
            Array(gridSize).fill(null).map((_, x) => ({
                value: '',
                correctValue: null,
                clues: [],
                isWordCorrect: false,
                isLetterCorrect: false,
                isIncorrect: false,
                number: null,
                inputRef: gridRefs.current[y][x],
            }))
        );

        placedClues.forEach(clue => {
            for (let i = 0; i < clue.answer.length; i++) {
                const currentX = clue.orientation === 'across' ? clue.x + i : clue.x;
                const currentY = clue.orientation === 'down' ? clue.y + i : clue.y;

                if (currentX < gridSize && currentY < gridSize) {
                    const cell = newGrid[currentY][currentX];
                    cell.correctValue = clue.answer[i];
                    cell.clues.push(clue);
                    if (i === 0) {
                        cell.number = clue.number;
                    }
                }
            }
        });

        setGrid(newGrid);
        setClues({
            across: placedClues.filter(c => c.orientation === 'across').sort((a, b) => a.number - b.number),
            down: placedClues.filter(c => c.orientation === 'down').sort((a, b) => a.number - b.number),
        });
        setMessage('Select a clue to begin');
        setActiveClue(null);
        setLastFocusedCell({ x: null, y: null });
    }, []);

    useEffect(() => {
        generateCrossword();
    }, [generateCrossword]);

    const focusOn = useCallback((x: number, y: number) => {
        if (x >= 0 && x < gridSize && y >= 0 && y < gridSize && grid[y][x]?.inputRef.current) {
            grid[y][x].inputRef.current?.focus();
            grid[y][x].inputRef.current?.select();
        }
    }, [grid]);

    const highlightClue = useCallback((clue: CrosswordClue) => {
        setActiveClue(clue);
        setMessage(`${clue.number}. ${clue.clue} (${clue.orientation})`);
    }, []);

    const handleFocus = useCallback((x: number, y: number, isClick = false, specificClue: CrosswordClue | null = null) => {
        const cellClues = grid[y][x]?.clues || [];
        if (cellClues.length === 0) return;

        let nextClue: CrosswordClue | null = null;

        if (specificClue) {
            nextClue = specificClue;
        } else {
            const isSameCell = lastFocusedCell.x === x && lastFocusedCell.y === y;
            if (isClick && isSameCell && cellClues.length > 1 && activeClue) {
                const otherOrientation = activeClue.orientation === 'across' ? 'down' : 'across';
                nextClue = cellClues.find(c => c.orientation === otherOrientation) || activeClue;
            } else {
                nextClue = cellClues.find(c => c.orientation === 'across') || cellClues[0];
            }
        }

        if (nextClue) {
            highlightClue(nextClue);
            focusOn(x, y);
        }
        setLastFocusedCell({ x, y });
    }, [grid, activeClue, lastFocusedCell, focusOn, highlightClue]);

    const clearErrors = useCallback(() => {
        setGrid(prevGrid => prevGrid.map(row => row.map(cell => ({
            ...cell,
            isLetterCorrect: false,
            isIncorrect: false,
        }))));
    }, []);

    const checkWord = useCallback((clue: CrosswordClue) => {
        let word = '';
        let isFilled = true;
        for (let i = 0; i < clue.answer.length; i++) {
            const x = clue.orientation === 'across' ? clue.x + i : clue.x;
            const y = clue.orientation === 'down' ? clue.y + i : clue.y;
            const cell = grid[y][x];
            if (!cell.value) isFilled = false;
            word += cell.value;
        }

        if (isFilled && word.toUpperCase() === clue.answer) {
            setGrid(prevGrid => prevGrid.map((row, rIdx) => row.map((cell, cIdx) => {
                const isPartOfClue = clue.orientation === 'across'
                    ? rIdx === clue.y && cIdx >= clue.x && cIdx < clue.x + clue.answer.length
                    : cIdx === clue.x && rIdx >= clue.y && rIdx < clue.y + clue.answer.length;

                if (isPartOfClue) {
                    return { ...cell, isWordCorrect: true, isLetterCorrect: false, isIncorrect: false };
                }
                return cell;
            })));
            checkPuzzleCompletion();
        }
    }, [grid]);

    const checkPuzzleCompletion = useCallback(() => {
        const allSolved = clues.across.concat(clues.down).every(clue => {
            for (let i = 0; i < clue.answer.length; i++) {
                const x = clue.orientation === 'across' ? clue.x + i : clue.x;
                const y = clue.orientation === 'down' ? clue.y + i : clue.y;
                if (!grid[y][x]?.isWordCorrect) return false;
            }
            return true;
        });

        if (allSolved) {
            setMessage("Congratulations! You've solved the puzzle!");
        }
    }, [clues, grid]);

    const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>, x: number, y: number) => {
        const newValue = e.target.value.toUpperCase();
        setGrid(prevGrid => prevGrid.map((row, rIdx) => row.map((cell, cIdx) =>
            rIdx === y && cIdx === x ? { ...cell, value: newValue } : cell
        )));
        clearErrors();

        if (newValue && activeClue) {
            const isLastLetter = (activeClue.orientation === 'across' && x === activeClue.x + activeClue.answer.length - 1) ||
                                 (activeClue.orientation === 'down' && y === activeClue.y + activeClue.answer.length - 1);
            if (!isLastLetter) {
                const nextX = activeClue.orientation === 'across' ? x + 1 : x;
                const nextY = activeClue.orientation === 'down' ? y + 1 : y;
                focusOn(nextX, nextY);
            }
            checkWord(activeClue);
        }
    }, [activeClue, clearErrors, focusOn, checkWord]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, x: number, y: number) => {
        if (e.key === 'Backspace' && e.currentTarget.value === '') {
            const prevX = activeClue?.orientation === 'across' ? x - 1 : x;
            const prevY = activeClue?.orientation === 'down' ? y - 1 : y;
            focusOn(prevX, prevY);
        } else if (e.key === 'ArrowUp') { e.preventDefault(); focusOn(x, y - 1); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); focusOn(x, y + 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); focusOn(x - 1, y); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); focusOn(x + 1, y); }
    }, [activeClue, focusOn]);

    const checkPuzzle = useCallback(() => {
        clearErrors();
        let allCorrect = true;
        clues.across.concat(clues.down).forEach(clue => {
            let isWordCompleteAndCorrect = true;
            for (let i = 0; i < clue.answer.length; i++) {
                const x = clue.orientation === 'across' ? clue.x + i : clue.x;
                const y = clue.orientation === 'down' ? clue.y + i : clue.y;
                const cell = grid[y][x];

                if (cell.isWordCorrect) continue;

                const enteredLetter = cell.value;
                const correctLetter = clue.answer[i];

                if (enteredLetter) {
                    if (enteredLetter === correctLetter) {
                        setGrid(prevGrid => prevGrid.map((row, rIdx) => row.map((c, cIdx) =>
                            rIdx === y && cIdx === x ? { ...c, isLetterCorrect: true } : c
                        )));
                    } else {
                        setGrid(prevGrid => prevGrid.map((row, rIdx) => row.map((c, cIdx) =>
                            rIdx === y && cIdx === x ? { ...c, isIncorrect: true } : c
                        )));
                        isWordCompleteAndCorrect = false;
                        allCorrect = false;
                    }
                } else {
                    isWordCompleteAndCorrect = false;
                    allCorrect = false;
                }
            }
            if (isWordCompleteAndCorrect) checkWord(clue);
        });
        if (allCorrect) checkPuzzleCompletion();
    }, [clues, grid, clearErrors, checkWord, checkPuzzleCompletion]);

    const revealWord = useCallback((clueToReveal?: CrosswordClue) => {
        const clue = clueToReveal || activeClue;
        if (!clue) return;

        setGrid(prevGrid => prevGrid.map((row, rIdx) => row.map((cell, cIdx) => {
            const isPartOfClue = clue.orientation === 'across'
                ? rIdx === clue.y && cIdx >= clue.x && cIdx < clue.x + clue.answer.length
                : cIdx === clue.x && rIdx >= clue.y && rIdx < clue.y + clue.answer.length;

            if (isPartOfClue) {
                const letterIndex = clue.orientation === 'across' ? cIdx - clue.x : rIdx - clue.y;
                return { ...cell, value: clue.answer[letterIndex], isWordCorrect: true, isLetterCorrect: false, isIncorrect: false };
            }
            return cell;
        })));
        checkWord(clue);
    }, [activeClue, checkWord]);

    const solveAll = useCallback(() => {
        clues.across.concat(clues.down).forEach(clue => revealWord(clue));
        checkPuzzleCompletion();
    }, [clues, revealWord, checkPuzzleCompletion]);

    const resetPuzzle = useCallback(() => {
        generateCrossword();
    }, [generateCrossword]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-tr from-teal-200 to-cyan-300 relative">
            {/* --- FLOATING "RETURN" BUTTON --- */}
            <PixelButton
                onClick={() => navigate(-1)}
                variant="secondary"
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
                        className="w-full text-center"
                    >

                        <div className="text-center h-12 my-4 p-3 bg-white rounded-lg shadow-inner text-gray-700 font-semibold flex items-center justify-center">
                            {message}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2">
                                <div className="grid-container bg-gray-400 rounded-md p-1" style={{
                                    display: 'grid',
                                    gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                                    gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
                                    gap: '2px',
                                    aspectRatio: '1 / 1',
                                }}>
                                    {grid.map((row, y) => (
                                        row.map((cell, x) => (
                                            <div key={`${x}-${y}`} className={`relative w-full h-full ${cell.correctValue ? '' : 'bg-gray-800'}`}>
                                                {cell.correctValue && (
                                                    <>
                                                        <input
                                                            ref={gridRefs.current[y][x]}
                                                            type="text"
                                                            maxLength={1}
                                                            className={`w-full h-full text-center text-xl uppercase font-semibold border rounded-md caret-cyan-600 transition-all duration-200
                                                                ${cell.isWordCorrect ? 'bg-green-100 text-green-800 border-green-400' : ''}
                                                                ${cell.isLetterCorrect && !cell.isWordCorrect ? 'bg-blue-100' : ''}
                                                                ${cell.isIncorrect && !cell.isWordCorrect ? 'bg-red-100 text-red-800 border-red-400' : ''}
                                                                ${activeClue && cell.clues.some(c => c.number === activeClue.number && c.orientation === activeClue.orientation) && !cell.isWordCorrect ? 'bg-cyan-200 outline outline-2 outline-offset-1 outline-cyan-600' : 'bg-white border-gray-300'}
                                                                ${cell.isWordCorrect ? 'pointer-events-none' : ''}
                                                            `}
                                                            value={cell.value}
                                                            onChange={(e) => handleInput(e, x, y)}
                                                            onKeyDown={(e) => handleKeyDown(e, x, y)}
                                                            onFocus={() => handleFocus(x, y)}
                                                            onClick={(e) => handleFocus(x, y, true)}
                                                            disabled={cell.isWordCorrect}
                                                        />
                                                        {cell.number && (
                                                            <div className="absolute top-0.5 left-1 text-xs font-bold text-gray-600 pointer-events-none">
                                                                {cell.number}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        ))
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-1 text-left">
                                <div>
                                    <h2 className="text-xl font-bold mb-3 border-b-2 border-teal-500 pb-2">Across</h2>
                                    <div id="across-clues" className="space-y-2 text-sm text-gray-700 overflow-y-auto max-h-80 pr-2">
                                        {clues.across.map(clue => (
                                            <div
                                                key={`${clue.number}-${clue.orientation}`}
                                                className={`p-1.5 rounded-md cursor-pointer transition-colors ${activeClue?.number === clue.number && activeClue?.orientation === activeClue.orientation ? 'bg-teal-100' : ''}`}
                                                onClick={() => handleFocus(clue.x, clue.y, false, clue)}
                                            >
                                                {clue.number}. {clue.clue}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold mb-3 border-b-2 border-teal-500 pb-2">Down</h2>
                                    <div id="down-clues" className="space-y-2 text-sm text-gray-700 overflow-y-auto max-h-80 pr-2">
                                        {clues.down.map(clue => (
                                            <div
                                                key={`${clue.number}-${clue.orientation}`}
                                                className={`p-1.5 rounded-md cursor-pointer transition-colors ${activeClue?.number === clue.number && activeClue?.orientation === activeClue.orientation ? 'bg-teal-100' : ''}`}
                                                onClick={() => handleFocus(clue.x, clue.y, false, clue)}
                                            >
                                                {clue.number}. {clue.clue}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col justify-center items-center gap-4">
                            <div className="h-6 text-lg font-semibold text-green-600 opacity-100">{message.includes("Congratulations") ? message : ''}</div>
                            <div className="flex flex-wrap justify-center gap-4">
                                <PixelButton onClick={checkPuzzle} className="font-pixel py-2 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-md bg-sky-600 hover:bg-sky-700 text-white">Check Puzzle</PixelButton>
                                <PixelButton onClick={clearErrors} className="font-pixel py-2 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-md bg-gray-500 hover:bg-gray-600 text-white">Clear Errors</PixelButton>
                                <PixelButton onClick={() => revealWord()} className="font-pixel py-2 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-md bg-yellow-600 hover:bg-yellow-700 text-white">Reveal Word</PixelButton>
                                <PixelButton onClick={solveAll} className="font-pixel py-2 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-md bg-green-600 hover:bg-green-700 text-white">Solve All</PixelButton>
                                <PixelButton onClick={resetPuzzle} className="font-pixel py-2 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-md bg-red-600 hover:bg-red-700 text-white">New Puzzle</PixelButton>
                            </div>
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

export default CrosswordGame;