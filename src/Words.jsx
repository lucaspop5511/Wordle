import React from 'react';
import './Words.css';

const Words = ({ guesses, currentGuess, currentRow, targetWord, gameResult, invalidWord }) => {
  const getLetterStatus = (letter, position, guess) => {
    if (!targetWord) return '';
    
    if (targetWord[position] === letter) {
      return 'correct';
    } else if (targetWord.includes(letter)) {
      return 'present';
    } else {
      return 'absent';
    }
  };

  const renderRow = (rowIndex) => {
    const guess = guesses[rowIndex] || '';
    const isCurrentRow = rowIndex === currentRow;
    const displayGuess = isCurrentRow ? currentGuess : guess;
    const isWinningRow = gameResult === 'won' && guess === targetWord;
    const isInvalidRow = isCurrentRow && invalidWord && currentGuess.length === 5;
    
    return (
      <div key={rowIndex} className="word-row">
        {[...Array(5)].map((_, colIndex) => {
          const letter = displayGuess[colIndex] || '';
          let status = '';
          
          if (guess && !isInvalidRow) {
            status = getLetterStatus(letter, colIndex, guess);
          } else if (isWinningRow) {
            status = 'correct';
          } else if (isInvalidRow) {
            status = 'invalid';
          }
          
          return (
            <div 
              key={colIndex} 
              className={`letter-box ${status}`}
            >
              {letter}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="words-container">
      {[...Array(6)].map((_, index) => renderRow(index))}
    </div>
  );
};

export default Words;