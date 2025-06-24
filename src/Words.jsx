import React from 'react';
import './Words.css';

const Words = ({ guesses, currentGuess, currentRow, targetWord, gameResult, invalidWord }) => {
  const getLetterStatus = (letter, position, guess) => {
    if (!targetWord || !letter) return '';
    
    // If letter is in correct position, it's green
    if (targetWord[position] === letter) {
      return 'correct';
    }
    
    // If letter is not in the target word at all, it's gray
    if (!targetWord.includes(letter)) {
      return 'absent';
    }
    
    const targetLetterCount = targetWord.split('').filter(l => l === letter).length;
    
    // Count how many correct (green) positions we have for this letter in the current guess
    let correctCount = 0;
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === letter && targetWord[i] === letter) {
        correctCount++;
      }
    }
    
    // Count how many yellow positions we've already assigned before this position
    let yellowCount = 0;
    for (let i = 0; i < position; i++) {
      if (guess[i] === letter && targetWord[i] !== letter && targetWord.includes(letter)) {
        // This position would be yellow, so count it
        yellowCount++;
      }
    }
    
    // If we still have "available" instances of this letter (not yet used by green or previous yellows)
    if (correctCount + yellowCount < targetLetterCount) {
      return 'present';
    }
    
    // Otherwise, this letter instance should be gray
    return 'absent';
  };

  const renderRow = (rowIndex) => {
    const guess = guesses[rowIndex] || '';
    const isCurrentRow = rowIndex === currentRow;
    const displayGuess = isCurrentRow ? currentGuess : guess;
    const isInvalidRow = isCurrentRow && invalidWord && currentGuess.length === 5;
    
    return (
      <div key={rowIndex} className="word-row">
        {[...Array(5)].map((_, colIndex) => {
          // For completed guesses, always show the guess letter
          const letter = guess && guess.length === 5 ? guess[colIndex] : displayGuess[colIndex] || '';
          let status = '';
          
          // For completed guesses, calculate status
          if (guess && guess.length === 5 && !isInvalidRow) {
            status = getLetterStatus(letter, colIndex, guess);
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