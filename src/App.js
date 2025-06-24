import React, { useState, useEffect } from 'react';
import Words from './Words';
import Keyboard from './Keyboard';
import './App.css';

// Original Wordle word list (answers only - common 5-letter words)
const WORDLE_WORDS = [
  'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN',
  'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE',
  'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'AMONG', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLE',
  'APPLY', 'ARENA', 'ARGUE', 'ARISE', 'ARRAY', 'ASIDE', 'ASSET', 'AUDIO', 'AUDIT', 'AVOID',
  'AWAKE', 'AWARE', 'BADLY', 'BAKER', 'BASES', 'BASIC', 'BEACH', 'BEGAN', 'BEGIN', 'BEING',
  'BELOW', 'BENCH', 'BILLY', 'BIRTH', 'BLACK', 'BLAME', 'BLANK', 'BLAST', 'BLIND', 'BLOCK',
  'BLOOD', 'BOARD', 'BOAST', 'BOATS', 'BOBBY', 'BONES', 'BONUS', 'BOOST', 'BOOTH', 'BOUND',
  'BRAIN', 'BRAND', 'BRASS', 'BRAVE', 'BREAD', 'BREAK', 'BREED', 'BRIEF', 'BRING', 'BROAD',
  'BROKE', 'BROWN', 'BUILD', 'BUILT', 'BUYER', 'CABLE', 'CALIF', 'CARRY', 'CATCH', 'CAUSE',
  'CHAIN', 'CHAIR', 'CHAOS', 'CHARM', 'CHART', 'CHASE', 'CHEAP', 'CHECK', 'CHEST', 'CHIEF',
  'CHILD', 'CHINA', 'CHOSE', 'CIVIL', 'CLAIM', 'CLASS', 'CLEAN', 'CLEAR', 'CLICK', 'CLIMB',
  'CLOCK', 'CLOSE', 'CLOUD', 'COACH', 'COAST', 'COULD', 'COUNT', 'COURT', 'COVER', 'CRAFT',
  'CRASH', 'CRAZY', 'CREAM', 'CRIME', 'CROSS', 'CROWD', 'CROWN', 'CRUDE', 'CURVE', 'CYCLE',
  'DAILY', 'DANCE', 'DATED', 'DEALT', 'DEATH', 'DEBUT', 'DELAY', 'DEPTH', 'DOING', 'DOUBT',
  'DOZEN', 'DRAFT', 'DRAMA', 'DRANK', 'DREAM', 'DRESS', 'DRILL', 'DRINK', 'DRIVE', 'DROVE',
  'DYING', 'EAGER', 'EARLY', 'EARTH', 'EIGHT', 'ELITE', 'EMPTY', 'ENEMY', 'ENJOY', 'ENTER',
  'ENTRY', 'EQUAL', 'ERROR', 'EVENT', 'EVERY', 'EXACT', 'EXIST', 'EXTRA', 'FAITH', 'FALSE',
  'FAULT', 'FIBER', 'FIELD', 'FIFTH', 'FIFTY', 'FIGHT', 'FINAL', 'FIRST', 'FIXED', 'FLASH',
  'FLEET', 'FLOOR', 'FLUID', 'FOCUS', 'FORCE', 'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FRAME',
  'FRANK', 'FRAUD', 'FRESH', 'FRONT', 'FROST', 'FUNNY', 'GIANT', 'GIVEN', 'GLASS', 'GLOBE',
  'GOING', 'GRACE', 'GRADE', 'GRAND', 'GRANT', 'GRASS', 'GRAVE', 'GREAT', 'GREEN', 'GROSS',
  'GROUP', 'GROWN', 'GUARD', 'GUESS', 'GUEST', 'GUIDE', 'HAPPY', 'HARRY', 'HEART', 'HEAVY',
  'HENCE', 'HENRY', 'HORSE', 'HOTEL', 'HOUSE', 'HUMAN', 'IDEAL', 'IMAGE', 'INDEX', 'INNER',
  'INPUT', 'ISSUE', 'JAPAN', 'JIMMY', 'JOINT', 'JONES', 'JUDGE', 'KNOWN', 'LABEL', 'LARGE',
  'LASER', 'LATER', 'LAUGH', 'LAYER', 'LEARN', 'LEASE', 'LEAST', 'LEAVE', 'LEGAL', 'LEVEL',
  'LEWIS', 'LIGHT', 'LIMIT', 'LINKS', 'LIVES', 'LOCAL', 'LOOSE', 'LOWER', 'LUCKY', 'LUNCH',
  'LYING', 'MAGIC', 'MAJOR', 'MAKER', 'MARCH', 'MARIA', 'MATCH', 'MAYBE', 'MAYOR', 'MEANT',
  'MEDIA', 'METAL', 'MIGHT', 'MINOR', 'MINUS', 'MIXED', 'MODEL', 'MONEY', 'MONTH', 'MORAL',
  'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH', 'MOVED', 'MOVIE', 'MUSIC', 'NEEDS', 'NEVER', 'NEWLY',
  'NIGHT', 'NOISE', 'NORTH', 'NOTED', 'NOVEL', 'NURSE', 'OCCUR', 'OCEAN', 'OFFER', 'OFTEN',
  'ORDER', 'OTHER', 'OUGHT', 'PAINT', 'PANEL', 'PAPER', 'PARTY', 'PEACE', 'PETER', 'PHASE',
  'PHONE', 'PHOTO', 'PIANO', 'PIECE', 'PILOT', 'PITCH', 'PLACE', 'PLAIN', 'PLANE', 'PLANT',
  'PLATE', 'POINT', 'POUND', 'POWER', 'PRESS', 'PRICE', 'PRIDE', 'PRIME', 'PRINT', 'PRIOR',
  'PRIZE', 'PROOF', 'PROUD', 'PROVE', 'QUEEN', 'QUICK', 'QUIET', 'QUITE', 'RADIO', 'RAISE',
  'RANGE', 'RAPID', 'RATIO', 'REACH', 'READY', 'REALM', 'REBEL', 'REFER', 'RELAX', 'REMOT',
  'REPLY', 'RIGHT', 'RIGID', 'RIVER', 'ROBOT', 'ROGER', 'ROMAN', 'ROUGH', 'ROUND', 'ROUTE',
  'ROYAL', 'RURAL', 'SCALE', 'SCENE', 'SCOPE', 'SCORE', 'SENSE', 'SERVE', 'SETUP', 'SEVEN',
  'SHALL', 'SHAPE', 'SHARE', 'SHARP', 'SHEET', 'SHELF', 'SHELL', 'SHIFT', 'SHINE', 'SHIRT',
  'SHOCK', 'SHOOT', 'SHORT', 'SHOWN', 'SIDES', 'SIGHT', 'SILLY', 'SINCE', 'SIXTH', 'SIXTY',
  'SIZED', 'SKILL', 'SLEEP', 'SLIDE', 'SMALL', 'SMART', 'SMILE', 'SMITH', 'SMOKE', 'SOLID',
  'SOLVE', 'SORRY', 'SOUND', 'SOUTH', 'SPACE', 'SPARE', 'SPEAK', 'SPEED', 'SPEND', 'SPENT',
  'SPLIT', 'SPOKE', 'SPORT', 'STAFF', 'STAGE', 'STAKE', 'STAND', 'START', 'STATE', 'STEAM',
  'STEEL', 'STICK', 'STILL', 'STOCK', 'STONE', 'STOOD', 'STORE', 'STORM', 'STORY', 'STRIP',
  'STUCK', 'STUDY', 'STUFF', 'STYLE', 'SUGAR', 'SUITE', 'SUPER', 'SWEET', 'TABLE', 'TAKEN',
  'TASTE', 'TAXES', 'TEACH', 'TEAMS', 'TEETH', 'TEMPO', 'TERMS', 'TESTS', 'THANK', 'THEFT',
  'THEIR', 'THEME', 'THERE', 'THESE', 'THICK', 'THING', 'THINK', 'THIRD', 'THOSE', 'THREE',
  'THREW', 'THROW', 'THUMB', 'TIGHT', 'TIRED', 'TITLE', 'TODAY', 'TOPIC', 'TOTAL', 'TOUCH',
  'TOUGH', 'TOWER', 'TRACK', 'TRADE', 'TRAIN', 'TREAT', 'TREND', 'TRIAL', 'TRIBE', 'TRICK',
  'TRIED', 'TRIES', 'TRUCK', 'TRULY', 'TRUNK', 'TRUST', 'TRUTH', 'TWICE', 'UNCLE', 'UNDER',
  'UNDUE', 'UNION', 'UNITY', 'UNTIL', 'UPPER', 'UPSET', 'URBAN', 'USAGE', 'USUAL', 'VALID',
  'VALUE', 'VIDEO', 'VIRUS', 'VISIT', 'VITAL', 'VOCAL', 'VOICE', 'WASTE', 'WATCH', 'WATER',
  'WHEEL', 'WHERE', 'WHICH', 'WHILE', 'WHITE', 'WHOLE', 'WHOSE', 'WOMAN', 'WOMEN', 'WORLD',
  'WORRY', 'WORSE', 'WORST', 'WORTH', 'WOULD', 'WRITE', 'WRONG', 'WROTE', 'YOUNG', 'YOUTH'
];

