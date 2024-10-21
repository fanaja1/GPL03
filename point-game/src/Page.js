import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Stage, Layer, Line, Circle, Rect } from 'react-konva';

const Page = ({ setZoomSlider, zoomSlider, playersScore, setPlayersScore, height, setHeight, width, setWidth, scale, setScale, totalPlayers, numRows, numCols, plateau, setPlateau, timeElapsed, currentPlayer, setCurrentPlayer, joueurs}) => {

    React.useEffect(() => {
        if (timeElapsed <= 0) {
            setCurrentPlayer(currentPlayer % totalPlayers + 1);
            // localStorage.setItem("currentPlayer", currentPlayer % totalPlayers + 1);
            //console.log('turn', currentPlayer % totalPlayers + 1);
        }
    }, [timeElapsed, currentPlayer, totalPlayers]);

    const [marginTop, setMarginTop] = useState(scale * 3);
    const [marginBottom, setMarginBottom] = useState(scale * 2);
    const [marginLeft, setMarginLeft] = useState(scale * 4);
    const [marginRight, setMarginRight] = useState(scale * 4 / 5);
    const [radius, setRadius] = useState(scale / 7);

    //let s = a > b ? Math.floor(a) : Math.floor(a); // �chelle pour les graduations

    //setWidth(marginLeft + numCols * scale + marginRight);
    let [echelle, setEchelle] = useState(1.1); // Nouvelle variable echelle � 1 par d�faut
    const [scrolling, setScrolling] = useState(false); // �tat pour suivre si le d�filement est actif

    // Gestionnaire d'�v�nements pour la molette
    const handleWheel = (event) => {
        event.evt.preventDefault(); // Utiliser l'�v�nement natif pour pr�venir le comportement par d�faut
        const molette = event.evt.deltaY;
        console.log("molette", molette, " ", (molette < 0));

        echelle = (molette < 0) ? 1.1 : (1 / 1.1);
        setEchelle(echelle);

        console.log("cell", scale, "radius", radius, "echelle", echelle, "newE", echelle);


        if (((scale > 20) || molette < 0) && ((scale < 120) || molette > 0)) {
            scale = Math.round(scale * echelle);
            setScale(scale);
            // Ajuster les marges en fonction de l'�chelle
            setMarginTop((prevMarginTop) => Math.round(prevMarginTop * echelle));
            setMarginBottom((prevMarginBottom) => Math.round(prevMarginBottom * echelle));
            setMarginLeft((prevMarginLeft) => Math.round(prevMarginLeft * echelle));
            setMarginRight((prevMarginRight) => Math.round(prevMarginRight * echelle));
            setRadius((prevRadius) => prevRadius * echelle);
            setWidth(numCols * scale);
            setHeight(numRows * scale);
            zoomSlider.value = scale;
            setZoomSlider(zoomSlider);
        }
        // Indiquer que le d�filement est actif
        setScrolling(true);

        console.log(marginTop, "-", marginRight, "-", marginBottom, "-", marginLeft);
        console.log("width", width, " height", height);
        
    };

    useEffect(() => {
        if (zoomSlider) {
            const handleZoomSliderChange = () => {
                const echelle = parseInt(zoomSlider.value) / scale;
                scale = Math.round(scale * echelle);
                setScale(scale);
                setMarginTop((prevMarginTop) => Math.round(prevMarginTop * echelle));
                setMarginBottom((prevMarginBottom) => Math.round(prevMarginBottom * echelle));
                setMarginLeft((prevMarginLeft) => Math.round(prevMarginLeft * echelle));
                setMarginRight((prevMarginRight) => Math.round(prevMarginRight * echelle));
                setRadius((prevRadius) => prevRadius * echelle);
                setWidth(numCols * scale);
                setHeight(numRows * scale);
                console.log(marginTop, "-", marginRight, "-", marginBottom, "-", marginLeft);
                console.log("width", width, " height", height);
            };

            zoomSlider.addEventListener('input', handleZoomSliderChange);
            return () => zoomSlider.removeEventListener('input', handleZoomSliderChange);
        }
    }, [zoomSlider, echelle, numCols, numRows]);


    // Tableaux pour stocker les points de chaque joueur avec leur couleur
    const [playerPoints, setPlayerPoints] = useState(Array.from({ length: totalPlayers }, () => []));


    // Initialisation des circuits pour chaque joueur
    const [playersCircuitsList, setPlayersCircuitsList] = useState(Array(totalPlayers).fill(null).map(() => []));



    const drawClosedCircuit = () => {
        let lines = [];

        for (let playerIndex = 0; playerIndex < totalPlayers; playerIndex++) {
            let circuits = playersCircuitsList[playerIndex];
            let color = joueurs[playerIndex].color; 

            for (let circuitIndex = 0; circuitIndex < circuits.length; circuitIndex++) {
                const circuit = circuits[circuitIndex];
                const points = circuit.flatMap(point => [marginLeft + (point.x - 1) * scale, marginTop + (point.y - 1) * scale]);

                lines.push(
                    <Line
                        key={`player-${playerIndex}-circuit-${circuitIndex}`}
                        points={points}
                        stroke={color}
                        strokeWidth={radius * 2 / 5}
                        closed={true} // Fermer le circuit
                        lineJoin="round"
                        lineCap="round"
                    />
                );
            }
        }
        
        return lines;
    };

    const renderPlayerAreas = () => {
        const gameMode = localStorage.getItem("gameMode");

        if (gameMode === "normal") {
            return;
        } else if (gameMode === "shared") {

            const areas = [];

            // Définir les propriétés des zones pour 4 joueurs
            const player4Areas = [
                { player: 1, x: marginLeft, y: marginTop, width: (7 * width) / 22, height: height, color: joueurs[0].color },
                { player: 2, x: marginLeft + width - (7 * width) / 22, y: marginTop, width: (7 * width) / 22, height: height, color: joueurs[1].color },
                { player: 3, x: marginLeft, y: marginTop, width: width, height: (7 * height) / 22, color: joueurs[2].color },
                { player: 4, x: marginLeft, y: marginTop + height - (7 * height) / 22, width: width, height: (7 * height) / 22, color: joueurs[3].color },
            ];

            // Définir les propriétés des zones pour 3 joueurs
            const player3Areas = [
                { player: 1, x: marginLeft, y: marginTop, width: width / 3, height: height, color: joueurs[0].color },  // Joueur 1 (gauche)
                { player: 2, x: marginLeft + width / 3, y: marginTop, width: width / 3, height: height, color: joueurs[1].color }, // Joueur 2 (milieu)
                { player: 3, x: marginLeft + (2 * width) / 3, y: marginTop, width: width / 3, height: height, color: joueurs[2].color }  // Joueur 3 (droite)
            ];

            // Boucle pour ajouter les zones selon le nombre total de joueurs
            if (totalPlayers === 4) {
                player4Areas.forEach(({ player, x, y, width, height, color }) => {
                    if (currentPlayer === player) {
                        areas.push(
                            <Rect
                                key={`player${player}-restricted-area`}
                                x={x}
                                y={y}
                                width={width}
                                height={height}
                                fill={color}  // Couleur du joueur
                                opacity={0.2} // Opacité pour visualiser
                            />
                        );
                    }
                });
            } else if (totalPlayers === 3) {
                player3Areas.forEach(({ player, x, y, width, height, color }) => {
                    if (currentPlayer === player) {
                        areas.push(
                            <Rect
                                key={`player${player}-restricted-area`}
                                x={x}
                                y={y}
                                width={width}
                                height={height}
                                fill={color}  // Couleur du joueur
                                opacity={0.2} // Opacité pour visualiser
                            />
                        );
                    }
                });
            }

            return areas
        }
    };


    const renderHorizontalLines = () => {
        const lines = [];

        // Espacement entre les lignes principales
        const spacing = scale;
        const startY = marginTop;
        const totalWidth = marginLeft + width + marginRight; // Largeur totale ajust�e

        // Ajouter trois lignes interm�diaires au-dessus de la premi�re ligne principale
        const initialIncrement = spacing / 4;
        for (let k = 1; k <= 3; k++) {
            const aboveFirstYPosition = startY - k * initialIncrement;

            lines.push(
                <Line
                    key={`hline-above-first-${k}`}
                    points={[0, aboveFirstYPosition, totalWidth, aboveFirstYPosition]}
                    stroke="#4455C9DD"
                    strokeWidth={radius / 8} // Ligne plus fine pour les lignes interm�diaires
                />
            );
        }

        for (let i = 0; i <= numRows; i++) {
            // Position de la ligne principale
            const mainYPosition = startY + i * spacing;

            // Ajouter la ligne principale
            lines.push(
                <Line
                    key={`hline-main-${i}`}
                    points={[0, marginTop + i * scale, marginLeft + width + marginRight, marginTop + i * scale]}
                    stroke="#4455C9DD"
                    strokeWidth={radius / 4} // Ajustement de l'�paisseur de la ligne
                />
            );

            // Ajouter trois lignes interm�diaires entre la ligne actuelle et la suivante
            if (i < numRows) {
                const increment = spacing / 4; // Espacement des lignes interm�diaires

                for (let j = 1; j <= 3; j++) {
                    const intermediateYPosition = mainYPosition + j * increment;

                    lines.push(
                        <Line
                            key={`hline-intermediate-${i}-${j}`}
                            points={[0, intermediateYPosition, totalWidth, intermediateYPosition]}
                            stroke="#4455C9DD"
                            strokeWidth={radius / 8} // Ligne plus fine pour les lignes interm�diaires
                        />
                    );
                }
            }
        }

        // Ajouter deux lignes interm�diaires en dessous de la derni�re ligne principale
        const belowLastYPosition = startY + numRows * spacing;
        for (let m = 1; m <= 2; m++) {
            const belowLastYIncrement = belowLastYPosition + m * initialIncrement;

            lines.push(
                <Line
                    key={`hline-below-last-${m}`}
                    points={[0, belowLastYIncrement, totalWidth, belowLastYIncrement]}
                    stroke="#4455C9DD"
                    strokeWidth={radius / 8} // Ligne plus fine pour les lignes interm�diaires
                />
            );
        }

        return lines;
    };

    const renderVerticalLines = () => {
        const lines = [];
        for (let i = 0; i <= numCols; i++) {
            lines.push(
                <Line
                    key={`vline${i}`}
                    points={[marginLeft + i * scale, 0, marginLeft + i * scale, marginTop + height + marginBottom]}
                    stroke={i === 0 ? "#FF0000CC" : "#4455C9DD"}
                    strokeWidth={radius / 4}
                />
            );
        }
        return lines;
    };

    // Calculer l'intersection la plus proche
    const getClosestIntersection = (x, y) => {
        const closestX = Math.round((x - marginLeft) / scale) * scale;
        const closestY = Math.round((y - marginTop) / scale) * scale;

        return { x: closestX + marginLeft, y: closestY + marginTop };
    };

    const isValidPoint = (x, y) => {

        let out = false;
        const gameMode = localStorage.getItem("gameMode");

        if (gameMode === "normal") {
            out = true;
        } else if (gameMode === "shared") {
            switch (currentPlayer) {
                case 1:
                    out = (totalPlayers == 3) ? (x > marginLeft + width / 3) : (x > marginLeft + (7 * width) / 22);
                    break;

                case 2:
                    out = (totalPlayers == 3) ? ((x < marginLeft + width / 3) || (x > marginLeft + 2 * width / 3)) : (x < marginLeft + width - (7 * width) / 22);
                    break;

                case 3:
                    out = (totalPlayers == 3) ? (x < marginLeft + 2 * width / 3) : (y > marginTop + (7 * height) / 22);
                    break;

                case 4:
                    out = y < height + marginTop - (7 * height) / 22;
                    break;
                default:
                    break;
            }
        }

        return out && ((x > marginLeft - 20) && (x < marginLeft + width + 20) && (y > marginTop - 20) && (y < marginTop + height + 20));
    }

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // �tat pour la position de la souris

    // G�rer le mouvement de la souris 
    const handleMouseMove = (event) => {
        const { x, y } = event.target.getStage().getPointerPosition();
        const { x: closestX, y: closestY } = getClosestIntersection(x, y);
        setScrolling(false);

        if (isValidPoint(x, y)) {
            setMousePos({ x: closestX, y: closestY });
        }
    };

    // ************************************************************************************************************* //
    // *********** ATO NO MIASA LE GAME **************************************************************************** //
    // ************************************************************************************************************* //
    const handleClick = (event) => {
        const { x, y } = event.target.getStage().getPointerPosition();

        const newX = Math.round((x - marginLeft) / scale) + 1; // Calcul de la colonne la plus proche
        const newY = Math.round((y - marginTop) / scale) + 1; // Calcul de la ligne la plus proche

        if (isValidPoint(x, y) && plateau[newY][newX] === 0) {
            //reset temps de reflexion
            localStorage.setItem('reset', 'true');

            // setCurrentPlayer(currentPlayer % totalPlayers + 1);
            handlePlayerMove(plateau, newX, newY, currentPlayer, 0);

        } else {
            
        }
    };
    const handlePlayerMove = async (plateau, newX, newY, currentPlayer, count) => {
        // Ajouter le point au joueur courant
        const updatedPlayerPoints = [...playerPoints];
        updatedPlayerPoints[currentPlayer - 1].push({ x: newX - 1, y: newY - 1 });
        setPlayerPoints(updatedPlayerPoints);
        
        plateau[newY][newX] = currentPlayer;

        // Mettre  jour l'tat plateau avec la nouvelle matrice
        setPlateau(plateau);

        try {
            // Appel de la fonction avec les donn�es � envoyer et attendre qu'elle se termine
            let cP = await sendDataToServer(plateau, { x: newX, y: newY });

             //console.log("cp", cP);
            // Récupère la chaîne de caractères des bots depuis localStorage
            const botsString = localStorage.getItem("bot") || "";

            // Vérifie si cP.currentPlayer est un bot
            if (botsString.includes(cP.currentPlayer.toString()) && count < 1) {
                console.log("tonga eto " + cP.currentPlayer);

                //const iaPoint = await iaTurn(plateau, { y: newX, x: newY });
                //console.log(iaPoint);

                //handlePlayerMove(plateau, iaPoint.y, iaPoint.x, cP.currentPlayer, count);
            }
            
        } catch (error) {
            console.error("Erreur lors de la gestion du mouvement du joueur:", error);
        }
    };

    const iaTurn = async (plateau, dernierPoint) => {
        try {
            const response = await axios.put("http://localhost:7001/api/Game/IA", {
                CircuitList: playersCircuitsList,
                plateau: plateau,
                dernierPoint: dernierPoint,
                currentPlayer: currentPlayer
            });

            // console.log( response.data);
            return {x: response.data.currentPlayer, y: response.data.score};


        } catch (error) {
            console.error('Une erreur s\'est produite lors de l\'envoi des donn�es au serveur :', error);
        }
    };

    const sendDataToServer = async (plateau, dernierPoint) => {
        try {//https://localhost:44356
            const response = await axios.put("http://localhost:7001/api/Game/ProcessData", {
                CircuitList: playersCircuitsList,
                plateau: plateau,
                dernierPoint: dernierPoint,
                currentPlayer: currentPlayer
            });

            //console.log(response.data);
            currentPlayer = response.data.currentPlayer;
            await setCurrentPlayer(response.data.currentPlayer);
            // console.log(currentPlayer, "currentPlayer", response.data.currentPlayer);
            // localStorage.setItem("scorePlayer" + currentPlayer, response.data.score);

            const circuitData = response.data.circuitList.map(playerCircuits =>
                playerCircuits.map(circuit => circuit.map(point => ({ x: point.x, y: point.y})))
            );

            setPlayersCircuitsList(circuitData);
            const tempScore = response.data.score;
            if (tempScore != 0) {
                playersScore[currentPlayer - 1] += tempScore;
                setPlayersScore(playersScore);
                for (let i = 1; i <= localStorage.getItem("totalPlayers"); i++) {
                  localStorage.setItem("score" + i, playersScore[i - 1]);
                }
                // localStorage.setItem("score"+currentPlayer, playersScore[currentPlayer - 1]);
                console.log("score"+currentPlayer + " " +localStorage.getItem("score"+currentPlayer))
            }

            const plateauData = response.data.plateau.map(row =>
                row.map(cell => cell)
            );

            // Mettez � jour l'�tat avec la nouvelle structure de donn�es
            setPlateau(plateauData);

            return response.data;
        } catch (error) {
            console.error('Une erreur s\'est produite lors de l\'envoi des donn�es au serveur :', error);
        }
    };

    return (
        <Stage
            width={marginLeft + width + marginRight}
            height={marginTop + height + marginBottom}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onWheel={handleWheel}
        >
            <Layer>
                {renderPlayerAreas()} 
                {renderHorizontalLines()}
                {renderVerticalLines()}

                {drawClosedCircuit()}

                {/* Rendu des points par joueur */}
                {playerPoints.map((points, playerIndex) =>
                    points.map((point, index) => (
                        <Circle
                            key={`${playerIndex}-${index}`}
                            x={point.x * scale + marginLeft}
                            y={point.y * scale + marginTop}
                            radius={radius}
                            fill={joueurs[playerIndex].color}
                        />
                    ))
                )}

                {/* Cercle qui suit la souris */}
                {!scrolling && isValidPoint(mousePos.x, mousePos.y) && (
                    <Circle
                        x={mousePos.x}
                        y={mousePos.y}
                        radius={radius * 2}
                        fill={joueurs[currentPlayer - 1].color}
                        opacity={0.5} // Opacit� de 50%
                    />
                )}

            </Layer>
        </Stage>
    );
};

// Valeurs par d�faut pour les props
Page.defaultProps = {
    numRows: 22,
    numCols: 10,
    totalPlayers: 2
};

export default Page;
