import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PixelButton } from '../components/ui/pixel-button';
import { ArrowLeft } from 'lucide-react';

// Styling inspired by Wordgame.html and other minigames
const gradientTextClass = "bg-gradient-to-r from-cyan-500 to-cyan-600 bg-clip-text text-transparent";
const buttonBaseClass = "w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition-transform transform hover:scale-105";

const gameData = {
    "words": [
        { "answer": "RECYCLE", "hint": "Process waste for reuse." },
        { "answer": "CONSERVE", "hint": "Protect and save resources." },
        { "answer": "RENEWABLE", "hint": "Energy from sun, wind, or water." },
        { "answer": "COMPOST", "hint": "Turn organic waste into fertilizer." },
        { "answer": "REFOREST", "hint": "The action of planting trees." },
        { "answer": "SUSTAIN", "hint": "Maintain ecological balance." },
        { "answer": "SOLAR", "hint": "Power directly from the sun." },
        { "answer": "ECOLOGY", "hint": "The study of ecosystems." },
        { "answer": "HABITAT", "hint": "An animal's natural home." },
        { "answer": "PLANET", "hint": "Our home in the solar system." }
    ]
};

const MAX_LIVES = 6;
const TOTAL_WORDS = gameData.words.length;
const CHECKPOINT_LEVEL = Math.floor(TOTAL_WORDS / 2); // Checkpoint halfway through

// --- SVG Assets ---
const icyHeartSVG = `<svg class="life-heart-svg" viewBox="0 0 20 20"><defs><linearGradient id="icyGradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#A5F3FC;stop-opacity:1" /><stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:1" /></linearGradient></defs><path d="M 10 3 C 8 0 4 0 2 3 C 0 6 4 9 10 15 C 16 9 20 6 18 3 C 16 0 12 0 10 3 Z" fill="url(#icyGradient)" stroke="#083344" stroke-width="1.5"/></svg>`;
const emptyHeartSVG = `<svg class="life-heart-svg" viewBox="0 0 20 20"><path d="M 10 3 C 8 0 4 0 2 3 C 0 6 4 9 10 15 C 16 9 20 6 18 3 C 16 0 12 0 10 3 Z" fill="none" stroke="#94A3B8" stroke-width="1.5"/></svg>`;
const bearFace = `<g transform="translate(40, 25) scale(0.9)"><circle cx="6" cy="5" r="2" fill="#083344"/><circle cx="14" cy="5" r="2" fill="#083344"/><path d="M 8 9 L 12 9 Q 10 12 8 9 Z" fill="#083344"/></g>`;
const sadBearFace = `<g transform="translate(40, 27) scale(0.9)"><circle cx="6" cy="5" r="2" fill="#083344"/><circle cx="14" cy="5" r="2" fill="#083344"/><path d="M 8 12 L 12 12 Q 10 9 8 12 Z" fill="#083344"/></g>`;
const iceBlockStates = [
    `<svg class="ice-block-svg" viewBox="0 0 100 60"><path d="M 5 20 Q 2 10 10 10 L 90 10 Q 98 10 95 20 L 90 50 Q 88 58 80 55 L 20 55 Q 12 58 5 50 Z" fill="#E0F2FE" stroke="#93C5FD" stroke-width="2"/>${bearFace}</svg>`,
    `<svg class="ice-block-svg" viewBox="0 0 100 60"><path d="M 8 22 Q 4 12 12 12 L 88 12 Q 96 12 93 22 L 88 48 Q 86 56 78 53 L 22 53 Q 14 56 8 48 Z" fill="#E0F2FE" stroke="#93C5FD" stroke-width="2"/>${bearFace}</svg>`,
    `<svg class="ice-block-svg" viewBox="0 0 100 60"><path d="M 12 25 Q 8 15 16 15 L 84 15 Q 92 15 89 25 L 84 45 Q 82 53 74 50 L 26 50 Q 18 53 12 45 Z" fill="#E0F2FE" stroke="#93C5FD" stroke-width="2"/>${bearFace}</svg>`,
    `<svg class="ice-block-svg" viewBox="0 0 100 60"><path d="M 18 28 Q 14 18 22 18 L 78 18 Q 86 18 83 28 L 78 42 Q 76 50 68 47 L 32 47 Q 24 50 18 42 Z" fill="#E0F2FE" stroke="#93C5FD" stroke-width="2"/>${bearFace}</svg>`,
    `<svg class="ice-block-svg" viewBox="0 0 100 60"><path d="M 25 32 Q 21 22 29 22 L 71 22 Q 79 22 76 32 L 71 39 Q 69 47 61 44 L 39 44 Q 31 47 25 39 Z" fill="#E0F2FE" stroke="#93C5FD" stroke-width="2"/>${bearFace}</svg>`,
    `<svg class="ice-block-svg" viewBox="0 0 100 60"><path d="M 35 38 Q 32 30 38 30 L 62 30 Q 68 30 65 38 L 62 42 Q 60 48 55 46 L 45 46 Q 40 48 35 42 Z" fill="#E0F2FE" stroke="#93C5FD" stroke-width="2"/>${bearFace}</svg>`,
    `<svg class="ice-block-svg" viewBox="0 0 100 60"><path d="M 42 42 Q 40 38 44 38 L 56 38 Q 60 38 58 42 L 56 44 Q 55 47 52 46 L 48 46 Q 45 47 42 44 Z" fill="#E0F2FE" stroke="#93C5FD" stroke-width="2"/>${sadBearFace}</svg>`
];
const playerIconSVG = `<svg viewBox="0 0 20 20" fill="#083344"><rect x="3" y="10" width="14" height="5" rx="2.5" /><rect x="6" y="5" width="8" height="6" rx="2" /></svg>`;
const SVG_NS = "http://www.w3.org/2000/svg";

