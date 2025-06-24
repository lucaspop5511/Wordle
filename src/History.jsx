import React from 'react';
import './History.css';

const History = ({ gameHistory, onClearHistory }) => {
  const getLetterStatus = (letter, position, guess, targetWord) => {
    if (!targetWord || !letter) return '';
    
    if (targetWord[position] === letter) {
      return 'correct';
    }
    
    if (!targetWord.includes(letter)) {
      return 'absent';
    }
    
    const targetLetterCount = targetWord.split('').filter(l => l === letter).length;
    
    let correctCount = 0;
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === letter && targetWord[i] === letter) {
        correctCount++;
      }
    }
    
    let yellowCount = 0;
    for (let i = 0; i < position; i++) {
      if (guess[i] === letter && targetWord[i] !== letter && targetWord.includes(letter)) {
        yellowCount++;
      }
    }
    
    if (correctCount + yellowCount < targetLetterCount) {
      return 'present';
    }
    
    return 'absent';
  };

  const renderGameGrid = (game, index) => {
    return (
      <div key={index} className="history-game">
        <div className="history-word">{game.targetWord}</div>
        <div className="history-grid">
          {[...Array(6)].map((_, rowIndex) => (
            <div key={rowIndex} className="history-row">
              {[...Array(5)].map((_, colIndex) => {
                const guess = game.guesses[rowIndex] || '';
                const letter = guess[colIndex] || '';
                let status = '';
                
                if (guess && guess.length === 5) {
                  status = getLetterStatus(letter, colIndex, guess, game.targetWord);
                }
                
                return (
                  <div 
                    key={colIndex} 
                    className={`history-square ${status}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="history-container">
      <div className="history-games">
        {gameHistory.length === 0 ? (
          <div className="no-history">No games played yet</div>
        ) : (
          gameHistory.map((game, index) => renderGameGrid(game, index))
        )}
      </div>
      
      {gameHistory.length > 0 && (
        <div className="average-score">
          AVERAGE SCORE: {
            gameHistory.filter(g => g.won).length > 0 
              ? '⭐'.repeat(Math.round(
                  gameHistory
                    .filter(g => g.won)
                    .reduce((sum, g) => sum + Math.max(1, 7 - g.guesses.length), 0) / 
                  gameHistory.filter(g => g.won).length
                )) + '☆'.repeat(Math.max(0, 5 - Math.round(
                  gameHistory
                    .filter(g => g.won)
                    .reduce((sum, g) => sum + Math.max(1, 7 - g.guesses.length), 0) / 
                  gameHistory.filter(g => g.won).length
                )))
              : '☆☆☆☆☆'
          }
        </div>
      )}
    </div>
  );
};

export default History;