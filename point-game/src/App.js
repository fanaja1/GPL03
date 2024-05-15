import React, { useState } from 'react';
import Cahier from './Cahier';

const App = () => {
    const [plateau, setPlateau] = useState(Array.from({ length: 10 }, () => Array(10).fill(0)));

    // Fonction d'affichage de la matrice
    const renderMatrix = (matrix) => {
        return (
            <table>
                <tbody>
                    {matrix.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((value, colIndex) => (
                                <td key={`${rowIndex}-${colIndex}`} style={{ border: '1px solid black', padding: '5px' }}>
                                    {value}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ marginRight: '20px' }}>
                <Cahier plateau={plateau} setPlateau={setPlateau} />
            </div>
            <div>
                <h2>Matrice Plateau:</h2>
                {renderMatrix(plateau)}
            </div>
        </div>
    );
};

export default App;
