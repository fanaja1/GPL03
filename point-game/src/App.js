import React, { useState } from 'react';
import Home from './page/Accueil.js';
import NotFound from './page/notFound.js'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Param from './page/param.js';

const App = () => {
    //const numRows = 8;
    //const numCols = 15;
    //const [plateau, setPlateau] = useState(Array.from({ length: 1 + numRows + 1 }, () => Array(1 + numCols + 1).fill(0)));
    
    return (
        <Router>
            <Routes>
                <Route path="*" element={<NotFound/>}></Route>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/parametrage" element={<Param/>}></Route>
            </Routes>
        </Router>
    );
};

export default App;