function App() {
  const [targetWord, setTargetWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState({});
  const [isValidating, setIsValidating] = useState(false);
  const [gameResult, setGameResult] = useState(''); // 'won', 'lost', or ''
  const [invalidWord, setInvalidWord] = useState(false);
  const [wordList, setWordList] = useState([]);

  useEffect(() => {
    // Load dictionary from file
    const loadDictionary = async () => {
      try {
        const response = await fetch('/dictionary.txt');
        const text = await response.text();
        const words = text.trim().split('\n').map(word => word.trim().toUpperCase());
        setWordList(words);
        
        // Pick a random word when dictionary is loaded
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setTargetWord(randomWord);
      } catch (error) {
        console.error('Failed to load dictionary:', error);
        // Fallback to hardcoded words
        setWordList(WORDLE_WORDS);
        const randomWord = WORDLE_WORDS[Math.floor(Math.random() * WORDLE_WORDS.length)];
        setTargetWord(randomWord);
      }
    };
  
    loadDictionary();
  }, []);

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (event) => {
      event.preventDefault();
      const key = event.key.toUpperCase();
      
      if (key === 'ENTER') {
        handleKeyPress('ENTER');
      } else if (key === 'BACKSPACE') {
        handleKeyPress('BACKSPACE');
      } else if (key.match(/[A-Z]/) && key.length === 1) {
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, currentRow, gameOver, targetWord]);

  const validateWord = (word) => {
    return wordList.includes(word.toUpperCase());
  };

  const updateKeyboardStatus = (guess) => {
    const newKeyboardStatus = { ...keyboardStatus };
    
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      
      if (targetWord[i] === letter) {
        newKeyboardStatus[letter] = 'correct';
      } else if (targetWord.includes(letter) && newKeyboardStatus[letter] !== 'correct') {
        newKeyboardStatus[letter] = 'present';
      } else if (!targetWord.includes(letter)) {
        newKeyboardStatus[letter] = 'absent';
      }
    }
    
    setKeyboardStatus(newKeyboardStatus);
  };

  const handleKeyPress = (key) => {
    if (gameOver || isValidating) return;

    if (key === 'ENTER') {
      if (currentGuess.length === 5) {
        setIsValidating(true);
        setInvalidWord(false);
        
        // Validate the word (now instant)
        const isValid = validateWord(currentGuess);
        
        if (!isValid) {
          setInvalidWord(true);
          setIsValidating(false);
          return;
        }
        
        const newGuesses = [...guesses];
        newGuesses[currentRow] = currentGuess;
        setGuesses(newGuesses);
        
        updateKeyboardStatus(currentGuess);
        
        if (currentGuess === targetWord) {
          setGameOver(true);
          setGameResult('won');
        } else if (currentRow === 5) {
          setGameOver(true);
          setGameResult('lost');
        } else {
          setCurrentRow(currentRow + 1);
        }
        setCurrentGuess('');
        setIsValidating(false);
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(currentGuess.slice(0, -1));
      setInvalidWord(false);
    } else if (key.length === 1 && currentGuess.length < 5) {
      setCurrentGuess(currentGuess + key);
      setInvalidWord(false);
    }
  };

  const resetGame = () => {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    setTargetWord(randomWord);
    setCurrentGuess('');
    setGuesses([]);
    setCurrentRow(0);
    setGameOver(false);
    setKeyboardStatus({});
    setGameResult('');
    setIsValidating(false);
    setInvalidWord(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Wordle Game</h1>
        <button onClick={resetGame} className="reset-button">New Game</button>
        <div className="game-status">
          {gameResult === 'won' && <div className="status-message win">You Won!</div>}
          {gameResult === 'lost' && <div className="status-message lose">The word was: {targetWord}</div>}
        </div>
        <div className="game-container">
          <Words 
            guesses={guesses}
            currentGuess={currentGuess}
            currentRow={currentRow}
            targetWord={targetWord}
            gameResult={gameResult}
            invalidWord={invalidWord}
          />
        </div>
        <Keyboard onKeyPress={handleKeyPress} keyboardStatus={keyboardStatus} />
      </header>
    </div>
  );
}

export default App;