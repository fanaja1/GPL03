import React, { createContext, useState, useContext } from 'react';

const MusicContext = createContext();

//hook personnalisé
export const useMusic = () => {
  return useContext(MusicContext);
};

export const MusicProvider = ({ children }) => { //composant qui fournit le contexte a ses enfants
  const [musicSrc, setMusicSrc] = useState('/audio/battleThemeA.mp3');

  return (
    <MusicContext.Provider value={{ musicSrc, setMusicSrc }}>
      {children}
    </MusicContext.Provider>
  );
};
