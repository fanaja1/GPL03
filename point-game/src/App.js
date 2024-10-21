import React, { useState, useEffect } from 'react';
import './styles/main-style.css';
// import './styles/background.css';
import BackMusic from './backMusic';
import Losanges from './Losanges';
import Title from './Title';
import Settings from './Settings';
import GameContainer from './GameContainer';
import Result from './Result';
import { MusicProvider, useMusic } from './MusicContext';

const AppContent = () => {
  const [numRows, setNumRows] = useState(22);
  const [numCols, setNumCols] = useState(15);
  let [totalPlayers, setTotalPlayers] = useState(2);
  localStorage.setItem("totalPlayers", totalPlayers);
  const [plateau, setPlateau] = useState(Array.from({ length: 1 + numRows + 1 }, () => Array(1 + numCols + 1).fill(0)));
  const [switchScreen, setSwitchScreen] = useState(1);
  const [playersScore, setPlayersScore] = useState(Array(4).fill(0));
  const [joueurs, setJoueurs] = useState([]);
  const { setMusicSrc } = useMusic();

  localStorage.setItem("currentPlayer", 1);

  useEffect(() => {
    if (switchScreen === 1) {
      setMusicSrc('/audio/battleThemeA.mp3');
    } else if (switchScreen === 2) {
      setMusicSrc('/audio/rbl.mp3');
    } else if (switchScreen === 4){
      setMusicSrc('/audio/battleThemeA.mp3');
    }
  }, [switchScreen, setMusicSrc]);

  return (
    <div className="App">
      <Losanges /> 
      <BackMusic /> 
      {switchScreen === 1 && <Title setSwitchScreen={setSwitchScreen} />}
      {switchScreen === 2 && <Settings setNumCols={setNumCols} setNumRows={setNumRows} setSwitchScreen={setSwitchScreen} totalPlayers={totalPlayers} setTotalPlayers={setTotalPlayers} />}
      {switchScreen === 3 && <GameContainer
        numRows={numRows}
        numCols={numCols}
        plateau={plateau}
        setPlateau={setPlateau}
        totalPlayers={totalPlayers}
        setSwitchScreen={setSwitchScreen}
        playersScore={playersScore}
        setPlayersScore={setPlayersScore}
        joueurs={joueurs}
        setJoueurs={setJoueurs}
      />}
      {switchScreen === 4 && <Result joueurs={joueurs} setSwitchScreen={setSwitchScreen} playersScore={playersScore} setPlayersScore={setPlayersScore} />}
    </div>
  );
};

const App = () => (
  <MusicProvider>
    <AppContent />
  </MusicProvider>
);

export default App;
