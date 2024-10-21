import React, { useEffect, useState } from 'react';
import './styles/result-style.css';

const Result = ({ joueurs, setSwitchScreen, playersScore, setPlayersScore }) => {
  const [sortedPlayers, setSortedPlayers] = useState([]);


  useEffect(() => {
    
    const players = [];

    for (let i = 0; i < localStorage.getItem("totalPlayers"); i++) {
      const playerName = joueurs[i].name;
      let j = i+1;
      console.log("score"+j + " " +localStorage.getItem("score"+j));
      const playerScore = localStorage.getItem("score"+j);
      players.push({ name: playerName, score: playerScore });
    }

    players.sort((a, b) => b.score - a.score);

    setSortedPlayers(players);

  }, [playersScore]);
  
  const handleQuit = () => {
    setTimeout(() => {
      window.location.reload();
      // setSwitchScreen(1);
    }, 500);
  };

  const handleReplay = () => {
    setPlayersScore(Array(playersScore.length).fill(0));
    for (let i = 1; i <= localStorage.getItem("totalPlayers"); i++) {
      localStorage.setItem("score" + i, 0);
    }
    setTimeout(() => {
      setSwitchScreen(3);
    }, 500);
  };

  return (
    <div className="result-container">
      <div id="losange-container"></div>
      <header>
        <h1>Resultats du Jeu</h1>
      </header>
      <main>
        <div className="result">
          <h2>Classement des joueurs</h2>
          <ul>
            {sortedPlayers.map((player, index) => (
              <li key={index}>
                {player.name}: {player.score}
              </li>
            ))}
          </ul>
        </div>
      </main>
      <footer>
        <button id="quitter-button" onClick={handleQuit}>Quitter</button>
        <button id="finish-button" onClick={handleReplay}>Rejouer</button>
      </footer>
    </div>
  );
};

export default Result;
