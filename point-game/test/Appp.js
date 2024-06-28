import React, { useState } from 'react';
import { Stage, Layer, Line, Circle } from 'react-konva';
import './App.css';

function Grid() {
  const gridSize = 40; // Taille des cases du quadrillage
  const gridColor = '#cccccc'; // Couleur du quadrillage
  const stageWidth = 1000; // Largeur de la scène
  const stageHeight = 700; // Hauteur de la scène
  const numCols = Math.ceil(stageWidth / gridSize); // Nombre de colonnes
  const numRows = Math.ceil(stageHeight / gridSize); // Nombre de lignes

  const [pointPosition, setPointPosition] = useState({ x: 0, y: 0 });

  // Calcul de l'espacement très proche (0.1 mm)
  const extraSpacing = 0.25; // en mm
  const extraGridSize = gridSize * extraSpacing;

  // Position en pixels de la ligne rouge (4ème colonne)
  const redLineX = 4 * gridSize;

  // Position en pixels de la 3ème dernière ligne horizontale rouge
  const thirdLastRowY = (numRows - 2) * gridSize;

  // Fonction pour générer les lignes horizontales du quadrillage
  const generateHorizontalLines = () => {
    let lines = [];
    for (let i = 0; i <= numRows; i++) {
      const y = i * gridSize;
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
        const y = i * gridSize + j * extraGridSize;
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
      const x = i * gridSize;
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

  const handleStageClick = (event) => {
    const { offsetX, offsetY } = event.evt;
    const x = Math.round(offsetX / gridSize) * gridSize;
    const y = Math.round(offsetY / gridSize) * gridSize;

    // Vérifier si le clic est à gauche de la ligne rouge verticale
    if (x < redLineX) {
      // Action à prendre lorsque le clic est à gauche de la ligne rouge
      console.log('Clic à gauche de la ligne rouge verticale. Opération annulée.');
      return; // Arrêter la fonction ici pour empêcher l'ajout du point
    }

    // Vérifier si le clic est en dessous de la ligne rouge horizontale
    if (y > thirdLastRowY) {
      // Action à prendre lorsque le clic est en dessous de la ligne rouge
      console.log('Clic en dessous de la ligne rouge horizontale. Opération annulée.');
      return; // Arrêter la fonction ici pour empêcher l'ajout du point
    }

    // Mettre à jour la position du point seulement si le clic est à droite de la ligne rouge verticale et au-dessus de la ligne rouge horizontale
    setPointPosition({ x, y });
  };

  return (
    <div className="grid-container">
      <Stage width={stageWidth} height={stageHeight} onClick={handleStageClick}>
        <Layer>
          {/* Quadrillage horizontal */}
          {generateHorizontalLines()}
          {/* Quadrillage vertical */}
          {generateVerticalLines()}
          {/* Point */}
          <Circle
            x={pointPosition.x}
            y={pointPosition.y}
            radius={5}
            fill="red"
            draggable
          />
        </Layer>
      </Stage>
    </div>
  );
}

export default Grid;
