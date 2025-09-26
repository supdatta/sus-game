import { useParams } from 'react-router-dom';
import CrosswordGame from './CrosswordGame';
import HangmanGame from './HangmanGame';
import WordSearchGame from './WordSearchGame';
import QuizPage from './QuizPage';
import { MinigameLayout } from '../components/MinigameLayout';

const GamePage = () => {
    const { questId } = useParams();
    console.log("Current questId:", questId);

    const getGameInfo = () => {
        switch (questId) {
            case 'crossword':
                return { component: <CrosswordGame />, title: 'Crossword Game', subtitle: '', videoSrc: '/video1.mp4' };
            case 'hangman':
                return { component: <HangmanGame />, title: 'Hangman', subtitle: 'Guess the Word', videoSrc: '/video1.mp4' };
            case 'wordsearch':
                return { component: <WordSearchGame />, title: 'Word Search Game', subtitle: '', videoSrc: '/video2.mp4' };
            case 'quiz':
                return { component: <QuizPage />, title: 'Quiz', subtitle: 'Test Your Knowledge', videoSrc: '/video2.mp4' };
            default:
                return { component: <div>Game not found</div>, title: 'Error', subtitle: 'Game not found' };
        }
    };

    const { component, title, subtitle, videoSrc } = getGameInfo();

    return (
        <MinigameLayout gameTitle={title} gameSubtitle={subtitle} videoSrc={videoSrc}>
            {component}
        </MinigameLayout>
    );
};

export default GamePage;
