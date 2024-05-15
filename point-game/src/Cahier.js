import React, { useState } from 'react';
import axios from 'axios';
import { Stage, Layer, Line, Circle } from 'react-konva';

const Cahier = ({ plateau, setPlateau }) => {
    const n = 10; // Taille de la grille
    const width = 500;
    const height = 500;
    const xInterval = width / n;
    const yInterval = height / n;
    const [dernierPoint, setDernierPoint] = useState(null);

    const createGraduations = (start, end, interval, vertical = false) => {
        const graduations = [];
        for (let i = start; i <= end; i += interval) {
            if (vertical) {
                graduations.push(<Line key={`graduation-y-${i}`} points={[i, 0, i, height]} stroke="#ccc" strokeWidth={1} />);
            } else {
                graduations.push(<Line key={`graduation-x-${i}`} points={[0, i, width, i]} stroke="#ccc" strokeWidth={1} />);
            }
        }
        return graduations;
    };

    const handleClick = (e) => {
        const stage = e.target.getStage();
        const { x, y } = stage.getPointerPosition();
        const newX = Math.floor(x / xInterval);
        const newY = Math.floor(y / yInterval);

        // Mettre à jour la case correspondante dans la matrice plateau
        const newPlateau = plateau.map((row, rowIndex) =>
            row.map((value, colIndex) => (rowIndex === newY && colIndex === newX ? 1 : value))
        );

        // Mettre à jour l'état plateau avec la nouvelle matrice
        setPlateau(newPlateau);

        // Mettre à jour l'état dernierPoint avec les coordonnées du dernier point
        setDernierPoint({ x: (newX + 0.5) * xInterval, y: (newY + 0.5) * yInterval });

        //console.log("click " + newX + " " + newY);

        // Appel de la fonction avec les données à envoyer
        sendDataToServer(newPlateau, { x: newX, y: newY });
    };

    const sendDataToServer = async (plateau, dernierPoint) => {
        try {
            console.log("--------------");// plateau);
            console.log("aaaaaaafsdfsaaa");
            console.log();
            const response = await axios.put("http://localhost:5001/api/Game", {
                plateau: JSON.stringify(plateau),
                dernierPoint: dernierPoint
            });
            console.log("aaaaaaaaaaaaaaa");
            console.log(response.data);
        } catch (error) {
            console.error('Une erreur s\'est produite lors de l\'envoi des données au serveur :', error);
        }
    };

    return (
        
        <Stage width={width} height={height} onClick={handleClick}>
            <Layer>
                {createGraduations(0, width, xInterval)}
                {createGraduations(0, height, yInterval, true)}
                {plateau.map((row, rowIndex) =>
                    row.map((value, colIndex) => (
                        value === 1 && (
                            <Circle
                                key={`${rowIndex}-${colIndex}`}
                                x={(colIndex + 0.5) * xInterval}
                                y={(rowIndex + 0.5) * yInterval}
                                radius={Math.min(xInterval, yInterval) / 4}
                                fill="red"
                            />
                        )
                    ))
                )}
                {dernierPoint && (
                    <Circle
                        x={dernierPoint.x}
                        y={dernierPoint.y}
                        radius={Math.min(xInterval, yInterval) / 4}
                        fill="blue"
                    />
                )}
            </Layer>
        </Stage>
        
    );
};

export default Cahier;
