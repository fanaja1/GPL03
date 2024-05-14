import React from 'react';
import { Stage, Layer, Line, Text, Circle } from 'react-konva';

const Cahier = ({ plateau, setPlateau }) => {
    const n = 10; // Taille de la grille
    const width = 500;
    const height = 500;
    const xInterval = width / n;
    const yInterval = height / n;

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
            </Layer>
        </Stage>
    );
};

export default Cahier;
