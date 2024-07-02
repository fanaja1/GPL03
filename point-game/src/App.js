import React, { useState } from 'react';
import Page from './Page';

const App = () => {
    const numRows = 15;
    const numCols = 15;
    const [plateau, setPlateau] = useState(Array.from({ length: 1 + numRows + 1 }, () => Array(1 + numCols + 1).fill(0)));

    //Fonction d'affichage de la matrice <Cahier plateau={plateau} setPlateau={setPlateau} />
    const renderMatrix = (matrix) => {/*
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
        ); */
    };

    
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ marginRight: '20px' }}>
                <Page numRows={numRows - 1} numCols={numCols - 1} plateau={plateau} setPlateau={setPlateau} />
            </div>
            <div>
                {renderMatrix(plateau)}
            </div>
        </div>
    );
};

export default App;
