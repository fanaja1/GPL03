import React, { useState } from 'react';
import axios from 'axios';
import { Stage, Layer, Line, Circle } from 'react-konva';

const Page = ({ totalPlayers, numRows, numCols, plateau, setPlateau, timeElapsed }) => {

    const [currentPlayer, setCurrentPlayer] = useState(1);

    React.useEffect(() => {
        if (timeElapsed <= 0) {
            setCurrentPlayer(currentPlayer % totalPlayers + 1);
            localStorage.setItem("currentPlayer", currentPlayer % totalPlayers + 1);
            //console.log('turn', currentPlayer % totalPlayers + 1);
        }
    }, [timeElapsed, currentPlayer, totalPlayers]);

    const [height, setHeight] = useState(((450 / numRows) < 30) ? 30 * numRows : 450);
    const [scale, setScale] = useState(height / numRows);
    const [width, setWidth] = useState(numCols * scale);

    const [marginTop, setMarginTop] = useState(scale * 3);
    const [marginBottom, setMarginBottom] = useState(scale * 2);
    const [marginLeft, setMarginLeft] = useState(scale * 4);
    const [marginRight, setMarginRight] = useState(scale * 4 / 5);
    const [radius, setRadius] = useState(scale / 7);

    //let s = a > b ? Math.floor(a) : Math.floor(a); // Échelle pour les graduations

    //setWidth(marginLeft + numCols * scale + marginRight);
    const [echelle, setEchelle] = useState(1.1); // Nouvelle variable echelle à 1 par défaut
    const [scrolling, setScrolling] = useState(false); // État pour suivre si le défilement est actif

    // Gestionnaire d'événements pour la molette
    const handleWheel = (event) => {
        event.evt.preventDefault(); // Utiliser l'événement natif pour prévenir le comportement par défaut
        const molette = event.evt.deltaY;
        console.log("molette", molette, " ", (molette < 0));

        const newEchelle = (molette < 0) ? 1.1 : (1 / 1.1);
        setEchelle(newEchelle);

        console.log("cell", scale, "radius", radius, "echelle", echelle, "newE", newEchelle);


        if (((scale > 30) || molette < 0) && ((scale < 115) || molette > 0)) {
            const newScale = Math.round(scale * echelle);
            setScale(newScale);
            // Ajuster les marges en fonction de l'échelle
            setMarginTop((prevMarginTop) => Math.round(prevMarginTop * newEchelle));
            setMarginBottom((prevMarginBottom) => Math.round(prevMarginBottom * newEchelle));
            setMarginLeft((prevMarginLeft) => Math.round(prevMarginLeft * newEchelle));
            setMarginRight((prevMarginRight) => Math.round(prevMarginRight * newEchelle));
            setRadius((prevRadius) => prevRadius * newEchelle);
            setWidth(numCols * newScale);
            setHeight(numRows * newScale);
        }
        // Indiquer que le défilement est actif
        setScrolling(true);

        console.log(marginTop, "-", marginRight, "-", marginBottom, "-", marginLeft);
        console.log("width", width, " height", height);
        
    };
    //scale = 50;


    // Tableaux pour stocker les points de chaque joueur avec leur couleur
    const [playerPoints, setPlayerPoints] = useState(Array.from({ length: totalPlayers }, () => []));


    // Initialisation des circuits pour chaque joueur
    const [playersCircuitsList, setPlayersCircuitsList] = useState(Array(totalPlayers).fill(null).map(() => []));



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

    const renderHorizontalLines = () => {
        const lines = [];

        // Espacement entre les lignes principales
        const spacing = scale;
        const startY = marginTop;
        const totalWidth = marginLeft + width + marginRight; // Largeur totale ajustée

        // Ajouter trois lignes intermédiaires au-dessus de la première ligne principale
        const initialIncrement = spacing / 4;
        for (let k = 1; k <= 3; k++) {
            const aboveFirstYPosition = startY - k * initialIncrement;

            lines.push(
                <Line
                    key={`hline-above-first-${k}`}
                    points={[0, aboveFirstYPosition, totalWidth, aboveFirstYPosition]}
                    stroke="#4455C9DD"
                    strokeWidth={radius / 8} // Ligne plus fine pour les lignes intermédiaires
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
                    strokeWidth={radius / 4} // Ajustement de l'épaisseur de la ligne
                />
            );

            // Ajouter trois lignes intermédiaires entre la ligne actuelle et la suivante
            if (i < numRows) {
                const increment = spacing / 4; // Espacement des lignes intermédiaires

                for (let j = 1; j <= 3; j++) {
                    const intermediateYPosition = mainYPosition + j * increment;

                    lines.push(
                        <Line
                            key={`hline-intermediate-${i}-${j}`}
                            points={[0, intermediateYPosition, totalWidth, intermediateYPosition]}
                            stroke="#4455C9DD"
                            strokeWidth={radius / 8} // Ligne plus fine pour les lignes intermédiaires
                        />
                    );
                }
            }
        }

        // Ajouter deux lignes intermédiaires en dessous de la dernière ligne principale
        const belowLastYPosition = startY + numRows * spacing;
        for (let m = 1; m <= 2; m++) {
            const belowLastYIncrement = belowLastYPosition + m * initialIncrement;

            lines.push(
                <Line
                    key={`hline-below-last-${m}`}
                    points={[0, belowLastYIncrement, totalWidth, belowLastYIncrement]}
                    stroke="#4455C9DD"
                    strokeWidth={radius / 8} // Ligne plus fine pour les lignes intermédiaires
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
        return ((x > marginLeft - 20) && (x < marginLeft + width + 20) && (y > marginTop - 20) && (y < marginTop + height + 20));
    }

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // État pour la position de la souris

    // Gérer le mouvement de la souris 
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

        //console.log("ix", newX, " iy", newY);

        if (isValidPoint(x, y) && plateau[newY][newX] === 0) {
            //reset temps de reflexion
            localStorage.setItem('reset', 'true');
            //console.log(localStorage.getItem('reset'));

            // Ajouter le point au joueur courant
            const updatedPlayerPoints = [...playerPoints];
            updatedPlayerPoints[currentPlayer - 1].push({ x: newX - 1, y: newY - 1 });
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

            //console.log(response.data);
            setCurrentPlayer(response.data.currentPlayer);
            localStorage.setItem("currentPlayer", response.data.currentPlayer);

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
            onWheel={handleWheel}
        >
            <Layer>
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
                            fill={playerIndex === 0 ? 'red' : playerIndex === 1 ? 'blue' : playerIndex === 2 ? 'green' : 'black'} // Exemple de couleurs différentes pour les joueurs
                        />
                    ))
                )}

                {/* Cercle qui suit la souris */}
                {!scrolling && isValidPoint(mousePos.x, mousePos.y) && (
                    <Circle
                        x={mousePos.x}
                        y={mousePos.y}
                        radius={radius * 2}
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
    totalPlayers: 2
};

export default Page;
