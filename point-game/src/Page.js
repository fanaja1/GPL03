import React, { useState } from 'react';
import axios from 'axios';
import { Stage, Layer, Line, Circle } from 'react-konva';

const Page = ({ numRows, numCols, plateau, setPlateau }) => {
    const [currentPlayer, setCurrentPlayer] = useState(1);
    let totalPlayers = 2;

    const width = 450;
    const height = 450;

    const marginTop = 100;
    const marginBottom = 60;
    const marginLeft = 120;
    const marginRight = 40;

    let a = width / numCols;
    let b = height / numRows;
    let scale = a > b ? Math.floor(a) : Math.floor(a); // Échelle pour les graduations
    //scale = 50;

    // Tableaux pour stocker les points de chaque joueur avec leur couleur
    const [playerPoints, setPlayerPoints] = useState(Array.from({ length: totalPlayers }, () => []));


    // Initialisation des circuits pour chaque joueur
    const [playersCircuitsList, setPlayersCircuitsList] = useState(Array(totalPlayers).fill(null).map(() => []));

    const generateRandomPointsList = (count) => {
        const points = [];
        for (let i = 0; i < count; i++) {
            const x = Math.floor(Math.random() * numCols);
            const y = Math.floor(Math.random() * numRows);
            points.push({ x, y });
        }
        return points;
    };

    //playersCircuitsList[0].push(generateRandomPointsList(4));
    //playersCircuitsList[0].push(generateRandomPointsList(4));
    //playersCircuitsList[1].push(generateRandomPointsList(4));

    const drawClosedCircuit = () => {
        let lines = [];

        for (let playerIndex = 0; playerIndex < totalPlayers; playerIndex++) {
            let circuits = playersCircuitsList[playerIndex];
            let color = playerIndex === 0 ? "red" : playerIndex === 1 ? "blue" : playerIndex === 2 ? 'green' : 'black'; 

            for (let circuitIndex = 0; circuitIndex < circuits.length; circuitIndex++) {
                const circuit = circuits[circuitIndex];
                const points = circuit.flatMap(point => [marginLeft + (point.x - 1) * scale, marginTop + (point.y - 1) * scale]);

                lines.push(
                    <Line
                        key={`player-${playerIndex}-circuit-${circuitIndex}`}
                        points={points}
                        stroke={color}
                        strokeWidth={2}
                        closed={true} // Fermer le circuit
                        lineJoin="round"
                        lineCap="round"
                    />
                );
            }
        }

        return lines;
    };

    const renderHorizontalLines = () => {
        const lines = [];
        for (let i = 0; i <= numRows; i++) {
            lines.push(
                <Line
                    key={`hline${i}`}
                    points={[0, marginTop + i * scale, marginLeft + width + marginRight, marginTop + i * scale]}
                    stroke="#ddd"
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
                    stroke="#ddd"
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
        return ((x > marginLeft - 20) && (x < marginLeft + width + 20) && (y > marginTop - 20) && (y < marginTop + height + 20));
    }

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // État pour la position de la souris

    // Gérer le mouvement de la souris 
    const handleMouseMove = (event) => {
        const { x, y } = event.target.getStage().getPointerPosition();
        const { x: closestX, y: closestY } = getClosestIntersection(x, y);

        if (isValidPoint(x, y)) {
            setMousePos({ x: closestX, y: closestY });
        }
    };

    // ************************************************************************************************************* //
    // *********** ATO NO MIASA LE GAME **************************************************************************** //
    // ************************************************************************************************************* //
    const handleClick = (event) => {
        const { x, y } = event.target.getStage().getPointerPosition();
        const { x: closestX, y: closestY } = getClosestIntersection(x, y);


        const newX = Math.round((x - marginLeft) / scale) + 1; // Calcul de la colonne la plus proche
        const newY = Math.round((y - marginTop) / scale) + 1; // Calcul de la ligne la plus proche

        //console.log("ix", newX, " iy", newY);

        if (isValidPoint(x, y) && plateau[newY][newX] === 0) {
            // Ajouter le point au joueur courant
            const updatedPlayerPoints = [...playerPoints];
            updatedPlayerPoints[currentPlayer - 1].push({ x: closestX, y: closestY });
            setPlayerPoints(updatedPlayerPoints);


            // Mettre à jour la case correspondante dans la matrice plateau
            //const newPlateau = plateau.map((row, rowIndex) =>
            //    row.map((value, colIndex) => (rowIndex === newY && colIndex === newX ? currentPlayer : value))
            //);

            plateau[newY][newX] = currentPlayer;


            // Mettre à jour l'état plateau avec la nouvelle matrice
            setPlateau(plateau);
            //console.log("x", newX, " y", newY);
            //console.log(plateau, " cp ", currentPlayer);

            // Appel de la fonction avec les données à envoyer
            sendDataToServer(plateau, { x: newX, y: newY });
            //setCurrentPlayer(currentPlayer % totalPlayers + 1); 

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

            console.log(response.data);
            setCurrentPlayer(response.data.currentPlayer); 

            const circuitData = response.data.circuitList.map(playerCircuits =>
                playerCircuits.map(circuit => circuit.map(point => ({ x: point.x, y: point.y})))
            );

            setPlayersCircuitsList(circuitData);

            const plateauData = response.data.plateau.map(row =>
                row.map(cell => cell)
            );

            // Mettez à jour l'état avec la nouvelle structure de données
            setPlateau(plateauData);


        } catch (error) {
            console.error('Une erreur s\'est produite lors de l\'envoi des données au serveur :', error);
        }
    };

    return (
        <Stage
            width={marginLeft + width + marginRight}
            height={marginTop + height + marginBottom}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
        >
            <Layer>
                {renderHorizontalLines()}
                {renderVerticalLines()}

                {drawClosedCircuit()}

                {/* Axes */}
                <Line points={[0, 0, marginLeft + width + marginRight, 0]} stroke="black" />
                <Line points={[0, 0, 0, marginTop + height + marginBottom]} stroke="black" />

                {/* Rendu des points par joueur */}
                {playerPoints.map((points, playerIndex) =>
                    points.map((point, index) => (
                        <Circle
                            key={`${playerIndex}-${index}`}
                            x={point.x}
                            y={point.y}
                            radius={5}
                            fill={playerIndex === 0 ? 'red' : playerIndex === 1 ? 'blue' : playerIndex === 2 ? 'green' : 'black'} // Exemple de couleurs différentes pour les joueurs
                        />
                    ))
                )}

                {/* Cercle qui suit la souris */}
                {isValidPoint(mousePos.x, mousePos.y) && (
                    <Circle
                        x={mousePos.x}
                        y={mousePos.y}
                        radius={10}
                        fill={currentPlayer === 1 ? 'red' : currentPlayer === 2 ? 'blue' : currentPlayer === 3 ? 'green' : 'black'}
                        opacity={0.5} // Opacité de 50%
                    />
                )}

            </Layer>
        </Stage>
    );
};

// Valeurs par défaut pour les props
Page.defaultProps = {
    numRows: 22,
    numCols: 10,
};

export default Page;
