import React from 'react';
import './Keyboard.css';

const Keyboard = ({ onKeyPress, keyboardStatus }) => {
  const topRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const middleRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const bottomRow = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  const handleClick = (key) => {
    onKeyPress(key);
  };

  return (
    <div className="keyboard">
      <div className="keyboard-row">
        {topRow.map(key => (
          <button
            key={key}
            className={`key ${keyboardStatus[key] || ''}`}
            onClick={() => handleClick(key)}
          >
            {key}
          </button>
        ))}
      </div>
      
      <div className="keyboard-row">
        {middleRow.map(key => (
          <button
            key={key}
            className={`key ${keyboardStatus[key] || ''}`}
            onClick={() => handleClick(key)}
          >
            {key}
          </button>
        ))}
      </div>
      
      <div className="keyboard-row">
        <button
          className="key special-key"
          onClick={() => handleClick('ENTER')}
        >
          ENTER
        </button>
        {bottomRow.map(key => (
          <button
            key={key}
            className={`key ${keyboardStatus[key] || ''}`}
            onClick={() => handleClick(key)}
          >
            {key}
          </button>
        ))}
        <button
          className="key special-key"
          onClick={() => handleClick('BACKSPACE')}
        >
          ⌫
        </button>
      </div>
    </div>
  );
};

export default Keyboard;