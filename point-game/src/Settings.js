import React, { useState } from 'react';
import './styles/Settings.css';

const colorsHex = {
  Rouge: "#FF0000",
  Bleu: "#0000FF",
  Vert: "#008000",
  Jaune: "#FFFF00",
  Orange: "#FFA500",
  Violet: "#800080",
  Rose: "#FFC0CB",
  Marron: "#A52A2A",
  Cyan: "#00FFFF",
  "Vert clair": "#00FF00",
  Noir: "#000000",
  Gris: "#808080",
};

function PlayerSettings({ player, playerName, setPlayerName, selectedColor, setSelectedColor }) {
  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  const handleNameChange = (event) => {
    setPlayerName(event.target.value);
  };

  return (
    <div className="settings-section" id={`player${player}-section`} style={{ backgroundColor: colorsHex[selectedColor] }}>
      <h2 className="text">Joueur {player}</h2>
      {player > 1 && (
        <div className="bot-option">
          <input type="checkbox" id={`player${player}-bot`} name={`player${player}-type`} value="bot" />
          <label htmlFor={`player${player}-bot`}>Bot</label>
        </div>
      )}
      <label htmlFor={`player${player}-name`} className="text">Nom :</label>
      <input type="text" id={`player${player}-name`} name={`player${player}-name`} value={playerName} onChange={handleNameChange} /><br />

      <label htmlFor={`player${player}-color`} className="text">Couleur :</label>
      <select id={`player${player}-color`} name={`player${player}-color`} onChange={handleColorChange} value={selectedColor}>
        <option value="">-</option>
        {Object.entries(colorsHex).map(([colorName, colorHex]) => (
          <option key={colorName} value={colorName} style={{ color: colorHex }}>
            {colorName}
          </option>
        ))}
      </select>
    </div>
  );
}

function TimeSettings() {
  return (
    <div className="settings-section" id="time">
      <label htmlFor="reflection-time">Temps de Reflexion :</label>
      <div className="radio-group">
        <div>
          <input type="radio" id="reflection-10" name="reflection-time" value="10" />
          <label htmlFor="reflection-10">10 sec</label>
        </div>
        <div>
          <input type="radio" id="reflection-20" name="reflection-time" value="20" defaultChecked />
          <label htmlFor="reflection-20">20 sec</label>
        </div>
        <div>
          <input type="radio" id="reflection-30" name="reflection-time" value="30" />
          <label htmlFor="reflection-30">30 sec</label>
        </div>
        <div>
          <input type="radio" id="reflection-none" name="reflection-time" value="999" />
          <label htmlFor="reflection-none">&empty;</label>
        </div>
      </div>
    </div>
  );
}

function ModeSettings() {
    if (localStorage.getItem("totalPlayers") <= 2) {
        return;
    }

  return (
    <div className="settings-section" id="mode">
      <label htmlFor="mode">Mode :</label>
      <div className="radio-group">
        <div>
          <input type="radio" id="mode-normal" name="game-mode" value="normal" defaultChecked />
          <label htmlFor="mode-normal">Normal</label>
        </div>
        <div>
          <input type="radio" id="mode-shared" name="game-mode" value="shared" />
          <label htmlFor="mode-shared">Partage</label>
        </div>
      </div>
    </div>
  );
}

function TimeSettings2() {
  return (
    <div className="settings-section" id="time">
      <label htmlFor="game-time">Duree du Jeu :</label>
      <div className="radio-group">
        <div>
          <input type="radio" id="game-3" name="game-time" value="3" />
          <label htmlFor="game-3">3 min</label>
        </div>
        <div>
          <input type="radio" id="game-5" name="game-time" value="5" defaultChecked />
          <label htmlFor="game-5">5 min</label>
        </div>
        <div>
          <input type="radio" id="game-10" name="game-time" value="10" />
          <label htmlFor="game-10">10 min</label>
        </div>
        <div>
          <input type="radio" id="game-infinite" name="game-time" value="999" />
          <label htmlFor="game-infinite">&infin;</label>
        </div>
      </div>
    </div>
  );
}