const HangmanGame: React.FC = () => {
    const navigate = useNavigate();
    const [gameState, setGameState] = useState<'start' | 'game' | 'end' | 'checkpoint'>('start');
    const [gameWords, setGameWords] = useState<{ answer: string; hint: string }[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [lives, setLives] = useState(MAX_LIVES);
    const [score, setScore] = useState(0);
    const [guessedLetters, setGuessedLetters] = useState(new Set<string>());
    const [messageText, setMessageText] = useState('');
    const [nextButtonVisible, setNextButtonVisible] = useState(false);
    const [isWin, setIsWin] = useState(false);

    const pathSvgRef = useRef<SVGSVGElement>(null);
    const playerIconRef = useRef<HTMLDivElement>(null);

    const currentWordData = gameWords[currentWordIndex];
    const currentAnswer = currentWordData?.answer.toUpperCase() || '';

    const renderWordDisplay = useCallback(() => {
        if (!currentAnswer) return [];
        return currentAnswer.split('').map((letter, index) => (
            <div key={index} className={`w-8 h-12 md:w-10 md:h-14 border-b-4 ${guessedLetters.has(letter) ? 'border-gray-800' : 'border-gray-300'} flex items-center justify-center text-4xl md:text-5xl font-mono tracking-widest`}>
                {guessedLetters.has(letter) ? letter : '\u00A0'} {/* &nbsp; */}
            </div>
        ));
    }, [currentAnswer, guessedLetters]);

    const renderLives = useCallback(() => {
        const hearts = [];
        for (let i = 0; i < MAX_LIVES; i++) {
            if (i < lives) {
                hearts.push(<div key={i} dangerouslySetInnerHTML={{ __html: icyHeartSVG }} className="life-heart-svg w-8 h-8" />);
            } else {
                hearts.push(<div key={i} dangerouslySetInnerHTML={{ __html: emptyHeartSVG }} className="life-heart-svg w-8 h-8" />);
            }
        }
        return hearts;
    }, [lives]);

    const renderIceBlock = useCallback(() => {
        return <div dangerouslySetInnerHTML={{ __html: iceBlockStates[MAX_LIVES - lives] }} className="ice-block-svg" />;
    }, [lives]);

    const renderKeyboard = useCallback(() => {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        return alphabet.map(letter => (
            <button
                key={letter}
                className="keyboard-btn bg-white text-gray-800 font-bold p-2 md:p-3 rounded-md text-lg shadow-md hover:translate-y-[-2px] hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => handleGuess(letter)}
                disabled={guessedLetters.has(letter) || allLettersGuessed()}
            >
                {letter}
            </button>
        ));
    }, [guessedLetters, currentAnswer]); // Added currentAnswer to dependencies

    const allLettersGuessed = useCallback(() => {
        return currentAnswer.split('').every(letter => guessedLetters.has(letter));
    }, [currentAnswer, guessedLetters]);

    const checkWin = useCallback(() => {
        if (allLettersGuessed()) {
            setScore(prev => prev + lives * 10);
            setMessageText('Path Extended!');
            setNextButtonVisible(true);
            movePlayerIcon(currentWordIndex + 1);

            setTimeout(() => {
                if (currentWordIndex + 1 === CHECKPOINT_LEVEL) {
                    setGameState('checkpoint');
                } else if (currentWordIndex + 1 >= TOTAL_WORDS) {
                    endGame(true);
                }
            }, 1200);
        }
    }, [allLettersGuessed, lives, currentWordIndex, TOTAL_WORDS]);

    const checkLoss = useCallback(() => {
        if (lives <= 0) {
            setMessageText(`The word was: ${currentAnswer}`);
            endGame(false);
        }
    }, [lives, currentAnswer]);

    const handleGuess = useCallback((letter: string) => {
        if (guessedLetters.has(letter) || lives === 0 || allLettersGuessed()) return;

        setGuessedLetters(prev => new Set(prev).add(letter));

        if (currentAnswer.includes(letter)) {
            // No change to lives
        } else {
            setLives(prev => prev - 1);
        }
    }, [guessedLetters, lives, allLettersGuessed, currentAnswer]);

    useEffect(() => {
        if (gameState === 'game') {
            checkWin();
            checkLoss();
        }
    }, [guessedLetters, lives, gameState, checkWin, checkLoss]);

    const setupFullPath = useCallback(() => {
        if (!pathSvgRef.current || !playerIconRef.current) return;

        pathSvgRef.current.innerHTML = '';
        playerIconRef.current.innerHTML = playerIconSVG;
        
        const width = pathSvgRef.current.clientWidth;
        const height = pathSvgRef.current.clientHeight;
        const y = height / 2;
        const startX = 40;
        const endX = width - 40;
        const pathWidth = endX - startX;
        
        const line = document.createElementNS(SVG_NS, 'line');
        line.setAttribute('x1', String(startX));
        line.setAttribute('y1', String(y));
        line.setAttribute('x2', String(endX));
        line.setAttribute('y2', String(y));
        line.setAttribute('stroke', '#0891B2');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-dasharray', '1 6');
        line.setAttribute('stroke-linecap', 'round');
        pathSvgRef.current.appendChild(line);

        for (let i = 0; i < TOTAL_WORDS; i++) {
            const nodeX = startX + (i / (TOTAL_WORDS - 1)) * pathWidth;
            const nodeGroup = document.createElementNS(SVG_NS, 'g');
            nodeGroup.dataset.index = String(i);
            
            if (i === 0) { // Start Node
                const flarePoints = "0,-18 -4,-14 -14,-4 -18,0 -14,4 -4,14 0,18 4,14 14,4 18,0 14,-4 4,-14";
                const flare = document.createElementNS(SVG_NS, 'polygon');
                flare.setAttribute("points", flarePoints);
                flare.setAttribute("fill", "#dbeafe");
                flare.setAttribute("transform", `translate(${nodeX}, ${y})`);
                nodeGroup.appendChild(flare);
            }
            
            if (i === TOTAL_WORDS - 1) { // End Node
                const rect = document.createElementNS(SVG_NS, 'rect');
                rect.setAttribute("x", String(nodeX - 18));
                rect.setAttribute("y", String(y - 18));
                rect.setAttribute("width", "36");
                rect.setAttribute("height", "36");
                rect.setAttribute("rx", "8");
                rect.setAttribute("fill", "#dbeafe");
                nodeGroup.appendChild(rect);
            }
            
            const circle = document.createElementNS(SVG_NS, 'circle');
            circle.setAttribute('cx', String(nodeX));
            circle.setAttribute('cy', String(y));
            circle.setAttribute('r', '8');
            circle.setAttribute('stroke-width', '3');
            circle.setAttribute('fill', 'white');
            circle.classList.add('path-node-circle');
            nodeGroup.appendChild(circle);
            
            pathSvgRef.current.appendChild(nodeGroup);
        }
        movePlayerIcon(currentWordIndex);
        updatePathVisuals();
    }, [currentWordIndex]);

    const updatePathVisuals = useCallback(() => {
        if (!pathSvgRef.current) return;
        const nodes = pathSvgRef.current.querySelectorAll('.path-node-circle');
        nodes.forEach((node, i) => {
            if (i < currentWordIndex) { // Completed
                node.setAttribute('stroke', '#0891B2'); // var(--accent-secondary)
                node.setAttribute('fill', '#0891B2');   // var(--accent-secondary)
            } else { // Upcoming
                node.setAttribute('stroke', '#9ca3af');
                node.setAttribute('fill', 'white');
            }
            if (i + 1 === CHECKPOINT_LEVEL) {
                 node.setAttribute('stroke', '#f59e0b');
            }
        });
    }, [currentWordIndex]);
    
    const movePlayerIcon = useCallback((targetIndex: number) => {
        if (!pathSvgRef.current || !playerIconRef.current) return;
        const node = pathSvgRef.current.querySelector(`g[data-index="${targetIndex}"] circle`);
        if (!node) return;
        const targetX = parseFloat(node.getAttribute('cx') || '0');
        // Adjust for player icon's actual width if needed, assuming it's centered
        playerIconRef.current.style.transform = `translateX(${targetX - (playerIconRef.current.offsetWidth / 2)}px)`;
    }, []);

    useEffect(() => {
        if (gameState === 'game' || gameState === 'checkpoint') {
            setupFullPath();
        }
    }, [gameState, setupFullPath]);

    useEffect(() => {
        updatePathVisuals();
        movePlayerIcon(currentWordIndex);
    }, [currentWordIndex, updatePathVisuals, movePlayerIcon]);

    const startNewWord = useCallback(() => {
        if (currentWordIndex >= TOTAL_WORDS) {
            endGame(true);
            return;
        }
        setLives(MAX_LIVES);
        setGuessedLetters(new Set());
        setMessageText('');
        setNextButtonVisible(false);
        // Shuffle words if not already shuffled or if starting a new game
        if (gameWords.length === 0 || currentWordIndex === 0) {
            setGameWords([...gameData.words].sort(() => 0.5 - Math.random()));
        }
        // Update currentWordData will happen via currentWordIndex state change
    }, [currentWordIndex, gameWords]);

    useEffect(() => {
        if (gameState === 'start') {
            // Initialize the game when the component mounts or restarts
            setGameWords([...gameData.words].sort(() => 0.5 - Math.random()));
            setLives(MAX_LIVES);
            setGuessedLetters(new Set());
            setMessageText('');
            setNextButtonVisible(false);
            setIsWin(false);
            setCurrentWordIndex(0); // Ensure it starts from the first word
        }
    }, [gameState]);

    useEffect(() => {
        if (gameState === 'game' && currentWordData) {
            // This effect runs when currentWordIndex changes, effectively starting a new word
            // No need to call startNewWord here directly, as state updates will trigger re-renders
        }
    }, [gameState, currentWordIndex, currentWordData]);

    const endGame = useCallback((win: boolean) => {
        setIsWin(win);
        setGameState('end');
    }, []);

    const handleContinueCheckpoint = useCallback(() => {
        setGameState('game');
        setCurrentWordIndex(prev => prev + 1); // Advance to next word after checkpoint
        setLives(MAX_LIVES); // Restore lives at checkpoint
        setGuessedLetters(new Set());
        setMessageText('');
        setNextButtonVisible(false);
    }, []);

    const startGame = useCallback(() => {
        setGameState('game');
        setCurrentWordIndex(0);
        setScore(0);
        setLives(MAX_LIVES);
        setGuessedLetters(new Set());
        setMessageText('');
        setNextButtonVisible(false);
        setIsWin(false);
        setGameWords([...gameData.words].sort(() => 0.5 - Math.random()));
    }, []);

    const handleNextWord = useCallback(() => {
        setCurrentWordIndex(prev => prev + 1);
        startNewWord();
    }, [startNewWord]);

    const handleRestartGame = useCallback(() => {
        setGameState('start');
        setCurrentWordIndex(0);
        setScore(0);
        setLives(MAX_LIVES);
        setGuessedLetters(new Set());
        setMessageText('');
        setNextButtonVisible(false);
        setIsWin(false);
        setGameWords([...gameData.words].sort(() => 0.5 - Math.random())); // Reshuffle for new game
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-tr from-cyan-200 to-cyan-300 relative">
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

            <div className="flex flex-row items-center justify-center w-full max-w-7xl gap-4">
                {/* Left Side Video */}
                <div className="hidden lg:block w-1/4 h-screen">
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
                    <div id="progress-container" className={`w-full max-w-4xl mx-auto p-4 relative ${gameState === 'game' || gameState === 'checkpoint' ? '' : 'hidden'}`}>
                        <svg ref={pathSvgRef} id="path-svg" width="100%" height="100%"></svg>
                        <div ref={playerIconRef} id="player-icon" className="absolute top-1/2 left-0 mt-[15px] z-10 transition-transform duration-1000 ease-in-out" />
                    </div>

                    <div id="game-app" className="w-full max-w-3xl bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 text-center">
                        {gameState === 'start' && (
                            <div id="start-screen">
                                <h1 className={`text-4xl sm:text-5xl font-bold ${gradientTextClass}`}>Arctic Rescue</h1>
                                <h2 className="text-xl font-semibold text-gray-700 mt-2">A Word of Ice</h2>
                                <div id="ice-block-start" className="my-6 flex justify-center" dangerouslySetInnerHTML={{ __html: iceBlockStates[0] }}></div>
                                <p className="text-gray-600 mt-4 mb-8 max-w-md mx-auto">Kip the polar bear is stranded! Solve all {TOTAL_WORDS} climate-related words to move the rescue icon and bring him to safety. Good luck!</p>
                                <PixelButton onClick={startGame} className={buttonBaseClass}>Start Rescue Mission</PixelButton>
                            </div>
                        )}

                        {gameState === 'game' && currentWordData && (
                            <div id="game-screen">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-left">
                                        <p className="text-sm text-gray-500">Rescue Points: <span id="score" className="font-bold text-gray-800">{score}</span></p>
                                    </div>
                                    <div id="ice-block-container" className="flex justify-center items-center h-20">
                                        {renderIceBlock()}
                                    </div>
                                </div>
                                <div id="lives-container" className="flex justify-center gap-2 my-3 p-2 bg-blue-100 border border-blue-300 rounded-md">
                                    {renderLives()}
                                </div>
                                <div className="bg-gray-50 p-6 rounded-lg mb-4 min-h-[180px] flex flex-col justify-center shadow-inner">
                                    <p className="text-gray-500 text-sm tracking-widest">RESCUE CLUE</p>
                                    <p id="hint-text" className="text-2xl font-semibold text-gray-800 mb-6">{currentWordData.hint}</p>
                                    <div id="word-display" className="flex justify-center gap-2">
                                        {renderWordDisplay()}
                                    </div>
                                </div>
                                <p id="message-text" className={`text-2xl h-10 font-bold mb-4 ${messageText.includes('Path Extended') ? 'text-cyan-600' : messageText.includes('The word was') ? 'text-red-500' : ''}`}>{messageText}</p>
                                <div id="keyboard-container" className="grid grid-cols-7 sm:grid-cols-9 gap-2">
                                    {renderKeyboard()}
                                </div>
                                {nextButtonVisible && (
                                    <div id="next-btn-container" className="mt-4">
                                        <PixelButton onClick={handleNextWord} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg mt-4">
                                            {currentWordIndex < TOTAL_WORDS - 1 ? 'Next Rescue Step' : 'Finish Rescue'}
                                        </PixelButton>
                                    </div>
                                )}
                            </div>
                        )}

                        {gameState === 'end' && (
                            <div id="end-screen">
                                <h1 id="end-title" className={`text-4xl sm:text-5xl font-bold ${gradientTextClass}`}>{isWin ? "Kip is Safe!" : "The Ice Melted..."}</h1>
                                <p id="end-message" className="text-lg text-gray-600 mt-4">{isWin ? "You're a climate hero! Thanks to you, Kip reached safety." : "Kip couldn't be saved this time. Let's try again!"}</p>
                                <p className="text-lg text-gray-600 mt-4">Your Final Score:</p>
                                <p id="final-score" className="text-6xl font-bold text-cyan-500 my-4">{score}</p>
                                <PixelButton onClick={handleRestartGame} className={buttonBaseClass}>Start New Rescue</PixelButton>
                                <Link to="/sus-game/dashboard" className={`${buttonBaseClass} bg-gray-500 hover:bg-gray-600 text-white mt-4 inline-block`}>Back to Dashboard</Link>
                            </div>
                        )}
                        
                        {gameState === 'checkpoint' && (
                            <div id="checkpoint-screen" className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
                                <div className="bg-white p-8 rounded-lg text-center shadow-2xl max-w-sm">
                                    <h2 className={`text-3xl font-bold ${gradientTextClass}`}>Checkpoint!</h2>
                                    <p className="text-gray-600 my-4">You're halfway there! The mission has been resupplied. Your health is fully restored for the final stretch!</p>
                                    <PixelButton onClick={handleContinueCheckpoint} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg text-lg">Continue Rescue</PixelButton>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side Video */}
                <div className="hidden lg:block w-1/4 h-screen">
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

export default HangmanGame;
