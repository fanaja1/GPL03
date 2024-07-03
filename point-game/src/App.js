import React, { useState } from 'react';
import './styles/main-style.css'; // Chemin relatif à partir de App.js
import './styles/background.css'; // Chemin relatif à partir de App.js
import GameContainer from './GameContainer';

const App = () => {
    const numRows = 22;
    const numCols = 15;
    const totalPlayers = 2;
    const [plateau, setPlateau] = useState(Array.from({ length: 1 + numRows + 1 }, () => Array(1 + numCols + 1).fill(0)));

    //test
    localStorage.setItem("couleurJoueur1", "Rouge");
    localStorage.setItem("couleurJoueur2", "Bleu");

    return (
        <GameContainer
            numRows={numRows}
            numCols={numCols}
            plateau={plateau}
            setPlateau={setPlateau}
            totalPlayers={totalPlayers}
        />
    );
};

export default App;
