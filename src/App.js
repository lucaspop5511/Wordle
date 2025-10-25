import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight, faBars, faBorderAll, faTrash } from '@fortawesome/free-solid-svg-icons';
import Words from './Words';
import Keyboard from './Keyboard';
import History from './History';
import CustomAlert from './CustomAlert';
import Gamemode from './Gamemode';
import './App.css';

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
  const [gamemodeWordList, setGamemodeWordList] = useState([]);
  const [activePanel, setActivePanel] = useState('game'); // 'game' or 'history'
  const [gameHistory, setGameHistory] = useState([]);
  const [displayWord, setDisplayWord] = useState('*****');
  const [showAlert, setShowAlert] = useState(false);
  const [currentGamemode, setCurrentGamemode] = useState('classic');

  // Apply CSS variables for current gamemode
  useEffect(() => {
    const root = document.documentElement;
    const gamemodeColors = {
      classic: { primary: '#6aaa64', secondary: '#c9b458', secondaryfade: '#c9b45882'  },
      names: { primary: '#0cc0df', secondary: '#4c6e9b', secondaryfade: '#4c6e9ba1' },
      places: { primary: '#e4dedc', secondary: '#b6b1a4', secondaryfade: '#b6b1a4a9', text: '#3b3b3d' }
    };
    
    const colors = gamemodeColors[currentGamemode];
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--secondary-color', colors.secondary);
    root.style.setProperty('--secondary-color-fade', colors.secondaryfade);
    root.style.setProperty('--text-color', colors.text);
  }, [currentGamemode]);

  // Load game history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(`wordleHistory_${currentGamemode}`);
    if (savedHistory) {
      try {
        setGameHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to load game history:', error);
      }
    } else {
      setGameHistory([]);
    }
  }, [currentGamemode]);

  // Save game history to localStorage whenever it changes
  useEffect(() => {
    if (gameHistory.length > 0) {
      localStorage.setItem(`wordleHistory_${currentGamemode}`, JSON.stringify(gameHistory));
    }
  }, [gameHistory, currentGamemode]);

  // Update display word based on submitted guesses only
  useEffect(() => {
    if (!targetWord) return;
    
    let newDisplayWord = targetWord.split('').map(() => '*');
    
    // Check only completed/submitted guesses for correct positions
    guesses.forEach(guess => {
      if (guess && guess.length === 5) {
        for (let i = 0; i < 5; i++) {
          if (guess[i] === targetWord[i]) {
            newDisplayWord[i] = targetWord[i];
          }
        }
      }
    });
    
    // If game is over and lost, show the full word
    if (gameResult === 'lost') {
      newDisplayWord = targetWord.split('');
    }
    
    setDisplayWord(newDisplayWord.join(''));
  }, [targetWord, guesses, gameResult]);

  useEffect(() => {
    // Load dictionaries
    const loadDictionaries = async () => {
      try {
        // Always load the classic dictionary for validation
        const classicResponse = await fetch('/dictionary.txt');
        const classicText = await classicResponse.text();
        const classicWords = classicText.trim().split('\n').map(word => word.trim().toUpperCase());
        
        // Load the gamemode-specific dictionary
        const gamemodeFiles = {
          classic: '/dictionary.txt',
          names: '/dictionaryNames.txt',
          places: '/dictionaryPlaces.txt'
        };
        
        const gamemodeResponse = await fetch(gamemodeFiles[currentGamemode]);
        const gamemodeText = await gamemodeResponse.text();
        const gamemodeWords = gamemodeText.trim().split('\n').map(word => word.trim().toUpperCase());
        
        // For validation, combine classic + gamemode words (except for classic mode)
        const validationWords = currentGamemode === 'classic' 
          ? classicWords 
          : [...new Set([...classicWords, ...gamemodeWords])];
        
        setWordList(validationWords);
        setGamemodeWordList(gamemodeWords);
        
        // Pick a random word from the gamemode dictionary
        const randomWord = gamemodeWords[Math.floor(Math.random() * gamemodeWords.length)];
        setTargetWord(randomWord);
      } catch (error) {
        console.error('Failed to load dictionaries:', error);
        alert('Failed to load word dictionaries. Please refresh the page.');
      }
    };
  
    loadDictionaries();
  }, [currentGamemode]);

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (activePanel !== 'game') return; // Only handle keys when game panel is active
      
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
  }, [currentGuess, currentRow, gameOver, targetWord, activePanel]);

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

  const saveGameToHistory = (won, finalGuesses) => {
    const gameData = {
      targetWord: targetWord,
      guesses: finalGuesses,
      won: won,
      date: new Date().toISOString(),
    };
    
    setGameHistory(prev => {
      const newHistory = [...prev, gameData];
      // Keep only the last 12 games
      return newHistory.slice(-12);
    });
  };

  const handleKeyPress = (key) => {
    if (gameOver || isValidating || activePanel !== 'game') return;

    if (key === 'ENTER') {
      if (currentGuess.length === 5) {
        setIsValidating(true);
        setInvalidWord(false);
        
        // Validate the word
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
          saveGameToHistory(true, newGuesses);
        } else if (currentRow === 5) {
          setGameOver(true);
          setGameResult('lost');
          saveGameToHistory(false, newGuesses);
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
    if (gamemodeWordList.length === 0) return;
    
    const randomWord = gamemodeWordList[Math.floor(Math.random() * gamemodeWordList.length)];
    setTargetWord(randomWord);
    setCurrentGuess('');
    setGuesses([]);
    setCurrentRow(0);
    setGameOver(false);
    setKeyboardStatus({});
    setGameResult('');
    setIsValidating(false);
    setInvalidWord(false);
    setDisplayWord('*****');
    setActivePanel('game');
  };

  const handleGamemodeChange = (gamemode) => {
    setCurrentGamemode(gamemode.id);
    // Reset game state when changing gamemode
    setCurrentGuess('');
    setGuesses([]);
    setCurrentRow(0);
    setGameOver(false);
    setKeyboardStatus({});
    setGameResult('');
    setIsValidating(false);
    setInvalidWord(false);
    setDisplayWord('*****');
  };

  const togglePanel = () => {
    setActivePanel(prev => prev === 'game' ? 'history' : 'game');
  };

  const clearHistory = () => {
    setShowAlert(true);
  };

  const handleConfirmClearHistory = () => {
    setGameHistory([]);
    localStorage.removeItem(`wordleHistory_${currentGamemode}`);
    setShowAlert(false);
  };

  const handleCancelClearHistory = () => {
    setShowAlert(false);
  };

  const getTitleLogo = () => {
    const logoFiles = {
      classic: '/titlelogo.png',
      names: '/titlelogo-names.png',
      places: '/titlelogo-places.png'
    };
    return logoFiles[currentGamemode] || logoFiles.classic;
  };

  const getHeaderTitle = () => {
    if (activePanel === 'history') {
      return 'HISTORY';
    }
    return displayWord;
  };

  return (
    <div className="App">
      <header className="App-header">
        <img className='app-title' src={getTitleLogo()} alt='WordL'/>
        <Gamemode
          currentGamemode={currentGamemode}
          onGamemodeChange={handleGamemodeChange}
        />
        
        <div className="game-section">
          <div className="section-header">
            <div className="header-title">{getHeaderTitle()}</div>
            <div className="header-controls">
              {activePanel === 'game' ? (
                <button onClick={resetGame} className="header-button new-game-btn">
                  <FontAwesomeIcon icon={faArrowRotateRight} />
                </button>
              ) : (
                <button onClick={clearHistory} className="header-button trash-btn">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
              <button onClick={togglePanel} className="header-button menu-btn">
                {activePanel === 'game' ? (
                  <FontAwesomeIcon icon={faBars} />
                ) : (
                  <FontAwesomeIcon icon={faBorderAll} />
                )}
              </button>
            </div>
          </div>
          
          <div className="main-content">
            {activePanel === 'game' ? (
              <Words 
                guesses={guesses}
                currentGuess={currentGuess}
                currentRow={currentRow}
                targetWord={targetWord}
                gameResult={gameResult}
                invalidWord={invalidWord}
              />
            ) : (
              <History 
                gameHistory={gameHistory}
                onClearHistory={clearHistory}
              />
            )}
          </div>
          
          <Keyboard onKeyPress={handleKeyPress} keyboardStatus={keyboardStatus} />
        </div>
      </header>
      
      <CustomAlert
        isOpen={showAlert}
        title="Really?"
        gamemode={currentGamemode.charAt(0).toUpperCase() + currentGamemode.slice(1)}
        onConfirm={handleConfirmClearHistory}
        onCancel={handleCancelClearHistory}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}

export default App;