function SizeSettings() {
  return (
    <div className="settings-section" id="size">
      <h2>Taille du cahier</h2>
      <div className="radio-group2">
        <div>
          <input type="radio" id="size-10" name="notebook-size" value="1" />
          <label htmlFor="size-10">Petit carre</label>
        </div>
        <div>
          <input type="radio" id="size-20" name="notebook-size" value="2" defaultChecked />
          <label htmlFor="size-20">Cahier PM</label>
        </div>
        <div>
          <input type="radio" id="size-none" name="notebook-size" value="4" />
          <label htmlFor="size-none">Cahier GM</label>
        </div>
        <div>
          <input type="radio" id="size-30" name="notebook-size" value="3" />
          <label htmlFor="size-30">Grand carre</label>
        </div>
      </div>
    </div>
  );
}

function Settings({ setNumRows, setNumCols, setSwitchScreen, totalPlayers, setTotalPlayers }) {
  const [playerNames, setPlayerNames] = useState(Array(4).fill(''));
  const [playerColors, setPlayerColors] = useState(Array(4).fill(''));

  const handlePlayerSelect = (event) => {
    totalPlayers = parseInt(event.target.value);
    setTotalPlayers(parseInt(event.target.value));
    localStorage.setItem("totalPlayers", totalPlayers);
    console.log('d' + totalPlayers)
  };

  const handleColorChange = (index, color) => {
    const newColors = [...playerColors];
    newColors[index] = color;
    setPlayerColors(newColors);
  };

  const handleNameChange = (index, name) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const canStartGame = playerColors.slice(0, totalPlayers).every(color => color !== '') && new Set(playerColors.slice(0, totalPlayers)).size === totalPlayers;

  const startGame = () => {

    // Set player names and colors in localStorage
    for (let i = 0; i < totalPlayers; i++) {
      const playerName = playerNames[i] === "" ? `Joueur ${i + 1}` : playerNames[i];
      console.log(playerName);
      localStorage.setItem(`nomJoueur${i + 1}`, playerName);
      localStorage.setItem(`couleurJoueur${i + 1}`, playerColors[i]);
    }

    const selectedMode = (localStorage.getItem("totalPlayers") <= 2) ? "normal" : document.querySelector("input[name='game-mode']:checked").value;
    localStorage.setItem("gameMode", selectedMode);

    localStorage.setItem("tempsReflexion", document.querySelector("input[name='reflection-time']:checked").value);
    localStorage.setItem("dureeJeu", document.querySelector("input[name='game-time']:checked").value);
    let size = parseInt(document.querySelector("input[name='notebook-size']:checked").value);

    switch (size) {
      case 1:
        setNumCols(12);
        setNumRows(12);
        break;
      case 2:  
        setNumCols(15);
        setNumRows(22);
        break;
      case 3:
        setNumCols(35);
        setNumRows(35);
        break;
      case 4:
        setNumCols(22);
        setNumRows(31);
        break;
      default:
        break;
    }

    setTimeout(() => {
      setSwitchScreen(3);
    }, 500);
  };

  return (
    <div className="Settings">
      <h1>Parametres du Jeu</h1>
      <br></br>
      <br></br>
      <div className="player-count">
        <label htmlFor="player-count">Nombre de joueurs :</label>
        <select id="player-count" value={totalPlayers} onChange={handlePlayerSelect}>
          <option value="2">2 joueurs</option>
          <option value="3">3 joueurs</option>
          <option value="4">4 joueurs</option>
        </select>
      </div>
      <div id="settings-container">
        <div className="players">
          {[...Array(totalPlayers)].map((_, index) => (
            <PlayerSettings
              key={index}
              player={index + 1}
              playerName={playerNames[index]}
              setPlayerName={(name) => handleNameChange(index, name)}
              selectedColor={playerColors[index]}
              setSelectedColor={(color) => handleColorChange(index, color)}
            />
          ))}
        </div>
        <TimeSettings />
        <TimeSettings2 />
        <SizeSettings />
        <ModeSettings />
      </div>
      {!canStartGame && <p id="substitute">(Choisir {totalPlayers} couleurs differentes pour commencer)</p>}
      {canStartGame && <button id="start-game" onClick={startGame}>Jouer</button>}
    </div>
  );
}

export default Settings;
