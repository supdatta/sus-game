import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PixelButton } from '../components/ui/pixel-button';
import { ArrowLeft } from 'lucide-react';

// Styling inspired by quiz.html
const gradientTextClass = "bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent";
const buttonBaseClass = "w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105";

const quizData = {
    "questions": [
        { "question": "What is the primary cause of recent global climate change?", "options": ["Volcanic Eruptions", "Burning Fossil Fuels", "Solar Flares", "Earth's Orbital Shift"], "answer": "Burning Fossil Fuels", "hint": "It releases gases that trap heat." },
        { "question": "Which gas is most responsible for the greenhouse effect?", "options": ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], "answer": "Carbon Dioxide", "hint": "Often abbreviated as CO₂." },
        { "question": "What international agreement aims to limit global warming?", "options": ["The Kyoto Protocol", "The Geneva Convention", "The Paris Agreement", "The Antarctic Treaty"], "answer": "The Paris Agreement", "hint": "It was adopted in 2015." },
        { "question": "What does a person's 'carbon footprint' measure?", "options": ["Their shoe size", "How much they walk", "Their total greenhouse gas emissions", "Their recycling habits"], "answer": "Their total greenhouse gas emissions", "hint": "Think of it as your impact on the climate." },
        { "question": "Which of these is a key renewable energy source?", "options": ["Natural Gas", "Coal", "Nuclear", "Wind Power"], "answer": "Wind Power", "hint": "It uses turbines to generate electricity." },
        { "question": "How does deforestation contribute to climate change?", "options": ["It cools the planet", "It increases oxygen levels", "It reduces Earth's ability to absorb CO₂", "It causes earthquakes"], "answer": "It reduces Earth's ability to absorb CO₂", "hint": "Trees are like the lungs of our planet." },
        { "question": "What is ocean acidification?", "options": ["Oceans becoming saltier", "Oceans getting warmer", "A decrease in the pH of the ocean", "An increase in marine life"], "answer": "A decrease in the pH of the ocean", "hint": "It's caused by the uptake of CO₂ from the atmosphere." },
        { "question": "Complete the environmental slogan: 'Reduce, Reuse, ...'", "options": ["Rebuild", "Recycle", "Regret", "Repeat"], "answer": "Recycle", "hint": "It's the third of the 'Three R's'." },
        { "question": "What is a major consequence of melting glaciers and ice sheets?", "options": ["Lower sea levels", "Creation of new mountains", "Rising sea levels", "Cooler global temperatures"], "answer": "Rising sea levels", "hint": "It threatens coastal cities around the world." },
        { "question": "Which of these is considered a sustainable mode of transportation?", "options": ["Driving a large SUV", "Flying in a private jet", "Bicycling", "Taking a cruise ship"], "answer": "Bicycling", "hint": "It's a zero-emission way to travel." }
    ]
};

const gaiaDialogues = {
  start: "Hello! I'm Gaia, the spirit of our Earth. Ready to test your knowledge and help our planet?",
  correct: ["Wonderful!", "You're a natural Earth Guardian!", "Our planet thanks you!", "That's the spirit!"],
  incorrect: "That's a tricky one. The correct answer was...",
  hint: "Of course! A little bit of wisdom to guide you.",
  lifeline: "Let's make this a little easier. I'll clear away two options for you.",
  skip: "No problem! Let's just skip this one and move on.",
  timer_low: "The clock is ticking! Trust your instincts.",
  end_high: "Amazing! You're a true Earth Guardian. Your knowledge is a beacon of hope!",
  end_medium: "Well done! You have a solid understanding. Keep nurturing your knowledge!",
  end_low: "A good start! Every seed of knowledge can grow into a mighty tree. Thank you for playing!"
};

const GaiaAvatar = () => (
    <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#a7f3d0" stroke="#0d9488" strokeWidth="4"/><path d="M 30 60 Q 50 75 70 60" stroke="#042f2e" strokeWidth="4" fill="none" strokeLinecap="round"/><circle cx="35" cy="45" r="5" fill="#042f2e"/><circle cx="65" cy="45" r="5" fill="#042f2e"/></svg>
);

