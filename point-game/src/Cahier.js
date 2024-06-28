import React, { useState } from 'react';
import axios from 'axios';
import { Stage, Layer, Line, Circle } from 'react-konva';

const Cahier = ({ plateau, setPlateau }) => {
    const n = 40; // Taille de la grille
    const gridColor = '#cccccc'; // Couleur du quadrillage
    const stageWidth = 700; // Largeur de la scène
    const stageHeight = 500; // Hauteur de la scène
    const numCols = Math.ceil(stageWidth / n); // Nombre de colonnes
    const numRows = Math.ceil(stageHeight / n); // Nombre de lignes

    const width = 500;
    const height = 500;
    const xInterval = Math.floor(width / n);
    const yInterval = Math.floor(height / n);
    const [dernierPoint, setDernierPoint] = useState({ x: 0, y: 0 });


    // Calcul de l'espacement très proche (0.1 mm)
    const extraSpacing = 0.25; // en mm
    const extraGridSize = n * extraSpacing;


    // Position en pixels de la ligne rouge (4ème colonne)
    const redLineX = 4 * n;

    // Position en pixels de la 3ème dernière ligne horizontale rouge
    const thirdLastRowY = (numRows - 2) * n;


    // Fonction pour générer les lignes horizontales du quadrillage
    const generateHorizontalLines = () => {
        let lines = [];
        for (let i = 0; i <= numRows; i++) {
            const y = i * n;
            if (y > thirdLastRowY) {
                break; // Arrêter la génération des lignes horizontales en dessous de la ligne rouge
            }
            lines.push(
                <Line
                    key={`horizontal-${i}`}
                    points={[0, y, stageWidth, y]}
                    stroke={gridColor}
                />
            );
        }



        // Ajouter des lignes supplémentaires avec un espacement très proche au-dessus de la ligne rouge
        for (let j = 1; j <= 3; j++) {
            for (let i = 0; i <= numRows; i++) {
                const y = i * n + j * extraGridSize;
                if (y > thirdLastRowY) {
                    break; // Arrêter la génération des lignes supplémentaires en dessous de la ligne rouge
                }
                lines.push(
                    <Line
                        key={`horizontal-extra-${j}-${i}`}
                        points={[0, y, stageWidth, y]}
                        stroke={gridColor}
                        opacity={0.5} // Opacité réduite pour indiquer qu'elles sont non interactives
                        listening={false} // Désactiver l'écoute des événements pour ces lignes
                    />
                );
            }
        }
        return lines;
    };

    // Fonction pour générer les lignes verticales du quadrillage
    const generateVerticalLines = () => {
        let lines = [];
        // Ajouter la ligne rouge (4ème colonne)
        lines.push(
            <Line
                key={`vertical-red`}
                points={[redLineX, 0, redLineX, stageHeight]}
                stroke="red"
            />
        );

        // Ajouter les lignes verticales à droite de la ligne rouge
        for (let i = 0; i <= numCols; i++) {
            const x = i * n;
            if (x > redLineX) {
                lines.push(
                    <Line
                        key={`vertical-${i}`}
                        points={[x, 0, x, stageHeight]}
                        stroke={gridColor}
                    />
                );
            }
        }
        return lines;
    };

    const handleStageClick = (e) => {
        const stage = e.target.getStage();
        const { x, y } = stage.getPointerPosition();
        const newX = Math.floor(x / xInterval); // Calcul de la colonne la plus proche
        const newY = Math.floor(y / yInterval); // Calcul de la ligne la plus proche

        // Calcul des coordonnées réelles du point central de la cellule sélectionnée
        const centerX = newX * xInterval;
        const centerY = newY * yInterval;

        // Mettre à jour l'état dernierPoint avec les coordonnées du centre de la cellule
        console.log("x:", newX, " y:", newY)
        setDernierPoint({ x: centerX, y: centerY });

        // Mettre à jour la case correspondante dans la matrice plateau
        const newPlateau = plateau.map((row, rowIndex) =>
            row.map((value, colIndex) => (rowIndex === newY && colIndex === newX ? 1 : value))
        );

        // Mettre à jour l'état plateau avec la nouvelle matrice
        setPlateau(newPlateau);

        // Appel de la fonction avec les données à envoyer
        //sendDataToServer(newPlateau, { x: newX, y: newY });

    };



    const sendDataToServer = async (plateau, dernierPoint) => {
        try {
            //console.log("aaaaaaaaaaaaaaa");

            const response = await axios.put("https://localhost:44356/api/Game/ProcessData",
                JSON.stringify(dernierPoint), // Convertir en JSON
                {
                    headers: {
                        'Content-Type': 'application/json' // Définir le type de contenu
                    }
                }
            );

            //console.log(response.data);
            //console.log("aaaaaaafsdfsaaa");
            //console.log("--------------", typeof(JSON.stringify(plateau)), "--------------");

            const response2 = await axios.put("https://localhost:44356/api/Game/ProcessMat",
                JSON.stringify(plateau), // Convertir en JSON
                {
                    headers: {
                        'Content-Type': 'application/json' // Définir le type de contenu
                    }
                }
            );

            //console.log("bbbbbbbbbbbbbbb");
            //console.log(response2.data);

        } catch (error) {
            console.error('Une erreur s\'est produite lors de l\'envoi des données au serveur :', error);
        }
    };

    return (
        <div className="grid-container">
            <Stage width={stageWidth} height={stageHeight} onClick={handleStageClick} >
                <Layer>
                    {/* Quadrillage horizontal */}
                    {generateHorizontalLines()}
                    {/* Quadrillage vertical */}
                    {generateVerticalLines()}
                    {/* Point */}
                    <Circle
                        x={dernierPoint.x}
                        y={dernierPoint.y}
                        radius={5}
                        fill="red"
                        draggable
                    />
                </Layer>
            </Stage>
        </div>
    );
};

export default Cahier;
