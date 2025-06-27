import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import './Gamemode.css';

const GamemodeDropdown = ({ currentGamemode, onGamemodeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const gamemodes = [
    { id: 'classic', name: 'Classic', dictionary: 'dictionary.txt' },
    { id: 'names', name: 'Names', dictionary: 'dictionaryNames.txt' },
    { id: 'places', name: 'Places', dictionary: 'dictionaryPlaces.txt' }
  ];

  const handleSelect = (gamemode) => {
    onGamemodeChange(gamemode);
    setIsOpen(false);
  };

  const currentMode = gamemodes.find(mode => mode.id === currentGamemode) || gamemodes[0];

  return (
    <div className="gamemode-dropdown">
      <button 
        className="gamemode-selector"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="gamemode-name">{currentMode.name}</span>
        <FontAwesomeIcon 
          icon={faChevronDown} 
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
        />
      </button>
      
      {isOpen && (
        <div className="gamemode-options">
          {gamemodes.map((mode) => (
            <button
              key={mode.id}
              className={`gamemode-option ${mode.id === currentGamemode ? 'active' : ''}`}
              onClick={() => handleSelect(mode)}
            >
              {mode.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GamemodeDropdown;