const QuizPage: React.FC = () => {
    const navigate = useNavigate();
    const [gameState, setGameState] = useState<'start' | 'quiz' | 'end'>('start');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [hintCount, setHintCount] = useState(3);
    const [lifelineCount, setLifelineCount] = useState(3);
    const [skipUsed, setSkipUsed] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10); // 10 seconds per question
    const [npcText, setNpcText] = useState('');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
    const [hintDisplayed, setHintDisplayed] = useState<string | null>(null);
    const [disabledOptions, setDisabledOptions] = useState<string[]>([]); // Options disabled by 50/50
    const [allOptionsDisabled, setAllOptionsDisabled] = useState(false); // All options disabled after selection

    const timerIntervalRef = useRef<number | null>(null);
    const timerTimeoutRef = useRef<number | null>(null);

    const currentQuestion = quizData.questions[currentQuestionIndex];

    const updateNpcDialogue = useCallback((trigger: keyof typeof gaiaDialogues, extraInfo = '') => {
        let text = '';
        const dialogue = gaiaDialogues[trigger];
        if (Array.isArray(dialogue)) {
            text = dialogue[Math.floor(Math.random() * dialogue.length)];
        } else {
            text = dialogue;
        }
        setNpcText(text + (extraInfo ? ` ${extraInfo}` : ''));
    }, []);

    const resetState = useCallback(() => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
        setSelectedOption(null);
        setHintDisplayed(null);
        setDisabledOptions([]);
        setAllOptionsDisabled(false);
        setTimeLeft(10);
    }, []);

    const handleNextQuestion = useCallback(() => {
        resetState(); // Reset state before moving to next question
        if (currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setGameState('end');
        }
    }, [currentQuestionIndex, resetState]);

    const selectAnswer = useCallback((option: string | null) => {
        if (allOptionsDisabled) return; // Prevent multiple selections or interaction after timer runs out
        setAllOptionsDisabled(true); // Disable all options immediately upon selection

        setSelectedOption(option);
        const correctAnswer = currentQuestion.answer;

        if (option === correctAnswer) {
            setScore(prev => prev + 10);
            updateNpcDialogue('correct');
        } else {
            updateNpcDialogue('incorrect', `The correct answer was "${correctAnswer}"`);
        }
        
        // Clear timer and set timeout for next question
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
        setTimeout(handleNextQuestion, 3000); // Hold for 3 seconds for visual feedback
    }, [currentQuestion, allOptionsDisabled, updateNpcDialogue, handleNextQuestion]);

    const startTimer = useCallback(() => {
        setTimeLeft(10);
        let timerWarningSent = false;

        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);

        timerIntervalRef.current = window.setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0.1) { // Use 0.1 to account for floating point inaccuracies
                    clearInterval(timerIntervalRef.current!);
                    selectAnswer(null); // Time's up, no answer selected
                    return 0;
                }
                if (prev < 4 && !timerWarningSent) {
                    updateNpcDialogue('timer_low');
                    timerWarningSent = true;
                }
                return prev - 0.1;
            });
        }, 100);

        timerTimeoutRef.current = window.setTimeout(() => {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            selectAnswer(null); // Time's up
        }, 10000);
    }, [selectAnswer, updateNpcDialogue]);

    const startGame = useCallback(() => {
        setGameState('quiz');
        setCurrentQuestionIndex(0);
        setScore(0);
        setHintCount(3);
        setLifelineCount(3);
        setSkipUsed(false);
        updateNpcDialogue('start');
        resetState(); // Ensure state is clean before showing first question
    }, [updateNpcDialogue, resetState]);

    useEffect(() => {
        if (gameState === 'quiz' && currentQuestion) {
            setShuffledOptions(currentQuestion.options.sort(() => Math.random() - 0.5));
            startTimer();
        } else if (gameState === 'end') {
            resetState();
        }
        return () => {
            resetState();
        };
    }, [gameState, currentQuestionIndex, currentQuestion, startTimer, resetState]);

    const useHint = useCallback(() => {
        if (hintCount > 0 && hintDisplayed === null) {
            setHintCount(prev => prev - 1);
            updateNpcDialogue('hint');
            setHintDisplayed(currentQuestion.hint);
        }
    }, [hintCount, hintDisplayed, updateNpcDialogue, currentQuestion.hint]);

    const useLifeline = useCallback(() => {
        if (lifelineCount > 0 && currentQuestion && shuffledOptions.length > 2) {
            setLifelineCount(prev => prev - 1);
            updateNpcDialogue('lifeline');
            
            const correctAnswer = currentQuestion.answer;
            const incorrectOptions = shuffledOptions.filter(opt => opt !== correctAnswer && !disabledOptions.includes(opt));
            
            // Disable two random incorrect options
            const optionsToDisable: string[] = [];
            while (optionsToDisable.length < 2 && incorrectOptions.length > 0) {
                const randomIndex = Math.floor(Math.random() * incorrectOptions.length);
                optionsToDisable.push(incorrectOptions.splice(randomIndex, 1)[0]);
            }
            setDisabledOptions(prev => [...prev, ...optionsToDisable]);
        }
    }, [lifelineCount, currentQuestion, shuffledOptions, disabledOptions, updateNpcDialogue]);

    const useSkip = useCallback(() => {
        if (!skipUsed) {
            setSkipUsed(true);
            setScore(prev => prev + 5); // Award partial points for skipping
            updateNpcDialogue('skip');
            handleNextQuestion();
        }
    }, [skipUsed, updateNpcDialogue, handleNextQuestion]);

    const getEndMessage = useCallback(() => {
        if (score >= 80) return gaiaDialogues.end_high;
        if (score >= 50) return gaiaDialogues.end_medium;
        return gaiaDialogues.end_low;
    }, [score]);

    const getEndTitle = useCallback(() => {
        if (score >= 80) return "Congratulations!";
        if (score >= 50) return "Great Job!";
        return "Thanks for Playing!";
    }, [score]);

    const renderScreen = () => {
        switch (gameState) {
            case 'start':
                return (
                    <div id="start-screen">
                        <h1 className={`text-3xl sm:text-4xl font-bold ${gradientTextClass}`}>Gaia's Challenge</h1>
                        <p className="text-gray-600 mt-2 mb-6">Test your knowledge and become an Earth Guardian!</p>
                        <PixelButton onClick={startGame} className={buttonBaseClass}>Start Quiz</PixelButton>
                    </div>
                );
            case 'quiz':
                return (
                    <div id="quiz-screen">
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-left">
                                <p className="text-sm text-gray-500">Score: <span id="score" className="font-bold text-gray-800">{score}</span></p>
                                <p className="text-sm text-gray-500">Question: <span id="question-counter" className="font-bold text-gray-800">{currentQuestionIndex + 1}/{quizData.questions.length}</span></p>
                            </div>
                            <div className="flex gap-3">
                                <PixelButton onClick={useSkip} disabled={skipUsed} className="bg-purple-400 hover:bg-purple-500 text-purple-900 font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md">Skip</PixelButton>
                                <PixelButton onClick={useLifeline} disabled={lifelineCount === 0 || allOptionsDisabled || shuffledOptions.filter(o => !disabledOptions.includes(o)).length <= 2} className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md">50/50 (<span>{lifelineCount}</span>)</PixelButton>
                                <PixelButton onClick={useHint} disabled={hintCount === 0 || hintDisplayed !== null} className="bg-sky-400 hover:bg-sky-500 text-sky-900 font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md">Hint (<span>{hintCount}</span>)</PixelButton>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-md h-2.5 mb-4">
                            <div style={{ width: `${(timeLeft / 10) * 100}%`, backgroundColor: timeLeft < 4 ? '#f87171' : timeLeft < 7 ? '#facc15' : '#14B8A6' }} className="h-full rounded-md transition-all duration-100 linear"></div>
                        </div>
                        <div id="npc-dialogue-box" className="flex items-center gap-4 relative bg-teal-50/80 border border-teal-100 p-3 rounded-lg mb-4 min-h-[70px]">
                            <div id="npc-avatar" className="w-12 h-12 flex-shrink-0"><GaiaAvatar /></div>
                            <p id="npc-text" className="text-sm text-left text-cyan-900">{npcText}</p>
                        </div>
                        <h2 id="question-text" className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 min-h-[80px]">{currentQuestion?.question || 'Loading question...'}</h2>
                        <div id="options-container" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {shuffledOptions.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => selectAnswer(option)}
                                    className={`option-btn p-4 rounded-lg text-left bg-white border border-gray-200 text-gray-800 font-semibold hover:border-cyan-600 transition-all duration-200
                                        ${selectedOption !== null && option === currentQuestion.answer ? 'bg-green-500 border-green-500 text-white' : ''}
                                        ${selectedOption === option && option !== currentQuestion.answer ? 'bg-red-500 border-red-500 text-white' : ''}
                                        ${disabledOptions.includes(option) ? 'opacity-40 cursor-not-allowed' : ''}
                                    `}
                                    disabled={allOptionsDisabled || disabledOptions.includes(option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        {hintDisplayed && (
                            <div className="mt-4 p-3 bg-sky-50 border border-sky-200 rounded-lg text-sm text-sky-800 font-semibold">
                                Hint: {hintDisplayed}
                            </div>
                        )}
                    </div>
                );
            case 'end':
                return (
                    <div id="end-screen">
                        <h1 id="end-title" className={`text-3xl sm:text-4xl font-bold ${gradientTextClass}`}>{getEndTitle()}</h1>
                        <p id="end-message" className="text-gray-600 mt-2">{getEndMessage()}</p>
                        <p className="text-lg text-gray-600 mt-4">Your Final Score:</p>
                        <p id="final-score" className="text-5xl font-bold text-teal-500 my-4">{score}</p>
                        <PixelButton onClick={startGame} className={`${buttonBaseClass} mt-4`}>Play Again</PixelButton>
                        <Link to="/sus-game/dashboard" className={`${buttonBaseClass} bg-gray-500 hover:bg-gray-600 text-white mt-4 inline-block`}>Back to Dashboard</Link>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-tr from-cyan-200 to-cyan-300 relative">
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

            <div className="w-1/4 h-screen">
                <video autoPlay loop muted className="w-full h-full object-cover">
                    <source src="/sus-game/video1.mp4" type="video/mp4" />
                </video>
            </div>
            <div className="w-1/2 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl game-container rounded-2xl shadow-xl p-6 md:p-8 text-center mx-auto bg-white/90 backdrop-blur-md">
                    {renderScreen()}
                </div>
            </div>
            <div className="w-1/4 h-screen">
                <video autoPlay loop muted className="w-full h-full object-cover">
                    <source src="/sus-game/video2.mp4" type="video/mp4" />
                </video>
            </div>
        </div>
    );
};

export default QuizPage;
