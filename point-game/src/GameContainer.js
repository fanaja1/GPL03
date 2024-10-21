import React, { useState, useEffect } from 'react';
import Page from './Page';
import './styles/gameContainer.css'

const GameContainer = ({ joueurs, setJoueurs, playersScore, setPlayersScore, numRows, numCols, plateau, setPlateau, totalPlayers, setSwitchScreen}) => {
    const reflexionTime = localStorage.getItem("tempsReflexion");
    const [totalTime, setTotalTime] = useState(localStorage.getItem("dureeJeu") * 60);
    const [timeElapsed, setTimeElapsed] = useState(reflexionTime);
    const [timerPaused, setTimerPaused] = useState(false);
    const [startPause, setStartPause] = useState(0);
    const [endPause, setEndPause] = useState(0);
    const [timePaused, setTimePaused] = useState(0);

    let [currentPlayer, setCurrentPlayer] = useState(1);

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

    for (let i = 1; i <= localStorage.getItem("totalPlayers"); i++) {
        joueurs.push({ name: localStorage.getItem("nomJoueur" + i), color: colorsHex[localStorage.getItem("couleurJoueur" + i)] });
    }
    setJoueurs(joueurs);

    useEffect(() => {
        const gameContainer = document.querySelector(".game-container");
        gameContainer.style.backgroundColor = joueurs[currentPlayer - 1].color + "BF";
        console.log(localStorage.getItem("totalPlayers"));
    }, [currentPlayer]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!timerPaused) {
                setTimeElapsed(prevTime => prevTime - 1);
                setTotalTime(prevTime => prevTime - 1)
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timerPaused]);

    useEffect(() => {
        if (timeElapsed <= 0) {
            setTimeElapsed(reflexionTime);
            // gameContainer.style.backgroundColor = joueurs[currentPlayer - 1].color + "BF";
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

    const handleQuit = () => {
        setPlateau(Array.from({ length: 1 + numRows + 1 }, () => Array(1 + numCols + 1).fill(0)));
        setTimeout(() => {
            window.location.reload();
            // setSwitchScreen(1);
        }, 500);
    }

    const handleTerminate = () => {
        setPlateau(Array.from({ length: 1 + numRows + 1 }, () => Array(1 + numCols + 1).fill(0)));
        setTimeout(() => {
          setSwitchScreen(4);
        }, 500);
    }

    const displayScore = () => {
        const scores = [];
        for (let i = 1; i <= localStorage.getItem("totalPlayers"); i++) {
            // console.log(localStorage.getItem("nomJoueur" + i));
            scores.push(
                <div id={"scorePlayer" + i} className="score">{joueurs[i-1].name}: {playersScore[i-1]}</div>
            );
            if ((localStorage.getItem("tempsReflexion") < 500) && (((totalPlayers) === 3 && (i === 3)) || (((totalPlayers % 2) === 0) && (i === (totalPlayers / 2))))) {
                scores.push(<div id="timer" className="score">{formatTime(timeElapsed)}</div>);
            }
        }
        return scores;
    }

    
    const [scale, setScale] = useState(20);
    const [height, setHeight] = useState((numRows - 1) * scale);
    const [width, setWidth] = useState((numCols - 1) * scale);
    let [zoomSlider, setZoomSlider] = useState();
    useEffect(() => {
        zoomSlider = document.getElementById("zoomSlider");
        if (zoomSlider) {
            zoomSlider.min = 20;
            zoomSlider.max = 122;
            zoomSlider.value = scale;
        }
        setZoomSlider(zoomSlider);
    }, [scale]);

    return (
        <div className="game-container">
            <div className="score-container">
                {displayScore()}
            </div>

            <div id="menu">
                <button id="quitterbutton" onClick={handleQuit}>Quitter</button>
                <button id="finishbutton" onClick={handleTerminate}>Terminer</button>
                <button id="pauseResumeButton" onClick={handlePauseResume}>
                    {timerPaused ? "Reprendre" : "Pause"}
                </button>
            </div>

            <div className="canvas-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="canvas-container" style={{
                    width: '1000px',
                    height: '60vh',
                    overflow: 'auto',
                    padding: '10px',
                    justifyContent: 'center',
                    marginRight: '20px'
                }}>
                    <div style={{ display: timerPaused ? 'none' : 'flex' , justifyContent: 'center', alignItems: 'center' }} >
                        <Page
                            numRows={numRows - 1}
                            numCols={numCols - 1}
                            plateau={plateau}
                            setPlateau={setPlateau}
                            timeElapsed={timeElapsed}
                            totalPlayers={totalPlayers}
                            currentPlayer={currentPlayer}
                            setCurrentPlayer={setCurrentPlayer}
                            joueurs={joueurs}
                            height={height}
                            setHeight={setHeight}
                            width={width}
                            setWidth={setWidth}
                            scale={scale}
                            setScale={setScale}
                            setPlayersScore={setPlayersScore}
                            playersScore={playersScore}
                            zoomSlider={zoomSlider}
                            setZoomSlider={setZoomSlider}
                        />
                    </div>
                    
                </div>
            </div>

            <div className="zoom-slider">
                <input type="range" className="zoom-slider" id="zoomSlider" />
            </div>

            <div id="currentTurn" className="current-turn">Temps restant: {(localStorage.getItem("dureeJeu") < 500) ? formatTime(totalTime) : "-"}</div>
        </div>
    );
};

const formatTime = (timeElapsed) => {
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default GameContainer;
