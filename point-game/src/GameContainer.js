import React, { useState, useEffect } from 'react';
import Page from './Page';

const GameContainer = ({ numRows, numCols, plateau, setPlateau, totalPlayers }) => {
    const reflexionTime = 5;
    const [timeElapsed, setTimeElapsed] = useState(reflexionTime);
    const [timerPaused, setTimerPaused] = useState(false);
    const [startPause, setStartPause] = useState(0);
    const [endPause, setEndPause] = useState(0);
    const [timePaused, setTimePaused] = useState(0);

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

    let joueurs = [];

    for (let i = 1; i <= totalPlayers; i++) {
        joueurs.push({ name: localStorage.getItem("nomJoueur" + i), color: colorsHex[localStorage.getItem("couleurJoueur" + i)] });
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (!timerPaused) {
                setTimeElapsed(prevTime => prevTime - 1);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timerPaused]);

    useEffect(() => {
        const gameContainer = document.querySelector(".game-container");
        gameContainer.style.backgroundColor = joueurs[parseInt(localStorage.getItem("currentPlayer")) - 1].color + "BF";
        if (timeElapsed <= 0) {
            setTimeElapsed(reflexionTime);
            gameContainer.style.backgroundColor = joueurs[parseInt(localStorage.getItem("currentPlayer")) - 1].color + "BF";
        }
        const resetLocalStorage = localStorage.getItem('reset') === 'true';
        if (resetLocalStorage) {
            localStorage.setItem('reset', 'false');
            setTimeElapsed(reflexionTime);
        }
    }, [timeElapsed, joueurs]);

    const handlePauseResume = () => {
        if (timerPaused) {
            setTimerPaused(false);
            setEndPause(Date.now());
            setTimePaused(prevTimePaused => prevTimePaused + Math.round((Date.now() - startPause) / 1000));
        } else {
            setTimerPaused(true);
            setStartPause(Date.now());
        }
    };

    return (
        <div className="game-container">
            <div className="score-container">
                <div id="scorePlayer1" className="score">J1: 0</div>
                <div id="timer" className="score">{formatTime(timeElapsed)}</div>
                <div id="scorePlayer2" className="score">J2: 0</div>
            </div>

            <div id="menu">
                <button id="quitter-button">Quitter</button>
                <button id="finish-button">Terminer</button>
                <button id="pauseResumeButton" onClick={handlePauseResume}>
                    {timerPaused ? "Reprendre" : "Pause"}
                </button>
            </div>

            <div className="canvas-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="canvas-container" style={{
                    width: '700px',
                    height: '60vh',
                    overflow: 'auto',
                    border: '1px solid #ddd',
                    padding: '10px',
                    justifyContent: 'center',
                    marginRight: '20px'
                }}>
                    <div style={{ display: timerPaused ? 'none' : 'block' }} >
                        <Page
                            numRows={numRows - 1}
                            numCols={numCols - 1}
                            plateau={plateau}
                            setPlateau={setPlateau}
                            timeElapsed={timeElapsed}
                            totalPlayers={totalPlayers}
                        />
                    </div>
                    
                </div>
            </div>

            <div className="zoom-slider">
                <input type="range" className="zoom-slider" id="zoomSlider" />
            </div>

            <div id="currentTurn" className="current-turn"></div>
        </div>
    );
};

const formatTime = (timeElapsed) => {
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default GameContainer;
