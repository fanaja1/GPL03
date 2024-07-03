import React, { useState } from 'react';
import Page from './Page';

const App = () => {
    const numRows = 22;
    const numCols = 15;
    const [plateau, setPlateau] = useState(Array.from({ length: 1 + numRows + 1 }, () => Array(1 + numCols + 1).fill(0)));

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{
                width: '700px', // Largeur fixe
                height: '500px', // Hauteur fixe
                overflow: 'auto', // Ajouter des barres de défilement si le contenu dépasse
                border: '1px solid #ddd', // Bordure pour mieux visualiser le conteneur
                padding: '10px', // Espacement interne pour l'esthétique
                display: 'flex', // Utiliser Flexbox pour le centrage
                justifyContent: 'center', // Centrer horizontalement
                marginRight: '20px' // Espacement entre les éléments
            }}>
                <Page numRows={numRows - 1} numCols={numCols - 1} plateau={plateau} setPlateau={setPlateau} />
            </div>
        </div>
    );
};

export default App;
